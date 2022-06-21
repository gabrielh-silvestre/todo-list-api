import type { Handler, NextFunction, Request, Response } from 'express';

import type { UpdateTaskUseCase } from './UpdateTaskUseCase';

class UpdateTaskController {
  constructor(private updateTaskUseCase: UpdateTaskUseCase) {}

  handle: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const taskData = { ...req.body, id };

    try {
      const { statusCode, data } = await this.updateTaskUseCase.execute(
        taskData
      );

      return res.status(statusCode).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export { UpdateTaskController };
