const { Matrix } = require('dannjs');

const { to_buffer } = require('./utils.js');
const { ALPHA, CHARS, to_ascii } = require('./alpha.js');


function to_square_m(data, N) {

  if (data.length > N*N) {
    console.log("Wrong dimension array");
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

function MDE_Encrypt(data, key_size = 3) {
  let data_vector = [];
  for (let i = 0; i < data.length; i++) {
    data_vector.push(ALPHA.indexOf(data[i]));
  }

  let key = [];
  for (let i = 0; i < key_size; i++) {
    key[i] = new Array(key_size).fill(0);
    for (let j = 0; j < key_size; j++) {
      key[i][j] = Math.floor(Math.random()*(ALPHA.length-CHARS.length));
    }
  }
  

  let seg_count = Math.ceil(data.length / (key_size * key_size));

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
    enc_matrices.push(
     Matrix.mult(data_matrices[i], key_matrix).matrix
    );
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
