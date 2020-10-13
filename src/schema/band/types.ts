import { inputObjectType, objectType } from "@nexus/schema";
import { fetchSongsByBand } from "../../models/song";
import { fetchUsersByBand } from "../../models/bandMembership";
import { fetchBandDetails } from "../../models/band";

export const Band = objectType({
  name: "Band",
  definition(t) {
    t.string("id");
    t.string("name");
    t.field("details", {
      type: "BandDetails",
      resolve: async (parent) => {
        if (!parent.details) {
          return fetchBandDetails(parent);
        }
        return parent.details;
      },
    });
    t.field("members", {
      type: "User",
      list: true,
      resolve: async (parent) => {
        if (!parent.members) {
          return fetchUsersByBand(parent);
        }
        return parent.members;
      },
    });
    t.field("songs", {
      type: "Song",
      list: true,
      resolve: async (parent) => fetchSongsByBand(parent.id),
    });
  },
});

export const BandDetails = objectType({
  name: "BandDetails",
  definition(t) {
    t.string("location");
  },
});

export const BandCreateInput = inputObjectType({
  name: "BandCreateInput",
  definition(t) {
    t.string("name", { required: true });
    t.string("location", { required: true });
  },
});

export const BandAddMemberInput = inputObjectType({
  name: "BandAddMemberInput",
  definition(t) {
    t.string("bandId", { required: true });
    t.string("userId", { required: true });
    t.string("bandMemberRole", { required: true });
  },
});
