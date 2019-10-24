import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authenticantion from './app/middlewares/ authentication';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authenticantion);
routes.put('/users', authenticantion, UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
