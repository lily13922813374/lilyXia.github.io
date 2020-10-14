import MinHeap from './minHeap';
import MaxHeap from './maxHeap';
export function firstHeapSort (arr: Array<number>, options: number = 1) {
  let res = []
  let Heap = new MinHeap()
  if (options === -1) {
    Heap = new MaxHeap
  }
  arr.forEach(item => Heap.insert(item))

  for (let i = 0; i < Heap.size(); i++) {
    res.push(Heap.extract())
  }
}