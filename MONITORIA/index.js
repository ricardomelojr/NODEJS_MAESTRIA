import express from 'express';
import SessionFileStore from 'session-file-store';
import { engine } from 'express-handlebars';
import session from 'express-session';
import flash from 'express-flash';
import path from 'path';
import os from 'os';
import conn from './db/conn.js';

/* IMPORT MODELS */
import User from './models/User.js';

/* IMPORT CONTROLLERS */
import AuthController from './controllers/AuthController.js';

/* IMPORT ROUTES */
import authRoutes from './routes/authRoutes.js';

const app = express();
const FileStore = SessionFileStore(session);

// Configuração do motor de visualização
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware para analisar o corpo das requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração da sessão
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: path.join(os.tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false, // Defina como true se estiver usando HTTPS
      maxAge: 3600000, // Duração da sessão em milissegundos
      expires: new Date(Date.now() + 3600000), // Data de expiração do cookie
      httpOnly: true, // O cookie só será acessível pelo protocolo HTTP
    },
  })
);

// Middleware para mensagens flash
app.use(flash());

// Public path
app.use(express.static('public'));

// Middleware para expor a sessão para as views
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

/* ROUTES */
app.use('/', authRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

// Conexão com o banco de dados e inicialização do servidor
const port = 3000;

conn
  //.sync({ force: true })
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Aplicativo escutando na porta ${port}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar com o banco de dados:', err);
  });
