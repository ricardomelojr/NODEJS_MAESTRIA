/* O que é o Express?
    - Um framework para Node.js muito utilizado;
    - Serve para ciarmos aplicações web;
    - Nele podemos criar rotas, renderizar HTML, conectar a um banco de dados;
    - O Express torna a criação de apps muito mais simplificada, do que com os Core Modules;
*/
const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('<h1>Hello World</>');
});

app.listen(3000);
