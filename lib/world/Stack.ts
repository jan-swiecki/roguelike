export class Stack<T> {
  private elems: Set<T> = new Set();
  private elemsList: T[] = [];
  private positions: Map<T, number> = new Map();
  private lastPosition: number = -1;

  add(elem: T) {
    if (this.elems.has(elem)) {
      return;
    }

    this.elems.add(elem);
    this.elemsList.push(elem);
    this.positions.set(elem, this.lastPosition++);
  }

  topElem(): T {
    return this.elemsList[this.lastPosition];
  }

  remove(elem: T) {
    if (!this.elems.has(elem)) {
      throw new Error(`Stack: no such elem: ${elem}`);
    }

    this.elems.delete(elem);
    this.positions.delete(elem);
    this.resetStack();
  }

  private resetStack() {
    const _elems: T[] = [];
    for (let [elem, position] of this.positions) {
      _elems.push(elem);
    }

    this.elemsList = [];
    this.elems.clear();
    this.positions.clear();
    this.lastPosition = -1;

    for (const elem of _elems) {
      this.add(elem);
    }
  }
}
