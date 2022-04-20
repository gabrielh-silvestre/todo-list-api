import { TaskStatus } from '@prisma/client';

import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

import { InternalError } from '../../../../utils/Errors';

interface IRequest {
  title: string;
  description: string | null;
  status: TaskStatus;
}

class UpdateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(
    userId: string,
    id: string,
    { title, description, status }: IRequest
  ): Promise<ISuccess<TaskReturn>> {
    try {
      const updatedTask = await this.tasksRepository.update(userId, id, {
        title,
        description,
        status,
      });

      return {
        statusCode: 'UPDATED',
        data: updatedTask,
      };
    } catch (err) {
      throw new InternalError(
        'Unexpected error while updating task',
        err
      );
    }
  }
}

export { UpdateTaskUseCase };
