import express from 'express';
import { engine } from 'express-handlebars';
import conn from './db/conn.js';

/* -- MODELS -- */
import Task from './models/Task.js';

const app = express();

// Configuração do Handlebars como motor de visualização
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware para parsing do corpo das requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.render('home');
});

const port = 3000;

conn
  .sync()
  .then(app.listen(port))
  .catch(err => console.log(err));
// Inicia o servidor

export default app;
