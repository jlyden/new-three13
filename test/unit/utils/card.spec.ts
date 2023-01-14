import { cardsMatch } from "../../../src/commons/utils/card";
import { cardS3, cardS5, cardH13, cardH3 } from "../../helper/test-data";

describe('cardsMatch', () => {
  it('returns true when cards have same suit and value', () => {
    expect(cardsMatch(cardS3, cardS3)).toEqual(true);
  });

  it('returns false when cards have different suits and same value', () => {
    expect(cardsMatch(cardS3, cardH3)).toEqual(false);
  });

  it('returns false when cards have same suit and different values', () => {
    expect(cardsMatch(cardS3, cardS5)).toEqual(false);
  });

  it('returns false when cards have different suits and different values', () => {
    expect(cardsMatch(cardS3, cardH13)).toEqual(false);
  });
});
