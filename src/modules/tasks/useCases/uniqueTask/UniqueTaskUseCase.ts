import { IError, ISuccess } from '../../../../@types/interfaces';
import { ITasksRepository } from '../../repository/ITasksRepository';

class UniqueTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async execute(
    userId: string,
    title: string
  ): Promise<ISuccess<null> | IError> {
    const findedTasks = await this.taskRepository.findByTitle(userId, title);

    if (findedTasks.length > 0) {
      return {
        statusCode: 'CONFLICT',
        message: 'Task already exists',
      };
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { UniqueTaskUseCase };
