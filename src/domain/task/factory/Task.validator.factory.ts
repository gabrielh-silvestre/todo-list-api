import type { IValidator } from "@domain/shared/validator/validator.interface";
import type { ITask } from "../entity/Task.interface";

import { TaskJoiValidator } from "../validator/Task.joi.validator";

export class TaskValidatorFactory {
  static create(): IValidator<ITask> {
    return new TaskJoiValidator();
  }
}