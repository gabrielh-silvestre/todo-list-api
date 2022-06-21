import type { Handler, NextFunction, Request, Response } from 'express';

import type { CreateTaskUseCase } from './CreateTaskUseCase';

class CreateTaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase) {}

  handle: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, userId } = req.body;
    const newTask = { title, description: description || null, userId };

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
