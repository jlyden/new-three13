import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

export function validate(req: Request, _res: Response, next: NextFunction, validator: Joi.ObjectSchema) {
  if (!req.params) {
    next();
  }

  const { error } = validator.validate(req.params);
  if (error) {
    next(error);
  }
}