import express from 'express';
import request from 'supertest';
import { randomUUID } from 'crypto';

import { errorHandler } from '../../src/commons/middleware/error-handler';
import { game } from '../../src/commons/routes/game';
import { GAME_STARTING_ROUND_NUMBER } from '../../src/game/game-service';
import { missingGameId, playerList } from '../helper/test-data';
import { HttpCode } from '../../src/commons/errors/api-error';

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
      const { body, status } = await request(testApp).get(`/game/${savedGameId}`);
      expect(status).toEqual(HttpCode.OK);
      expect(body).toEqual(expectedReturn);
    });

    it('returns 404 when game is not found', async () => {
      const expectedReturn = { error: `Cache empty for key: ${missingGameId}` }
      const { body, status } = await request(testApp).get(`/game/${missingGameId}`);
      expect(status).toEqual(HttpCode.NOT_FOUND);
      expect(body).toEqual(expectedReturn);
    });
  });

  describe('POST', () => {
    it('returns successfully with gameId passed', async () => {
      const randomGameId = randomUUID();
      const createGameParams = { playerList, gameId: randomGameId }
      const { body, status } = await request(testApp).post('/game').send(createGameParams);
      expect(status).toEqual(HttpCode.OK);
      expect(body).toBe(randomGameId);
    });

    it('returns successfully without gameId passed', async () => {
      const createGameParams = { playerList }
      const { body, status } = await request(testApp).post('/game').send(createGameParams);
      expect(status).toEqual(HttpCode.OK);
      expect(typeof body).toBe('string');
    });
  });
});