import { CardDomain, Suits } from "../../src/card-group/domains/card";

export function validateGenericCard(card: CardDomain): void {
  expect(card.suit).toBeDefined();
  expect(card.value).toBeDefined();
  expect(Object.keys(Suits)).toContain(card.suit);
  expect(typeof card.value).toBe('number');
}