import dynamoose from "dynamoose";

import BaseSchema from "./BaseSchema";
import type { Key, BaseDocument } from "./types";
import { BAND_KEY_PREFIX, SONG_KEY_PREFIX } from "./constants";

const SongSchema = new dynamoose.Schema(
  {
    pk: {
      ...BaseSchema.pk,
      get: (value) => (value as string).slice(BAND_KEY_PREFIX.length),
      set: (value) => BAND_KEY_PREFIX + value,
    },
    sk: {
      ...BaseSchema.sk,
      get: (value) => (value as string).slice(SONG_KEY_PREFIX.length),
      set: (value) => SONG_KEY_PREFIX + value,
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export interface SongDocument extends BaseDocument {
  name: string;
}

export const SongModel = dynamoose.model<SongDocument>("BandApp", SongSchema, {
  create: process.env.NODE_ENV === "development",
  waitForActive: {
    enabled: process.env.NODE_ENV === "development",
    check: {
      // defaults (only valid in development)
      timeout: 180000,
      frequency: 1000,
    },
  },
});

export const getSongsByBandQueryKey = (id: string): Key => ({
  pk: BAND_KEY_PREFIX + id,
  sk: { beginsWith: SONG_KEY_PREFIX },
});
