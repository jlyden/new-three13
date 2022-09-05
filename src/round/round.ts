import { CardDomain } from '../card-group/domains/card';
import { HandDomain } from '../card-group/domains/hand';
import { RoundDomain } from './domains/round';
import { getIndexOfRoundFirstPlayer } from '../commons/utils/utils';

export class Round {
  private id: string;
  private deck: RoundDomain['deck'];
  private hands: RoundDomain['hands'];
  private visibleCard: RoundDomain['visibleCard'];
  private nextPlayer: string;

  constructor(roundNumber: number, playerList: string[], id: string) {
    this.id = id;
    this.deck = this.getShuffledDeck();
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
    return { value: 1, suit: 'H' }
  }

  private getShuffledDeck(): CardDomain[] {
    // TODO!
    return [];
  }
  
  private dealHands(roundNumber: number, playerList: string[]): HandDomain[] {
    // TODO! use this.deck
    console.log(roundNumber, playerList);
    return [];
  }

  private setRoundFirstPlayer(roundNumber: number, playerList: string[] ): string {
    const indexOfFirstPlayer = getIndexOfRoundFirstPlayer(roundNumber, playerList.length);
    return playerList[indexOfFirstPlayer];
  }
}