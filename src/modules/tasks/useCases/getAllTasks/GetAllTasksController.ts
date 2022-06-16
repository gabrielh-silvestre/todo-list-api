import { NextFunction, Request, Response } from 'express';

import { GetAllTasksUseCase } from './GetAllTasksUseCase';

class GetAllTasksController {
  constructor(private getAllTasksUseCase: GetAllTasksUseCase) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    try {
      const { statusCode, data } = await this.getAllTasksUseCase.execute({
        userId,
      });

      return res.status(statusCode).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export { GetAllTasksController };
