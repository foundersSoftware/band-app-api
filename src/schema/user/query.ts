import { queryField, stringArg } from "@nexus/schema";
import { fetchUserByEmail } from "../../models/user";

export const findOneUserByEmail = queryField("findOneUserByEmail", {
  type: "User",
  args: {
    email: stringArg({ required: true }),
  },
  resolve: async (_root, { email }) => {
    try {
      return fetchUserByEmail(email);
    } catch (e) {
      throw new Error(e.message);
    }
  },
});

export const me = queryField("me", {
  type: "User",
  resolve: async (_root, _args, { user }) => {
    try {
      if (!user) {
        throw new Error("Unauthenticated");
      }
      return user;
    } catch (e) {
      throw new Error(e.message);
    }
  },
});
