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

export { ErrorStatusCode, SuccessStatusCode, TokenPayload };
