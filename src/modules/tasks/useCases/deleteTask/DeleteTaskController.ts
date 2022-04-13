import { NextFunction, Request, Response } from 'express';
import { IError } from '../../../../@types/interfaces';
import { successStatusCode } from '../../../../utils/successCode';
import { DeleteTaskUseCase } from './DeleteTaskUseCase';

class DeleteTaskController {
  constructor(private deleteTaskUseCase: DeleteTaskUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
      const { statusCode } = await this.deleteTaskUseCase.execute(userId, id);
      return res.status(successStatusCode[statusCode]).end();
    } catch (err) {
      const error: IError = {
        statusCode: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected error while deleting task',
      };

      next(error);
    }
  };
}

export { DeleteTaskController };
