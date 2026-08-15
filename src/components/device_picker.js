import React, { useState, useEffect } from "react";
import { DEVICE_CATEGORIES, DEFAULT_DEVICE_ID, isPhoneView } from "../constants/devices";

export default function DevicePicker({ onSelect, value = "" }) {
  const [selected, setSelected] = useState(value || DEFAULT_DEVICE_ID);
  const [phoneView, setPhoneView] = useState(isPhoneView);

  useEffect(() => {
    setSelected(value || DEFAULT_DEVICE_ID);
  }, [value]);

  useEffect(() => {
    const onResize = () => setPhoneView(isPhoneView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const categories = phoneView
    ? DEVICE_CATEGORIES.filter((category) => category.label === "Phones")
    : DEVICE_CATEGORIES;

  const availableIds = new Set(
    categories.flatMap((category) => category.devices.map((device) => device.id))
  );
  const resolvedValue = availableIds.has(selected) ? selected : DEFAULT_DEVICE_ID;

  function handleChange(event) {
    const deviceId = event.target.value;
    setSelected(deviceId);

    const device = categories
      .flatMap((category) => category.devices)
      .find((entry) => entry.id === deviceId);
    if (device) onSelect(device);
  }

  return (
    <div>
      <select
        className="select-modern"
        value={resolvedValue}
        onChange={handleChange}
        aria-label="Select screen ratio"
      >
        {categories.map((category) => (
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
