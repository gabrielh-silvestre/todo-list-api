import { Task } from '@prisma/client';

import { users } from './users';

const [user1, user2, user3] = users;

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
    title: 'Task 1',
    description: 'Task 1 description',
    status: 'TODO',
    userId: user1.id,
    updatedAt: Date() as unknown as Date,
  },
  {
    id: 'c9b8cc4f-0a0c-4ebe-a3c9-7a3b7bf3c093',
    title: 'Task 2',
    description: 'Task 2 description',
    status: 'TODO',
    userId: user1.id,
    updatedAt: Date() as unknown as Date,
  },
  {
    id: 'd22f8ed1-08e6-405b-9346-f3cd70a97e6e',
    title: 'Task 3',
    description: 'Task 3 description',
    status: 'TODO',
    userId: user2.id,
    updatedAt: Date() as unknown as Date,
  },
  {
    id: 'e22f8ed1-08e6-405b-9346-f3cd70a97e6e',
    title: 'Task 4',
    description: 'Task 4 description',
    status: 'TODO',
    userId: user3.id,
    updatedAt: Date() as unknown as Date,
  },
  {
    id: 'f22f8ed1-08e6-405b-9346-f3cd70a97e6e',
    title: 'Task 5',
    description: 'Task 5 description',
    status: 'TODO',
    userId: user3.id,
    updatedAt: Date() as unknown as Date,
  },
];

export { tasks, newTask };
