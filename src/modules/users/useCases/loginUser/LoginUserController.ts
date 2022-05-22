import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ISuccess } from '../../../../@types/interfaces';

import { LoginUserUseCase } from './LoginUserUseCase';

class LoginUserController {
  constructor(private loginUserUseCase: LoginUserUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const { statusCode, data } = (await this.loginUserUseCase.execute({
        email,
        password,
      })) as ISuccess<string>;

      return res.status(StatusCodes[statusCode]).json({ token: data });
    } catch (err) {
      next(err);
    }
  };
}

export { LoginUserController };
