export function generateShortCode(length = 6) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let short = "";
  for (let i = 0; i < length; i++) {
    short += chars[Math.floor(Math.random() * chars.length)];
  }
  return short;
}
