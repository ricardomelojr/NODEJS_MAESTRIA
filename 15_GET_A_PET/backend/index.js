// index.js
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Resolver CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Pasta pública para imagens
app.use(express.static('public'));

/* ROTAS IMPORT */
import UserRoutes from './routes/UserRoutes.js';
import PetRoutes from './routes/PetRoutes.js';

/* ROTAS */
app.use('/users', UserRoutes);
app.use('/pets', PetRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
