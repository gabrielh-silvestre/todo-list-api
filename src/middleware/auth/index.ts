import { NextFunction, Request, Response } from 'express';

import { IAuthService } from '../../@types/interfaces';
import { ErrorStatusCode, TokenPayload } from '../../@types/types';

import { AuthService } from '../../services/Auth';
import { CustomError } from '../../utils/CustomError';

class AuthMiddleware {
  constructor(private authService: IAuthService<TokenPayload>) {}

  handle = async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    const isValid = this.authService.verifyToken(authorization as string);

    if (!isValid) {
      const err = new CustomError(
        ErrorStatusCode.UNAUTHORIZED,
        'Expired ou invalid token'
      );
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
