import { RoundRouteParams } from "../commons/interfaces/round-route";
import { getGame, saveGame } from "../game/gameService";

export function createRound(roundParams: RoundRouteParams): string {
  const { gameId, roundNumber } = roundParams;
  const { playerCount, nextPlayer } = getGame(gameId);
  const deck = getShuffledDeck();
  const hands = dealHands(deck, roundNumber, playerCount);
  const faceUpCard = drawCard(deck);
  saveGame(gameId, roundNumber);
  saveRound(deck, hands, faceUpCard, nextPlayer);
  return faceUpCard;
}

function getShuffledDeck(): string {
  // TODO!
  return 'a deck!';
}

// TODO: update deck type
function dealHands(deck: string, roundNumber: number, playerCount: number): object {
  // TODO!
  console.log(deck, roundNumber, playerCount);
  return {};
}

function drawCard(deck: string): string {
  // TODO!
  console.log(deck);
  return 'deck and card'
}

function saveRound(deck: string, hands: object, faceUpCard: string, nextPlayer: string) {
  // TODO!
  console.log(deck, hands, faceUpCard, nextPlayer);
}