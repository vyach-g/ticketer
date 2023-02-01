import { v4 as uuidv4 } from 'uuid';
import SessionModel from '../models/Session.js';

import { getRandomIntInclusive } from '../utils.js';
import { generateBet } from '../utils.js';

import { ENDPOINTS } from '../consts/endpoints.js';
import { DOMAIN } from '../index.js';
import { PATH_TO_GAME } from '../index.js';
import { ERROR_CODE } from '../consts/errors.js';

export const initSession = async (req, res) => {
  const body = req.body;

  const { game_id, player_id, balance, demo } = body;
  console.log(body);

  // const session = uuidv4();
  // SESSIONS.push({
  //   session,
  // });

  const doc = new SessionModel({
    game_id,
    player_id,
    balance,
    demo,
  });

  const post = await doc.save();

  const response = {
    url: `${PATH_TO_GAME}?session=${post._id}&host=${DOMAIN}`,
    session: post._id,
    balance: post.balance,
  };

  res.status(200).json(response);
};

export const getParam = async (req, res) => {
  const { session } = req.query;
  // const currentSession = SESSIONS.find((elem) => elem.session === session);

  const currentSession = await SessionModel.findById(session);

  if (!currentSession) {
    return res.status(400).json({ error: 'session does not exist' });
  }

  console.log('currentSession', currentSession);
  console.log(req.query);

  const response = {
    session: currentSession._id,
    game_id: currentSession.game_id,
    demo: currentSession.demo,
    language: '',
    myparam: '',
    player_name: '',
    prices: [20, 50, 100, 200, 300, 500, 1000],

    action_url: DOMAIN + ENDPOINTS.action_url,
    balance_url: DOMAIN + ENDPOINTS.balance_url,
    bet_url: DOMAIN + ENDPOINTS.bet_url,
    buy_bets_url: DOMAIN + ENDPOINTS.buy_bets_url,
    draw_info_url: DOMAIN + ENDPOINTS.draw_url,
    get_my_bets_url: DOMAIN + ENDPOINTS.get_my_bets_url,
    refill_url: DOMAIN + ENDPOINTS.refill_url,
    register_url: DOMAIN + ENDPOINTS.register_url,
    return_url: DOMAIN + ENDPOINTS.return_url,
    start_url: DOMAIN + ENDPOINTS.start_url,
  };
  res.status(200).json(response);
};

export const getBet = async (req, res) => {
  const body = req.body;

  const { action, bet_count, game_id, price, session } = body;

  // const currentSession = SESSIONS.find((elem) => elem.session === session);
  const currentSession = await SessionModel.findById(session);

  if (!currentSession) {
    return res.status(400).json({ error: 'session does not exist' });
  }

  if (currentSession.game_id !== game_id) {
    return res.status(400).json({ error: 'game_id does not match session' });
  }

  console.log('currentSession', currentSession);

  const bets = [];

  for (let i = 0; i < bet_count; i++) {
    bets.push(generateBet(game_id, price));
  }

  const newBalance =
    currentSession.balance - price * bet_count + bets.reduce((prev, curr) => prev + curr.win, 0);
  // TODO: способ изменять только баланс в БД
  await SessionModel.updateOne(
    {
      _id: session,
    },
    {
      game_id: currentSession.game_id,
      player_id: currentSession.player_id,
      balance: newBalance,
      demo: currentSession.demo,
    },
  );

  const response = {
    action: action,
    balance: newBalance,
    error: ERROR_CODE.NOERROR,
    bets,
  };

  res.status(200).json(response);
};

export const getBalance = async (req, res) => {
  const body = req.body;

  const { session } = body;

  console.log('body', body);
  console.log('session', session);

  // const currentSession = SESSIONS.find((elem) => elem.session === session);

  const currentSession = await SessionModel.findById(session);
  if (!currentSession) {
    return res.status(400).json({ error: 'session does not exist' });
  }

  const response = {
    balance: currentSession.balance,
    demo: currentSession.demo,
  };

  res.status(200).json(response);
};
