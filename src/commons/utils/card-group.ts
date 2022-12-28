import { CardDomain } from "../../card-group/domains/card";
import { ApiError, badRequestError } from "../errors/api-error";

// TODO: TEST
export function discardFromGroup(cards: CardDomain[], discard: CardDomain): CardDomain[] {
  const remainder: CardDomain[] = cards.filter(
    (card) => card.suit !== discard.suit && card.value !== discard.value
  );

  if (remainder.length !== (cards.length - 1)) {
    const message = `discardFromGroup: unexpected filter: cards: ${JSON.stringify(cards)} | discard: ${JSON.stringify(discard)}`;
    throw new ApiError({ ...badRequestError, message });
  }

  return remainder;
}


export function reduceCardsByValue(cards: CardDomain[]) {
  const reducedValues: { [key: string]: number } = cards.reduce((tally: { [key: string]: number }, card: CardDomain) => {
    tally[card.value] = tally[card.value] + 1 || 1;
    return tally;
  }, {});

  return reducedValues;
}
