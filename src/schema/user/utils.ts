import type { User } from "./backingType.d";

export const isUser = (input: any): input is User => {
  const user = input as User;
  return user.email !== undefined && user.password !== undefined;
};
