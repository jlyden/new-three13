import express from 'express';
import request from 'supertest';

import { rounds } from '../../src/commons/routes/rounds';
import * as roundService from '../../src/round/roundService';

const app = express();
app.use(express.json());
app.use(rounds);

describe('rounds', () => {
  const testGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';
  const roundNumber = 4;
  const commonRoundRoute = `/games/${testGameId}/rounds/${roundNumber}`;
  const defaultPutDiscardBody = { "card": "H2" }

  describe('GET single', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).get(commonRoundRoute);
      expect(text).toEqual(`GET /rounds | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"}`);
    });
  });

  describe('POST', () => {
    it('returns successfully', async () => {
      jest.spyOn(roundService, 'createRound').mockReturnValue('H2');
      const { text } = await request(app).post(commonRoundRoute);
      expect(text).toEqual(`POST /rounds | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"} | Return: H2`);
    });
  });

  describe('PUT draw', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).put(`${commonRoundRoute}/draw`);
      expect(text).toEqual(`PUT /rounds/draw | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"}`);
    });
  });

  describe('PUT discard', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).put(`${commonRoundRoute}/discard`).send(defaultPutDiscardBody);
      expect(text).toEqual(`PUT /rounds/discard | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"} && {"card":"H2"}`);
    });
  });

  describe('DELETE', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).delete(commonRoundRoute);
      expect(text).toEqual(`DELETE /rounds | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"}`);
    });
  });
});
