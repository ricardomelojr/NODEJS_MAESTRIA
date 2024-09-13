import express from 'express';
const router = express.Router();

// Definir as rotas do administrador
router.get('/dashboard', (req, res) => {
  res.send('Dashboard do Administrador');
});

// Exportar as rotas
export default router;
