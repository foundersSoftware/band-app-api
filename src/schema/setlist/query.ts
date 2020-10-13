import { arg, queryField } from "@nexus/schema";
import { fetchSetlistsByBand } from "../../models/setlist";

export const getSetlistsByBand = queryField("findSetlistsByBand", {
  type: "Setlist",
  list: true,
  args: {
    bandId: arg({ type: "String", required: true }),
  },
  resolve: (_parent, { bandId }) => fetchSetlistsByBand(bandId),
});

