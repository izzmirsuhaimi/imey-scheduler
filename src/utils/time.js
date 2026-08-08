export function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatHour(hour) {
  return hour < 10 ? `0${hour}` : `${hour}`;
}
