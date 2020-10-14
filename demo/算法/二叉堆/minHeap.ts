export default class MinHeap {
  protected heap: Array<number>
  constructor () {
    this.heap = []
  }
  /* 私有方法 */
  protected getLeftIndex (index: number) {
    // 访问左子节点
    return 2 * index + 1
  } 
  protected getRightIndex (index: number) {
    // 访问右子节点
    return 2 * index + 2
  } 
  protected getParentIndex (index: number) {
    return Math.floor((index - 1) / 2)
  }
  protected preTraverseNode (index: number, cb: (value: number) => void) {
    // 先序遍历实体函数
    // if (this.heap[index] !== undefined) {
    //   cb(this.heap[index])
    //   this.preTraverseNode(this.getLeftIndex(index), cb)
    //   this.preTraverseNode(this.getRightIndex(index), cb)
    // }
  }
  protected compare(a: number, b: number) {
    return a >= b
  }
  protected swap (arr: any[], i: number, j: number) {
    if (i < 0 || i >= arr.length || j < 0 || j >= arr.length) {
      throw new Error('索引越界')
    }
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp
  }
  protected siftUp (index: number) {
    // 将这个值与父节点交换，直到父节点小于这个插入的值
    let parent = this.getParentIndex(index);
    while(index > 0 && this.compare(this.heap[parent], this.heap[index])) {
      this.swap(this.heap, index, parent);
      index = parent;
      parent = this.getParentIndex(index)
    }
  }
  // 向下冒泡
  protected siftDown (index: number) {
    const size = this.size()
    if (this.isEmpty()) {
      return 
    }
    if (size === 1) {
      return this.heap[0]
    }
    let min = null;
    let left = this.getLeftIndex(index);
    let right = this.getRightIndex(index);
    if (left < size && this.compare(this.heap[index], this.heap[left])) {
      min = left
    }
    if (right < size && this.compare(this.heap[index], this.heap[right])) {
      min = right
    }
    if (min !== index) {
      this.swap(this.heap, index, min)
      this.siftDown(min)
    }
  }
  insert(num: number) {
    if (isNaN(num)) {
      this.heap.push(num)
      this.siftUp(this.heap.length - 1)
      return true
    }
    return false
  }
  // 移除最小值(最小堆),并返回
  extract () {
    if (this.isEmpty()) return undefined
    if (this.size() === 1) return this.heap[0]
    const removeValue = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.siftDown(0);
    return removeValue;
  }
  findMinimum () {
    return this.isEmpty() ? undefined : this.heap[0]
  }
  isEmpty () {
   return this.heap.length === 0
  }
  size () {
    return this.heap.length
  }
  preTraverse(cb: (value: number) => void) {
    //先序遍历
    this.preTraverseNode(0, cb)
  }
}