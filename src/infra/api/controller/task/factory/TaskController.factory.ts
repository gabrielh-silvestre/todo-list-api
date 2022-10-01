import type { Handler } from "express";

import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";
import { TasksRepository } from "@infra/task/repository/prisma/Task.repository";

import { CreateTaskUseCase } from "@useCases/task/create/CreateTaskUseCase";
import { UpdateTaskUseCase } from "@useCases/task/update/UpdateTaskUseCase";
import { GetAllTasksUseCase } from "@useCases/task/findAll/GetAllTasksUseCase";
import { DeleteTaskUseCase } from "@useCases/task/delete/DeleteTaskUseCase";

import { CreateTaskController } from "../useCases/CreateTaskController";
import { UpdateTaskController } from "../useCases/UpdateTaskController";
import { GetAllTasksController } from "../useCases/GetAllTasksController";
import { DeleteTaskController } from "../useCases/DeleteTaskController";

export class TaskControllerFactory {
  static create(repository?: ITaskRepository): Handler {
    const taskRepository = new TasksRepository();
    const createTaskUseCase = new CreateTaskUseCase(
      repository || taskRepository
    );

    return new CreateTaskController(createTaskUseCase).handle;
  }

  static update(repository?: ITaskRepository): Handler {
    const taskRepository = new TasksRepository();
    const updateUseCase = new UpdateTaskUseCase(repository || taskRepository);

    return new UpdateTaskController(updateUseCase).handle;
  }

  static getAll(repository?: ITaskRepository): Handler {
    const taskRepository = new TasksRepository();
    const getAllTasksUseCase = new GetAllTasksUseCase(
      repository || taskRepository
    );

    return new GetAllTasksController(getAllTasksUseCase).handle;
  }

  static delete(repository?: ITaskRepository): Handler {
    const taskRepository = new TasksRepository();
    const deleteTaskUseCase = new DeleteTaskUseCase(
      repository || taskRepository
    );

    return new DeleteTaskController(deleteTaskUseCase).handle;
  }
}
