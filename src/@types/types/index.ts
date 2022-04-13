import { Task } from '@prisma/client';

type ErrorStatusCode =
  | 'INTERNAL_SERVER_ERROR'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY'
  | 'INTERNAL_SERVER_ERROR';

type SuccessStatusCode = 'OK' | 'CREATED' | 'ACCEPTED' | 'DELETED' | 'UPDATED';

type TokenPayload = {
  data: string;
};

type TaskReturn = Pick<
  Task,
  'id' | 'title' | 'description' | 'status' | 'updatedAt'
>;

export { ErrorStatusCode, SuccessStatusCode, TokenPayload, TaskReturn };
