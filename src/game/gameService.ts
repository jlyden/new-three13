import { Game } from "./domains/game";
import { getGameDao, saveGameDao } from "./gameDao";

export function saveGame(gameId: string, roundNumber: number) {
  saveGameDao(gameId, roundNumber);
}

export function getGame(gameId: string): Game {
  return getGameDao(gameId);
}