import express from 'express';
import request from 'supertest';

import { apiRoutes } from '../../src/commons/routes';

const app = express();
app.use(apiRoutes);

describe('round routes', () => {
  describe('GET /rounds', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).get(`/rounds`);
      expect(text).toEqual('GET /rounds | Params: N/A');
    });
  });
});