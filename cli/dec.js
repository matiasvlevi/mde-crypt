const { readFile } = require('node:fs');
const { Decrypt } = require('../src/index');
const { get_or_create_key } = require('../src/keygen.js');

function decrypt({
  enc_src, key_data
}) {
  let source = enc_src || "encrypted_data.mde";
    
  let key = get_or_create_key(key_data);

  readFile(source, (err, data) => {
    if (err) throw err;
    const dec = Decrypt(
      data,
      key
    );

    console.log(`${dec.data}`);
  });
}

module.exports = { decrypt };
