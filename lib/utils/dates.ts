export function toShortISOString(date: Date): string {
  const year = date.getUTCFullYear().toString();
  const month = (date.getUTCMonth() + 1).toString();
  const day = date.getUTCDate().toString();
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
