import { NextFunction, Request, Response } from 'express';

import { IAuthService } from '../../@types/interfaces';
import { TokenPayload } from '../../@types/types';

import { AuthService } from '../../services/Auth';

import { UnauthorizedError } from '../../utils/Errors';

class AuthMiddleware {
  constructor(private authService: IAuthService<TokenPayload>) {}

  handle = async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    const isValid = this.authService.verifyToken(authorization as string);

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

const authService = new AuthService();
export const authMiddleware = new AuthMiddleware(authService);
