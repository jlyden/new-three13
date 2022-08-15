import express from 'express';
import { roundRoutes } from './round.routes';

const apiRoutes = express.Router();
apiRoutes.use('/rounds', roundRoutes);

export { apiRoutes };