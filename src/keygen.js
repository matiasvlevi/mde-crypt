const { ALPHA, CHARS } = require('./alpha.js');
const { existsSync, readFileSync } = require('node:fs');

const Keygen = {
  random_matrix: function (key_size) {
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
  random: function (key_size) {
    let key = "";
    for (let i = 0; i < key_size * key_size; i++) {
        key += ALPHA[Math.floor(
          Math.random() *
          (ALPHA.length - CHARS.length - 1) +
          (CHARS.length + 1)
        )];
    }
    return key;
  },
  ascii_to_key_matrix: function (key_str) {
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
  parse_key: function (content) {
    let key = "";
    let split = content.split('\n');
    for (let i = 0; i < split.length; i++) {
      if (
        split[i][0] === ':' ||
        split[i][0] === '#' ||
        split[i][0] === '/' ||
        split[i][0] === '-' 
      ) {
        continue
      } else {
        return split[i];
      };
    }


  },
  get_or_create_key: function (filename, n = 6, allow_small = false) {
    if (existsSync(filename)) {
      let file = readFileSync(filename, 'utf-8');
 
      if (
        (file.length !== n*n && allow_small) ||
        file.length <= 0
      ) {
        return Keygen.random(n);
      };
  
      return Keygen.parse_key(file);
    } else {
      return Keygen.random(n);
    }  
  },
  HEADER: "--- KEY START ---\n",
  FOOTER: "\n---  KEY END  ---",
  ALPHA
}

module.exports = Keygen;
