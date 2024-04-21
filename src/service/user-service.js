import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (request) => {
  //cek inputan apakah sesuai dengan ketentuan di registerUserValidation
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Email already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      email: true,
      name: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Email or Password wrong");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new ResponseError(401, "Email or Password wrong");
  }

  const { id, email, name } = user;
  //create token
  const accessToken = jwt.sign({ id, email, name }, process.env.ACCESS_TOKEN, {
    expiresIn: "30s",
  });
  const refreshToken = jwt.sign(
    { id, email, name },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "1d",
    }
  );
  // //update token
  await prismaClient.user.update({
    data: {
      refresh_token: refreshToken,
    },
    where: {
      email: loginRequest.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
  return { accessToken: accessToken, refreshToken: refreshToken };
};

const get = async (id) => {
  id = validate(getUserValidation, id);

  const user = await prismaClient.user.findUnique({
    where: {
      id: id,
    },
    select: {
      email: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return user;
};

export default {
  register,
  login,
  get,
};
