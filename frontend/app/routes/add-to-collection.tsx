import { ActionFunction, json, redirect } from "remix";
import { cookieHasExpired } from "~/auth/auth";
import { idTokenCookie } from "~/service/cookies";
import { apiClient } from "~/service/network.server";

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await idTokenCookie.parse(cookieHeader)) as string;
  if (cookieHasExpired(cookie)) {
    return json({}, 401);
  }

  const form = await request.formData();
  const id = form.get("id");
  const errors: { id?: string } = {};

  if (typeof id !== "string") {
    errors.id = "Id should me a string";
  }
  // return data if we have errors
  if (Object.keys(errors).length) {
    return json(errors, { status: 422 });
  }

  const result = await apiClient.post(
    "/movie/add-to-collection",
    { id: id },
    { withCredentials: true, headers: { Authorization: `Bearer ${cookie}` } }
  );

  return redirect("/");
};
