import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firstUserId = uuid();
  const secondUserId = uuid();

  await prisma.user.deleteMany({});
  await prisma.task.deleteMany({});

  await prisma.user.createMany({
    data: [
      {
        id: firstUserId,
        email: 'firstPerson@gmail.com',
        username: 'person1',
        password: bcrypt.hashSync('123a456', 10),
      },
      {
        id: secondUserId,
        email: 'secondPerson@gmail.com',
        username: 'person2',
        password: bcrypt.hashSync('123b456', 10),
      },
      {
        email: 'thirdPerson@gmail.com',
        username: 'person3',
        password: bcrypt.hashSync('123c456', 10),
      },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'First task',
        description: 'First task description',
        userId: firstUserId,
      },
      {
        title: 'Second task',
        description: 'Second task description',
        userId: firstUserId,
      },
      {
        title: 'Third task',
        description: 'Third task description',
        userId: secondUserId,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
