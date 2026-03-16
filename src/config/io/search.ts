function getSearchWeight(version: string) {
  const versionArr = version.split(".");
  versionArr[0] = versionArr[0].substring(1);
  const searchWeightArr = versionArr.map(w => parseInt(w));
  const weight = searchWeightArr.reduce((p, c, i, _) => {
    const mult = i - 1 === 0 || i === 0 ? 10 : 1;
    const acc = p * mult + c * mult;
    return acc;
  });
  return weight;
}

export { getSearchWeight };
