import { BandModel } from "../db";
import { BAND_KEY_PREFIX, USER_KEY_PREFIX } from "./constants";
import type {
  BandMemberRole,
  BandMembershipRecord,
  UserId,
  BandId,
  UserRecord,
} from "./types";
import { getUserFromUserRecord, isUserRecord } from "./user";

const isBandMembershipRecord = (
  document: unknown,
): document is BandMembershipRecord => {
  const record = document as BandMembershipRecord;
  return (
    record.pk.startsWith(BAND_KEY_PREFIX)
    && record.sk.startsWith(USER_KEY_PREFIX)
  );
};

const getBandMembershipRecord = (
  userId: UserId,
  bandId: BandId,
  role: BandMemberRole,
): BandMembershipRecord => ({
  pk: BAND_KEY_PREFIX + bandId,
  sk: USER_KEY_PREFIX + userId,
  role,
});

const getBandMemberQuery = (bandId: BandId) => ({
  pk: {
    eq: BAND_KEY_PREFIX + bandId,
  },
  sk: {
    beginsWith: USER_KEY_PREFIX,
  },
});

export const addUserToBand = (
  userId: UserId,
  bandId: BandId,
  role: BandMemberRole,
) => {
  try {
    BandModel.create(getBandMembershipRecord(userId, bandId, role));
  } catch (e) {
    throw new Error(
      `Failed to add user with id: ${userId} to band with id: ${bandId} with error: ${e.message}`,
    );
  }
};

export const fetchUsersByBandId = async (bandId: BandId) => {
  try {
    // i will have to circle back and improve this performance later
    const membershipRecords = await BandModel.query(
      getBandMemberQuery(bandId),
    ).exec();

    const keys = membershipRecords
      .filter((record) => isBandMembershipRecord(record))
      .map((record) => {
        const membershipRecord = (record as unknown) as BandMembershipRecord;
        return {
          pk: membershipRecord.sk,
          sk: membershipRecord.sk,
        };
      });

    const userRecords = await BandModel.batchGet(keys);
    return userRecords
      .filter((record) => isUserRecord(record))
      .map((record) => getUserFromUserRecord((record as unknown) as UserRecord));
  } catch (e) {
    throw new Error(e.message);
  }
};

// todo: implement this function
// export const fetchBandsByUser = async (user: User) => {};
