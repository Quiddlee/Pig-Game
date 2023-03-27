'use strict';

const player0Field = document.querySelector('.player--0');
const player1Field = document.querySelector('.player--1');
const player0GlobalScore = document.querySelector('#score--0');
const player1GlobalScore = document.querySelector('#score--1');
const player0CurrentScore = document.querySelector('#current--0');
const player1CurrentScore = document.querySelector('#current--1');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNew = document.querySelector('.btn--new');
const diceElem = document.querySelector('.dice');

let player0Score = 0;
let player1Score = 0;
let localScore = 0;

player0GlobalScore.textContent = player0Score;
player1GlobalScore.textContent = player1Score;

const user0 = Object.freeze({
                              globalScore: player0GlobalScore,
                              score: player0CurrentScore,
                              field: player0Field
                            });
const user1 = Object.freeze({
                              globalScore: player1GlobalScore,
                              score: player1CurrentScore,
                              field: player1Field
                            });

let currentUser = user0;

const togglePlayer = () => {
  const curr = currentUser === user0 ? user0 : user1;
  curr.field.classList.remove('player--active');
  currentUser = user0 === curr ? user1 : user0;
  currentUser.field.classList.add('player--active');
};

btnRoll.addEventListener('click', () => {
  const rolledNumber = Math.floor(Math.random() * 6) + 1;
  diceElem.src = `dice-${ rolledNumber }.png`;

  if (rolledNumber === 1) {
    localScore = 0;
    currentUser.score.textContent = localScore;
    togglePlayer();
    return;
  }

  localScore += rolledNumber;
  currentUser.score.textContent = localScore;
});

btnHold.addEventListener('click', () => {
  const usersGlobalScore = currentUser.globalScore;

  usersGlobalScore.textContent = +usersGlobalScore.textContent + localScore;
  currentUser.score.textContent = 0;
  localScore = 0;

  if (usersGlobalScore.textContent >= 100) {
    currentUser.field.classList.add('player--winner');
    btnRoll.removeEventListener('click', () => {});
    btnHold.removeEventListener('click', () => {});
  }

  togglePlayer();
});

