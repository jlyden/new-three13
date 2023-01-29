import { CardDomain, SUITS } from "../../../src/round/domains/card";
import { reduceCardsByValue } from "../../../src/commons/utils/card";
import { assembleDeck, shuffleCards } from "../../../src/commons/utils/deck";

interface genObj { [key: string]: number }

describe('assembleDeck', () => {
  const testDeck = assembleDeck();  

  it('generates a deck of cards with 46 members', () => {
    // 313 excludes Aces & Twos, but includes 2 Jokers; 52 - 8 + 2 = 46
    expect(testDeck.length).toBe(46);
  });

  it('generates a deck with 11 cards for each of 4 suits, plus 2 Jokers', () => {
    const reducedSuits: genObj = testDeck
      .reduce((tally: genObj, card: CardDomain) => {
        tally[card.suit] = tally[card.suit] + 1 || 1;
        return tally;
      }, {});
    const arrayOfSuitCounts: number[] = Object.values(reducedSuits);
    const arrayOfSuits: string[] = Object.keys(reducedSuits);

    expect(arrayOfSuitCounts.length).toBe(5);
    expect(arrayOfSuits).toEqual(Object.keys(SUITS));
    expect(arrayOfSuitCounts).toEqual([11, 11, 11, 11, 2]);
  });

  it('generates a deck with 4 (of different suits) cards for each number/face card plus 2 Jokers', () => {
    const testDeckReducedArray = reduceCardsByValue(testDeck);
    const arrayOfValueCounts: number[] = Object.values(testDeckReducedArray);
    const arrayOfValues: string[] = Object.keys(testDeckReducedArray);

    expect(arrayOfValueCounts.length).toBe(11);
    // Because of how code handles Jokers, there are 5 '3' and 5 '4' cards
    expect(arrayOfValueCounts).toEqual([5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    expect(arrayOfValues).toEqual(['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']);
  });
});

describe('shuffleCards', () => {
  it('mixes up a deck of cards', () => {
    const testDeck = assembleDeck();
    const beforeDeck = JSON.parse(JSON.stringify(testDeck)) as typeof testDeck;
    expect(beforeDeck).toStrictEqual(beforeDeck);

    const afterDeck = shuffleCards(testDeck);

    expect(afterDeck).not.toStrictEqual(beforeDeck);
    expect(afterDeck.length).toStrictEqual(beforeDeck.length);
  });
});
