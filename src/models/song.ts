import shortid from "shortid";
import { SongDocument, SongModel, getSongsByBandQueryKey } from "../db";
import type { SongCreateInput, Song, BandId } from "./types";

const getSongFromRecord = (songRecord: SongDocument): Song => ({
  id: songRecord.sk,
  title: songRecord.songTitle,
  bandId: songRecord.pk,
});

const getSongFromCreateInput = (createInput: SongCreateInput): Song => ({
  id: shortid.generate(),
  ...createInput,
});

const getRecordFromSong = (model: Song): SongDocument => new SongModel({
  pk: model.bandId,
  sk: model.id,
  songTitle: model.title,
});

export const createSong = async (
  createInput: SongCreateInput,
): Promise<Song> => {
  try {
    const song = getSongFromCreateInput(createInput);
    const songRecord = getRecordFromSong(song);
    await songRecord.save();
    return song;
  } catch (e) {
    throw new Error(`Failed to create song with title: ${createInput.title}`);
  }
};

export const fetchSongsByBand = async (bandId: BandId) => {
  try {
    const songRecords = await SongModel.query(
      getSongsByBandQueryKey(bandId),
    ).exec();
    return songRecords.map((record) => getSongFromRecord(record));
  } catch (e) {
    throw new Error(`Failed to fetch songs for band with id: ${bandId}`);
  }
};
