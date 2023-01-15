import express, { Express } from 'express';
import request from 'supertest';
import { randomUUID } from 'crypto';

import { game } from '../../src/commons/routes/game';
import { createGame, GAME_STARTING_ROUND_NUMBER } from '../../src/game/game-service';
import { missingGameId, threePlayerList } from '../helper/test-data';
import { HttpCode } from '../../src/commons/errors/api-error';
import { flushCache } from '../../src/commons/utils/cache';
import { errorHandler } from '../../src/commons/middleware/error-handler';

const savedGameId = 'a09e9020-f480-439f-857b-04e6a8426daf';

const testApp: Express = express();
testApp.use(express.json());
testApp.use(game);
testApp.use(errorHandler);

describe('game', () => {
  describe('GET single', () => {
    beforeEach(() => {
      createGame(threePlayerList, savedGameId);
    });
  
    afterAll(() => {
      flushCache();
    });
  
    it('returns successfully when game is found', async () => {
      const expectedReturn = { id: savedGameId, playerList: threePlayerList, roundNumber: GAME_STARTING_ROUND_NUMBER }
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
      const createGameParams = { playerList: threePlayerList, gameId: randomGameId }
      const { body, status } = await request(testApp).post('/game').send(createGameParams);
      expect(status).toEqual(HttpCode.CREATED);
      expect(body).toBe(randomGameId);
    });

    it('returns successfully without gameId passed', async () => {
      const createGameParams = { playerList: threePlayerList }
      const { body, status } = await request(testApp).post('/game').send(createGameParams);
      expect(status).toEqual(HttpCode.CREATED);
      expect(typeof body).toBe('string');
    });
  });

  describe('DELETE', () => {
    beforeEach(() => {
      createGame(threePlayerList, savedGameId);
    });
  
    afterAll(() => {
      flushCache();
    });
  
    it('returns successfully when game is found and deleted', async () => {
      const expectedReturn = { 'message': `Game deleted: ${savedGameId}` };
      const { body, status } = await request(testApp).delete(`/game/${savedGameId}`);
      expect(status).toEqual(HttpCode.OK);
      expect(body).toEqual(expectedReturn);
    });
  });
});
