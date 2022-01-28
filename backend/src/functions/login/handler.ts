import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import axios from "axios";
import { stringify } from "querystring";
import createError from "http-errors";
import httpErrorHandler from "@middy/http-error-handler";
import schema from "./schema";

const login: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const appClientId = process.env.COGNITO_APP_CLIENT_ID;
  const appClientSecret = process.env.COGNITO_APP_CLIENT_SECRET;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/strict-boolean-expressions
  if (!appClientId || !appClientSecret) {
    throw new createError.InternalServerError(
      "Missing env variable COGNITO_APP_CLIENT_ID or COGNITO_APP_CLIENT_SECRET"
    );
  }

  try {
    const result = await axios.post(
      `https://choose-your-movie.auth.eu-west-1.amazoncognito.com/oauth2/token`,
      stringify({
        grant_type: "authorization_code",
        client_id: appClientId,
        code: event.body.code,
        redirect_uri: "http://localhost:3000/callback",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        auth: { username: appClientId, password: appClientSecret },
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return formatJSONResponse(result.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        throw new createError[error.response.status]("Invalid api call");
      }
    }
    throw new createError.InternalServerError();
  }
};

export const main = middyfy(login).use(httpErrorHandler());
