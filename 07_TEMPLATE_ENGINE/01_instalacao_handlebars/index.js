'use strict';

import express from 'express';
import { engine } from 'express-handlebars';

const app = express();

const port = 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
//app.set('views', './views');

app.get('/', (req, res) => {
  res.render('home', { layout: false });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
