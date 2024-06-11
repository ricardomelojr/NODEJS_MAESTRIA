import express from 'express';
import { engine } from 'express-handlebars';
import mysql from 'mysql';

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

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/books/insertbook', (req, res, next) => {
  const title = req.body.title;
  const pageqty = parseInt(req.body.pageqty);

  console.log('Title:', title);
  console.log('Page Quantity:', pageqty);

  if (isNaN(pageqty)) {
    console.error('Invalid page quantity:', pageqty);
    return res.status(400).send('Invalid page quantity');
  }

  const sql = 'INSERT INTO books (title, pageqty) VALUES (?, ?)';

  connection.query(sql, [title, pageqty], function (err) {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error inserting data');
    }

    res.redirect('/');
  });
});

app.get('/books', (req, res, next) => {
  const sql = 'SELECT * FROM books';
  connection.query(sql, (err, data) => {
    if (err) {
      console.error('Erro ao resgatar informações:', err);
      return res.status(500).send('Error get data');
    }

    const books = data;
    console.log(books);
    res.render('books', { books });
  });
});

app.get('/books/:id', (req, res, next) => {
  const id = req.params.id;

  const sql = 'SELECT * FROM books WHERE id = ?';
  connection.query(sql, [id], (err, data) => {
    if (err) {
      console.error('Erro ao resgatar informações:', err);
      return res.status(500).send('Erro ao obter dados do banco de dados');
    }

    if (data.length === 0) {
      return res.status(404).send('Livro não encontrado');
    }

    const book = data[0];
    console.log(book);
    res.render('book', { book });
  });
});

app.get('/books/edit/:id', (req, res, next) => {
  const id = req.params.id;

  const sql = 'SELECT * FROM books WHERE id = ?';

  connection.query(sql, [id], (err, data) => {
    if (err) {
      console.error('Erro ao resgatar informações:', err);
      return res.status(500).send('Erro ao obter dados do banco de dados');
    }

    if (data.length === 0) {
      return res.status(404).send('Livro não encontrado');
    }

    const book = data[0];
    res.render('editbook', { book });
  });
});

/* ##### ATUALIZAÇÃO DE DADOS #####*/
app.post('/books/updatebook', (req, res, next) => {
  const title = req.body.title;
  const pageqty = parseInt(req.body.pageqty);
  const id = req.body.id; // Obtendo o ID do corpo da requisição

  const sql = 'UPDATE books SET title = ?, pageqty = ? WHERE id = ?';

  connection.query(sql, [title, pageqty, id], (err, result) => {
    if (err) {
      console.error('Erro ao editar informações:', err);
      return res.status(500).send('Erro ao editar dados do banco de dados');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Livro não encontrado');
    }

    res.redirect(`/books/${id}`); // Redireciona para a página de detalhes do livro atualizado
  });
});

app.post('/books/remove/:id', (req, res, next) => {
  const id = req.params.id; // Corrigido para pegar o ID da URL

  const sql = 'DELETE FROM books WHERE id = ?';

  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir informações:', err);
      return res.status(500).send('Erro ao excluir dados do banco de dados');
    }

    //res.status(200).send('Dados excluídos com sucesso'); // Envia uma resposta de sucesso
    res.redirect('/books');
  });
});

// Configura a conexão
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql2',
});

// Realiza a conexão
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);

  app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
  });
});
