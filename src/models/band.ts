import shortid from "shortid";
import { BandDocument, BandModel, getBandKeyFromId } from "../db";
import type { Band, BandCreateInput, BandId } from "./types";

const getBandRecordFromBand = (band: Band): BandDocument => new BandModel({
  pk: band.id,
  sk: band.id,
  name: band.name,
  location: band.location,
});

const getBandFromCreateInput = (band: BandCreateInput): Band => ({
  id: shortid.generate(),
  ...band,
});

const getBandFromBandRecord = (bandRecord: BandDocument): Band => ({
  id: bandRecord.pk,
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
    const bandRecords = await BandModel.batchGet(
      ids.map((id) => ({ ...getBandKeyFromId(id) })),
    );
    return bandRecords.map((record: BandDocument) => getBandFromBandRecord(record));
  } catch (e) {
    throw new Error(e.message);
  }
};
