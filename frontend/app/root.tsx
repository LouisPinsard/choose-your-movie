import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";
import { F } from "ts-toolbelt";

export const meta: MetaFunction = () => {
  return { title: "New Remix App" };
};

export function loader() {
  return {
    ENV: {
      APP_AUTH_URL: process.env.APP_AUTH_URL,
    },
  };
}

export default function App() {
  const data = useLoaderData<F.Return<typeof loader>>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
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
