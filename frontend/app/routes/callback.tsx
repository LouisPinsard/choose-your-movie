import { createCookie, LoaderFunction, redirect } from "remix";
import invariant from "tiny-invariant";
import { apiClient } from "~/service/network.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  invariant(code, "Expected code");
  const result = await apiClient.post<
    { code: string },
    { data: { access_token: string; refresh_token: string; id_token: string } }
  >("/login", {
    code,
  });

  console.log(result.data);

  const accessTokenCookie = createCookie("accessToken");
  const refreshTokenCookie = createCookie("refreshToken", { httpOnly: true });
  const idTokenCookie = createCookie("idToken");
  const response = redirect("/");
  response.headers.append(
    "set-cookie",
    await refreshTokenCookie.serialize(result.data.refresh_token, {
      encode: (cookie) => decodeURIComponent(cookie),
    })
  );
  response.headers.append(
    "set-cookie",
    await idTokenCookie.serialize(result.data.id_token, {
      encode: (cookie) => decodeURIComponent(cookie),
    })
  );
  response.headers.append(
    "set-cookie",
    await accessTokenCookie.serialize(result.data.access_token, {
      encode: (cookie) => decodeURIComponent(cookie),
    })
  );

  return response;
};
