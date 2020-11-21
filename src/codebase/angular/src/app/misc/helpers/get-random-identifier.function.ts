export function getRandomIdentifier(): string {
  return Math.random().toString(32).replace('0.', '');
}
