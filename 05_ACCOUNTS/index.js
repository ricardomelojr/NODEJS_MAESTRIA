// modulos externos
import inquirer from 'inquirer';
import chalk from 'chalk';

// modulos internos
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
        case 'Consultar Saldo':
          consult();
          break;
        case 'Depositar':
          deposit();
          break;
        case 'Sacar':
          sacar();
          break;
        case 'Sair':
          console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'));
          process.exit();
        default:
          console.log(chalk.bgMagenta('Ação inválida!'));
          break;
      }
    })
    .catch(err => console.log(err));
}

// Criação de conta
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
        fs.mkdir('accounts', err => {
          console.log(err);
        });
      }
      //Verifica se já existe a conta
      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black('Esta conta já existe, escolha outro nome')
        );
        buildAccount();
        return;
      }
      // Criar o arquivo de conta do usuário
      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance": 0}',
        function (err) {
          console.log(err);
        }
      );

      console.log(chalk.green('Parabéns, a sua conta foi criada!'));
      operation();
    })
    .catch(err => console.log(err));
}

// Depositar
function deposit() {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
      },
    ])
    .then(answers => {
      const accountName = answers['accountName'];

      if (!checkAccount(accountName)) {
        return deposit();
      } else {
        inquirer
          .prompt([
            {
              name: 'amount',
              message: 'Quanto você deseja depositar?',
            },
          ])
          .then(answers => {
            const amount = answers['amount'];

            // add an amount
            addAmount(accountName, amount);
            //operation();
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.bgRed.black('Esta conta não existe, escolha outro nome!')
    );
    return false;
  } else {
    return true;
  }
}

function addAmount(accountName, amount) {
  /* A função getAccount() lê o arquivo JSON no diretório accounts e retorna um objeto javascript.
  
  Por isso é possível acessar o campo balance do objeto, como por exemplo accountData.balance*/
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black.bold('Ocorreu um erro, tente novamente mais tarde!')
    );
    return deposit();
  } else {
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

    fs.writeFileSync(
      `accounts/${accountName}.json`,
      JSON.stringify(accountData),
      function (err) {
        console.log(err);
      }
    );
  }
  console.log(
    chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`)
  );
  operation();
}

/* Lê um arquivo JSON e retorna um objeto javascript desse arquivo */
function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf-8',
    flag: 'r',
  });

  return JSON.parse(accountJSON);
}

// consultar saldo
function consult() {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
      },
    ])
    .then(answers => {
      const accountName = answers['accountName'];

      if (!checkAccount(accountName)) {
        return consult();
      } else {
        const accountData = getAccount(accountName);
        console.log(`Valor atual da conta: R$ ${accountData.balance}`);
        const questions = [
          {
            type: 'confirm',
            name: 'decisao',
            message: 'Seguir para o menu principal?',
            default: false,
            transformer: answer => (answer ? true : false),
          },
        ];
        inquirer
          .prompt(questions)
          .then(answers => {
            if (answers.decisao) {
              operation();
            } else {
              consult();
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
}

/* SACAR SALDO */
function sacar() {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
      },
    ])
    .then(answers => {
      const accountName = answers['accountName'];

      if (!checkAccount(accountName)) {
        return sacar();
      } else {
        const accountData = getAccount(accountName);

        const questions = [
          {
            name: 'valor',
            message: 'Quanto deseja sacar?',
          },
        ];
        inquirer
          .prompt(questions)
          .then(answers => {
            const valor = parseFloat(answers.valor);
            if (valor >= 0 && valor <= parseFloat(accountData.balance)) {
              accountData.balance = accountData.balance - valor;
              fs.writeFileSync(
                `accounts/${accountName}.json`,
                JSON.stringify(accountData),
                function (err) {
                  console.log(err);
                }
              );
              console.log(chalk.bgGreen.black('Saque efetuado'));
              operation();
            } else {
              console.log(chalk.bgRed.black('Saldo insuficiente!'));
              sacar();
              P;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
}
