import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { IUserValidation } from '../../@types/validation/IUser';
import { errorStatusCode } from '../../utils/errorsCode';

class UserValidation implements IUserValidation {
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

  createValidation = (req: Request, res: Response, next: NextFunction) => {
    const { error } = this.createUserSchema.validate(req.body);

    if (error) {
      return res.status(errorStatusCode.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }

    next();
  };

  loginValidation = (req: Request, res: Response, next: NextFunction) => {
    const { error } = this.loginUserSchema.validate(req.body);

    if (error) {
      return res.status(errorStatusCode.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }

    next();
  };

  athenticationValidation = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { error } = this.authorizationSchema.validate(req.headers);

    if (error) {
      return res.status(errorStatusCode.BAD_REQUEST).json({
        message: error.details[0].message,
      });
    }

    next();
  };
}

export const userValidation = new UserValidation();
