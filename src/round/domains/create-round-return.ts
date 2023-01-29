import { CardDomain } from "./card";

export interface CreateRoundReturnDomain {
  visibleCard: CardDomain;
  nextPlayer: string;
}