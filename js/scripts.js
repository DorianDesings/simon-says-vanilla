const simonContainerElement = document.getElementById('simon-container');
const roundElement = document.getElementById('round');
const colors = ['yellow', 'blue', 'red', 'green'];

const buttonRefs = {
  yellow: 0,
  blue: 1,
  red: 2,
  green: 3
};

let intervalId;
let sequencie = [];
let sequencieTime = 500;
let sequencieLength = 1;
let playerTurn = false;
let playerSequecie = [];
let playerSequecieCounter = 0;
let round = 1;

function areArraysEqual(array1, array2) {
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
}

const resetValues = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = undefined;
  sequencie = [];
  playerSequecie = [];
  playerSequecieCounter = 0;
};

const printRound = () => {
  roundElement.textContent = 'Round: ' + round;
};

const activeButton = button => {
  playerTurn = false;
  const currentChildren = simonContainerElement.children[buttonRefs[button]];
  let pulses = 0;
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
    currentChildren.classList.toggle(`${currentChildren.dataset.color}--active`);
    pulses++;
    if (pulses === 2) {
      clearInterval(intervalId);
      playerTurn = true;
    }
  }, sequencieTime);
};

const setSequenciePlayer = playerColor => {
  if (playerColor === sequencie[playerSequecieCounter]) {
    playerSequecie.push(playerColor);
    activeButton(playerColor);
    const sequencieFinished = areArraysEqual(sequencie, playerSequecie);
    if (sequencieFinished) {
      round++;
      sequencieLength++;
      printRound();
      resetValues();
      generateSequencie();
    } else {
      playerSequecieCounter++;
    }
  } else {
    console.log('WRONG');
  }
  console.log(playerSequecie);
  console.log(playerSequecieCounter);
};

const startSequencie = sequencie => {
  let sequencieCounter = 0;
  if (intervalId) {
    clearInterval(intervalId);
  }
  let intervalSequencie = undefined;
  intervalSequencie = setInterval(() => {
    activeButton(sequencie[sequencieCounter]);
    if (sequencieCounter >= sequencie.length - 1) {
      clearInterval(intervalSequencie);
      playerTurn = true;
    } else {
      sequencieCounter++;
    }
  }, sequencieTime * 3);
};

const generateSequencie = () => {
  for (let index = 0; index < sequencieLength; index++) {
    const randomPosition = Math.floor(Math.random() * colors.length);
    const currentColor = colors[randomPosition];
    sequencie.push(currentColor);
  }
  startSequencie(sequencie);
};

generateSequencie();
printRound();

simonContainerElement.addEventListener('click', event => {
  const playerColor = event.target.dataset.color;
  if (!playerTurn || !playerColor) return;
  setSequenciePlayer(playerColor);
});
