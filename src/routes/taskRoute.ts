import express from 'express';

import { authMiddleware } from '../midleware/auth';
import { createTaskController } from '../modules/tasks/useCases/createTask';
import { taskValidator } from '../midleware/validate/TaskValidator';

const taskRouter = express.Router();

taskRouter.use(authMiddleware.handle);

taskRouter.post(
  '/create',
  taskValidator.createValidation,
  createTaskController.handle
);

export { taskRouter };
