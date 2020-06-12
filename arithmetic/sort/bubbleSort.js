/**
 * 冒泡排序；
 * 时间复杂度： O(n^2);
 * 对2个相邻的元素进行比较而后调换位置，每循环一次至少会调整一个元素到正确的位置，循环N次后就可以正确排序N个数据。
 * 优化点：
 * 如果某一次循环没有触发位置交换就证明数据已经排序完成无需进行剩下的循环
 * 
 * 
 * 
 */

function bubbleSort (data) {
  for(let i = 0; i < data.length; i++) {
    let flag = false; 
    for(let j = 0;j < data.length - 1; j++) {
      if(data[j] > data[j+1]) {
        let max = data[j];
        data[j] = data[j+1];
        data[j+1] = max;
        flag = true;
      }
    }
    if(!flag) {
      break;
    }
  }
}
// const testData = [4,5,6,3,2,1];
const testData = [3,5,4,1,2,6];
bubbleSort(testData);
console.log(testData)