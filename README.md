# mde_crypt

Encrypt data with matrix dot product. 


This is a prototype planned to be implemented as a parallelised cuno module

# Install

```
npm i -g mde_crypt
```

# CLI

### Encrypt


ex: encrypt `my_text.txt` with 8 by 8 matrices and output to `my_enc.mde`, read key from `key.txt` and generate a key if none found

```
mde enc -i my_text.txt -o my_enc.mde -k key.txt -s 8
```

### Decrypt

decrypt `my_enc.mde` to stdout

```
mde dec -i my_enc.mde -k key.txt
```

# API

the package need to be installed as a non-global `npm i mde_crypt`

### Encrypting

```js
const MDE = require('mde_crypt');

// Encrypt 'Hello World' String with a new random key
const encrypted = MDE.Encrypt("Hello World", MDE.Keygen.random(3));

console.log(encrypted);
```

### Decrypting

```js
// Convert Ascii key to matrix key
let key = MDE.Keygen.ascii_to_key(encrypted.key);

// Decrypt
const recovered = MDE.Decrypt(encrypted.data, key);

console.log(recovered);
```
 
