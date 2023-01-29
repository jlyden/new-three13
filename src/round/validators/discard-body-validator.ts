import Joi from "joi";
import { cardDomainSchema } from "./card-validator";

// TODO: TEST
export const discardBodySchema = Joi.object({
  card: cardDomainSchema.required(),
  dispatch: Joi.boolean().required(),
});