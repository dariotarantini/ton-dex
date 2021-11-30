export default function renderPercentage(n: number) {
  if (n < .01) return '<0.01';
  else if (n > 100) return '100' 
  else return n.toFixed(2);
}