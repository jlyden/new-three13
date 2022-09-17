import express from 'express';
import { handleCreateRound, handleDeleteRound, handleGetRound, handleUpdateRoundDiscard, handleUpdateRoundDraw } from '../../round/round-controller';

const ROUND_ROUTE = `/game/:gameId/round/:roundNumber`;

const round = express.Router();

round.get(ROUND_ROUTE, handleGetRound);

round.post(ROUND_ROUTE, handleCreateRound);

round.put(`${ROUND_ROUTE}/draw`, handleUpdateRoundDraw);

round.put(`${ROUND_ROUTE}/discard`, handleUpdateRoundDiscard);

round.delete(ROUND_ROUTE, handleDeleteRound);

export { round };
