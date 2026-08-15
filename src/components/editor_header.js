import React from "react";
import DevicePicker from "./device_picker";
import ThemeToggle from "./theme_toggle";

export default function EditorHeader({
  device,
  theme,
  onToggleTheme,
  onDeviceSelect,
  onBrandClick,
}) {
  return (
    <header className="ui-toolbar">
      <div className="editor-header">
        <div className="editor-bar">
          <h1
            className="brand brand--editor brand--clickable"
            role="button"
            tabIndex={0}
            title="Back to start"
            onClick={onBrandClick}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onBrandClick();
              }
            }}
          >
            The Scheduler-inator!
          </h1>
          <p className="tagline">
            Website name was inspired by Dr Heinz Doofenshmirtz.
          </p>
        </div>
        <div className="editor-row editor-topbar">
          <DevicePicker value={device.id} onSelect={onDeviceSelect} />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
