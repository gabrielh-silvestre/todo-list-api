import { IAuthService } from "@projectTypes/interfaces";
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "restify-errors";

import { authService } from "../../../services/Auth";

class AuthMiddleware {
  constructor(private authService: IAuthService) {}

  handle = async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      const err = new UnauthorizedError("No authorization header");
      return next(err);
    }

    const [, token] = authorization.split(" ");

    const user = await this.authService.getUser(token);

    if (!user) {
      const err = new UnauthorizedError("Expired or invalid token");
      return next(err);
    }

    req.body = { ...req.body, userId: user.id };
    next();
  };
}

export const authMiddleware = new AuthMiddleware(authService);
