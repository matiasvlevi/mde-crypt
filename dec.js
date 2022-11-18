#!/usr/bin/env node

const { readFile } = require('node:fs');

const { Decrypt } = require('./src/index');
const { encrypt } = require('./enc.js');

var stdin = process.openStdin();

var key = '';

stdin.on('data', function(chunk) {
  
  let c;
  let str = chunk.toString();
  

  while (str.includes('\n')) 
    str = str.replace('\n','');
  
  key += str;

});

if(process.argv[2] == "enc") {
    encrypt();
}

stdin.on('end', function() {
  if (key.length == 0) return;
  if (process.argv[2] == "dec") {
      const config = {
        raw_key: (key.length>0) ? key : new Array(36).fill(0).join(''),
        enc_src: process.argv[3] || "encrypted_data.mde",
      };
      readFile(config.enc_src, (err, data) => {
        if (err) throw err;
        const dec = Decrypt(
          data,
          config.raw_key,
          Math.sqrt(config.raw_key.length)
        );

        console.log(`${dec.data}`);
      });
  } else {
    process.exit();
  } 


});


