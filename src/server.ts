import 'dotenv/config';
import express from 'express';
// import { PrismaClient } from '@prisma/client';

import { userRouter } from './routes/userRoute';
import { taskRouter } from './routes/taskRoute';
import { errorHandler } from './middleware/error';

const PORT = process.env.PORT || 3001;
const app = express();
// const prisma = new PrismaClient();

// app.get('/tasks', async (_req, res) => {
//   const tasks = await prisma.task.findMany();

//   return res.status(200).json({ tasks });
// });

app.use(express.json());

app.use('/v1/api/users', userRouter);
app.use('/v1/api/tasks', taskRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
