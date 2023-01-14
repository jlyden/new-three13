import { CardDomain } from "../../card-group/domains/card";

/**
 * Returns true if cardsMatch
 */
export function cardsMatch(cardOne: CardDomain, cardTwo: CardDomain): boolean {
  return cardOne.suit === cardTwo.suit && cardOne.value === cardTwo.value;
}
