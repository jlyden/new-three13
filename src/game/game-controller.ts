import { NextFunction, Request, Response } from "express";
import { CreateRoundReturnDomain } from "../round/domains/create-round-return";
import { createRound } from "../round/round-service";
import { createGame } from "./game-service";

export function handleCreateGame(req: Request, res: Response, next: NextFunction) {
  try {
    const gameId = createGame(req.body.playerList);
    const result: CreateRoundReturnDomain = createRound({ gameId: gameId, roundNumber: 3 });
    res.send(`POST /rounds | Params: ${JSON.stringify(req.body)} | Return: ${JSON.stringify(result)}`);
  } catch (error) {
    next(error);
  }
}