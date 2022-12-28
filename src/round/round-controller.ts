import { NextFunction, Request, Response } from 'express';
import { createRound, drawCard, getRound, processDiscard } from './round-service';
import { RoundRouteDomain } from "./domains/round-route";
import { CreateRoundReturnDomain } from './domains/create-round-return';
import { roundRouteSchema } from './validators/round-route-validator';
import { ApiError, badRequestError } from '../commons/errors/api-error';
import { drawRouteSchema } from './validators/draw-route-validator';
import { DrawRouteDomain } from './domains/draw-route';
import { getGame } from '../game/game-service';
import { DiscardBodyDomain } from './domains/discard-body';
import { discardBodySchema } from './validators/discard-body-validator';

export function handleGetRound(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, roundNumber } = getRoundRouteParams(req);
    const result = getRound(gameId, roundNumber);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export function handleCreateRound(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, roundNumber } = getRoundRouteParams(req);
    const result: CreateRoundReturnDomain = createRound(gameId, roundNumber);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export function handleUpdateRoundDraw(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, roundNumber, source } = getDrawRoundRouteParams(req);
    const result = drawCard(gameId, roundNumber, source);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export function handleUpdateRoundDiscard(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, roundNumber } = getRoundRouteParams(req);
    const { card, dispatch } = getDiscardBodyParams(req);
    const result = processDiscard(gameId, roundNumber, card, dispatch);
    res.json(result);
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
 function getDrawRoundRouteParams(req: Request): DrawRouteDomain {
  const { value, error } = drawRouteSchema.validate(req.params);
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

function getDiscardBodyParams(req: Request): DiscardBodyDomain {
  const { value, error } = discardBodySchema.validate(req.body);
  if (error) {
    throw new ApiError({ ...badRequestError, message: error.message });
  }

  return { card: value.card, dispatch: value.dispatch };
}