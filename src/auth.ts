import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { APIGatewayProxyEvent } from "aws-lambda";
import UserModel from "./schema/user/model";

export interface DecodedUserToken {
  email: string;
}

export interface User {
  email: string;
  password: string;
}

const isDecodedUserToken = (input: any): input is DecodedUserToken => (input as DecodedUserToken).email !== undefined;

const decodeToken = (token: string): DecodedUserToken | null => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return isDecodedUserToken(decoded) ? decoded : null;
  } catch (e) {
    return null;
  }
};

const getTokenFromAuthHeader = (event: APIGatewayProxyEvent) => {
  if (event.headers && event.headers.Authorization) {
    return event.headers.Authorization.replace("Bearer ", "");
  }
  return null;
};

const verifyPassword = (user: User, password: string) => bcrypt.compareSync(password, user.password);

const verifyUserExists = async (user: DecodedUserToken) => {
  const existingUser = await UserModel.get(user.email);
  return !!existingUser;
};

const convertDBUserToDecodedToken = (user: User): DecodedUserToken => ({
  email: user.email,
});

export const getUserFromRequest = async (event: APIGatewayProxyEvent) => {
  const token = getTokenFromAuthHeader(event);
  if (token) {
    const decodedUser = decodeToken(token);
    if (decodedUser) {
      if (verifyUserExists(decodedUser)) {
        return decodedUser;
      }
    }
  }
  return null;
};

export const getUserTokenFromCredentials = async (
  email: string,
  password: string,
) => {
  // find the user by email
  const user = await UserModel.get(email);

  // @ts-ignore
  if (user && isDecodedUserToken(user) && verifyPassword(user, password)) {
    // @ts-ignore
    const userToken = convertDBUserToDecodedToken(user);
    const token = jwt.sign(userToken, process.env.SECRET_KEY);
    return { token };
  }
  return { token: "" };
};

export const hashPassword = (password: string) => bcrypt.hashSync(password, 3);

export const getTokenFromUser = (user: DecodedUserToken) => ({
  token: jwt.sign({ email: user.email }, process.env.SECRET_KEY),
});
