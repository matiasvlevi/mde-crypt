function get_range_ascii(min, max) {
  let text = ""; for (let i = min; i <= max; i++) {
    text += String.fromCharCode(i);
  }; return text;
}
const ALPHA = get_range_ascii(0, 127);



function arr_to_ascii(arr, table = ALPHA) {
  let text = "";

  arr.forEach((char) => {
     
    if (table[Math.round(char)] !== undefined && Math.round(char) !== 0) {
      text += table[Math.round(char)];
    }

  });

  return text;
}

function to_ascii(m, table = ALPHA) {
  let text = "";
  m.matrix.forEach((row) => {
    row.forEach((char) => {
      if (Math.round(char-1) >= table.length || Math.round(char-1) < 0) {
        text += table[Math.abs((Math.round(char)-1) % table.length)];
      } else {
        text += table[Math.round(char)-1];
      }
    });
  })
  return text;
}

module.exports = { ALPHA, to_ascii, arr_to_ascii, get_range_ascii };
