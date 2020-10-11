import dynamoose from "dynamoose";

import BaseSchema from "./BaseSchema";
import type { Key, BaseDocument } from "./types";
import { USER_KEY_PREFIX, BAND_KEY_PREFIX } from "./constants";

const BandMembershipSchema = new dynamoose.Schema(
  {
    pk: {
      ...BaseSchema.pk,
      get: (value) => (value as string).slice(BAND_KEY_PREFIX.length),
      set: (value) => BAND_KEY_PREFIX + value,
    },
    sk: {
      ...BaseSchema.sk,
      get: (value) => (value as string).slice(USER_KEY_PREFIX.length),
      set: (value) => USER_KEY_PREFIX + value,
    },
    role: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export interface BandMembershipDocument extends BaseDocument {
  role: string;
}

export const BandMembershipModel = dynamoose.model<BandMembershipDocument>(
  "BandApp",
  BandMembershipSchema,
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

export const getBandMembershipKeyFromBandId = (bandId: string): Key => ({
  pk: BAND_KEY_PREFIX + bandId,
  sk: { beginsWith: USER_KEY_PREFIX },
});

export const getBandMembershipKeyFromUserId = (userId: string): Key => ({
  pk: { beginsWith: BAND_KEY_PREFIX },
  sk: USER_KEY_PREFIX + userId,
});
