
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

