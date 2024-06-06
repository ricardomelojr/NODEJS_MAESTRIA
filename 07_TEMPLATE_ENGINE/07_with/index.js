'use strict';

import express from 'express';
import { engine } from 'express-handlebars';

const app = express();

const port = 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/dashboard', (req, res, next) => {
  const items = ['Item A', 'Item B', 'Item C'];

  res.render('dashboard', { items });
});

app.get('/blogpost', (req, res, next) => {
  const post = {
    title: 'Aprender node.js',
    category: 'Javascript',
    body: 'Este artigo vai te ajudar a aprender Node.js',
    comments: function () {
      return 4;
    },
  };
  res.render('blogpost', { post });
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
