import os
import re
import sys
from subprocess import call

inlineAdd = " (set_global $addCnt (i64.add (get_global $addCnt) (i64.const 1)))"
inlineAnd = " (set_global $andCnt (i64.add (get_global $andCnt) (i64.const 1)))"
inlineShl = " (set_global $shlCnt (i64.add (get_global $shlCnt) (i64.const 1)))"
inlineShr = " (set_global $shrCnt (i64.add (get_global $shrCnt) (i64.const 1)))"
inlineXor = " (set_global $xorCnt (i64.add (get_global $xorCnt) (i64.const 1)))"

rAdd = re.compile("\s*\(i32.add\s*$")
rAnd = re.compile("\s*\(i32.and\s*$")
rShl = re.compile("\s*\(i32.shl\s*$")
rShr = re.compile("\s*\(i32.shr_u\s*$")
rXor = re.compile("\s*\(i32.xor\s*$")

inFileName = str(sys.argv[1])

baseName = os.path.splitext(inFileName)[0]
outFileName = baseName + "_profiled.wat"

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