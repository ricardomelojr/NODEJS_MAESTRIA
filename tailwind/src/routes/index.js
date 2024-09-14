import express from 'express';
const router = express.Router();

// Página inicial (rota "/")
router.get('/', (req, res) => {
  res.render('dashboard', { title: 'Página Inicial' }); // Exibindo o dashboard como página inicial
});

// Outras rotas
router.get('/dashboard', (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

router.get('/monitores', (req, res) => {
  res.render('monitores', { title: 'Monitores' });
});

router.get('/agendamentos', (req, res) => {
  res.render('agendamentos', { title: 'Agendamentos' });
});

router.get('/configuracoes', (req, res) => {
  res.render('configuracoes', { title: 'Configurações' });
});

export default router;
