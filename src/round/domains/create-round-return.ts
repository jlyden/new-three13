import { CardDomain } from "../../card-group/domains/card";

export interface CreateRoundReturnDomain {
  visibleCard: CardDomain;
  nextPlayer: string;
}