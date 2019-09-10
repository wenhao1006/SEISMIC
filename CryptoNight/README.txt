Experiment process

WASM Profiler

To profile an instruction (i.e., count how many times it's executed) follow these steps:

0. Disassemble wasm binary to wat if necessary

1. Create a new global variable to store the count. These are located at the end of a wat file.
   E.g., (global (;5;) (mut i32) (i32.const 0))

2. Create a new function to access and return the value stored by the global variable.
   a. Declare function type:
      (type (;9;) (func (result i32)))
   b. Instrument function:
      (func $_instructionCount (type 9) (result i32) (return (get_global 5)))
   c. Export function for usage:
      (export "_instructionCount" (func $_instructionCount))

3. For an instruction you want to profile (e.g., i32.add), inline the incrementer:
   Before:
   (i32.add
     (get_local $p1)
     (i32.const 128))

   After:
   (i32.add (set_global 5 (i32.add (get_global 5) (i32.const 1)))
     (get_local $p1)
     (i32.const 128))

4. At any point during execution, call _instructionCount() from an instantiated JS WebAssembly
   object and it will return the count value.

Steps 0, 1, & 2 are currently a manual process. Step 3 is pseudo-automated by inline_counter.py.  

python inline_counter.py <modified_wat_file>
python inline_counter.py worker.wat > wasm_list.txt

It behaves in the following way:

  1. Select a single instruction used in the provided wat file
  2. Inline the incrementer at all points this is encountered
     - need to manually specify in the .py file
  3. Output a new wat file
  4. Convert wat to wasm
     - may need to specify the wat2wasm binary location in the .py file
  5. Repeat 1-4 until all instructions are covered
  
A list of created wasm files will print to screen.  This will be the input to run_experiment.py.

python run_experiment.py <wasm_file_list> <iterations>
python run_experiment.py wasm_list.txt 100 > results.txt

This script is specific to worker_single.js.  The output is a list of counts of size <iterations>
for each wasm file in the provided list.

Finally, process_results.py will convert the list into a csv file.

python process_results.py <results> <iterations>
python process_results.py results.txt 100 > results.csv

Then do what you want with the CSV file.