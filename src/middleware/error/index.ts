import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../../utils/CustomError';

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { statusCode, message } = err;

  if (statusCode) {
    return res.status(statusCode).json({ message });
  }

  console.log(message);
  return res
    .status(statusCode || 500)
    .json({ message: 'Internal server error' });
};

export { errorHandler };
