export type Email = string;
export type Password = string;

export type UserId = Email;
export type PrefixedUserId = string;

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
