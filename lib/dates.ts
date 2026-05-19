import {
  addDays,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
} from "date-fns";

export type CalendarView = "week" | "month" | "two-month" | "three-month" | "year";

export const isoDate = (d: Date) => format(d, "yyyy-MM-dd");
export const isoTime = (d: Date) => format(d, "HH:mm");

export function rangeFor(view: CalendarView, anchor: Date) {
  switch (view) {
    case "week": {
      const start = startOfWeek(anchor, { weekStartsOn: 1 });
      const end = endOfWeek(anchor, { weekStartsOn: 1 });
      return { start, end };
    }
    case "month": {
      return { start: startOfMonth(anchor), end: endOfMonth(anchor) };
    }
    case "two-month": {
      return { start: startOfMonth(subMonths(anchor, 1)), end: endOfMonth(anchor) };
    }
    case "three-month": {
      return { start: startOfMonth(subMonths(anchor, 2)), end: endOfMonth(anchor) };
    }
    case "year": {
      return { start: startOfYear(anchor), end: endOfYear(anchor) };
    }
  }
}

export function gridDaysForMonth(anchor: Date) {
  const monthStart = startOfMonth(anchor);
  const monthEnd = endOfMonth(anchor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days: Date[] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

export function formatDateLong(d: Date) {
  return format(d, "EEE, d MMM yyyy");
}

export function formatMonthLabel(d: Date) {
  return format(d, "MMMM yyyy");
}
