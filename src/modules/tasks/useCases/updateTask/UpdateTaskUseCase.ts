import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from 'restify-errors';

import type { ITasksRepository } from '../../repository/ITasksRepository';
import type {
  TaskUpdateAttributes,
  TaskReturn,
  SuccessCase,
} from '../../../../@types/types';

class UpdateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  private async taskExists(userId: string, id: string): Promise<void | never> {
    const foundTask = await this.tasksRepository.findById({ userId, id });

    if (!foundTask) {
      throw new NotFoundError('Task not found');
    }
  }

  async execute(
    taskData: TaskUpdateAttributes
  ): Promise<SuccessCase<TaskReturn> | never> {
    const { id, userId } = taskData;

    await this.taskExists(userId, id);

    const updatedTask = await this.tasksRepository.update(taskData);

    return {
      statusCode: StatusCodes.OK,
      data: updatedTask,
    };
  }
}

export { UpdateTaskUseCase };
