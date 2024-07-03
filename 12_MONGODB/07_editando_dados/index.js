import express from 'express';
import { engine } from 'express-handlebars';
import conn from './db/conn.js';

import productsRoutes from './routes/productsRoutes.js';

const app = express();
const port = 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// read body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.use('/products', productsRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
