import { celebrate, Joi, Segments } from "celebrate";

class UserValidator {
  private static readonly CREATE_VALIDATOR = celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().min(3).max(10).required(),
      password: Joi.string().min(6).max(16).alphanum().required(),
    }),
  });
  private static readonly LOGIN_VALIDATOR = celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  });

  static get createValidation() {
    return UserValidator.CREATE_VALIDATOR;
  }

  static get loginValidation() {
    return UserValidator.LOGIN_VALIDATOR;
  }
}

export { UserValidator };
