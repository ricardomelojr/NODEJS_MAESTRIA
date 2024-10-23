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
import studentRoutes from './routes/StudentRoutes.js';
import tutorRoutes from './routes/TutorRoutes.js';

// Importação da Configuração do Banco de Dados
import sequelize from './config/database.js';

// Importação dos Modelos
import './models/User.js';
import './models/Availability.js';
import './models/Tutoring.js';
import './models/Attendance.js';

dotenv.config();

const app = express();
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
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_SECRET || 'secret'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 2, // 2 horas
    },
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

Handlebars.registerHelper('eq', (a, b) => a === b);

Handlebars.registerHelper('includes', (array, value) => {
  return Array.isArray(array) && array.includes(Number(value));
});

Handlebars.registerHelper('formatTime', (time) => {
  if (!time) return '';
  const [hours, minutes, seconds] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0));
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Rotas
app.get('/', (req, res) => res.render('home', { title: 'Página Inicial' }));
app.use('/admin', adminRoutes);
app.use('/admin/availability', availabilityRoutes);
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/tutor', tutorRoutes);

// Sincronizar o banco e iniciar o servidor
sequelize
  .sync()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error('Erro ao sincronizar com o banco de dados:', err));
