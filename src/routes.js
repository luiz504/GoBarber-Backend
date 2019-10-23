import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authenticantion from './app/middlewares/ authentication';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authenticantion);
routes.put('/users', authenticantion, UserController.update);

export default routes;
