import React, { useState, useEffect } from "react";

const iphoneModels = [
  { name: "iPhone 16 Pro Max", width: 1320, height: 2868 },
  { name: "iPhone 14/15 Pro Max", width: 1290, height: 2796 },
  { name: "iPhone 16 Pro", width: 1206, height: 2622 },
  { name: "iPhone 14/15 Pro", width: 1179, height: 2556 },
  { name: "iPhone 15/16 Plus", width: 1290, height: 2796 },
  { name: "iPhone 14 Plus", width: 1284, height: 2778 },
  { name: "iPhone 15/16", width: 1179, height: 2556 },
  { name: "iPhone 13/14", width: 1170, height: 2532 },
  { name: "iPhone 12/13 Mini", width: 1080, height: 2340 }
];

export default function DevicePicker({ onSelect, value = "", showSizeHint = true }) {
  const [selected, setSelected] = useState(value);

  // keep the internal state in sync with the parent prop
  useEffect(() => {
    setSelected(value ?? "");
  }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setSelected(v);
    const model = iphoneModels.find((m) => m.name === v);
    if (model && typeof onSelect === "function") onSelect(model);
  };

  const selectedModel = iphoneModels.find((m) => m.name === selected) || null;

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
        {iphoneModels.map((model) => (
          <option key={model.name} value={model.name}>
            {model.name} ({model.width}×{model.height})
          </option>
        ))}
      </select>

      {showSizeHint && selectedModel && (
        <div className="mt-2 text-sm ui-hint">
          Wallpaper size: <b>{selectedModel.width} × {selectedModel.height}</b> px
        </div>
      )}
    </div>
  );
}
