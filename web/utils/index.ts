export const randomHexColor = () => {
  const randomByte = (min: number = 0, max: number = 255): number => {
    return Math.min(Math.max(Math.trunc(Math.random() * 255), min), max);
  };
  const R = randomByte(127).toString(16);
  const G = randomByte(70).toString(16);
  const B = randomByte(28).toString(16);
  return `#${R.toUpperCase()}${G.toUpperCase()}${B.toUpperCase()}`;
};
