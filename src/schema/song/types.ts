import { inputObjectType, objectType } from "@nexus/schema";
import { fetchBandById } from "../../models/band";

export const Song = objectType({
  name: "Song",
  definition(t) {
    t.string("id");
    t.string("title");
    t.string("bandId");
    t.field("band", {
      type: "Band",
      description:
        "Costs a Query, if you just need the band Id, use bandId instead!",
      resolve: async (parent) => fetchBandById(parent.bandId),
    });
  },
});

export const SongCreateInput = inputObjectType({
  name: "SongCreateInput",
  definition(t) {
    t.string("title", { required: true });
    t.string("bandId", { required: true });
  },
});
