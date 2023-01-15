import { NextFunction, Request, Response } from "express";
import { ApiError, badRequestError, HttpCode } from "../commons/errors/api-error";
import { createGame, deleteGame, getGame } from "./game-service";
import { gameRouteSchema } from "./validators/game-route-validator";

/**
 * Handler for GET /game/:gameId
 */
export function handleGetGame(req: Request, res: Response, next: NextFunction) {
  try {
    const gameId = getGameRouteParams(req);
    const result = getGame(gameId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Handler for POST /game
 */
export function handleCreateGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { playerList, gameId } = req.body;
    const result = createGame(playerList, gameId);
    res.status(HttpCode.CREATED).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Handler for DELETE /game/:gameId
 */
export function handleDeleteGame(req: Request, res: Response, next: NextFunction) {
  try {
    const gameId = getGameRouteParams(req);
    deleteGame(gameId);
    const result = { 'message': `Game deleted: ${gameId}` };
    res.json(result);
  } catch (error) {
    next(error);
  }
}

function getGameRouteParams(req: Request): string {
  const { value, error } = gameRouteSchema.validate(req.params);
  if (error) {
    throw new ApiError({ ...badRequestError, message: error.message });
  }
  return value.gameId;
}
