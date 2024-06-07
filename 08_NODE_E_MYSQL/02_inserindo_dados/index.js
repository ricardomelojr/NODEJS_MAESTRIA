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
