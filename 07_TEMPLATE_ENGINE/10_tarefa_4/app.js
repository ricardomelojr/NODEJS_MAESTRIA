import express from 'express';
import { engine } from 'express-handlebars';
import routes from './routes/index.js';

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));
app.use('/', routes);

app.listen(3000, () => {
  console.log('App rodando!');
});
