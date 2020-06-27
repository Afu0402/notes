
/**
 * 
 * @param {*} arr 待排序数组
 * @param {Boolean} positive true == 正序 fasle == 倒序
 *  快速排序：
 *  利用分治的思想把数组分成三部分。
 * @method partition
 *  随机选择数组的一个数 arr[q] （pivot），然后循环数组跟q进行比较，把小的放左边，大的放右边,
 *  arr[0...q - 1] arr[q] arr[q+1 - r]
 * 最后返回pivot的坐标；
 * @method quickSortAssist
 *  根据 partition 返回的坐标值 q;递归调用自身
 *  quickSortAssist(arr,0,q-1)
 *  quickSortAssist(arr,q+1,r)
 *  递归的终止条件就是当区间 p >= r的时候停止
 * 
 *   
 */
function quickSort(arr, positive = true) {
  quickSortAssist(arr, 0, arr.length - 1, positive)
}

function quickSortAssist(arr, p, r, positive) {
  if (p >= r) {
    return
  }

  let q = partition(arr, p, r, positive);
  quickSortAssist(arr, p, q - 1, positive)
  quickSortAssist(arr, q + 1, r, positive)
}

function partition(arr, p, r, positive = true) {
  const pivot = arr[r];
  let i = p;
  for (let j = i; j < r; j++) {
    if (positive) {
      if (arr[j] < pivot) {
        swap(arr, i, j);
        i+=1
      }
    } else {
      if (arr[j] > pivot) {
        swap(arr, i, j)
         i+=1
      }
    }
  }
  swap(arr, i, r);
  return i;
}


function swap(arr, i, j) {
  /**
   * swap
   * 交互数组元素的位置；
   */
  const tmp = arr[i];
  arr[i] = arr[j]
  arr[j] = tmp;
}
let a = [4,2,5,12,3,10]


/**
 * 在一个无序的数组中找到第k大元素
 * 主要是通过分治的思想去找到这个元素，
 * 利用快速排序的思想去找。
 * 唯一不同的是在查找第k大元素的时候，把比pivot大的元素放左边；
 * 这样就可以方便的通过 pivot的元素位置 + 1去跟k做对比；
 * 比如 在 [4,2,5,12,3,10]查找元素第 2 大元素；
 * 通过分区后当pivot的值是 10 的时候 那么他左边的元素一定是大于他的元素的集合
 * [12, 10, 5, 4, 3, 2]
 * 但因为我们循环是从0开始的，所以 p + 1 才是真实的与k做对比的元素； 就是 P + 1 === k; 也就是
 * 数组下标 1 + 1 = 2 第2大元素就是10；
 * p + 1就是在元素中第几大的元素；
 * 那k > q+1 就证明 第k大的元素出现在 q+1...r之间 反之就是出现在p ... q-1之间；
 * 
 * 
 * 
 * @param {*} arr 
 * @param {*} k 
 */
function findKnum(arr,k) {
   if(k > arr.length) {
     return -1;
   }
   let end = arr.length - 1;
   let q = partition(arr,0,end ,false);
   while(q+1 !== k) {
     if(k > q+1) {
       q = partition(arr,q+1,end,false);
     } else {
       q = partition(arr,0,q - 1,false);
     }
   }
 
   return arr[q]
}
let k = findKnum(a,3)