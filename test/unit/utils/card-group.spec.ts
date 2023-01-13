import { CardDomain } from "../../../src/card-group/domains/card";
import { ApiError, badRequestError } from "../../../src/commons/errors/api-error";
import { removeFromGroup, reduceCardsByValue } from "../../../src/commons/utils/card-group";
import { cardS3, cardS4, cardS5, cardS6, cardS9, cardH13, cardH10, cardH3, cardH5 } from "../../helper/test-data";

describe('removeFromGroup', () => {
  const testCardGroup: CardDomain[] = [ cardS3, cardS9, cardH13, cardH5 ];

  it('returns the expected updatedGroup', () => {
    const testCardToRemove: CardDomain = cardH13;
    const expectedUpdatedGroup: CardDomain[] = [ cardS3, cardS9, cardH5 ];

    const actualUpdatedGroup = removeFromGroup(testCardGroup, testCardToRemove);
    expect(actualUpdatedGroup).toEqual(expectedUpdatedGroup);
  });

  it('throws when cardToRemove is not in cardGroup', () => {
    const cardToRemoveNotInGroup: CardDomain = cardH3;
    const message = 'removeFromGroup error! cards: [{"suit":"Spade","value":3},{"suit":"Spade","value":9},{"suit":"Heart","value":13},{"suit":"Heart","value":5}] | discard: {"suit":"Heart","value":3}';
    const expectedError = new ApiError({ ...badRequestError, message });
    expect(() => removeFromGroup(testCardGroup, cardToRemoveNotInGroup)).toThrowError(expectedError);
  })
});

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