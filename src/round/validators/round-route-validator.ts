import Joi from 'joi';

export const roundRouteSchema = Joi.object({
  gameId: Joi.string().guid().required(),
  roundNumber: Joi.number().min(3).max(13).required(),
});