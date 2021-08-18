import { Vect2d } from './Vect2d';
import { WObject } from './WObject';


export type THexColor = string
export type TChar = string

export type TAppearance = {
  color: THexColor,
  char: TChar
}

export abstract class WPhysicalObject extends WObject {
  pos: Vect2d

  appearance: TAppearance

  constructor(pos: Vect2d, appearance: TAppearance) {
    super()
    this.pos = pos
    this.appearance = appearance
  }

  internal_for_world_move(to: Vect2d) {
    this.pos = to
  }
}