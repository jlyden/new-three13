import express from 'express';
import request from 'supertest';

import { apiRoutes } from '../../src/commons/routes';

const app = express();
app.use(apiRoutes);

describe('round routes', () => {
  describe('GET /round', () => {
    it('returns successfully', async () => {
      const { text } = await request(app).get('/round');
      expect(text).toEqual('<h1>something is working</h1><h2>but this is not a round</h2>');
    });
  });
});