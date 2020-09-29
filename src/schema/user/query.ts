import {
  queryField, extendType, stringArg, intArg,
} from "@nexus/schema";
import model from "./model";
import { isUser } from "./utils";

export const addUserCrudToQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("userById", {
      type: "User",
      args: { id: stringArg({ required: true }) },
      resolve: async (_root, { id }) => {
        const document = await model.get({ id });
        return isUser(document) ? document : { email: "", password: "" };
      },
    });
  },
});

export const me = queryField("me", {
  type: "User",
  resolve: async (_root, _args, { user }) => {
    if (user) {
      const userDocument = await model.get({ email: user.email });
      return isUser(userDocument) ? userDocument : { email: "", password: "" };
    }
    return { email: "", password: "" };
  },
});

export const users = queryField("users", {
  type: "User",
  list: true,
  args: { last: intArg({ default: 5, nullable: false }) },
  resolve: async (_, { last }) => {
    const userDocuments = await model.scan().limit(last).exec();
    if (isUser(userDocuments[0])) {
      return userDocuments;
    }
    return { email: "", password: "" };
  },
});
