import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const roundRouteSchema = Joi.object({
  gameId: Joi.string().guid().required(),
  roundNumber: Joi.number().min(3).max(13).required(),
});

export function validateRoundRouteSchema(req: Request, _res: Response, next: NextFunction) {
  const { error } = roundRouteSchema.validate(req.params);

  if (error) {
    next(error);
  }

  next();
}