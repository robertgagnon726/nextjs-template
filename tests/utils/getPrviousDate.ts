// Utility function to generate a future date in MM-DD-YYYY format
export function getPreviousDate(daysFromNow: number) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() - daysFromNow);

  const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(futureDate.getDate()).padStart(2, '0');
  const year = futureDate.getFullYear();

  return `${month}-${day}-${year}`;
}
