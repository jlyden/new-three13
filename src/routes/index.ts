import express from 'express';
import { roundRoutes } from './round.routes';

const apiRoutes = express.Router();
apiRoutes.use('/round', roundRoutes);

export { apiRoutes };