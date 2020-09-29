import { inputObjectType, objectType } from "@nexus/schema";

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("email", {
      resolve: (user) => user.email,
    });
  },
});

export const UserToken = objectType({
  name: "UserToken",
  definition(t) {
    t.string("token");
  },
});

export const UserCreateInput = inputObjectType({
  name: "UserCreateInput",
  definition(t) {
    t.string("email", { required: true });
    t.string("password", { required: true });
  },
});

export const UserCredentialsType = inputObjectType({
  name: "UserCredentialsType",
  definition(t) {
    t.string("email", { required: true });
    t.string("password", { required: true });
  },
});
