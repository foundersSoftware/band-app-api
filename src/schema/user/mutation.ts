import { arg, mutationField } from "@nexus/schema";
import model from "./model";
import { isUser } from "./utils";
import {
  getTokenFromUser,
  getUserTokenFromCredentials,
  hashPassword,
} from "../../auth";

export const createOneUser = mutationField("createOneUser", {
  type: "UserToken",
  nullable: true,
  args: {
    user: arg({ type: "UserCreateInput", required: true }),
  },
  resolve: async (_root, { user }) => {
    const userDocument = await model.create({
      ...user,
      password: hashPassword(user.password),
    });
    return isUser(userDocument) ? getTokenFromUser(userDocument) : null;
  },
});

export const login = mutationField("login", {
  type: "UserToken",
  nullable: true,
  args: {
    credentials: arg({ type: "UserCredentialsType", required: true }),
  },
  resolve: async (_root, { credentials }) => getUserTokenFromCredentials(credentials.email, credentials.password),
  // const userDocument = await model.get({ email: credentials.email });
  // return isUser(userDocument) ? getTokenFromUser(userDocument) : null;
});
