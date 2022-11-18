const { Matrix } = require('dannjs');

const { to_buffer } = require('./utils.js');
const { ALPHA, CHARS, to_ascii } = require('./alpha.js');

module.exports = function MDE_Encrypt(data) {
  let data_vector = [];
  for (let i = 0; i < data.length; i++) {
    data_vector.push(ALPHA.indexOf(data[i]));
  }
  
  let key = [];
  for (let i = 0; i < data.length; i++) {
    key[i] = new Array(data.length).fill(0);
    for (let j = 0; j < data.length; j++) {
      key[i][j] = Math.floor(Math.random()*(ALPHA.length-CHARS.length));
    }
  }
  
  let data_matrix = new Matrix(data.length, 1);
  data_matrix.set([... data_vector.map(x => [x])]);

  let key_matrix = new Matrix(data.length, data.length);  
  key_matrix.set(key);

  
  let enc = Matrix.mult(key_matrix, data_matrix).matrix;
  let enc_data = [];

  enc.forEach(row => {
    row.forEach(char => {
      enc_data.push(char);
    });
  });

  return {
    enc: to_buffer(enc_data),
    key: to_ascii(key_matrix)
  }
}