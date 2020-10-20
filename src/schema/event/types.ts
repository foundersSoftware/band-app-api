import { asNexusMethod, inputObjectType, objectType } from "@nexus/schema";
import { GraphQLDate, GraphQLTime } from "graphql-iso-date";
import { fetchEventTypeById } from "../../models/eventType";

export const GQLDate = asNexusMethod(GraphQLDate, "date");
export const GQLTime = asNexusMethod(GraphQLTime, "time");

export const Event = objectType({
  name: "Event",
  definition(t) {
    t.string("id");
    t.string("bandId");
    t.string("name");
    t.field("type", {
      type: "EventType",
      resolve: async (parent) => fetchEventTypeById(parent.typeId, parent.bandId),
    });
    t.date("date");
    t.time("calltime");
    t.boolean("paid");
  },
});

export const EventCreateInput = inputObjectType({
  name: "EventCreateInput",
  definition(t) {
    t.string("bandId", { required: true });
    t.string("name", { required: true });
    t.date("date", { required: true });
    t.time("calltime", { required: true });
    t.field("typeId", { type: "String", required: true });
    t.boolean("paid", { default: false, required: true });
  },
});

export const EventType = objectType({
  name: "EventType",
  definition(t) {
    t.string("id");
    t.string("bandId");
    t.string("name");
    t.string("color");
  },
});

export const EventTypeCreateInput = inputObjectType({
  name: "EventTypeCreateInput",
  definition(t) {
    t.string("bandId", { required: true });
    t.string("name", { required: true });
    t.string("color", { required: true });
  },
});
