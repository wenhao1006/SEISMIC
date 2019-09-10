import os
import re
import sys
from subprocess import call

#inline = " (set_global 5 (i32.add (get_global 5) (i32.const 1)))"
inline = " (set_global 16 (i32.add (get_global 16) (i32.const 1)))"
wat2wasm = "wabt/wat2wasm.exe"

binaryInst = [
	"i32.add",
	"i64.add",
	"i32.sub",
	"i64.sub",
	"i32.mul",
	"i64.mul",
	"i32.div_s",
	"i64.div_s",
	"i32.div_u",
	"i64.div_u",
	"i32.rem_s",
	"i64.rem_s",
	"i32.rem_u",
	"i64.rem_u",
	"i32.and",
	"i64.and",
	"i32.or",
	"i64.or",
	"i32.xor",
	"i64.xor",
	"i32.shl",
	"i64.shl",
	"i32.shr_s",
	"i64.shr_s",
	"i32.shr_u",
	"i64.shr_u",
	"i32.rotl",
	"i64.rotl",
	"i32.rotr",
	"i64.rotr",
	"i32.clz",
	"i64.clz",
	"i32.ctz",
	"i64.ctz",
	"i32.popcnt",
	"i64.popcnt",
	"i32.eqz",
	"i64.eqz",
	"f32.add",
	"f64.add",
	"f32.sub",
	"f64.sub",
	"f32.mul",
	"f64.mul",
	"f32.div",
	"f64.div",
	"f32.sqrt",
	"f64.sqrt",
	"f32.min",
	"f64.min",
	"f32.max",
	"f64.max",
	"f32.copysign",
	"f64.copysign",
	"i32.eq",
	"i64.eq",
	"i32.ne",
	"i64.ne",
	"i32.lt_s",
	"i64.lt_s",
	"i32.lt_u",
	"i64.lt_u",
	"i32.le_s",
	"i64.le_s",
	"i32.le_u",
	"i64.le_u",
	"i32.gt_s",
	"i64.gt_s",
	"i32.gt_u",
	"i64.gt_u",
	"i32.ge_s",
	"i64.ge_s",
	"i32.ge_u",
	"i64.ge_u",
	"f32.eq",
	"f64.eq",
	"f32.ne",
	"f64.ne",
	"f32.lt",
	"f64.lt",
	"f32.le",
	"f64.le",
	"f32.gt",
	"f64.gt",
	"f32.ge",
	"f64.ge"
]

unaryInst = [
	"i32.wrap/i64",
	"i64.extend_s/i32",
	"i64.extend_u/i32",
	"i32.trunc_s/f32",
	"i32.trunc_s/f64",
	"i64.trunc_s/f32",
	"i64.trunc_s/f64",
	"i32.trunc_u/f32",
	"i32.trunc_u/f64",
	"i64.trunc_u/f32",
	"i64.trunc_u/f64",
	"f32.demote/f64",
	"f64.promote/f32",
	"f32.convert_s/i32",
	"f32.convert_s/i64",
	"f64.convert_s/i32",
	"f64.convert_s/i64",
	"f32.convert_u/i32",
	"f32.convert_u/i64",
	"f64.convert_u/i32",
	"f64.convert_u/i64",
	"i32.reinterpret/f32",
	"i32.reinterpret/f64",
	"i64.reinterpret/f32",
	"i64.reinterpret/f64",
]

inFileName = str(sys.argv[1])

with open(inFileName) as inFile:
	lines = inFile.read().splitlines()
	
for inst in binaryInst:
	outLines = []
	hasInstruction = False
	rInst = re.compile("\s*\(" + inst + "\s*$")
	for line in lines:
		if rInst.match(line):
			hasInstruction = True
			line += inline
		outLines.append(line)
	if hasInstruction:
		baseName = os.path.splitext(inFileName)[0]
		outFileName = baseName + "_" + inst + ".wat"
		outWasm = baseName + "_" + inst + ".wasm"
		with open(outFileName, 'w+') as outFile:
			for line in outLines:
				outFile.write("%s\n" % line)
		# wat --> wasm
		call([wat2wasm, outFileName, "-o", outWasm])
		print outWasm
		
for inst in unaryInst:
	outLines = []
	hasInstruction = False
	rInst = re.compile("\s*\(" + inst + "\s*$")
	for line in lines:
		if rInst.match(line):
			hasInstruction = True
			line += inline
		outLines.append(line)
	if hasInstruction:
		baseName = os.path.splitext(inFileName)[0]
		outFileName = baseName + "_" + inst.replace('/','') + ".wat"
		outWasm = baseName + "_" + inst.replace('/','') + ".wasm"
		with open(outFileName, 'w+') as outFile:
			for line in outLines:
				outFile.write("%s\n" % line)
		# wat --> wasm
		call([wat2wasm, outFileName, "-o", outWasm])
		print outWasm