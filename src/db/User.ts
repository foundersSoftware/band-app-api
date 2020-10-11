import dynamoose from "dynamoose";

import { BaseSchema, BaseDocument } from "./BaseSchema";

const UserSchema = new dynamoose.Schema(
  {
    ...BaseSchema,
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export interface UserDocument extends BaseDocument {
  pk: string;
  sk: string;
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
