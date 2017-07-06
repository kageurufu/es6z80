import {zeroBuffer} from "./util";
export default class GPU {
  constructor(z80) {
    this.z80 = z80;

    this.boot();
  }

  boot() {
    this.vram = new Uint8Array(0x2000);
    this.oam = new Uint8Array(0x100);

    this.reset();
  }

  reset() {
    zeroBuffer(this.vram);
    zeroBuffer(this.oam);
  }

  initOutput(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.framebuffer = this.context.createImageData(160, 144);

    // Draw gray just to show its working
    zeroBuffer(this.framebuffer.data, 128);
    this.context.putImageData(this.framebuffer, 0, 0)
  }

  writeByte(addr, val) {

  }
}