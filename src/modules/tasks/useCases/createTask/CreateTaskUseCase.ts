import {
  ITasksRepository,
  ITasksRepositoryDTO,
} from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

import { InternalError } from '../../../../utils/Errors';

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
      throw new InternalError('Unexpected error while creating task', err);
    }
  }
}

export { CreateTaskUseCase };
