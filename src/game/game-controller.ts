import { NextFunction, Request, Response } from "express";
import { ApiError, badRequestError } from "../commons/errors/api-error";
import { CreateRoundReturnDomain } from "../round/domains/create-round-return";
import { createRound } from "../round/round-service";
import { createGame, getGame } from "./game-service";
import { gameRouteSchema } from "./validators/game-route-validator";

export function handleGetGame(req: Request, res: Response, next: NextFunction) {
  try {
    const gameId = getGameRouteParams(req);
    const result = getGame(gameId);
    res.send(`GET /game | Params: ${gameId} | Return: ${JSON.stringify(result)}`);
  } catch (error) {
    next(error);
  }
}

export function handleCreateGame(req: Request, res: Response, next: NextFunction) {
  try {
    const gameId = createGame(req.body.playerList);
    const result: CreateRoundReturnDomain = createRound({ gameId: gameId, roundNumber: 3 });
    res.send(`POST /rounds | Params: ${JSON.stringify(req.body)} | Return: ${JSON.stringify(result)}`);
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