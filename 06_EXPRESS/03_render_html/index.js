/*
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
