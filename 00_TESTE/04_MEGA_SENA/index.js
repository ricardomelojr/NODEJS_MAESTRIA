'use strict';

import chalk from 'chalk';
import inquirer from 'inquirer';
import figlet from 'figlet';
import fs from 'fs';

function mainMenu() {
  console.log(
    chalk.green(figlet.textSync('MEGA-SENA', { horizontalLayout: 'full' }))
  );

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: 'Escolha uma opção:',
        choices: ['Gerar números', 'Sair'],
      },
    ])
    .then(answers => {})
    .catch(err => {
      console.log(err);
    });
}

// Retornar ao menu principal após a ação
//setTimeout(mainMenu, 2000);

mainMenu();
