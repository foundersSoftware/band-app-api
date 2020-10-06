import shortid from "shortid";
import { BandModel } from "../db";
import { BAND_KEY_PREFIX } from "./constants";
import type {
  Band,
  BandCreateInput,
  BandId,
  BandKey,
  BandRecord,
} from "./types";

const isBandRecord = (document: unknown): document is BandRecord => {
  const band = document as BandRecord;
  return (
    band.pk !== undefined
    && band.pk.startsWith(BAND_KEY_PREFIX)
    && band.sk === band.pk
  );
};

const getBandRecordFromBand = (band: Band): BandRecord => {
  const key = BAND_KEY_PREFIX + band.id;

  return {
    pk: key,
    sk: key,
    name: band.name,
    location: band.location,
  };
};

const getBandFromBandCreateInput = (
  bandCreateInput: BandCreateInput,
): Band => ({
  id: shortid.generate(),
  ...bandCreateInput,
});

const getBandKeyFromId = (id: BandId): BandKey => {
  const key = BAND_KEY_PREFIX + id;
  return {
    pk: key,
    sk: key,
  };
};

const getBandFromBandRecord = (bandRecord: BandRecord): Band => ({
  id: bandRecord.pk.slice(BAND_KEY_PREFIX.length),
  name: bandRecord.name,
  location: bandRecord.location,
});

export const createBand = async (bandCreateInput: BandCreateInput) => {
  try {
    const band = getBandFromBandCreateInput(bandCreateInput);
    await BandModel.create(getBandRecordFromBand(band));
    return band;
  } catch (e) {
    throw new Error(`Failed to create band with name: ${bandCreateInput.name}`);
  }
};

export const fetchBandById = async (id: BandId) => {
  try {
    const bandRecord = await BandModel.get({ ...getBandKeyFromId(id) });

    if (!isBandRecord(bandRecord)) {
      throw new Error("document is not a BandRecord");
    }

    return getBandFromBandRecord(bandRecord);
  } catch (e) {
    throw new Error(`Failed to fetch band with id: ${id}`);
  }
};
