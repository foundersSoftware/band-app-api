import jwt from "jsonwebtoken";

import { isUser, verifyUserRecordExists } from "../schema/user/utils";
import type { User, UserRecord } from "../schema/user/backingType.d";

const getUserFromUserRecord = ({ email }: UserRecord): User => ({ email });

const decodeToken = (token: Token): Object => jwt.verify(token, process.env.SECRET_KEY);

const getTokenFromUser = (user: User): Token => jwt.sign(user, process.env.SECRET_KEY);

export type Token = string;

export const getUserFromToken = async (token: Token): Promise<User | null> => {
  const decodedToken = decodeToken(token);

  return isUser(decodedToken) && (await verifyUserRecordExists(decodedToken))
    ? decodedToken
    : null;
};

export const getTokenFromUserRecord = (userRecord: UserRecord) => getTokenFromUser(getUserFromUserRecord(userRecord));
