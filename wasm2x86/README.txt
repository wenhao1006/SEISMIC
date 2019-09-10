This tool uses SpiderMonkey JS to compile wasm to an x86 style assembly file.

Dependencies:
	- SpiderMonkey (Firefox's JS engine)
	
run: js wasm2x86.js <output-type> <input-wasm-file>

<output-type> : -json, -x86
<input-wasm-file> : wasm file to compile to a WebAssembly.Module

Prints to stdout, redirect to a file if you want to save.

e.g., js wasm2x86.js -x86 worker.wasm > worker.asm

