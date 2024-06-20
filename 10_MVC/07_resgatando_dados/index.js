import express from 'express';
import { engine } from 'express-handlebars';
import conn from './db/conn.js';

/* -- MODELS -- */
import Task from './models/Task.js';

/* -- ROUTES -- */
import taskRoutes from './routes/tasksRoutes.js';

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

// Rotas de tarefas
app.use('/tasks', taskRoutes);

// Porta do servidor
const port = 3000;

// Função para iniciar o servidor
const startServer = async () => {
  try {
    await conn.sync();
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
};

// Inicia o servidor
startServer();

export default app;
