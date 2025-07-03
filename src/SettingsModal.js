// src/SettingsModal.js
import React from "react";

export default function SettingsModal({
  visible,
  settings,
  onChange,
  onSave,
  onClose,
}) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.22)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 24,
          maxWidth: "90vw",
          width: 400,
          boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Settings</h2>

        {/* Cell Opacity */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Cell Opacity: {Math.round(settings.cellOpacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.cellOpacity}
            onChange={e =>
              onChange({
                ...settings,
                cellOpacity: parseFloat(e.target.value),
              })
            }
            style={{ width: "100%" }}
          />
        </div>

        {/* Start/End Time Text Size */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Start/End Time Text Size: {settings.cellTimeTextSize}px
          </label>
          <input
            type="number"
            min="8"
            max="72"
            value={settings.cellTimeTextSize}
            onChange={e =>
              onChange({
                ...settings,
                cellTimeTextSize: parseInt(e.target.value, 10) || 0,
              })
            }
            style={{ width: "100%" }}
          />
        </div>

        {/* Cell Text Size */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Cell Text Size: {settings.cellTextSize}px
          </label>
          <input
            type="number"
            min="8"
            max="72"
            value={settings.cellTextSize}
            onChange={e =>
              onChange({
                ...settings,
                cellTextSize: parseInt(e.target.value, 10) || 0,
              })
            }
            style={{ width: "100%" }}
          />
        </div>

        {/* Text Shadow Toggle */}
        <div style={{ marginBottom: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={settings.cellTextShadow}
              onChange={e =>
                onChange({ ...settings, cellTextShadow: e.target.checked })
              }
            />{" "}
            Text Shadow
          </label>
        </div>

        {/* Cell Text Color */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Cell Text Color:
          </label>
          <input
            type="color"
            value={settings.cellTextColor}
            onChange={e =>
              onChange({ ...settings, cellTextColor: e.target.value })
            }
          />
        </div>

        {/* Day/Time Opacity */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Day/Time Opacity: {Math.round(settings.dayTimeOpacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.dayTimeOpacity}
            onChange={e =>
              onChange({
                ...settings,
                dayTimeOpacity: parseFloat(e.target.value),
              })
            }
            style={{ width: "100%" }}
          />
        </div>

        {/* Day/Time Text Size */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Day/Time Text Size: {settings.dayTimeTextSize}px
          </label>
          <input
            type="number"
            min="8"
            max="72"
            value={settings.dayTimeTextSize}
            onChange={e =>
              onChange({
                ...settings,
                dayTimeTextSize: parseInt(e.target.value, 10) || 0,
              })
            }
            style={{ width: "100%" }}
          />
        </div>

        {/* Day/Time Text Color */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4 }}>
            Day/Time Text Color:
          </label>
          <input
            type="color"
            value={settings.dayTimeTextColor}
            onChange={e =>
              onChange({ ...settings, dayTimeTextColor: e.target.value })
            }
          />
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 16,
          }}
        >
          <button
            onClick={onClose}
            style={{ padding: "8px 12px", borderRadius: 4 }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            style={{
              padding: "8px 12px",
              borderRadius: 4,
              background: "#4caf50",
              color: "#fff",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
