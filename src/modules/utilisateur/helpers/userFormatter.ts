// src/modules/utilisateur/helpers/userFormatter.ts

import { User } from "@prisma/client";

export type SafeUser = Omit<User, "password">;

export const formatUserResponse = (user: User): SafeUser => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const formatUsersResponse = (users: User[]): SafeUser[] => {
  return users.map(formatUserResponse);
};

export default {
  formatUserResponse,
  formatUsersResponse,
};
