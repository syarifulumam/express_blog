import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
//ke controller
userRouter.use(authMiddleware);
userRouter.get("/api/users/current", userController.get);

export { userRouter };
