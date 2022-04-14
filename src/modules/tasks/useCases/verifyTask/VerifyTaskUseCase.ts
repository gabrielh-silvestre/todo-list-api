import { IError, ISuccess } from '../../../../@types/interfaces';
import { ITasksRepository } from '../../repository/ITasksRepository';

class VerifyTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async execute(userId: string, id: string): Promise<ISuccess<null> | IError> {
    const findedTask = await this.taskRepository.findById(userId, id);

    if (!findedTask) {
      return {
        statusCode: 'NOT_FOUND',
        message: 'Task not found',
      };
    }

    return {
      statusCode: 'OK',
      data: null,
    };
  }
}

export { VerifyTaskUseCase };
