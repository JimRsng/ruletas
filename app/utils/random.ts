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
