import shortid from "shortid";
import { BandDocument, BandModel } from "../db";
import { BAND_KEY_PREFIX } from "./constants";
import type {
  Band, BandCreateInput, BandId, BandKey,
} from "./types";

const getBandRecordFromBand = (band: Band): BandDocument => {
  const key = BAND_KEY_PREFIX + band.id;
  return new BandModel({
    pk: key,
    sk: key,
    name: band.name,
    location: band.location,
  });
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

const getBandFromBandRecord = (bandRecord: BandDocument): Band => ({
  id: bandRecord.pk.slice(BAND_KEY_PREFIX.length),
  name: bandRecord.name,
  location: bandRecord.location,
});

export const createBand = async (bandCreateInput: BandCreateInput) => {
  try {
    const band = getBandFromCreateInput(bandCreateInput);
    const bandRecord = getBandRecordFromBand(band);
    await bandRecord.save();
    return band;
  } catch (e) {
    throw new Error(`Failed to create band with name: ${bandCreateInput.name}`);
  }
};

export const fetchBandById = async (id: BandId) => {
  try {
    const bandRecord = await BandModel.get({ ...getBandKeyFromId(id) });
    return getBandFromBandRecord(bandRecord);
  } catch (e) {
    throw new Error(`Failed to fetch band with id: ${id}`);
  }
};

export const fetchBandsByIds = async (ids: BandId[]) => {
  try {
    if (!ids.length) {
      return [];
    }
    const bandRecords = await BandModel.batchGet(
      ids.map((id) => ({ ...getBandKeyFromId(id) })),
    );
    return bandRecords.map((record: BandDocument) => getBandFromBandRecord(record));
  } catch (e) {
    throw new Error(e.message);
  }
};
