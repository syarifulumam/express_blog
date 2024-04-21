import { prismaClient } from "../application/database.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .json({
        errors: "Unauthorized",
      })
      .end();
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        res
          .status(403)
          .json({
            errors: "Forbidden",
          })
          .end();
      }
      req.user = decoded;
      next();
    });
  }
};
