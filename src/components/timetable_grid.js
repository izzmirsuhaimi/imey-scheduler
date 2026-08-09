import React from "react";
import { HEADER_HEIGHT } from "../constants/defaults";
import { getDayLetter } from "../constants/days";
import { hexToRgba } from "../utils/color";
import { timeToMinutes } from "../utils/time";
import { getCellsForDay } from "../utils/schedule";
import { formatHour } from "../utils/time";

function buildTimeToY(firstHour, lastHour, gridDrawHeight) {
  return (minutes) => {
    const minutesSinceStart = minutes - firstHour * 60;
    const totalMinutes = (lastHour + 1 - firstHour) * 60;
    return HEADER_HEIGHT + (minutesSinceStart / totalMinutes) * gridDrawHeight;
  };
}

function ClassCell({
  entry,
  columnIndex,
  columnWidth,
  isLastColumn,
  startY,
  endY,
  settings,
  textScale,
  onSelect,
}) {
  const height = Math.max(12, endY - startY);
  const textShadow = settings.cellTextShadow ? "0 0 2px #000" : "none";
  const compact = height < 52 * textScale;
  const cellTextSize = settings.cellTextSize * textScale;
  const cellTimeTextSize = settings.cellTimeTextSize * textScale;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(entry)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect(entry);
      }}
      style={{
        position: "absolute",
        left: Math.round(columnWidth * columnIndex),
        width: isLastColumn ? Math.ceil(columnWidth) : Math.floor(columnWidth),
        top: startY,
        height,
        background: hexToRgba(entry.cellColor, settings.cellOpacity),
        boxSizing: "border-box",
        color: settings.cellTextColor,
        cursor: "pointer",
        zIndex: 10,
        overflow: "hidden",
        borderRight: !isLastColumn ? "1px solid transparent" : undefined,
        display: "flex",
        ...(compact
          ? { alignItems: "center", justifyContent: "center" }
          : { flexDirection: "column", justifyContent: "space-between" }),
      }}
    >
      {compact ? (
        <div
          style={{
            fontSize: Math.min(cellTextSize, Math.max(7, height - 4)),
            fontWeight: 700,
            textShadow,
            maxWidth: "100%",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {entry.className}
        </div>
      ) : (
        <>
          <div
            style={{
              fontSize: cellTimeTextSize,
              fontWeight: 500,
              textShadow,
            }}
          >
            {entry.startTime}
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 2,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                fontSize: cellTextSize,
                textShadow,
              }}
            >
              {entry.className}
            </div>
            {entry.location && (
              <div
                style={{
                  fontSize: cellTextSize,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  textShadow,
                }}
              >
                {entry.location}
              </div>
            )}
          </div>
          <div
            style={{
              fontSize: cellTimeTextSize,
              textAlign: "right",
              textShadow,
            }}
          >
            {entry.endTime}
          </div>
        </>
      )}
    </div>
  );
}

export default function TimetableGrid({
  gridRef,
  width,
  height,
  safeAreaOffset,
  cardWidth = width,
  cardHeight = height,
  textScale = 1,
  sortedHours,
  selectedDays,
  classes,
  backgroundImage,
  settings,
  onClassSelect,
}) {
  const cardLeft = Math.round((width - cardWidth) / 2);
  const cardTop = Math.round((height - cardHeight) / 2);
  const gridDrawHeight = cardHeight - HEADER_HEIGHT;
  const firstHour = sortedHours[0];
  const lastHour = sortedHours[sortedHours.length - 1];
  const timeToY = buildTimeToY(firstHour, lastHour, gridDrawHeight);
  const dayTimeShadow = settings.dayTimeTextShadow
    ? "0 0 4px #000,0 0 2px #000"
    : "none";
  const dayTimeTextSize = settings.dayTimeTextSize * textScale;

  return (
    <div className="timetable-row">
      <div className="timetable-center">
        <div
          ref={gridRef}
          className="timetable-canvas"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {backgroundImage && (
            <img src={backgroundImage} alt="" className="timetable-canvas__background" />
          )}

          <div
            className="timetable-grid"
            style={{
              position: "absolute",
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
              left: cardLeft,
              top: cardTop,
              background: "transparent",
            }}
          >
            <div
              className="timetable-grid__time-axis"
              style={{
                top: HEADER_HEIGHT + safeAreaOffset,
                height: cardHeight - HEADER_HEIGHT,
                opacity: settings.dayTimeOpacity,
              }}
            >
              {sortedHours.map((hour) => (
                <div
                  key={hour}
                  style={{
                    position: "absolute",
                    top: timeToY(hour * 60) - HEADER_HEIGHT,
                    left: 0,
                    width: "100%",
                    textAlign: "center",
                    transform: "translateY(-50%)",
                    fontSize: dayTimeTextSize,
                    color: settings.dayTimeTextColor,
                    textShadow: dayTimeShadow,
                  }}
                >
                  {formatHour(hour)}
                </div>
              ))}
            </div>

            <div
              className="timetable-grid__day-labels"
              style={{
                top: safeAreaOffset,
                opacity: settings.dayTimeOpacity,
              }}
            >
              {selectedDays.map((day) => (
                <div
                  key={day}
                  style={{
                    flex: 1,
                    fontSize: dayTimeTextSize,
                    color: settings.dayTimeTextColor,
                    textShadow: dayTimeShadow,
                    textAlign: "center",
                    lineHeight: `${HEADER_HEIGHT}px`,
                  }}
                >
                  {getDayLetter(day)}
                </div>
              ))}
            </div>

            <div
              className="timetable-grid__cells"
              style={{ top: HEADER_HEIGHT + safeAreaOffset }}
            >
              {selectedDays.map((day, dayIndex) => {
                const columnWidth = (cardWidth - 40) / selectedDays.length;
                const isLastColumn = dayIndex === selectedDays.length - 1;
                const dayCells = getCellsForDay(classes, day);

                return dayCells.map((entry, index) => {
                  let topAdjust = 0;
                  if (index > 0) {
                    const previous = dayCells[index - 1];
                    if (timeToMinutes(previous.endTime) === timeToMinutes(entry.startTime)) {
                      topAdjust = 1;
                    }
                  }

                  const startY =
                    timeToY(timeToMinutes(entry.startTime)) - HEADER_HEIGHT + topAdjust;
                  const endY = timeToY(timeToMinutes(entry.endTime)) - HEADER_HEIGHT;

                  return (
                    <ClassCell
                      key={entry.id ?? `${day}-${index}`}
                      entry={entry}
                      columnIndex={dayIndex}
                      columnWidth={columnWidth}
                      isLastColumn={isLastColumn}
                      startY={startY}
                      endY={endY}
                      settings={settings}
                      textScale={textScale}
                      onSelect={onClassSelect}
                    />
                  );
                });
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
