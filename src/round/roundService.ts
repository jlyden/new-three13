import { RoundRouteDomain } from "./domains/round-route";
import { getGame, saveGame } from "../game/gameService";
import { Round } from "./round";
import { RoundDomain } from "./domains/round";
import { CardDomain } from "../card-group/domains/card";

export function createRound(roundParams: RoundRouteDomain): CardDomain {
  const { gameId, roundNumber } = roundParams;
  const { playerCount, nextPlayer } = getGame(gameId);
  const round = new Round(roundNumber, playerCount);
  saveRound(round.getRound(), nextPlayer);
  saveGame(gameId, roundNumber);
  return round.getRound().faceUpCard;
}

function saveRound(round: RoundDomain, nextPlayer: string) {
  // TODO!
  console.log(round, nextPlayer);
}