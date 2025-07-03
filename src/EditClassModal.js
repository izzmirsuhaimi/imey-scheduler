// src/EditClassModal.js
import React, { useState, useEffect } from "react";
import DaysPicker from "./DaysPicker";

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

  // Sync form fields when modal opens
  useEffect(() => {
    if (!visible || !initialData) return;
    setClassName(initialData.className || "");
    setLocation(initialData.location || "");
    setSelectedDays(initialData.days || []);
    setStartTime(initialData.startTime || "09:00");
    setEndTime(initialData.endTime || "10:00");
    setCellColor(initialData.cellColor || "#c2d3f3");
  }, [visible, initialData]);

  const handleSave = () => {
    if (!className || selectedDays.length === 0) {
      alert("Please fill in class name and select at least one day.");
      return;
    }
    const updated = {
      ...initialData,
      className,
      location,
      days: selectedDays,
      startTime,
      endTime,
      cellColor,
    };
    if (onEditClass(updated)) {
      onClose();
    } else {
      alert("❌ Overlap detected! Please choose a different time/day.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      onDeleteClass(initialData.id);
      onClose();
    }
  };

  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.22)",
        zIndex: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 28,
          minWidth: 340,
          boxShadow: "0 4px 32px #0002",
          maxWidth: "95vw",
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          Edit Class
        </h2>

        {/* Class Name */}
        <div className="mb-2">
          <label>Class Name:</label>
          <input
            type="text"
            value={className}
            onChange={e => setClassName(e.target.value)}
            className="block w-full border rounded p-1 mb-2"
          />
        </div>

        {/* Location */}
        <div className="mb-2">
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="block w-full border rounded p-1 mb-2"
          />
        </div>

        {/* Days */}
        <div className="mb-2">
          <label>Days:</label>
          <DaysPicker
            selectedDays={selectedDays}
            setSelectedDays={setSelectedDays}
          />
        </div>

        {/* Start / End Times */}
        <div className="mb-2 flex gap-2">
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="block border rounded p-1"
              step="60"
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="block border rounded p-1"
              step="60"
            />
          </div>
        </div>

        {/* Cell Color Only */}
        <div className="mb-2">
          <label>Cell Color:</label>
          <input
            type="color"
            value={cellColor}
            onChange={e => setCellColor(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            className="px-3 py-1 rounded bg-blue-500 text-white"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="px-3 py-1 rounded bg-red-500 text-white"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="px-3 py-1 rounded bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
