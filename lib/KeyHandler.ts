import { EventEmitter } from "stream";


const keypress = require('keypress')


type Callback = ({ch, key}) => void


export class KeyHandler extends EventEmitter {
  private _keyListener: ({ ch, key }: { ch: any; key: any; }) => void;

  private bindings: {[key: string]: Callback[]} = {}

  run(): KeyHandler {
    // make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin);
  
    // listen for the "keypress" event
    process.stdin.on('keypress', (ch, key) => {
      // console.log('got "keypress"', ch, key);
      this.emit('keypress', {ch, key})
      if (key && (key.ctrl && key.name == 'c' || key.name === 'q')) {
        process.stdin.pause();
      }
    });
  
    process.stdin.setRawMode(true);
    process.stdin.resume();

    this._keyListener = ({ch, key}) => this.keyListener({ch, key})
    this.on('keypress', this._keyListener)
    
    return this;
  }

  stop() {
    this.off('keypress', this._keyListener)
    process.stdin.pause();
  }

  bindCh(ch, callback: Callback) {
    const key = `ch:${ch}`
    this.bindings[key] = this.bindings[key] || []
    this.bindings[key].push(callback)
  }

  private keyListener({ch, key}: { ch: string|number; key: any; }) {
    const c1 = `ch:${ch}`

    if(this.bindings[c1]) {
      for(const callback of this.bindings[c1]) {
        callback({ch, key})
      }
    }
    // for(const key in this.bindings) {
    //   console.log(key, this.bindings[key])
    // }
  }
}