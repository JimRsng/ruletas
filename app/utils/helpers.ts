export const getRandomValue = (min: number, max: number) => {
  const range = max - min;
  const randomBytes = new Uint32Array(1);
  crypto.getRandomValues(randomBytes);
  return min + (randomBytes[0]! % range);
};

export const formatNumber = (num: number) => {
  return Intl.NumberFormat(undefined, { style: "decimal" }).format(num);
};
