import { Request, Response } from 'express';

export function handleCreateRound(req: Request, res: Response) {
}

export function handleGetRounds(req: Request, res: Response) {
  res.send('<h1>something is working</h1><h2>but this is not a round</h2>');
}