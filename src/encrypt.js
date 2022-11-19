const { Matrix } = require('dannjs');

const { to_buffer, to_square_m } = require('./utils.js');
const { ALPHA, to_ascii } = require('./alpha.js');

const Debug = require('./debug.js');




function MDE_Encrypt(data, key) {
  let key_size = key.length;
  let data_vector = [];
  for (let i = 0; i < data.length; i++) {
    data_vector.push(ALPHA.indexOf(data[i]));
  }

  let seg_count = Math.ceil(data.length / (key_size * key_size));

  Debug.log('key', key);

  let data_matrices = [];
  for (let i = 0; i < data_vector.length; i+=(key_size*key_size)) {
    let data_matrix = new Matrix(key_size, key_size);
    let end_index =  i+(key_size*key_size);
    
    data_matrix.set(
      to_square_m(data_vector.slice(
        i, (end_index >= data_vector.length) ? 
          data_vector.length :
          end_index
      ), key_size).matrix
    );

    data_matrices.push(data_matrix);
  }

  let key_matrix = new Matrix(key_size, key_size);  
  key_matrix.set(key);

  let enc_matrices = [];
  for (let i = 0; i < seg_count; i++) {
    let m = 
     Matrix.mult(data_matrices[i], key_matrix);

    enc_matrices.push(
      m.matrix
    );
    Debug.log('Enc mat', i, enc_matrices[i]);
  }

  let enc_data = [];

  enc_matrices.forEach(enc => {
    enc.forEach(row => {
      row.forEach(char => {
        enc_data.push(char);
      });
    });
  }) 

  return {
    data: to_buffer(enc_data),
    key: to_ascii(key_matrix)
  }
}

module.exports = {MDE_Encrypt, to_square_m};
