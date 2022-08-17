import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';

import { rounds } from '../../src/commons/routes/rounds';

const app = express();
app.use(bodyParser.json());
app.use(rounds);

describe('rounds', () => {
  const gameId = 'abcd1234';
  const roundNumber = '4';
  const commonRoundRoute = `/games/${gameId}/rounds/${roundNumber}`;
  const defaultPostBody = { "player_count": 3 }
  const defaultPutBody = { "player": "zyx987", "action": "draw" }

  describe('GET single', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).get(commonRoundRoute);
      expect(text).toEqual(`GET /rounds | Params: {"game_id":"${gameId}","round_number":"${roundNumber}"}`);
    });
  });

  describe('POST', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).post(commonRoundRoute).send(defaultPostBody);
      expect(text).toEqual(`POST /rounds | Params: {"game_id":"${gameId}","round_number":"${roundNumber}"} && {"player_count":3}`);
    });
  });

  describe('PUT', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).put(commonRoundRoute).send(defaultPutBody);
      expect(text).toEqual(`PUT /rounds | Params: {"game_id":"${gameId}","round_number":"${roundNumber}"} && {"player":"zyx987","action":"draw"}`);
    });
  });

  describe('DELETE', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).delete(commonRoundRoute);
      expect(text).toEqual(`DELETE /rounds | Params: {"game_id":"${gameId}","round_number":"${roundNumber}"}`);
    });
  });
});
