export type Email = string;
export type Password = string;

export type UserId = Email;
export type PrefixedUserId = string;
export type BandId = string;
export type PrefixedBandId = string;
export type BandName = string;
export type BandMemberRole = string;
export type Location = string;

export interface UserCredentials {
  email: Email;
  password: Password;
}

export interface User {
  email: Email;
  password: Password;
}

export interface UserKey {
  pk: PrefixedUserId;
  sk: PrefixedUserId;
}

export interface UserRecord extends UserKey {
  password: Password;
}

export interface BandCreateInput {
  name: BandName;
  location: Location;
}

export interface Band extends BandCreateInput {
  id: BandId;
}

export interface BandKey {
  pk: PrefixedBandId;
  sk: PrefixedBandId;
}

export interface BandRecord extends BandKey {
  name: BandName;
  location: Location;
}
