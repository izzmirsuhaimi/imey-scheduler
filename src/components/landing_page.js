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
          A free personal organization toolbox — timetable wallpapers, study guides, and
          finance calculators to help you build a more disciplined, intentional life.
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

          <div className="landing__tools" style={{ marginTop: 20 }}>
            <h2 className="landing__seo-title">Other tools</h2>
            <div className="card__row">
              <a className="btn btn--primary btn--create" href="/tools/asb-calculator.html">
                ASB Calculator
              </a>
              <a
                className="btn btn--primary btn--create"
                href="/tools/compound-interest.html"
              >
                Compound Interest Calculator
              </a>
              <a className="btn btn--primary btn--create" href="/tools/word-counter.html">
                Word Counter
              </a>
              <a className="btn btn--primary btn--create" href="/tools/">
                All tools
              </a>
            </div>
            <div className="hint">
              Free, runs in your browser — your inputs stay on your device.
            </div>
          </div>
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

        <details className="landing__faq">
          <summary>Free tools</summary>
          <ul className="landing__seo-list">
            <li>
              <a href="/">Timetable Wallpaper Maker</a> — turn your class schedule into a
              wallpaper.
            </li>
            <li>
              <a href="/tools/pomodoro.html">Pomodoro Timer</a> — 25-minute focus
              sessions.
            </li>
            <li>
              <a href="/tools/gpa-calculator.html">GPA / Grade Calculator</a> — 4.0 scale
              GPA.
            </li>
            <li>
              <a href="/tools/budget-planner.html">Budget Planner (50/30/20)</a> — split
              income into needs, wants, savings.
            </li>
            <li>
              <a href="/tools/asb-calculator.html">ASB Investment Calculator (Malaysia)</a>{" "}
              — project ASB dividends and growth.
            </li>
            <li>
              <a href="/tools/compound-interest.html">Compound Interest Calculator</a> —
              growth over time.
            </li>
            <li>
              <a href="/tools/savings-goal.html">Savings Goal Calculator</a> — monthly
              savings needed.
            </li>
            <li>
              <a href="/tools/loan-calculator.html">Loan / EMI Calculator</a> — monthly
              payment and total interest.
            </li>
            <li>
              <a href="/tools/emergency-fund.html">Emergency Fund Calculator</a> — target
              and monthly savings.
            </li>
            <li>
              <a href="/tools/unit-converter.html">Unit Converter</a> — length, weight,
              temperature, and more.
            </li>
            <li>
              <a href="/tools/date-difference.html">Date Difference Calculator</a> — days
              between two dates.
            </li>
            <li>
              <a href="/tools/word-counter.html">Word Counter</a> — words, characters,
              reading time.
            </li>
            <li>
              <a href="/tools/qr-code-generator.html">QR Code Generator</a> — create and
              download QR codes.
            </li>
            <li>
              <a href="/tools/">All tools</a>
            </li>
          </ul>
        </details>

        <details className="landing__faq">
          <summary>Malaysia-focused tools</summary>
          <ul className="landing__seo-list">
            <li>
              <a href="/tools/epf-calculator.html">EPF (KWSP) Calculator</a> — retirement
              savings projection.
            </li>
            <li>
              <a href="/tools/income-tax-calculator.html">Income Tax Calculator</a> — LHDN
              tax brackets.
            </li>
            <li>
              <a href="/tools/zakat-calculator.html">Zakat Calculator</a> — harta, pendapatan,
              fitrah.
            </li>
            <li>
              <a href="/tools/car-loan-calculator.html">Car Loan Calculator</a> — new
              reducing-balance (EIR) method.
            </li>
          </ul>
        </details>

        <details className="landing__faq">
          <summary>Guides</summary>
          <ul className="landing__seo-list">
            <li>
              <a href="/guides/how-to-make-timetable-wallpaper.html">
                How to make a timetable wallpaper
              </a>
            </li>
            <li>
              <a href="/guides/best-study-schedule.html">Best study schedule for students</a>
            </li>
            <li>
              <a href="/guides/phone-wallpaper-sizes.html">Phone wallpaper sizes cheat sheet</a>
            </li>
            <li>
              <a href="/guides/">All guides</a>
            </li>
          </ul>
        </details>

        <footer className="landing__footer">
          <nav className="landing__footer-nav">
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
            <a href="/about.html">About</a>
            <a href="/contact.html">Contact</a>
            <a href="/guides/">Guides</a>
            <a href="/tools/">Tools</a>
            <a href="/whats-new.html">What's new</a>
          </nav>
          <p className="note">
            made by izzmirsuhaimi. The Scheduler-inator! is not affiliated with, endorsed
            by, or connected to Disney or Phineas and Ferb.
          </p>
        </footer>
      </div>
    </div>
  );
}
