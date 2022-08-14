import express from 'express';
import { handleCreateRound, handleGetRounds } from '../../round/roundController';

const roundRoutes = express.Router();
roundRoutes.get('/', handleGetRounds);
roundRoutes.post('/', handleCreateRound);

export { roundRoutes };