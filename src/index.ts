import express, { Express } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { rounds } from './commons/routes/round';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(express.json());
app.use(helmet());
app.use(rounds);

app.listen(PORT, () => console.log(`running on ${PORT} ⚡`));
