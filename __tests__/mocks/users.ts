import type { User } from '@prisma/client';

import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';

const newUser: User = {
  id: '7c7de5e9-411a-432f-957f-3bd3ed5c2e09',
  email: 'fourthPerson@gmail.com',
  username: 'person4',
  password: '123a456',
};

const users: User[] = [
  {
    id: uuidV4(),
    email: 'firstPerson@gmail.com',
    username: 'person1',
    password:'123a456',
  },
  {
    id: uuidV4(),
    email: 'secondPerson@gmail.com',
    username: 'person2',
    password:'123b456',
  },
  {
    id: uuidV4(),
    email: 'thirdPerson@gmail.com',
    username: 'person3',
    password:'123c456',
  },
];

export { users, newUser };
