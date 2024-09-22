import express from 'express';
import AdminController from '../controllers/adminController.js';
import {
  ensureAuthenticated,
  ensureAdmin,
} from '../middlewares/authMiddleware.js'; // Middleware para garantir autenticação e que o usuário seja administrador

const router = express.Router();

// Rota do dashboard do administrador
router.get(
  '/dashboard',
  ensureAuthenticated,
  ensureAdmin,
  AdminController.dashboard
);

// Listar todos os usuários (somente para administradores)
router.get(
  '/usuarios',
  ensureAuthenticated,
  ensureAdmin,
  AdminController.listarUsuarios
);

// Alterar a role de um usuário (somente para administradores)
router.post(
  '/usuarios/:id/alterar-role',
  ensureAuthenticated, // Garante que o usuário esteja logado
  ensureAdmin, // Garante que o usuário seja administrador
  AdminController.alterarRole
);

// Rota para exibir a página de edição de um usuário
router.get(
  '/usuarios/:id/editar',
  ensureAuthenticated,
  ensureAdmin,
  AdminController.editarUsuario
);

// Rota para atualizar as informações de um usuário
router.post(
  '/usuarios/:id/editar',
  ensureAuthenticated,
  ensureAdmin,
  AdminController.atualizarUsuario
);

// Rota para excluir um usuário
router.post(
  '/usuarios/:id/excluir',
  ensureAuthenticated,
  ensureAdmin,
  AdminController.excluirUsuario
);

export default router;
