const fs = require('fs')

const shell = require('shelljs');

function rootStorage() {
  const getPercentageStorage = "df -h / | awk 'FNR == 2 {print $5}'";
  const getFractionalStorage = "df -h / | awk 'FNR == 2 {print" + '""$3 " / " $2 ""}' + "'";

  const percent = shell.exec(getPercentageStorage).replace(/\n$/, "");
  const fractional = shell.exec(getFractionalStorage).replace(/\n$/, "");;

  return {
    percent: percent,
    fractional: fractional
  };
}

function uptime() {
  const uptime = shell.exec('uptime').replace(/\n$/, "");
  return {
    uptime: uptime
  };
}

function updates() {
  const numberOfUpgrades = shell.exec('apt-get upgrade --dry-run | grep "newly install" | awk \'{print $1}\'').replace(/\n$/,"");
  
  return {
    toUpgrade: numberOfUpgrades,
      };
}

function hostname() {
  const hostname = shell.exec('hostname').replace(/\n$/,"");
  return {
    hostname: hostname
  };
}

if (typeof module !== 'undefined') {
  module.exports = {
    rootStorage,
    uptime,
    updates,
    hostname,
  };
}