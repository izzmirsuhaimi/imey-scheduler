import { timeToMinutes } from "./time";

function classesOverlap(first, second) {
  return !(
    second.endTime <= first.startTime ||
    second.startTime >= first.endTime
  );
}

function sharesDay(firstDays, secondDays) {
  return firstDays.some((day) => secondDays.includes(day));
}

export function checkOverlap(classes, candidate, excludeId = null) {
  return classes.some((existing) => {
    if (excludeId != null && existing.id === excludeId) return false;
    return (
      sharesDay(existing.days, candidate.days) &&
      classesOverlap(existing, candidate)
    );
  });
}

export function getCellsForDay(classes, day) {
  return classes
    .filter((entry) => entry.days.includes(day))
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
}

export function canDeleteHour(classes, selectedDays, hour) {
  const hourStart = hour * 60;
  const hourEnd = (hour + 1) * 60;

  return !classes.some((entry) => {
    const classStart = timeToMinutes(entry.startTime);
    const classEnd = timeToMinutes(entry.endTime);
    const affectsVisibleDay = entry.days.some((day) => selectedDays.includes(day));
    return affectsVisibleDay && classStart < hourEnd && classEnd > hourStart;
  });
}
