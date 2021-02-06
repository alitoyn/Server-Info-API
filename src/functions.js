const fs = require('fs')

const shell = require('shelljs');

function rootStorage() {
  const getPercentageStorage = "df -h / | awk 'FNR == 2 {print $5}'";
  const getFractionalStorage = "df -h / | awk 'FNR == 2 {print" + '""$3 " / " $2 ""}' + "'";

  const percent = shell.exec(getPercentageStorage).replace(/\n$/, "");
  const fractional = shell.exec(getFractionalStorage).replace(/\n$/, "");;

  const output = {
    percent: percent,
    fractional: fractional
  };

  return output;
}

function uptime() {
  const uptime = shell.exec('uptime').replace(/\n$/, "");
  return {
    uptime: uptime
  };
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