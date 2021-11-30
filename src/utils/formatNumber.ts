export default function formatNumber(num: number): string {
  if (num < 0) {
    return '-' + formatNumber(num * -1);
  } else if (num < 1000) {
    if (num % 1 === 0) return num.toString();

    const int = Math.floor(num);
    const decimal = num.toString().split('.')[1];

    return int + '.' + decimal.slice(0, 2);
  } else if (num >= 1_000_000_000_000) {
    return formatNumber(num / 1_000_000_000_000) + 'T';
  } else if (num >= 1_000_000_000) {
    return formatNumber(num / 1_000_000_000) + 'B';
  } else if (num >= 1_000_000) {
    return formatNumber(num / 1_000_000) + 'M';
  } else {
    return formatNumber(num / 1000) + 'k';
  }
}