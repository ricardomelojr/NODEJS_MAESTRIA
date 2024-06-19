import express from 'express';
import { engine } from 'express-handlebars';
import conn from './db/conn.js';

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

// Inicia o servidor
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;
