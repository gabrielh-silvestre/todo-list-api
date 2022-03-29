import express from 'express';
import { PrismaClient } from '@prisma/client';

const PORT = 3001;
const app = express();
const prisma = new PrismaClient();

app.get('/tasks', async (_req, res) => {
  const tasks = await prisma.task.findMany();

  return res.status(200).json({ tasks });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
