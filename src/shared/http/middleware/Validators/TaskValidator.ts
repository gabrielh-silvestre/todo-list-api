import { celebrate, Joi, Segments } from "celebrate";

class TaskValidator {
  private static readonly CREATE_VALIDATOR = celebrate({
    [Segments.BODY]: Joi.object({
      title: Joi.string().min(5).max(20).required(),
      description: Joi.string().max(120),
      userId: Joi.string().required(),
    }),
  });
  private static readonly UPDATE_VALIDATOR = celebrate({
    [Segments.BODY]: Joi.object({
      title: Joi.string().min(5).max(20).required(),
      description: Joi.string().max(120).allow(null).required(),
      status: Joi.string().valid("TODO", "IN_PROGRESS", "DONE").required(),
      userId: Joi.string().required(),
    }),
  });

  static get createValidation() {
    return TaskValidator.CREATE_VALIDATOR;
  }

  static get updateValidation() {
    return TaskValidator.UPDATE_VALIDATOR;
  }
}

export { TaskValidator };
