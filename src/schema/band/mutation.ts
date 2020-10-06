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
  type: "Band",
  args: {
    band: arg({ type: "BandAddMemberInput", required: true }),
  },
  resolve: () => ({
    name: "",
    uniqueName: "",
    location: "",
    members: [],
  }),
});
