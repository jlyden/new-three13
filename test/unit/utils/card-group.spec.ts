import { reduceCardsByValue } from "../../../src/commons/utils/card-group";
import { cardS3, cardS4, cardS5, cardS6, cardS9, cardH13, cardH10, cardH3, cardH5 } from "../../helper/test-data";

describe('reduceCardsByValue', () => {
  it('returns the expected reduced object', () => {
    const someCards = [cardS3, cardS4, cardS5, cardS6, cardS9, cardH13, cardH10, cardH3, cardH5];
    const expectedReduction = {
      '3': 2,
      '4': 1,
      '5': 2,
      '6': 1,
      '9': 1,
      '10': 1,
      '13': 1,
    };
    expect(reduceCardsByValue(someCards)).toEqual(expectedReduction);
  });
});