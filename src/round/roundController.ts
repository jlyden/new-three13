import { Request, Response } from 'express';

export function handleCreateRound(req: Request, res: Response) {
  // req will include gameId, previous round #, count of players
  // generate deck & shuffle
  // deal hand (card count === new round #) to each player
  // update game with new round #
  // save round: deck, hands, user to play
  const bodyParams = JSON.stringify(req.body);
  res.send(`POST /rounds | Params: ${bodyParams}`);
}

export function handleGetRounds(_req: Request, res: Response) {
  res.send('GET /rounds | Params: N/A');
}