import { TasksRepository } from "@infra/task/repository/prisma/Task.repository";
import { UpdateTaskController } from "./UpdateTaskController";
import { UpdateTaskUseCase } from "./UpdateTaskUseCase";

const tasksRepository = new TasksRepository();
const updateTaskUseCase = new UpdateTaskUseCase(tasksRepository);
const updateTaskController = new UpdateTaskController(updateTaskUseCase);

export { updateTaskUseCase, updateTaskController };
