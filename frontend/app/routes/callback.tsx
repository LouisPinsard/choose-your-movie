import axios from "axios";
import { createCookie, LoaderFunction, redirect } from "remix";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  invariant(code, "Expected code");
  const result = await axios.post<
    { code: string },
    { data: { access_token: string; refresh_token: string; id_token: string } }
  >("https://qezgfu0ji5.execute-api.eu-west-1.amazonaws.com/dev/login", {
    code,
  });

  const accessTokenCookie = createCookie("accessToken");
  const refreshTokenCookie = createCookie("refreshToken", { httpOnly: true });
  const idTokenCookie = createCookie("idToken");
  const response = redirect("/");
  response.headers.append(
    "set-cookie",
    await refreshTokenCookie.serialize(result.data.refresh_token)
  );
  response.headers.append(
    "set-cookie",
    await idTokenCookie.serialize(result.data.id_token)
  );
  response.headers.append(
    "set-cookie",
    await accessTokenCookie.serialize(result.data.access_token)
  );

  return response;
};
