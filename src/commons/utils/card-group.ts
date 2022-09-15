import { CardDomain, Suits, VALUES } from "../../card-group/domains/card";

export function assembleDeck(): CardDomain[] {
  const deck: CardDomain[] = [];

  // Handle the four main suits
  const suitsCopy: { [key:string] : string } = { ...Suits };
  delete suitsCopy.Joker;
  for (const suit of Object.keys(suitsCopy)) {
    for (const value of VALUES) {
      deck.push({ suit, value })
    }
  }
  // Add two Jokers, this is 313
  deck.push({ suit: Suits.Joker, value: 3 });
  deck.push({ suit: Suits.Joker, value: 4 });
  
  return deck;
}

export function shuffleCards(cards: CardDomain[]): CardDomain[] {
  // Start with end of deck
  let cardCountdown = cards.length;
  let cardToSwap: number;

  while (cardCountdown) {
    // Get value from front of deck
    cardToSwap = Math.floor(Math.random() * cardCountdown--);
    // and swap with value from end of deck
    [cards[cardCountdown], cards[cardToSwap]] = [cards[cardToSwap], cards[cardCountdown]];
  }

  return cards;
}

export function reduceCardsByValue(cards: CardDomain[]) {
  const reducedValues: { [key: string]: number } = cards.reduce((tally: { [key: string]: number }, card: CardDomain) => {
    tally[card.value] = tally[card.value] + 1 || 1;
    return tally;
  }, {});

  return reducedValues;
}
