import express from 'express';

import { uniqueUserController } from '../modules/users/useCases/uniqueUser';
import { createUserController } from '../modules/users/useCases/createUser';
import { userValidation } from '../midleware/validate/userValidation';

const userRouter = express.Router();

userRouter.post(
  '/login',
  userValidation.createValidation,
  uniqueUserController.handle,
  createUserController.handle
);

export { userRouter };
