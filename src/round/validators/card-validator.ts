import Joi from "joi";
import { SUITS } from "../domains/card";

const validSuits = Object.values(SUITS).join(',');

// TODO: TEST
export const cardDomainSchema = Joi.object({
  suit: Joi.string().allow(validSuits).required(),
  value: Joi.number().min(3).max(13).required(),
});