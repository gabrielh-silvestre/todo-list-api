import { StatusCodes } from 'http-status-codes';

import type { ITasksRepository } from '../../repository/ITasksRepository';
import type {
  TaskReturn,
  SuccessCase,
  TaskIdentifierByUser,
} from '../../../../@types/types';

class GetAllTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute({
    userId,
  }: TaskIdentifierByUser): Promise<SuccessCase<TaskReturn[]>> {
    const foundTasks = await this.tasksRepository.findAll({ userId });

    return {
      statusCode: StatusCodes.OK,
      data: foundTasks,
    };
  }
}

export { GetAllTasksUseCase };
