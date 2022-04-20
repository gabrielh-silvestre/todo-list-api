import { Request, Response, NextFunction } from 'express';

import { InternalError } from '../../utils/Errors';
import { BaseError } from '../../utils/Errors/BaseError';

const normalizeError = (err: any) => {
  if (err instanceof BaseError) {
    return err;
  }

  return new InternalError('Internal server error', err);
};

const errorHandler = (
  err: BaseError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const error = normalizeError(err);
  const { errorCode, message } = error.getBody();

  return res.status(errorCode).json({ message });
};

export { errorHandler };
