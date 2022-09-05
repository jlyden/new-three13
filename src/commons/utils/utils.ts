export function getIndexOfRoundFirstPlayer(roundNumber: number, playerCount: number) {
  const transformer = 3 - playerCount;
  return (roundNumber - transformer) % playerCount;
}