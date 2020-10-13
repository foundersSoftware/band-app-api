export type Email = string;
export type Password = string;

export type UserId = Email;
export type PrefixedUserId = string;
export type BandId = string;
export type PrefixedBandId = string;
export type BandName = string;
export type BandMemberRole = string;
export type Location = string;
export type SongId = string;
export type SongTitle = string;

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
  bandId: BandId;
  userRole: BandMemberRole;
  userEmail: Email;
}

export interface UserDetails {}

export interface User {
  email: Email;
  password: Password;
  bands?: Band[];
  details?: UserDetails;
}

export interface BandDetails {
  location: Location;
}

export interface Band {
  name: BandName;
  id: BandId;
  songs?: Song[];
  members?: User[];
  details?: BandDetails;
}

export interface DetailedBand extends Band {
  details: BandDetails;
}

export interface BandKey {
  pk: PrefixedBandId;
  sk: PrefixedBandId;
}

export interface SongCreateInput {
  bandId: BandId;
  title: SongTitle;
}

export interface Song {
  id: SongId;
  bandId: BandId;
  title: SongTitle;
}
