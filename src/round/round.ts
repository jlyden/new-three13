import { CardDomain } from '../card-group/domains/card';
import { RoundDomain } from './domains/round';
import { getIndexOfRoundFirstPlayer } from '../commons/utils/utils';
import { CardGroup } from '../card-group/card-group';
import { HandDomain } from '../card-group/domains/hand';
import { ApiError, cardNotFoundError } from '../commons/errors/api-error';

export const RAN_OUT_OF_CARDS = 'ran out of cards in deck';

export class Round {
  id = '';
  deck: RoundDomain['deck'] = [];
  hands: RoundDomain['hands'] = {};
  visibleCard: RoundDomain['visibleCard'] = {
    suit: '',
    value: 0
  };
  nextPlayer = '';

  static createNewRound(roundNumber: number, playerList: string[], gameId: string): Round {
    const round = new Round();
    round.id = `${gameId}/${roundNumber}`;
    round.deck = round.prepareDeck();
    round.hands = round.dealHands(roundNumber, playerList);
    round.visibleCard = round.getCardFromDeck();
    round.nextPlayer = round.setRoundFirstPlayer(roundNumber, playerList);
    return round;
  }

  static prepExistingRound(roundDomain: RoundDomain): Round {
    const round = new Round();
    round.id = roundDomain.id;
    round.deck = roundDomain.deck;
    round.hands = roundDomain.hands;
    round.visibleCard = roundDomain.visibleCard;
    round.nextPlayer = roundDomain.nextPlayer;
    return round;
  }

  getCardFromDeck(): CardDomain {
    const nextCard = this.deck.pop();
    if (!nextCard) {
      const message = 'getCardFromDeck: ' + RAN_OUT_OF_CARDS;
      throw new ApiError({ ...cardNotFoundError, message });
    }
    return nextCard;
  }

  private prepareDeck(): CardDomain[] {
    return new CardGroup().getShuffledDeck();
  }

  /**
   * In three13, players are dealt different count of cards each round
   * Round 1 = 3 cards; Round 2 = 4 cards; etc, until Round 10 = 13 cards.
   */
   private dealHands(roundNumber: number, playerList: string[]): HandDomain {
    const cardCount = roundNumber;
    const playerCount = playerList.length;
    const cardGroups: CardDomain[][] = Array.from(Array(playerCount), () => []);

    for (let card = 0; card < cardCount; card++) {
      for (let player = 0; player < playerCount; player++) {
        const nextCard = this.deck.pop();
        if (!nextCard) {
          const message = 'dealHands: ' + RAN_OUT_OF_CARDS;
          throw new ApiError({ ...cardNotFoundError, message });
        }
        cardGroups[player].push(nextCard);
      }
    }

    const hands: HandDomain = {};
    for (let i = 0; i < playerCount; i++) {
      hands[playerList[i]] = cardGroups[i];
    }

    return hands;
  }

  private setRoundFirstPlayer(roundNumber: number, playerList: string[] ): string {
    const indexOfFirstPlayer = getIndexOfRoundFirstPlayer(roundNumber, playerList.length);
    return playerList[indexOfFirstPlayer];
  }
}