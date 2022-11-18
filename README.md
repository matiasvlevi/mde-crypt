

### Encryption:

```js
const { MDE_Encrypt, MDE_Decrypt } = require('mde_crypt');

let data = MDE_Encrypt("HELLO WORLD");

console.log(data);
/*

{
  enc: 'xxxx'
  key: 'yyyy'  
}

*/
```

### Decryption: 

```js
const { MDE_Encrypt, MDE_Decrypt } = require('mde_crypt');

let data = MDE_Decrypt(enc, key);

console.log(data);
/*

{
  data: 'HELLO WORLD' 
}

*/
```