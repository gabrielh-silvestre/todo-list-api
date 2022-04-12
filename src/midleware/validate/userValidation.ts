import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { IUserValidation } from '../../@types/validation/IUser';

class UserValidation implements IUserValidation {
  private createUserSchema: Joi.ObjectSchema;

  constructor() {
    this.createUserSchema = Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().min(3).max(10).required(),
      password: Joi.string().min(6).max(16).alphanum().required(),
    });
  }

  createValidation = (req: Request, res: Response, next: NextFunction) => {
    const { error } = this.createUserSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        statusCode: 'BAD_REQUEST',
        message: error.details[0].message,
      });
    }

    next();
  };
}

export const userValidation = new UserValidation();
