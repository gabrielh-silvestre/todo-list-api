import { Request, Response, NextFunction } from 'express';

import { ErrorStatusCode, IError } from '../../helpers/interfaces';

type ErrorCodes = {
  [key in ErrorStatusCode]: number;
};

const errorStatusCode: ErrorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

const errorHandler = (
  err: IError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { statusCode, message } = err;

  if (statusCode) {
    return res.status(errorStatusCode[statusCode]).json({ message });
  }

  console.log(message);
  return res
    .status(errorStatusCode.INTERNAL_SERVER_ERROR)
    .json({ message: 'Internal server error' });
};

export { errorHandler };
