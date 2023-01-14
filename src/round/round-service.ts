import { getGame, saveGame } from "../game/game-service";
import { RoundDomain } from "./domains/round";
import { CreateRoundReturnDomain } from "./domains/create-round-return";
import { getFromCache, saveToCache } from "../commons/utils/cache";
import { Round } from "./round";
import { ApiError, badRequestError, serverError } from "../commons/errors/api-error";
import { CardDomain } from "../card-group/domains/card";
import { removeFromGroup } from "../commons/utils/card-group";
import { assembleRoundId, getNextPlayer } from "../commons/utils/utils";

export const DRAW_TYPE_DECK = 'deck';
export const DRAW_TYPE_VISIBLE = 'visible';

/**
 * Saves new round
 * Returns visibleCard and nextPlayer
 */
export function createRound(gameId: string, roundNumber: number): CreateRoundReturnDomain {
  const gameInfo = getGame(gameId);
  const round = Round.createNewRound(roundNumber, gameInfo.playerList, gameId);
  if (!round.visibleCard) {
    const message = `Unable to retrieve visibleCard for Round: ${assembleRoundId(gameId, roundNumber)}`;
    throw new ApiError({ ...serverError, message });
  }
saveRound(round);
  gameInfo.roundNumber = roundNumber;
  saveGame(gameInfo);
  return {
    visibleCard: round.visibleCard,
    nextPlayer: round.nextPlayer
  }
}

/**
 * Retrieves round
 */
export function getRound(gameId: string, roundNumber: number): Round {
  const roundId = assembleRoundId(gameId, roundNumber);
  const savedRoundDomain = getFromCache(roundId) as RoundDomain;
  return Round.prepExistingRound(savedRoundDomain);
}

/**
 * Move face-up card or top face-down deck card to player's hand
 * Return updated Round
 */
export function drawCard(gameId: string, roundNumber: number, source: string): RoundDomain {
  // retrieve data
  const round = getRound(gameId, roundNumber);
  const nextPlayer = round.nextPlayer;
  const playerHand = round.hands[nextPlayer];

  // Ensure user only attempts to draw once during their turn
  if (playerHand.length > roundNumber) {
    const message = `drawCard: invalid draw: User already has an extra card in hand: gameId ${gameId} | round: ${roundNumber} | nextPlayer: ${nextPlayer}`;
    throw new ApiError({ ...badRequestError, message });
}

  let visibleCard = round.visibleCard;

  // move cards around
  switch (source) {
    case DRAW_TYPE_DECK:
      playerHand.push(round.getCardFromDeck());
      break;
    case DRAW_TYPE_VISIBLE:
      if (!visibleCard) {
        const message = `Unable to retrieve visibleCard for Round: ${assembleRoundId(gameId, roundNumber)}`;
        throw new ApiError({ ...serverError, message });
      }
      playerHand.push(visibleCard);
      visibleCard = undefined;
      break;
    default: {
      const message = `drawCard: invalid source: ${source}`;
      throw new ApiError({ ...badRequestError, message });
    }
  }

  // update and save
  const updatedHands = { ...round.hands, [nextPlayer]: playerHand }
  const updatedRound = { ...round, hands: updatedHands, visibleCard }
  saveRound(updatedRound);

  return updatedRound;
}

/**
 * Move discard from player's hand to face-up card
 * TODO: Handle dispatch (player going out)
 * Return updated Round
 */
export function processDiscard(gameId: string, roundNumber: number, discard: CardDomain, dispatch: boolean): RoundDomain {
  // retrieve data
  const { playerList } = getGame(gameId);
  const round = getRound(gameId, roundNumber);
  const nextPlayer = round.nextPlayer;
  const playerHand = round.hands[nextPlayer];

  // update and save
  const updatedHand = removeFromGroup(playerHand, discard);
  const updatedHands = { ...round.hands, [nextPlayer]: updatedHand }
  const nextUpPlayer = getNextPlayer(playerList, nextPlayer);
  const updatedRound = { ...round, hands: updatedHands, visibleCard: discard, nextPlayer: nextUpPlayer }
  saveRound(updatedRound);

  // TODO: evaluate dispatch
  if (dispatch) {
    // see if user can validly leave game
  }

  return updatedRound;
}

/**
 * Save Round
 */
function saveRound(round: RoundDomain) {
  saveToCache(round.id, round);
}
