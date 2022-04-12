import Joi from 'joi';
import { TaskStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { ITaskValidator } from '../../@types/interfaces';
import { errorStatusCode } from '../../utils/errorsCode';

class TaskValidator implements ITaskValidator {
  private createTaskSchema: Joi.ObjectSchema;

  constructor() {
    this.createTaskSchema = Joi.object({
      title: Joi.string().min(5).max(20).required(),
      description: Joi.string().max(120),
      userId: Joi.string().required(),
      status: Joi.string().valid(
        TaskStatus.TODO,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DELETED,
        TaskStatus.DONE
      ),
    });
  }

  createValidation = (req: Request, res: Response, next: NextFunction) => {
    const { error } = this.createTaskSchema.validate(req.body);

    if (error) {
      return res.status(errorStatusCode.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }

    next();
  };
}

export const taskValidator = new TaskValidator();
