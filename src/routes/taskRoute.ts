import express from 'express';

import { authMiddleware } from '../midleware/auth';
import { uniqueTaskController } from '../modules/tasks/useCases/uniqueTask';
import { createTaskController } from '../modules/tasks/useCases/createTask';
import { taskValidator } from '../midleware/validate/TaskValidator';

const taskRouter = express.Router();

taskRouter.use(authMiddleware.handle);

taskRouter.post(
  '/create',
  taskValidator.createValidation,
  uniqueTaskController.handle,
  createTaskController.handle
);

export { taskRouter };
