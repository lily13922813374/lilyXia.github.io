import MinHeap from './minHeap';

export default class MaxHeap extends MinHeap {
  constructor () {
    super()
  }
  protected compare(a: number, b: number) {
    return a < b
  }
}