function getRangeAscii(min, max) {
  let text = ""; for (let i = min; i <= max; i++) {
    text += String.fromCharCode(i);
  }; return text;
}

const CHARS = " ";
const ALPHA = getRangeAscii(65, 90) +
              getRangeAscii(97, 122) +
              getRangeAscii(48, 57) + CHARS;



function arr_to_ascii(arr) {
  let text = "";

  arr.forEach((char) => {
     
    if (ALPHA[Math.round(char)] !== undefined && Math.round(char) !== 0) {
      text += ALPHA[Math.round(char)];
    }

  });

  return text;
}

function to_ascii(matrix) {
  let text = "";
  matrix.matrix.forEach((row) => {
    row.forEach((char) => {
      if (Math.round(char) >= ALPHA.length || Math.round(char) < 0) {
        text += ALPHA[Math.abs(Math.round(char) % ALPHA.length)];

      if (ALPHA[Math.round(char)] === undefined) console.log(Math.round(char), char, Math.abs(Math.round(char) % 255))
      } else {
        text += ALPHA[Math.round(char)];
      }

    
    });
  })
  return text;
}

module.exports = { ALPHA, CHARS, to_ascii, arr_to_ascii };
