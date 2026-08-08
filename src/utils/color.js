export function hexToRgba(hex, alpha = 0.5) {
  const [r, g, b] = hex.match(/\w\w/g).map((value) => parseInt(value, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
