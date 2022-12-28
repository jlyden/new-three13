export interface CardDomain {
  suit: string;
  value: number;
}

export enum SUITS {
  Club = 'Club',
  Diamond = 'Diamond',
  Heart = 'Heart',
  Spade = 'Spade',
  Joker = 'Joker',
}

export const VALUES: number[] = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export const EMPTY_CARD = {
  suit: SUITS.Joker,
  value: 13,
}