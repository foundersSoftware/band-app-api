import { arg, queryField } from "@nexus/schema";
import { fetchEventsByBand } from "../../models/event";

export const getEventsByBand = queryField("findEventsByBand", {
  type: "Event",
  list: true,
  args: {
    bandId: arg({ type: "String", required: true }),
  },
  resolve: (_parent, { bandId }) => fetchEventsByBand(bandId),
});

