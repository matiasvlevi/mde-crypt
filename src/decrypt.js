const { Matrix } = require('dannjs');
const { inv } = require('mathjs');
const { to_square_m } = require('./encrypt.js');
const { from_buffer, unvalid_key } = require('./utils.js');
const { ALPHA, arr_to_ascii } = require('./alpha.js');
const Keygen = require('./keygen.js');

const Debug = require('./debug.js');

function MDE_Decrypt(buf_data, key_str) {
  if (unvalid_key(key_str)) return;

  const key = Keygen.ascii_to_key_matrix(key_str);

  const key_size = key.length;

  let data = from_buffer(buf_data);

  Debug.log('Buffer input:', buf_data);
  Debug.log('Buffer filtered:', data);

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

  let key_matrix = new Matrix(key_size, key_size);  
  key_matrix.set(inv(key));

  let out_matrices = [];

  for (let i = 0; i < seg_count; i++) {
    let m = 
      Matrix.mult(data_matrices[i], key_matrix);

    m.map(m => (Math.round(m) % ALPHA.length));

    Debug.log('Data mat ', i, m.matrix);
      
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

module.exports = { MDE_Decrypt };
