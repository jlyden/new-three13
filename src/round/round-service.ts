import { RoundRouteDomain } from "./domains/round-route";
import { getGame, saveGame } from "../game/game-service";
import { Round } from "./round";
import { RoundDomain } from "./domains/round";
import { CreateRoundReturnDomain } from "./domains/create-round-return";
import { getFromCache, saveToCache } from "../commons/utils/cache";

export function createRound(roundParams: RoundRouteDomain): CreateRoundReturnDomain {
  const { gameId, roundNumber } = roundParams;
  const gameInfo = getGame(gameId);
  const round = new Round(roundNumber, gameInfo.playerList, gameId);
  const roundInfo = round.getRound();
  saveRound(roundInfo);
  gameInfo.roundNumber = roundNumber;
  saveGame(gameInfo);
  return {
    visibleCard: roundInfo.visibleCard,
    nextPlayer: roundInfo.nextPlayer
  }
}

function saveRound(round: RoundDomain) {
  saveToCache(round.id, round);
  console.log(round);
}

export function getRound(roundId: string): RoundDomain {
  return getFromCache(roundId) as RoundDomain;
}