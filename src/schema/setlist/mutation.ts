import { arg, mutationField } from "@nexus/schema";
import { createSetlist } from "../../models/setlist";
import { addSongToSetlist } from "../../models/setlistMembership";

export const createOneSetlist = mutationField("createOneSetlist", {
  type: "Setlist",
  args: {
    setlist: arg({ type: "SetlistCreateInput", required: true }),
  },
  resolve: async (_parent, { setlist }, { user }) => {
    try {
      if (!user) {
        // todo: make sure the user belongs to the band
        throw new Error("Not Authenticated");
      }

      return createSetlist(setlist);
    } catch (e) {
      throw new Error(`Failed to create setlist with error: ${e.message}`);
    }
  },
});

export const addOneSongToSetlist = mutationField("addOneSongToSetlist", {
  type: "String",
  args: {
    membership: arg({ type: "SetlistAddSongInput", required: true }),
  },
  resolve: async (
    _parent,
    { membership: { songId, setlistId, bandId } },
    { user },
  ) => {
    try {
      if (!user) {
        // todo: make sure the user belongs to the band
        throw new Error("Not Authenticated");
      }

      addSongToSetlist(songId, setlistId, bandId);
      return "Success";
    } catch (e) {
      throw new Error(`Failed to add song to setlist with error: ${e.message}`);
    }
  },
});
