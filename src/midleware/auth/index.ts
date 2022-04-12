import { NextFunction, Request, Response } from 'express';
import { AuthService, IAuthService, TokenPayload } from '../../services/Auth';
import { errorStatusCode } from '../../utils/errorsCode';

class AuthMiddleware {
  constructor(private authService: IAuthService<TokenPayload>) {}

  async handle(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    const isValid = this.authService.verifyToken(authorization as string);

    if (!isValid) {
      return res.status(errorStatusCode.UNAUTHORIZED).json({
        message: 'Expired ou invalid token',
      });
    }

    next();
  }
}

const authService = new AuthService();
export const authMiddleware = new AuthMiddleware(authService);
