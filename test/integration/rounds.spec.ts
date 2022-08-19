import express from 'express';
import request from 'supertest';

import { rounds } from '../../src/commons/routes/rounds';

const app = express();
app.use(express.json());
app.use(rounds);

describe('rounds', () => {
  const testGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';
  const roundNumber = 4;
  const commonRoundRoute = `/games/${testGameId}/rounds/${roundNumber}`;
  const defaultPostBody = { "player_count": 3 }
  const defaultPutDiscardBody = { "card": "H2" }

  describe('GET single', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).get(commonRoundRoute);
      expect(text).toEqual(`GET /rounds | Params: {"game_id":"${testGameId}","round_number":"${roundNumber}"}`);
    });
  });

  describe('POST', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).post(commonRoundRoute).send(defaultPostBody);
      expect(text).toEqual(`POST /rounds | Params: {"game_id":"${testGameId}","round_number":"${roundNumber}"} && {"player_count":3}`);
    });
  });

  describe('PUT draw', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).put(`${commonRoundRoute}/draw`);
      expect(text).toEqual(`PUT /rounds/draw | Params: {"game_id":"${testGameId}","round_number":"${roundNumber}"}`);
    });
  });

  describe('PUT discard', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).put(`${commonRoundRoute}/discard`).send(defaultPutDiscardBody);
      expect(text).toEqual(`PUT /rounds/discard | Params: {"game_id":"${testGameId}","round_number":"${roundNumber}"} && {"card":"H2"}`);
    });
  });

  describe('DELETE', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).delete(commonRoundRoute);
      expect(text).toEqual(`DELETE /rounds | Params: {"game_id":"${testGameId}","round_number":"${roundNumber}"}`);
    });
  });
});
