import {
  ITasksRepository,
  ITasksRepositoryDTO,
} from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

class CreateTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async execute({
    title,
    description,
    userId,
  }: ITasksRepositoryDTO): Promise<ISuccess<TaskReturn>> {
    const newTask = await this.taskRepository.create({
      title,
      description: description || null,
      userId,
    });

    return { statusCode: 'CREATED', data: newTask };
  }
}

export { CreateTaskUseCase };
