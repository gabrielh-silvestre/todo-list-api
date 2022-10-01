import express from "express";

import { TaskControllerFactory } from "@infra/api/controller/task/factory/TaskController.factory";
import { authMiddleware } from "../middleware/auth";
import { TaskValidator } from "../middleware/Validators/TaskValidator";

const taskRouter = express.Router();

taskRouter.use(authMiddleware.handle);

taskRouter.get("/", TaskControllerFactory.getAll());

taskRouter.post(
  "/",
  TaskValidator.createValidation,
  TaskControllerFactory.create()
);

taskRouter.delete("/:id", TaskControllerFactory.delete());

taskRouter.put(
  "/:id",
  TaskValidator.updateValidation,
  TaskControllerFactory.update()
);

export { taskRouter };
