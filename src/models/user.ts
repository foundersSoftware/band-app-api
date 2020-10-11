import bcrypt from "bcrypt";

import { UserDocument, UserModel, getUserKeyFromId } from "../db";
import type { Email, UserCreateInput, User } from "./types";

const getUserFromRecord = (userRecord: UserDocument): User => {
  const email = userRecord.pk;
  return {
    email,
    password: userRecord.password,
  };
};

const getUserFromCreateInput = (createInput: UserCreateInput): User => createInput;

const getRecordFromUser = (model: User): UserDocument => new UserModel({
  pk: model.email,
  sk: model.email,
  password: bcrypt.hashSync(model.password, 3),
});

export const fetchUserByEmail = async (email: Email): Promise<User> => {
  try {
    const userKey = getUserKeyFromId(email);
    const userRecord = await UserModel.get({ ...userKey });
    return getUserFromRecord(userRecord);
  } catch (e) {
    throw new Error(`Failed to fetch user with email: ${email}`);
  }
};

export const fetchUsersByEmails = async (emails: Email[]): Promise<User[]> => {
  try {
    const keys = emails.map((email) => ({ ...getUserKeyFromId(email) }));
    const records = await UserModel.batchGet(keys);
    return records.map((record) => getUserFromRecord(record));
  } catch (e) {
    throw new Error(e.message);
  }
};

export const createUser = async (user: UserCreateInput): Promise<User> => {
  try {
    const userModel = getUserFromCreateInput(user);
    const userRecord = getRecordFromUser(userModel);
    await userRecord.save();
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
