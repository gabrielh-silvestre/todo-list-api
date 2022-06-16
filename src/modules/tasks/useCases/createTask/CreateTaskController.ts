import { NextFunction, Request, Response } from 'express';

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

      return res.status(statusCode).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export { CreateTaskController };
