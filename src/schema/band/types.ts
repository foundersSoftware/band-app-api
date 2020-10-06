import { inputObjectType, objectType } from "@nexus/schema";
import { fetchUsersByBandId } from "../../models/bandMembership";

export const Band = objectType({
  name: "Band",
  definition(t) {
    t.string("name");
    t.string("uniqueName");
    t.string("location", { nullable: true });
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
    t.string("uniqueName", { required: true });
    t.string("location");
  },
});

export const BandAddMemberInput = inputObjectType({
  name: "BandAddMemberInput",
  definition(t) {
    t.string("bandUniqueName", { required: true });
    t.string("userEmail", { required: true });
    t.string("bandInviteKey", { required: true });
  },
});
