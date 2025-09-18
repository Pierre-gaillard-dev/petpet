import { Post, PrismaClient, User } from "@prisma/client"
import express, { NextFunction, Request, Response } from "express"
import "dotenv/config"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import cors from "cors"
import multer from "multer"
import fs from "fs/promises"
import path from "path"

interface UserSession {
  id: number
  username: string
  iat: number
  exp: number
}

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname
    cb(null, uniqueName)
  },
})

const prefix = "/api"

const prisma = new PrismaClient()

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

const upload = multer({ storage })
app.use(express.json())
app.use(cookieParser())
app.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`)
})

async function verifyPasswordUser(
  email: string,
  password: string
): Promise<User | null> {
  // Validate input parameters
  if (!email || !password) {
    return null
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (!user || !user.password) {
    return null
  }

  try {
    const success = await bcrypt.compare(password, user.password)
    return success ? user : null
  } catch (error) {
    console.error("Error comparing passwords:", error)
    return null
  }
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ error: "Not logged in." })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? ""
    ) as UserSession
    req.userSession = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" })
  }
}

async function findPost(req: Request, res: Response, next: NextFunction) {
  const { postId } = req.body
  if (!postId) {
    return res.status(404).json({ error: "Post ID missing in body." })
  }
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
    },
  })
  if (!post) {
    return res.status(404).json({ error: "Post not found." })
  }
  req.post = post
  next()
}

app.post(prefix + "/register", async (req: Request, res: Response) => {
  const { email, username, password } = req.body

  // Validate required fields
  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ error: "Email, username, and password are required." })
  }

  const hashedPassword = await bcrypt.hash(String(password), 10)
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username.toLowerCase(),
      },
    })
    if (existingUser) {
      res.status(400).json({ error: "This user already exists." })
      return
    }
    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    })
    return res.status(200).json({ message: "User created successfully" })
  } catch (err: any) {
    console.log(`Couldn't create user ${username}: ${err}`)
    return res
      .status(500)
      .json({ error: "Unexpected error occurred on the server." })
  }
})

app.post(prefix + "/login", async (req: Request, res: Response) => {
  const { email, password } = req.body

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." })
  }

  const user = await verifyPasswordUser(email, password)
  if (!user) {
    res.status(403).json({ message: "Wrong email or password." })
    return
  }
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET ?? "",
    { expiresIn: "30d" }
  )

  res.cookie("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })

  return res.status(200).json({
    message: "Logged successfully",
    user: { id: user.id, username: user.username, email: user.email },
  })
})

app.get(prefix + "/me", verifyToken, async (req: Request, res: Response) => {
  const user = req.userSession
  return res.status(200).json({ user })
})

app.get(prefix + "/posts", async (req: Request, res: Response) => {
  const postsData = []
  const posts = await prisma.post.findMany()
  for (const post of posts) {
    const like = await prisma.userLike.count({
      where: {
        postId: post.id,
      },
    })
    const user = await prisma.user.findFirst({
      where: {
        id: post.userId,
      },
    })
    postsData.push({
      ...post,
      like,
      user: {
        id: user?.id,
        username: user?.username,
      },
    })
  }
  return res.status(200).json({ posts: postsData })
})

app.post(
  prefix + "/post",
  verifyToken,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const user = req.userSession
    const { description } = req.body
    const image = req.file
    if (!image) {
      return res.status(400).json({ error: "Missing file image!" })
    }
    const now = new Date()
    const post = await prisma.post.create({
      data: {
        image_path: "/public/" + image.filename,
        description,
        createdAt: now,
        updatedAt: now,
        userId: user!.id,
      },
    })

    return res.status(200).json({ post })
  }
)

app.delete(
  prefix + "/post",
  verifyToken,
  findPost,
  async (req: Request, res: Response) => {
    const post = req.post
    const user = req.userSession
    if (post!.userId != user!.id) {
      return res.status(401).json({ error: "Unauthorized." })
    }

    try {
      await fs.unlink(post!.image_path)
      await prisma.post.delete({
        where: {
          id: post!.id,
        },
      })
    } catch (err) {
      console.log(`Can't delete post ${post!.id}: ${err}`)
      return res.status(500).json({ error: "Post can't be deleted." })
    }

    return res.status(200).json({ message: "Post deleted successfully." })
  }
)

app.get("/public/:fileName", async (req: Request, res: Response) => {
  const fileName = req.params.fileName
  if (!fileName) {
    return res.status(404).json({ error: "File name missing!" })
  }
  const filePath = path.join(process.cwd(), "uploads", fileName)
  try {
    await fs.access(filePath)
    return res.sendFile(filePath)
  } catch (err) {
    return res.status(404).json({ error: "File not found" })
  }
})

app.post(
  prefix + "/post/like",
  verifyToken,
  findPost,
  async (req: Request, res: Response) => {
    const user = req.userSession
    const post = req.post
    const likedPost = await prisma.userLike.findFirst({
      where: {
        userId: user!.id,
        postId: post!.id,
      },
    })
    if (likedPost) {
      return res.status(401).json({ message: "You already liked this post." })
    }
    try {
      await prisma.userLike.create({
        data: {
          userId: user!.id,
          postId: post!.id,
        },
      })
      return res.status(200).json({ message: "Post liked successfully" })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: "Can't like the post" })
    }
  }
)

app.delete(
  prefix + "/post/like",
  verifyToken,
  findPost,
  async (req: Request, res: Response) => {
    const user = req.userSession
    const post = req.post
    if (!post) {
      return res.status(404).json({ error: "Post not found." })
    }

    const likedPost = await prisma.userLike.findFirst({
      where: {
        userId: user!.id,
        postId: post!.id,
      },
    })
    if (!likedPost) {
      return res.status(401).json({ message: "You didn't like this post." })
    }
    try {
      await prisma.userLike.delete({
        where: {
          userId_postId: {
            userId: user!.id,
            postId: post!.id,
          },
        },
      })
      return res.status(200).json({ message: "Post unliked successfully" })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: "Can't unlike the post" })
    }
  }
)

app.get(
  prefix + "/user/likedPosts",
  verifyToken,
  async (req: Request, res: Response) => {
    const user = req.userSession
    const likesPosts = await prisma.userLike.findMany({
      where: {
        userId: user!.id,
      },
    })
    const postIds = likesPosts.map(like => like.postId)

    const posts = await prisma.post.findMany({
      where: {
        id: { in: postIds },
      },
    })
    return res.status(200).json({ posts })
  }
)

app.get(prefix + '/user/notification', verifyToken, async (req: Request, res: Response) => {
    const user = req.userSession;
    const results = await prisma.post.findMany({
        where: { userId: user!.id },
        select: {
            id: true,
            likedBy: {
                where: { 
                    userId: { not: user!.id }
                },
                select: {
                    userId: true,
                    user: { select: { username: true } }
                }
            }
        }
    })
    const notifications = results.flatMap(post => {
        return post.likedBy.map(like => ({
            postId: post.id,
            userId: like.userId,
            username: like.user.username
        }))
    })
    return res.status(200).json({ notifications });
});
