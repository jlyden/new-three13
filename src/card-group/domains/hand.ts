import { CardDomain } from './card';

export interface HandDomain {
  [player: string]: CardDomain[];
}