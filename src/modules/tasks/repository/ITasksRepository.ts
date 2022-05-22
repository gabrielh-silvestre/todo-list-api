import {
  IBasicTaskData,
  ITaskIdentifierByUser,
  ITaskUserIdentifier,
} from '../../../@types/interfaces';
import { TaskReturn } from '../../../@types/types';

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
  ITasksRepository,
  ITasksRepositoryDTO,
  ITasksRepositoryUpdateDTO,
  ITasksRepositoryFindByEmailDTO,
};
