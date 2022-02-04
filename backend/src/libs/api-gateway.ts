import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventBase,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEventWithAuthorizer<S> = Omit<
  APIGatewayProxyEventBase<{
    claims: {
      name: string;
      email: string;
    };
  }>,
  "body"
> & {
  body: FromSchema<S>;
};

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEventWithAutorizer<S> = Handler<
  ValidatedAPIGatewayProxyEventWithAuthorizer<S>,
  APIGatewayProxyResult
>;

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};
