const { Matrix } = require('dannjs');

const Debug = require('./debug.js');

const BUFFER_MAP = (i, j, w) => (j*w + i);

function split2(arr) {
  let ans = [];
  for (let i = 0; i < arr.length; i+=2) {
    ans.push(arr[i] + arr[i+1]);
  }
  return ans;
}

function nb_digits(val, offset) {
  return (
    new Array(offset).fill('0').join('') + val.toString(16)
  ).slice(-offset);
}

function hex(val, int_size) {
  val &= 0xFFFFFFFF;
  let hex = val.toString(16).toUpperCase();
  let str = (new Array(int_size).fill("00") + hex).slice(-int_size * 2);
  return str; 
}

module.exports = {
  split2,
  nb_digits,
  hex,
  BUFFER_MAP,
  unvalid_key : function (key_str) {
    let n_length_mod = Math.sqrt(key_str.length) % 2;
  
    if (
      n_length_mod !== 1 &&
      n_length_mod !== 0
    ) {
      Debug.error("Key must be a square length ex: 4, 9, 16, 25, 36 ...", `found ${key_str.length}`);
      return true;
    } 
  
    return false;
  },
  to_square_m: function (data, N) {
  
    if (data.length > N*N) {
      Debug.error("Wrong dimension array");
      return;
    }
    
    let ans = new Matrix(N, N);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (i * N + j >= data.length) {
            ans.matrix[i][j] = 0;
        } else {
          ans.matrix[i][j] = data[i * N + j];
        }
  
      }
    }
    return ans;
  },
  
  from_buffer: function(buf, map = (i, j, w) => (j * w + i)) {
    let ans = []; 
    let int_size = 255 - buf[buf.length-1];
    let len = Math.floor(buf.length/int_size);

    for (let i  = 0; i < len; i++) {
      let hex_value = "";
      
      for (let j = 0; j < int_size; j++) {
        hex_value += nb_digits(buf[map(i, j, len) ], 2);
      }

      ans.push(parseInt(hex_value, 16));
    }

    return ans;
  },
  
  to_buffer: function(values, map = (i, j, w) => (j * w + i)) {

    let int_size = 4;
    let largest = 0;

    for (let i = 0; i < values.length; i++) {
      if (largest <= values[i]) {
        largest = values[i];
      }
    }

    for (let i = 2; i < 1 << 6; i = i << 1) {
      if(!(largest >= Math.pow(2, i)-1)) { 
        int_size = i / 8; break;
      } 
    } 

    let ans = new Uint8Array(values.length * int_size + 1);
   
    for (let i = 0; i < values.length; i++) {
      let int32_hex_str = split2(hex(values[i], int_size));
      
      for (let j = 0; j < int_size; j++) {
         
        ans[map(i, j, values.length)] = parseInt(int32_hex_str[j], 16); 
      }

    }
    ans[ans.length-1] = 255 - int_size;
    return Buffer.from(ans);
  }
  
}
