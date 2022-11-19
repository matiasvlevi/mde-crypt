const MDE = require('../src/index');

const key = MDE.Keygen.random(3);
const encrypted = MDE.Encrypt("Hello World", key);

console.log(encrypted);

const recovered = MDE.Decrypt(
  encrypted.data,
  MDE.Keygen.ascii_to_key(encrypted.key)
);

console.log(recovered);





