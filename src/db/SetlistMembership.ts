import dynamoose from "dynamoose";

import BaseSchema from "./BaseSchema";
import type { Key, BaseDocument } from "./types";
import {
  BAND_KEY_PREFIX,
  SETLIST_KEY_PREFIX,
  SONG_KEY_PREFIX,
} from "./constants";

const SetlistMembershipSchema = new dynamoose.Schema(
  {
    pk: {
      ...BaseSchema.pk,
      get: (value) => (value as string).slice(SETLIST_KEY_PREFIX.length),
      set: (value) => SETLIST_KEY_PREFIX + value,
    },
    sk: {
      ...BaseSchema.sk,
      get: (value) => (value as string).slice(SONG_KEY_PREFIX.length),
      set: (value) => SONG_KEY_PREFIX + value,
    },
    songTitle: String,
    setlistTitle: String,
    bandId: {
      type: String,
      get: (value) => (value as string).slice(BAND_KEY_PREFIX.length),
      set: (value) => BAND_KEY_PREFIX + value,
    },
  },
  {
    timestamps: true,
  },
);

export interface SetlistMembershipDocument extends BaseDocument {
  songTitle: string;
  setlistTitle: string;
  bandId: string;
}

export const SetlistMembershipModel = dynamoose.model<
SetlistMembershipDocument
>("BandApp", SetlistMembershipSchema, {
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

export const getSetlistMembershipQueryFromSetlistId = (
  setlistId: string,
): Key => ({
  pk: SETLIST_KEY_PREFIX + setlistId,
  sk: { beginsWith: SONG_KEY_PREFIX },
});

export const getSetlistMembershipQueryFromSongId = (songId: string): Key => ({
  pk: { beginsWith: SETLIST_KEY_PREFIX },
  sk: SONG_KEY_PREFIX + songId,
});
