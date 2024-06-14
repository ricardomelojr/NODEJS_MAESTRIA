import express from 'express';
import { engine } from 'express-handlebars';
import conn from './db/conn.js';
import User from './models/User.js';

const port = 3000;

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

/* REALIZA O CADASTRO DO USUÁRIO */
app.post('/users/create', async (req, res) => {
  const name = req.body.name;
  const occupation = req.body.occupation;
  let newsletter = req.body.newsletter;

  newsletter == 'on' ? (newsletter = true) : (newsletter = false);

  console.log(req.body);

  await User.create({ name, occupation, newsletter });

  res.redirect('/');
});

/* ACESSA A PÁGINA DE CADASTRO DO USUÁRIO */
app.get('/users/create', (req, res) => {
  res.render('adduser');
});

/* EXIBIR USUÁRIO ESPECÍFICO */
app.get('/users/:id', async (req, res) => {
  const id = req.params.id;

  const user = await User.findOne({ raw: true, where: { id: id } });

  res.render('userview', { user });
});

app.get('/', async (req, res) => {
  const users = await User.findAll({ raw: true });

  res.render('home', { users });
});

// Configura a conexão
conn
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`App rodando na porta ${port}`);
    });
  })
  .catch(err => console.log(err));
