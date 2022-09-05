import { Game } from "./domains/game";

export function saveGameDao(gameId: string, roundNumber: number) {
  // TODO!
  console.log(gameId, roundNumber);
}

export function getGameDao(gameId: string): Game {
  // TODO!
  const game: Game = {
    gameId,
    // TODO: these will be guids
    playerList: [ 'alice', 'bob', 'charlie' ],
    roundNumber: 3
  }
  return game;
}
