// src/SettingsModal.js
import React from "react";
import ReactDOM from "react-dom";

export default function SettingsModal({
  visible,
  settings,
  onChange,
  onSave,
  onClose,
}) {
  if (!visible) return null;

  const bind = (key) => ({
    value: settings[key],
    onChange: (e) =>
      onChange({
        ...settings,
        [key]:
          e?.target?.type === "checkbox"
            ? e.target.checked
            : e?.target?.type === "number"
            ? (parseInt(e.target.value, 10) || 0)
            : e?.target?.type === "range"
            ? parseFloat(e.target.value)
            : e?.target
            ? e.target.value
            : e,
      }),
  });

  const rangeStyle = (min, max, val) => ({
    "--_val": `${((val - min) / (max - min)) * 100}%`,
  });

  const modal = (
    <div className="settings-overlay">
      <div className="settings-card" style={{ width: "min(640px, 92vw)" }}>
        <div className="settings-title">Settings</div>

        {/* ===== CELLS ===== */}
        <div className="settings-section">
          <h4>Cells</h4>
          <div className="form-grid">
            {/* Cell Opacity */}
            <div className="form-row">
              <label>Cell Opacity: {Math.round(settings.cellOpacity * 100)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                className="range"
                style={rangeStyle(0, 1, settings.cellOpacity)}
                {...bind("cellOpacity")}
              />
            </div>

            {/* Start/End Time Text Size */}
            <div className="form-row">
              <label>Start/End Time Text Size</label>
              <div className="number-wrap">
                <div className="stepper">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...settings,
                        cellTimeTextSize: Math.max(8, (settings.cellTimeTextSize || 0) - 1),
                      })
                    }
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min={8}
                    max={72}
                    className="number"
                    value={settings.cellTimeTextSize}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        cellTimeTextSize: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...settings,
                        cellTimeTextSize: Math.min(72, (settings.cellTimeTextSize || 0) + 1),
                      })
                    }
                  >
                    +
                  </button>
                </div>
                <span className="unit">px</span>
              </div>
            </div>

            {/* Cell Text Size */}
            <div className="form-row">
              <label>Cell Text Size</label>
              <div className="number-wrap">
                <div className="stepper">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...settings,
                        cellTextSize: Math.max(8, (settings.cellTextSize || 0) - 1),
                      })
                    }
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min={8}
                    max={72}
                    className="number"
                    value={settings.cellTextSize}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        cellTextSize: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...settings,
                        cellTextSize: Math.min(72, (settings.cellTextSize || 0) + 1),
                      })
                    }
                  >
                    +
                  </button>
                </div>
                <span className="unit">px</span>
              </div>
            </div>

            {/* Text Shadow Toggle */}
            <div className="form-row">
              <label className="checkbox" style={{ gridColumn: "1 / span 2" }}>
                <input
                  type="checkbox"
                  checked={!!settings.cellTextShadow}
                  onChange={bind("cellTextShadow").onChange}
                />
                Text Shadow
              </label>
            </div>

            {/* Cell Text Color */}
            <div className="form-row">
              <label>Cell Text Color</label>
              <input type="color" className="color" {...bind("cellTextColor")} />
            </div>
          </div>
        </div>

        {/* ===== DAY / TIME LABELS ===== */}
        <div className="settings-section">
          <h4>Day / Time Labels</h4>
          <div className="form-grid">
            {/* Day/Time Opacity */}
            <div className="form-row">
              <label>Day/Time Opacity: {Math.round(settings.dayTimeOpacity * 100)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                className="range"
                style={rangeStyle(0, 1, settings.dayTimeOpacity)}
                {...bind("dayTimeOpacity")}
              />
            </div>

            {/* Day/Time Text Size */}
            <div className="form-row">
              <label>Day/Time Text Size</label>
              <div className="number-wrap">
                <div className="stepper">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...settings,
                        dayTimeTextSize: Math.max(8, (settings.dayTimeTextSize || 0) - 1),
                      })
                    }
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min={8}
                    max={72}
                    className="number"
                    value={settings.dayTimeTextSize}
                    onChange={(e) =>
                      onChange({
                        ...settings,
                        dayTimeTextSize: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...settings,
                        dayTimeTextSize: Math.min(72, (settings.dayTimeTextSize || 0) + 1),
                      })
                    }
                  >
                    +
                  </button>
                </div>
                <span className="unit">px</span>
              </div>
            </div>

            {/* Day/Time Text Shadow */}
            <div className="form-row">
              <label className="checkbox" style={{ gridColumn: "1 / span 2" }}>
                <input
                  type="checkbox"
                  checked={!!settings.dayTimeTextShadow}
                  onChange={bind("dayTimeTextShadow").onChange}
                />
                Day/Time Text Shadow
              </label>
            </div>

            {/* Day/Time Text Color */}
            <div className="form-row">
              <label>Day/Time Text Color</label>
              <input type="color" className="color" {...bind("dayTimeTextColor")} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="settings-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );

  // render ABOVE the app's stacking contexts
  return ReactDOM.createPortal(modal, document.body);
}
