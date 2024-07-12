export function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

export function randomFromArray(array: any[]) {
  return array[Math.floor(Math.random() * array.length)]
}

export function randomIntFromInterval(min: number, max: number) { 
  return Math.floor(Math.random() * (max - min + 1) + min)
}