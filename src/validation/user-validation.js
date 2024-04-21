import Joi from "joi";

const registerUserValidation = Joi.object({
  email: Joi.string()
    .max(100)
    .required()
    .email({ tlds: { allow: false } }),
  password: Joi.string().max(191).required(),
  name: Joi.string().max(100).required(),
});

const loginUserValidation = Joi.object({
  email: Joi.string()
    .max(100)
    .required()
    .email({ tlds: { allow: false } }),
  password: Joi.string().max(191).required(),
});

const getUserValidation = Joi.number().integer().required();

export { registerUserValidation, loginUserValidation, getUserValidation };
