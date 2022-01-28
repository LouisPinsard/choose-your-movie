import jwtDecode from "jwt-decode";
import { createCookie, LoaderFunction, useLoaderData } from "remix";
import { tokenHasExpired } from "~/auth/auth";

type loaderData = {
  authUrl: string | undefined;
  isAuthenticated: boolean;
  email?: string;
};

type IdToken = {
  sub: string;
  aud: string;
  email_verified: boolean;
  token_use: string;
  auth_time: number;
  iss: string;
  "cognito:username": string;
  exp: number;
  given_name: string;
  iat: number;
  email: string;
  jti: string;
  origin_jti: string;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<loaderData> => {
  const idTokenCookie = createCookie("idToken");
  const idTokenValue = (await idTokenCookie.parse(
    request.headers.get("Cookie")
  )) as string | undefined;

  let decodedToken;
  if (idTokenValue !== undefined) {
    decodedToken = jwtDecode<IdToken>(idTokenValue);
  }

  return {
    authUrl: process.env.APP_AUTH_URL,
    isAuthenticated: decodedToken ? !tokenHasExpired(decodedToken) : false,
    email: decodedToken?.email,
  };
};

export default function Index() {
  const { isAuthenticated, authUrl, email } = useLoaderData<loaderData>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {isAuthenticated && email !== undefined ? (
        `Connected as ${email}`
      ) : (
        <a href={authUrl}>Log in</a>
      )}
    </div>
  );
}
