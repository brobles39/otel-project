const express = require('express');
const { expressjwt: expressJwt } = require('express-jwt');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const winstone = require('winston');
dotenv.config();

const app = express();
app.use(bodyParser.json());


const logger = winstone.createLogger({
  transports: [
    new winstone.transports.File({filename: '../var/log/app.log'})
  ]
})
const apiKey = '2f5ae96c-b558-4c7b-a590-a501ae1c3f6c';
const jwtSecret = 'DemoSK';

app.use(expressJwt({ secret: jwtSecret, algorithms: ['HS256'], credentialsRequired: true }));

app.post('/DevOps', (req, res) => {
  if (req.headers['x-parse-rest-api-key'] !== apiKey) {
    logger.log('error', `Forbidden`);
    res.status(403).send('Forbidden');
    return;
  }

  const {
    message,
    to,
    from,
    timeToLifeSec,
  } = req.body;

  if (message && to && from && timeToLifeSec) {
    logger.log('info', `Hello ${to}, your message will be send`);
    res.status(200).json({
      message: `Hello ${to}, your message will be send`,
      
    });
    
  } else {
    logger.log('error', `Bad Request`);
    res.status(400).send('Bad Request');
  }
});

app.use((err, req, res, next) => {
  if (req.method === 'GET') {
    logger.log('error', `Method Not Allowed`);
    res.status(405).send('Method Not Allowed');
  }
  if (err.name === 'UnauthorizedError') {
    logger.log('error', `Unathorized`);
    res.status(401).send('Unauthorized');
  }
  next();
});

app.use('*', (req, res) => {
  logger.log('error', `ERROR`);
  res.status(405).send('ERROR');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

global.server = server;
process.on('SIGTERM', () => {
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
  });
});

module.exports = app;