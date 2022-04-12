import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        email: 'firstPerson@gmail.com',
        username: 'firstPerson',
        password: bcrypt.hashSync('123a456', 10),
      },
      {
        email: 'secondPerson@gmail.com',
        username: 'secondPerson',
        password: bcrypt.hashSync('123b456', 10),
      },
      {
        email: 'thirdPerson@gmail.com',
        username: 'thirdPerson',
        password: bcrypt.hashSync('123c456', 10),
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
