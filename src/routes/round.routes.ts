import express from 'express';
import { handleCreateRound, handleGetRounds } from '../controllers/roundController';

const roundRoutes = express.Router();
roundRoutes.get('/', handleGetRounds);
roundRoutes.post('/', handleCreateRound);

export { roundRoutes };