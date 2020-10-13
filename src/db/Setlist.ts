import dynamoose from "dynamoose";

import BaseSchema from "./BaseSchema";
import type { Key, BaseDocument } from "./types";
import { BAND_KEY_PREFIX, SETLIST_KEY_PREFIX } from "./constants";

const SetlistSchema = new dynamoose.Schema(
  {
    pk: {
      ...BaseSchema.pk,
      get: (value) => (value as string).slice(BAND_KEY_PREFIX.length),
      set: (value) => BAND_KEY_PREFIX + value,
    },
    sk: {
      ...BaseSchema.sk,
      get: (value) => (value as string).slice(SETLIST_KEY_PREFIX.length),
      set: (value) => SETLIST_KEY_PREFIX + value,
    },
    setlistTitle: String,
  },
  {
    timestamps: true,
  },
);

export interface SetlistDocument extends BaseDocument {
  setlistTitle: string;
}

export const SetlistModel = dynamoose.model<SetlistDocument>(
  "BandApp",
  SetlistSchema,
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

export const getSetlistByIdKey = (setlistId: string, bandId: string) => ({
  pk: BAND_KEY_PREFIX + bandId,
  sk: SETLIST_KEY_PREFIX + setlistId,
});

export const getSetlistsByBandQueryKey = (id: string): Key => ({
  pk: BAND_KEY_PREFIX + id,
  sk: { beginsWith: SETLIST_KEY_PREFIX },
});
