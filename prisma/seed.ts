import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const firstUserId = "56fbbb34-5c6b-4237-b8ed-22412ca935b7";
  const secondUserId = "1d457863-4c42-4d3e-a43f-82e376380070";

  await prisma.task.deleteMany({});

  await prisma.task.createMany({
    data: [
      {
        id: "bf9640e3-d49d-497f-8ea6-91e22de81e89",
        title: "First task",
        description: "First task description",
        userId: firstUserId,
      },
      {
        id: "c9b8cc4f-0a0c-4ebe-a3c9-7a3b7bf3c093",
        title: "Second task",
        description: "Second task description",
        userId: firstUserId,
      },
      {
        id: "d22f8ed1-08e6-405b-9346-f3cd70a97e6e",
        title: "Third task",
        description: "Third task description",
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
