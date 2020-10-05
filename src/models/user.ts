// import shortid from "shortid";
import bcrypt from "bcrypt";
import { BandModel } from "../db";

export type Email = string;
export type Password = string;

export interface UserCredentials {
  email: Email;
  password: Password;
}

export interface User {
  email: Email;
  password: Password;
}

const USER_KEY_PREFIX = "USER-";

interface UserKey {
  pk: Email;
  sk: Email;
}

interface UserRecord extends UserKey {
  password: Password;
}

const isUserRecord = (document: unknown): document is UserRecord => {
  const user = document as UserRecord;
  return (
    user.pk !== undefined &&
    user.pk.startsWith(USER_KEY_PREFIX) &&
    user.sk === user.pk &&
    user.password !== undefined
  );
};

const getUserFromUserRecord = (userRecord: UserRecord): User => ({
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
  credentials: UserCredentials
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
