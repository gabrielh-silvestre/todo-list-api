import { Request, Response, NextFunction } from 'express';

import { CreateUserUseCase } from './CreateUserUseCase';
import { IError, ISuccess } from '../../../../@types/interfaces';
import { successStatusCode } from '../../../../utils/successCode';

class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { email, username, password } = req.body;

    try {
      const { statusCode, data } = (await this.createUserUseCase.execute({
        email,
        username,
        password,
      })) as ISuccess<string>;

      return res.status(successStatusCode[statusCode]).json({ token: data });
    } catch (err) {
      next(err);
    }
  };
}

export { CreateUserController };
