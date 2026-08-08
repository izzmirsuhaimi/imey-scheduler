import React from "react";
import { DAY_LABELS, DAY_ORDER, sortDays } from "../constants/days";

export default function DaysPicker({ selectedDays, onSelectedDaysChange }) {
  function toggleDay(dayCode) {
    if (selectedDays.includes(dayCode)) {
      onSelectedDaysChange(sortDays(selectedDays.filter((day) => day !== dayCode)));
      return;
    }
    onSelectedDaysChange(sortDays([...selectedDays, dayCode]));
  }

  return (
    <div className="daysbar">
      {DAY_LABELS.map((day, index) => {
        const dayCode = DAY_ORDER[index];
        return (
          <label key={dayCode} className="daysbar__option">
            <input
              type="checkbox"
              checked={selectedDays.includes(dayCode)}
              onChange={() => toggleDay(dayCode)}
            />
            <span>{day.name}</span>
          </label>
        );
      })}
    </div>
  );
}
