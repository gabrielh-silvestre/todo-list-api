import type { Handler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { GetAllTasksUseCase } from "@useCases/task/findAll/GetAllTasksUseCase";

class GetAllTasksController {
  constructor(private getAllTasksUseCase: GetAllTasksUseCase) {}

  handle: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

    try {
      const data = await this.getAllTasksUseCase.execute({
        userId,
      });

      res.status(StatusCodes.OK).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export { GetAllTasksController };
