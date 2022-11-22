const { Matrix } = require('dannjs');
const Keygen = require('./keygen.js');
const { to_buffer, unvalid_key, to_square_m, BUFFER_MAP } = require('./utils.js');
const { to_ascii, ALPHA } = require('./alpha.js');

const Debug = require('./debug.js');

function MDE_Encrypt(data, key_str) {

  if (key_str !== undefined) {
    if (unvalid_key(key_str)) {
      key_str = Keygen.random(8);    
    }
  } else {
   key_str = Keygen.random(8);
  }

  const key = Keygen.keycode_to_key_matrix(
    Keygen.from_keycode_to_uintarr(key_str)
  );

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
    data: to_buffer(enc_data, BUFFER_MAP),
    key: key_str
  }
}

module.exports = {MDE_Encrypt, to_square_m};
