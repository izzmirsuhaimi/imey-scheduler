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
        <h1 className="brand">The Scheduler-inator!</h1>
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

        <div className="landing__seo">
          <h2 className="landing__seo-title">
            Free Timetable Maker &amp; Schedule Wallpaper Generator
          </h2>
          <p className="landing__seo-text">
            Turn your class schedule into a clean, aesthetic wallpaper in seconds.
            Choose your phone, tablet, or monitor screen ratio, add your classes and
            time rows, then download a wallpaper sized perfectly for your screen —
            right in your browser, no sign-up or watermark.
          </p>
          <ul className="landing__seo-list">
            <li>Wallpapers for iPhone, Android, tablets &amp; monitors</li>
            <li>Add your own background image</li>
            <li>Recolor every class and adjust text sizes</li>
            <li>Instant download at full screen resolution</li>
          </ul>
        </div>

        <div className="landing__faq">
          <details>
            <summary>Who is this great for?</summary>
            <p>
              High school, college, and university students, teachers building
              study schedules, kpop stans, fellow chronically organized people, people who
              aspire to be organized, people with “J” MBTI types (you know who you
              are), people who just got a new phone and want it to look
              impressive, and babies — if they can get their tiny hands on a
              phone. Honestly, anyone with a schedule who likes nice wallpapers.
            </p>
          </details>
          <details>
            <summary>How do I make a timetable wallpaper?</summary>
            <p>
              Pick your screen ratio, tap Create, then add your time rows, days, and
              classes. Preview updates live, then hit Download as Image to save a
              wallpaper sized for your exact screen.
            </p>
          </details>
          <details>
            <summary>Is the timetable maker free?</summary>
            <p>
              Yes — completely free, no sign-up required, and no watermark on the
              exported wallpaper.
            </p>
          </details>
        </div>

        <p className="note">
          made by izzmirsuhaimi. The Scheduler-inator! is not affiliated with, endorsed
          by, or connected to Disney or Phineas and Ferb.
        </p>
      </div>
    </div>
  );
}
