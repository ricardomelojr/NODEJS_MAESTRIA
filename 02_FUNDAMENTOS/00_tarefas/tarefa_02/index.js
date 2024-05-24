import inquirer from 'inquirer';
import chalk from 'chalk';

inquirer
  .prompt([
    /* Pass your questions in here */
    {
      type: 'input',
      name: 'nome',
      message: 'Qual o seu nome?',
    },
    {
      type: 'input',
      name: 'idade',
      message: 'Qual a sua idade?',
    },
  ])
  .then(answers => {
    // Use user feedback for... whatever!!
    if (!answers.nome || !answers.idade) {
      throw new Error(chalk.bgRed('O nome e a idade são obrigatórios'));
    }
    console.log(
      chalk.bgYellow.black(
        `O seu nome é ${answers.nome} e você possui ${answers.idade} anos.`
      )
    );
  })
  .catch(error => {
    console.log(`Erro: ${error}`);
  });
