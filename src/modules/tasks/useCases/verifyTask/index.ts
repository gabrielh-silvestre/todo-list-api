import { TasksRepository } from '../../repository/TasksRepository';
import { VerifyTaskUseCase } from './VerifyTaskUseCase';
import { VerifyTaskController } from './VerifyTaskController';

const taskRepository = new TasksRepository();
const verifyTaskUseCase = new VerifyTaskUseCase(taskRepository);
const verifyTaskController = new VerifyTaskController(verifyTaskUseCase);

export { verifyTaskController };
