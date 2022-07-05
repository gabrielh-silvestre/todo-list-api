import type { NextFunction, Request, Response } from "express";

import { HttpError, InternalServerError } from "restify-errors";

class ErrorHandler {
  private static readonly normalize = (err: HttpError | Error): HttpError => {
    if (err instanceof HttpError) {
      return err;
    }

    console.error(err);
    return new InternalServerError(err, "Internal Server Error");
  };

  static handler(
    err: Error | HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const error = ErrorHandler.normalize(err);

    res.status(error.statusCode).json({ message: error.message });
  }
}

export { ErrorHandler };
