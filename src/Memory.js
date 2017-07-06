import {stringToBuffer} from "./util";
import DMG_ROM from "../roms/DMG_ROM.bin";
import {CartridgeType, RamSize, RomSize} from "./constants";

class MemoryError extends Error {
}

export default class Memory {

  constructor(z80) {
    this.z80 = z80;
    this.bios = stringToBuffer(DMG_ROM);

    this.boot();
  }

  boot() {
    this.rom = new Uint8Array(0x8000);
    this.wram = new Uint8Array(0x4000);
    this.eram = new Uint8Array(0x2000);
    this.zram = new Uint8Array(0xFF);

    this.reset();
  }

  reset() {
    this.inBios = true;
  }

  loadRom(romData) {
    this.rom = stringToBuffer(romData);
  }

  get romTitle() {
    let addr = 0x0134;
    let title = '';
    while (addr <= 0x0143 && this.rom[addr]) {
      title += String.fromCharCode(this.rom[addr]);

      addr++;
    }

    return title;
  }

  get cartridgeType() {
    return CartridgeType[this.rom[0x0147]];
  }

  get romSize() {
    return RomSize[this.rom[0x148]]
  }

  get ramSize() {
    return RamSize[this.rom[0x148]]
  }

  readByte(addr) {
    switch (addr & 0xF000) {
      case 0x0000:
        if (this.inBios) {
          return this.bios[addr];
        } else if (this.z80.cpu.r.pc === 0x0100) {
          this.inBios = false;
        }

        //noinspection FallThroughInSwitchStatementJS
      case 0x1000:
      case 0x2000:
      case 0x3000:
        return this.rom[addr];

      case 0x4000:
      case 0x5000:
      case 0x6000:
      case 0x7000:
        // TODO: ROM banking
        return this.rom[addr];

      case 0x8000:
      case 0x9000:
        return this.z80.gpu.vram[addr & 0x1FFF];

      case 0xA000:
      case 0xB000:
        return this.eram[addr & 0x1FFF];

      case 0xC000:
      case 0xD000:
      case 0xE000: // WRam Shadow
        return this.wram[addr & 0x1FFF];

      case 0xF000:
        // FF00 - FF7F
        /* Special Registers
         *
         * Input
         *   FF00 Joypad
         * Serial Data
         *   FF01 Serial Transfer Data
         *   FF02 Serial IO Control
         * Timer
         *   FF04 Divider
         *   FF05 TIMA counter
         *   FF06 TIMA modulo
         *   FF07 TAC Timer Control
         * MMU Interrupt
         *   FF0F Interrupt Flag
         * Sound FF10 - FF3F
         *   FF10 Sound Mode 1, Sweep
         *   FF11 Sound Mode 1, Length/Wave
         *   FF12 Sound Mode 1, Envelope
         *   FF13 Sound Mode 1, Frequency Lo
         *   FF14 Sound Mode 1, Frequency Hi
         *   FF15 Sound Mode 2, Sweep
         *   FF16 Sound Mode 2, Length/Wave
         *   FF17 Sound Mode 2, Envelope
         *   FF18 Sound Mode 2, Frequency Lo
         *   FF19 Sound Mode 2, Frequency Hi
         *   FF1A Sound Mode 3, On/Off
         *   FF1B Sound Mode 3, Length
         *   FF1C Sound Mode 3, Output Level
         *   FF1D Sound Mode 3, Frequency Lo
         *   FF1E Sound Mode 3, Frequency Hi
         *   FF20 Sound Mode 4, Length
         *   FF21 Sound Mode 4, Envelope
         *   FF22 Sound Mode 4, Polynomial counter
         *   FF23 Sound Mode 4, Counter/Consecutive
         *   FF24 Sound Mode 4, Channel Control/ON-OFF/Volume
         *   FF25 Sound Mode Output Terminal (bitset)
         *     Bit 7 - Output sound 4 to SO2 terminal
         *     Bit 6 - Output sound 3 to SO2 terminal
         *     Bit 5 - Output sound 2 to SO2 terminal
         *     Bit 4 - Output sound 1 to SO2 terminal
         *     Bit 3 - Output sound 4 to SO1 terminal
         *     Bit 2 - Output sound 3 to SO1 terminal
         *     Bit 1 - Output sound 2 to SO1 terminal
         *     Bit 0 - Output sound 1 to SO1 terminal
         *   FF26 Sound ON/Off
         *   FF30 - FF3F Wave Pattern RAM
         * GPU FF40 FF4B
         *   FF40 LCD Control
         *   FF41 LCD Status
         *   FF42 SCY
         *   FF43 SCX
         *   FF44 LY
         *   FF45 LYC
         *   FF46 DMA Transfer
         *   FF47 BG and Window Palette
         *   FF48 Obj0 Palette
         *   FF49 Obj1 Palette
         *   FF4A Window Y
         *   FF4B Window X
         * MM Interrupt
         *   FFFF Interrupt Enable
         */
        if (addr < 0xFE00) {
          return this.wram[addr & 0x1FFF];
        } else if (addr < 0xFEA0) {
          return this.z80.gpu.oam[addr & 0xFF];
        } else if (addr < 0xFF00) {
          return 0;
        } else if (addr === 0xFF00) {
          return this.z80.input.readByte();
        } else if (addr <= 0xFF02) {
          // TODO: Serial Port
          return 0;
        } else if (addr === 0xFF03) {
          return 0; // Unused
        } else if (addr <= 0xFF07) {
          return this.z80.timer.readByte(0xFF04)
        } else if (addr <= 0xFF0E) {
          return 0; // Unused
        } else if (addr === 0xFF0F) {
          return this.z80.cpu.r.ie;
        } else if (addr <= 0xFF3F) {
          return this.z80.sound.readByte(addr);
        } else if (addr <= 0xFF4B) {
          return this.z80.gpu.readByte(addr);
        } else if (addr <= 0xFF7F) {
          return 0; // Unused
        } else if (addr <= 0xFFFE) {
          return this.zram[addr & 0x7F];
        } else if (addr === 0xFFFF) {
          return this.z80.cpu.r.ie;
        }
    }

    throw new MemoryError(`Unhandled memory address 0x${addr.toString(16)}`)
  }

