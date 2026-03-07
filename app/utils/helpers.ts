export const getRandomValue = (min: number, max: number) => {
  const range = max - min;
  const randomBytes = new Uint32Array(1);
  crypto.getRandomValues(randomBytes);
  return min + (randomBytes[0]! % range);
};
