import { NextFunction, Request, Response } from 'express';

interface IUserValidation {
  createValidation(
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Response;
}

export { IUserValidation };
