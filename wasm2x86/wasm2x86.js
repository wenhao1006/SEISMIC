load("capstone.x86.js");
load("base64.js");

function toBytes(a) {
    return a.map(function (x) { return padLeft(Number(x).toString(16), 2, "0"); }).join(" ");
}
function toAddress(n) {
    var s = n.toString(16);
    while (s.length < 6) {
        s = "0" + s;
    }
    return "0x" + s;
}
function padRight(s, n, c) {
    s = String(s);
    while (s.length < n) {
        s = s + c;
    }
    return s;
}
function padLeft(s, n, c) {
    s = String(s);
    while (s.length < n) {
        s = c + s;
    }
    return s;
}
var x86JumpInstructions = [
    "jmp", "ja", "jae", "jb", "jbe", "jc", "je", "jg", "jge", "jl", "jle", "jna", "jnae",
    "jnb", "jnbe", "jnc", "jne", "jng", "jnge", "jnl", "jnle", "jno", "jnp", "jns", "jnz",
    "jo", "jp", "jpe", "jpo", "js", "jz"
];
function isBranch(instr) {
    return x86JumpInstructions.indexOf(instr.mnemonic) >= 0;
}

function disassembleModule(wasm) {
    var o, w;
    var m = new WebAssembly.Module(wasm);
    o = wasmExtractCode(m);
	//putstr(o.code + "\n");
	//putstr(o.segments.kind + "\n");
    var regions = o.segments.filter(s => s.kind === 0)
      .map(function(fnSegment) {
      var code = o.code.subarray(fnSegment.funcBodyBegin, fnSegment.funcBodyEnd);
      return {
        name: `wasm-function[${fnSegment.funcIndex}]`, 
        entry: 0,
        index: fnSegment.funcIndex,
		begin: fnSegment.funcBodyBegin,
		end: fnSegment.funcBodyEnd,
        bytes: base64EncodeBytes(code)
      };
    });
    return {
      begin: {low: 0, high: 0}, 
      regions: regions, 
      wasm: base64EncodeBytes(wasm)
    };
}

function disassemble(json) {
    let s = "";
    var cs = new capstone.Cs(capstone.ARCH_X86, capstone.MODE_64);
    var annotations = [];
    var assemblyInstructionsByAddress = Object.create(null);
    for (var i = 0; i < json.regions.length; i++) {
        var region = json.regions[i];
        s += region.name + ":\n";
        var csBuffer = decodeRestrictedBase64ToBytes(region.bytes);
        var instructions = cs.disasm(csBuffer, region.entry);
        var basicBlocks = {};
        instructions.forEach(function (instr, i) {
            assemblyInstructionsByAddress[instr.address] = instr;
            if (isBranch(instr)) {
                var targetAddress = parseInt(instr.op_str);
                if (!basicBlocks[targetAddress]) {
                    basicBlocks[targetAddress] = [];
                }
                basicBlocks[targetAddress].push(instr.address);
                if (i + 1 < instructions.length) {
                    basicBlocks[instructions[i + 1].address] = [];
                }
            }
        });
        instructions.forEach(function (instr) {
            if (basicBlocks[instr.address]) {
                s += " " + padRight(toAddress(instr.address) + ":", 39, " ");
                if (basicBlocks[instr.address].length > 0) {
                    s += "; " + toAddress(instr.address) + " from: [" + basicBlocks[instr.address].map(toAddress).join(", ") + "]";
                }
                s += "\n";
            }
            s += "  " + padRight(instr.mnemonic + " " + instr.op_str, 38, " ");
            s += "; " + toAddress(instr.address) + " " + toBytes(instr.bytes) + "\n";
        });
        s += "\n";
    }
    putstr(s);
}

var flag = scriptArgs[0];
var inputFile = scriptArgs[1];

try {
  var wasm;
  // if in wat (human-readable) format, convert to binary
  if (/\.wat$/i.test(inputFile)) {
    var wat = read(inputFile);
    wasm = wasmTextToBinary(wat);
  } else {
    wasm = read(inputFile, 'binary');
  }
  
  if(flag === "-json") {
	putstr(JSON.stringify(disassembleModule(wasm),null,2));
  } else if(flag === "-x86") {
	putstr(disassemble(disassembleModule(wasm)));  
  }
} catch (e) {
  putstr(JSON.stringify(e.message));
}
