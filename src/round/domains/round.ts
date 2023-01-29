import { CardDomain } from "./card";
import { HandDomain } from "./hand";

export interface RoundDomain {
  id: string;
  deck: CardDomain[];
  hands: HandDomain;
  visibleCard: CardDomain|undefined;
  nextPlayer: string;
}