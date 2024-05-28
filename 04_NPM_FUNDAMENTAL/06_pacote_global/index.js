/* 

- Um pacote global não fica salvo na pasta node_modules do projeto.
- Ele fica salvo no computador do usuário.
- A vantagem é que podemos acessá-lo em qualquer local via terminal.
- Utilizamos a flag -g em node install.
- npm i -g lodash
- npm link lodash

*/
const _ = require('lodash');

const arr = [1, 2, 2, 3, 3, 6, 6, 9];

console.log(_.sortedUniq(arr));
