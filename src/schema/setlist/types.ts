import { inputObjectType, objectType } from "@nexus/schema";
import { fetchBandById } from "../../models/band";
import { fetchSongsBySetlistId } from "../../models/setlistMembership";

export const Setlist = objectType({
  name: "Setlist",
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
    t.field("songs", {
      type: "Song",
      list: true,
      resolve: async (parent) => fetchSongsBySetlistId(parent.id),
    });
  },
});

export const SetlistCreateInput = inputObjectType({
  name: "SetlistCreateInput",
  definition(t) {
    t.string("title", { required: true });
    t.string("bandId", { required: true });
  },
});

export const SetlistAddSongInput = inputObjectType({
  name: "SetlistAddSongInput",
  definition(t) {
    t.string("songId", { required: true });
    t.string("setlistId", { required: true });
    t.string("bandId", { required: true });
  },
});
