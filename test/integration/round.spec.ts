import express from 'express';
import request from 'supertest';

import { round } from '../../src/commons/routes/round';
import { errorHandler } from '../../src/commons/middleware/error-handler';
import { playerList } from '../common/test-data';
import { GAME_STARTING_ROUND_NUMBER } from '../../src/game/game-service';
import { Suits } from "../../src/card-group/domains/card";
import { game } from '../../src/commons/routes/game';

const savedGameId = '79057bd6-5502-488d-b9ba-ca0f51945a9a';

const testApp = express();
testApp.use(express.json());
testApp.use(game);
testApp.use(round);
testApp.use(errorHandler);

describe('round', () => {
  const testGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';
  const roundNumber = 4;
  const commonRoundRoute = `/game/${testGameId}/round/${roundNumber}`;
  const defaultPutDiscardBody = { "card": "H2" }

  beforeAll(async () => {
    // Create Game and Round for GET, PUT
    const createGameParams = { playerList, gameId: savedGameId }
    const gameResult = await request(testApp).post('/game').send(createGameParams);
    expect(gameResult.body).toBe(savedGameId);
    const roundResult = await request(testApp).post(`/game/${savedGameId}/round/${GAME_STARTING_ROUND_NUMBER}`);
    expect(roundResult.body).toBeDefined();
  });

  describe('GET single', () => {
    it('returns successfully when round is found', async () => {
      const { body } = await request(testApp).get(`/game/${savedGameId}/round/${GAME_STARTING_ROUND_NUMBER}`);
      expect(body).not.toBeUndefined();
      expect(body.id).toBe(`${savedGameId}/${GAME_STARTING_ROUND_NUMBER}`);
      expect(body.deck).toBeDefined();
      expect(Array.isArray(body.deck)).toBeTruthy();
      expect(body.hands).toBeDefined();
      expect(typeof body.hands).toBe('object');
      expect(body.visibleCard.suit).toBeDefined();
      expect(body.visibleCard.value).toBeDefined();
      expect(Object.keys(Suits)).toContain(body.visibleCard.suit);
      expect(typeof body.visibleCard.value).toBe('number');
      expect(body.nextPlayer).toBeDefined();
      expect(body.nextPlayer).toBe(playerList[0]);
    });

    it('returns 404 on cache miss', async () => {
      const missingGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';
      const expectedReturn = { error: `Cache empty for key: ${missingGameId}/${roundNumber}` }
      const { body } = await request(testApp).get(`/game/${missingGameId}/round/${roundNumber}`);
      expect(body).toEqual(expectedReturn);
    });
  });

  describe('POST', () => {
    it('returns successfully', async () => {
      const { body } = await request(testApp).post(`/game/${savedGameId}/round/4`);
      expect(body).not.toBeUndefined();
      expect(body.visibleCard).toBeDefined();
      expect(body.visibleCard.suit).toBeDefined();
      expect(Object.keys(Suits)).toContain(body.visibleCard.suit);
      expect(body.visibleCard.value).toBeDefined();
      expect(typeof body.visibleCard.value).toBe('number');
      expect(body.nextPlayer).toBe(playerList[1]);
    });

    it('fails when trying to create a Round for a Game that is not found', () => {
      // TODO
      expect(true).toBe(true);
    });
  });

  describe('PUT draw', () => {
    it('returns successfully', async () => {
      const { text } = await request(testApp).put(`${commonRoundRoute}/draw`);
      expect(text).toBe(`PUT /round/draw | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"}`);
    });
  });

  describe('PUT discard', () => {
    it('returns successfully', async () => {
      const { text } = await request(testApp).put(`${commonRoundRoute}/discard`).send(defaultPutDiscardBody);
      expect(text).toBe(`PUT /round/discard | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"} && {"card":"H2"}`);
    });
  });

  describe('DELETE', () => {
    it('returns successfully', async () => {
      const { text } = await request(testApp).delete(commonRoundRoute);
      expect(text).toBe(`DELETE /round | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"}`);
    });
  });
});