  writeByte(addr, val) {
    switch (addr & 0xF000) {
      case 0x0000:
        if (this.inBios) {
          return this.bios[addr];
        }

        //noinspection FallThroughInSwitchStatementJS
      case 0x1000:
      case 0x2000:
      case 0x3000:
        return this.rom[addr];

      case 0x4000:
      case 0x5000:
      case 0x6000:
      case 0x7000:
        // TODO: ROM banking
        return this.rom[addr];

      case 0x8000:
      case 0x9000:
        return this.z80.gpu.vram[addr & 0x1FFF] = val;

      case 0xA000:
      case 0xB000:
        return this.eram[addr & 0x1FFF] = val;

      case 0xC000:
      case 0xD000:
      case 0xE000: // WRam Shadow
        return this.wram[addr & 0x1FFF] = val;

      case 0xF000:
        if (addr < 0xFE00) {
          return this.wram[addr & 0x1FFF] = val;
        } else if (addr < 0xFEA0) {
          return this.z80.gpu.writeByte(addr, val);
        } else if (addr < 0xFF00) {
          throw new MemoryError(`Cannot write to 0x${addr.toString(16)}`);
        } else if (addr === 0xFF00) {
          return this.z80.input.readByte();
        } else if (addr <= 0xFF02) {
          // TODO: Serial Port
          return 0;
        } else if (addr === 0xFF03) {
          return 0; // Unused
        } else if (addr <= 0xFF07) {
          return this.z80.timer.readByte(0xFF04)
        } else if (addr <= 0xFF0E) {
          return 0; // Unused
        } else if (addr === 0xFF0F) {
          return this.z80.cpu.r.ie;
        } else if (addr <= 0xFF3F) {
          return this.z80.sound.readByte(addr);
        } else if (addr <= 0xFF4B) {
          return this.z80.gpu.readByte(addr);
        } else if (addr === 0xFF50) {
          this.inBios = !val;
        } else if (addr <= 0xFF7F) {
          return 0; // Unused
        } else if (addr <= 0xFFFE) {
          return this.zram[addr & 0x7F] = val;
        } else if (addr === 0xFFFF) {
          return this.z80.cpu.r.ie = val & 0x1
        }
    }
  }

  readWord(addr) {
    return this.readByte(addr) + (this.readByte(addr + 1) << 8);
  }

  writeWord(addr, val) {
    this.writeByte(addr, (val >> 8) & 0xFF);
    this.writeByte(addr + 1, val & 0xFF);
  }
}