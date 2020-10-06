import jwt from "jsonwebtoken";
import { APIGatewayProxyEvent } from "aws-lambda";
import { fetchUserByEmail } from "./models/user";
import type { User } from "./models/types";

export interface DecodedUserToken {
  email: string;
}

const isDecodedUserToken = (input: any): input is DecodedUserToken => (input as DecodedUserToken).email !== undefined;

const decodeToken = (token: string): DecodedUserToken | null => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return isDecodedUserToken(decoded) ? decoded : null;
  } catch (e) {
    throw new Error(e.message);
  }
};

const getTokenFromAuthHeader = (event: APIGatewayProxyEvent) => {
  if (event.headers && event.headers.Authorization) {
    return event.headers.Authorization.replace("Bearer ", "");
  }
  return null;
};

export const getUserFromRequest = async (event: APIGatewayProxyEvent) => {
  const token = getTokenFromAuthHeader(event);
  if (token) {
    const decodedUser = decodeToken(token);
    if (decodedUser) {
      return fetchUserByEmail(decodedUser.email);
    }
  }
  return null;
};

export const getTokenFromUser = ({ password, ...rest }: User) => ({
  token: jwt.sign(rest, process.env.SECRET_KEY),
});
