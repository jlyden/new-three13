import { CardDomain } from "../../card-group/domains/card";

export interface DiscardBodyDomain {
  card: CardDomain;
  dispatch: boolean;
}