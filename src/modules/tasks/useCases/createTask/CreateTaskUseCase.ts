import { TaskReturn } from '../../../../@types/types';
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
