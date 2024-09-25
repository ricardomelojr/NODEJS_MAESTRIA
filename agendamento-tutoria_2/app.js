// Importações Principais
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import Handlebars from 'handlebars';

// Importação das Rotas
import authRoutes from './routes/AuthRoutes.js';
import adminRoutes from './routes/AdminRoutes.js';
import availabilityRoutes from './routes/AvailabilityRoutes.js';
import studentRoutes from './routes/StudentRoutes.js'; // Rotas dos alunos

// Importação da Configuração do Banco de Dados
import sequelize from './config/database.js'; // Importa o Sequelize

// Importação dos Modelos (Certifique-se de que os modelos estão sincronizados)
import './models/User.js';
import './models/Availability.js';
import './models/Tutoring.js';

// Carregar Variáveis de Ambiente
dotenv.config();

// Inicializar o Aplicativo Express
const app = express();

// Resolver __dirname e __filename para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Handlebars
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

// Middlewares Essenciais
app.use(express.urlencoded({ extended: true })); // Para processar formulários
app.use(express.json()); // Para processar JSON
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos (CSS, JS)
app.use(cookieParser(process.env.COOKIE_SECRET || 'secret')); // Para manipular cookies

// Configurar Sessão e Cookies
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret', // Usar a variável de ambiente para o segredo da sessão
    resave: false, // Não salvar a sessão se não houver mudanças
    saveUninitialized: true, // Salva sessões não modificadas
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Cookies seguros apenas em produção
      maxAge: 1000 * 60 * 60 * 2, // Sessão expira em 2 horas
    },
  })
);

// Configurar Flash Messages
app.use(flash());

// Middleware Global para Passar Variáveis às Views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null; // Passa as informações do usuário logado
  next();
});

// Helpers Handlebars Globais
Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

// Helper para verificar se o ID de disponibilidade está na lista de inscrições do aluno
Handlebars.registerHelper('includes', function (array, value) {
  if (!Array.isArray(array)) {
    return false; // Se `array` não for uma lista, retorna `false`
  }
  return array.includes(Number(value)); // Certifique-se de que estamos comparando números
});

Handlebars.registerHelper('formatTime', function (time) {
  if (!time) return ''; // Verifica se o valor existe
  // Criar o objeto Date sem ajustar para UTC
  const [hours, minutes, seconds] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0));

  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Rotas Principais
app.get('/', (req, res) => {
  res.render('home', { title: 'Página Inicial' });
});

// Rotas Específicas
app.use('/admin', adminRoutes); // Rotas para administradores
app.use('/admin/availability', availabilityRoutes); // Rotas para disponibilidade
app.use('/auth', authRoutes); // Rotas de autenticação
app.use('/student', studentRoutes); // Rotas dos alunos

// Sincronizar o Banco de Dados e Iniciar o Servidor
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
