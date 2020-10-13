import {
  SetlistMembershipModel,
  SetlistMembershipDocument,
  getSetlistMembershipQueryFromSetlistId,
  getSetlistMembershipQueryFromSongId,
} from "../db";
import { fetchSetlistById } from "./setlist";
import { fetchSongById } from "./song";
import type {
  SetlistId,
  SetlistMembership,
  Setlist,
  Song,
  SongId,
  BandId,
} from "./types";

const getRecordFromSetlistMembership = (
  membership: SetlistMembership,
): SetlistMembershipDocument => new SetlistMembershipModel({
  pk: membership.setlistId,
  sk: membership.songId,
  songTitle: membership.songTitle,
  setlistTitle: membership.setlistTitle,
  bandId: membership.bandId,
});

const getSetlistFromMembershipRecord = (
  record: SetlistMembershipDocument,
): Setlist => ({
  id: record.pk,
  bandId: record.bandId,
  title: record.setlistTitle,
});

const getSongFromMembershipRecord = (
  record: SetlistMembershipDocument,
): Song => ({
  id: record.sk,
  bandId: record.bandId,
  title: record.songTitle,
});

export const addSongToSetlist = async (
  songId: SongId,
  setlistId: SetlistId,
  bandId: BandId,
) => {
  try {
    // not idea, but we need the bandId so...go get the whole setlist document...
    const setlist = await fetchSetlistById(setlistId, bandId);
    // we also need info about the song...so... i'm starting to get the feeling
    // im doing dynamodb all wrong...
    // but its either this OR adding another fetch at read time.  I don't see any
    // way around it
    const song = await fetchSongById(songId, bandId);

    const setlistMembershipRecord = getRecordFromSetlistMembership({
      setlistId,
      songId,
      bandId,
      setlistTitle: setlist.title,
      songTitle: song.title,
    });
    await setlistMembershipRecord.save();
  } catch (e) {
    throw new Error(e.message);
  }
};

export const fetchSongsBySetlistId = async (
  setlistId: SetlistId,
): Promise<Song[]> => {
  try {
    const membershipRecords = await SetlistMembershipModel.query(
      getSetlistMembershipQueryFromSetlistId(setlistId),
    ).exec();

    const songs = membershipRecords.map((record) => getSongFromMembershipRecord(record));
    return songs;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const fetchSetlistsBySongId = async (songId: SongId) => {
  try {
    const membershipRecords = await SetlistMembershipModel.query(
      getSetlistMembershipQueryFromSongId(songId),
    )
      .using("skGlobalIndex")
      .exec();

    const setlists = membershipRecords.map(
      (record: SetlistMembershipDocument) => getSetlistFromMembershipRecord(record),
    );
    return setlists;
  } catch (e) {
    throw new Error(e.message);
  }
};
