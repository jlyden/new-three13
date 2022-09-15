import express, { Express } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { round } from './commons/routes/round';
import { game } from './commons/routes/game';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());
app.use(helmet());
app.use(game);
app.use(round);

app.listen(PORT, () => console.log(`running on ${PORT} ⚡`));
