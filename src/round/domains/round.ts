import { CardDomain } from "../../card-group/domains/card";
import { HandDomain } from "../../card-group/domains/hand";

export interface RoundDomain {
  id: string;
  deck: CardDomain[];
  hands: HandDomain[];
  visibleCard: CardDomain;
  nextPlayer: string;
}