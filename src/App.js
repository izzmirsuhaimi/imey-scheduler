import React, { useRef, useState, useEffect } from "react";
import DevicePicker from "./DevicePicker";
import DaysPicker from "./DaysPicker";
import AddClassModal from "./AddClassModal";
import EditClassModal from "./EditClassModal";
import SettingsModal from "./SettingsModal";
import BackgroundCropperModal from "./BackgroundCropperModal";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

// helper to convert hex color to rgba with transparency
function hexToRgba(hex, alpha = 0.5) {
  const [r, g, b] = hex.match(/\w\w/g).map(v => parseInt(v, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const headerHeight = 40;
const initialHours = Array.from({ length: 13 }, (_, i) => 7 + i);

const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function App() {
  const [device, setDevice] = useState(null);
  const [visibleHours, setVisibleHours] = useState(initialHours);
  const [selectedDays, setSelectedDays] = useState(["M0", "T1", "W2", "T3", "F4"]);
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editClass, setEditClass] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  // ── SETTINGS STATE ──────────────────────────
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    cellOpacity: 0.5,
    cellTextSize: 11,
    cellTextColor: "#ffffff",
    cellTextShadow: true,
    cellTimeTextSize: 11,
    dayTimeTextSize: 13,
    dayTimeTextColor: "#ffffff",
    dayTimeOpacity: 1,
    dayTimeTextShadow: true,
  });
  const [previewSettings, setPreviewSettings] = useState(settings);
  useEffect(() => {
    if (showSettings) setPreviewSettings(settings);
  }, [showSettings, settings]);
  const activeSettings = showSettings ? previewSettings : settings;
  const inputRef = useRef(null);
  const timetableRef = useRef(null);

  const dayLabels = [
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

  function toMins(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  function canDeleteHour(hour) {
    const hourStart = hour * 60;
    const hourEnd = (hour + 1) * 60;
    return !classes.some(c => {
      const cStart = toMins(c.startTime);
      const cEnd = toMins(c.endTime);
      return c.days.some(d => selectedDays.includes(d)) &&
        cStart < hourEnd && cEnd > hourStart;
    });
  }
  function addHour(hour) {
    const newHours = [...visibleHours, hour].sort((a, b) => a - b);
    setVisibleHours(newHours);
  }
  function removeHour(hour) {
    setVisibleHours(visibleHours.filter(h => h !== hour));
  }

  const missingHours = initialHours.filter(h => !visibleHours.includes(h));
  const sortedHours = [...visibleHours].sort((a, b) => a - b);

  const gridWidth = Math.round(device ? device.width / 3 : 400);
  const gridHeight = Math.round(device ? device.height / 3 : 700);
  const safeAreaOffset = (() => {
    if (!device) return 0;
    const dynamicIsland = [
      "iPhone 16 Pro Max","iPhone 14/15 Pro Max","iPhone 16 Pro","iPhone 14/15 Pro","iPhone 15/16 Plus","iPhone 15/16"
    ].includes(device.name);
    const notch = [
      "iPhone 14 Plus","iPhone 13/14","iPhone 12/13 Mini"
    ].includes(device.name);
    if (dynamicIsland) return 59;
    if (notch) return 44;
    return 0;
  })();
  const totalRows = sortedHours.length;
  const gridDrawHeight = gridHeight - headerHeight;
  const firstHour = sortedHours[0];
  const lastHour = sortedHours[totalRows - 1];

  function timeToY(mins) {
    const minutesSinceStart = mins - firstHour * 60;
    const totalMinutes = (lastHour + 1 - firstHour) * 60;
    return headerHeight + (minutesSinceStart / totalMinutes) * gridDrawHeight;
  }

  function cellsForDay(day) {
    return classes
      .filter(c => c.days.includes(day))
      .sort((a, b) => toMins(a.startTime) - toMins(b.startTime));
  }

  function checkOverlap(newClass) {
    return classes.some(c =>
      c.days.some(d => newClass.days.includes(d)) &&
      !(
        newClass.endTime <= c.startTime ||
        newClass.startTime >= c.endTime
      )
    );
  }

  function handleAddClass(newClass) {
    const withId = { ...newClass, id: Date.now() };
    if (checkOverlap(withId)) {
      alert("Overlapping class detected. Please adjust the time or days.");
      return;
    }
    setClasses([...classes, withId]);
    setShowModal(false);
  }

  function handleEditClass(updated) {
    const overlap = classes
      .filter(c => c.id !== updated.id)
      .some(c =>
        c.days.some(d => updated.days.includes(d)) &&
        !(
          updated.endTime <= c.startTime ||
          updated.startTime >= c.endTime
        )
      );
    if (overlap) {
      alert("Overlapping class detected. Please adjust the time or days.");
      return false;
    }
    setClasses(classes.map(c => (c.id === updated.id ? updated : c)));
    return true;
  }

  function handleDeleteClass(id) {
    setClasses(classes.filter(c => c.id !== id));
  }

  // image selection and export
  function onImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  }

  async function downloadTimetable(e) {
    e?.preventDefault();
    if (!timetableRef.current || !device) return;

    try {
      const scale = device.width / gridWidth;

      if (isSafari()) {
        // — Safari fallback with html2canvas at high res —
        const canvas = await html2canvas(timetableRef.current, {
          useCORS: true,
          backgroundColor: "#fff",  // fill behind transparent areas
          scale,                    // CSS-pixels × scale → real pixels
        });
        const dataUrl = canvas.toDataURL("image/png");
        saveAs(dataUrl, "timetable.png");

      } else {
        // — default path with html-to-image —
        const dataUrl = await toPng(timetableRef.current, {
          cacheBust: true,
          pixelRatio: scale,        // same scale factor
        });
        saveAs(dataUrl, "timetable.png");
      }

    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed: " + (err.message || err));
    }
  }

  // === Landing screen (rendered when no device is selected) ===
  if (!device) {
    return (
      <div className="landing">
        <div className="landing__inner">
          <h1 className="brand">imey‑scheduler</h1>
          <p className="tagline">
            Create a clean, aesthetic timetable wallpaper for your lockscreen — right in your browser.
          </p>

          <div className="card">
            <label className="card__label" htmlFor="device-picker">
              Choose your iPhone model:
            </label>
            <div className="card__row" id="device-picker">
              {/* DevicePicker already handles its own dropdown; we just pass onSelect */}
              <DevicePicker value={device?.name || ""} onSelect={setDevice} />
            </div>
            <div className="hint">
              You can still change the model later.
            </div>
          </div>

          <p className="note">made by izzmirsuhaimi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* ===== Top Toolbar (keeps DevicePicker visible here) ===== */}
      <header className="ui-toolbar w-full sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          {/* Editor header */}
          <div className="editor-bar">
            <h1 className="brand brand--editor">imey‑scheduler</h1>
            <p className="tagline">Create a clean, aesthetic timetable wallpaper for your lockscreen.</p>
          </div>
          {/* Put your existing DevicePicker line here, unchanged */}
          <div className="editor-row mt-2 mb-2">
            <DevicePicker value={device?.name || ""} onSelect={setDevice} />
          </div>
        </div>
      </header>

      {device && (
        <div className="w-full max-w-6xl px-6 mt-4">
          {/* Top Controls */}
          {/* Action buttons strip (flat, no rounded corners) */}
          <div className="btn-strip">
            <div className="editor-row">
              <div className="btn-row">
                <button className="btn" onClick={() => setShowSettings(true)}>
                  Settings
                </button>

                <button
                  className="btn"
                  onClick={() => inputRef.current && inputRef.current.click()}
                >
                  Set Background Image
                </button>

                <button className="btn" onClick={() => setShowModal(true)}>
                  + Add Class
                </button>

                <button className="btn btn--primary" onClick={downloadTimetable}>
                  Download as Image
                </button>
              </div>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={onImageSelect}
            style={{ display: "none" }}
            ref={inputRef}
          />

          <div className="mt-6 w-full max-w-6xl px-6">
            {/* Days + Time rows strip (flat, no rounded corners) */}
            <div className="btn-strip">
              <div className="editor-row">
                {/* Days row */}
                <div className="daysbar">
                  <DaysPicker
                    selectedDays={selectedDays}
                    setSelectedDays={(days) => setSelectedDays(sortDays(days))}
                  />
                </div>

                {/* Hour controls */}
                <div className="timerow">
                  <span className="mr-2 text-sm font-medium">Manage time rows:</span>

                  {sortedHours.map((hour) => (
                    <button
                      key={hour}
                      onClick={() => canDeleteHour(hour) && removeHour(hour)}
                      className={`hour-chip ${canDeleteHour(hour) ? "is-danger" : "is-disabled"}`}
                      disabled={!canDeleteHour(hour)}
                      title={
                        canDeleteHour(hour)
                          ? "Delete this hour row"
                          : "Cannot delete (row contains class)"
                      }
                    >
                      {hour < 10 ? `0${hour}` : hour}:00 ×
                    </button>
                  ))}

                  {missingHours.length > 0 && (
                    <select
                      className="select-compact ml-2"
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val) addHour(val);
                        e.target.value = "";
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        + Add row...
                      </option>
                      {missingHours.map((h) => (
                        <option key={h} value={h}>
                          {h < 10 ? `0${h}` : h}:00
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timetable */}
          <div className="timetable-row">
            <div className="timetable-center">
              {/* Timetable Grid */}
              <div
                ref={timetableRef}
                style={{
                  width: `${gridWidth}px`,
                  height: `${gridHeight}px`,
                  background: "#fff",
                  position: "relative",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.12)",  // slightly softer/larger
                  overflow: "hidden",
                }}
              >
                {backgroundImage && (
                  <img
                    src={backgroundImage}
                    alt=""
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  />
                )}
                {/* Time axis overlay */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: headerHeight + safeAreaOffset,
                    width: 40,
                    height: gridHeight - headerHeight,
                    zIndex: 3,
                    pointerEvents: "none",
                    background: "transparent",
                    opacity: activeSettings.dayTimeOpacity
                  }}
                >
                  {sortedHours.map(hour => (
                    <div
                      key={hour}
                      style={{
                        position: "absolute",
                        top: timeToY(hour * 60) - headerHeight,
                        left: 0,
                        width: "100%",
                        textAlign: "center",
                        transform: "translateY(-50%)",
                        fontSize: activeSettings.dayTimeTextSize,
                        color: activeSettings.dayTimeTextColor,
                        textShadow: activeSettings.dayTimeTextShadow
                          ? "0 0 4px #000,0 0 2px #000"
                          : "none",
                      }}
                    >
                      {hour < 10 ? `0${hour}` : hour}
                    </div>
                  ))}
                </div>
                {/* Day labels overlay */}
                <div
                  style={{
                    position: "absolute",
                    left: 40,
                    top: safeAreaOffset,
                    height: headerHeight,
                    width: `calc(100% - 40px)`,
                    display: "flex",
                    zIndex: 3,
                    background: "transparent",
                    opacity: activeSettings.dayTimeOpacity
                  }}
                >
                  {selectedDays.map(day => (
                    <div
                      key={day}
                      style={{
                        flex: 1,
                        fontWeight: "normal",
                        fontSize: activeSettings.dayTimeTextSize,
                        color: activeSettings.dayTimeTextColor,
                        textShadow: activeSettings.dayTimeTextShadow
                          ? "0 0 4px #000,0 0 2px #000"
                          : "none",
                        textAlign: "center",
                        lineHeight: `${headerHeight}px`
                      }}
                    >
                      {dayLabels[parseInt(day.slice(-1))].label}
                    </div>
                  ))}
                </div>
                {/* Class cells overlay */}
                <div
                  style={{
                    position: "absolute",
                    left: 40,
                    top: headerHeight + safeAreaOffset,
                    width: `calc(100% - 40px)`,
                    height: gridHeight - headerHeight,
                    zIndex: 4
                  }}
                >
                  {selectedDays.map((day, dayIdx) => {
                    const numDays = selectedDays.length;
                    const colWidth = (gridWidth - 40) / numDays;
                    const isLastCol = dayIdx === numDays - 1;
                    return (
                      <React.Fragment key={day}>
                        {cellsForDay(day).map((c, idx) => {
                          const startY = timeToY(toMins(c.startTime)) - headerHeight;
                          const endY = timeToY(toMins(c.endTime)) - headerHeight;
                          let adjustTop = 0;
                          const sorted = cellsForDay(day);
                          if (idx > 0) {
                            const prev = sorted[idx - 1];
                            if (prev && toMins(prev.endTime) === toMins(c.startTime)) {
                              adjustTop = 1;
                            }
                          }
                          const realStartY = startY + adjustTop;
                          const realHeight = Math.max(12, endY - realStartY);
                          return (
                            <div
                              key={idx}
                              onClick={() => { setEditClass(c); setShowEdit(true); }}
                              style={{
                                position: "absolute",
                                left: Math.round(colWidth * dayIdx),
                                width: isLastCol
                                  ? Math.ceil(colWidth)
                                  : Math.floor(colWidth),
                                top: realStartY,
                                height: realHeight,
                                background: hexToRgba(c.cellColor, activeSettings.cellOpacity),
                                boxSizing: "border-box",
                                borderRadius: 0,
                                color: activeSettings.cellTextColor,
                                fontSize: activeSettings.cellTextSize,
                                boxShadow: "none",
                                padding: "0",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                cursor: "pointer",
                                zIndex: 10,
                                overflow: "hidden",
                                borderRight: !isLastCol ? "1px solid transparent" : undefined
                              }}
                            >
                              <div style={{ fontSize: activeSettings.cellTimeTextSize, fontWeight: 500, textShadow: activeSettings.cellTextShadow ? "0 0 2px #000" : "none" }}>
                                {c.startTime}
                              </div>
                              <div
                                style={{
                                  flex: 1,
                                  textAlign: "center",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-word",
                                  padding: 2,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center"
                                }}
                              >
                                <div style={{
                                  fontWeight: 700,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "pre-line",
                                  wordBreak: "break-word",
                                  fontSize: activeSettings.cellTextSize,
                                  textShadow: activeSettings.cellTextShadow ? "0 0 2px #000" : "none"
                                }}>{c.className}</div>
                                {c.location && (
                                  <div style={{
                                    fontSize: activeSettings.cellTextSize,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "pre-line",
                                    wordBreak: "break-word",
                                    textShadow: activeSettings.cellTextShadow ? "0 0 2px #000" : "none"
                                  }}>{c.location}</div>
                                )}
                              </div>
                              <div style={{ fontSize: activeSettings.cellTimeTextSize, textAlign: "right", textShadow: activeSettings.cellTextShadow ? "0 0 2px #000" : "none" }}>
                                {c.endTime}
                              </div>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            (Preview is scaled down for your screen. Final export will be full resolution.)
          </div>

          {/* Edit Class Modal */}
          <EditClassModal
            visible={showEdit}
            initialData={editClass}
            days={selectedDays}
            onClose={() => setShowEdit(false)}
            onEditClass={updated => {
              const ok = handleEditClass(updated);
              if (ok) setShowEdit(false);
              return ok;
            }}
            onDeleteClass={id => {
              handleDeleteClass(id);
              setShowEdit(false);
            }}
          />
        </div>
      )}

      {/* Add Class Modal */}
      <AddClassModal
        visible={showModal}
        days={selectedDays}
        onAdd={handleAddClass}
        onClose={() => setShowModal(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettings}
        settings={previewSettings}
        onChange={setPreviewSettings}
        onSave={() => {
          setSettings(previewSettings);
          setShowSettings(false);
        }}
        onClose={() => setShowSettings(false)}
      />

      {/* Background Cropper Modal */}
      {showCropper && rawImage && device && (
        <BackgroundCropperModal
          imageSrc={rawImage}
          width={device.width}
          height={device.height}
          onCropComplete={croppedUrl => {
            setBackgroundImage(croppedUrl);
            setShowCropper(false);
          }}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
}

export default App;