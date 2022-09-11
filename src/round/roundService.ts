import { RoundRouteDomain } from "./domains/round-route";
import { getGame, saveGame } from "../game/gameService";
import { Round } from "./round";
import { RoundDomain } from "./domains/round";
import { CreateRoundReturnDomain } from "./domains/create-round-return";
import { getFromCache, saveToCache } from "../commons/utils/cache";

export function createRound(roundParams: RoundRouteDomain): CreateRoundReturnDomain {
  const { gameId, roundNumber } = roundParams;
  const { playerList } = getGame(gameId);
  const round = new Round(roundNumber, playerList, gameId);
  const roundInfo = round.getNewRound();
  saveRound(roundInfo);
  saveGame(gameId, roundNumber);
  return {
    visibleCard: roundInfo.visibleCard,
    nextPlayer: roundInfo.nextPlayer
  }
}

function saveRound(round: RoundDomain) {
  saveToCache(round.id, round);
  console.log(round);
}

export function getRound(roundId: string) {
  console.log(roundId);
  return getFromCache(roundId);
}