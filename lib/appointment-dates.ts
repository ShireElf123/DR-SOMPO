export const PRACTICE_TIMEZONE = "Africa/Johannesburg";

/** A calendar date in the practice timezone, independent of the visitor/server timezone. */
export function practiceToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: PRACTICE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

/** UTC is used only as a timezone-free carrier for a date, never for a local-noon conversion. */
export function parseCalendarDate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === iso
    ? date
    : null;
}

/** Add calendar days without browser-timezone or daylight-saving shifts. */
export function addCalendarDays(iso: string, days: number): string {
  const date = parseCalendarDate(iso);
  if (!date || !Number.isInteger(days)) return "";
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function upcomingWeekdays(today: string, count = 10): string[] {
  const cursor = parseCalendarDate(today);
  if (!cursor) return [];
  const dates: string[] = [];
  while (dates.length < count) {
    if (cursor.getUTCDay() !== 0 && cursor.getUTCDay() !== 6)
      dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

export function isValidPreferredDate(
  value: string,
  today = practiceToday(),
): boolean {
  const requested = parseCalendarDate(value);
  const start = parseCalendarDate(today);
  if (!requested || !start) return false;
  const days = (requested.getTime() - start.getTime()) / 86_400_000;
  return days >= 0 && days <= 90;
}

export function formatAppointmentDate(
  iso: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const date = parseCalendarDate(iso);
  return date
    ? new Intl.DateTimeFormat("en-ZA", { ...options, timeZone: "UTC" }).format(
        date,
      )
    : "";
}
