import { Router } from 'express';

import UserController from './app/controllers/UserController';
import multer from 'multer';
import multerConfig from './config/multer';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import CollaboratorController from './app/controllers/CollaboratorController';
import AppointmentController from './app/controllers/AppointmentController';
import authMiddleware from './app/middlewares/auth';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationsController from './app/controllers/NotificationsController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Rotas autenticadas
routes.use(authMiddleware);
routes.put('/users', UserController.update);
routes.delete('/users', UserController.delete);

// Rota de agendamento
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

// Agenda dos colaboradores
routes.get('/schedule', ScheduleController.index);

// Lista de colaboradores
routes.get('/collaborator', CollaboratorController.index);

// Listagem de notificações
routes.get('/notifications', NotificationsController.index);

// Ler notificação
routes.put('/notifications/:id', NotificationsController.update);

// Uploads de arquivos
routes.post('/files', upload.single('file'), FileController.store);

export default routes;