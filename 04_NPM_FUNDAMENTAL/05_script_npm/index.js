/* 
    No console:
    npm start
*/
import _ from 'lodash';
import chalk from 'chalk';

console.log(chalk.bgRed('Teste'));
console.log(chalk.blue('Hello') + ' World' + chalk.red('!'));
console.log(chalk.blue.bgRed.bold('Hello world!'));
