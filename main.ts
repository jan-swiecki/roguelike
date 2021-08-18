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
const camera = world.addCamera([20, 10], [40, 10])
camera.attachCanvas(canvas)
camera.drawIntoCanvas()

keyHandler.bindCh(2, () => world.move(camera, [0, 1]))

// setInterval(() => {
//   canvas.randomBuffer()
//   canvas.draw()
// }, 250)