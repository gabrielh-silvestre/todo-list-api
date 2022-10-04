import { NextFunction, Request, Response } from "express";

class AuthMiddleware {
  handle = async (req: Request, _res: Response, next: NextFunction) => {
    const fakeUser = "24d5ad6d-b864-4dee-a217-2608b6706cb6";

    req.body = { ...req.body, userId: fakeUser };
    next();
  };
}

export const authMiddleware = new AuthMiddleware();
