import express from 'express';
import { handleCreateGame, handleDeleteGame, handleGetGame } from '../../game/game-controller';

const game = express.Router();

game.get('/game/:gameId', handleGetGame);
game.post('/game', handleCreateGame);
game.delete('/game/:gameId', handleDeleteGame);

export { game };
