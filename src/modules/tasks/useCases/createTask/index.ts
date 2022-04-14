import { TasksRepository } from '../../repository/TasksRepository';
import { CreateTaskUseCase } from './CreateTaskUseCase';
import { CreateTaskController } from './CreateTaskController';

const taskRepository = new TasksRepository();
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const createTaskController = new CreateTaskController(createTaskUseCase);

export { createTaskController };
