import type { Task } from '@prisma/client';

import { users } from './users';

const [user1, user2] = users;

const newTask: Task = {
  id: '18cabf6c-9f20-4914-98f7-c7d184e1d9b4',
  title: 'Task 6',
  description: 'Task 6 description',
  status: 'TODO',
  userId: user1.id,
  updatedAt: Date() as unknown as Date,
};

const tasks: Task[] = [
  {
    id: 'bf9640e3-d49d-497f-8ea6-91e22de81e89',
    title: 'First task',
    description: 'First task description',
    status: 'TODO',
    userId: user1.id,
    updatedAt: Date() as unknown as Date,
  },
  {
    id: 'c9b8cc4f-0a0c-4ebe-a3c9-7a3b7bf3c093',
    title: 'Second task',
    description: 'Second task description',
    status: 'TODO',
    userId: user1.id,
    updatedAt: Date() as unknown as Date,
  },
  {
    id: 'd22f8ed1-08e6-405b-9346-f3cd70a97e6e',
    title: 'Third task',
    description: 'Third task description',
    status: 'TODO',
    userId: user2.id,
    updatedAt: Date() as unknown as Date,
  },
];

export { tasks, newTask };
