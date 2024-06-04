/*
Aula 92 - Enviando dados por POST

  - Para enviar os dados vamos precisar criar um form e mandar os dados via POST par aalguma URL.
  - No Express precisamos colocar alguns middlewares como express.json para ler os dados do body;
  - E também uma rota que vai receber estes dados, utilizando o método post do Express;
 */

'use strict';

const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

const users = require('./users'); //importando router

// ler o body
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

const basePath = path.join(__dirname, 'templates');

app.use('/users', users);

app.get('/', (req, res) => {
  res.sendFile(`${basePath}/index.html`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
