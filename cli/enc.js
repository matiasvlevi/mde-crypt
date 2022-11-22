#!/usr/bin/env node

const { writeFileSync, statSync } = require('node:fs');
const { Encrypt } = require('../src/index');
const Keygen = require('../src/keygen');

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

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


async function benchmark(config) {

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

  let csv = 'KEYSIZE (N), ENC SIZE, ORIGINAL SIZE, RATIO\n';
  for (let i = 2; i < 1 << 7; i+=4) {

    await sleep(100);

    const enc = Encrypt(config.raw_data, Keygen.random(i)); 

    console.log(`Iteration ${i}`)
    writeFileSync(config.enc_dest, enc.data);
    await sleep(300);

    csv+=    `${i},`+
      `${statSync('./enc').size / 1024}, `+
      `${statSync('./test.txt').size / 1024},`+
      `${statSync('./enc').size / statSync('./test.txt').size}\n`
    


  }
  
  writeFileSync('./benchmark.csv', csv, 'utf-8');
}
module.exports = { encrypt };
