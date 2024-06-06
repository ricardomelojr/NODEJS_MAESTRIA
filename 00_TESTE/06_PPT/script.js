document.addEventListener('DOMContentLoaded', () => {
  const choices = document.querySelectorAll('.choice');
  const playButton = document.getElementById('playButton');
  const resultText = document.getElementById('resultText');
  let player1Choice = null;
  let player2Choice = null;

  choices.forEach(choice => {
    choice.addEventListener('click', e => {
      const player = e.target.closest('.player').id;
      if (player === 'player1') {
        player1Choice = e.target.dataset.choice;
      } else {
        player2Choice = e.target.dataset.choice;
      }
      e.target.parentElement
        .querySelectorAll('.choice')
        .forEach(c => c.classList.remove('selected'));
      e.target.classList.add('selected');
    });
  });

  playButton.addEventListener('click', () => {
    if (player1Choice && player2Choice) {
      const winner = determineWinner(player1Choice, player2Choice);
      resultText.textContent = winner;
    } else {
      resultText.textContent = 'Ambos os jogadores devem fazer uma escolha!';
    }
  });

  function determineWinner(choice1, choice2) {
    if (choice1 === choice2) {
      return 'Empate!';
    } else if (
      (choice1 === 'rock' && choice2 === 'scissors') ||
      (choice1 === 'paper' && choice2 === 'rock') ||
      (choice1 === 'scissors' && choice2 === 'paper')
    ) {
      return 'Jogador 1 Ganha!';
    } else {
      return 'Jogador 2 Ganha!';
    }
  }
});
