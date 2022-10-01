import express from "express";

import { createTaskController } from "../../../modules/tasks/useCases/createTask";
import { deleteTaskController } from "../../../modules/tasks/useCases/deleteTask";
import { getAllTasksController } from "../../../modules/tasks/useCases/getAllTasks";
import { updateTaskController } from "../../../modules/tasks/useCases/updateTask";
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
