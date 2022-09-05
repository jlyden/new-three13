import express from 'express';
import { handleCreateRound, handleDeleteRound, handleGetRound, handleUpdateRoundDiscard, handleUpdateRoundDraw } from '../../round/roundController';
import { validateRoundRouteSchema } from '../middleware/validators/round-route-validator';

const ROUNDS_ROUTE = `/games/:gameId/rounds/:roundNumber`;

const rounds = express.Router();

rounds.use(ROUNDS_ROUTE, validateRoundRouteSchema);

rounds.get(ROUNDS_ROUTE, handleGetRound);

rounds.post(ROUNDS_ROUTE, handleCreateRound);

rounds.put(`${ROUNDS_ROUTE}/draw`, handleUpdateRoundDraw);

rounds.put(`${ROUNDS_ROUTE}/discard`, handleUpdateRoundDiscard);

rounds.delete(ROUNDS_ROUTE, handleDeleteRound);

export { rounds };
