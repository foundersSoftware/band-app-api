import {
  BandMembershipModel,
  BandMembershipDocument,
  getBandMembershipKeyFromBandId,
  getBandMembershipKeyFromUserId,
} from "../db";
import { fetchBandById } from "./band";
import type {
  BandMemberRole,
  BandId,
  User,
  BandMembership,
  Email,
  Band,
} from "./types";

const getRecordFromBandMembership = (
  membership: BandMembership,
): BandMembershipDocument => new BandMembershipModel({
  pk: membership.bandId,
  sk: membership.userEmail,
  role: membership.userRole,
  bandName: membership.bandName,
});

const getBandFromMembershipRecord = (record: BandMembershipDocument): Band => ({
  id: record.pk,
  name: record.bandName,
});

const getUserFromMembershipRecord = (record: BandMembershipDocument): User => ({
  email: record.sk,
  // password is required, but can (and should) be empty
  password: "",
});

export const addUserToBand = async (
  email: Email,
  bandId: BandId,
  role: BandMemberRole,
) => {
  try {
    const band = await fetchBandById(bandId);
    const bandMembershipRecord = getRecordFromBandMembership({
      bandId: band.id,
      bandName: band.name,
      userEmail: email,
      userRole: role,
    });
    await bandMembershipRecord.save();
  } catch (e) {
    throw new Error(e.message);
  }
};

export const fetchUsersByBand = async (band: Band): Promise<User[]> => {
  try {
    const membershipRecords = await BandMembershipModel.query(
      getBandMembershipKeyFromBandId(band.id),
    ).exec();

    const users = membershipRecords.map((record) => getUserFromMembershipRecord(record));
    return users;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const fetchBandsByUser = async (user: User) => {
  try {
    const membershipRecords = await BandMembershipModel.query(
      getBandMembershipKeyFromUserId(user.email),
    )
      // this is the secret sauce of single-table relationships
      // todo: rename this index to something not autogenerated
      .using("skGlobalIndex")
      .exec();

    const bands = membershipRecords.map((record: BandMembershipDocument) => getBandFromMembershipRecord(record));
    return bands;
  } catch (e) {
    throw new Error(e.message);
  }
};
