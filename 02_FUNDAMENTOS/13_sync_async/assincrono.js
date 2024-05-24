const fs = require('fs');

console.log('Início');

fs.writeFile('arquivo.txt', 'Oi', function (err) {
  setTimeout(function () {
    console.log('Arquivo criado!');
  }, 5000);
});

console.log('Fim'); //Essa linha não precisa esperar pelo fs.writeFile ser executado totalmente.
