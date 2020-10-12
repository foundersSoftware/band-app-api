import shortid from "shortid";
import { BandDocument, BandModel, getBandKeyFromId } from "../db";
import type {
  Band, BandCreateInput, BandId, DetailedBand,
} from "./types";

const getBandRecordFromBand = (band: Band): BandDocument => new BandModel({
  pk: band.id,
  sk: band.id,
  bandName: band.name,
  bandLocation: band.details?.location,
});

const getBandFromCreateInput = (band: BandCreateInput): Band => ({
  id: shortid.generate(),
  name: band.name,
  details: {
    location: band.location,
  },
});

const getBandFromBandRecord = (bandRecord: BandDocument): DetailedBand => ({
  id: bandRecord.pk,
  name: bandRecord.bandName,
  details: {
    location: bandRecord.bandLocation,
  },
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

export const fetchBandDetails = async (band: Band) => {
  // it is possible (and likely) that the details are already available
  if (band.details) {
    return band.details;
  }
  const detailedBand = await fetchBandById(band.id);
  return detailedBand.details;
};
