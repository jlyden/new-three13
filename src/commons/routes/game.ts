import express from 'express';
import { handleCreateGame } from '../../game/game-controller';

//const GAME_ROUTE = `/game/:gameId`;

const game = express.Router();

//game.use(GAME_ROUTE, validateGameRouteSchema);

//game.get(GAME_ROUTE, handleGetGame);

game.post('/game', handleCreateGame);

//game.delete(GAME_ROUTE, handleDeleteGame);

export { game };