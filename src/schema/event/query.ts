import { arg, queryField } from "@nexus/schema";
import { fetchEventTypeById } from "../../models/eventType";
import { fetchEventsByBand } from "../../models/event";

export const getEventsByBand = queryField("findEventsByBand", {
  type: "Event",
  list: true,
  args: {
    bandId: arg({ type: "String", required: true }),
  },
  resolve: (_parent, { bandId }) => fetchEventsByBand(bandId),
});

export const getEventTypeById = queryField("getEventTypeById", {
  type: "EventType",
  args: {
    id: arg({ type: "String", required: true }),
    bandId: arg({ type: "String", required: true }),
  },
  resolve: (_parent, { id, bandId }) => fetchEventTypeById(id, bandId),
});
