import { Task } from '@prisma/client';

type TokenPayload = {
  aud: string;
  exp: number;
  sub: string;
  email: string;
  phone: string;
  app_metadata: { provider: string; providers: string[] };
  user_metadata: { username: string };
  role: string;
};

type TokenReturn = {
  token: string;
};

type TaskReturn = Pick<
  Task,
  'id' | 'title' | 'description' | 'status' | 'updatedAt'
>;

export { TokenPayload, TokenReturn, TaskReturn };
