import { Post, PrismaClient, User, UserLike } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import 'dotenv/config';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

interface UserSession {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    userSession: UserSession;
    post: Post
  }
}

const prefix = '/api';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`)
})

async function verifyPasswordUser(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })
    if (!user) return null;
    const success = await bcrypt.compare(password, user.password);
    return success ? user : null;
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;
    if (!token) {
    return res.status(401).json({ message: 'Not logged in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as UserSession;
    req.userSession = decoded
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

async function findPost(req: Request, res: Response, next: NextFunction) {
    const { postId } = req.body;
    if (!postId) {
        return res.status(404).json({ message: "Post ID missing in body." })
    }
    const post = await prisma.post.findFirst({
        where: {
            id: postId
        }
    });
    if (!post) {
        return res.status(404).json({ message: "Post not found." })
    }
    req.post = post;
    next();
}

app.post(prefix + '/register', async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(String(password), 10);
    try {
        const existingUser = await prisma.user.findFirst({ 
            where: {
                username: username.toLowerCase()
            }
        })
        if (existingUser) {
            res.status(400).json({ error: "This user already exists." });
            return;
        }
        await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        });
        return res.status(200).json({ message: "User created successfully" });
    } catch(err: any) {
        console.log(`Couldn't create user ${username}: ${err}`)
        return res.status(500).json({ error: "Unexpected error occurred on the server." });
    }
});

app.post(prefix + '/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await verifyPasswordUser(email, password);
    if (!user) {
        res.status(403).json({ message: "Wrong email or password." });
        return;
    }
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET ?? "",
        { expiresIn: '30d' }
    );

    res.cookie('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({ message: "Logged successfully" })
});

app.get(prefix + '/posts', async (req: Request, res: Response) => {
    const posts = await prisma.post.findMany();
    return res.status(200).json({ posts })
});


app.post(prefix + '/post/like', verifyToken, findPost, async (req: Request, res: Response) => {
    const user = req.userSession;
    const post = req.post;
    const likedPost = await prisma.userLike.findFirst({
        where: {
            userId: user.id,
            postId: post.id
        }
    })
    if (likedPost) {
       return res.status(401).json({ message: "You already liked this post." });
    }
    try {
        await prisma.userLike.create({
            data: {
                userId: user.id,
                postId: post.id
            }
        })
        return res.status(200).json({ message: "Post liked successfully" });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Can't like the post" });
    }
});

app.delete(prefix + '/post/like', verifyToken, findPost, async (req: Request, res: Response) => {
    const user = req.userSession;
    const post = req.post;
    const likedPost = await prisma.userLike.findFirst({
        where: {
            userId: user.id,
            postId: post.id
        }
    })
    if (!likedPost) {
        return res.status(401).json({ message: "You didn't like this post." });
    }
    try {
        await prisma.userLike.delete({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId: post.id
                }
            }
        })
        return res.status(200).json({ message: "Post unliked successfully" });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Can't unlike the post" });
    }
});

app.get(prefix + '/user/likedPosts', verifyToken, async (req: Request, res: Response) => {
    const user = req.userSession;
    const likesPosts = await prisma.userLike.findMany({
        where: {
            userId: user.id
        }
    });
    const postIds = likesPosts.map(like => like.postId);

    const posts = await prisma.post.findMany({
        where: {
            id: { in: postIds }
        }
    });
    return res.status(200).json({ posts });
});