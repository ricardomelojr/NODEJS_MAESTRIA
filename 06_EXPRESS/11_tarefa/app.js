const express = require('express');
const port = 5000;

const app = express();

app.use(express.static('public'));

const produtosRoutes = require('./routes/produtos');
const usuariosRoutes = require('./routes/usuarios');

app.use(produtosRoutes);
app.use(usuariosRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
