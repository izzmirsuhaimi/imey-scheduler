import React from "react";
import { ALL_HOURS } from "../constants/defaults";
import { formatHour } from "../utils/time";

export default function HourControls({
  visibleHours,
  canDeleteHour,
  onRemoveHour,
  onAddHour,
}) {
  const missingHours = ALL_HOURS.filter((hour) => !visibleHours.includes(hour));
  const sortedHours = [...visibleHours].sort((a, b) => a - b);

  return (
    <div className="timerow">
      <span className="timerow__label">Manage time rows:</span>

      {sortedHours.map((hour) => {
        const deletable = canDeleteHour(hour);
        return (
          <button
            key={hour}
            type="button"
            onClick={() => deletable && onRemoveHour(hour)}
            className={`hour-chip ${deletable ? "is-danger" : "is-disabled"}`}
            disabled={!deletable}
            title={
              deletable
                ? "Delete this hour row"
                : "Cannot delete (row contains class)"
            }
          >
            {formatHour(hour)}:00 ×
          </button>
        );
      })}

      {missingHours.length > 0 && (
        <select
          className="select-compact"
          onChange={(event) => {
            const value = event.target.value;
            if (value === "") return;
            const hour = Number(value);
            if (!Number.isNaN(hour)) onAddHour(hour);
            event.target.value = "";
          }}
          defaultValue=""
        >
          <option value="" disabled>
            + Add row...
          </option>
          {missingHours.map((hour) => (
            <option key={hour} value={hour}>
              {formatHour(hour)}:00
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
