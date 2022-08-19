import { Game } from "../commons/interfaces/game";

export function saveGameDao(gameId: string, roundNumber: number) {
  // TODO!
  console.log(gameId, roundNumber);
}

export function getGameDao(gameId: string): Game {
  // TODO!
  const game: Game = {
    gameId,
    playerCount: 3,
    roundNumber: 3,
    nextPlayer: 'player-id-guid'
  }
  return game;
}
