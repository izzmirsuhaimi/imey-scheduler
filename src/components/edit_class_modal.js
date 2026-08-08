import React, { useState, useEffect, useRef } from "react";
import ConfirmModal from "./confirm_modal";
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

export default function EditClassModal({
  visible,
  onClose,
  onEditClass,
  onDeleteClass,
  days,
  initialData,
}) {
  const [className, setClassName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [cellColor, setCellColor] = useState(DEFAULT_CELL_COLOR);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const nameRef = useRef(null);

  useModalBodyLock(visible);

  useEffect(() => {
    if (!visible) return;
    setClassName(initialData?.className ?? "");
    setLocation(initialData?.location ?? "");
    setSelectedDays(initialData?.days ?? []);
    setStartTime(initialData?.startTime ?? "09:00");
    setEndTime(initialData?.endTime ?? "10:00");
    setCellColor(initialData?.cellColor ?? DEFAULT_CELL_COLOR);
    setTimeout(() => nameRef.current?.focus(), 0);
  }, [visible, initialData]);

  function toggleDay(dayCode) {
    setSelectedDays((previous) =>
      previous.includes(dayCode)
        ? previous.filter((day) => day !== dayCode)
        : [...previous, dayCode]
    );
  }

  function handleSave() {
    if (!className || selectedDays.length === 0) return;

    const payload = {
      ...initialData,
      className,
      location,
      days: selectedDays,
      startTime,
      endTime,
      cellColor,
    };
    const saved = onEditClass?.(payload);
    if (saved !== false) onClose?.();
  }

  function handleDelete() {
    setShowDeleteConfirm(true);
  }

  function handleDeleteConfirmed() {
    onDeleteClass?.(initialData?.id ?? initialData);
    onClose?.();
  }

  if (!visible) return null;

  return (
    <div
      className="settings-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="settings-card editclass-card" onClick={(event) => event.stopPropagation()}>
        <div className="settings-title">Edit Class</div>

        <div className="ec-grid">
          <div className="ec-row">
            <label htmlFor="edit-class-name">Class Name</label>
            <input
              id="edit-class-name"
              ref={nameRef}
              className="input"
              type="text"
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              placeholder="e.g., Calculus"
            />
          </div>

          <div className="ec-row">
            <label htmlFor="edit-class-location">Location</label>
            <input
              id="edit-class-location"
              className="input"
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="e.g., Room 202"
            />
          </div>

          <div className="ec-row">
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

          <div className="ec-row">
            <label htmlFor="edit-class-start">Start Time</label>
            <input
              id="edit-class-start"
              className="input"
              type="time"
              step="60"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </div>

          <div className="ec-row">
            <label htmlFor="edit-class-end">End Time</label>
            <input
              id="edit-class-end"
              className="input"
              type="time"
              step="60"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </div>

          <div className="ec-row">
            <label htmlFor="edit-class-color">Cell Color</label>
            <input
              id="edit-class-color"
              className="color"
              type="color"
              value={cellColor}
              onChange={(event) => setCellColor(event.target.value)}
            />
          </div>
        </div>

        <div className="settings-footer settings-footer-split">
          <div>
            <button type="button" className="btn btn-danger-ghost" onClick={handleDelete}>
              Delete
            </button>
          </div>
          <div className="actions-right">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        visible={showDeleteConfirm}
        title="Delete class?"
        message="This will permanently remove this class from your timetable. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
