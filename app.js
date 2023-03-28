'use strict';

class Game {
  static #localScore = 0;

  static constructor() {};

  static get localScore() {
    return +this.#localScore;
  }

  static set localScore(score) {
    return this.#localScore = +score;
  }

  static toggleActivePlayer() {
    Player.getActivePlayer().field.classList.remove('player--active');
    if (Player.getActivePlayer() === player0) {
      player1.state = true;
      player0.state = false;
    }
    else {
      player0.state = true;
      player1.state = false;
    }
    Player.getActivePlayer().field.classList.add('player--active');
  }

  static showDice() {
    dice.style.display = 'block';
  }

  static hideDice() {
    dice.style.display = 'none';
  }

  static disableButtons(btns) {
    btns.forEach(([btn, callBack]) => {
      btn.removeEventListener('click', callBack);
    });
  }

  static enableButtons(btns) {
    btns.forEach(([btn, callBack]) => {
      btn.addEventListener('click', callBack);
    });
  }
}

class Player {
  #state;
  #globalScore;
  #currentScore;
  #field;

  constructor(gScore, currScore, field) {
    this.#globalScore = gScore;
    this.#currentScore = currScore;
    this.#field = field;
    this.#state = false;
  }

  set state(state) {
    return this.#state = state;
  }

  get globalScore() {
    return this.#globalScore;
  }

  get currentScore() {
    return this.#currentScore;
  }

  get field() {
    return this.#field;
  }

  static getActivePlayer() {
    return player0.isActive() ? player0 : player1;
  }

  isActive() {
    return this.#state;
  }
}

const getSimilarElements = (selector, iter, modifier) => {
  const elements = [];
  for (let i = 0; i < iter; i++) {
    elements.push(
        document.querySelector(`${ selector }${ modifier ? modifier : i }`));
  }
  return elements;
};

const [
  [
    player0Field,
    player1Field,
  ],
  [
    player0GlobalScore,
    player1GlobalScore,
  ],
  [
    player0CurrentScore,
    player1CurrentScore,
  ],
] = [
  '.player--',
  '#score--',
  '#current--',
].map(
    selector => getSimilarElements(selector, 2));

const [[btnRoll], [btnHold], [btnNew]] = [
  'roll',
  'hold',
  'new',
].map(modifier => getSimilarElements('.btn--', 1, modifier));

const dice = document.querySelector('.dice');
Game.hideDice();

let btnHoldFn;
let btnRollFn;

[player0GlobalScore, player1GlobalScore].forEach(player => {
  player.textContent = 0;
});

const player0 =
    new Player(
        player0GlobalScore,
        player0CurrentScore,
        player0Field,
    );
const player1 =
    new Player(
        player1GlobalScore,
        player1CurrentScore,
        player1Field,
    );

player0.state = true;

btnRoll.addEventListener('click', btnRollFn = () => {
  const rolledNumber = Math.floor(Math.random() * 6) + 1;
  const {currentScore: activePlayerCurrScore} = Player.getActivePlayer();

  dice.src = `dice-${ rolledNumber }.png`;
  Game.showDice();

  if (rolledNumber === 1) {
    activePlayerCurrScore.textContent = Game.localScore = 0;
    Game.toggleActivePlayer();
    return;
  }

  activePlayerCurrScore.textContent = Game.localScore += rolledNumber;
});

btnHold.addEventListener('click', btnHoldFn = () => {
  const {
    globalScore: playerGlobalScore,
    currentScore,
    field: {classList: playerField},
  } = Player.getActivePlayer();

  playerGlobalScore.textContent = +playerGlobalScore.textContent +
      Game.localScore;
  currentScore.textContent = Game.localScore = 0;

  if (playerGlobalScore.textContent >= 100) {
    playerField.add('player--winner');
    Game.hideDice();
    Game.disableButtons([[btnHold, btnHoldFn], [btnRoll, btnRollFn]]);
  }

  Game.toggleActivePlayer();
});

btnNew.addEventListener('click', () => {
  [player0, player1].forEach(user => {
    const {
      field: {classList: playerField},
      globalScore,
      currentScore,
    } = user;

    playerField.remove('player--winner', 'player--active');
    globalScore.textContent = currentScore.textContent = 0;
  });

  player0.field.classList.add('player--active');

  Game.enableButtons([[btnHold, btnHoldFn], [btnRoll, btnRollFn]]);
  Game.hideDice();
});