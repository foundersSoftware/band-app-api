import shortid from "shortid";
import { BandModel } from "../db";
import { BAND_KEY_PREFIX } from "./constants";
import type {
  Band,
  BandCreateInput,
  BandId,
  BandKey,
  BandRecord,
  PrefixedBandId,
} from "./types";

const isBandRecord = (document: unknown): document is BandRecord => {
  const band = document as BandRecord;
  return (
    band.pk !== undefined &&
    band.pk.startsWith(BAND_KEY_PREFIX) &&
    band.sk === band.pk
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

const getBandFromCreateInput = (band: BandCreateInput): Band => ({
  id: shortid.generate(),
  ...band,
});

const getBandKeyFromId = (id: BandId): BandKey => {
  // depending on who called this function, the bandId may or may not already
  // be prefixed
  const key = id.startsWith(BAND_KEY_PREFIX) ? id : BAND_KEY_PREFIX + id;
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
    const band = getBandFromCreateInput(bandCreateInput);
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

export const fetchBandsByIds = async (ids: BandId[]) => {
  try {
    const bandRecords = await BandModel.batchGet(
      ids.map((id) => ({ ...getBandKeyFromId(id) }))
    );
    return bandRecords
      .filter((record) => isBandRecord(record))
      .map((record) =>
        getBandFromBandRecord((record as unknown) as BandRecord)
      );
  } catch (e) {
    throw new Error(e.message);
  }
};
