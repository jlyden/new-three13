import express from 'express';
import request from 'supertest';

import { round } from '../../src/commons/routes/round';
import { CardDomain, Suits } from '../../src/card-group/domains/card';
import * as roundService from '../../src/round/round-service';
import { CreateRoundReturnDomain } from '../../src/round/domains/create-round-return';

const app = express();
app.use(express.json());
app.use(round);

describe('round', () => {
  const testGameId = '82a4af67-cbff-41a2-976f-792b22a5ba55';
  const roundNumber = 4;
  const commonRoundRoute = `/game/${testGameId}/round/${roundNumber}`;
  const threeOfHearts: CardDomain = { value: 3, suit: Suits.Heart }
  const defaultPutDiscardBody = { "card": "H2" }
  const testUser = 'alice';

  // TODO: FIXME
  xdescribe('GET single', () => {
    // TODO: update
    it('returns successfully', async () => {
      const { text } = await request(app).get(commonRoundRoute);
      expect(text).toEqual(`GET /round | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"} | Return: undefined`);
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
      const { text } = await request(app).post(commonRoundRoute);
      expect(text).toEqual(`POST /round | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"} | Return: ${JSON.stringify(createRoundReturn)}`);
    });
  });

  describe('PUT draw', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).put(`${commonRoundRoute}/draw`);
      expect(text).toEqual(`PUT /round/draw | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"}`);
    });
  });

  describe('PUT discard', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).put(`${commonRoundRoute}/discard`).send(defaultPutDiscardBody);
      expect(text).toEqual(`PUT /round/discard | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"} && {"card":"H2"}`);
    });
  });

  describe('DELETE', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).delete(commonRoundRoute);
      expect(text).toEqual(`DELETE /round | Params: {"gameId":"${testGameId}","roundNumber":"${roundNumber}"}`);
    });
  });
});
