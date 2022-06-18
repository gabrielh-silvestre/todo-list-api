import { User } from '@supabase/supabase-js';
import { HttpError } from 'restify-errors';

import { IAuthService } from '../../@types/interfaces';

import { supabase } from '../../modules/auth';

interface IRequest {
  username: string;
  email: string;
  password: string;
}

interface IResponse {
  token: string;
  user: User | null;
}

class AuthService implements IAuthService {
  private readonly authService = supabase.auth;

  public async signUp({
    username,
    email,
    password,
  }: IRequest): Promise<IResponse> {
    const { user, session, error } = await this.authService.signUp(
      { email, password },
      { data: { username } }
    );

    if (error) {
      throw new HttpError({ statusCode: error.status }, error.message);
    }

    return {
      token: `Bearer ${session!.access_token}`,
      user,
    };
  }

  public async signIn({
    email,
    password,
  }: Omit<IRequest, 'username'>): Promise<IResponse> {
    const { user, session, error } = await this.authService.signIn({
      email,
      password,
    });

    if (error) {
      throw new HttpError({ statusCode: error.status }, error.message);
    }

    return {
      token: `Bearer ${session!.access_token}`,
      user,
    };
  }

  public async getUser(token: string): Promise<User | null> {
    const { user, error } = await this.authService.api.getUser(token);

    if (error) {
      throw new HttpError({ statusCode: error.status }, error.message);
    }

    return user;
  }
}

export { AuthService };
export const authService = new AuthService();
