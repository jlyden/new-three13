import { NextFunction, Request, Response } from 'express';
import { createRound, drawCard, getRound } from './round-service';
import { RoundRouteDomain } from "./domains/round-route";
import { CreateRoundReturnDomain } from './domains/create-round-return';
import { roundRouteSchema } from './validators/round-route-validator';
import { ApiError, badRequestError } from '../commons/errors/api-error';
import { drawRoundRouteSchema } from './validators/draw-round-route-validator';
import { DrawRoundRouteDomain } from './domains/draw-round-route';
import { getGame } from '../game/game-service';

export function handleGetRound(req: Request, res: Response, next: NextFunction) {
  try {
    const result = getRound(getRoundId(getRoundRouteParams(req)));
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export function handleCreateRound(req: Request, res: Response, next: NextFunction) {
  try {
    const result: CreateRoundReturnDomain = createRound(getRoundRouteParams(req));
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export function handleUpdateRoundDraw(req: Request, res: Response, next: NextFunction) {
  try {
    const drawRoundRouteParams = getDrawRoundRouteParams(req);
    const result = drawCard(getRoundId(drawRoundRouteParams), drawRoundRouteParams.source);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

// TODO: finish
export function handleUpdateRoundDiscard(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    const bodyParams = JSON.stringify(req.body);
    res.send(`PUT /round/discard | Params: ${routeParams} && ${bodyParams}`);
  } catch (error) {
    next(error);
  }
}

// TODO: finish
export function handleDeleteRound(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    res.send(`DELETE /round | Params: ${routeParams}`);
  } catch (error) {
    next(error);
  }
}

/**
 * Return validated round route params (GET, POST, DELETE)
 */
function getRoundRouteParams(req: Request): RoundRouteDomain {
  const { value, error } = roundRouteSchema.validate(req.params);
  if (error) {
    throw new ApiError({ ...badRequestError, message: error.message });
  }
  return { gameId: value.gameId, roundNumber: parseInt(value.roundNumber) };
}

/**
 * Return validated draw round route params (PUT /draw)
 */
 function getDrawRoundRouteParams(req: Request): DrawRoundRouteDomain {
  const { value, error } = drawRoundRouteSchema.validate(req.params);
  if (error) {
    throw new ApiError({ ...badRequestError, message: error.message });
  }

  const gameInfo = getGame(value.gameId);
  if (gameInfo.roundNumber != value.roundNumber) {
    const message = `getDrawRoundRouteParams: unexpected round number. gameId: ${value.gameId} | expected roundNumber: ${gameInfo.roundNumber} | passed: ${value.roundNumber}`;
    throw new ApiError({ ...badRequestError, message });
  }

  return { gameId: value.gameId, roundNumber: parseInt(value.roundNumber), source: value.source };
}

function getRoundId(roundRouteParams: RoundRouteDomain): string {
  const { gameId, roundNumber } = roundRouteParams;
  return `${gameId}/${roundNumber}`;
}
