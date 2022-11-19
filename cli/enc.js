#!/usr/bin/env node

const { writeFileSync } = require('node:fs');
const { Encrypt } = require('../src/index');
const { get_or_create_key } = require('../src/keygen');

function encrypt(config) {

  let key = get_or_create_key(config.key_data, config.key_size, true);

  const data = Encrypt(config.raw_data, key, config.key_size); 
  writeFileSync(config.enc_dest, data.enc);
  writeFileSync(config.key_data, data.key);

  console.log(
    `${data.key}`
  );
}
module.exports = { encrypt };
