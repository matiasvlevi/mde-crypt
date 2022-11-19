#!/usr/bin/env node
const { encrypt } = require('./enc.js');
const { decrypt } = require('./dec.js');
const {readFileSync} = require('node:fs');

function getArgs() {
  let raw_args = [...process.argv];
  raw_args.splice(0, 2);
  let cmd = raw_args.splice(0, 1)[0];
  
  return {
    cmd, args: raw_args
  }
}

function get_option(first_char) {
  const keys = Object.keys(OPTIONS);

  // If full word
  if (first_char.length > 1) {
    return { option_data: OPTIONS[first_char], option_key: first_char};
  }

  // If char
  for (let i = 0; i < keys.length; i++) {
    
    if (keys[i][0] === first_char) 
      return { option_data: OPTIONS[keys[i]], option_key: keys[i]};
  
  }

  return { type: 'invalid' };
}

const CMDS = {
  'enc' : {
    main: (config) => {
      encrypt({
        raw_data: readFileSync(config.input.value, 'utf-8'),
        enc_dest: config.output.value || "enc.mde",
        key_data: config.key.value,
        key_size: (config.size) ? config.size.value : 6
      });
    }
  },
  'dec': {
    main: (config) => {
      decrypt({
        enc_src: config.input.value || "enc.mde",
        key_data: config.key.value,
        key_size: (config.size) ? config.size.value : 6
      });
    }
  },
  'keygen': {
    main: () => {
      
    }
  }
}

const OPTIONS = {
  'input': {
    type: 'data',
    enc:()=>{

    },
    dec:()=>{

    }
  },
  'output': {
    type: 'data',
    enc:()=>{

    },
    dec:()=>{

    }
  },
  'key': {
    type: 'literal'
  },
  'size': {
    type: 'param'
  },
}


function replaceAll(text, segment, replacement) {
  let str = text;
  while(str.includes(segment)) {
    str = str.replace(segment, replacement);
  }
  return str;
}

function parseOptions(_call) {
  let call = {..._call};
  let config = {
    cmd: call.cmd
  };

  while (call.args.length > 0) {
    let opt_pair = call.args.splice(0, 2);
    
    let opt_name = replaceAll(opt_pair[0], '-', '');
    let { option_data, option_key } = get_option(opt_name);
    config[option_key] = option_data;
    config[option_key].value = opt_pair[1];

  }

  return config;
}


function execOptions(options) {
  CMDS[options.cmd].main(options);
}


execOptions(parseOptions(getArgs()));

// if(process.argv[2] === "enc") {
//   const config = {
//     raw_data: process.argv[3] || "Matrix Encrypted Data",
//     enc_dest: process.argv[4] || "encrypted_data.mde",
//     key_size: process.argv[5] || 6 
//   };
//   encrypt(config);
// } else if (process.argv[2] === "dec") {

//   decrypt();
// } 


