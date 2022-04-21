import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { userRouter } from './routes/userRoute';
import { taskRouter } from './routes/taskRoute';

import { errorHandler } from './middleware/error';

import swaggerFile from './swagger.json';

const app = express();

app.use(express.json());

app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/v1/api/users', userRouter);
app.use('/v1/api/tasks', taskRouter);

app.use(errorHandler);

export { app };
