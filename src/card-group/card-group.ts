import { assembleDeck, shuffleCards } from "../commons/utils/card-group";
import { CardDomain } from "./domains/card";

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