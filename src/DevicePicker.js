import React, { useState } from "react";

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

export default function DevicePicker({ onSelect }) {
  const [selected, setSelected] = useState("");

  function handleSelect(model) {
    setSelected(model.name);
    onSelect(model);
  }

  return (
    <div className="p-6">
      <label className="block text-lg font-bold mb-2">Choose your iPhone model:</label>
      <select
        className="p-2 rounded border"
        value={selected}
        onChange={e =>
          handleSelect(iphoneModels.find(m => m.name === e.target.value))
        }
      >
        <option value="" disabled>
          Select model
        </option>
        {iphoneModels.map(model => (
          <option key={model.name} value={model.name}>
            {model.name} ({model.width}×{model.height})
          </option>
        ))}
      </select>
      {selected && (
        <div className="mt-4 text-sm text-gray-500">
          Wallpaper size: <b>{iphoneModels.find(m => m.name === selected).width} × {iphoneModels.find(m => m.name === selected).height}</b> px
        </div>
      )}
    </div>
  );
}
