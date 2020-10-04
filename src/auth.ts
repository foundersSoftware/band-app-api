import bcrypt from "bcrypt";
import { APIGatewayProxyEvent } from "aws-lambda";

import { getUserRecordFromEmail, isUserRecord } from "./schema/user/utils";
import { getTokenFromUserRecord, getUserFromToken } from "./auth/UserToken";

const getTokenFromAuthHeader = (event: APIGatewayProxyEvent) => {
  if (event.headers && event.headers.Authorization) {
    return event.headers.Authorization.replace("Bearer ", "");
  }
  return null;
};

const verifyPassword = (reference: string, given: string) => bcrypt.compareSync(given, reference);

export const getUserFromRequest = async (event: APIGatewayProxyEvent) => {
  const token = getTokenFromAuthHeader(event);
  return token ? getUserFromToken(token) : null;
};

export const getUserTokenFromCredentials = async (
  email: string,
  password: string,
) => {
  const userRecord = await getUserRecordFromEmail(email);

  if (!isUserRecord(userRecord)) {
    throw Error("Cannot find record of user with email: {email}");
  }

  if (!verifyPassword(userRecord.password, password)) {
    throw Error("Incorrect password!");
  }

  return getTokenFromUserRecord(userRecord);
};

export const hashPassword = (password: string) => bcrypt.hashSync(password, 3);
