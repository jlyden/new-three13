import { CardDomain } from '../card-group/domains/card';
import { RoundDomain } from './domains/round';
import { getIndexOfRoundFirstPlayer } from '../commons/utils/utils';
import { CardGroup } from '../card-group/card-group';
import { HandDomain } from '../card-group/domains/hand';
import { CardNotFoundError } from '../commons/errors/card-not-found';

const RAN_OUT_OF_CARDS = 'ran out of cards in deck';

export class Round {
  private id: string;
  private deck: RoundDomain['deck'];
  private hands: RoundDomain['hands'];
  private visibleCard: RoundDomain['visibleCard'];
  private nextPlayer: string;

  constructor(roundNumber: number, playerList: string[], gameId: string) {
    this.id = `${gameId}/${roundNumber}`;
    this.deck = this.prepareDeck();
    this.hands = this.dealHands(roundNumber, playerList);
    this.visibleCard = this.drawCard();
    this.nextPlayer = this.setRoundFirstPlayer(roundNumber, playerList);
  }

  getRound() {
    return {
      id: this.id,
      deck: this.deck,
      hands: this.hands,
      visibleCard: this.visibleCard,
      nextPlayer: this.nextPlayer,
    }
  }

  drawCard(): CardDomain {
    const nextCard = this.deck.pop();
    if (!nextCard) {
      throw new CardNotFoundError('drawCard: ' + RAN_OUT_OF_CARDS)
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
          throw new CardNotFoundError('dealHands: ' + RAN_OUT_OF_CARDS)
        }
        cardGroups[player].push(nextCard);
      }
    }

    const hands: HandDomain = {};
    for (let i = 0; i < playerCount; i++) {
      hands[playerList[i]] = cardGroups[i];
      console.log(hands[playerList[i]]);
    }

    return hands;
  }

  private setRoundFirstPlayer(roundNumber: number, playerList: string[] ): string {
    const indexOfFirstPlayer = getIndexOfRoundFirstPlayer(roundNumber, playerList.length);
    return playerList[indexOfFirstPlayer];
  }
}