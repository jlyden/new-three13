import { assembleDeck, shuffleCards } from "../commons/utils/deck";
import { CardDomain } from "./domains/card";

// TODO: Rethink this class
export class CardGroup {
  protected group: CardDomain[];
  
  constructor(cardsToAdd?: CardDomain[]) {
    this.group = cardsToAdd ?? [];
  }

  public getShuffledDeck(): CardDomain[] {
    this.group = shuffleCards(assembleDeck());
    return this.getCards();
  }

  private getCards(): CardDomain[] {
    return this.group;
  }
}