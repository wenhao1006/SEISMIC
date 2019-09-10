import os
import re
import sys
from subprocess import call

inlineAdd = " (set_global 11 (i64.add (get_global 11) (i64.const 1)))"
inlineAnd = " (set_global 12 (i64.add (get_global 12) (i64.const 1)))"
inlineShl = " (set_global 13 (i64.add (get_global 13) (i64.const 1)))"
inlineShr = " (set_global 14 (i64.add (get_global 14) (i64.const 1)))"
inlineXor = " (set_global 15 (i64.add (get_global 15) (i64.const 1)))"

rAdd = re.compile("\s*\(i32.add\s*$")
rAnd = re.compile("\s*\(i32.and\s*$")
rShl = re.compile("\s*\(i32.shl\s*$")
rShr = re.compile("\s*\(i32.shr_u\s*$")
rXor = re.compile("\s*\(i32.xor\s*$")

wat2wasm = "../../wabt/wat2wasm.exe"
inFileName = str(sys.argv[1])

baseName = os.path.splitext(inFileName)[0]
outFileName = baseName + ".profiled.wat"
outWasm = baseName + ".profiled.wasm"

with open(inFileName) as inFile:
	lines = inFile.read().splitlines()

outLines = []

for line in lines:
	if rAdd.match(line):
		line += inlineAdd
	elif rAnd.match(line):
		line += inlineAnd
	elif rShl.match(line):
		line += inlineShl
	elif rShr.match(line):
		line += inlineShr
	elif rXor.match(line):
		line += inlineXor
	outLines.append(line)

with open(outFileName, 'w+') as outFile:
	for line in outLines:
		outFile.write("%s\n" % line)

# wat --> wasm
call([wat2wasm, outFileName, "-o", outWasm])