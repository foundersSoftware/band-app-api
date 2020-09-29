import type { APIGatewayProxyEvent } from "aws-lambda";

export interface Context {
  event: APIGatewayProxyEvent;
  user: DecodedUserToken | null;
}
