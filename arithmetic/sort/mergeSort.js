/**
 * 归并排序
 * 利用分治的思想和递归的编程方式，把需要排序的数组不断的从中间分成2部分，然后对这2部分进行排序。再分别将排序好的2个分组再合并到一起。
 * 把问题分解成一个个小问题，小问题解决了 大问题也就解决。
 * mergeSort(p...r) = merge(mergeSort(A[p], A[q]), mergeSort(A[q], A[r-1]))
 */
let sum = 0;
function mergeSort(arr){
 return mergeSplit(arr);
}
function mergeSplit(arr){
  if(arr.length === 1) {
    return arr;
  }
  const mid = Math.floor(arr.length/2);
  const left = arr.slice(0,mid);
  const right = arr.slice(mid);
  return merge(mergeSplit(left),mergeSplit(right))
}

function merge(a,b){
  const c = [];
  let i = 0;
  let j = 0;
  while(i < a.length && j < b.length) {
    if(a[i] < b[j]) {
      c.push(a[i]);
      i++
    } else {
      c.push(b[j]);
      j++
    }
  }
  while(j < b.length) {
    c.push(b[j])
    j++
  }

  while(i < a.length) {
    c.push(a[i])
    i++
  }
  return c;
}
console.log(mergeSort([6,5,4,3,2,1]));
console.log(sum)
