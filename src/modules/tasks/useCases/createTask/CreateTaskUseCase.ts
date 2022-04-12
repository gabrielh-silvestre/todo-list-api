import { Task } from '@prisma/client';
import { ISuccess } from '../../../../@types/interfaces';
import {
  ITasksRepository,
  ITasksRepositoryDTO,
} from '../../repository/ITasksRepository';

class CreateTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async execute({
    title,
    description,
    status,
    userId,
  }: ITasksRepositoryDTO): Promise<ISuccess<Task>> {
    const newTask = await this.taskRepository.create({
      title,
      description,
      status,
      userId,
    });

    return { statusCode: 'CREATED', data: newTask };
  }
}

export { CreateTaskUseCase };
