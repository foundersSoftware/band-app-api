import dynamoose from "dynamoose";

import BaseSchema from "./BaseSchema";
import type { Key, BaseDocument } from "./types";
import { BAND_KEY_PREFIX } from "./constants";

const BandSchema = new dynamoose.Schema(
  {
    pk: {
      ...BaseSchema.pk,
      get: (value) => (value as string).slice(BAND_KEY_PREFIX.length),
      set: (value) => BAND_KEY_PREFIX + value,
    },
    sk: {
      ...BaseSchema.sk,
      get: (value) => (value as string).slice(BAND_KEY_PREFIX.length),
      set: (value) => BAND_KEY_PREFIX + value,
    },
    bandName: {
      type: String,
    },
    bandLocation: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export interface BandDocument extends BaseDocument {
  bandName: string;
  bandLocation: string;
}

export const BandModel = dynamoose.model<BandDocument>("BandApp", BandSchema, {
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

export const getBandKeyFromId = (id: string): Key => ({
  pk: BAND_KEY_PREFIX + id,
  sk: BAND_KEY_PREFIX + id,
});
