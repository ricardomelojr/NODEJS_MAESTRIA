import _ from 'lodash';
import chalk from 'chalk';

const a = [1, 2, 3, 4, 5];
const b = [2, 4, 6, 7, 8];

const diff = _.difference(a, b);

console.log(chalk.bgRed(diff));

/* 
    Formas de atualizar pacotes:
    npm update
    npm update {pacote}
    npx npm-check-updates -u
 */
