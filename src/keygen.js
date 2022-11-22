const { ALPHA, get_range_ascii } = require('./alpha.js');
const { existsSync, readFileSync } = require('node:fs');
const math = require('mathjs');

const KEYGEN_ALPHA = get_range_ascii(48, 57) + get_range_ascii(65, 90) + get_range_ascii(97, 122);

const Keygen = {
  random_matrix: function (key_size, table = KEYGEN_ALPHA) {
    let key;
    let invalid = true;
    while (invalid) {
      key = [];

      for (let i = 0; i < key_size; i++) {
        key[i] = new Array(key_size).fill(0);
        for (let j = 0; j < key_size; j++) {
          key[i][j] = Math.ceil(
            Math.random() * (table.length-1)
          );
        }
      }

      // Avoid a key which has 0 as a determinant
      invalid = (math.det(key) == 0); 
    }

    return key;
  },

  random: function (key_size, table = KEYGEN_ALPHA) {
    let key;
    let invalid = true;
    while (invalid) {
      key = "";

      for (let i = 0; i < key_size * key_size; i++) {
          key += table[Math.ceil(
            Math.random() * (table.length-1)
          )];
      }

      // Avoid a key which has 0 as a determinant
      invalid = (math.det(Keygen.ascii_to_key_matrix(key)) == 0); 
    }

    return key;
  },

  from_keycode_to_ascii: function(key) {
    return key.split('').map(char => {
      return ALPHA[ALPHA.indexOf(char)+1]
    });
  },

  from_keycode_to_uintarr: function(key) {
    let ans = new Uint8Array(key.length);

    for (let i = 0; i < key.length; i++) {
      ans[i] = ALPHA.indexOf(key[i]);
    }

    return ans;
  },

  keycode_to_key_matrix: function (uintarr) {
    let key_size = Math.sqrt(uintarr.length);
    let key = [];
    for (let i = 0; i < key_size; i++) {
      key[i] = new Array(key_size).fill(0);
      
      for (let j = 0; j < key_size; j++) {
        key[i][j] = uintarr[i * key_size + j];
      }
    }
    return key;  
  },

  ascii_to_key_matrix: function (key_str, table = ALPHA) {
    let key_size = Math.sqrt(key_str.length);
    let key = [];
    for (let i = 0; i < key_size; i++) {
      key[i] = new Array(key_size).fill(0);
      
      for (let j = 0; j < key_size; j++) {
  
        key[i][j] = table.indexOf(key_str[i * key_size + j]);
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
  ALPHA: KEYGEN_ALPHA
}

module.exports = Keygen;
