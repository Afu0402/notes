
/**
 * 插入排序
 * 将数组的第一个元素认为是有序组，取 i+1一个元素和前面的元素做对比,直到找到该元素正确的插入位置
 * 
 */


function insertSort(a) {
  const n = a.length;
  if(n === 0) return;
  for(let i=1; i<n;i++) {
    let value = a[i];
    let j;
    for(j = i - 1; j >= 0; j--) {
      if(a[j] > value){
          a[j+1] = a[j];
      } else {
        break;
      }
    }
    a[j+1] = value;
  }
}

const testData = [4,5,6,1];
insertSort(testData)
console.log(testData)

debugger
