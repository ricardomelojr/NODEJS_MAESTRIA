'use strict';

import express from 'express';
import { engine } from 'express-handlebars';

const app = express();

const port = 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/dashboard', (req, res, next) => {
  res.render('dashboard');
});

app.get('/', (req, res) => {
  const user = {
    name: 'Ricardo',
    surname: 'Melo',
  };

  const palavra = 'Teste';

  const auth = true;

  res.render('home', { user: user, palavra, auth });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
