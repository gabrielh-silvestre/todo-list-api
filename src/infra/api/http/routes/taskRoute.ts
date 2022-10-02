import express from "express";

import { TaskControllerFactory } from "@infra/api/controller/task/factory/TaskController.factory";
import { TasksRepository } from "@infra/task/repository/prisma/Task.repository";

import { authMiddleware } from "../middleware/auth";
import { TaskValidator } from "../middleware/Validators/TaskValidator";
import { TasksRepositoryInMemory } from "@infra/task/repository/memory/Task.repository";

const isTest = process.env.NODE_ENV === "test";

const taskRouter = express.Router();
const taskControllerFactory = new TaskControllerFactory(
  isTest ? new TasksRepositoryInMemory() : new TasksRepository()
);

taskRouter.use(authMiddleware.handle);

taskRouter.get("/", taskControllerFactory.getAll());

taskRouter.post(
  "/",
  TaskValidator.createValidation,
  taskControllerFactory.create()
);

taskRouter.delete("/:id", taskControllerFactory.delete());

taskRouter.put(
  "/:id",
  TaskValidator.updateValidation,
  taskControllerFactory.update()
);

export { taskRouter };
