import express from 'express';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';
import { fileURLToPath } from 'url';

// Importação do Sequelize e da conexão com o banco de dados
import { sequelize } from './config/database.js'; // Importa a configuração do banco de dados
import User from './models/User.js'; // Importa o model de usuário para sincronização

// Importando rotas
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import alunoRoutes from './routes/alunoRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';

// Inicializando o app
const app = express();

// Configurações de caminho para usar ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurando Handlebars como template engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Configurando as sessões para durar 30 minutos
app.use(
  session({
    secret: 'segredo_super_secreto', // Utilize um segredo mais forte em produção
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Mude para `true` em produção com HTTPS
      maxAge: 30 * 60 * 1000, // 30 minutos em milissegundos (30 * 60 * 1000 = 1.800.000 ms)
    },
  })
);

// Flash messages
app.use(flash());

// Middleware global para disponibilizar as mensagens de flash para todas as views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/admin', adminRoutes);
app.use('/aluno', alunoRoutes);
app.use('/tutor', tutorRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/availability', availabilityRoutes);
app.use('/', authRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

// Sincronizar o banco de dados com os models
sequelize
  .sync({ force: false }) // Sincroniza os models sem apagar as tabelas existentes
  .then(() => {
    console.log('Banco de dados sincronizado com sucesso');
  })
  .catch(error => {
    console.error('Erro ao sincronizar o banco de dados:', error);
  });

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
