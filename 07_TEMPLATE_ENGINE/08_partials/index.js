'use strict';

import express from 'express';
import { engine } from 'express-handlebars';

const app = express();

const port = 3000;

// Create `ExpressHandlebars` instance with a default layout.
const hbs = engine({
  // Uses multiple partials dirs, templates in "shared/templates/" are shared
  // with the client-side of the app (see below).
  partialsDir: ['shared/templates/', 'views/partials/'],
});

app.engine('handlebars', hbs); // Correct way to set the engine
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/dashboard', (req, res, next) => {
  const items = ['Item A', 'Item B', 'Item C'];

  res.render('dashboard', { items });
});

app.get('/post', (req, res, next) => {
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

app.get('/blog', (req, res, next) => {
  const posts = [
    {
      title: 'Aprender node.js',
      category: 'Javascript',
      body: 'Este artigo vai te ajudar a aprender Node.js',
      comments: function () {
        return 4;
      },
    },
    {
      title: 'Aprender PHP',
      category: 'PHP',
      body: 'Este artigo vai te ajudar a aprender PHP',
      comments: function () {
        return 4;
      },
    },
    {
      title: 'Aprender Python',
      category: 'Python',
      body: 'Este artigo vai te ajudar a aprender Python',
      comments: function () {
        return 4;
      },
    },
  ];

  res.render('blog', { posts });
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
