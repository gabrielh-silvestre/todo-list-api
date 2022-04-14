import { NextFunction, Request, Response } from 'express';
import { IError } from '../../../../@types/interfaces';
import { errorStatusCode } from '../../../../utils/errorsCode';
import { VerifyTaskUseCase } from './VerifyTaskUseCase';

class VerifyTaskController {
  constructor(private verifyTaskUseCase: VerifyTaskUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
      const response = await this.verifyTaskUseCase.execute(userId, id);

      if (response.statusCode === 'NOT_FOUND') {
        const { statusCode, message } = response;
        return res.status(errorStatusCode[statusCode]).json({ message });
      }

      next();
    } catch (err) {
      const error: IError = {
        statusCode: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected error while checking if task exist',
      };

      next(error);
    }
  };
}

export { VerifyTaskController };
