import { MIN_TILE_NUM, MAX_TILE_NUM } from './consts/consts.js';

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

export function generateSequence(isWin) {
  const sequence = Array(LINE_LENGTH).fill(null);
}

export function generateBet(gameId, price) {
  const isWin = Boolean(Math.random() > 0.5);
  const mask = Array(5).fill(null);
  const category = getRandomIntInclusive(3, 5);
  const winTile = isWin ? getRandomIntInclusive(MIN_TILE_NUM, MAX_TILE_NUM) : 0;
  const winAmount = isWin ? category * winTile * price * 0.5 : 0; // вин, зависит от символа, количства и прайса

  if (isWin) {
    let count = category;
    while (count) {
      const index = getRandomIntInclusive(0, 4);
      if (!mask[index]) {
        mask[index] = winTile;
        count--;
      }
    }
  }
  const maskFilled = fillMask(mask);

  // for (let i = 0; i < LINE_LENGTH; i++) {
  //   mask.push(getRandomIntInclusive(MIN_TILE_NUM, MAX_TILE_NUM));
  // }

  const bet = {
    bonus: false,
    date: Date.now(),
    game_id: gameId,
    mask: maskFilled,
    number: 'MOCK-' + String(Date.now()).slice(7),
    price: price,
    win: winAmount,
    win_tile: winTile,
  };
  return bet;
}

export function fillMask(array) {
  const used = {};
  array.forEach((elem) => {
    if (!elem) return;
    used[elem] = used[elem] + 1 || 1;
  });
  const result = array.map((elem) => {
    if (elem) return elem;
    while (true) {
      const randNum = getRandomIntInclusive(MIN_TILE_NUM, MAX_TILE_NUM);
      if (!used[randNum] || used[randNum] < 2) {
        used[randNum] = used[randNum] + 1 || 1;
        return randNum;
      }
    }
  });
  return result;
}
