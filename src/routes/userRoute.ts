import express from 'express';

import { uniqueUserController } from '../modules/users/useCases/uniqueUser';
import { createUserController } from '../modules/users/useCases/createUser';
import {
  validEmail,
  validPassword,
  validUsername,
} from '../midleware/validate/userValidation';

const userRouter = express.Router();

userRouter.post(
  '/login',
  validEmail,
  validUsername,
  validPassword,
  uniqueUserController.handle,
  createUserController.handle
);

export { userRouter };
