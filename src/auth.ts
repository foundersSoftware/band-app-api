import bcrypt from "bcrypt";
import { APIGatewayProxyEvent } from "aws-lambda";

import UserModel from "./schema/user/model";
import type { User } from "./schema/user/backingType.d";
import { isUser } from "./schema/user/utils";
import { DecodedUserToken, UserToken } from "./auth/UserToken";

const getTokenFromAuthHeader = (event: APIGatewayProxyEvent) => {
  if (event.headers && event.headers.Authorization) {
    return event.headers.Authorization.replace("Bearer ", "");
  }
  return null;
};

const verifyPassword = (reference: string, given: string) => bcrypt.compareSync(given, reference);

const verifyUserExists = async (email: string) => {
  const existingUser = await UserModel.get(email);
  return !!existingUser;
};

// const getDecodedUserTokenFromUser = (user: User): DecodedUserToken => ({
// email: user.email,
// });

export const getUserFromRequest = async (event: APIGatewayProxyEvent) => {
  const token = getTokenFromAuthHeader(event);
  if (token) {
    const decodedUser = new DecodedUserToken(token);

    if (decodedUser) {
      if (verifyUserExists(decodedUser.payload.email)) {
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
  const userDocument = await UserModel.get(email);

  if (
    !DecodedUserToken.isUserTokenPayload(userDocument)
    || !isUser(userDocument)
  ) {
    throw Error("User Does Not Exist");
  } else if (!verifyPassword(userDocument.password, password)) {
    throw Error("Incorrect Password");
  }

  const { token } = new DecodedUserToken(userDocument).encode();

  return { token };
};

export const hashPassword = (password: string) => bcrypt.hashSync(password, 3);
export const getTokenFromUser = (user: User) => new DecodedUserToken(user).encode();

// export const getTokenFromUser = (user: DecodedUserToken) => ({
// token:
// token: jwt.sign({ email: user.email }, process.env.SECRET_KEY),
// });
