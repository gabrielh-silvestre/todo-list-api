import { NextFunction, Request, Response } from 'express';

import { IError } from '../../../../@types/interfaces';

import { LoginUserUseCase } from './LoginUserUseCase';
import { successStatusCode } from '../../../../utils/successCode';
import { errorStatusCode } from '../../../../utils/errorsCode';

class LoginUserController {
  constructor(private loginUserUseCase: LoginUserUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const result = await this.loginUserUseCase.execute({
        email,
        password,
      });

      if (result.statusCode === 'OK') {
        const { statusCode, data } = result;
        return res.status(successStatusCode[statusCode]).json({ token: data });
      }

      const { statusCode, message } = result as IError;
      return res.status(errorStatusCode[statusCode]).json({ message });
    } catch (err) {
      const error: IError = {
        statusCode: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected error while login user',
      };

      next(error);
    }
  };
}

export { LoginUserController };
