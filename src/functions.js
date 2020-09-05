const shell = require('shelljs');

function rootStorage() {
  // this bash returns:
  // - percentage root storage
  // - fractional representation
  let data = shell.exec("df -h / | awk 'FNR == 2 {print $5 " + '" (" $3 " / " $2 ")"}' + "'");
  return data;
}

if (typeof module !== 'undefined') {
    module.exports = {
      rootStorage,
    };
  }