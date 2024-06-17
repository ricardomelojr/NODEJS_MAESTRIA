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
  const { name, occupation, newsletter } = req.body;
  const newsletterValue = newsletter === 'on';

  try {
    await User.create({ name, occupation, newsletter: newsletterValue });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

/* ACESSA A PÁGINA DE CADASTRO DO USUÁRIO */
app.get('/users/create', (req, res) => {
  res.render('adduser');
});

/* EXIBIR USUÁRIO ESPECÍFICO */
app.get('/users/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({ raw: true, where: { id } });

    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }

    res.render('userview', { user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});

/* DELETAR USUÁRIO */
app.post('/users/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await User.destroy({ where: { id } });
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

/* EDITAR USUÁRIO */
app.get('/users/edit/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({
      include: {
        model: Address,
        as: 'Addresses',
      },
      where: { id },
    });

    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }

    res.render('useredit', { user: user.get({ plain: true }) });
  } catch (error) {
    console.error('Error fetching user for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

/* ATUALIZAR USUÁRIO */
app.post('/users/update/:id', async (req, res) => {
  const id = req.params.id;
  const { name, occupation, newsletter } = req.body;
  const newsletterValue = newsletter === 'on';

  try {
    await User.update(
      { name, occupation, newsletter: newsletterValue },
      { where: { id } }
    );
    res.redirect('/');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

/* CADASTRAR ENDEREÇO */
app.post('/address/create', async (req, res) => {
  const { UserId, street, number, city } = req.body;

  try {
    await Address.create({ UserId, street, number, city });
    res.redirect(`/users/edit/${UserId}`);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ raw: true });
    res.render('home', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
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
