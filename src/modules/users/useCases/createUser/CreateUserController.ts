import { Request, Response, NextFunction } from 'express';

import { CreateUserUseCase } from './CreateUserUseCase';
import { IError } from '../../../../helpers/interfaces';

class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, username, password } = req.body;

    try {
      const user = await this.createUserUseCase.execute({
        email,
        username,
        password,
      });

      return res.status(201).json(user);
    } catch (err) {
      const error: IError = {
        statusCode: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected error while creating user',
      };

      next(error);
    }
  }
}

export { CreateUserController };
