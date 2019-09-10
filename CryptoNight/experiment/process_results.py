import sys

inFileName = str(sys.argv[1])
iterations = int(sys.argv[2])

with open(inFileName) as inFile:
	lines = inFile.read().splitlines()

count = 0
output = ""

header = "Instruction"
for x in range(0,iterations):
	header += ",run " + str(x+1)
print header

for line in lines:
	if count == iterations+1:
		print output
		count = 0
	
	if count == 0:
		output = line
	else:
		output += "," + line
	
	count+=1
print output