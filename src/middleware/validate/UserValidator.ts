import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

import { IUserValidator } from '../../@types/interfaces';

import { CustomError } from '../../utils/CustomError';

class UserValidator implements IUserValidator {
  private createUserSchema: Joi.ObjectSchema;
  private loginUserSchema: Joi.ObjectSchema;
  private authorizationSchema: Joi.ObjectSchema;

  constructor() {
    this.createUserSchema = Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().min(3).max(10).required(),
      password: Joi.string().min(6).max(16).alphanum().required(),
    });

    this.loginUserSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    this.authorizationSchema = Joi.object({
      authorization: Joi.string().required(),
    });
  }

  createValidation = (req: Request, _res: Response, next: NextFunction) => {
    const { error } = this.createUserSchema.validate(req.body);

    if (error) {
      const err = new CustomError('BAD_REQUEST', error.details[0].message);
      return next(err);
    }

    next();
  };

  loginValidation = (req: Request, _res: Response, next: NextFunction) => {
    const { error } = this.loginUserSchema.validate(req.body);

    if (error) {
      const err = new CustomError('BAD_REQUEST', error.details[0].message);
      return next(err);
    }

    next();
  };
}

export const userValidator = new UserValidator();
