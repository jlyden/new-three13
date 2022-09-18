import { NextFunction, Request, Response } from "express";
import { ApiError, badRequestError } from "../commons/errors/api-error";
import { createGame, getGame } from "./game-service";
import { gameRouteSchema } from "./validators/game-route-validator";

export function handleGetGame(req: Request, res: Response, next: NextFunction) {
  try {
    const gameId = getGameRouteParams(req);
    const result = getGame(gameId);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export function handleCreateGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { playerList, gameId } = req.body;
    const result = createGame(playerList, gameId);
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
