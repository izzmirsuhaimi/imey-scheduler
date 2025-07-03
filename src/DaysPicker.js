import React from "react";

// These are the day labels. You can edit/remove S/S if you want a different format.
const allDays = [
  { label: "M", name: "Monday" },
  { label: "T", name: "Tuesday" },
  { label: "W", name: "Wednesday" },
  { label: "T", name: "Thursday" },
  { label: "F", name: "Friday" },
  { label: "S", name: "Saturday" },
  { label: "S", name: "Sunday" }
];

const dayOrder = ["M0", "T1", "W2", "T3", "F4", "S5", "S6"];
function sortDays(days) {
  return dayOrder.filter(d => days.includes(d));
}

export default function DaysPicker({ selectedDays, setSelectedDays }) {
  function toggleDay(day) {
    if (selectedDays.includes(day)) {
      setSelectedDays(sortDays(selectedDays.filter(d => d !== day)));
    } else {
      setSelectedDays(sortDays([...selectedDays, day]));
    }
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {allDays.map((d, i) => (
        <label key={i} className="flex items-center cursor-pointer gap-1">
          <input
            type="checkbox"
            checked={selectedDays.includes(d.label + i)}
            onChange={() => toggleDay(d.label + i)}
          />
          <span>{d.name}</span>
        </label>
      ))}
    </div>
  );
}
