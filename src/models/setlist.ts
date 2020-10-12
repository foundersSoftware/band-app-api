import shortid from "shortid";
import {
  SetlistDocument,
  SetlistModel,
  getSetlistsByBandQueryKey,
  getSetlistByIdKey,
} from "../db";
import type {
  SetlistCreateInput, Setlist, BandId, SetlistId,
} from "./types";

const getSetlistFromRecord = (setlistRecord: SetlistDocument): Setlist => ({
  id: setlistRecord.sk,
  title: setlistRecord.setlistTitle,
  bandId: setlistRecord.pk,
});

const getSetlistFromCreateInput = (
  createInput: SetlistCreateInput,
): Setlist => ({
  id: shortid.generate(),
  ...createInput,
});

const getRecordFromSetlist = (setlist: Setlist): SetlistDocument => new SetlistModel({
  pk: setlist.bandId,
  sk: setlist.id,
  setlistTitle: setlist.title,
});

export const createSetlist = async (
  createInput: SetlistCreateInput,
): Promise<Setlist> => {
  try {
    const setlist = getSetlistFromCreateInput(createInput);
    const setlistRecord = getRecordFromSetlist(setlist);
    await setlistRecord.save();
    return setlist;
  } catch (e) {
    throw new Error(
      `Failed to create setlist with title: ${createInput.title} with error: ${e.message}`,
    );
  }
};

export const fetchSetlistsByBand = async (bandId: BandId) => {
  try {
    const setlistRecords = await SetlistModel.query(
      getSetlistsByBandQueryKey(bandId),
    ).exec();
    return setlistRecords.map((record) => getSetlistFromRecord(record));
  } catch (e) {
    throw new Error(
      `Failed to fetch setlists for band with id: ${bandId} with error: ${e.message}`,
    );
  }
};

export const fetchSetlistById = async (
  setlistId: SetlistId,
  bandId: BandId,
) => {
  try {
    const key = getSetlistByIdKey(setlistId, bandId);
    const setlistRecord = await SetlistModel.get(
      getSetlistByIdKey(setlistId, bandId),
    );

    return getSetlistFromRecord(setlistRecord);
  } catch (e) {
    throw new Error(
      `Failed to fetch setlist with id: ${setlistId} with error: ${e.message}`,
    );
  }
};
