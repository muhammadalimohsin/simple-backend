import express from 'express';
import cache from 'memory-cache';
import JWT from 'jsonwebtoken';
import uuid from 'short-id';

const defaultRouter = express.Router();
const authRouter = express.Router();
const jwtSecret = 'a scret phrase!';

// Simple Routes

defaultRouter.route('/register').post((req, res) => {
  const { email, password } = req.body;
  let user = { id: uuid.generate(), email, password };
  cache.put('user', user);
  user = { user: user.id, email: user.email };
  res.send({ user });
});

defaultRouter.route('/login').post((req, res) => {
  const { email, password } = req.body;
  const user = cache.get('user');

  if (!user) return res.send('Please register first.');

  if (user.email === email && user.password === password) {
    const jwt = JWT.sign(user, jwtSecret);
    res.send({ jwt });
  } else {
    res.send('Email or password mismatched');
  }
});

// Authorized Routes

authRouter.route('/user').get((req, res) => {
  let user = cache.get('user');

  if (!user) return res.send('Please register first.');
  user = { id: user.id, email: user.email };
  res.send({ user });
});

authRouter.route('/create-task').post((req, res) => {
  const { name } = req.body;
  const task = { id: uuid.generate(), name };
  let tasks = cache.get('tasks');

  if (!tasks?.length) {
    tasks = [task];
  } else {
    tasks.push(task);
  }
  cache.put('tasks', tasks);
  res.send({ task });
});

authRouter.route('/list-tasks').get((req, res) => {
  let tasks = cache.get('tasks');
  if (!tasks?.length) res.send('Please create task first.');
  else res.send({ tasks });
});

export { defaultRouter, authRouter };
