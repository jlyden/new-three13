import crypto from 'crypto';

import { saveToCache, getFromCache } from "../commons/utils/cache";
import { GameDomain } from "./domains/game";

export const GAME_STARTING_ROUND_NUMBER = 3;

export function createGame(playerList: string[], gameId?: string): string {
  const id = gameId ?? crypto.randomUUID();
  const game: GameDomain = {
    id,
    playerList: playerList,
    roundNumber: GAME_STARTING_ROUND_NUMBER
  }
  saveGame(game);
  return id;
}

export function saveGame(game: GameDomain) {
  saveToCache(game.id, game);
}

export function getGame(gameId: string): GameDomain {
  return getFromCache(gameId) as GameDomain;
}