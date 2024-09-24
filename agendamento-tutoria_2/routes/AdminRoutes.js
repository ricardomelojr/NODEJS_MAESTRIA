import express from 'express';
import AdminController from '../controllers/AdminController.js';
import AvailabilityController from '../controllers/AvailabilityController.js'; // Importar o controlador de Availability
import { isAdmin, ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Middleware que protege todas as rotas para administradores
router.use(ensureAuthenticated); // Verifica se o usuário está logado
router.use(isAdmin); // Verifica se o usuário é administrador

// Rotas protegidas para administradores
router.get('/dashboard', AdminController.dashboard);
router.get('/users', AdminController.listUsers); // Rota para listar usuários
router.get('/tutors', AdminController.listTutors); // Rota para listar tutores
router.post('/users/role/:idUser', AdminController.updateUserRole);

// Rotas relacionadas à monitoria (Tutoring)
router.get('/createTutoring', AdminController.createTutoring); // Rota para renderizar a página de criação de monitoria
router.post('/availability/create', AvailabilityController.createTutoring); // Rota para criar uma nova monitoria
router.get('/availability/search', AvailabilityController.searchMonitors); // Rota para buscar monitores

export default router;
