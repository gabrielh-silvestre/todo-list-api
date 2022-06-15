import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from 'restify-errors';
import Joi from 'joi';

import { ITaskValidator } from '../../@types/interfaces';
import { errorFormatter } from '../../utils';

class TaskValidator implements ITaskValidator {
  private createTaskSchema: Joi.ObjectSchema;
  private updateTaskSchema: Joi.ObjectSchema;

  constructor() {
    this.createTaskSchema = Joi.object({
      title: Joi.string().min(5).max(20).required(),
      description: Joi.string().max(120),
      userId: Joi.string().required(),
    });

    this.updateTaskSchema = Joi.object({
      title: Joi.string().min(5).max(20).required(),
      description: Joi.string().max(120).allow(null).required(),
      status: Joi.string().valid('TODO', 'IN_PROGRESS', 'DONE').required(),
      userId: Joi.string().required(),
    });
  }

  createValidation = (req: Request, _res: Response, next: NextFunction) => {
    const { error } = this.createTaskSchema.validate(req.body);

    if (error) {
      const err = errorFormatter(error.details[0].message);
      return next(err);
    }

    next();
  };

  updateValidation = (req: Request, _res: Response, next: NextFunction) => {
    const { error } = this.updateTaskSchema.validate(req.body);

    if (error) {
      const err = errorFormatter(error.details[0].message);
      return next(err);
    }

    next();
  };
}

export const taskValidator = new TaskValidator();
