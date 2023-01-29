export function assembleRoundId(gameId: string, roundNumber: number): string {
  return `${gameId}/${roundNumber}`;
}
