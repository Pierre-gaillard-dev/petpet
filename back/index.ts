import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from "express";
import 'dotenv/config';

const prisma = new PrismaClient();

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`)
})

app.get('/', (request: Request, response: Response) => {
    response.status(200).send("Hello world!");
});