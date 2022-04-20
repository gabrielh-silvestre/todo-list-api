import { TaskStatus } from '@prisma/client';

import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { ErrorStatusCode, TaskReturn } from '../../../../@types/types';

import { CustomError } from '../../../../utils/CustomError';

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
      throw new CustomError(
        ErrorStatusCode.INTERNAL_SERVER_ERROR,
        'Unexpected error while updating task'
      );
    }
  }
}

export { UpdateTaskUseCase };
