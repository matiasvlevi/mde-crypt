const { ALPHA, CHARS } = require('./alpha.js');
const { existsSync, readFileSync } = require('node:fs');

const Keygen = {
  random: function random(key_size) {
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
  },
  ascii_to_key: function (key_str) {
    let key_size = Math.sqrt(key_str.length);
    let key = [];
    for (let i = 0; i < key_size; i++) {
      key[i] = new Array(key_size).fill(0);
      
      for (let j = 0; j < key_size; j++) {
  
        key[i][j] = ALPHA.indexOf(key_str[i * key_size + j])+1;
      }
    }
    return key;  
  },
  get_or_create_key: function (filename, n = 6, allow_small = false) {
    if (existsSync(filename)) {
      let file = readFileSync(filename, 'utf-8');
      if (file.length <= 0) return [];
  
      if (file.length !== n*n && allow_small) {
        return Keygen.random(n);
      };
  
      return Keygen.ascii_to_key(file);
    } else {
      return Keygen.random(n);
    }  
  }
}

module.exports = Keygen;