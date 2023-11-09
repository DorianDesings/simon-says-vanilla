const simonContainerElement = document.getElementById('simon-container');
const gameContainerElement = document.getElementById('game');
const buttonStartElement = document.getElementById('button-start');
const simonBoxesElements = document.querySelectorAll('.simon-box');
const noteDoElement = document.getElementById('note-do');
const noteReElement = document.getElementById('note-re');
const noteMiElement = document.getElementById('note-mi');
const noteFaElement = document.getElementById('note-fa');
const roundElement = document.getElementById('round');
const colors = ['yellow', 'blue', 'red', 'green'];

const buttonRefs = {
  yellow: {
    position: 0,
    audio: noteDoElement
  },
  blue: {
    position: 1,
    audio: noteReElement
  },
  red: {
    position: 2,
    audio: noteMiElement
  },
  green: {
    position: 3,
    audio: noteFaElement
  }
};

let intervalId;
let sequencie = [];
let playerSequecie = [];
let sequencieTime = 500;
let playerTurn = false;
let round = 1;

const areArraysEqual = (array1, array2) => {
  // Comprueba si las longitudes de los dos arrays son iguales
  if (array1.length !== array2.length) {
    return false;
  }

  // Compara los elementos de los dos arrays uno por uno
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  // Si todos los elementos coinciden, los arrays son iguales
  return true;
};

const resetValues = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = undefined;
  sequencie = [];
  playerSequecie = [];
  playerTurn = false;
};

const printRound = () => {
  roundElement.textContent = 'Round: ' + round;
};

const playButtonSound = color => {
  buttonRefs[color].audio.currentTime = 0;
  buttonRefs[color].audio.play();
};

const iluminateButton = color => {
  const currentPosition = buttonRefs[color].position;
  const currentChildren = simonBoxesElements[currentPosition];
  playButtonSound(color);
  currentChildren.classList.add(`${color}--active`);
  const timeoutId = setTimeout(() => {
    currentChildren.classList.remove(`${color}--active`);
    clearTimeout(timeoutId);
  }, 200);
};

const checkSecuencie = () => {
  let sequencieMatches = true;
  for (let index = 0; index < playerSequecie.length; index++) {
    sequencieMatches = playerSequecie[index] === sequencie[index];
  }
  return sequencieMatches;
};

const checkRoundFinished = () => {
  const roundFinished = areArraysEqual(sequencie, playerSequecie);
  if (roundFinished) {
    playerSequecie = [];
    generateGameSequencie();
    round++;
    printRound();
  }
};

const setSequenciePlayer = playerColor => {
  iluminateButton(playerColor);
  playerSequecie.push(playerColor);
  const isCorrect = checkSecuencie();
  if (!isCorrect) {
    console.log('END');
    resetValues();
    return;
  }
  checkRoundFinished();
};

const startSequencie = sequencie => {
  let sequencieCounter = 0;
  if (intervalId) {
    clearInterval(intervalId);
  }
  let intervalSequencie = undefined;
  intervalSequencie = setInterval(() => {
    iluminateButton(sequencie[sequencieCounter]);
    if (sequencieCounter >= sequencie.length - 1) {
      clearInterval(intervalSequencie);
      playerTurn = true;
    } else {
      sequencieCounter++;
    }
  }, sequencieTime);
};

const generateGameSequencie = () => {
  const randomPosition = Math.floor(Math.random() * colors.length);
  const currentColor = colors[randomPosition];
  sequencie.push(currentColor);
  const timeoutId = setTimeout(() => {
    startSequencie(sequencie);
    clearTimeout(timeoutId);
  }, 1000);
};

simonContainerElement.addEventListener('click', event => {
  const playerColor = event.target.dataset.color;
  if (!playerTurn || !playerColor) return;
  setSequenciePlayer(playerColor);
});

buttonStartElement.addEventListener('click', () => {
  printRound();
  generateGameSequencie();
  gameContainerElement.classList.add('show');
  buttonStartElement.classList.remove('show');
});
