import React from "react";
import ReactDOM from "react-dom";

function bindSetting(settings, key, onChange) {
  return {
    value: settings[key],
    onChange: (event) =>
      onChange({
        ...settings,
        [key]:
          event?.target?.type === "checkbox"
            ? event.target.checked
            : event?.target?.type === "number"
            ? parseInt(event.target.value, 10) || 0
            : event?.target?.type === "range"
            ? parseFloat(event.target.value)
            : event?.target
            ? event.target.value
            : event,
      }),
  };
}

function rangeStyle(min, max, value) {
  return { "--_val": `${((value - min) / (max - min)) * 100}%` };
}

function NumberStepper({ label, value, onChange, min = 8, max = 72 }) {
  return (
    <div className="form-row">
      <label>{label}</label>
      <div className="number-wrap">
        <div className="stepper">
          <button type="button" onClick={() => onChange(Math.max(min, value - 1))}>
            –
          </button>
          <input
            type="number"
            min={min}
            max={max}
            className="number"
            value={value}
            onChange={(event) => onChange(parseInt(event.target.value, 10) || 0)}
          />
          <button type="button" onClick={() => onChange(Math.min(max, value + 1))}>
            +
          </button>
        </div>
        <span className="unit">px</span>
      </div>
    </div>
  );
}

export default function SettingsModal({
  visible,
  settings,
  onChange,
  onSave,
  onClose,
}) {
  if (!visible) return null;

  const modal = (
    <div className="settings-overlay">
      <div className="settings-card" style={{ width: "min(640px, 92vw)" }}>
        <div className="settings-title">Settings</div>

        <div className="settings-section">
          <h4>Cells</h4>
          <div className="form-grid">
            <div className="form-row">
              <label>Cell Opacity: {Math.round(settings.cellOpacity * 100)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                className="range"
                style={rangeStyle(0, 1, settings.cellOpacity)}
                {...bindSetting(settings, "cellOpacity", onChange)}
              />
            </div>

            <NumberStepper
              label="Start/End Time Text Size"
              value={settings.cellTimeTextSize}
              onChange={(value) => onChange({ ...settings, cellTimeTextSize: value })}
            />

            <NumberStepper
              label="Cell Text Size"
              value={settings.cellTextSize}
              onChange={(value) => onChange({ ...settings, cellTextSize: value })}
            />

            <div className="form-row">
              <label className="checkbox" style={{ gridColumn: "1 / span 2" }}>
                <input
                  type="checkbox"
                  checked={!!settings.cellTextShadow}
                  onChange={bindSetting(settings, "cellTextShadow", onChange).onChange}
                />
                Text Shadow
              </label>
            </div>

            <div className="form-row">
              <label>Cell Text Color</label>
              <input
                type="color"
                className="color"
                {...bindSetting(settings, "cellTextColor", onChange)}
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h4>Day / Time Labels</h4>
          <div className="form-grid">
            <div className="form-row">
              <label>Day/Time Opacity: {Math.round(settings.dayTimeOpacity * 100)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                className="range"
                style={rangeStyle(0, 1, settings.dayTimeOpacity)}
                {...bindSetting(settings, "dayTimeOpacity", onChange)}
              />
            </div>

            <NumberStepper
              label="Day/Time Text Size"
              value={settings.dayTimeTextSize}
              onChange={(value) => onChange({ ...settings, dayTimeTextSize: value })}
            />

            <div className="form-row">
              <label className="checkbox" style={{ gridColumn: "1 / span 2" }}>
                <input
                  type="checkbox"
                  checked={!!settings.dayTimeTextShadow}
                  onChange={bindSetting(settings, "dayTimeTextShadow", onChange).onChange}
                />
                Day/Time Text Shadow
              </label>
            </div>

            <div className="form-row">
              <label>Day/Time Text Color</label>
              <input
                type="color"
                className="color"
                {...bindSetting(settings, "dayTimeTextColor", onChange)}
              />
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
}
