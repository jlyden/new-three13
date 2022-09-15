import { NextFunction, Request, Response } from 'express';
import { createRound, getRound } from './round-service';

import { RoundRouteDomain } from "./domains/round-route";
import { CreateRoundReturnDomain } from './domains/create-round-return';

export function handleGetRound(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    const { gameId, roundNumber } = getRoundRouteParams(req);
    const result = getRound(`${gameId}/${roundNumber}`);
    res.send(`GET /rounds | Params: ${routeParams} | Return: ${JSON.stringify(result)}`);
  } catch (error) {
    next(error);
  }
}

export function handleCreateRound(req: Request, res: Response, next: NextFunction) {
  try {
    const result: CreateRoundReturnDomain = createRound(getRoundRouteParams(req));
    res.send(`POST /rounds | Params: ${JSON.stringify(req.params)} | Return: ${JSON.stringify(result)}`);
  } catch (error) {
    next(error);
  }
}

export function handleUpdateRoundDraw(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    res.send(`PUT /rounds/draw | Params: ${routeParams}`);
  } catch (error) {
    next(error);
  }
}

export function handleUpdateRoundDiscard(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    const bodyParams = JSON.stringify(req.body);
    res.send(`PUT /rounds/discard | Params: ${routeParams} && ${bodyParams}`);
  } catch (error) {
    next(error);
  }
}
export function handleDeleteRound(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    res.send(`DELETE /rounds | Params: ${routeParams}`);
  } catch (error) {
    next(error);
  }
}

function getRoundRouteParams(req: Request): RoundRouteDomain
{
  const { gameId, roundNumber } = req.params;

  return { gameId, roundNumber: parseInt(roundNumber) };
}
