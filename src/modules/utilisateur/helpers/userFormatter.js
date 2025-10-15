export function formatUserResponse(user) {
  if (!user) return null;

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function formatUsersResponse(users) {
  return users.map(formatUserResponse);
}
