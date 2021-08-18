import { Stream, Writable } from "stream";
import { WriteStream } from "tty";


export class Canvas {
  private width = 80
  private height = 20
  private size: number
  private buffer: Array<string>;
  private stream = process.stdout

  init() {
    this.size = this.width * this.height

    // this.buffer = new Int8Array(this.width*this.height);
    this.buffer = new Array(this.width*this.height);
    this.buffer.fill('.')

    // hide terminal cursor
    // https://github.com/visionmedia/node-progress/issues/88#issuecomment-97873205
    this.stream.write('\x1B[?25l')
  }

  async clear() {
    await new Promise<void>(r => this.stream.cursorTo(0, 0, () => r()))
    await new Promise<void>(r => this.stream.clearScreenDown(() => r()))
  }

  onExit() {
    // show terminal cursor
    this.stream.write('\x1B[?25h')
  }

  randomBuffer() {
    for(let i = 0; i < this.size; i++) {
      this.buffer[i] = Math.random() > 0.5 ? '#' : '.';
    }
  }

  getStream(): WriteStream {
    return this.stream
  }

  draw() {
    this.clear();

    let i = 0
    let x, y;
    for(; i < this.size; i++) {
      x = i % this.width
      y = Math.floor(i / this.width)
      // this.stream.write(this.bufferDisplayMap[this.buffer[i]])
      this.stream.write(this.buffer[i])
      if(x === this.width-1) {
        this.stream.write('\n')
      }
    }
  }
}