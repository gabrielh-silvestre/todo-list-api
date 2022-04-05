import express from 'express';

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
  createUserController.handle
);

export { userRouter };
