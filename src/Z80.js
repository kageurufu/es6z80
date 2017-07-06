import CPU from "./CPU";
import Memory from "./Memory";
import Timer from "./Timer";
import Input from "./Input";
import GPU from "./GPU";

export default class {
  constructor() {
    this.cpu = new CPU(this);
    this.gpu = new GPU(this);
    this.memory = new Memory(this);
    this.timer = new Timer(this);
    this.input = new Input(this);
  }

  boot() {
    this.cpu.boot();
    this.gpu.boot();
    this.memory.boot();
    this.timer.boot();
    this.input.boot();
  }

  reset() {
    this.cpu.reset();
    this.gpu.reset();
    this.memory.reset();
    this.timer.reset();
    this.input.reset();
  }
}