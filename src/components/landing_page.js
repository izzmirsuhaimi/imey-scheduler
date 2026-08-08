import React from "react";
import DevicePicker from "./device_picker";

export default function LandingPage({ onDeviceSelect }) {
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
            <DevicePicker value="" onSelect={onDeviceSelect} />
          </div>
          <div className="hint">You can still change the model later.</div>
        </div>

        <p className="note">made by izzmirsuhaimi.</p>
      </div>
    </div>
  );
}
