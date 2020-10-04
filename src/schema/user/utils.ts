import type { User, UserRecord } from "./backingType.d";
import UserModel from "./model";

export const isUserRecord = (input: any): input is UserRecord => {
  const userModel = input as UserRecord;
  return userModel.email !== undefined && userModel.password !== undefined;
};

export const isUser = (input: any): input is User => {
  const keys = Object.keys(input);
  return (
    keys.length === 1 && keys[0] === "email" && typeof input.email === "string"
  );
};

export const verifyUserRecordExists = async ({
  email,
}: User): Promise<Boolean> => !!UserModel.get(email);

export const getUserRecordFromEmail = async (email: string) => UserModel.get(email);
