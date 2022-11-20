#!/usr/bin/env node
const { encrypt } = require('./enc.js');
const { decrypt } = require('./dec.js');
const {readFileSync, existsSync} = require('node:fs');

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
      
      let data;
      if (existsSync(config.input.value)) {
        data = readFileSync(config.input.value, 'utf-8');
      } else {
        data = process.argv[3];
      }
      
      encrypt({
        raw_data: data,
        enc_dest: (config.output) ? config.output.value : "enc.mde",
        key_data: (config.key) ? config.key.value : undefined,
        key_size: (config.size) ? +config.size.value : undefined
      });
    }
  },
  'dec': {
    main: (config) => {
      decrypt({
        enc_src: (config.input) ? config.input.value : "enc.mde",
        dec_dest: (config.output) ? config.output.value : undefined,
        key_data: (config.key) ? config.key.value : "mde_key.txt",
        key_size: (config.size) ? +config.size.value : 6
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

  while (call.args.length >= 2) {

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

execOptions(
  parseOptions(
    getArgs()
  )
);

