import React, { useState, useEffect, useRef } from "react";

export default function AddClassModal({ visible, onClose, onAdd, days }) {
  // Form state
  const [className, setClassName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [cellColor, setCellColor] = useState("#c2d3f3");

  const nameRef = useRef(null);

  // Reset fields & focus when the modal opens
  useEffect(() => {
    if (!visible) return;
    setClassName("");
    setLocation("");
    setSelectedDays([]);
    setStartTime("09:00");
    setEndTime("10:00");
    setCellColor("#c2d3f3");
    // focus first field
    setTimeout(() => nameRef.current?.focus(), 0);
    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [visible]);

  function toggleDay(code) {
    setSelectedDays((prev) =>
      prev.includes(code) ? prev.filter((d) => d !== code) : [...prev, code]
    );
  }

  function dayLabel(code) {
    // Friendly labels based on your day codes (e.g., M0, T1, W2, T3, F4, S5, S6)
    const idx = parseInt(code.slice(-1), 10);
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx] || code;
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
      <div className="settings-card addclass-card" onClick={(e) => e.stopPropagation()}>
        <div className="settings-title">Add Class</div>

        <div className="ac-grid">
          <div className="ac-row">
            <label htmlFor="ac-name">Class Name</label>
            <input
              id="ac-name"
              ref={nameRef}
              className="input"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., Calculus"
            />
          </div>

          <div className="ac-row">
            <label htmlFor="ac-location">Location</label>
            <input
              id="ac-location"
              className="input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Room 202"
            />
          </div>

          <div className="ac-row">
            <label>Days</label>
            <div className="day-pills">
              {days.map((d) => (
                <label key={d} className="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(d)}
                    onChange={() => toggleDay(d)}
                  />
                  <span>{dayLabel(d)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="ac-row">
            <label htmlFor="ac-start">Start Time</label>
            <input
              id="ac-start"
              className="input"
              type="time"
              step="60"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="ac-row">
            <label htmlFor="ac-end">End Time</label>
            <input
              id="ac-end"
              className="input"
              type="time"
              step="60"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="ac-row">
            <label htmlFor="ac-color">Cell Color</label>
            <input
              id="ac-color"
              className="color"
              type="color"
              value={cellColor}
              onChange={(e) => setCellColor(e.target.value)}
            />
          </div>
        </div>

        {/* Footer: Cancel left, Add right */}
        <div className="settings-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
}
