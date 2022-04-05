import express from 'express';
import { createUserController } from '../modules/users/useCases/createUser';

const userRouter = express.Router();

userRouter.post('/login', createUserController.handle);

export { userRouter };
