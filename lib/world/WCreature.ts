import { Vect2d } from './Vect2d';
import { TAppearance, WPhysicalObject } from './WPhysicalObject';

export type THealth = {hp: number}

export class WCreature extends WPhysicalObject {
  health: THealth = {hp: 100}

  constructor(pos: Vect2d, appearance: TAppearance) {
    super(pos, appearance)
  }
}