import express from 'express';
import { handleCreateRound, handleDeleteRound, handleGetRound, handleUpdateRound } from '../../round/roundController';

const GAME_ID = 'game_id';
const ROUND_NUMBER = 'round_number';

const rounds = express.Router();

//rounds.param(GAME_ID, retrieveGameFromGameId);

rounds.route(`/games/:${GAME_ID}/rounds/:${ROUND_NUMBER}`)
  .get(handleGetRound)
  .post(handleCreateRound)
  .put(handleUpdateRound)
  .delete(handleDeleteRound);

export { rounds };
