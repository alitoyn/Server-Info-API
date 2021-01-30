// ./src/index.js

// importing the dependencies
const express = require('express');
const cors = require('cors');
const { rootStorage, uptime, updates, hostname } = require('./functions.js');
const fs = require('fs');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

// defining the Express app
const app = express();

const validateKey = async (req, res, next) => {
  await fs.readFile('./secrets/secrets.json', 'utf-8', (err, data) => {
    data = JSON.parse(data);

    const tokenIndex = data.findIndex((userObject) => userObject.token === req.headers.key);
    if (tokenIndex === -1) { // if it doesn't exist
      res.status(400).send('Not Authorised');
    } else {
      next();
    }
  })
}

// enabling CORS for all requests
app.use(cors());

app.post('/login', async (req, res) => {
  fs.readFile('./secrets/secrets.json', 'utf-8', (err, data) => {
    const saltRounds = 10;
    console.log(data);
    data = JSON.parse(data);

    const sentUser = req.body.username;
    const sentPass = req.body.password;
    const hashedPassword = bcrypt.hashSync(sentPass, saltRounds);

    // find index of user in data structure
    const userIndex = data.findIndex((user) => user.username === sentUser);

    const allowNewUser = false;

    if (userIndex === -1) { // if it doesn't exist
      if (allowNewUser) {
        const cookie = randomstring.generate(80);
        data = createUser(data, sentUser, hashedPassword, cookie);

        res.cookie('token', cookie, { sameSite: true });
        fs.writeFile('./secrets/secrets.json', JSON.stringify(data), 'utf-8', () => { });
        res.status(200).send("success");
      } else {
        res.status(402).send('Not Authorised');
      }
    } else if (bcrypt.compareSync(sentPass, data[userIndex].password)) {
      const cookie = randomstring.generate(80);
      data[userIndex].token = cookie;

      res.cookie('token', cookie, { sameSite: true });

      fs.writeFile('./secrets/secrets.json', JSON.stringify(data), 'utf-8', () => { });
      res.status(200).json('success');
    } else {
      res.status(401).json('incorrect password');
    }
  })
});

app.use(validateKey);

// defining an endpoints
app.get('/rootStorage', (req, res) => {
  res.send(rootStorage());
});

app.get('/uptime', (req, res) => {
  console.log('uptime');
  res.send(uptime());
});

app.get('/updates', (req, res) => {
  res.send(updates());
});

app.get('/hostname', (req, res) => {
  res.send(hostname());
});

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});

function createUser(dataObject, username, password, cookie) {
  const dataObjectCopy = JSON.parse(JSON.stringify(dataObject));
  dataObjectCopy[dataObjectCopy.length] = {};
  dataObjectCopy[dataObjectCopy.length - 1].username = username;
  dataObjectCopy[dataObjectCopy.length - 1].password = password;
  dataObjectCopy[dataObjectCopy.length - 1].token = cookie;

  return dataObjectCopy;
}