import { Vect2d } from './Vect2d';
import { WCreature } from './WCreature';
import { TAppearance, WPhysicalObject } from './WPhysicalObject';

export class WPlayer extends WCreature {
  constructor(pos: Vect2d) {
    super(pos, {
      color: '#00FF00',
      char: '@'
    })
  }
}