import { Task } from '@prisma/client';

type TokenPayload = {
  data: string;
};

type TaskReturn = Pick<
  Task,
  'id' | 'title' | 'description' | 'status' | 'updatedAt'
>;

export { TokenPayload, TaskReturn };
