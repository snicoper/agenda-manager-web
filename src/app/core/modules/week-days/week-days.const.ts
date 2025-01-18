// Definición del enum como objeto const.
export const WeekDays = {
  None: 0,
  Monday: 1 << 0,
  Tuesday: 1 << 1,
  Wednesday: 1 << 2,
  Thursday: 1 << 3,
  Friday: 1 << 4,
  Saturday: 1 << 5,
  Sunday: 1 << 6,
} as const;
