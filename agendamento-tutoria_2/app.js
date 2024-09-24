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
import Handlebars from 'handlebars';

// Importação das rotas e dos modelos
import authRoutes from './routes/AuthRoutes.js';
import adminRoutes from './routes/AdminRoutes.js';
import availabilityRoutes from './routes/AvailabilityRoutes.js';
import studentRoutes from './routes/StudentRoutes.js'; // Importar as rotas dos alunos
import sequelize from './config/database.js'; // Importar o Sequelize como exportação padrão
import User from './models/User.js'; // Importar o modelo de User
import Availability from './models/Availability.js';
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
    runtimeOptions: {
      allowProtoPropertiesByDefault: true, // Permite acesso a propriedades herdadas
      allowProtoMethodsByDefault: true, // Permite acesso a métodos herdados
    },
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
    secret: process.env.SESSION_SECRET || 'secret', // Usar variável de ambiente para o segredo da sessão
    resave: false, // Não salvar a sessão novamente se não houver modificações
    saveUninitialized: true, // Salva uma sessão não modificada (útil para mensagens flash)
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Apenas cookies seguros em produção (HTTPS)
      maxAge: 1000 * 60 * 60 * 2, // Sessão expira em 2 horas
    },
  })
);

// Flash messages (Conectar mensagens flash à sessão)
app.use(flash());

// Middleware para adicionar mensagens flash e informações de sessão às views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null; // Se o usuário estiver logado, passa as informações para as views
  next();
});

// Helper para comparar valores no Handlebars
Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

// Helper para formatar hora e minuto (sem os segundos)
Handlebars.registerHelper('formatTime', function (time) {
  if (!time) return ''; // Caso o valor não exista
  const date = new Date(`1970-01-01T${time}Z`);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Rotas principais
app.get('/', (req, res) => {
  res.render('home', { title: 'Página Inicial' });
});

// Rotas específicas (admin e auth)
app.use('/admin', adminRoutes);
app.use('/admin/availability', availabilityRoutes);
app.use('/auth', authRoutes);
app.use('/student', studentRoutes); // Define as rotas dos alunos

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
