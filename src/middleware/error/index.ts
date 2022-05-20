import { Request, Response, NextFunction } from 'express';
import { InternalError, DefinedHttpError } from 'restify-errors';

const normalizeError = (err: DefinedHttpError): DefinedHttpError => {
  if (err.statusCode) {
    return err;
  }

  console.log(err);
  return new InternalError('Internal server error', err);
};

const errorHandler = (
  err: DefinedHttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const error = normalizeError(err);
  const { statusCode, message } = error;

  return res.status(statusCode).json({ message });
};

export { errorHandler };
