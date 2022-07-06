import { CelebrateError } from "celebrate";
import type { ErrorRequestHandler } from "express";
import {
  BadRequestError,
  HttpError,
  InternalServerError,
  UnprocessableEntityError,
} from "restify-errors";

class ErrorHandler {
  private static readonly normalizeJoiError = (
    errorMessage: string
  ): HttpError => {
    return errorMessage.includes("required")
      ? new BadRequestError(errorMessage)
      : new UnprocessableEntityError(errorMessage);
  };

  private static readonly normalize = (
    err: HttpError | CelebrateError | Error
  ): HttpError => {
    if (err instanceof HttpError) {
      return err;
    }

    if (err instanceof CelebrateError) {
      let error: HttpError = new BadRequestError(err, "Validation Error");

      err.details.forEach((detail) => {
        error = ErrorHandler.normalizeJoiError(detail.message);
      });

      return error;
    }

    console.error(err);
    return new InternalServerError(err, "Internal Server Error");
  };

  static handler: ErrorRequestHandler = (err, _req, res, _next) => {
    const error = ErrorHandler.normalize(err);

    res.status(error.statusCode).json({ message: error.message });
  };
}

export { ErrorHandler };
