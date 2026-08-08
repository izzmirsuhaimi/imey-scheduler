import React, { useRef, useState, useEffect } from "react";
import LandingPage from "./components/landing_page";
import EditorHeader from "./components/editor_header";
import DaysPicker from "./components/days_picker";
import HourControls from "./components/hour_controls";
import AddClassModal from "./components/add_class_modal";
import EditClassModal from "./components/edit_class_modal";
import SettingsModal from "./components/settings_modal";
import BackgroundCropperModal from "./components/background_cropper_modal";
import TimetableGrid from "./components/timetable_grid";
import { exportTimetableImage } from "./utils/export_timetable";
import { checkOverlap, canDeleteHour } from "./utils/schedule";
import { DEFAULT_HOURS, DEFAULT_SETTINGS } from "./constants/defaults";
import { DEFAULT_SELECTED_DAYS } from "./constants/days";
import { getPreviewScale, getSafeAreaOffset } from "./constants/devices";

function createClassId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [device, setDevice] = useState(null);
  const [visibleHours, setVisibleHours] = useState(DEFAULT_HOURS);
  const [selectedDays, setSelectedDays] = useState(DEFAULT_SELECTED_DAYS);
  const [classes, setClasses] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [previewSettings, setPreviewSettings] = useState(settings);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  const [rawImage, setRawImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const imageInputRef = useRef(null);
  const timetableRef = useRef(null);

  useEffect(() => {
    if (showSettings) setPreviewSettings(settings);
  }, [showSettings, settings]);

  const activeSettings = showSettings ? previewSettings : settings;
  const previewSize = device ? getPreviewScale(device) : null;
  const safeAreaOffset = device ? getSafeAreaOffset(device.name) : 0;
  const sortedHours = [...visibleHours].sort((a, b) => a - b);

  function addHour(hour) {
    setVisibleHours((previous) => [...previous, hour].sort((a, b) => a - b));
  }

  function removeHour(hour) {
    setVisibleHours((previous) => previous.filter((h) => h !== hour));
  }

  function canRemoveHour(hour) {
    return canDeleteHour(classes, selectedDays, hour);
  }

  function handleAddClass(newClass) {
    const withId = { ...newClass, id: createClassId() };
    if (checkOverlap(classes, withId)) {
      alert("Overlapping class detected. Please adjust the time or days.");
      return;
    }
    setClasses((previous) => [...previous, withId]);
    setShowAddModal(false);
  }

  function handleEditClass(updated) {
    if (checkOverlap(classes, updated, updated.id)) {
      alert("Overlapping class detected. Please adjust the time or days.");
      return false;
    }
    setClasses((previous) =>
      previous.map((entry) => (entry.id === updated.id ? updated : entry))
    );
    return true;
  }

  function handleDeleteClass(id) {
    setClasses((previous) => previous.filter((entry) => entry.id !== id));
  }

  function openClassEditor(entry) {
    setEditingClass(entry);
    setShowEditModal(true);
  }

  function onImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setRawImage(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  }

  async function downloadTimetable() {
    if (!timetableRef.current || !device || !previewSize) return;
    try {
      await exportTimetableImage(timetableRef.current, device, previewSize.width);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed: " + (error.message || error));
    }
  }

  if (!device) {
    return <LandingPage onDeviceSelect={setDevice} />;
  }

  return (
    <div className="app-editor">
      <EditorHeader device={device} onDeviceSelect={setDevice} />

      <div className="btn-strip">
        <div className="editor-row">
          <div className="btn-row">
            <button className="btn" onClick={() => setShowSettings(true)}>
              Settings
            </button>
            <button className="btn" onClick={() => imageInputRef.current?.click()}>
              Set Background Image
            </button>
            <button className="btn" onClick={() => setShowAddModal(true)}>
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
        ref={imageInputRef}
        className="hidden-input"
      />

      <div className="btn-strip">
        <div className="editor-row">
          <DaysPicker
            selectedDays={selectedDays}
            onSelectedDaysChange={setSelectedDays}
          />
          <HourControls
            visibleHours={visibleHours}
            canDeleteHour={canRemoveHour}
            onRemoveHour={removeHour}
            onAddHour={addHour}
          />
        </div>
      </div>

      <TimetableGrid
        gridRef={timetableRef}
        width={previewSize.width}
        height={previewSize.height}
        safeAreaOffset={safeAreaOffset}
        sortedHours={sortedHours}
        selectedDays={selectedDays}
        classes={classes}
        backgroundImage={backgroundImage}
        settings={activeSettings}
        onClassSelect={openClassEditor}
      />

      <EditClassModal
        visible={showEditModal}
        initialData={editingClass}
        days={selectedDays}
        onClose={() => setShowEditModal(false)}
        onEditClass={handleEditClass}
        onDeleteClass={(id) => {
          handleDeleteClass(id);
          setShowEditModal(false);
        }}
      />

      <AddClassModal
        visible={showAddModal}
        days={selectedDays}
        onAdd={handleAddClass}
        onClose={() => setShowAddModal(false)}
      />

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

      {showCropper && rawImage && (
        <BackgroundCropperModal
          imageSrc={rawImage}
          width={device.width}
          height={device.height}
          onCropComplete={(croppedUrl) => {
            setBackgroundImage(croppedUrl);
            setShowCropper(false);
          }}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
}
