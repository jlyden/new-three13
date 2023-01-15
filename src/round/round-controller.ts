import { NextFunction, Request, Response } from 'express';
import { createRound, deleteRound, drawCard, getRound, processDiscard } from './round-service';
import { RoundRouteDomain } from "./domains/round-route";
import { CreateRoundReturnDomain } from './domains/create-round-return';
import { roundRouteSchema } from './validators/round-route-validator';
import { ApiError, badRequestError } from '../commons/errors/api-error';
import { drawRouteSchema } from './validators/draw-route-validator';
import { DrawRouteDomain } from './domains/draw-route';
import { getGame } from '../game/game-service';
import { DiscardBodyDomain } from './domains/discard-body';
import { discardBodySchema } from './validators/discard-body-validator';

/**
 * Handler for GET /game/:gameId/round/:roundNumber
 */
export function handleGetRound(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, roundNumber } = getRoundRouteParams(req);
    const result = getRound(gameId, roundNumber);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Handler for POST /game/:gameId/round/:roundNumber
 */
export function handleCreateRound(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, roundNumber } = getRoundRouteParams(req);
    const result: CreateRoundReturnDomain = createRound(gameId, roundNumber);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Handler for PUT /game/:gameId/round/:roundNumber/draw/:source
 */
export function handleUpdateRoundDraw(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, roundNumber, source } = getDrawRoundRouteParams(req);
    const result = drawCard(gameId, roundNumber, source);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Handler for PUT /game/:gameId/round/:roundNumber/discard
 */
export function handleUpdateRoundDiscard(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, roundNumber } = getRoundRouteParams(req);
    const { discard, dispatch } = getDiscardBodyParams(req);
    const result = processDiscard(gameId, roundNumber, discard, dispatch);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Handler for DELETE /game/:gameId/round/:roundNumber
 */
export function handleDeleteRound(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId, roundNumber } = getRoundRouteParams(req);
    deleteRound(gameId, roundNumber);
    const result = { 'message': `Round: ${roundNumber} deleted for Game: ${gameId}` };
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Return validated get round route params (GET, POST, PUT /discard, DELETE)
 */
function getRoundRouteParams(req: Request): RoundRouteDomain {
  const { value, error } = roundRouteSchema.validate(req.params);
  if (error) {
    throw new ApiError({ ...badRequestError, message: error.message });
  }

  ensureValidRoundRouteParam(value.gameId, value.roundNumber);
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

  ensureValidRoundRouteParam(value.gameId, value.roundNumber);
  return { gameId: value.gameId, roundNumber: parseInt(value.roundNumber), source: value.source };
}

/**
 * Return validated PUT /discard body params
 */
function getDiscardBodyParams(req: Request): DiscardBodyDomain {
  const { value, error } = discardBodySchema.validate(req.body);
  if (error) {
    throw new ApiError({ ...badRequestError, message: error.message });
  }

  return { discard: value.card, dispatch: value.dispatch };
}

/**
 * Ensure round param matches expected roundNumber for Game
 */
function ensureValidRoundRouteParam(gameId: string, round: number): void {
  const gameInfo = getGame(gameId);
  if (gameInfo.roundNumber != round) {
    const message = `ensureValidRoundRouteParams: unexpected round number. gameId: ${gameId} | expected roundNumber: ${gameInfo.roundNumber} | passed: ${round}`;
    throw new ApiError({ ...badRequestError, message });
  }
  return;
}