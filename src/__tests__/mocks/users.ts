import { User } from '@prisma/client';

const newUser: User = {
  id: '7c7de5e9-411a-432f-957f-3bd3ed5c2e09',
  email: 'person5@email.com',
  username: 'person5',
  password: '123a456',
}

const users: User[] = [
  {
    id: 'aa2df732-a111-4a51-9eea-7e818007ea28',
    email: 'person1@gmail.com',
    username: 'person1',
    password: '123a456',
  },
  {
    id: '5b9ed892-0458-404d-b680-19df3f587508',
    email: 'person2@gmail.com',
    username: 'person2',
    password: '123a456',
  },
  {
    id: 'e9b8cc4f-0a0c-4ebe-a3c9-7a3b7bf3c093',
    email: 'person3@gmail.com',
    username: 'person3',
    password: '123a456',
  },
  {
    id: 'a22f8ed1-08e6-405b-9346-f3cd70a97e6e',
    email: 'person4@gmail.com',
    username: 'person4',
    password: '123a456',
  },
];

export { users, newUser };
