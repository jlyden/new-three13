import { NextFunction, Request, Response } from 'express';
import { createRound, getRound } from './round-service';

import { RoundRouteDomain } from "./domains/round-route";
import { CreateRoundReturnDomain } from './domains/create-round-return';
import { roundRouteSchema } from './validators/round-route-validator';
import { BadRequestError } from '../commons/errors/bad-request';

export function handleGetRound(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    const { gameId, roundNumber } = getRoundRouteParams(req);
    const result = getRound(`${gameId}/${roundNumber}`);
    res.send(`GET /round | Params: ${routeParams} | Return: ${JSON.stringify(result)}`);
  } catch (error) {
    next(error);
  }
}

export function handleCreateRound(req: Request, res: Response, next: NextFunction) {
  try {
    const result: CreateRoundReturnDomain = createRound(getRoundRouteParams(req));
    res.send(`POST /round | Params: ${JSON.stringify(req.params)} | Return: ${JSON.stringify(result)}`);
  } catch (error) {
    next(error);
  }
}

export function handleUpdateRoundDraw(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    res.send(`PUT /round/draw | Params: ${routeParams}`);
  } catch (error) {
    next(error);
  }
}

export function handleUpdateRoundDiscard(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    const bodyParams = JSON.stringify(req.body);
    res.send(`PUT /round/discard | Params: ${routeParams} && ${bodyParams}`);
  } catch (error) {
    next(error);
  }
}
export function handleDeleteRound(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    res.send(`DELETE /round | Params: ${routeParams}`);
  } catch (error) {
    next(error);
  }
}

/**
 * Return validated route params
 */
function getRoundRouteParams(req: Request): RoundRouteDomain {
  const { error } = roundRouteSchema.validate(req.params);
  if (error) {
    throw new BadRequestError(error.message);
  }

  const { gameId, roundNumber } = req.params;
  return { gameId, roundNumber: parseInt(roundNumber) };
}
