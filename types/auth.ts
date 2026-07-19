export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type LoginResponse = AuthTokens & {
  user: AuthUser;
};

export type RefreshResponse = AuthTokens;

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: AuthUser;
};
