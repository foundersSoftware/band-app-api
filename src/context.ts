import type { APIGatewayProxyEvent } from "aws-lambda";

import { getUserFromRequest } from "./auth";
import type { Context } from "./schema/context.d";

export async function createContext({
  event,
}: {
  event: APIGatewayProxyEvent;
}): Promise<Context> {
  return {
    event,
    user: await getUserFromRequest(event),
  };
}
