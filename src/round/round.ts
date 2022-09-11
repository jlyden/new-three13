import { CardDomain, Suits } from '../card-group/domains/card';
import { RoundDomain } from './domains/round';
import { getIndexOfRoundFirstPlayer } from '../commons/utils/utils';
import { CardGroup } from '../card-group/card-group';

export class Round {
  private id: string;
  private deck: RoundDomain['deck'];
  private hands: RoundDomain['hands'];
  private visibleCard: RoundDomain['visibleCard'];
  private nextPlayer: string;

  constructor(roundNumber: number, playerList: string[], gameId: string) {
    this.id = `${gameId}/${roundNumber}`;
    this.deck = new CardGroup().getShuffledDeck();
    this.hands = this.dealHands(roundNumber, playerList);
    this.visibleCard = this.drawCard();
    this.nextPlayer = this.setRoundFirstPlayer(roundNumber, playerList);
  }

  getNewRound() {
    return {
      id: this.id,
      deck: this.deck,
      hands: this.hands,
      visibleCard: this.visibleCard,
      nextPlayer: this.nextPlayer,
    }
  }

  drawCard(): CardDomain {
    // TODO! use this.deck
    return { value: 3, suit: Suits.Heart }
  }

  private dealHands(roundNumber: number, playerList: string[]): CardDomain[][] {
    // TODO! use this.deck
    console.log(roundNumber, playerList);
    return [];
  }

  private setRoundFirstPlayer(roundNumber: number, playerList: string[] ): string {
    const indexOfFirstPlayer = getIndexOfRoundFirstPlayer(roundNumber, playerList.length);
    return playerList[indexOfFirstPlayer];
  }
}