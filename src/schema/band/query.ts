import { arg, queryField } from "@nexus/schema";
import { fetchBandById } from "../../models/band";

export const getOneBandById = queryField("getOneBandById", {
  type: "Band",
  args: {
    bandId: arg({ type: "String", required: true }),
  },
  resolve: (_parent, { bandId }) => fetchBandById(bandId),
});
