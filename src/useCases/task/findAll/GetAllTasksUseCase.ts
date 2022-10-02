import type { ITaskRepository } from "@domain/task/repository/Task.repository.interface";
import type {
  InputGetAllTasksDto,
  OutputGetAllTasksDto,
} from "./GetAllTasks.dto";

class GetAllTasksUseCase {
  constructor(private tasksRepository: ITaskRepository) {}

  async execute({
    userId,
  }: InputGetAllTasksDto): Promise<OutputGetAllTasksDto[]> {
    const foundTasks = await this.tasksRepository.findAll(userId);

    return foundTasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      updatedAt: task.updatedAt,
    }));
  }
}

export { GetAllTasksUseCase };
