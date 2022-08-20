import { CardDomain } from "../../card-group/domains/card";
import { HandDomain } from "../../card-group/domains/hand";

export interface RoundDomain {
  deck: Array<CardDomain>;
  hands: Array<HandDomain>;
  faceUpCard: CardDomain;
}