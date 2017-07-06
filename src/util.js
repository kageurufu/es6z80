export function zeroBuffer(buf, val = 0) {
  let i = buf.length;
  while (--i) {
    buf[i] = val;
  }
}

export function stringToBuffer(string) {
  return Uint8Array.from(Array.from(string).map(x => x.charCodeAt(0)));
}