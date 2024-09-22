// app.js

// Importações principais
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Importação das rotas e dos modelos
import authRoutes from './routes/AuthRoutes.js';
import sequelize from './config/database.js'; // Importar o Sequelize como exportação padrão

import User from './models/User.js'; // Importar o modelo de User

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o app
const app = express();

// Resolver __dirname e __filename em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do Handlebars
app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares essenciais
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_SECRET || 'secret'));

// Configurar sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.SECURE_COOKIE === 'true' },
  })
);

// Flash messages
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Rotas principais
app.get('/', (req, res) => {
  res.render('home', { title: 'Página Inicial' });
});

// Rotas de autenticação
app.use('/auth', authRoutes);

// Sincronizar com o banco de dados e iniciar o servidor
sequelize
  .sync()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar com o banco de dados:', err);
  });
