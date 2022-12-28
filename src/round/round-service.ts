import { getGame, saveGame } from "../game/game-service";
import { RoundDomain } from "./domains/round";
import { CreateRoundReturnDomain } from "./domains/create-round-return";
import { getFromCache, saveToCache } from "../commons/utils/cache";
import { Round } from "./round";
import { ApiError, badRequestError } from "../commons/errors/api-error";
import { CardDomain, EMPTY_CARD } from "../card-group/domains/card";
import { discardFromGroup } from "../commons/utils/card-group";
import { assembleRoundId, getNextPlayer } from "../commons/utils/utils";

export const DRAW_TYPE_DECK = 'deck';
export const DRAW_TYPE_VISIBLE = 'visible';

export function createRound(gameId: string, roundNumber: number): CreateRoundReturnDomain {
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

export function getRound(gameId: string, roundNumber: number): Round {
  const roundId = assembleRoundId(gameId, roundNumber);
  const savedRoundDomain = getFromCache(roundId) as RoundDomain;
  return Round.prepExistingRound(savedRoundDomain);
}

export function drawCard(gameId: string, roundNumber: number, source: string): RoundDomain {
  // retrieve data
  const round = getRound(gameId, roundNumber);
  const nextPlayer = round.nextPlayer;
  const playerHand = round.hands[nextPlayer];
  let visibleCard = round.visibleCard;

  // move cards around
  if (source === DRAW_TYPE_DECK) {
    const deckCard = round.getCardFromDeck();
    playerHand.push(deckCard);
  } else if (source === DRAW_TYPE_VISIBLE) {
    playerHand.push(visibleCard);
    visibleCard = EMPTY_CARD;
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

// TODO: finish WIP
export function processDiscard(gameId: string, roundNumber: number, card: CardDomain, dispatch: boolean) {
  // retrieve data
  const { playerList } = getGame(gameId);

  const round = getRound(gameId, roundNumber);
  const nextPlayer = round.nextPlayer;
  const playerHand = round.hands[nextPlayer];

  // move cards around
  const updatedHand = discardFromGroup(playerHand, card);
  const visibleCard = card;

  // update and save
  const updatedHands = { ...round.hands, nextPlayer: updatedHand }
  const nextUpPlayer = getNextPlayer(playerList, nextPlayer);
  const updatedRound = { ...round, hands: updatedHands, visibleCard, nextPlayer: nextUpPlayer }
  saveRound(updatedRound);

  // TODO: evaluate dispatch
  if (dispatch) {
    // see if user can validly leave game
  }

  return updatedRound;
}

function saveRound(round: RoundDomain) {
  saveToCache(round.id, round);
}
