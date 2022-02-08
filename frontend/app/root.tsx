import {
  createCookie,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";
import { F } from "ts-toolbelt";
import type { LinksFunction } from "remix";
import jwtDecode from "jwt-decode";
import { tokenHasExpired } from "~/auth/auth";
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

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

const getAuthData = async (request: Request) => {
  const idTokenCookie = createCookie("idToken");
  let idTokenValue;
  try {
    idTokenValue = (await idTokenCookie.parse(
      request.headers.get("Cookie")
    )) as string | undefined;
  } catch (error) {
    return {
      isAuthenticated: false,
    };
  }

  let decodedToken;
  if (idTokenValue !== undefined) {
    try {
      decodedToken = jwtDecode<IdToken>(idTokenValue);
    } catch (error) {
      return {
        isAuthenticated: false,
      };
    }
  }

  return {
    isAuthenticated: decodedToken ? !tokenHasExpired(decodedToken) : false,
    email: decodedToken?.email,
  };
};

interface LoaderData {
  isAuthenticated: boolean;
  email?: string;
  ENV: {
    APP_AUTH_URL?: string;
  };
}

export interface OutletContextType {
  isAuthenticated: boolean;
  email?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  return {
    ...(await getAuthData(request)),
    ENV: {
      APP_AUTH_URL: process.env.APP_AUTH_URL,
      BASE_API_URL: process.env.BASE_API_URL,
    },
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css",
    },
  ];
};

export default function App() {
  const data = useLoaderData<LoaderData>();
  const context: OutletContextType = {
    isAuthenticated: data.isAuthenticated,
    email: data.email,
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={context} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
