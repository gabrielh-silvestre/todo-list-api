import { NextFunction, Request, Response } from 'express';

import { IError } from '../../../../@types/statusCodes';
import { errorStatusCode } from '../../../../utils/errorsCode';

import { UniqueUserUseCase } from './UniqueUserUseCase';

class UniqueUserController {
  constructor(private uniqueUserUseCase: UniqueUserUseCase) {}

  handle = async (request: Request, response: Response, next: NextFunction) => {
    const { email } = request.body;

    try {
      const result = await this.uniqueUserUseCase.execute(email);
      
      if (result.statusCode === 'CONFLICT') {
        const { statusCode, message } = result;
        return response.status(errorStatusCode[statusCode]).json({ message });
      }

      next();
    } catch (err) {
      const error: IError = {
        statusCode: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected error while checking if user is unique',
      };

      next(error);
    }
  };
}

export { UniqueUserController };
