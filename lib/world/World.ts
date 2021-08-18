import { Vect2d } from "./Vect2d";
import { WObject } from "./WObject";
import { WPlayer } from "./WPlayer";
import { WPhysicalObject } from './WPhysicalObject';
import { WCamera } from './WCamera';
import _ from "lodash";
import { Stack } from "./Stack";
import { log } from "./Logger";
import { vectAdd } from './util';


export type Vect1d = number

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

  addCamera({pos, halfSize}: {pos: Vect2d, halfSize: Vect2d}): WCamera {
    const camera = new WCamera(pos, halfSize, this)
    this.addObject(camera)
    return camera
  }

  move(wobject: WPhysicalObject, moveVector: Vect2d): void {
    const to = vectAdd(wobject.pos, moveVector)

    if(! this.isInside(to)) {
      log('cannot move', to, 'from', wobject.pos)
      return
    }

    const revMapIndex: Vect1d = this.revMap.get(wobject)

    if(typeof revMapIndex === 'undefined') {
      throw new Error(`Object not added to map: ${JSON.stringify(wobject)}`)
    }

    this.removeFromMap(wobject)
    wobject.internal_setPos(to)
    log('move', wobject.appearance.char, 'to', to)
    this.addToMap(wobject)
    wobject.internal_after_move()
  }

  isInside(pos: Vect2d) {
    const [x, y] = pos
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  getTopElement(pos: Vect2d): WPhysicalObject {
    if(! this.isInside(pos)) {
      return null
    }

    const [x, y] = pos
    const i = y*this.width + x
    return this.map[i].topElem()
  }

  private addObject(wobject: WPhysicalObject) {
    this.objects.push(wobject)
    this.addToMap(wobject)
    this.revObjects.set(wobject, this.objects.length - 1)
  }

  private addToMap(wobject: WPhysicalObject) {
    const [x, y] = wobject.pos
    const i = y*this.width + x
    this.map[i].add(wobject)
    this.revMap.set(wobject, i)
  }

  private removeFromMap(wobject: WPhysicalObject) {
    const [x, y] = wobject.pos
    const i = y*this.width + x
    this.map[i].remove(wobject)
    this.revMap.delete(wobject)
  }

  public internal_getMapForCamera(): Array<Stack<WPhysicalObject>> {
    return this.map
  }
}