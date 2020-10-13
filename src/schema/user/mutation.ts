import { arg, mutationField } from "@nexus/schema";
import { createUser, authenticateUserCredentials } from "../../models/user";
import { getTokenFromUser } from "../../auth";

export const createOneUser = mutationField("createOneUser", {
  type: "UserToken",
  nullable: true,
  args: {
    user: arg({ type: "UserCreateInput", required: true }),
  },
  resolve: async (_root, { user }) => {
    try {
      const persistedUser = await createUser(user);
      return getTokenFromUser(persistedUser);
    } catch (e) {
      throw new Error(e.message);
    }
  },
});

export const login = mutationField("login", {
  type: "UserToken",
  nullable: true,
  args: {
    credentials: arg({ type: "UserCredentialsType", required: true }),
  },
  resolve: async (_root, { credentials }) => {
    try {
      const user = await authenticateUserCredentials(credentials);
      return getTokenFromUser(user);
    } catch (e) {
      throw new Error(e.message);
    }
  },
});
