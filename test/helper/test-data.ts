import { SUITS } from "../../src/round/domains/card";

// Users
const user1 = 'alice';
const user2 = 'bob';
const user3 = 'carol';
const user4 = 'dennis';

export const threePlayerList = [ user1, user2, user3 ];
export const fourPlayerList = threePlayerList.concat([user4]);

// Guids
export const missingGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';

// Cards
export const cardJ3 = { suit: SUITS.Joker, value: 3 };
export const cardJ4 = { suit: SUITS.Joker, value: 4 };
export const cardC3 = { suit: SUITS.Club, value: 3 };
export const cardD3 = { suit: SUITS.Diamond, value: 3 };
export const cardD4 = { suit: SUITS.Diamond, value: 4 };
export const cardD5 = { suit: SUITS.Diamond, value: 5 };
export const cardD6 = { suit: SUITS.Diamond, value: 6 };
export const cardD8 = { suit: SUITS.Diamond, value: 8 };
export const cardD13 = { suit: SUITS.Diamond, value: 13 };
export const cardD7 = { suit: SUITS.Diamond, value: 7 };
export const cardH3 = { suit: SUITS.Heart, value: 3 };
export const cardH5 = { suit: SUITS.Heart, value: 5 };
export const cardH10 = { suit: SUITS.Heart, value: 10 };
export const cardH13 = { suit: SUITS.Heart, value: 13 };
export const cardS3 = { suit: SUITS.Spade, value: 3 };
export const cardS4 = { suit: SUITS.Spade, value: 4 };
export const cardS5 = { suit: SUITS.Spade, value: 5 };
export const cardS6 = { suit: SUITS.Spade, value: 6 };
export const cardS8 = { suit: SUITS.Spade, value: 8 };
export const cardS9 = { suit: SUITS.Spade, value: 9 };
export const cardS10 = { suit: SUITS.Spade, value: 10 };
export const cardS13 = { suit: SUITS.Spade, value: 13 };
