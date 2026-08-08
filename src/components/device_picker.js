import React, { useState, useEffect } from "react";
import { IPHONE_MODELS } from "../constants/devices";

export default function DevicePicker({ onSelect, value = "" }) {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    setSelected(value ?? "");
  }, [value]);

  function handleChange(event) {
    const modelName = event.target.value;
    setSelected(modelName);
    const model = IPHONE_MODELS.find((entry) => entry.name === modelName);
    if (model) onSelect(model);
  }

  return (
    <div>
      <select
        className="select-modern"
        value={selected}
        onChange={handleChange}
        aria-label="Select iPhone model"
      >
        <option value="" disabled>
          Select model
        </option>
        {IPHONE_MODELS.map((model) => (
          <option key={model.name} value={model.name}>
            {model.name} ({model.width}×{model.height})
          </option>
        ))}
      </select>
    </div>
  );
}
