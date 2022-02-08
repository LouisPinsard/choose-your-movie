import { createCookie } from "remix";

const ACCESS_TOKEN_COOKIE = "accessToken";
const ID_TOKEN_COOKIE = "idToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

export const accessTokenCookie = createCookie(ACCESS_TOKEN_COOKIE);
export const refreshTokenCookie = createCookie(REFRESH_TOKEN_COOKIE, {
  httpOnly: true,
});
export const idTokenCookie = createCookie(ID_TOKEN_COOKIE);
