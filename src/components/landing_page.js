import React, { useState } from "react";
import DevicePicker from "./device_picker";
import ThemeToggle from "./theme_toggle";
import { DEVICE_OPTIONS, DEFAULT_DEVICE_ID } from "../constants/devices";

const DEFAULT_DEVICE = DEVICE_OPTIONS.find((entry) => entry.id === DEFAULT_DEVICE_ID);

export default function LandingPage({
  onCreate,
  currentDevice = null,
  theme = "light",
  onToggleTheme,
}) {
  const [pendingDevice, setPendingDevice] = useState(currentDevice || DEFAULT_DEVICE);

  return (
    <div className="landing">
      <div className="landing__toggle">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      <div className="landing__inner">
        <h1 className="brand">imey‑scheduler</h1>
        <p className="tagline">
          Create a clean, aesthetic timetable wallpaper for your screen — right in your browser.
        </p>

        <div className="card">
          <label className="card__label" htmlFor="device-picker">
            Choose your screen ratio:
          </label>
          <div className="card__row" id="device-picker">
            <DevicePicker value={pendingDevice?.id} onSelect={setPendingDevice} />
            <button
              type="button"
              className="btn btn--primary btn--create"
              onClick={() => onCreate(pendingDevice)}
            >
              Create
            </button>
          </div>
          <div className="hint">You can still change it later.</div>
        </div>

        <p className="note">made by izzmirsuhaimi.</p>
      </div>
    </div>
  );
}
