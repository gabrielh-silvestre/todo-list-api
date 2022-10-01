import { TasksRepository } from "@infra/task/repository/prisma/Task.repository";
import { DeleteTaskController } from "./DeleteTaskController";
import { DeleteTaskUseCase } from "./DeleteTaskUseCase";

const taskRepository = new TasksRepository();
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const deleteTaskController = new DeleteTaskController(deleteTaskUseCase);

export { deleteTaskUseCase, deleteTaskController };
