import dynamoose from "dynamoose";

import BaseSchema from "./BaseSchema";
import type { Key, BaseDocument } from "./types";
import { BAND_KEY_PREFIX, EVENT_TYPE_KEY_PREFIX } from "./constants";

const EventTypeSchema = new dynamoose.Schema(
  {
    pk: {
      ...BaseSchema.pk,
      get: (value) => (value as string).slice(BAND_KEY_PREFIX.length),
      set: (value) => BAND_KEY_PREFIX + value,
    },
    sk: {
      ...BaseSchema.sk,
      get: (value) => (value as string).slice(EVENT_TYPE_KEY_PREFIX.length),
      set: (value) => EVENT_TYPE_KEY_PREFIX + value,
    },
    eventTypeName: String,
    eventTypeColor: String,
  },
  {
    timestamps: true,
  },
);

export interface EventTypeDocument extends BaseDocument {
  eventTypeName: string;
  eventTypeColor: string;
}

export const EventTypeModel = dynamoose.model<EventTypeDocument>(
  "BandApp",
  EventTypeSchema,
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

export const getEventTypeKey = (eventTypeId: string, bandId: string) => ({
  pk: BAND_KEY_PREFIX + bandId,
  sk: EVENT_TYPE_KEY_PREFIX + eventTypeId,
});

export const getEventTypesByBandQueryKey = (id: string): Key => ({
  pk: BAND_KEY_PREFIX + id,
  sk: { beginsWith: EVENT_TYPE_KEY_PREFIX },
});
