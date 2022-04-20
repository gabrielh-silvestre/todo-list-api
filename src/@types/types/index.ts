import { Task } from '@prisma/client';

enum ErrorStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

type SuccessStatusCode = 'OK' | 'CREATED' | 'ACCEPTED' | 'DELETED' | 'UPDATED';

type TokenPayload = {
  data: string;
};

type TaskReturn = Pick<
  Task,
  'id' | 'title' | 'description' | 'status' | 'updatedAt'
>;

export { ErrorStatusCode, SuccessStatusCode, TokenPayload, TaskReturn };
