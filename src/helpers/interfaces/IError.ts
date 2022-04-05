type ErrorStatusCode = 
  'INTERNAL_SERVER_ERROR'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY'
  | 'INTERNAL_SERVER_ERROR';

interface IError {
  statusCode: ErrorStatusCode;
  message: string;
}

export { IError, ErrorStatusCode };
