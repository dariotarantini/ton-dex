function stringifyDecimal(decimal: number, digits: number) {
  let o = '';
  let s = decimal.toFixed(digits);
  let skipping = true;

  for (let i = s.length - 1; i >= 0; i--) {
    if (o === '0' && skipping) {
      continue;
    } else {
      skipping = false;
    }

    o = s[i] + o;
  }

  return +o;
}

export default function stringifyNumber(n: number) {
  if (n % 1 === 0) return n;
  if (n > 100) return Math.floor(n) + stringifyDecimal(n % 1, 2);
  if (n > 10) return Math.floor(n) + stringifyDecimal(n % 1, 3);
  if (n > 0.1) return Math.floor(n) + stringifyDecimal(n % 1, 4);
  if (n > 0.01) return Math.floor(n) + stringifyDecimal(n % 1, 5);
  if (n < 0.00001) return Math.floor(n) + stringifyDecimal(n % 1, 6);
  if (n < 0.000001) return 0;
  return n;
}