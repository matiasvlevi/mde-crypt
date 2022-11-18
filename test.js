
const { MDE_Encrypt, MDE_Decrypt } = require('./src/index.js');

let data = MDE_Encrypt("HELLO WORLD");

console.log(data);

let dec = MDE_Decrypt(data.enc, data.key);

console.log(dec);
