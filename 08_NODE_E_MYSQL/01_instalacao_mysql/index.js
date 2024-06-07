import express from 'express';
import { engine } from 'express-handlebars';
import mysql from 'mysql';

const port = 3000;

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('home');
});

// Configura a conexão
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql2',
});

//Realiza a conexão
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
