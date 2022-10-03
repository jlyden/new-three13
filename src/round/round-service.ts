import { RoundRouteDomain } from "./domains/round-route";
import { getGame, saveGame } from "../game/game-service";
import { RoundDomain } from "./domains/round";
import { CreateRoundReturnDomain } from "./domains/create-round-return";
import { getFromCache, saveToCache } from "../commons/utils/cache";
import { Round } from "./round";
import { ApiError, badRequestError } from "../commons/errors/api-error";

export const DRAW_TYPE_DECK = 'deck';
export const DRAW_TYPE_VISIBLE = 'visible';

export function createRound(roundParams: RoundRouteDomain): CreateRoundReturnDomain {
  const { gameId, roundNumber } = roundParams;
  const gameInfo = getGame(gameId);
  const round = Round.createNewRound(roundNumber, gameInfo.playerList, gameId);
  saveRound(round);
  gameInfo.roundNumber = roundNumber;
  saveGame(gameInfo);
  return {
    visibleCard: round.visibleCard,
    nextPlayer: round.nextPlayer
  }
}

export function getRound(roundId: string): Round {
  const savedRoundDomain = getFromCache(roundId) as RoundDomain;
  return Round.prepExistingRound(savedRoundDomain);
}

export function drawCard(roundId: string, source: string) {
  // retrieve data
  const round = getRound(roundId);
  const nextPlayer = round.nextPlayer;
  const playerHand = round.hands[nextPlayer];
  let visibleCard = round.visibleCard;

  // move cards around
  const deckCard = round.getCardFromDeck();
  if (source === DRAW_TYPE_DECK) {
    playerHand.push(deckCard);
  } else if (source === DRAW_TYPE_VISIBLE) {
    playerHand.push(visibleCard);
    visibleCard = deckCard;
  } else {
    const message = `drawCard: invalid source: ${source}`;
    throw new ApiError({ ...badRequestError, message });
  }

  // update and save
  const updatedHands = { ...round.hands, nextPlayer: playerHand }
  const updatedRound = { ...round, hands: updatedHands, visibleCard }
  saveRound(updatedRound);

  return updatedRound;
}

function saveRound(round: RoundDomain) {
  saveToCache(round.id, round);
}
