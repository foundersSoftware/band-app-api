import { queryField } from "@nexus/schema";

export const getMyBand = queryField("getMyBand", {
  type: "Band",
  // list: true,
  nullable: true,
  resolve: () => ({
    name: "",
    uniqueName: "",
    location: "",
    members: [],
  }),
});
