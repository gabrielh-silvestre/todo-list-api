import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { DeleteTaskUseCase } from './DeleteTaskUseCase';

class DeleteTaskController {
  constructor(private deleteTaskUseCase: DeleteTaskUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
      const { statusCode } = await this.deleteTaskUseCase.execute({
        userId,
        id,
      });

      return res.status(StatusCodes[statusCode]).end();
    } catch (err) {
      next(err);
    }
  };
}

export { DeleteTaskController };
