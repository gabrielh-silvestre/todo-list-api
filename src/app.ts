import express from 'express';

import { userRouter } from './routes/userRoute';
import { taskRouter } from './routes/taskRoute';
import { errorHandler } from './middleware/error';

const app = express();

app.use(express.json());

app.use('/v1/api/users', userRouter);
app.use('/v1/api/tasks', taskRouter);

app.use(errorHandler);

export { app };
