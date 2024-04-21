import express from "express";
import { publicRouter } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import dotenv from "dotenv";
import { userRouter } from "../routes/api.js";

dotenv.config();
export const web = express();
//menerima inputan berupa json
web.use(express.json());
//ke router
web.use(publicRouter);
web.use(userRouter);
//mengelola error
web.use(errorMiddleware);
