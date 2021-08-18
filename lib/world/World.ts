import { Vect2d } from "./Vect2d";
import { WObject } from "./WObject";
import { WPlayer } from "./WPlayer";
import { WPhysicalObject } from './WPhysicalObject';
import { WCamera } from './WCamera';
import _ from "lodash";


export type Vect1d = number

export class Stack<T> {
  private elems: Set<T> = new Set()
  private elemsList: T[] = []
  private positions: Map<T, number> = new Map()
  private lastPosition: number = -1

  add(elem: T) {
    if(this.elems.has(elem)) {
      return
    }

    this.elems.add(elem)
    this.elemsList.push(elem)
    this.positions.set(elem, this.lastPosition++)
  }

  topElem(): T {
    return this.elemsList[this.lastPosition]
  }

  remove(elem: T) {
    if(! this.elems.has(elem)) {
      throw new Error(`Stack: no such elem: ${JSON.stringify(elem)}`)
    }

    this.elems.delete(elem)
    this.positions.delete(elem)
    this.resetStack()
  }

  private resetStack() {
    const _elems: T[] = []
    for(let [elem, position] of this.positions) {
      _elems.push(elem)
    }
      
    this.elemsList = []
    this.elems.clear()
    this.positions.clear()
    this.lastPosition = -1;

    for(const elem of _elems) {
      this.add(elem)
    }
  }
}

export class World {
  public width = 100
  public height = 30
  public size: number

  private objects: WPhysicalObject[] = []
  private map: Array<Stack<WPhysicalObject>>

  private revMap: Map<WPhysicalObject, Vect1d> = new Map()
  private revObjects: Map<WPhysicalObject, number> = new Map()


  constructor() {
    this.size = this.width * this.height
    this.map = new Array<Stack<WPhysicalObject>>(this.size)
    
    for(let i = 0; i < this.size; i++) {
      this.map[i] = new Stack()
    }

    Object.seal(this)
  }

  addPlayer(pos: Vect2d): WPlayer {
    const player = new WPlayer(pos)
    this.addObject(player)
    return player
  }

  addCamera(pos: Vect2d, halfSize: Vect2d): WCamera {
    const camera = new WCamera(pos, halfSize, this)
    this.addObject(camera)
    return camera
  }

  move(obj: WPhysicalObject, to: Vect2d): void {
    const revMapPos = this.revMap.get(obj)
    if(typeof revMapPos === 'undefined') {
      throw new Error(`Object not added to map: ${JSON.stringify(obj)}`)
    }
    obj.internal_for_world_move(to)

    this.map[revMapPos].remove(obj)
    this.map[to[0] + this.height * to[1]].add(obj)
  }

  private addObject(wobject: WPhysicalObject) {
    this.objects.push(wobject)
    const [x, y] = wobject.pos

    const i = y*this.width + x
    this.map[i].add(wobject)

    this.revObjects.set(wobject, this.objects.length - 1)
    this.revMap.set(wobject, i)
  }

  public internal_getMapForCamera(): Array<Stack<WPhysicalObject>> {
    return this.map
  }
}