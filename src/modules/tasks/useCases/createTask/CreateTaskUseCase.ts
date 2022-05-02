import { ITasksRepository } from '../../repository/ITasksRepository';
import { ISuccess } from '../../../../@types/interfaces';
import { TaskReturn } from '../../../../@types/types';

import { ConflictError } from '../../../../utils/Errors';

interface IRequest {
  title: string;
  description: string | null;
  userId: string;
}

class CreateTaskUseCase {
  constructor(private taskRepository: ITasksRepository) {}

  async isUnique(userId: string, title: string): Promise<void> {
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
  }: IRequest): Promise<ISuccess<TaskReturn>> {
    await this.isUnique(userId, title);

    const newTask = await this.taskRepository.create({
      title,
      description: description || null,
      userId,
    });

    return { statusCode: 'CREATED', data: newTask };
  }
}

export { CreateTaskUseCase };
