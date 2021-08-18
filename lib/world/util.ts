import { Vect2d } from './Vect2d';

export function vectAdd(v1: Vect2d, v2: Vect2d) {
  return [v1[0] + v2[0], v1[1] + v2[1]]
}

export function vectSubtract(v1: Vect2d, v2: Vect2d) {
  return [v1[0] - v2[0], v1[1] - v2[1]]
}

export function vectAbsDiff(v1: Vect2d, v2: Vect2d) {
  return [Math.abs(v1[0] - v2[0]), Math.abs(v1[1] - v2[1])]
}