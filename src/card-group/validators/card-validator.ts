import Joi from "joi";
import { SUITS } from "../domains/card";

const validSuits = Object.values(SUITS).join(',');

// TODO: TEST
export const cardDomainSchema = Joi.object({
  suit: Joi.string().valid(validSuits).required(),
  number: Joi.number().min(3).max(13).required(),
});