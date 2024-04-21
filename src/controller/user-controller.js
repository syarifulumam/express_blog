import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    //ke service untuk memasukan data ke database
    const result = await userService.register(req.body);
    //jika berhasil kembalikan hasilnya ke browser
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    //jika error akan pergi ke errorMiddleware yang ada di web.js
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await userService.login(req.body);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ data: accessToken });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await userService.get(req.user.id);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  get,
};
