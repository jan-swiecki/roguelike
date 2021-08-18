import { Vect2d as Vect2d } from './Vect2d';
import { WCreature } from './WCreature';
import { TAppearance, WPhysicalObject } from './WPhysicalObject';
import { World } from './World';
import { Canvas } from '../Canvas';
import { Stream, Writable } from 'stream';
import { WriteStream } from 'tty';

export class WCamera extends WPhysicalObject {
  private halfSize: Vect2d;
  private size: Vect2d;
  private width: number;
  private height: number;
  private nsize: number;
  private center: Vect2d;
  
  private world: World;
  private worldMap: Array<Stack<WPhysicalObject>>
  
  private canvas: Canvas;
  private stream: WriteStream;
  

  constructor(pos: Vect2d, halfSize: Vect2d, world: World) {
    super(pos, {
      color: '#0000FF',
      char: 'C'
    })
    this.halfSize = halfSize
    this.size = [2*halfSize[0] + 1, 2*halfSize[1] + 1]
    this.nsize = this.size[0]*this.size[1]
    this.width = this.size[0]
    this.height = this.size[1]
    this.center = [halfSize[0], halfSize[1]]
    this.world = world
    this.worldMap = world.internal_getMapForCamera()
  }

  attachCanvas(canvas: Canvas) {
    this.canvas = canvas
    this.stream = canvas.getStream()
  }

  drawIntoCanvas() {
    // let x = -this.halfSize[0] + this.pos[0];
    // let y = -this.halfSize[1] + this.pos[1];
    // let i: number

    // const mx = this.halfSize[0] + this.pos[0]
    // const my = this.halfSize[1] + this.pos[1]
    // for(; x < mx; x++) {
    //   for(; y < my; y++) {
    //     // const obj = this.worldMap
    //     this.stream.write('#')
    //     if(x === this.width-1) {
    //       this.stream.write('\n')
    //     }
    //   }
    // }

    if(! this.canvas) {
      throw new Error("WCamera: You must attach canvas first")
    }

    let x = 0;
    let y = 0;
    let i = 0;

    this.stream.cursorTo(0, 0)
    this.stream.clearScreenDown()

    for(; i < this.nsize; i++) {
      x = i % this.width
      y = Math.floor(i / this.width)
      this.stream.write(this.getCharAt(x, y))
      if(x === this.width-1) {
        this.stream.write('\n')
      }
    }
  }

  getCharAt(x: number, y: number): string {
    const xc = [x, y]
    const cc = this.center
    const cw = this.pos

    // cw - (cc - xc)
    const worldPosX = cw[0] - cc[0] + xc[0]
    const worldPosY = cw[1] - cc[1] + xc[1]

    const iWorld = this.world.height * worldPosY + worldPosX

    if(iWorld < 0 || iWorld >= this.world.size) {
      return 'X'
    } else {
      const obj = this.worldMap[iWorld]
      if(obj) {
        return obj.appearance.char
      } else {
        return '.'
      }
    }
  }
}