import { inputObjectType, objectType } from "@nexus/schema";
import { fetchUsersByBand } from "../../models/bandMembership";

export const Band = objectType({
  name: "Band",
  definition(t) {
    t.string("id");
    t.string("name");
    t.string("location");
    t.field("members", {
      type: "User",
      list: true,
      resolve: async (parent) => {
        if (!parent.members) {
          return fetchUsersByBand(parent);
        }
        return parent.members;
      },
    });
  },
});

export const BandCreateInput = inputObjectType({
  name: "BandCreateInput",
  definition(t) {
    t.string("name", { required: true });
    t.string("location", { required: true });
  },
});

export const BandAddMemberInput = inputObjectType({
  name: "BandAddMemberInput",
  definition(t) {
    t.string("bandId", { required: true });
    t.string("userId", { required: true });
    t.string("bandMemberRole", { required: true });
  },
});
