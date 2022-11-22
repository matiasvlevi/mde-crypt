const MDE = require('../src/index');
const data = MDE.Decrypt('enc', process.argv[2]);
console.log(data);
