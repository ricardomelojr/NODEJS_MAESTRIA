// módulos externos
import inquirer from 'inquirer';
import chalk from 'chalk';
//import { SingleBar, Presets } from 'cli-progress';
//import colors from 'ansi-colors';

// módulos internos
import fs from 'fs';

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
          'Criar Conta',
          'Consultar Saldo',
          'Depositar',
          'Sacar',
          'Sair',
        ],
      },
    ])
    .then(answers => {
      const action = answers['action'];
      switch (action) {
        case 'Criar Conta':
          createAccount();
          break;

        default:
          break;
      }
    })
    .catch(err => console.log(err));
}

function createAccount() {
  console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'));
  console.log(chalk.green('Defina as opções da sua conta a seguir.'));
  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Digite um nome para a sua conta:',
      },
    ])
    .then(answers => {
      const accountName = answers.accountName;

      console.info(accountName);

      // Verifica se o diretório 'accounts' já existe, caso contrário, cria um diretório com esse nome.
      if (!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts');
      }

      // Verifica se já existe a conta
      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black('Esta conta já existe, escolha outro nome')
        );
        buildAccount();
        return;
      }

      // Criar a barra de progresso
      const progressBar = new SingleBar(
        {
          format:
            'Criando conta |' +
            colors.cyan('{bar}') +
            '| {percentage}% || {value}/{total} etapas',
          barCompleteChar: '\u2588',
          barIncompleteChar: '\u2591',
          hideCursor: true,
        },
        Presets.shades_classic
      );

      const totalSteps = 5;
      progressBar.start(totalSteps, 0);

      // Simulação de etapas de criação da conta
      setTimeout(() => {
        progressBar.update(1);
      }, 1000);

      setTimeout(() => {
        // Criar o arquivo de conta do usuário
        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}');
        progressBar.update(2);
      }, 2000);

      setTimeout(() => {
        progressBar.update(3);
      }, 3000);

      setTimeout(() => {
        progressBar.update(4);
      }, 4000);

      setTimeout(() => {
        progressBar.update(5);
        progressBar.stop();

        console.log(chalk.green('Parabéns, a sua conta foi criada!'));
      }, 6000);

      setTimeout(() => {
        console.clear(); //limpa tela
        operation(); // operações
      }, 8000);
    })
    .catch(err => console.log(err));
}
