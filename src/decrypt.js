const { Matrix } = require('dannjs');
const { inv } = require('mathjs');
const { to_square_m } = require('./encrypt.js');
const { from_buffer } = require('./utils.js');
const { ALPHA, arr_to_ascii } = require('./alpha.js');


module.exports = function MDE_Decrypt(buf_data, key, key_size = 3) {

  let data = from_buffer(buf_data);

  let seg_count = Math.ceil(data.length / (key_size * key_size));
  let data_matrices = [];

  for (let i = 0; i < data.length; i+=(key_size * key_size)) {
    let data_matrix = new Matrix(key_size, key_size);
    let end_index = i + (key_size * key_size);
    data_matrix.set(
      to_square_m(data.slice(
        i, (end_index >= data.length) ? 
          data.length :
          end_index
      ), key_size).matrix
    );

    data_matrices.push(data_matrix);
  }


  let key_ = [];
  for (let i = 0; i < key_size; i++) {
    key_[i] = [];
    for (let j = 0; j < key_size; j++) {
      key_[i][j] = ALPHA.indexOf(key[i * key_size + j]);
    }
  }

  let key_matrix = new Matrix(key_size, key_size);  
  key_matrix.set(inv(key_));

  let out_matrices = [];

  for (let i = 0; i < seg_count; i++) {
    let m = 
      Matrix.mult(data_matrices[i], key_matrix);

    let data_arr = [];
    m.matrix.forEach(r => {
      r.forEach(c => {
        data_arr.push(c);
      })
    })

    out_matrices.push(
      data_arr
    );
  }
  let out = [].concat(...out_matrices);

  return {
    data: arr_to_ascii(out),
  }
}
