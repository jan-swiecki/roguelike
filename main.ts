import { KeyHandler } from './lib/KeyHandler';
import { Canvas } from './lib/Canvas';
import { World } from './lib/world/World';
import logger from './lib/world/Logger';
import _ from 'lodash';



const keyHandler = new KeyHandler().run()
const canvas = new Canvas()

keyHandler.once('exit', () => {
  canvas.onExit()
})

canvas.init()
canvas.clear()
canvas.randomBuffer()
canvas.draw()

const world = new World()

world.addPlayer([10, 10])
const camera = world.addCamera({pos: [10, 5], halfSize: [50, 20]})
logger.addCamera(camera)

camera.attachCanvas(canvas)
camera.drawIntoCanvas()


const keys = {
  up: 8,
  down: 2,
  left: 4,
  right: 6,
  center: 5,
  topleft: 7,
  topright: 9,
  bottomleft: 1,
  bottomright: 3
}

// const bindArrow = (key, dx, dy) => keyHandler.bindCh(key, _.throttle(() => {
//   world.move(camera, [dx, dy])
// }, 25))

function promiseThrottle(getPromise: () => Promise<void>, callback: () => void): () => void {
  let waiting = false
  return async () => {
    if(waiting === false) {
      waiting = true
      try {
        await getPromise()
        callback()
      } finally {
        waiting = false
      }
    } else {
      // process.exit()
      // throttle / do nothing
    }
  }
}

function promiseThrottle2(callback: () => Promise<void>): () => void {
  let waiting = false
  let lastPromise: Promise<void> = Promise.resolve()
  return async () => {
    if(waiting === false) {
      waiting = true
      try {
        await lastPromise
        lastPromise = callback()
      } finally {
        waiting = false
      }
    } else {
      // process.exit()
      // throttle / do nothing
    }
  }
}

// const bindArrow = (key, dx, dy) => keyHandler.bindCh(key, promiseThrottle(() => camera.internal_renderPromise, () => {
//   world.move(camera, [dx, dy])
//   camera.drawIntoCanvas()
// }))
const bindArrow = (key, dx, dy) => keyHandler.bindCh(key, promiseThrottle2(() => {
  world.move(camera, [dx, dy])
  return camera.drawIntoCanvas()
}))

bindArrow(keys.up,           0, -1)
bindArrow(keys.down,         0,  1)
bindArrow(keys.left,        -1,  0)
bindArrow(keys.right,        1,  0)
bindArrow(keys.topleft,     -1, -1)
bindArrow(keys.topright,     1, -1)
bindArrow(keys.bottomleft,  -1,  1)
bindArrow(keys.bottomright,  1,  1)
bindArrow(keys.center,       0,  0)

// setInterval(() => {
//   canvas.randomBuffer()
//   canvas.draw()
// }, 250)