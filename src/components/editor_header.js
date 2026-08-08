import React from "react";
import DevicePicker from "./device_picker";

export default function EditorHeader({ device, onDeviceSelect }) {
  return (
    <header className="ui-toolbar">
      <div className="editor-header">
        <div className="editor-bar">
          <h1 className="brand brand--editor">imey‑scheduler</h1>
          <p className="tagline">
            Create a clean, aesthetic timetable wallpaper for your lockscreen.
          </p>
        </div>
        <div className="editor-row">
          <DevicePicker value={device.name} onSelect={onDeviceSelect} />
        </div>
      </div>
    </header>
  );
}
