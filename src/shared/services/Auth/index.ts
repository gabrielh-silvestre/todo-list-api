import { HttpError } from "restify-errors";

import type { IAuthService } from "@projectTypes/interfaces";
import type {
  SignInData,
  SignReturn,
  SignUpData,
  AuthUser,
} from "@projectTypes/types";

import { supabase } from "./connection";

class AuthService implements IAuthService {
  private readonly authService = supabase.auth;

  public async signUp({
    username,
    email,
    password,
  }: SignUpData): Promise<SignReturn | never> {
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
  }: SignInData): Promise<SignReturn | never> {
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

  public async getUser(token: string): Promise<AuthUser | null | never> {
    const { user, error } = await this.authService.api.getUser(token);

    if (error) {
      throw new HttpError({ statusCode: error.status }, error.message);
    }

    return user;
  }
}

export { AuthService };
export const authService = new AuthService();
