#!/usr/bin/env node

const { writeFileSync } = require('node:fs');
const { Encrypt } = require('../src/index');
const { get_or_create_key } = require('../src/keygen');

function encrypt(config) {

  let key = get_or_create_key(config.key_data, config.key_size, true);

  const enc = Encrypt(config.raw_data, key, config.key_size); 
  writeFileSync(config.enc_dest, enc.data);
  writeFileSync(config.key_data, enc.key);

  console.log(
    `${enc.key}`
  );
}
module.exports = { encrypt };
