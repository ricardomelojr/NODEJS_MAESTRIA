/*  
    Aula 92 - Módulo de rotas
    - Podemos unir várias rodas em um módulo, isso vai deixar nosso código mais organizado;
    - Normalmente criamos uma pasta ou arquivo que contém estas rotas;
    - Que representam uma entidade em comim, como users;
    - Vamos utilizar um novo objeto chamado Router, e colocar as rotas nele;
    - Depois precisamos exportá-lo e importar no arquivo principal; 
    
*/
const express = require('express');
const router = express.Router();
const path = require('path');

const basePath = path.join(__dirname, '../templates');

router.get('/add', (req, res) => {
  res.sendFile(`${basePath}/userform.html`);
});

router.post('/save', (req, res) => {
  console.log(req.body);

  const name = req.body.name;
  const age = req.body.age;

  console.log(`O nome do usuário é ${name} e ele tem ${age} anos`);

  res.sendFile(`${basePath}/userform.html`);
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  // leitura da tabela users, resgar um usuário do banco
  console.log(`Estamos buscando pelo usuário: ${id}`);
  res.sendFile(`${basePath}/users.html`);
});

module.exports = router;
