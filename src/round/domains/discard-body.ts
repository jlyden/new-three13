import { CardDomain } from "../../card-group/domains/card";

export interface DiscardBodyDomain {
  discard: CardDomain;
  dispatch: boolean;
}