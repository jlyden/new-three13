import express from 'express';
import request from 'supertest';

import { round } from '../../src/commons/routes/round';
import { CardDomain, Suits } from '../../src/card-group/domains/card';
import * as roundService from '../../src/round/round-service';
import { CreateRoundReturnDomain } from '../../src/round/domains/create-round-return';
import { errorHandler } from '../../src/commons/middleware/error-handler';

const testApp = express();
testApp.use(express.json());
testApp.use(round);
testApp.use(errorHandler);

describe('round', () => {
  const testGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';
  const roundNumber = 4;
  const commonRoundRoute = `/game/${testGameId}/round/${roundNumber}`;
  const threeOfHearts: CardDomain = { value: 3, suit: Suits.Heart }
  const defaultPutDiscardBody = { "card": "H2" }
  const testUser = 'alice';

  describe('GET single', () => {
    // TODO: update
    it('returns successfully', async () => {
      expect(true).toBe(true);
    });

    it('returns 404 on cache miss', async () => {
      const missingGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';
      const expectedReturn = `{"error":"Cache empty for key: ${missingGameId}/${roundNumber}"}`
      const { text } = await request(testApp).get(commonRoundRoute);
      expect(text).toEqual(expectedReturn);
    });
  });

  describe('POST', () => {
    it('returns successfully', async () => {
      const createRoundReturn: CreateRoundReturnDomain = {
        visibleCard: threeOfHearts,
        nextPlayer: testUser,
      }
      // TODO: remove
      jest.spyOn(roundService, 'createRound').mockReturnValue(createRoundReturn);
      const { text } = await request(testApp).post(commonRoundRoute);
      expect(text).toEqual(`POST /round | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"} | Return: ${JSON.stringify(createRoundReturn)}`);
    });
  });

  describe('PUT draw', () => {
    it('returns successfully', async () => {
      const { text } = await request(testApp).put(`${commonRoundRoute}/draw`);
      expect(text).toEqual(`PUT /round/draw | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"}`);
    });
  });

  describe('PUT discard', () => {
    it('returns successfully', async () => {
      const { text } = await request(testApp).put(`${commonRoundRoute}/discard`).send(defaultPutDiscardBody);
      expect(text).toEqual(`PUT /round/discard | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"} && {"card":"H2"}`);
    });
  });

  describe('DELETE', () => {
    it('returns successfully', async () => {
      const { text } = await request(testApp).delete(commonRoundRoute);
      expect(text).toEqual(`DELETE /round | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"}`);
    });
  });
});
