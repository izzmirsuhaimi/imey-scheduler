export const DEVICE_CATEGORIES = [
  {
    label: "Phones",
    devices: [
      // { id: "phone-9-16", name: "9:16", width: 1080, height: 1920, safeAreaTop: 132 },
      { id: "phone-9-19-5", name: "9:19.5", width: 1080, height: 2340, safeAreaTop: 177 },
      { id: "phone-9-20", name: "9:20", width: 1080, height: 2400, safeAreaTop: 177 },
    ],
  },
  {
    label: "Tablets",
    devices: [
      { id: "tablet-4-3", name: "3:4", width: 1536, height: 2048 },
      { id: "tablet-16-10", name: "10:16", width: 2560, height: 1600 },
    ],
  },
  {
    label: "Monitors",
    devices: [
      { id: "monitor-16-9", name: "16:9", width: 2560, height: 1440 },
      { id: "monitor-16-10", name: "16:10", width: 2560, height: 1600 },
      { id: "monitor-21-9", name: "21:9 (Ultrawide - in progress)", width: 3440, height: 1440 },
      // { id: "monitor-32-9", name: "32:9 (Super UltraWide)", width: 5120, height: 1440 },
    ],
  },
];

export const DEVICE_OPTIONS = DEVICE_CATEGORIES.flatMap((category) =>
  category.devices.map((device) => ({ ...device, category: category.label }))
);

export function getPreviewScale(device, maxPreviewWidth = 900) {
  if (device.category === "Phones") {
    const scale = Math.min(1 / 3, maxPreviewWidth / device.width);
    return {
      width: Math.round(device.width * scale),
      height: Math.round(device.height * scale),
    };
  }
  // Tablets/Monitors: allow a much wider preview so content stays legible
  const wideMax = 1100; // tune this to your layout
  const scale = Math.min(1, wideMax / device.width);
  return {
    width: Math.round(device.width * scale),
    height: Math.round(device.height * scale),
  };
}

export function getSafeAreaPreview(device, previewWidth) {
  const scale = device.width / previewWidth;
  return Math.round((device.safeAreaTop ?? 0) / scale);
}

export function getCardSize(device, previewSize, marginRatio = 0.03) {
  if (device.category === "Phones") {
    return { width: previewSize.width, height: previewSize.height };
  }
  const ratio = 9 / 19.5;
  const maxW = previewSize.width * (1 - marginRatio * 2);
  const maxH = previewSize.height * (1 - marginRatio * 2);
  const height = Math.min(maxH, maxW / ratio);
  const width = height * ratio;
  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

const BASE_CARD_WIDTH = 360;

export function getTextScale(cardWidth, minScale = 0.45) {
  return Math.max(minScale, Math.min(1, cardWidth / BASE_CARD_WIDTH));
}