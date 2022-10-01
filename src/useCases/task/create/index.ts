import { TasksRepository } from "@infra/task/repository/prisma/Task.repository";
import { CreateTaskController } from "./CreateTaskController";
import { CreateTaskUseCase } from "./CreateTaskUseCase";

const taskRepository = new TasksRepository();
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const createTaskController = new CreateTaskController(createTaskUseCase);

export { createTaskUseCase, createTaskController };
