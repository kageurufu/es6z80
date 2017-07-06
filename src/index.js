import Z80 from "./Z80";
import rom from "./../roms/Asteroids.gb";

const z80 = window.z80 = new Z80();
const rominfo = document.getElementById("z80--rominfo");

z80.memory.loadRom(rom);
z80.gpu.initOutput(document.getElementById("z80--screen"));

rominfo.innerText = `
${z80.memory.romTitle} (${z80.memory.cartridgeType})
ROM ${z80.memory.romSize} - RAM ${z80.memory.ramSize}
`.trim();
