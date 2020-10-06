import type { APIGatewayProxyEvent } from "aws-lambda";

import { getUserFromRequest } from "./auth";
import { User } from "./models/types";

export interface Context {
  event: APIGatewayProxyEvent;
  user: User | null;
}

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
