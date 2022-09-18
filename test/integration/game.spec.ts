import express from 'express';
import request from 'supertest';

import { errorHandler } from '../../src/commons/middleware/error-handler';
import { game } from '../../src/commons/routes/game';
import { GAME_STARTING_ROUND_NUMBER } from '../../src/game/game-service';
import { playerList } from '../common/test-data';

const savedGameId = 'a09e9020-f480-439f-857b-04e6a8426daf';

const testApp = express();
testApp.use(express.json());
testApp.use(game);
testApp.use(errorHandler);

describe('game', () => {
  beforeAll(async () => {
    // Create Game to GET
    const createGameParams = { playerList, gameId: savedGameId }
    await request(testApp).post('/game').send(createGameParams);
  });

  describe('GET single', () => {
    it('returns successfully when game is found', async () => {
      const expectedReturn = { id: savedGameId, playerList, roundNumber: GAME_STARTING_ROUND_NUMBER }
      const { body } = await request(testApp).get(`/game/${savedGameId}`);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 404 when game is not found', async () => {
      const missingGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';
      const expectedReturn = { error: `Cache empty for key: ${missingGameId}` }
      const { body } = await request(testApp).get(`/game/${missingGameId}`);
      expect(body).toEqual(expectedReturn);
    });
  });

  describe('POST', () => {
    it('returns successfully with gameId passed', async () => {
      const legitGameId = '124c13f0-b30d-4fc3-880a-a72beb490e54';
      const createGameParams = { playerList, gameId: legitGameId }
      const { body } = await request(testApp).post('/game').send(createGameParams);
      expect(body).toBe(legitGameId);
    });

    it('returns successfully without gameId passed', async () => {
      const createGameParams = { playerList }
      const { body } = await request(testApp).post('/game').send(createGameParams);
      expect(typeof body).toBe('string');
    });
  });
});