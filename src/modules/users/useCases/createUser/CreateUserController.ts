import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CreateUserUseCase } from './CreateUserUseCase';

class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, username, password } = req.body;

    try {
      const { statusCode, data } = await this.createUserUseCase.execute({
        email,
        username,
        password,
      });

      return res.status(StatusCodes[statusCode]).json({ token: data });
    } catch (err) {
      next(err);
    }
  };
}

export { CreateUserController };
