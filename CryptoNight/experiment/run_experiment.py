import sys
from subprocess import call

inFileName = str(sys.argv[1])

with open(inFileName) as inFile:
	lines = inFile.read().splitlines()
	
for fileName in lines:
	print fileName
	sys.stdout.flush()
	call(["C:\Dev\js\jsshell-win64\js.exe", "..\worker_single.js", fileName, sys.argv[2]])