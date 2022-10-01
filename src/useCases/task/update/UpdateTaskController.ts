import type { Handler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { UpdateTaskUseCase } from "./UpdateTaskUseCase";

class UpdateTaskController {
  constructor(private updateTaskUseCase: UpdateTaskUseCase) {}

  handle: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const taskData = { ...req.body, id };

    try {
      const data = await this.updateTaskUseCase.execute(taskData);

      res.status(StatusCodes.OK).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export { UpdateTaskController };
