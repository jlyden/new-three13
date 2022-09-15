import { CardDomain, Suits } from "../../../src/card-group/domains/card";
import { assembleDeck, reduceCardsByValue, shuffleCards } from "../../../src/commons/utils/card-group";
import { cardS3, cardS4, cardS5, cardS6, cardS9, cardH13, cardH10, cardH3, cardH5 } from "../../common/test-data";

interface genObj { [key: string]: number }

describe('assembleDeck', () => {
  const testDeck = assembleDeck();  

  it('generates a deck of cards with 46 members', () => {
    // 313 excludes Aces & Twos, but includes 2 Jokers; 52 - 8 + 2 = 46
    expect(testDeck.length).toEqual(46);
  });

  it('generates a deck with 11 cards for each of 4 suits, plus 2 Jokers', () => {
    const reducedSuits: genObj = testDeck
      .reduce((tally: genObj, card: CardDomain) => {
        tally[card.suit] = tally[card.suit] + 1 || 1;
        return tally;
      }, {});
    const arrayOfSuitCounts: number[] = Object.values(reducedSuits);
    const arrayOfSuits: string[] = Object.keys(reducedSuits);

    expect(arrayOfSuitCounts.length).toEqual(5);
    expect(arrayOfSuits).toEqual(Object.keys(Suits));
    expect(arrayOfSuitCounts).toEqual([11, 11, 11, 11, 2]);
  });

  it('generates a deck with 4 (of different suits) cards for each number/face card plus 2 Jokers', () => {
    const testDeckReducedArray = reduceCardsByValue(testDeck);
    const arrayOfValueCounts: number[] = Object.values(testDeckReducedArray);
    const arrayOfValues: string[] = Object.keys(testDeckReducedArray);

    expect(arrayOfValueCounts.length).toEqual(11);
    // Because of how code handles Jokers, there are 5 '3' and 5 '4' cards
    expect(arrayOfValueCounts).toEqual([5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    expect(arrayOfValues).toEqual(['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']);
  });
});

describe('shuffleCards', () => {
  it('mixes up a deck of cards', () => {
    const testDeck = assembleDeck();
    const beforeDeck = JSON.parse(JSON.stringify(testDeck)) as typeof testDeck;
    const afterDeck = shuffleCards(testDeck);
    expect(afterDeck).not.toStrictEqual(beforeDeck);
  });
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