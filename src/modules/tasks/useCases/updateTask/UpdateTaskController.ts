import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UpdateTaskUseCase } from './UpdateTaskUseCase';

class UpdateTaskController {
  constructor(private updateTaskUseCase: UpdateTaskUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, description, status, userId } = req.body;

    try {
      const { statusCode, data } = await this.updateTaskUseCase.execute(
        { userId, id },
        {
          title,
          description,
          status,
        }
      );

      return res.status(StatusCodes[statusCode]).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export { UpdateTaskController };
