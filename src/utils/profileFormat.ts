export function formatLongDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ageFromBirthdate(birthdate: Date | undefined): number | null {
  if (!birthdate || Number.isNaN(birthdate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age -= 1;
  }
  return age;
}
