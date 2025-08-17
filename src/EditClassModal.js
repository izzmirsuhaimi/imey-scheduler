// src/EditClassModal.js
import React, { useState, useEffect, useRef } from "react";

export default function EditClassModal({
  visible,
  onClose,
  onEditClass,
  onDeleteClass,
  days,
  initialData
}) {
  const [className, setClassName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [cellColor, setCellColor] = useState("#c2d3f3");

  const nameRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    // preload existing values
    setClassName(initialData?.className ?? "");
    setLocation(initialData?.location ?? "");
    setSelectedDays(initialData?.days ?? []);
    setStartTime(initialData?.startTime ?? "09:00");
    setEndTime(initialData?.endTime ?? "10:00");
    setCellColor(initialData?.cellColor ?? "#c2d3f3");

    // focus + lock scroll
    setTimeout(() => nameRef.current?.focus(), 0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [visible, initialData]);

  function dayLabel(code) {
    const idx = parseInt(code.slice(-1), 10);
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx] || code;
  }

  function toggleDay(code) {
    setSelectedDays(prev =>
      prev.includes(code) ? prev.filter(d => d !== code) : [...prev, code]
    );
  }

  function handleSave() {
    const payload = {
      ...initialData,           // keep id/whatever else parent needs
      className,
      location,
      days: selectedDays,
      startTime,
      endTime,
      cellColor
    };
    onEditClass?.(payload);
    onClose?.();
  }

  function handleDelete() {
    const ok = window.confirm("Delete this class? This cannot be undone.");
    if (!ok) return;
    // pass through id if present, otherwise the whole object
    onDeleteClass?.(initialData?.id ?? initialData);
    onClose?.();
  }

  if (!visible) return null;

  return (
    <div className="settings-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="settings-card editclass-card" onClick={(e) => e.stopPropagation()}>
        <div className="settings-title">Edit Class</div>

        <div className="ec-grid">
          <div className="ec-row">
            <label htmlFor="ec-name">Class Name</label>
            <input
              id="ec-name"
              ref={nameRef}
              className="input"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g., Calculus"
            />
          </div>

          <div className="ec-row">
            <label htmlFor="ec-location">Location</label>
            <input
              id="ec-location"
              className="input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Room 202"
            />
          </div>

          <div className="ec-row">
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

          <div className="ec-row">
            <label htmlFor="ec-start">Start Time</label>
            <input
              id="ec-start"
              className="input"
              type="time"
              step="60"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="ec-row">
            <label htmlFor="ec-end">End Time</label>
            <input
              id="ec-end"
              className="input"
              type="time"
              step="60"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="ec-row">
            <label htmlFor="ec-color">Cell Color</label>
            <input
              id="ec-color"
              className="color"
              type="color"
              value={cellColor}
              onChange={(e) => setCellColor(e.target.value)}
            />
          </div>
        </div>

        {/* Footer: Delete on far-left, Cancel then Save on the right */}
        <div className="settings-footer settings-footer-split">
          <div>
            <button className="btn btn-danger-ghost" onClick={handleDelete}>
              Delete
            </button>
          </div>
          <div className="actions-right">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
