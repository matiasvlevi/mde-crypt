#!/usr/bin/env node

const { writeFileSync } = require('node:fs');
const { Encrypt } = require('./src/index');

function encrypt() {
    const config = {
      raw_data: process.argv[3] || "Matrix Encrypted Data",
      enc_dest: process.argv[4] || "encrypted_data.mde",
      key_size: process.argv[5] || 6 
    };

    const data = Encrypt(config.raw_data, config.key_size); 
    writeFileSync(config.enc_dest, data.enc);

    console.log(
      `${data.key}`
    );
}
module.exports = { encrypt };
