import { arg, mutationField } from "@nexus/schema";
import { createEventType } from "../../models/eventType";
import { createEvent } from "../../models/event";

export const createOneEvent = mutationField("createOneEvent", {
  type: "Event",
  args: {
    event: arg({ type: "EventCreateInput", required: true }),
  },
  resolve: async (_parent, { event }, { user }) => {
    try {
      if (!user) {
        throw new Error("Not Authenticated");
      }
      // todo: make sure the user belongs to the band

      return await createEvent(event);
    } catch (e) {
      throw new Error(`Failed to create event with error: ${e.message}`);
    }
  },
});

export const createOneEventType = mutationField("createEventType", {
  type: "EventType",
  args: {
    eventType: arg({ type: "EventTypeCreateInput", required: true }),
  },
  resolve: async (_parent, { eventType }, { user }) => {
    try {
      if (!user) {
        throw new Error("Not Authenticated");
      }
      // todo: make sure the user belongs to the band

      return await createEventType(eventType);
    } catch (e) {
      throw new Error(`Failed to create event type with error: ${e.message}`);
    }
  },
});
