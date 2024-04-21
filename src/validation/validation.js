import { ResponseError } from "../error/response-error.js";

const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false, //munculkan semua error inputan
    allowUnknown: false, //abaikan inputan yang tak sesuai
  });
  if (result.error) {
    throw new ResponseError(400, result.error.message);
  } else {
    return result.value;
  }
};

export { validate };
