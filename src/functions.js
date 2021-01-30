const fs = require('fs')

const shell = require('shelljs');

function rootStorage() {
  // this bash returns:
  // - percentage root storage
  // - fractional representation
  let data = shell.exec("df -h / | awk 'FNR == 2 {print $5 " + '" (" $3 " / " $2 ")"}' + "'");
  return data;
}

function uptime() {
  let data = shell.exec('uptime');
  return data;
}

function updates() {
  let data = shell.exec('apt-get upgrade --dry-run | grep "newly install"');
  return data;
}

function hostname() {
  let data = shell.exec('hostname');
  return data;
}

const verifyCert = (certPem) => {
  const keyPem = fs.readFileSync('./secrets/server.key');

  return ssl.match(certPem, keyPem, function (err, matches) {
    if (matches) {
      return true;
    } else {
      return false
    }
  });
}

if (typeof module !== 'undefined') {
  module.exports = {
    rootStorage,
    uptime,
    updates,
    hostname,
    verifyCert,
  };
}