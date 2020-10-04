import { arg, mutationField } from "@nexus/schema";

export const createOneBand = mutationField("createOneBand", {
  type: "Band",
  args: {
    band: arg({ type: "BandCreateInput", required: true }),
  },
  resolve: () => ({
    name: "",
    uniqueName: "",
    location: "",
    members: [],
  }),
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
