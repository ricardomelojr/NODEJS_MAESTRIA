import express from 'express';
import { engine } from 'express-handlebars';
import conn from './db/conn.js';
import User from './models/User.js';
import Address from './models/Address.js';

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

/* DELETAR USUÁRIO */
app.post('/users/delete/:id', async (req, res, next) => {
  const id = req.params.id;

  await User.destroy({
    where: {
      id: id,
    },
  });

  res.redirect('/');
});

/* EDITAR USUÁRIO */

app.get('/users/edit/:id', async (req, res) => {
  const id = req.params.id;

  const user = await User.findOne({ raw: true, where: { id: id } });
  const address = await Address.findOne({ raw: true, where: { UserId: id } });

  res.render('useredit', { user, address });
});

/* ATUALIZAR USUÁRIO */
app.post('/users/update/:id', async (req, res) => {
  const id = req.params.id;
  const { name, occupation, newsletter } = req.body;

  // Convertendo o valor do checkbox para booleano
  const newsletterValue = newsletter === 'on';

  try {
    await User.update(
      {
        name: name,
        occupation: occupation,
        newsletter: newsletterValue,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.redirect('/');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

/* CADASTRAR ENDEREÇO */
app.post('/address/create', async (req, res, next) => {
  const UserId = req.body.UserId;
  const street = req.body.street;
  const number = req.body.number;
  const city = req.body.city;

  console.log(UserId, street);
  await Address.create({
    UserId: UserId,
    street: street,
    number: number,
    city: city,
  });

  res.redirect(`/users/edit/${UserId}`);
});

app.get('/', async (req, res) => {
  const users = await User.findAll({ raw: true });

  res.render('home', { users });
});

// Configura a conexão
conn
  .sync()
  //.sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`App rodando na porta ${port}`);
    });
  })
  .catch(err => console.log(err));
