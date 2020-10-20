import { inputObjectType, objectType } from "@nexus/schema";
import { fetchSongsByBand } from "../../models/song";
import { fetchUsersByBand } from "../../models/bandMembership";
import { fetchBandDetails } from "../../models/band";
import { fetchSetlistsByBand } from "../../models/setlist";
import { fetchEventsByBand } from "../../models/event";
import { fetchEventTypesByBand } from "../../models/eventType";

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
    t.field("setlists", {
      type: "Setlist",
      list: true,
      resolve: async (parent) => fetchSetlistsByBand(parent.id),
    });
    t.field("events", {
      type: "Event",
      list: true,
      resolve: async (parent) => fetchEventsByBand(parent.id),
    });
    t.field("eventTypes", {
      type: "EventType",
      list: true,
      resolve: async (parent) => {
        if (!parent.eventTypes) {
          return fetchEventTypesByBand(parent.id);
        }
        return parent.eventTypes;
      },
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
