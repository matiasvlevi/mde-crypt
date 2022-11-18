
const { MDE_Encrypt, MDE_Decrypt } = require('./src/index.js');

let data = MDE_Encrypt(process.argv[2] || "Hello");
console.log(data);
console.log(MDE_Decrypt(data.enc, data.key));
