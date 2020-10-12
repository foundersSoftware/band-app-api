import { arg, mutationField } from "@nexus/schema";
import { createSong } from "../../models/song";

export const createOneSong = mutationField("createOneSong", {
  type: "Song",
  args: {
    song: arg({ type: "SongCreateInput", required: true }),
  },
  resolve: async (_parent, { song }, { user }) => {
    try {
      if (!user) {
        throw new Error("Not Authenticated");
      }
      // todo: make sure the user belongs to the band

      return await createSong(song);
    } catch (e) {
      throw new Error(`Failed to create song with error: ${e.message}`);
    }
  },
});
