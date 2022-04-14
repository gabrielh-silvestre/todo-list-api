import { NextFunction, Request, Response } from 'express';
import { IError } from '../../../../@types/interfaces';
import { successStatusCode } from '../../../../utils/successCode';
import { CreateTaskUseCase } from './CreateTaskUseCase';

class CreateTaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase) {}

  handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    const { title, description, userId } = req.body;
    const newTask = { title, description, userId };

    try {
      const { statusCode, data } = await this.createTaskUseCase.execute(
        newTask
      );

      return res.status(successStatusCode[statusCode]).json(data);
    } catch (err) {
      const error: IError = {
        statusCode: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpect error while creating task',
      };

      next(error);
    }
  };
}

export { CreateTaskController };
