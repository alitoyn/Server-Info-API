// ./src/index.js

// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('../secrets.js');
const { rootStorage, uptime } = require('./functions.js');

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.data.url,
  }),

  // Validate the audience and the issuer.
  audience: config.data.audience,
  issuer: config.data.issuer,
  algorithms: ['RS256']
});

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use(checkJwt);

// defining an endpoints
app.get('/rootStorage', (req, res) => {
  res.send(rootStorage());
});

app.get('/uptime', (req, res) => {
    res.send(uptime());
  });

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});