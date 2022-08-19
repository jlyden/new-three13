import { NextFunction, Request, Response } from 'express';
import { createRound } from './roundService';

import { RoundRouteParams } from "../commons/interfaces/round-route";

export function handleGetRound(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    res.send(`GET /rounds | Params: ${routeParams}`);
  } catch (error) {
    next(error);
  }
}

export function handleCreateRound(req: Request, res: Response, next: NextFunction) {
  try {
    const faceUpCard = createRound(getRoundRouteParams(req));
    res.send(`POST /rounds | Params: ${JSON.stringify(req.params)} | Return: ${faceUpCard}`);
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

function getRoundRouteParams(req: Request): RoundRouteParams
{
  const { gameId, roundNumber } = req.params;

  return { gameId, roundNumber: parseInt(roundNumber) };
}
