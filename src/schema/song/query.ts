import { arg, queryField } from "@nexus/schema";
import { fetchSongsByBand } from "../../models/song";

export const getSongsByBand = queryField("findSongsByBand", {
  type: "Song",
  list: true,
  args: {
    bandId: arg({ type: "String", required: true }),
  },
  resolve: (_parent, { bandId }) => fetchSongsByBand(bandId),
});

