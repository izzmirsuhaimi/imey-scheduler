import React, { useState, useEffect, useRef } from "react";
import { DEFAULT_CELL_COLOR } from "../constants/defaults";
import { getShortDayName } from "../constants/days";

function useModalBodyLock(visible) {
  useEffect(() => {
    if (!visible) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);
}

export default function AddClassModal({ visible, onClose, onAdd, days }) {
  const [className, setClassName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [cellColor, setCellColor] = useState(DEFAULT_CELL_COLOR);
  const nameRef = useRef(null);

  useModalBodyLock(visible);

  useEffect(() => {
    if (!visible) return;
    setClassName("");
    setLocation("");
    setSelectedDays([]);
    setStartTime("09:00");
    setEndTime("10:00");
    setCellColor(DEFAULT_CELL_COLOR);
    setTimeout(() => nameRef.current?.focus(), 0);
  }, [visible]);

  function toggleDay(dayCode) {
    setSelectedDays((previous) =>
      previous.includes(dayCode)
        ? previous.filter((day) => day !== dayCode)
        : [...previous, dayCode]
    );
  }

  function handleAdd() {
    if (!className || selectedDays.length === 0) return;
    onAdd({ className, location, days: selectedDays, startTime, endTime, cellColor });
    onClose();
  }

  if (!visible) return null;

  return (
    <div
      className="settings-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="settings-card addclass-card" onClick={(event) => event.stopPropagation()}>
        <div className="settings-title">Add Class</div>

        <div className="ac-grid">
          <div className="ac-row">
            <label htmlFor="add-class-name">Class Name</label>
            <input
              id="add-class-name"
              ref={nameRef}
              className="input"
              type="text"
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              placeholder="e.g., Calculus"
            />
          </div>

          <div className="ac-row">
            <label htmlFor="add-class-location">Location</label>
            <input
              id="add-class-location"
              className="input"
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="e.g., Room 202"
            />
          </div>

          <div className="ac-row">
            <label>Days</label>
            <div className="day-pills">
              {days.map((dayCode) => (
                <label key={dayCode} className="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(dayCode)}
                    onChange={() => toggleDay(dayCode)}
                  />
                  <span>{getShortDayName(dayCode)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="ac-row">
            <label htmlFor="add-class-start">Start Time</label>
            <input
              id="add-class-start"
              className="input"
              type="time"
              step="60"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </div>

          <div className="ac-row">
            <label htmlFor="add-class-end">End Time</label>
            <input
              id="add-class-end"
              className="input"
              type="time"
              step="60"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </div>

          <div className="ac-row">
            <label htmlFor="add-class-color">Cell Color</label>
            <input
              id="add-class-color"
              className="color"
              type="color"
              value={cellColor}
              onChange={(event) => setCellColor(event.target.value)}
            />
          </div>
        </div>

        <div className="settings-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
