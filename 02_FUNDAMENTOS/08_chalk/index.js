import chalk from 'chalk';

const nota = 7;

nota >= 7
  ? console.log(chalk.bgGreen.bold('Parabéns! Você está aprovado'))
  : console.log(chalk.bgRed.bold('Você precisa fazer a prova de recuperação'));
