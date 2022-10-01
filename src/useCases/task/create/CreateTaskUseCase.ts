import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";
import type { InputCreateTaskDto, OutputCreateTaskDto } from "./CreateTask.dto";

import { ConflictError } from "restify-errors";

import { TaskFactory } from "@domain/task/factory/Task.factory";

class CreateTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  private async isTaskUnique(
    userId: string,
    title: string
  ): Promise<void | never> {
    const task = await this.taskRepository.findByTitle(userId, title);

    if (task) {
      throw new ConflictError("Task with this title already exists");
    }
  }

  async execute({
    title,
    description,
    userId,
  }: InputCreateTaskDto): Promise<OutputCreateTaskDto | never> {
    await this.isTaskUnique(userId, title);

    const newTask = description
      ? TaskFactory.createWithDescription(title, description, userId)
      : TaskFactory.create(title, userId);

    await this.taskRepository.create(newTask);

    return {
      id: newTask.id,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      updatedAt: newTask.updatedAt,
    };
  }
}

export { CreateTaskUseCase };
