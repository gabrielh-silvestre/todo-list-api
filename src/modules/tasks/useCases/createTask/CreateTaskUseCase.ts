import { StatusCodes } from 'http-status-codes';
import { ConflictError } from 'restify-errors';

import type { ITasksRepository } from '../../../../@types/interfaces';
import type {
  SuccessCase,
  TaskCreateAttributes,
  TaskReturn,
} from '../../../../@types/types';

class CreateTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  private async isUnique(userId: string, title: string): Promise<void | never> {
    const foundTasks = await this.taskRepository.findByExactTitle({
      userId,
      title,
    });

    if (foundTasks.length > 0) {
      throw new ConflictError('Task with this title already exists');
    }
  }

  async execute({
    title,
    description,
    userId,
  }: TaskCreateAttributes): Promise<SuccessCase<TaskReturn> | never> {
    await this.isUnique(userId, title);

    const newTask = await this.taskRepository.create({
      title,
      description,
      userId,
    });

    return {
      statusCode: StatusCodes.CREATED,
      data: newTask,
    };
  }
}

export { CreateTaskUseCase };
