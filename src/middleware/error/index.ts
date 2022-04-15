import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../../utils/CustomError';
import { errorStatusCode } from '../../utils/errorsCode';

const errorHandler = (
  err: CustomError,
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
