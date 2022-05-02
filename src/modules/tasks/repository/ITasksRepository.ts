import { TaskStatus } from '@prisma/client';
import { TaskReturn } from '../../../@types/types';

interface ITaskUserIdentifier {
  userId: string;
}

interface ITaskIdentifier {
  id: string;
}

interface IBasicTaskData {
  title: string;
  description: string | null;
  status?: TaskStatus;
}

interface ITaskIdentifierByUser extends ITaskUserIdentifier, ITaskIdentifier {}

interface ITasksRepositoryDTO extends IBasicTaskData, ITaskUserIdentifier {}

interface ITasksRepositoryFindByEmailDTO extends ITaskUserIdentifier {
  title: string;
}

interface ITasksRepositoryUpdateDTO extends ITaskIdentifierByUser {
  taskData: IBasicTaskData;
}

interface ITasksRepository {
  create(newTask: ITasksRepositoryDTO): Promise<TaskReturn>;
  update(taskToUpdate: ITasksRepositoryUpdateDTO): Promise<TaskReturn>;
  findAll(userIdentifier: ITaskUserIdentifier): Promise<TaskReturn[]>;
  findById(taskIdentifier: ITaskIdentifierByUser): Promise<TaskReturn | null>;
  findByExactTitle(
    taskIdentByTitle: ITasksRepositoryFindByEmailDTO
  ): Promise<TaskReturn[]>;
  delete(taskIdentifier: ITaskIdentifierByUser): Promise<void>;
}

export {
  ITaskUserIdentifier,
  ITaskIdentifier,
  ITaskIdentifierByUser,
  ITasksRepository,
  ITasksRepositoryDTO,
  ITasksRepositoryUpdateDTO,
  ITasksRepositoryFindByEmailDTO,
};
