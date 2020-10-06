import bcrypt from "bcrypt";
import { BandModel } from "../db";
import { USER_KEY_PREFIX } from "./constants";
import type {
  Email,
  User,
  UserCredentials,
  UserKey,
  UserRecord,
} from "./types";

export const isUserRecord = (document: unknown): document is UserRecord => {
  const user = document as UserRecord;
  return (
    user.pk !== undefined
    && user.pk.startsWith(USER_KEY_PREFIX)
    && user.sk === user.pk
    && user.password !== undefined
  );
};

export const getUserFromUserRecord = (userRecord: UserRecord): User => ({
  email: userRecord.pk.slice(USER_KEY_PREFIX.length),
  password: userRecord.password,
});

const getUserKeyFromEmail = (email: Email): UserKey => ({
  pk: USER_KEY_PREFIX + email,
  sk: USER_KEY_PREFIX + email,
});

const getUserRecordFromUser = (user: User): UserRecord => ({
  pk: USER_KEY_PREFIX + user.email,
  sk: USER_KEY_PREFIX + user.email,
  password: bcrypt.hashSync(user.password, 3),
});

export const fetchUserByEmail = async (email: Email) => {
  try {
    const userRecord = await BandModel.get({ ...getUserKeyFromEmail(email) });

    if (!isUserRecord(userRecord)) {
      throw new Error("document is not a userRecord");
    }

    return getUserFromUserRecord(userRecord);
  } catch (e) {
    throw new Error(`Failed to fetch user with email: ${email}`);
  }
};

export const createUser = async (user: User) => {
  try {
    await BandModel.create(getUserRecordFromUser(user));
    return user;
  } catch (e) {
    throw new Error(`Failed to create user with email: ${user.email}`);
  }
};

export const authenticateUserCredentials = async (
  credentials: UserCredentials,
) => {
  try {
    const user = await fetchUserByEmail(credentials.email);
    if (!bcrypt.compareSync(credentials.password, user.password)) {
      throw new Error("Incorrect Password");
    }
    return user;
  } catch (e) {
    throw new Error(`Failed to authenticate with error: ${e.message}`);
  }
};
