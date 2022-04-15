import { User } from '@prisma/client';

const users: User[] = [
  {
    id: '1',
    email: 'person1@email.com',
    username: 'person1',
    password: '123456',
  },
  {
    id: '2',
    email: 'person2@email.com',
    username: 'person2',
    password: '123456',
  },
  {
    id: '3',
    email: 'person3@email.com',
    username: 'person3',
    password: '123456',
  },
  {
    id: '4',
    email: 'person4@email.com',
    username: 'person4',
    password: '123456',
  },
];

export { users };
