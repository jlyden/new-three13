import { CardDomain } from '../card-group/domains/card';
import { HandDomain } from '../card-group/domains/hand';
import { RoundDomain } from './domains/round';

export class Round {
  private deck: RoundDomain['deck'];
  private hands: RoundDomain['hands'];
  private faceUpCard: RoundDomain['faceUpCard'];

  constructor(roundNumber: number, playerCount: number) {
    this.deck = this.getShuffledDeck();
    this.hands = this.dealHands(roundNumber, playerCount);
    this.faceUpCard = this.drawCard();
  }

  getRound() {
    return {
      deck: this.deck,
      hands: this.hands,
      faceUpCard: this.faceUpCard
    }
  }

  drawCard(): CardDomain {
    // TODO! use this.deck
    return { value: 1, suit: 'H' }
  }

  private getShuffledDeck(): Array<CardDomain> {
    // TODO!
    return [];
  }
  
  private dealHands(roundNumber: number, playerCount: number): Array<HandDomain> {
    // TODO! use this.deck
    console.log(roundNumber, playerCount);
    return [];
  } 
}