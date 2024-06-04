/*
  Aula 90 - O que é Middleware?
  - Middlewares são códigos que podem ser executados no meio/entre(middle) de alguma ação e outra;
  - Por exemplo: verificar se o usuário está logado, podemos ter um para esta verificação;
  - O método que nos dá acesso a utilizar middlewares é o use no Express;
 */

'use strict';

const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

/* path.join - une o caminho absoluto ao 'templates', fomando um caminho mais ou menos assim:

C:\Users\Ricardo Melo\Documents\NODEJS_MAESTRIA\06_EXPRESS\03_render_html\templates

*/
const basePath = path.join(__dirname, 'templates');

const checkAuth = function (req, res, next) {
  req.authStatus = true;

  if (req.authStatus) {
    console.log('Está logado, pode continuar');
    next();
  } else {
    console.log('Não está logado, faça o login para continuar');
    next();
  }
};

app.use(checkAuth);
/* 
  req - é algo que veio do usuário quando ele acessou
  res - é a resposta que enviamos ao usuário
 */
app.get('/', (req, res) => {
  res.sendFile(`${basePath}/index.html`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
