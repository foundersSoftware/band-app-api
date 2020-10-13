import dynamoose from "dynamoose";

import BaseSchema from "./BaseSchema";
import type { Key, BaseDocument } from "./types";
import { USER_KEY_PREFIX } from "./constants";

const UserSchema = new dynamoose.Schema(
  {
    pk: {
      ...BaseSchema.pk,
      get: (value) => (value as string).slice(USER_KEY_PREFIX.length),
      set: (value) => USER_KEY_PREFIX + value,
    },
    sk: {
      ...BaseSchema.sk,
      get: (value) => (value as string).slice(USER_KEY_PREFIX.length),
      set: (value) => USER_KEY_PREFIX + value,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export interface UserDocument extends BaseDocument {
  password: string;
}

export const UserModel = dynamoose.model<UserDocument>("BandApp", UserSchema, {
  create: process.env.NODE_ENV === "development",
  waitForActive: {
    enabled: process.env.NODE_ENV === "development",
    check: {
      // defaults (only valid in development)
      timeout: 180000,
      frequency: 1000,
    },
  },
});

export const getUserKeyFromId = (id: string): Key => ({
  pk: USER_KEY_PREFIX + id,
  sk: USER_KEY_PREFIX + id,
});
