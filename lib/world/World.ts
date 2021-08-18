import { Vect2d } from "./Vect2d";
import { WObject } from "./WObject";
import { WPlayer } from "./WPlayer";
import { WPhysicalObject } from './WPhysicalObject';
import { WCamera } from './WCamera';
import _ from "lodash";
import { Stack } from "./Stack";


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

  addCamera(pos: Vect2d, halfSize: Vect2d): WCamera {
    const camera = new WCamera(pos, halfSize, this)
    this.addObject(camera)
    return camera
  }

  move(wobject: WPhysicalObject, to: Vect2d): void {
    if(! this.isInside(to)) {
      return
    }

    const revMapIndex: Vect1d = this.revMap.get(wobject)

    if(typeof revMapIndex === 'undefined') {
      throw new Error(`Object not added to map: ${JSON.stringify(wobject)}`)
    }

    // this.removeFromMap(wobject)
    wobject.internal_for_world_move(to)
    this.addToMap(wobject)
  }

  isInside(pos: Vect2d) {
    const [x, y] = pos
    const i = y*this.width + x
    return i >= 0 && i < this.size
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