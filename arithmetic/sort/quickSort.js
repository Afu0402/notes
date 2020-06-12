



function quickSort(array) {
  if(array.length < 2) {
    return array;
  }

  let pivot = array[0];
  const less = [];
  const max  =[];
  for(let i = 0;i<array.length; i++) {
    if(array[i] < pivot) {
      less.push(array[i])
    }
  }
  for(let i = 0;i<array.length; i++) {
    if(array[i] > pivot) {
      max.push(array[i])
    }
  }
  return [...quickSort(less),pivot,...quickSort(max)]


}
const a = [6,5,4,3,2,1];
const b = quickSort(a);
console.log(b)