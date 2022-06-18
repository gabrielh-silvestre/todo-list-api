import type { User } from '@prisma/client';

const newUser: User = {
  id: '7c7de5e9-411a-432f-957f-3bd3ed5c2e09',
  email: 'fourthPerson@gmail.com',
  username: 'person4',
};

const users: User[] = [
  {
    id: '56fbbb34-5c6b-4237-b8ed-22412ca935b7',
    email: 'firstPerson@gmail.com',
    username: 'person1',
  },
  {
    id: '1d457863-4c42-4d3e-a43f-82e376380070',
    email: 'secondPerson@gmail.com',
    username: 'person2',
  },
  {
    id: '537ead63-2b37-4348-acd0-07b2e3713559',
    email: 'thirdPerson@gmail.com',
    username: 'person3',
  },
];

export { users, newUser };
