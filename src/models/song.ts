import shortid from "shortid";
import { SongDocument, SongModel, getSongsByBandQueryKey } from "../db";
import type { SongCreateInput, Song, BandId } from "./types";

const getSongFromRecord = (songRecord: SongDocument): Song => ({
  id: songRecord.sk,
  bandId: songRecord.pk,
  title: songRecord.name,
});

const getSongFromCreateInput = (createInput: SongCreateInput): Song => ({
  id: shortid.generate(),
  ...createInput,
});

const getRecordFromSong = (model: Song): SongDocument =>
  new SongModel({
    pk: model.bandId,
    sk: model.id,
    name: model.title,
  });

export const createSong = async (song: SongCreateInput): Promise<Song> => {
  try {
    const songModel = getSongFromCreateInput(song);
    const songRecord = getRecordFromSong(songModel);
    await songRecord.save();
    return songModel;
  } catch (e) {
    throw new Error(`Failed to create song with title: ${song.title}`);
  }
};

export const fetchSongsByBand = async (bandId: BandId) => {
  try {
    const songRecords = await SongModel.query(
      getSongsByBandQueryKey(bandId)
    ).exec();
    return songRecords.map((record) => getSongFromRecord(record));
  } catch (e) {
    throw new Error(`Failed to fetch songs for band with id: ${bandId}`);
  }
};
