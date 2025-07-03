import React, { useState } from "react";

export default function AddClassModal({ visible, onClose, onAdd, days }) {
  // Form states
  const [className, setClassName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [cellColor, setCellColor] = useState("#c2d3f3");

  // Generate time options (7:00 to 22:00)
  const timeOptions = [];
  for (let h = 7; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      let hh = h < 10 ? `0${h}` : h;
      let mm = m === 0 ? "00" : m;
      timeOptions.push(`${hh}:${mm}`);
    }
  }

  // When opening, reset all fields
  React.useEffect(() => {
    if (visible) {
      setClassName("");
      setLocation("");
      setSelectedDays([]);
      setStartTime("09:00");
      setEndTime("10:00");
      setCellColor("#c2d3f3");
    }
  }, [visible]);

  function handleAdd() {
    if (!className || selectedDays.length === 0) return; // only className required now
    onAdd({
      className,
      location,
      days: selectedDays,
      startTime,
      endTime,
      cellColor
    });
    onClose();
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.22)", zIndex: 20,
        display: "flex", justifyContent: "center", alignItems: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 28,
          minWidth: 340,
          boxShadow: "0 4px 32px #0002",
          maxWidth: "95vw"
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          Add Class
        </h2>
        <div className="mb-2">
          <label>Class Name:</label>
          <input type="text" value={className} onChange={e => setClassName(e.target.value)}
            className="block w-full border rounded p-1 mb-2" />
        </div>
        <div className="mb-2">
          <label>Location:</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)}
            className="block w-full border rounded p-1 mb-2" />
        </div>
        <div className="mb-2">
          <label>Days:</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {days.map((d, idx) => (
              <label key={d} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedDays.includes(d)}
                  onChange={() =>
                    setSelectedDays(
                      selectedDays.includes(d)
                        ? selectedDays.filter(x => x !== d)
                        : [...selectedDays, d]
                    )
                  }
                />
                <span>{d}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-2 flex gap-2">
          <div>
            <label>Start Time:</label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="block border rounded p-1"
              step="60" // allows per-minute input
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

        <div className="mb-2 flex gap-2">
          <div>
            <label>Cell Color:</label>
            <input type="color" value={cellColor} onChange={e => setCellColor(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <button className="px-3 py-1 rounded bg-blue-500 text-white" onClick={handleAdd}>
            Add
          </button>
          <button className="px-3 py-1 rounded bg-gray-300" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
