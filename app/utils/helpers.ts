export const formatNumber = (num: number) => {
  return Intl.NumberFormat(undefined, { style: "decimal" }).format(num);
};

export const wheelPalette = [
  "#f04e23",
  "#ffbd2f",
  "#4cc9f0",
  "#2a9d8f",
  "#8338ec",
  "#ef476f",
  "#06d6a0",
  "#ff9ff3"
];

export const formatTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};
