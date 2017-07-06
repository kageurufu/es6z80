import Registers from './Registers'

export default class CPU {
  constructor(z80) {
    this.z80 = z80;

    this.r = new Registers();
    this.m = 0;
    this.t = 0;
  }

  boot() {
    this.r.boot();
  }

  reset() {
    this.r.reset();

    this.m = 0;
    this.t = 0;
  }
}