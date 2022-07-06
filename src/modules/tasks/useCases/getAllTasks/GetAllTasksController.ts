import type { Handler, NextFunction, Request, Response } from "express";

import type { GetAllTasksUseCase } from "./GetAllTasksUseCase";

class GetAllTasksController {
  constructor(private getAllTasksUseCase: GetAllTasksUseCase) {}

  handle: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    try {
      const { statusCode, data } = await this.getAllTasksUseCase.execute({
        userId,
      });

      res.status(statusCode).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export { GetAllTasksController };
