import express from 'express';
import JWT from 'jsonwebtoken';
import cache from 'memory-cache';

import { defaultRouter, authRouter } from '../routes';

const app = express();
app.use(express.json());
const jwtSecret = 'a scret phrase!';

const authorizeToken = (req,res,next) => {
  let bearerToken = req.headers['authorization'];

  if (bearerToken) {
    const bearer = bearerToken.split(' ');
    bearerToken = bearer[1];

    JWT.verify(bearerToken, jwtSecret, (err,authData)=>{
      if (err)
        res.sendStatus(403);
      else {
        // Below commented code is to verify token w.r.t saved user
        // const user = cache.get('user');
        // if (!user) return res.sendStatus(403);
        // if (user.email !== authData.email || user.password !== authData.password) {
        //   return res.send('Token doesnot belongs to user saved inthis session');
        // }

        // Passing these maybe needed in any API
        req.data = authData;
        req.token = bearerToken;
        next();
      }
    })
  } else {
    res.sendStatus(403);
  }
}

// We should save port in .env file
app.listen({ port: 3000 }, async () => {
  console.log(`app listening on port 3000!`);
});

app.use('/api/v1',  defaultRouter);
app.use('/api/v1', authorizeToken, authRouter);

export default app;
