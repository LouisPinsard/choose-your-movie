interface AccessToken {
  exp: number;
}

export const tokenHasExpired = (token: AccessToken): boolean => {
  if (!token.exp) return true;
  // Less than 10 seconds remaining => token has expired
  const now = new Date().getTime() / 1000;

  return token.exp - now < 10;
};
