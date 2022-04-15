import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

import { ITaskValidator } from '../../@types/interfaces';

import { CustomError } from '../../utils/CustomError';

class TaskValidator implements ITaskValidator {
  private createTaskSchema: Joi.ObjectSchema;

  constructor() {
    this.createTaskSchema = Joi.object({
      title: Joi.string().min(5).max(20).required(),
      description: Joi.string().max(120),
      userId: Joi.string().required(),
    });
  }

  createValidation = (req: Request, res: Response, next: NextFunction) => {
    const { error } = this.createTaskSchema.validate(req.body);

    if (error) {
      const err = new CustomError('BAD_REQUEST', error.details[0].message);
      return next(err);
    }

    next();
  };
}

export const taskValidator = new TaskValidator();
