import jwtDecode from "jwt-decode";

export interface AccessToken {
  exp: number;
  email: string;
}

export const tokenHasExpired = (token: AccessToken): boolean => {
  if (!token.exp) return true;
  // Less than 10 seconds remaining => token has expired
  const now = new Date().getTime() / 1000;

  return token.exp - now < 10;
};

export const cookieHasExpired = (cookie: string): boolean => {
  try {
    const token = jwtDecode<AccessToken>(cookie);

    return tokenHasExpired(token);
  } catch (error) {
    return false;
  }
};
