import { inputObjectType, objectType } from "@nexus/schema";
import { fetchBandsByUser } from "../../models/bandMembership";

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("email", {
      resolve: (parent) => parent.email,
    });
    t.field("bands", {
      type: "Band",
      list: true,
      resolve: async (parent) => {
        if (!parent.bands) {
          return fetchBandsByUser(parent);
        }
        return parent.bands;
      },
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
