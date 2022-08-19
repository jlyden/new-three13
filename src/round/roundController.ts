import { NextFunction, Request, Response } from 'express';

export function handleGetRound(req: Request, res: Response, next: NextFunction) {
  try {
    const routeParams = JSON.stringify(req.params);
    res.send(`GET /rounds | Params: ${routeParams}`);
  } catch (error) {
    next(error);
  }
}

export function handleCreateRound(req: Request, res: Response, next: NextFunction) {
  // req will include gameId, new round number, count of players (body)
  // generate deck & shuffle
  // deal hand (card count === new round #) to each player
  // update game with new round #
  // save round: deck, hands, user to play
  try {
    const routeParams = JSON.stringify(req.params);
    const bodyParams = JSON.stringify(req.body);
    res.send(`POST /rounds | Params: ${routeParams} && ${bodyParams}`);
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
