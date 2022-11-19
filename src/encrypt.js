const { Matrix } = require('dannjs');

const { to_buffer } = require('./utils.js');
const { ALPHA, to_ascii } = require('./alpha.js');

const Debug = require('./debug.js');

function to_square_m(data, N) {

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
}


function MDE_Encrypt(data, key, key_size = 3) {
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
    enc: to_buffer(enc_data),
    key: to_ascii(key_matrix)
  }
}

module.exports = {MDE_Encrypt, to_square_m};
