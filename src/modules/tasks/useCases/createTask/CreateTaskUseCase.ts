import {
  ITasksRepository,
  ITasksRepositoryDTO,
} from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode, TaskReturn } from '../../../../@types/types';

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
        ErrorStatusCode.INTERNAL_SERVER_ERROR,
        'Unexpected error while creating task'
      );
    }
  }
}

export { CreateTaskUseCase };
