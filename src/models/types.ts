export type Email = string;
export type Password = string;

export type UserId = Email;
export type PrefixedUserId = string;
export type BandId = string;
export type PrefixedBandId = string;
export type BandName = string;
export type BandMemberRole = string;
export type Location = string;

export interface UserCreateInput {
  email: Email;
  password: Password;
}

export interface BandCreateInput {
  name: BandName;
  location: Location;
}

export interface BandMembership {
  bandName: BandName;
  bandLocation: Location;
  bandId: BandId;
  userRole: BandMemberRole;
  userEmail: Email;
}

export interface User {
  email: Email;
  password: Password;
  bands?: Band[];
}

export interface Band {
  name: BandName;
  location: Location;
  id: BandId;
  members?: User[];
}

export interface BandKey {
  pk: PrefixedBandId;
  sk: PrefixedBandId;
}
