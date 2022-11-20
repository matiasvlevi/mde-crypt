const { readFile, writeFileSync } = require('node:fs');
const { Decrypt } = require('../src/index');
const { get_or_create_key } = require('../src/keygen.js');

function decrypt(config) {
  let source = config.enc_src || "encrypted_data.mde";
    
  let key = get_or_create_key(config.key_data);

  readFile(source, (err, data) => {
    if (err) throw err;
    const dec = Decrypt(
      data,
      key
    );

    if (config.dec_dest !== undefined) {
      writeFileSync(config.dec_dest, dec.data);
    } else {
      console.log(`${dec.data}`);
    }
  });
}

module.exports = { decrypt };
