import {
  queryField, extendType, stringArg, intArg,
} from "@nexus/schema";
import model from "./model";
import { isUserRecord } from "./utils";

export const addUserCrudToQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("userById", {
      type: "User",
      args: { id: stringArg({ required: true }) },
      resolve: async (_root, { id }) => {
        const userRecord = await model.get({ id });
        return isUserRecord(userRecord)
          ? userRecord
          : { email: "", password: "" };
      },
    });
  },
});

export const me = queryField("me", {
  type: "User",
  resolve: async (_root, _args, { user }) => {
    if (user) {
      const userRecord = await model.get({ email: user.email });
      return isUserRecord(userRecord)
        ? userRecord
        : { email: "", password: "" };
    }
    return { email: "", password: "" };
  },
});

export const users = queryField("users", {
  type: "User",
  list: true,
  args: { last: intArg({ default: 5, nullable: false }) },
  resolve: async (_, { last }) => {
    const userRecords = await model.scan().limit(last).exec();
    if (isUserRecord(userRecords[0])) {
      return userRecords;
    }
    return { email: "", password: "" };
  },
});
