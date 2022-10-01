import Joi from "joi";
import type { IValidator } from "@domain/shared/validator/validator.interface";
import type { ITask } from "../entity/Task.interface";

export class TaskJoiValidator implements IValidator<ITask> {
  validate(entity: ITask): void | never {
    const validationEntity = {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      userId: entity.userId,
      updatedAt: entity.updatedAt,
    };

    const { error } = Joi.object({
      id: Joi.string().uuid().required(),
      title: Joi.string().min(5).max(20).required(),
      description: Joi.string().max(120).allow(null).required(),
      status: Joi.string().valid("TODO", "IN_PROGRESS", "DONE").required(),
      updatedAt: Joi.date().required(),
      userId: Joi.string().uuid().required(),
    }).validate(validationEntity);

    if (error) {
      throw error;
    }
  }
}
