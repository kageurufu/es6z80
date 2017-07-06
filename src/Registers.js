export default class Registers {
  constructor() {
    this.reset()
  }

  reset() {
    this._a = 0;
    this._b = 0;
    this._c = 0;
    this._d = 0;
    this._e = 0;
    this._f = 0;
    this._h = 0;
    this._l = 0;
    this._i = 0;
    this._r = 0;
    this._pc = 0;
    this._sp = 0;
  }

  get a() { return this._a; }
  get b() { return this._b; }
  get c() { return this._c; }
  get d() { return this._d; }
  get e() { return this._e; }
  get f() { return this._f; }
  get h() { return this._h; }
  get l() { return this._l; }
  get i() { return this._i; }
  get r() { return this._r; }
  get pc() { return this._pc; }
  get sp() { return this._sp; }
  get af() { return this._a << 8 | this._f; }
  get bc() { return this._b << 8 | this._c; }
  get de() { return this._d << 8 | this._e; }
  get hl() { return this._h << 8 | this._l; }
  set a(v) { this._a = v & 0xFF; }
  set b(v) { this._b = v & 0xFF; }
  set c(v) { this._c = v & 0xFF; }
  set d(v) { this._d = v & 0xFF; }
  set e(v) { this._e = v & 0xFF; }
  set f(v) { this._f = v & 0xFF; }
  set h(v) { this._h = v & 0xFF; }
  set l(v) { this._l = v & 0xFF; }
  set i(v) { this._i = v & 0xFF; }
  set r(v) { this._r = v & 0xFF; }
  set pc(v) { this._pc = v & 0xFFFF; }
  set sp(v) { this._sp = v & 0xFFFF; }

  set af(v) {
    this._a = (v >> 8) & 0xFF;
    this._f = v & 0xFF;
  }

  set bc(v) {
    this._b = (v >> 8) & 0xFF;
    this._c = v & 0xFF;
  }

  set de(v) {
    this._d = (v >> 8) & 0xFF;
    this._e = v & 0xFF;
  }


  set hl(v) {
    this._h = (v >> 8) & 0xFF;
    this._l = v & 0xFF;
  }
}