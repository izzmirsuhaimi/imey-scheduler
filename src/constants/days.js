export const DAY_LABELS = [
  { label: "M", name: "Monday" },
  { label: "T", name: "Tuesday" },
  { label: "W", name: "Wednesday" },
  { label: "T", name: "Thursday" },
  { label: "F", name: "Friday" },
  { label: "S", name: "Saturday" },
  { label: "S", name: "Sunday" },
];

export const DAY_ORDER = ["M0", "T1", "W2", "T3", "F4", "S5", "S6"];

export const DEFAULT_SELECTED_DAYS = ["M0", "T1", "W2", "T3", "F4"];

const SHORT_DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function sortDays(days) {
  return DAY_ORDER.filter((day) => days.includes(day));
}

export function getShortDayName(dayCode) {
  const index = parseInt(dayCode.slice(-1), 10);
  return SHORT_DAY_NAMES[index] || dayCode;
}

export function getDayLetter(dayCode) {
  const index = parseInt(dayCode.slice(-1), 10);
  return DAY_LABELS[index]?.label ?? dayCode;
}
