export function getRandomInteger(min: number = 0, max: number = 999_999): number {
  return Math.round(min + Math.random() * (max - min));
}
