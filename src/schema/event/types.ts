import {
  asNexusMethod,
  enumType,
  inputObjectType,
  objectType,
} from "@nexus/schema";
// import { fetchSetlistsByEventId } from "../../models/setlistMembership";
import { GraphQLDate, GraphQLTime } from "graphql-iso-date";
// import { fetchBandById } from "../../models/band";

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
    // t.field("band", {
    // type: "Band",
    // description:
    // "Costs a Query, if you just need the band Id, use bandId instead!",
    // resolve: async (parent) => fetchBandById(parent.bandId),
    // });
  },
});

export const EventCreateInput = inputObjectType({
  name: "EventCreateInput",
  definition(t) {
    t.string("bandId", { required: true });
    t.string("name", { required: true });
    t.date("date", { required: true });
    t.time("time", { required: true });
    t.field("type", { type: "EventType", required: true });
    t.boolean("paid", { default: false });
  },
});

export const EventType = enumType({
  name: "EventType",
  members: ["PRACTICE", "GIG"],
});
