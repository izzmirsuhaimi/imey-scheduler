export const IPHONE_MODELS = [
  { name: "iPhone 16 Pro Max", width: 1320, height: 2868 },
  { name: "iPhone 14/15 Pro Max", width: 1290, height: 2796 },
  { name: "iPhone 16 Pro", width: 1206, height: 2622 },
  { name: "iPhone 14/15 Pro", width: 1179, height: 2556 },
  { name: "iPhone 15/16 Plus", width: 1290, height: 2796 },
  { name: "iPhone 14 Plus", width: 1284, height: 2778 },
  { name: "iPhone 15/16", width: 1179, height: 2556 },
  { name: "iPhone 13/14", width: 1170, height: 2532 },
  { name: "iPhone 12/13 Mini", width: 1080, height: 2340 },
];

const DYNAMIC_ISLAND_MODELS = new Set([
  "iPhone 16 Pro Max",
  "iPhone 14/15 Pro Max",
  "iPhone 16 Pro",
  "iPhone 14/15 Pro",
  "iPhone 15/16 Plus",
  "iPhone 15/16",
]);

const NOTCH_MODELS = new Set([
  "iPhone 14 Plus",
  "iPhone 13/14",
  "iPhone 12/13 Mini",
]);

export function getSafeAreaOffset(deviceName) {
  if (DYNAMIC_ISLAND_MODELS.has(deviceName)) return 59;
  if (NOTCH_MODELS.has(deviceName)) return 44;
  return 0;
}

export function getPreviewScale(device) {
  return {
    width: Math.round(device.width / 3),
    height: Math.round(device.height / 3),
  };
}
