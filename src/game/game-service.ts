import crypto from 'crypto';

import { saveToCache, getFromCache } from "../commons/utils/cache";
import { GameDomain } from "./domains/game";

export function createGame(playerList: []): string {
  const gameId = crypto.randomUUID();
  const game: GameDomain = {
    id: gameId,
    playerList: playerList,
    roundNumber: 3
  }
  saveGame(game);
  return gameId;
}

export function saveGame(game: GameDomain) {
  saveToCache(game.id, game);
}

export function getGame(gameId: string): GameDomain {
  return getFromCache(gameId) as GameDomain;
}