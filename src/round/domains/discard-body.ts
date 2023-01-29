import { CardDomain } from "./card";

export interface DiscardBodyDomain {
  discard: CardDomain;
  dispatch: boolean;
}