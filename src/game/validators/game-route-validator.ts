import Joi from 'joi';

export const gameRouteSchema = Joi.object({
  gameId: Joi.string().guid().required(),
});