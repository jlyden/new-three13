import express, { Express, Router } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { round } from './commons/routes/round';
import { game } from './commons/routes/game';
import { errorHandler } from './commons/middleware/error-handler';

dotenv.config();

const PORT = process.env.PORT || 3000;
const routers = [game, round];
const app = prepareApp(routers);

app.listen(PORT, () => console.log(`running on ${PORT} ⚡`));

/**
 * Set up Express app with all required routes
 */
export function prepareApp(routers: Router[]): Express {
  const app: Express = express();
  app.use(express.json());
  app.use(helmet());

  routers.forEach(router => {
    app.use(router);
  });

  // Must be last
  app.use(errorHandler);

  return app;
}
