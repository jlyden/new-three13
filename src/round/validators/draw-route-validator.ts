import Joi from 'joi';
import { DRAW_TYPE_DECK, DRAW_TYPE_VISIBLE } from '../round-service';

// gameId/roundNumber test covered by round-route-validator.spec.ts
// source test covered by round.spec.ts
export const drawRouteSchema = Joi.object({
  gameId: Joi.string().guid().required(),
  roundNumber: Joi.number().min(3).max(13).required(),
  source: Joi.string().valid(DRAW_TYPE_DECK, DRAW_TYPE_VISIBLE).required(),
});