import { CardDomain, SUITS, VALUES } from "../../src/card-group/domains/card";

export function validateGenericCard(card: CardDomain): void {
  expect(Object.keys(SUITS)).toContain(card.suit);
  expect(VALUES).toContain(card.value);
}
