import { TaskStatus } from '@prisma/client';

import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

import { NotFoundError } from '../../../../utils/Errors';

interface IRequest {
  title: string;
  description: string | null;
  status: TaskStatus;
}

class UpdateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async taskExists(userId: string, id: string): Promise<void> {
    const foundTask = await this.tasksRepository.findById({ userId, id });

    if (!foundTask) {
      throw new NotFoundError('Task not found');
    }
  }

  async execute(
    userId: string,
    id: string,
    { title, description, status }: IRequest
  ): Promise<ISuccess<TaskReturn>> {
    await this.taskExists(userId, id);

    const taskData = { title, description, status };

    const updatedTask = await this.tasksRepository.update({
      userId,
      id,
      taskData,
    });

    return {
      statusCode: 'UPDATED',
      data: updatedTask,
    };
  }
}

export { UpdateTaskUseCase };
