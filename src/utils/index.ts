export const isVIP = (user: any): boolean => {
  if (!user || new Date(user.vipExpiredAt).getTime() > new Date().getTime()) {
    return true;
  }
  return false;
};
