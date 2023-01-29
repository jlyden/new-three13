export function getIndexOfRoundFirstPlayer(roundNumber: number, playerCount: number) {
  const transformer = 3 - playerCount;
  return (roundNumber - transformer) % playerCount;
}

export function getNextPlayer(playerList: string[], currentPlayer: string): string {
  const playerCount = playerList.length;
  const currentPlayerIndex = playerList.indexOf(currentPlayer);
  const nextPlayerIndex = currentPlayerIndex + 1;
  const endOfList = nextPlayerIndex === playerCount;
  return endOfList ? playerList[0] : playerList[nextPlayerIndex];
}
