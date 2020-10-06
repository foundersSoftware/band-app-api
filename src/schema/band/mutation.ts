import { arg, mutationField } from "@nexus/schema";
import { createBand } from "../../models/band";
import { addUserToBand } from "../../models/bandMembership";

export const createOneBand = mutationField("createOneBand", {
  type: "Band",
  args: {
    band: arg({ type: "BandCreateInput", required: true }),
  },
  resolve: async (_parent, { band }, { user }) => {
    try {
      if (!user) {
        throw new Error("Not Authenticated");
      }
      const createdBand = await createBand(band);
      addUserToBand(user.email, createdBand.id, "admin");
      return { ...createdBand, members: [user] };
    } catch (e) {
      throw new Error(`Failed to create band with error: ${e.message}`);
    }
  },
});

export const addOneUserToOneBand = mutationField("addOneUserToOneBand", {
  // todo: change this back to "Band"
  type: "String",
  args: {
    membership: arg({ type: "BandAddMemberInput", required: true }),
  },
  resolve: async (
    _parent,
    { membership: { userId, bandId, bandMemberRole } }
  ) => {
    try {
      addUserToBand(userId, bandId, bandMemberRole);
      return "Success";
    } catch (e) {
      throw new Error(e.message);
    }
  },
});
