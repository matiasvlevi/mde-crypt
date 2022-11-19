function getRangeAscii(min, max) {
  let text = ""; for (let i = min; i <= max; i++) {
    text += String.fromCharCode(i);
  }; return text;
}
const INVALID = "\xEF";
const CHARS = " \n|!@#$%^&*(){}[]:;\"\'.,<>/?";
const ALPHA = INVALID + CHARS + getRangeAscii(65, 90) +
              getRangeAscii(97, 122) +
              getRangeAscii(48, 57);

function arr_to_ascii(arr) {
  let text = "";

  arr.forEach((char) => {
     
    if (ALPHA[Math.round(char)] !== undefined && Math.round(char) !== 0) {
      text += ALPHA[Math.round(char)];
    }

  });

  return text;
}

function to_ascii(m) {
  let text = "";
  m.matrix.forEach((row) => {
    row.forEach((char) => {
      if (Math.round(char-1) >= ALPHA.length || Math.round(char-1) < 0) {
        text += ALPHA[Math.abs((Math.round(char)-1) % ALPHA.length)];
      } else {
        text += ALPHA[Math.round(char)-1];
      }
    });
  })
  return text;
}

module.exports = { ALPHA, CHARS, to_ascii, arr_to_ascii };
