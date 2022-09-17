import express from 'express';
import request from 'supertest';
import { errorHandler } from '../../src/commons/middleware/error-handler';
import { game } from '../../src/commons/routes/game';

const testApp = express();
testApp.use(express.json());
testApp.use(game);
testApp.use(errorHandler);

describe('game', () => {
  describe('GET single', () => {
    it('returns 404 on cache miss', async () => {
      const missingGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';
      const expectedReturn = `{"error":"Cache empty for key: ${missingGameId}"}`
      const { text } = await request(testApp).get(`/game/${missingGameId}`);
      expect(text).toEqual(expectedReturn);
    });
  });
});