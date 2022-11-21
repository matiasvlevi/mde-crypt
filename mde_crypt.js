// MUST INCLUDE https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.4.0/math.min.js
// MUST INCLUDE https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.4.0/math.min.js

const MDE = {
  arr_to_ascii: function (arr) {
    let text = "";
  
    arr.forEach((char) => {
       
      if (MDE.Keygen.ALPHA[Math.round(char)] !== undefined && Math.round(char) !== 0) {
        text += MDE.Keygen.ALPHA[Math.round(char)];
      }
  
    });
  
    return text;
  },
  to_ascii: function (m) {
    let text = "";
    m.matrix.forEach((row) => {
      row.forEach((char) => {
        if (Math.round(char-1) >= MDE.Keygen.ALPHA.length || Math.round(char-1) < 0) {
          text += MDE.Keygen.ALPHA[Math.abs((Math.round(char)-1) % MDE.Keygen.ALPHA.length)];
        } else {
          text += MDE.Keygen.ALPHA[Math.round(char)-1];
        }
      });
    })
    return text;
  }
};



MDE.Utils = {
  unvalid_key : function (key_str) {
    let n_length_mod = Math.sqrt(key_str.length) % 2;
  
    if (
      n_length_mod !== 1 &&
      n_length_mod !== 0
    ) {
      Debug.error("Key must be a square length ex: 4, 9, 16, 25, 36 ...");
      return true;
    } 
  
    return false;
  },
  
  split2: function (arr) {
    let ans = [];
    for (let i = 0; i < arr.length; i+=2) {
      ans.push(arr[i] + arr[i+1]);
    }
    return ans;
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
  
  hex32:function (val) {
      val &= 0xFFFFFFFF;
      let hex = val.toString(16).toUpperCase();
      let str = ("00000000" + hex).slice(-8);
      return new Uint8Array(MDE.Utils.split2(str).map(x => parseInt(x, 16))); 
  
  },
  
  dd: function(val) {
    return ("00" + val).slice(-2);
  },
  
  from_buffer: function(buf) {
    // NODEJS BUFFER SKIP
    return buf;
  },
  
  to_buffer: function(values) {
    // NODEJS BUFFER SKIP
    return values;
  }
  
}

MDE.Keygen = {
  random_matrix: function (key_size) {
    let key = [];
    for (let i = 0; i < key_size; i++) {
      key[i] = new Array(key_size).fill(0);
      for (let j = 0; j < key_size; j++) {
        key[i][j] = Math.floor(
          Math.random() *
          (MDE.Keygen.ALPHA.length - MDE.Keygen.CHARS.length - 1) +
          (MDE.Keygen.CHARS.length + 2)
        );
      }
    }
    return key;
  },
  random: function (key_size) {
    let key = "";
    for (let i = 0; i < key_size * key_size; i++) {
        key += MDE.Keygen.ALPHA[Math.floor(
          Math.random() *
          (MDE.Keygen.ALPHA.length - MDE.Keygen.CHARS.length - 1) +
          (MDE.Keygen.CHARS.length + 1)
        )];
    }
    return key;
  },
  ascii_to_key_matrix: function (key_str) {
    let key_size = Math.sqrt(key_str.length);
    let key = [];
    for (let i = 0; i < key_size; i++) {
      key[i] = new Array(key_size).fill(0);
      
      for (let j = 0; j < key_size; j++) {
  
        key[i][j] = MDE.Keygen.ALPHA.indexOf(key_str[i * key_size + j])+1;
      }
    }
    return key;  
  },
  parse_key: function (content) {
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
    return MDE.Keygen.random(8);
  },

  getRangeAscii: function (min, max) {
    let text = ""; for (let i = min; i <= max; i++) {
      text += String.fromCharCode(i);
    }; return text;
  },
  HEADER: "--- KEY START ---\n",
  FOOTER: "\n---  KEY END  ---",
  INVALID: "\xEF",
  CHARS: " \n|!@#$%^&*(){}[]:;\"\'.,<>/?-+=_~`",
}

MDE.Keygen.ALPHA =
  MDE.Keygen.INVALID + 
  MDE.Keygen.CHARS + 
  MDE.Keygen.getRangeAscii(65, 90) +
  MDE.Keygen.getRangeAscii(97, 122) +
  MDE.Keygen.getRangeAscii(48, 57)


MDE.Encrypt = function (data, key_str) {

  if (key_str !== undefined) {
    if (MDE.Utils.unvalid_key(key_str)) {
      key_str = MDE.Keygen.random(8);    
    }
  } else {
   key_str = MDE.Keygen.random(8);
  }

  
  key = MDE.Keygen.ascii_to_key_matrix(key_str);

  let key_size = key.length;
  let data_vector = [];
  for (let i = 0; i < data.length; i++) {
    data_vector.push(MDE.Keygen.ALPHA.indexOf(data[i]));
  }

  let seg_count = Math.ceil(data.length / (key_size * key_size));

  let data_matrices = [];
  for (let i = 0; i < data_vector.length; i+=(key_size*key_size)) {
    let data_matrix = new Matrix(key_size, key_size);
    let end_index =  i+(key_size*key_size);
    
    data_matrix.set(
      MDE.Utils.to_square_m(data_vector.slice(
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
    data: MDE.Utils.to_buffer(enc_data),
    key: MDE.to_ascii(key_matrix)
  }
}

MDE.Decrypt = function (buf_data, key_str) {
  if (MDE.Utils.unvalid_key(key_str)) return;

  const key = MDE.Keygen.ascii_to_key_matrix(key_str);

  const key_size = key.length;

  let data = MDE.Utils.from_buffer(buf_data);

  let seg_count = Math.ceil(data.length / (key_size * key_size));
  let data_matrices = [];

  for (let i = 0; i < data.length; i+=(key_size * key_size)) {
    let data_matrix = new Matrix(key_size, key_size);
    let end_index = i + (key_size * key_size);
    data_matrix.set(
      MDE.Utils.to_square_m(data.slice(
        i, (end_index >= data.length) ? 
          data.length :
          end_index
      ), key_size).matrix
    );

    data_matrices.push(data_matrix);
  }

  let key_matrix = new Matrix(key_size, key_size);  
  key_matrix.set(math.inv(key));

  let out_matrices = [];

  for (let i = 0; i < seg_count; i++) {
    let m = 
      Matrix.mult(data_matrices[i], key_matrix);

    m.map(m => (Math.round(m) % MDE.Keygen.ALPHA.length));

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
    data: MDE.arr_to_ascii(out),
  }
}