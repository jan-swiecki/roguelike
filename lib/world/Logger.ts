import { WCamera } from './WCamera';

class Logger {
  camera: WCamera;
  addCamera(camera: WCamera) {
    this.camera = camera
  }
  log(...args) {
    this.camera.log(...args)
  }
}

const logger = new Logger()

export function log(...args) {
  logger.log(...args)
}

export default logger