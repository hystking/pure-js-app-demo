export default function shuffled(array){
  const keys = Object.keys(array);
  const dest = [];
  for(let k = 0, n = keys.length; k < array.length && n > 0; k += 1){
    const i = Math.random() * n | 0;
    const key = keys[i];
    dest.push(array[key]);
    n -= 1;
    const tmp = keys[n];
    keys[n] = key;
    keys[i] = tmp;
  }
  return dest;
};
