export function calculateNights(checkIn: string | Date, checkOut: string | Date) {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  return Math.max(0, Math.ceil((end - start) / 86_400_000));
}
