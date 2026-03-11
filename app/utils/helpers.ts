const UINT32_RANGE = 2 ** 32;

export const weightedRandom = <T>(items: T[], weights: number[]) => {
  if (items.length !== weights.length) {
    throw new Error("Items and weights must be of the same size");
  }

  if (!items.length) {
    throw new Error("Items must not be empty");
  }

  const cumulativeWeights: number[] = [];
  let totalWeight = 0;

  for (let i = 0; i < weights.length; i++) {
    const w = Number.isFinite(weights[i]) && weights[i]! > 0 ? weights[i]! : 0;
    totalWeight += w;
    cumulativeWeights[i] = totalWeight;
  }

  if (totalWeight <= 0) {
    throw new Error("Total weight must be greater than zero");
  }

  const rand = new Uint32Array(1);
  crypto.getRandomValues(rand);

  const randomNumber = (rand[0]! / UINT32_RANGE) * totalWeight;

  for (let i = 0; i < cumulativeWeights.length; i++) {
    if (randomNumber < cumulativeWeights[i]!) {
      return { item: items[i], index: i };
    }
  }

  return { item: items[items.length - 1]!, index: items.length - 1 };
};

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
