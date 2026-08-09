import React, { useState, useEffect } from "react";
import { DEVICE_CATEGORIES } from "../constants/devices";

export default function DevicePicker({ onSelect, value = "" }) {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value ?? "");
  }, [value]);

  function handleChange(event) {
    const deviceId = event.target.value;
    setSelected(deviceId);
    if (deviceId === "") return;

    const device = DEVICE_CATEGORIES.flatMap((category) => category.devices).find(
      (entry) => entry.id === deviceId
    );
    if (device) onSelect(device);
  }

  return (
    <div>
      <select
        className="select-modern"
        value={selected}
        onChange={handleChange}
        aria-label="Select screen ratio"
      >
        <option value="" disabled>
          Select ratio
        </option>
        {DEVICE_CATEGORIES.map((category) => (
          <optgroup key={category.label} label={category.label}>
            {category.devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name} ({device.width}×{device.height})
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
