import bcrypt from "bcrypt";
import { BandModel } from "../db";
import { USER_KEY_PREFIX, BAND_KEY_PREFIX } from "./constants";
import type {
  Email, UserCreateInput, User, UserRecord,
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

export const getUserFromRecord = (userRecord: UserRecord): User => {
  const email = userRecord.pk.slice(USER_KEY_PREFIX.length);
  return {
    email,
    password: userRecord.password,
  };
};

const getUserFromCreateInput = (createInput: UserCreateInput): User => createInput;

const getRecordFromUser = (model: User): UserRecord => ({
  pk: USER_KEY_PREFIX + model.email,
  sk: USER_KEY_PREFIX + model.email,
  password: bcrypt.hashSync(model.password, 3),
});

export const fetchUserByEmail = async (email: Email): Promise<User> => {
  try {
    const key = USER_KEY_PREFIX + email;
    const userRecord = await BandModel.get({
      pk: key,
      sk: key,
    });

    if (!isUserRecord(userRecord)) {
      throw new Error("document is not a userRecord");
    }

    return getUserFromRecord(userRecord);
  } catch (e) {
    throw new Error(`Failed to fetch user with email: ${email}`);
  }
};

export const createUser = async (user: UserCreateInput): Promise<User> => {
  try {
    const userModel = getUserFromCreateInput(user);
    const userRecord = getRecordFromUser(userModel);
    await BandModel.create(userRecord);
    return userModel;
  } catch (e) {
    throw new Error(`Failed to create user with email: ${user.email}`);
  }
};

export const authenticateUserCredentials = async (credentials: User) => {
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
