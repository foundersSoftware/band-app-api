import { inputObjectType, objectType } from "@nexus/schema";
import { fetchUsersByBandId } from "../../models/bandMembership";

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
        // todo: fix this typescript stuff.  Probably need to take another
        // look at gql backing types
        // @ts-ignore
        if (parent.members) {
          // @ts-ignore
          return parent.members;
        }
        return fetchUsersByBandId(parent.id);
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
