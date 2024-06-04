/* O que é o Express?
    - Um framework para Node.js muito utilizado;
    - Serve para ciarmos aplicações web;
    - Nele podemos criar rotas, renderizar HTML, conectar a um banco de dados;
    - O Express torna a criação de apps muito mais simplificada, do que com os Core Modules;
*/
'use strict';

const express = require('express');
const app = express();
const port = 3000;

/* 
  req - é algo que veio do usuário quando ele acessou
  res - é a resposta que enviamos ao usuário
 */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
