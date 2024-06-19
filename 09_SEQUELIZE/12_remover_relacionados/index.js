// Importa o framework Express e módulos necessários
import express from 'express';
import { engine } from 'express-handlebars'; // Engine de templates Handlebars
import conn from './db/conn.js'; // Conexão com o banco de dados
import User from './models/User.js'; // Modelo de Usuário
import Address from './models/Address.js'; // Modelo de Endereço

const port = 3000; // Porta onde o servidor irá rodar

const app = express(); // Cria uma instância do Express

// Middleware para lidar com dados de formulário e JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração do template engine Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars'); // Define o engine de views como Handlebars
app.set('views', './views'); // Define o diretório de views como './views'

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

/*===== ROTAS =====*/

// Rota para acessar a página inicial (lista de usuários)
app.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ raw: true });
    res.render('home', { users }); // Renderiza a página inicial com a lista de usuários
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Rota para acessar a página de cadastro de usuário
app.get('/users/create', (req, res) => {
  res.render('adduser'); // Renderiza o formulário de adicionar usuário
});

// Rota para realizar o cadastro de usuário
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

// Rota para visualizar um usuário específico
app.get('/users/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({ raw: true, where: { id } });

    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }

    res.render('userview', { user }); // Renderiza a view com os dados do usuário
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Rota para editar um usuário
app.get('/users/edit/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({
      include: { model: Address, as: 'Addresses' }, // Inclui os endereços do usuário
      where: { id },
    });

    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }

    res.render('useredit', { user: user.get({ plain: true }) }); // Renderiza a view de edição de usuário
  } catch (error) {
    console.error('Error fetching user for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Rota para atualizar um usuário
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

// Rota para deletar um usuário
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

// Rota para cadastrar um endereço
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

// Rota para deletar um endereço
app.post('/address/delete', async (req, res) => {
  const { UserId, id } = req.body;

  try {
    await Address.destroy({ where: { id } });
    res.redirect(`/users/edit/${UserId}`);
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).send('Internal Server Error');
  }
});

/*===== INICIALIZA O SERVIDOR =====*/

// Sincroniza com o banco de dados e inicia o servidor
conn
  .sync()
  //.sync({ force: true }) // Use force: true para recriar as tabelas (em ambiente de desenvolvimento)
  .then(() => {
    app.listen(port, () => {
      console.log(`App rodando na porta ${port}`);
    });
  })
  .catch(err => console.error('Error syncing database:', err));
