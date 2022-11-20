#!/usr/bin/env node

const { writeFileSync } = require('node:fs');
const { Encrypt } = require('../src/index');
const Keygen = require('../src/keygen');

function encrypt(config) {

  let key = "";
  if (config.key_size === undefined) {
    if (config.key_data === undefined) {
      key = Keygen.random(8);
    } else {
      key = Keygen.get_or_create_key(config.key_data, config.key_size); 
    }
  } else {
    key = Keygen.random(config.key_size);
  }

  const enc = Encrypt(config.raw_data, key); 

  writeFileSync(config.enc_dest, enc.data);

  if (config.key_data !== undefined) {
    writeFileSync(config.key_data, enc.key);  

  } else {
    console.log(
      `${Keygen.HEADER}${enc.key}${Keygen.FOOTER}`
    )
  }

}
module.exports = { encrypt };
