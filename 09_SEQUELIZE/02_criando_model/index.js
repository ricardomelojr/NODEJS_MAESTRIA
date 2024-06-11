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

app.get('/', (req, res) => {
  res.render('home');
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
