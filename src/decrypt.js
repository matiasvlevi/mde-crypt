const { Matrix } = require('dannjs');
const { inv } = require('mathjs');

const { from_buffer } = require('./utils.js');
const { ALPHA, to_ascii } = require('./alpha.js');

module.exports = function MDE_Decrypt(data, key) {

  let _data = from_buffer(data).map(x => [x]);

  let data_matrix = new Matrix();
  data_matrix.set(_data);

  let key_ = [];
  for (let i = 0; i < data_matrix.rows; i++) {
    key_[i] = [];
    for (let j = 0; j < data_matrix.rows; j++) {
      key_[i][j] = ALPHA.indexOf(key[i * data_matrix.rows + j]);
    }
  }

  let inv_key_matrix = new Matrix(data.length, data.length);  
  inv_key_matrix.set(inv(key_));

  return {
    data: to_ascii(Matrix.mult(inv_key_matrix, data_matrix)),
  }
}