const util = require('node:util');
const c = require('node:child_process').exec;
const exec = util.promisify(c);

const MDE = require('./src/index')

async function get_passwords(list_len, n) {
  let list = [];

  for (let j = 0; j < MDE.Keygen.ALPHA.length; j++) {
    for (let i = 0; i < MDE.Keygen.ALPHA.length; i++) {
      for (let k = 0; k < MDE.Keygen.ALPHA.length; k++) {
        for (let p = 0; p < MDE.Keygen.ALPHA.length; p++) {
          let pw =
            MDE.Keygen.ALPHA[j] +
            MDE.Keygen.ALPHA[i] +
            MDE.Keygen.ALPHA[k] +
            MDE.Keygen.ALPHA[p];
          
          try {
          const {stdout} = await exec(`node ./test/clikey.js ${pw}`);
          
          console.log(pw, stdout);
          } catch(e) {}
        }
      }

    }
  }


}
get_passwords();
