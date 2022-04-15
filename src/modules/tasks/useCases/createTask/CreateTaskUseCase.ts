import { TaskReturn } from '../../../../@types/types';
import { ISuccess } from '../../../../@types/interfaces';
import {
  ITasksRepository,
  ITasksRepositoryDTO,
} from '../../repository/ITasksRepository';
import { CustomError } from '../../../../utils/CustomError';

class CreateTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async execute({
    title,
    description,
    userId,
  }: ITasksRepositoryDTO): Promise<ISuccess<TaskReturn>> {
    try {
      const newTask = await this.taskRepository.create({
        title,
        description: description || null,
        userId,
      });

      return { statusCode: 'CREATED', data: newTask };
    } catch (err) {
      throw new CustomError(
        'INTERNAL_SERVER_ERROR',
        'Unexpected error while creating task'
      );
    }
  }
}

export { CreateTaskUseCase };
