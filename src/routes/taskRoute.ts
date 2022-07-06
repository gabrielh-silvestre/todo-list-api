import express from "express";

import { authMiddleware } from "../middleware/auth";
import { TaskValidator } from "../middleware/validate/TaskValidator";

import { createTaskController } from "../modules/tasks/useCases/createTask";
import { deleteTaskController } from "../modules/tasks/useCases/deleteTask";
import { updateTaskController } from "../modules/tasks/useCases/updateTask";
import { getAllTasksController } from "../modules/tasks/useCases/getAllTasks";
import { verifyUserController } from "../modules/users/useCases/verifyUser";

const taskRouter = express.Router();

taskRouter.use(authMiddleware.handle, verifyUserController.handle);

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
