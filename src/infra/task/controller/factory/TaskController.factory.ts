import type { Handler } from "express";

import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";

import { CreateTaskUseCase } from "@useCases/task/create/CreateTaskUseCase";
import { UpdateTaskUseCase } from "@useCases/task/update/UpdateTaskUseCase";
import { GetAllTasksUseCase } from "@useCases/task/findAll/GetAllTasksUseCase";
import { DeleteTaskUseCase } from "@useCases/task/delete/DeleteTaskUseCase";

import { CreateTaskController } from "../cases/create/CreateTaskController";
import { UpdateTaskController } from "../cases/update/UpdateTaskController";
import { GetAllTasksController } from "../cases/findAll/GetAllTasksController";
import { DeleteTaskController } from "../cases/delete/DeleteTaskController";

export class TaskControllerFactory {
  constructor(private readonly repository: ITaskRepository) {}

  create(): Handler {
    const createTaskUseCase = new CreateTaskUseCase(this.repository);

    return new CreateTaskController(createTaskUseCase).handle;
  }

  update(): Handler {
    const updateUseCase = new UpdateTaskUseCase(this.repository);

    return new UpdateTaskController(updateUseCase).handle;
  }

  getAll(): Handler {
    const getAllTasksUseCase = new GetAllTasksUseCase(this.repository);

    return new GetAllTasksController(getAllTasksUseCase).handle;
  }

  delete(): Handler {
    const deleteTaskUseCase = new DeleteTaskUseCase(this.repository);

    return new DeleteTaskController(deleteTaskUseCase).handle;
  }
}
