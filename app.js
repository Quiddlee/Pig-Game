'use strict';

const getSimilarElements = (selector) => {
  return [ '_', '_' ].map(
    (_, i) => document.querySelector(`${ selector }${ i }`));
};

const [
  [
    player0Field,
    player1Field
  ],
  [
    player0GlobalScore,
    player1GlobalScore
  ],
  [
    player0CurrentScore,
    player1CurrentScore
  ]
] = [
  '.player--',
  '#score--',
  '#current--'
].map(
  selector => getSimilarElements(selector));

const [ btnRoll, btnHold, btnNew ]
  = [
  'roll',
  'hold',
  'new'
].map(modifier => document.querySelector(`.btn--${ modifier }`));

const dice = document.querySelector('.dice');
dice.style.display = 'none';

let localScore = 0;
let btnHoldFn;
let btnRollFn;

[ player0GlobalScore, player1GlobalScore ].forEach(player => {
  player.textContent = 0;
});

let currentUser;
const user0 = currentUser = Object.freeze({
                                            globalScore: player0GlobalScore,
                                            score: player0CurrentScore,
                                            field: player0Field
                                          });
const user1 = Object.freeze({
                              globalScore: player1GlobalScore,
                              score: player1CurrentScore,
                              field: player1Field
                            });

const togglePlayer = () => {
  const curr = currentUser === user0 ? user0 : user1;
  const {
    field: {
      classList: fieldClasses
    }
  } = curr;

  fieldClasses.remove('player--active');
  const {
    field: {
      classList: newFieldClasses
    }
  } = currentUser = user0 ===
                    curr ?
                    user1 :
                    user0;
  newFieldClasses.add('player--active');
};

btnRoll.addEventListener('click', btnRollFn = () => {
  const rolledNumber = Math.floor(Math.random() * 6) + 1;
  const { score } = currentUser;

  dice.src = `dice-${ rolledNumber }.png`;
  dice.style.display = 'block';

  if (rolledNumber === 1) {
    localScore = 0;
    score.textContent = localScore;
    togglePlayer();
    return;
  }

  localScore += rolledNumber;
  score.textContent = localScore;
});

btnHold.addEventListener('click', btnHoldFn = () => {
  const {
    globalScore,
    score,
    field: { classList: fieldClasses }
  } = currentUser;

  globalScore.textContent = +globalScore.textContent + localScore;
  score.textContent = 0;
  localScore = 0;

  if (globalScore.textContent >= 100) {
    fieldClasses.add('player--winner');

    [ [ btnHold, btnHoldFn ], [ btnRoll, btnRollFn ] ].forEach(
      ([ btn, callBack ]) => {
        btn.removeEventListener('click', callBack);
      });
  }

  togglePlayer();
});

btnNew.addEventListener('click', () => {
  [ user0, user1 ].forEach(user => {
    const {
      field: {
        classList: fieldClasses
      },
      globalScore,
      score
    } = user;

    fieldClasses.remove('player--winner', 'player--active');
    globalScore.textContent = score.textContent = 0;
  });

  user0.field.classList.add('player--active');

  [ [ btnHold, btnHoldFn ], [ btnRoll, btnRollFn ] ].forEach(
    ([ btn, callBack ]) => {
      btn.addEventListener('click', callBack);
    });

  dice.style.display = 'none';
});