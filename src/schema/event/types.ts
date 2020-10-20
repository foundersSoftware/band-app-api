import {
  asNexusMethod,
  enumType,
  inputObjectType,
  objectType,
} from "@nexus/schema";
import { GraphQLDate, GraphQLTime } from "graphql-iso-date";

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
    t.field("type", { type: "EventType", required: true });
    t.boolean("paid", { default: false, required: true });
  },
});

export const EventType = enumType({
  name: "EventType",
  members: ["PRACTICE", "GIG"],
});
