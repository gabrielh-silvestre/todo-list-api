import { Request, Response, NextFunction } from 'express';

import { CreateUserUseCase } from './CreateUserUseCase';
import { IError } from '../../../../helpers/interfaces';
import { errorStatusCode } from '../../../../utils/errorsCode';
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
      const result = await this.createUserUseCase.execute({
        email,
        username,
        password,
      });

      if (result.statusCode === 'CONFLICT') {
        const { statusCode, message } = result;
        return res.status(errorStatusCode[statusCode]).json({ message });
      }

      if (result.statusCode === 'CREATED') {
        const { statusCode, data } = result;
        return res.status(successStatusCode[statusCode]).json(data);
      }
    } catch (err) {
      const error: IError = {
        statusCode: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected error while creating user',
      };

      next(error);
    }
  };
}

export { CreateUserController };
