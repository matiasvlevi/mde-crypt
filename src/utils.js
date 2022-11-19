
function split2(arr) {
  let ans = [];
  for (let i = 0; i < arr.length; i+=2) {
    ans.push(arr[i] + arr[i+1]);
  }
  return ans;
}

function hex32(val) {
    val &= 0xFFFFFFFF;
    let hex = val.toString(16).toUpperCase();
    let str = ("00000000" + hex).slice(-8);
    return new Uint8Array(split2(str).map(x => parseInt(x, 16))); 

}

function dd(val) {
  return ("00" + val).slice(-2);
}

function from_buffer(buf) {
  let ans = [];
  for (let i = 0; i < buf.length; i+=4) {
    ans.push(parseInt(
      dd(buf[i].toString(16)) +
      dd(buf[i+1].toString(16)) +
      dd(buf[i+2].toString(16)) +
      dd(buf[i+3].toString(16))
    ,16));
  }
  return ans;
}

function to_buffer(values) {
  let ans = new Uint8Array(values.length * 4);
  let k = 0;
  for (let i = 0; i < values.length; i++) {
    let val = values[i];
    val &= 0xFFFFFFFF;
    let hex = val.toString(16).toUpperCase();
    let str = ("00000000" + hex).slice(-8);

    split2(str).forEach((x,j) => {
      ans[k] = parseInt(x, 16);
      k++;
    }); 
  }
  return Buffer.from(ans);
}


module.exports = {
  to_buffer, from_buffer,
  dd,
  hex32,
  split2
}
