const { ALPHA, CHARS } = require('./alpha.js');
const { existsSync, readFileSync } = require('node:fs');
const { e } = require('mathjs');

function get_or_create_key(filename, n = 6, allow_small = false) {
  if (existsSync(filename)) {
    let file = readFileSync(filename, 'utf-8');
    if (file.length <= 0) return [];

    if (file.length !== n*n && allow_small) {
      return gen_random_key(n);
    };

    return ascii_to_key(file);
  } else {
    return gen_random_key(n);
  }  
}

function ascii_to_key(key_str) {
  let key_size = Math.sqrt(key_str.length);
  console.log(key_size, key_str);
  let key = [];
  for (let i = 0; i < key_size; i++) {
    key[i] = new Array(key_size).fill(0);
    
    for (let j = 0; j < key_size; j++) {

      key[i][j] = ALPHA.indexOf(key_str[i * key_size + j])+1;
    }
  }
  return key;  
}

function test() {
  for (let x = 0; x <= 1; x+=0.01) {
    let y = Math.floor(
      x *
      (ALPHA.length - CHARS.length - 1) +
      (CHARS.length + 1)
    );
    console.log(x, y, ALPHA[y]);
  }
 }
// test()

function gen_random_key(key_size) {
  let key = [];
  for (let i = 0; i < key_size; i++) {
    key[i] = new Array(key_size).fill(0);
    for (let j = 0; j < key_size; j++) {
      key[i][j] = Math.floor(
        Math.random() *
        (ALPHA.length - CHARS.length - 1) +
        (CHARS.length + 2)
      );
    }
  }
  return key;
}

module.exports = {
  gen_random_key,
  ascii_to_key,
  get_or_create_key
}