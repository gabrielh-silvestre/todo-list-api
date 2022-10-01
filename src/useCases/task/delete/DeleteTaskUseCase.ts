import { NotFoundError } from "restify-errors";

import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";
import { InputDeleteTaskDto } from "./DeleteTask.dto";

class DeleteTaskUseCase {
  constructor(private tasksRepository: ITaskRepository) {}

  private async taskExists(userId: string, id: string): Promise<void | never> {
    const task = await this.tasksRepository.find(userId, id);

    if (!task) {
      throw new NotFoundError("Task not found");
    }
  }

  async execute({ userId, id }: InputDeleteTaskDto): Promise<void | never> {
    await this.taskExists(userId, id);
    await this.tasksRepository.delete(userId, id);
  }
}

export { DeleteTaskUseCase };
