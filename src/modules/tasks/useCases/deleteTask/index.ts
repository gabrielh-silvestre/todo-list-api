import { TasksRepository } from '../../repository/TasksRepository';
import { DeleteTaskUseCase } from './DeleteTaskUseCase';
import { DeleteTaskController } from './DeleteTaskController';

const taskRepository = new TasksRepository();
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const deleteTaskController = new DeleteTaskController(deleteTaskUseCase);

export { deleteTaskUseCase, deleteTaskController };
