import { CardDomain } from "../../round/domains/card";
import { ApiError, badRequestError } from "../errors/api-error";

/**
 * Returns new CardDomain[] with cardToRemove taken out
 * Throws BadRequest Error if cardToRemove is not found
 */
export function removeFromGroup(originalGroup: CardDomain[], cardToRemove: CardDomain): CardDomain[] {
  const updatedGroup: CardDomain[] = [];

  originalGroup.forEach(card => {
    if (!cardsMatch(card, cardToRemove)) {
      updatedGroup.push(card);
    }
  });

  if (updatedGroup.length != (originalGroup.length - 1)) {
    const message = `removeFromGroup error! cards: ${JSON.stringify(originalGroup)} | discard: ${JSON.stringify(cardToRemove)}`;
    throw new ApiError({ ...badRequestError, message });
  }

  return updatedGroup;
}

/**
 * Returns array of the values of cards associated to how many of that value was found
 * ex. return: [ '3': 5, '4': 5, '5': 4, '6': 4, '7': 4, <etc> ]
 */
export function reduceCardsByValue(cards: CardDomain[]) {
  const reducedValues: { [key: string]: number } = cards.reduce((tally: { [key: string]: number }, card: CardDomain) => {
    tally[card.value] = tally[card.value] + 1 || 1;
    return tally;
  }, {});

  return reducedValues;
}

/**
 * Returns true if cards match
 * Testing covered by removeFromGroup
 */
function cardsMatch(cardOne: CardDomain, cardTwo: CardDomain): boolean {
  return cardOne.suit === cardTwo.suit && cardOne.value === cardTwo.value;
}
