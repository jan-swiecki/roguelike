import { KeyHandler } from './lib/KeyHandler';
import { Canvas } from './lib/Canvas';
import { World } from './lib/world/World';



const keyHandler = new KeyHandler().run()
const canvas = new Canvas()
canvas.init()
canvas.randomBuffer()
canvas.draw()

const world = new World()

world.addPlayer([10, 10])
const camera = world.addCamera([10, 5], [10, 10])
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

const bindArrow = (key, dx, dy) => keyHandler.bindCh(key, () => world.move(camera, [dx, dy]))

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