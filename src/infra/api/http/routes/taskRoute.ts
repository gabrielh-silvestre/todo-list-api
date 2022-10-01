import express from "express";

import { createTaskController } from "@useCases/task/create";
import { deleteTaskController } from "@useCases/task/delete";
import { getAllTasksController } from "@useCases/task/findAll";
import { updateTaskController } from "@useCases/task/update";
import { authMiddleware } from "../middleware/auth";
import { TaskValidator } from "../middleware/Validators/TaskValidator";

const taskRouter = express.Router();

taskRouter.use(authMiddleware.handle);

taskRouter.get("/", getAllTasksController.handle);

taskRouter.post(
  "/",
  TaskValidator.createValidation,
  createTaskController.handle
);

taskRouter.delete("/:id", deleteTaskController.handle);

taskRouter.put(
  "/:id",
  TaskValidator.updateValidation,
  updateTaskController.handle
);

export { taskRouter };
