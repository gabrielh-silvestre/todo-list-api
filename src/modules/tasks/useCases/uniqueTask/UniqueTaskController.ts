import { NextFunction, Request, Response } from 'express';
import { IError } from '../../../../@types/interfaces';
import { errorStatusCode } from '../../../../utils/errorsCode';
import { UniqueTaskUseCase } from './UniqueTaskUseCase';

class UniqueTaskController {
  constructor(private uniqueTaskUseCase: UniqueTaskUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { title, userId } = req.body;

    try {
      const response = await this.uniqueTaskUseCase.execute(userId, title);

      if (response.statusCode === 'CONFLICT') {
        const { statusCode, message } = response;
        return res.status(errorStatusCode[statusCode]).json({ message });
      }

      next();
    } catch (err) {
      const error: IError = {
        statusCode: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected error while checking task uniqueness',
      };

      next(error);
    }
  };
}

export { UniqueTaskController };
