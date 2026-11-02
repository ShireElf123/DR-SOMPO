import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addCalendarDays,
  practiceToday,
  parseCalendarDate,
  upcomingWeekdays,
  formatAppointmentDate,
  isValidPreferredDate,
} from "../lib/appointment-dates";

test("practice calendar rolls over at SAST midnight, not browser or UTC midnight", () => {
  assert.equal(practiceToday(new Date("2026-11-01T21:59:00Z")), "2026-11-01");
  assert.equal(practiceToday(new Date("2026-11-01T22:00:00Z")), "2026-11-02");
});

test("ten weekday date strings and labels remain consistent across month/year boundaries", () => {
  for (const today of [
    "2026-11-01",
    "2026-11-02",
    "2026-12-31",
    "2028-02-28",
  ]) {
    const days = upcomingWeekdays(today);
    assert.equal(days.length, 10);
    assert.equal(new Set(days).size, 10);
    for (const day of days) {
      assert.ok(day >= today);
      assert.ok(![0, 6].includes(parseCalendarDate(day)!.getUTCDay()));
      assert.doesNotMatch(
        formatAppointmentDate(day, { weekday: "short" }),
        /Sun|Sat/,
      );
    }
  }
  assert.deepEqual(upcomingWeekdays("2026-11-01", 5), [
    "2026-11-02",
    "2026-11-03",
    "2026-11-04",
    "2026-11-05",
    "2026-11-06",
  ]);
});

test("impossible calendar dates are not normalised into another month", () => {
  for (const day of [
    "2026-11-31",
    "2026-02-29",
    "2026-13-01",
    "2026-00-01",
    "2026-11-00",
    "2026-1-2",
    "invalid",
  ])
    assert.equal(parseCalendarDate(day), null);
  assert.ok(parseCalendarDate("2028-02-29"));
});

test("date validation includes today and day 90, but not yesterday or day 91", () => {
  assert.equal(isValidPreferredDate("2026-10-31", "2026-11-01"), false);
  assert.equal(isValidPreferredDate("2026-11-01", "2026-11-01"), true);
  assert.equal(isValidPreferredDate("2027-01-30", "2026-11-01"), true);
  assert.equal(isValidPreferredDate("2027-01-31", "2026-11-01"), false);
});

test("date-picker bounds use calendar days across month, year and leap boundaries", () => {
  assert.equal(addCalendarDays("2026-11-02", 90), "2027-01-31");
  assert.equal(addCalendarDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addCalendarDays("2028-02-28", 1), "2028-02-29");
  assert.equal(addCalendarDays("2028-02-29", 1), "2028-03-01");
  assert.equal(addCalendarDays("2026-11-31", 1), "");
});
