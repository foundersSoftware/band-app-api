import { arg, mutationField } from "@nexus/schema";
import { ApolloError, UserInputError } from "apollo-server-lambda";
import { getTokenFromUserRecord } from "../../auth/UserToken";
import model from "./model";
import { isUserRecord } from "./utils";
import { getUserTokenFromCredentials, hashPassword } from "../../auth";

export const createOneUser = mutationField("createOneUser", {
  type: "UserToken",
  nullable: true,
  args: {
    user: arg({ type: "UserCreateInput", required: true }),
  },
  resolve: async (_root, { user }) => {
    try {
      const userRecord = await model.create({
        ...user,
        password: hashPassword(user.password),
      });

      return isUserRecord(userRecord)
        ? { token: getTokenFromUserRecord(userRecord) }
        : null;
    } catch (e) {
      throw new ApolloError(e.message);
    }
  },
});

export const login = mutationField("login", {
  type: "UserToken",
  nullable: true,
  args: {
    credentials: arg({ type: "UserCredentialsType", required: true }),
  },
  resolve: async (_root, { credentials: { email, password } }) => {
    try {
      const token = await getUserTokenFromCredentials(email, password);
      return { token };
    } catch (e) {
      throw new UserInputError(e.message);
    }
  },
});
