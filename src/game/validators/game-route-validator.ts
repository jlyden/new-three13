import Joi from 'joi';

// Testing covered by round-route-validator.spec.ts
export const gameRouteSchema = Joi.object({
  gameId: Joi.string().guid().required(),
});