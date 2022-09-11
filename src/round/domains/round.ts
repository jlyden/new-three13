import { CardDomain } from "../../card-group/domains/card";

export interface RoundDomain {
  id: string;
  deck: CardDomain[];
  hands: CardDomain[][];
  visibleCard: CardDomain;
  nextPlayer: string;
}