import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from 'restify-errors';

import { IAuthService } from '../../@types/interfaces';
import { TokenPayload } from '../../@types/types';

import { AuthService } from '../../services/Auth';

class AuthMiddleware {
  constructor(private authService: IAuthService<TokenPayload>) {}

  handle = async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      const err = new UnauthorizedError('No authorization header');
      return next(err);
    }

    const [_, token] = authorization.split(' ');

    const isValid = this.authService.verifyToken(token);

    if (!isValid) {
      const err = new UnauthorizedError('Expired or invalid token');
      return next(err);
    }

    req.body = {
      ...req.body,
      userId: isValid.data,
    };
    next();
  };
}

export const authMiddleware = new AuthMiddleware(AuthService);
