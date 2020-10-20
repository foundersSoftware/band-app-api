import dynamoose from "dynamoose";

import BaseSchema from "./BaseSchema";
import type { Key, BaseDocument } from "./types";
import { BAND_KEY_PREFIX, EVENT_KEY_PREFIX } from "./constants";

const EventSchema = new dynamoose.Schema(
  {
    pk: {
      ...BaseSchema.pk,
      get: (value) => (value as string).slice(BAND_KEY_PREFIX.length),
      set: (value) => BAND_KEY_PREFIX + value,
    },
    sk: {
      ...BaseSchema.sk,
      get: (value) => (value as string).slice(EVENT_KEY_PREFIX.length),
      set: (value) => EVENT_KEY_PREFIX + value,
    },
    eventName: String,
    eventType: String,
    eventIsPaid: Boolean,
    eventDate: Date,
    eventTime: Date,
  },
  {
    timestamps: true,
  },
);

export interface EventDocument extends BaseDocument {
  eventName: string;
  eventType: string;
  eventIsPaid: boolean;
  eventDate: Date;
  eventTime: Date;
}

export const EventModel = dynamoose.model<EventDocument>(
  "BandApp",
  EventSchema,
  {
    create: process.env.NODE_ENV === "development",
    waitForActive: {
      enabled: process.env.NODE_ENV === "development",
      check: {
        // defaults (only valid in development)
        timeout: 180000,
        frequency: 1000,
      },
    },
  },
);

// export const getEventByIdKey = (eventId: string, bandId: string) => ({
// pk: BAND_KEY_PREFIX + bandId,
// sk: EVENT_KEY_PREFIX + eventId,
// });

export const getEventsByBandQueryKey = (id: string): Key => ({
  pk: BAND_KEY_PREFIX + id,
  sk: { beginsWith: EVENT_KEY_PREFIX },
});
