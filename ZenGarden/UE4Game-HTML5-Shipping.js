var Module;
if (!Module) Module = (typeof Module !== "undefined" ? Module : null) || {};
var moduleOverrides = {};
for (var key in Module) {
    if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key]
    }
}
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
        throw new Error("The provided Module['ENVIRONMENT'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.")
    }
} else {
    ENVIRONMENT_IS_WEB = typeof window === "object";
    ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
    ENVIRONMENT_IS_NODE = typeof process === "object" && typeof require === "function" && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
    ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER
}
if (ENVIRONMENT_IS_NODE) {
    if (!Module["print"]) Module["print"] = console.log;
    if (!Module["printErr"]) Module["printErr"] = console.warn;
    var nodeFS;
    var nodePath;
    Module["read"] = function read(filename, binary) {
        if (!nodeFS) nodeFS = require("fs");
        if (!nodePath) nodePath = require("path");
        filename = nodePath["normalize"](filename);
        var ret = nodeFS["readFileSync"](filename);
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
    Module["load"] = function load(f) {
        globalEval(read(f))
    };
    if (!Module["thisProgram"]) {
        if (process["argv"].length > 1) {
            Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/")
        } else {
            Module["thisProgram"] = "unknown-program"
        }
    }
    Module["arguments"] = process["argv"].slice(2);
    if (typeof module !== "undefined") {
        module["exports"] = Module
    }
    process["on"]("uncaughtException", (function(ex) {
        if (!(ex instanceof ExitStatus)) {
            throw ex
        }
    }));
    Module["inspect"] = (function() {
        return "[Emscripten Module object]"
    })
} else if (ENVIRONMENT_IS_SHELL) {
    if (!Module["print"]) Module["print"] = print;
    if (typeof printErr != "undefined") Module["printErr"] = printErr;
    if (typeof read != "undefined") {
        Module["read"] = read
    } else {
        Module["read"] = function read() {
            throw "no read() available"
        }
    }
    Module["readBinary"] = function readBinary(f) {
        if (typeof readbuffer === "function") {
            return new Uint8Array(readbuffer(f))
        }
        var data = read(f, "binary");
        assert(typeof data === "object");
        return data
    };
    if (typeof scriptArgs != "undefined") {
        Module["arguments"] = scriptArgs
    } else if (typeof arguments != "undefined") {
        Module["arguments"] = arguments
    }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    Module["read"] = function read(url) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.send(null);
        return xhr.responseText
    };
    Module["readAsync"] = function readAsync(url, onload, onerror) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function xhr_onload() {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                onload(xhr.response)
            } else {
                onerror()
            }
        };
        xhr.onerror = onerror;
        xhr.send(null)
    };
    if (typeof arguments != "undefined") {
        Module["arguments"] = arguments
    }
    if (typeof console !== "undefined") {
        if (!Module["print"]) Module["print"] = function print(x) {
            console.log(x)
        };
        if (!Module["printErr"]) Module["printErr"] = function printErr(x) {
            console.warn(x)
        }
    } else {
        var TRY_USE_DUMP = false;
        if (!Module["print"]) Module["print"] = TRY_USE_DUMP && typeof dump !== "undefined" ? (function(x) {
            dump(x)
        }) : (function(x) {})
    }
    if (ENVIRONMENT_IS_WORKER) {
        Module["load"] = importScripts
    }
    if (typeof Module["setWindowTitle"] === "undefined") {
        Module["setWindowTitle"] = (function(title) {
            document.title = title
        })
    }
} else {
    throw "Unknown runtime environment. Where are we?"
}

function globalEval(x) {
    eval.call(null, x)
}
if (!Module["load"] && Module["read"]) {
    Module["load"] = function load(f) {
        globalEval(Module["read"](f))
    }
}
if (!Module["print"]) {
    Module["print"] = (function() {})
}
if (!Module["printErr"]) {
    Module["printErr"] = Module["print"]
}
if (!Module["arguments"]) {
    Module["arguments"] = []
}
if (!Module["thisProgram"]) {
    Module["thisProgram"] = "./this.program"
}
Module.print = Module["print"];
Module.printErr = Module["printErr"];
Module["preRun"] = [];
Module["postRun"] = [];
for (var key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key]
    }
}
moduleOverrides = undefined;
var Runtime = {
    setTempRet0: (function(value) {
        tempRet0 = value;
        return value
    }),
    getTempRet0: (function() {
        return tempRet0
    }),
    stackSave: (function() {
        return STACKTOP
    }),
    stackRestore: (function(stackTop) {
        STACKTOP = stackTop
    }),
    getNativeTypeSize: (function(type) {
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
            default:
                {
                    if (type[type.length - 1] === "*") {
                        return Runtime.QUANTUM_SIZE
                    } else if (type[0] === "i") {
                        var bits = parseInt(type.substr(1));
                        assert(bits % 8 === 0);
                        return bits / 8
                    } else {
                        return 0
                    }
                }
        }
    }),
    getNativeFieldSize: (function(type) {
        return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE)
    }),
    STACK_ALIGN: 16,
    prepVararg: (function(ptr, type) {
        if (type === "double" || type === "i64") {
            if (ptr & 7) {
                assert((ptr & 7) === 4);
                ptr += 4
            }
        } else {
            assert((ptr & 3) === 0)
        }
        return ptr
    }),
    getAlignSize: (function(type, size, vararg) {
        if (!vararg && (type == "i64" || type == "double")) return 8;
        if (!type) return Math.min(size, 8);
        return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE)
    }),
    dynCall: (function(sig, ptr, args) {
        if (args && args.length) {
            return Module["dynCall_" + sig].apply(null, [ptr].concat(args))
        } else {
            return Module["dynCall_" + sig].call(null, ptr)
        }
    }),
    functionPointers: [],
    addFunction: (function(func) {
        for (var i = 0; i < Runtime.functionPointers.length; i++) {
            if (!Runtime.functionPointers[i]) {
                Runtime.functionPointers[i] = func;
                return 2 * (1 + i)
            }
        }
        throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."
    }),
    removeFunction: (function(index) {
        Runtime.functionPointers[(index - 2) / 2] = null
    }),
    warnOnce: (function(text) {
        if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
        if (!Runtime.warnOnce.shown[text]) {
            Runtime.warnOnce.shown[text] = 1;
            Module.printErr(text)
        }
    }),
    funcWrappers: {},
    getFuncWrapper: (function(func, sig) {
        assert(sig);
        if (!Runtime.funcWrappers[sig]) {
            Runtime.funcWrappers[sig] = {}
        }
        var sigCache = Runtime.funcWrappers[sig];
        if (!sigCache[func]) {
            if (sig.length === 1) {
                sigCache[func] = function dynCall_wrapper() {
                    return Runtime.dynCall(sig, func)
                }
            } else if (sig.length === 2) {
                sigCache[func] = function dynCall_wrapper(arg) {
                    return Runtime.dynCall(sig, func, [arg])
                }
            } else {
                sigCache[func] = function dynCall_wrapper() {
                    return Runtime.dynCall(sig, func, Array.prototype.slice.call(arguments))
                }
            }
        }
        return sigCache[func]
    }),
    getCompilerSetting: (function(name) {
        throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"
    }),
    stackAlloc: (function(size) {
        var ret = STACKTOP;
        STACKTOP = STACKTOP + size | 0;
        STACKTOP = STACKTOP + 15 & -16;
        return ret
    }),
    staticAlloc: (function(size) {
        var ret = STATICTOP;
        STATICTOP = STATICTOP + size | 0;
        STATICTOP = STATICTOP + 15 & -16;
        return ret
    }),
    dynamicAlloc: (function(size) {
        var ret = HEAP32[DYNAMICTOP_PTR >> 2];
        var end = (ret + size + 15 | 0) & -16;
        HEAP32[DYNAMICTOP_PTR >> 2] = end;
        if (end >= TOTAL_MEMORY) {
            var success = enlargeMemory();
            if (!success) {
                HEAP32[DYNAMICTOP_PTR >> 2] = ret;
                return 0
            }
        }
        return ret
    }),
    alignMemory: (function(size, quantum) {
        var ret = size = Math.ceil(size / (quantum ? quantum : 16)) * (quantum ? quantum : 16);
        return ret
    }),
    makeBigInt: (function(low, high, unsigned) {
        var ret = unsigned ? +(low >>> 0) + +(high >>> 0) * 4294967296 : +(low >>> 0) + +(high | 0) * 4294967296;
        return ret
    }),
    GLOBAL_BASE: 1024,
    QUANTUM_SIZE: 4,
    __dummy__: 0
};
Module["Runtime"] = Runtime;
var ABORT = 0;
var EXITSTATUS = 0;

function assert(condition, text) {
    if (!condition) {
        abort("Assertion failed: " + text)
    }
}

function getCFunc(ident) {
    var func = Module["_" + ident];
    if (!func) {
        try {
            func = eval("_" + ident)
        } catch (e) {}
    }
    assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)");
    return func
}
var cwrap, ccall;
((function() {
    var JSfuncs = {
        "stackSave": (function() {
            Runtime.stackSave()
        }),
        "stackRestore": (function() {
            Runtime.stackRestore()
        }),
        "arrayToC": (function(arr) {
            var ret = Runtime.stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret
        }),
        "stringToC": (function(str) {
            var ret = 0;
            if (str !== null && str !== undefined && str !== 0) {
                var len = (str.length << 2) + 1;
                ret = Runtime.stackAlloc(len);
                stringToUTF8(str, ret, len)
            }
            return ret
        })
    };
    var toC = {
        "string": JSfuncs["stringToC"],
        "array": JSfuncs["arrayToC"]
    };
    ccall = function ccallFunc(ident, returnType, argTypes, args, opts) {
        var func = getCFunc(ident);
        var cArgs = [];
        var stack = 0;
        if (args) {
            for (var i = 0; i < args.length; i++) {
                var converter = toC[argTypes[i]];
                if (converter) {
                    if (stack === 0) stack = Runtime.stackSave();
                    cArgs[i] = converter(args[i])
                } else {
                    cArgs[i] = args[i]
                }
            }
        }
        var ret = func.apply(null, cArgs);
        if (returnType === "string") ret = Pointer_stringify(ret);
        if (stack !== 0) {
            if (opts && opts.async) {
                EmterpreterAsync.asyncFinalizers.push((function() {
                    Runtime.stackRestore(stack)
                }));
                return
            }
            Runtime.stackRestore(stack)
        }
        return ret
    };
    var sourceRegex = /^function\s*[a-zA-Z$_0-9]*\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;

    function parseJSFunc(jsfunc) {
        var parsed = jsfunc.toString().match(sourceRegex).slice(1);
        return {
            arguments: parsed[0],
            body: parsed[1],
            returnValue: parsed[2]
        }
    }
    var JSsource = null;

    function ensureJSsource() {
        if (!JSsource) {
            JSsource = {};
            for (var fun in JSfuncs) {
                if (JSfuncs.hasOwnProperty(fun)) {
                    JSsource[fun] = parseJSFunc(JSfuncs[fun])
                }
            }
        }
    }
    cwrap = function cwrap(ident, returnType, argTypes) {
        argTypes = argTypes || [];
        var cfunc = getCFunc(ident);
        var numericArgs = argTypes.every((function(type) {
            return type === "number"
        }));
        var numericRet = returnType !== "string";
        if (numericRet && numericArgs) {
            return cfunc
        }
        var argNames = argTypes.map((function(x, i) {
            return "$" + i
        }));
        var funcstr = "(function(" + argNames.join(",") + ") {";
        var nargs = argTypes.length;
        if (!numericArgs) {
            ensureJSsource();
            funcstr += "var stack = " + JSsource["stackSave"].body + ";";
            for (var i = 0; i < nargs; i++) {
                var arg = argNames[i],
                    type = argTypes[i];
                if (type === "number") continue;
                var convertCode = JSsource[type + "ToC"];
                funcstr += "var " + convertCode.arguments + " = " + arg + ";";
                funcstr += convertCode.body + ";";
                funcstr += arg + "=(" + convertCode.returnValue + ");"
            }
        }
        var cfuncname = parseJSFunc((function() {
            return cfunc
        })).returnValue;
        funcstr += "var ret = " + cfuncname + "(" + argNames.join(",") + ");";
        if (!numericRet) {
            var strgfy = parseJSFunc((function() {
                return Pointer_stringify
            })).returnValue;
            funcstr += "ret = " + strgfy + "(ret);"
        }
        if (!numericArgs) {
            ensureJSsource();
            funcstr += JSsource["stackRestore"].body.replace("()", "(stack)") + ";"
        }
        funcstr += "return ret})";
        return eval(funcstr)
    }
}))();
Module["ccall"] = ccall;
Module["cwrap"] = cwrap;

function setValue(ptr, value, type, noSafe) {
    type = type || "i8";
    if (type.charAt(type.length - 1) === "*") type = "i32";
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
            tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
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
Module["setValue"] = setValue;

function getValue(ptr, type, noSafe) {
    type = type || "i8";
    if (type.charAt(type.length - 1) === "*") type = "i32";
    switch (type) {
        case "i1":
            return HEAP8[ptr >> 0];
        case "i8":
            return HEAP8[ptr >> 0];
        case "i16":
            return HEAP16[ptr >> 1];
        case "i32":
            return HEAP32[ptr >> 2];
        case "i64":
            return HEAP32[ptr >> 2];
        case "float":
            return HEAPF32[ptr >> 2];
        case "double":
            return HEAPF64[ptr >> 3];
        default:
            abort("invalid type for setValue: " + type)
    }
    return null
}
Module["getValue"] = getValue;
var ALLOC_NORMAL = 0;
var ALLOC_STACK = 1;
var ALLOC_STATIC = 2;
var ALLOC_DYNAMIC = 3;
var ALLOC_NONE = 4;
Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
Module["ALLOC_STACK"] = ALLOC_STACK;
Module["ALLOC_STATIC"] = ALLOC_STATIC;
Module["ALLOC_DYNAMIC"] = ALLOC_DYNAMIC;
Module["ALLOC_NONE"] = ALLOC_NONE;

function allocate(slab, types, allocator, ptr) {
    var zeroinit, size;
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
        ret = [typeof _malloc === "function" ? _malloc : Runtime.staticAlloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length))
    }
    if (zeroinit) {
        var ptr = ret,
            stop;
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
        type, typeSize, previousType;
    while (i < size) {
        var curr = slab[i];
        if (typeof curr === "function") {
            curr = Runtime.getFunctionIndex(curr)
        }
        type = singleType || types[i];
        if (type === 0) {
            i++;
            continue
        }
        if (type == "i64") type = "i32";
        setValue(ret + i, curr, type);
        if (previousType !== type) {
            typeSize = Runtime.getNativeTypeSize(type);
            previousType = type
        }
        i += typeSize
    }
    return ret
}
Module["allocate"] = allocate;

function getMemory(size) {
    if (!staticSealed) return Runtime.staticAlloc(size);
    if (!runtimeInitialized) return Runtime.dynamicAlloc(size);
    return _malloc(size)
}
Module["getMemory"] = getMemory;

function Pointer_stringify(ptr, length) {
    if (length === 0 || !ptr) return "";
    var hasUtf = 0;
    var t;
    var i = 0;
    while (1) {
        t = HEAPU8[ptr + i >> 0];
        hasUtf |= t;
        if (t == 0 && !length) break;
        i++;
        if (length && i == length) break
    }
    if (!length) length = i;
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
    return Module["UTF8ToString"](ptr)
}
Module["Pointer_stringify"] = Pointer_stringify;

function AsciiToString(ptr) {
    var str = "";
    while (1) {
        var ch = HEAP8[ptr++ >> 0];
        if (!ch) return str;
        str += String.fromCharCode(ch)
    }
}
Module["AsciiToString"] = AsciiToString;

function stringToAscii(str, outPtr) {
    return writeAsciiToMemory(str, outPtr, false)
}
Module["stringToAscii"] = stringToAscii;
var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

function UTF8ArrayToString(u8Array, idx) {
    var endPtr = idx;
    while (u8Array[endPtr]) ++endPtr;
    if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(u8Array.subarray(idx, endPtr))
    } else {
        var u0, u1, u2, u3, u4, u5;
        var str = "";
        while (1) {
            u0 = u8Array[idx++];
            if (!u0) return str;
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
Module["UTF8ArrayToString"] = UTF8ArrayToString;

function UTF8ToString(ptr) {
    return UTF8ArrayToString(HEAPU8, ptr)
}
Module["UTF8ToString"] = UTF8ToString;

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            outU8Array[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 192 | u >> 6;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 224 | u >> 12;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 2097151) {
            if (outIdx + 3 >= endIdx) break;
            outU8Array[outIdx++] = 240 | u >> 18;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 67108863) {
            if (outIdx + 4 >= endIdx) break;
            outU8Array[outIdx++] = 248 | u >> 24;
            outU8Array[outIdx++] = 128 | u >> 18 & 63;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 5 >= endIdx) break;
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
Module["stringToUTF8Array"] = stringToUTF8Array;

function stringToUTF8(str, outPtr, maxBytesToWrite) {
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
}
Module["stringToUTF8"] = stringToUTF8;

function lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
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
Module["lengthBytesUTF8"] = lengthBytesUTF8;
var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

function demangle(func) {
    var __cxa_demangle_func = Module["___cxa_demangle"] || Module["__cxa_demangle"];
    if (__cxa_demangle_func) {
        try {
            var s = func.substr(1);
            var len = lengthBytesUTF8(s) + 1;
            var buf = _malloc(len);
            stringToUTF8(s, buf, len);
            var status = _malloc(4);
            var ret = __cxa_demangle_func(buf, 0, 0, status);
            if (getValue(status, "i32") === 0 && ret) {
                return Pointer_stringify(ret)
            }
        } catch (e) {} finally {
            if (buf) _free(buf);
            if (status) _free(status);
            if (ret) _free(ret)
        }
        return func
    }
    Runtime.warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");
    return func
}

function demangleAll(text) {
    var regex = /__Z[\w\d_]+/g;
    return text.replace(regex, (function(x) {
        var y = demangle(x);
        return x === y ? x : x + " [" + y + "]"
    }))
}

function jsStackTrace() {
    var err = new Error;
    if (!err.stack) {
        try {
            throw new Error(0)
        } catch (e) {
            err = e
        }
        if (!err.stack) {
            return "(no stack trace available)"
        }
    }
    return err.stack.toString()
}

function stackTrace() {
    var js = jsStackTrace();
    if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
    return demangleAll(js)
}
Module["stackTrace"] = stackTrace;
var PAGE_SIZE = 16384;
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;
var MIN_TOTAL_MEMORY = 16777216;

function alignUp(x, multiple) {
    if (x % multiple > 0) {
        x += multiple - x % multiple
    }
    return x
}
var HEAP;
var buffer;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

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
    abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which adjusts the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")
}
if (!Module["reallocBuffer"]) Module["reallocBuffer"] = (function(size) {
    var ret;
    try {
        if (ArrayBuffer.transfer) {
            ret = ArrayBuffer.transfer(buffer, size)
        } else {
            var oldHEAP8 = HEAP8;
            ret = new ArrayBuffer(size);
            var temp = new Int8Array(ret);
            temp.set(oldHEAP8)
        }
    } catch (e) {
        return false
    }
    var success = _emscripten_replace_memory(ret);
    if (!success) return false;
    return ret
});

function enlargeMemory() {
    var PAGE_MULTIPLE = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
    var LIMIT = 2147483648 - PAGE_MULTIPLE;
    if (HEAP32[DYNAMICTOP_PTR >> 2] > LIMIT) {
        return false
    }
    TOTAL_MEMORY = Math.max(TOTAL_MEMORY, MIN_TOTAL_MEMORY);
    while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR >> 2]) {
        if (TOTAL_MEMORY <= 536870912) {
            TOTAL_MEMORY = alignUp(2 * TOTAL_MEMORY, PAGE_MULTIPLE)
        } else {
            TOTAL_MEMORY = Math.min(alignUp((3 * TOTAL_MEMORY + 2147483648) / 4, PAGE_MULTIPLE), LIMIT)
        }
    }
    var replacement = Module["reallocBuffer"](TOTAL_MEMORY);
    if (!replacement || replacement.byteLength != TOTAL_MEMORY) {
        return false
    }
    updateGlobalBuffer(replacement);
    updateGlobalBufferViews();
    return true
}
var byteLength;
try {
    byteLength = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get);
    byteLength(new ArrayBuffer(4))
} catch (e) {
    byteLength = (function(buffer) {
        return buffer.byteLength
    })
}
var TOTAL_STACK = Module["TOTAL_STACK"] || 5242880;
var TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
if (TOTAL_MEMORY < TOTAL_STACK) Module.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + TOTAL_MEMORY + "! (TOTAL_STACK=" + TOTAL_STACK + ")");
if (Module["buffer"]) {
    buffer = Module["buffer"]
} else {
    if (typeof WebAssembly === "object" && typeof WebAssembly.Memory === "function") {
        Module["wasmMemory"] = new WebAssembly.Memory({
            initial: TOTAL_MEMORY / WASM_PAGE_SIZE
        });
        buffer = Module["wasmMemory"].buffer
    } else {
        buffer = new ArrayBuffer(TOTAL_MEMORY)
    }
}
updateGlobalBufferViews();

function getTotalMemory() {
    return TOTAL_MEMORY
}
HEAP32[0] = 1668509029;
HEAP16[1] = 25459;
if (HEAPU8[2] !== 115 || HEAPU8[3] !== 99) throw "Runtime error: expected the system to be little-endian!";
Module["HEAP"] = HEAP;
Module["buffer"] = buffer;
Module["HEAP8"] = HEAP8;
Module["HEAP16"] = HEAP16;
Module["HEAP32"] = HEAP32;
Module["HEAPU8"] = HEAPU8;
Module["HEAPU16"] = HEAPU16;
Module["HEAPU32"] = HEAPU32;
Module["HEAPF32"] = HEAPF32;
Module["HEAPF64"] = HEAPF64;

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
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPRERUN__)
}

function ensureInitRuntime() {
    if (runtimeInitialized) return;
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
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPOSTRUN__)
}

function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb)
}
Module["addOnPreRun"] = addOnPreRun;

function addOnInit(cb) {
    __ATINIT__.unshift(cb)
}
Module["addOnInit"] = addOnInit;

function addOnPreMain(cb) {
    __ATMAIN__.unshift(cb)
}
Module["addOnPreMain"] = addOnPreMain;

function addOnExit(cb) {
    __ATEXIT__.unshift(cb)
}
Module["addOnExit"] = addOnExit;

function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb)
}
Module["addOnPostRun"] = addOnPostRun;

function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array
}
Module["intArrayFromString"] = intArrayFromString;

function intArrayToString(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
        var chr = array[i];
        if (chr > 255) {
            chr &= 255
        }
        ret.push(String.fromCharCode(chr))
    }
    return ret.join("")
}
Module["intArrayToString"] = intArrayToString;

function writeStringToMemory(string, buffer, dontAddNull) {
    Runtime.warnOnce("writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!");
    var lastChar, end;
    if (dontAddNull) {
        end = buffer + lengthBytesUTF8(string);
        lastChar = HEAP8[end]
    }
    stringToUTF8(string, buffer, Infinity);
    if (dontAddNull) HEAP8[end] = lastChar
}
Module["writeStringToMemory"] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
    HEAP8.set(array, buffer)
}
Module["writeArrayToMemory"] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
    for (var i = 0; i < str.length; ++i) {
        HEAP8[buffer++ >> 0] = str.charCodeAt(i)
    }
    if (!dontAddNull) HEAP8[buffer >> 0] = 0
}
Module["writeAsciiToMemory"] = writeAsciiToMemory;

function unSign(value, bits, ignore) {
    if (value >= 0) {
        return value
    }
    return bits <= 32 ? 2 * Math.abs(1 << bits - 1) + value : Math.pow(2, bits) + value
}

function reSign(value, bits, ignore) {
    if (value <= 0) {
        return value
    }
    var half = bits <= 32 ? Math.abs(1 << bits - 1) : Math.pow(2, bits - 1);
    if (value >= half && (bits <= 32 || value > half)) {
        value = -2 * half + value
    }
    return value
}
if (!Math["imul"] || Math["imul"](4294967295, 5) !== -5) Math["imul"] = function imul(a, b) {
    var ah = a >>> 16;
    var al = a & 65535;
    var bh = b >>> 16;
    var bl = b & 65535;
    return al * bl + (ah * bl + al * bh << 16) | 0
};
Math.imul = Math["imul"];
if (!Math["fround"]) {
    var froundBuffer = new Float32Array(1);
    Math["fround"] = (function(x) {
        froundBuffer[0] = x;
        return froundBuffer[0]
    })
}
Math.fround = Math["fround"];
if (!Math["clz32"]) Math["clz32"] = (function(x) {
    x = x >>> 0;
    for (var i = 0; i < 32; i++) {
        if (x & 1 << 31 - i) return i
    }
    return 32
});
Math.clz32 = Math["clz32"];
if (!Math["trunc"]) Math["trunc"] = (function(x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x)
});
Math.trunc = Math["trunc"];
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
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;

function getUniqueRunDependency(id) {
    return id
}

function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
}
Module["addRunDependency"] = addRunDependency;

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
Module["removeRunDependency"] = removeRunDependency;
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
var memoryInitializer = null;

function integrateWasmJS(Module) {
    var method = Module["wasmJSMethod"] || "native-wasm";
    Module["wasmJSMethod"] = method;
    var wasmTextFile = Module["wasmTextFile"] || "UE4Game-HTML5-Shipping.wast";
    var wasmBinaryFile = Module["wasmBinaryFile"] || "UE4Game-HTML5-Shipping.wasm";
    var asmjsCodeFile = Module["asmjsCodeFile"] || "UE4Game-HTML5-Shipping.asm.js";
    var wasmPageSize = 64 * 1024;
    var asm2wasmImports = {
        "f64-rem": (function(x, y) {
            return x % y
        }),
        "f64-to-int": (function(x) {
            return x | 0
        }),
        "i32s-div": (function(x, y) {
            return (x | 0) / (y | 0) | 0
        }),
        "i32u-div": (function(x, y) {
            return (x >>> 0) / (y >>> 0) >>> 0
        }),
        "i32s-rem": (function(x, y) {
            return (x | 0) % (y | 0) | 0
        }),
        "i32u-rem": (function(x, y) {
            return (x >>> 0) % (y >>> 0) >>> 0
        }),
        "debugger": (function() {
            debugger
        })
    };
    var info = {
        "global": null,
        "env": null,
        "asm2wasm": asm2wasmImports,
        "parent": Module
    };
    var exports = null;

    function lookupImport(mod, base) {
        var lookup = info;
        if (mod.indexOf(".") < 0) {
            lookup = (lookup || {})[mod]
        } else {
            var parts = mod.split(".");
            lookup = (lookup || {})[parts[0]];
            lookup = (lookup || {})[parts[1]]
        }
        if (base) {
            lookup = (lookup || {})[base]
        }
        if (lookup === undefined) {
            abort("bad lookupImport to (" + mod + ")." + base)
        }
        return lookup
    }

    function mergeMemory(newBuffer) {
        var oldBuffer = Module["buffer"];
        if (newBuffer.byteLength < oldBuffer.byteLength) {
            Module["printErr"]("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here")
        }
        var oldView = new Int8Array(oldBuffer);
        var newView = new Int8Array(newBuffer);
        if (!memoryInitializer) {
            oldView.set(newView.subarray(Module["STATIC_BASE"], Module["STATIC_BASE"] + Module["STATIC_BUMP"]), Module["STATIC_BASE"])
        }
        newView.set(oldView);
        updateGlobalBuffer(newBuffer);
        updateGlobalBufferViews()
    }
    var WasmTypes = {
        none: 0,
        i32: 1,
        i64: 2,
        f32: 3,
        f64: 4
    };

    function fixImports(imports) {
        if (!0) return imports;
        var ret = {};
        for (var i in imports) {
            var fixed = i;
            if (fixed[0] == "_") fixed = fixed.substr(1);
            ret[fixed] = imports[i]
        }
        return ret
    }

    function getBinary() {
        var binary;
        if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            binary = Module["wasmBinary"];
            assert(binary, "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)");
            binary = new Uint8Array(binary)
        } else {
            binary = Module["readBinary"](wasmBinaryFile)
        }
        return binary
    }

    function doJustAsm(global, env, providedBuffer) {
        if (typeof Module["asm"] !== "function" || Module["asm"] === methodHandler) {
            if (!Module["asmPreload"]) {
                eval(Module["read"](asmjsCodeFile))
            } else {
                Module["asm"] = Module["asmPreload"]
            }
        }
        if (typeof Module["asm"] !== "function") {
            Module["printErr"]("asm evalling did not set the module properly");
            return false
        }
        return Module["asm"](global, env, providedBuffer)
    }

    function doNativeWasm(global, env, providedBuffer) {
        if (typeof WebAssembly !== "object") {
            Module["printErr"]("no native wasm support detected");
            return false
        }
        if (!(Module["wasmMemory"] instanceof WebAssembly.Memory)) {
            Module["printErr"]("no native wasm Memory in use");
            return false
        }
        env["memory"] = Module["wasmMemory"];
        info["global"] = {
            "NaN": NaN,
            "Infinity": Infinity
        };
        info["global.Math"] = global.Math;
        info["env"] = env;

        function receiveInstance(instance) {
            exports = instance.exports;
            if (exports.memory) mergeMemory(exports.memory);
            Module["asm"] = exports;
            Module["usingWasm"] = true
        }
        Module["printErr"]("asynchronously preparing wasm");
        addRunDependency("wasm-instantiate");
        if (Module["manualWasmInstantiate"]) {
            Module["manualWasmInstantiate"](info, receiveInstance)
        } else {
            WebAssembly.instantiate(getBinary(), info).then((function(output) {
                receiveInstance(output.instance);
                removeRunDependency("wasm-instantiate")
            })).catch((function(reason) {
                Module["printErr"]("failed to asynchronously prepare wasm:\n  " + reason)
            }))
        }
        return {}
    }

    function doWasmPolyfill(global, env, providedBuffer, method) {
        if (typeof WasmJS !== "function") {
            Module["printErr"]("WasmJS not detected - polyfill not bundled?");
            return false
        }
        var wasmJS = WasmJS({});
        wasmJS["outside"] = Module;
        wasmJS["info"] = info;
        wasmJS["lookupImport"] = lookupImport;
        assert(providedBuffer === Module["buffer"]);
        info.global = global;
        info.env = env;
        assert(providedBuffer === Module["buffer"]);
        env["memory"] = providedBuffer;
        assert(env["memory"] instanceof ArrayBuffer);
        wasmJS["providedTotalMemory"] = Module["buffer"].byteLength;
        var code;
        if (method === "interpret-binary") {
            code = getBinary()
        } else {
            code = Module["read"](method == "interpret-asm2wasm" ? asmjsCodeFile : wasmTextFile)
        }
        var temp;
        if (method == "interpret-asm2wasm") {
            temp = wasmJS["_malloc"](code.length + 1);
            wasmJS["writeAsciiToMemory"](code, temp);
            wasmJS["_load_asm2wasm"](temp)
        } else if (method === "interpret-s-expr") {
            temp = wasmJS["_malloc"](code.length + 1);
            wasmJS["writeAsciiToMemory"](code, temp);
            wasmJS["_load_s_expr2wasm"](temp)
        } else if (method === "interpret-binary") {
            temp = wasmJS["_malloc"](code.length);
            wasmJS["HEAPU8"].set(code, temp);
            wasmJS["_load_binary2wasm"](temp, code.length)
        } else {
            throw "what? " + method
        }
        wasmJS["_free"](temp);
        wasmJS["_instantiate"](temp);
        if (Module["newBuffer"]) {
            mergeMemory(Module["newBuffer"]);
            Module["newBuffer"] = null
        }
        exports = wasmJS["asmExports"];
        return exports
    }
    Module["asmPreload"] = Module["asm"];
    Module["reallocBuffer"] = (function(size) {
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
        } else {
            exports["__growWasmMemory"]((size - oldSize) / wasmPageSize);
            return Module["buffer"] !== old ? Module["buffer"] : null
        }
    });
    Module["asm"] = (function(global, env, providedBuffer) {
        global = fixImports(global);
        env = fixImports(env);
        if (!env["table"]) {
            var TABLE_SIZE = Module["wasmTableSize"];
            if (TABLE_SIZE === undefined) TABLE_SIZE = 1024;
            var MAX_TABLE_SIZE = Module["wasmMaxTableSize"];
            if (typeof WebAssembly === "object" && typeof WebAssembly.Table === "function") {
                if (MAX_TABLE_SIZE !== undefined) {
                    env["table"] = new WebAssembly.Table({
                        initial: TABLE_SIZE,
                        maximum: MAX_TABLE_SIZE,
                        element: "anyfunc"
                    })
                } else {
                    env["table"] = new WebAssembly.Table({
                        initial: TABLE_SIZE,
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
        var methods = method.split(",");
        for (var i = 0; i < methods.length; i++) {
            var curr = methods[i];
            Module["printErr"]("trying binaryen method: " + curr);
            if (curr === "native-wasm") {
                if (exports = doNativeWasm(global, env, providedBuffer)) break
            } else if (curr === "asmjs") {
                if (exports = doJustAsm(global, env, providedBuffer)) break
            } else if (curr === "interpret-asm2wasm" || curr === "interpret-s-expr" || curr === "interpret-binary") {
                if (exports = doWasmPolyfill(global, env, providedBuffer, curr)) break
            } else {
                throw "bad method: " + curr
            }
        }
        if (!exports) throw "no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods";
        Module["printErr"]("binaryen method succeeded.");
        return exports
    });
    var methodHandler = Module["asm"]
}
integrateWasmJS(Module);
var ASM_CONSTS = [(function() {
    var callstack = new Error;
    throw callstack.stack
}), (function() {
    {
        var hoststring = location.href.substring(0, location.href.lastIndexOf("/"));
        var buffer = Module._malloc(hoststring.length);
        Module.writeAsciiToMemory(hoststring, buffer);
        return buffer
    }
}), (function() {
    {
        return Module.TOTAL_MEMORY
    }
}), (function() {
    {
        if (Module["UE4_resizeCanvas"]) return Module["UE4_resizeCanvas"](true);
        return false
    }
}), (function() {
    {
        return Module["UE4_fullscreenScaleMode"]
    }
}), (function() {
    {
        return Module["UE4_fullscreenCanvasResizeMode"]
    }
}), (function() {
    {
        return Module["UE4_fullscreenFilteringMode"]
    }
}), (function() {
    {
        return Module["UE4_useSoftFullscreenMode"]
    }
}), (function($0) {
    {
        var InUrl = Pointer_stringify($0);
        console.log("Opening " + InUrl);
        window.open(InUrl)
    }
}), (function() {
    {
        if (typeof AudioContext !== "undefined") {
            return 1
        } else if (typeof webkitAudioContext !== "undefined") {
            return 1
        }
        return 0
    }
}), (function() {
    {
        if (typeof SDL2 === "undefined") SDL2 = {};
        if (typeof SDL2.audio === "undefined") SDL2.audio = {};
        if (!SDL2.audioContext) {
            if (typeof AudioContext !== "undefined") {
                SDL2.audioContext = new AudioContext
            } else if (typeof webkitAudioContext !== "undefined") {
                SDL2.audioContext = new webkitAudioContext
            } else {
                throw "Web Audio API is not available!"
            }
        }
    }
}), (function() {
    {
        return SDL2.audioContext["sampleRate"]
    }
}), (function($0, $1, $2, $3) {
    {
        SDL2.audio.scriptProcessorNode = SDL2.audioContext["createScriptProcessor"]($1, 0, $0);
        SDL2.audio.scriptProcessorNode["onaudioprocess"] = (function(e) {
            SDL2.audio.currentOutputBuffer = e["outputBuffer"];
            Runtime.dynCall("vi", $2, [$3])
        });
        SDL2.audio.scriptProcessorNode["connect"](SDL2.audioContext["destination"])
    }
}), (function($0, $1) {
    {
        var numChannels = SDL2.audio.currentOutputBuffer["numberOfChannels"];
        for (var c = 0; c < numChannels; ++c) {
            var channelData = SDL2.audio.currentOutputBuffer["getChannelData"](c);
            if (channelData.length != $1) {
                throw "Web Audio output buffer length mismatch! Destination size: " + channelData.length + " samples vs expected " + $1 + " samples!"
            }
            for (var j = 0; j < $1; ++j) {
                channelData[j] = getValue($0 + (j * numChannels + c) * 4, "float")
            }
        }
    }
}), (function() {
    {
        var canvas = Module["canvas"];
        if (canvas.parentNode.id != "SDLFullscreenElement") {
            var canvasContainer = document.createElement("div");
            canvasContainer.id = "SDLFullscreenElement";
            canvas.parentNode.insertBefore(canvasContainer, canvas);
            canvasContainer.appendChild(canvas)
        }
    }
}), (function() {
    {
        var canvas = Module["canvas"];
        if (canvas.parentNode.id == "SDLFullscreenElement") {
            var canvasContainer = canvas.parentNode;
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer)
        }
    }
}), (function($0, $1, $2) {
    {
        var ctx = Module["canvas"].getContext("2d");
        var image = ctx.createImageData($0, $1);
        var data = image.data;
        var src = $2 >> 2;
        var dst = 0;
        var isScreen = true;
        var num;
        if (typeof CanvasPixelArray !== "undefined" && data instanceof CanvasPixelArray) {
            num = data.length;
            while (dst < num) {
                var val = HEAP32[src];
                data[dst] = val & 255;
                data[dst + 1] = val >> 8 & 255;
                data[dst + 2] = val >> 16 & 255;
                data[dst + 3] = isScreen ? 255 : val >> 24 & 255;
                src++;
                dst += 4
            }
        } else {
            var data32 = new Uint32Array(data.buffer);
            num = data32.length;
            if (isScreen) {
                while (dst < num) {
                    data32[dst++] = HEAP32[src++] | 4278190080
                }
            } else {
                while (dst < num) {
                    data32[dst++] = HEAP32[src++]
                }
            }
        }
        ctx.putImageData(image, 0, 0);
        return 0
    }
}), (function($0) {
    {
        if (Module["canvas"]) {
            Module["canvas"].style["cursor"] = Module["Pointer_stringify"]($0)
        }
        return 0
    }
}), (function() {
    if (Module["canvas"]) {
        Module["canvas"].style["cursor"] = "none"
    }
}), (function($0, $1) {
    {
        Module.printErr("bad name in getProcAddress: " + [Pointer_stringify($0), Pointer_stringify($1)])
    }
})];

function _emscripten_asm_const_ii(code, a0) {
    return ASM_CONSTS[code](a0)
}

function _emscripten_asm_const_i(code) {
    return ASM_CONSTS[code]()
}

function _emscripten_asm_const_iiiii(code, a0, a1, a2, a3) {
    return ASM_CONSTS[code](a0, a1, a2, a3)
}

function _emscripten_asm_const_iiii(code, a0, a1, a2) {
    return ASM_CONSTS[code](a0, a1, a2)
}

function _emscripten_asm_const_v(code) {
    return ASM_CONSTS[code]()
}

function _emscripten_asm_const_iii(code, a0, a1) {
    return ASM_CONSTS[code](a0, a1)
}
STATIC_BASE = 1024;
STATICTOP = STATIC_BASE + 8093744;
__ATINIT__.push({
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_29_of_37_cpp()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_295()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_16_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_17_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_18_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_19_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_20_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_21_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_22_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_23_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_24_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_25_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_26_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_27_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_28_of_37_cpp()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_292()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_30_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_31_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_32_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_33_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_34_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_35_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_36_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_37_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Engine_generated_1_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Engine_generated_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Engine_generated_3_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Engine_generated_4_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_MapPakDownloader_cpp()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_867()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_6_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Niagara_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Niagara_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_SlateNullRenderer_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_NetworkReplayStreaming_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_NullNetworkReplayStreaming_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_HttpNetworkReplayStreaming_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Advertising_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_GameLiveStreaming_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_GameLiveStreaming_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_1_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_2_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_3_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_4_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_5_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Core_1_of_7_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_7_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_8_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_9_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_10_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_11_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_12_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_13_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_14_of_37_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Engine_15_of_37_cpp()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_272()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_277()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_286()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_289()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_LocationServicesBPLibrary_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_HTML5Networking_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_HTML5Networking_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_OnlineSubsystem_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_OnlineSubsystem_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_OnlineSubsystemNull_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_OnlineSubsystemUtils_1_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_OnlineSubsystemUtils_2_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_OnlineSubsystemUtils_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_ArchVisCharacter_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_ArchVisCharacter_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_CableComponent_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_CableComponent_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_ExampleDeviceProfileSelector_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_LocationServicesBPLibrary_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_CharacterAI_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_MobilePatchingUtils_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_MobilePatchingUtils_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_PhysXVehicles_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_PhysXVehicles_generated_cpp()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_16()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_SwCollision_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_SwFactory_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_SwInterCollision_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_SwSelfCollision_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_SwSolver_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_SwSolverKernel_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_PtDynamics_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_NpActor_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_SessionMessages_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Core_2_of_7_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Core_3_of_7_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Core_4_of_7_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Core_5_of_7_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Core_6_of_7_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Core_7_of_7_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Media_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_MediaUtils_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_MediaAssets_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_MediaAssets_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_PakFile_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Serialization_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Serialization_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_ALAudio_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_VectorVM_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_SessionMessages_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_SessionServices_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_ImageCore_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Voice_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_BuildPatchServices_1_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_BuildPatchServices_2_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_BuildPatchServices_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Paper2D_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Paper2D_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_LightPropagationVolumeRuntime_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_LightPropagationVolumeRuntime_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_FacialAnimation_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_FacialAnimation_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_HeadMountedDisplay_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_AppFramework_2_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_SandboxFile_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Sockets_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Networking_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_NullDrv_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_ShaderCore_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_UtilityShaders_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_OpenGLDrv_1_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_OpenGLDrv_2_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_RHI_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_RenderCore_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_MaterialShaderQualitySettings_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_MaterialShaderQualitySettings_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_HeadMountedDisplay_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_AppFramework_1_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Renderer_1_of_10_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Renderer_2_of_10_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Renderer_3_of_10_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Renderer_4_of_10_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Renderer_5_of_10_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Renderer_6_of_10_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Renderer_7_of_10_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Renderer_8_of_10_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Renderer_9_of_10_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Renderer_10_of_10_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Foliage_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Foliage_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Landscape_1_of_3_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_SlateCore_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_UE4Game_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Json_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Projects_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_CoreUObject_1_of_6_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_CoreUObject_2_of_6_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_CoreUObject_3_of_6_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_CoreUObject_4_of_6_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_CoreUObject_5_of_6_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_CoreUObject_6_of_6_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_CoreUObject_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_InputCore_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_InputCore_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_SlateCore_1_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_SlateCore_2_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Landscape_2_of_3_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_ImageWrapper_cpp()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_221()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_222()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Slate_1_of_5_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Slate_2_of_5_cpp()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_184()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_185()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_186()
    })
}, {
    func: (function() {
        ___cxx_global_var_init_187()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Slate_3_of_5_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Slate_4_of_5_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Slate_5_of_5_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Slate_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_GeometryCache_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_GameplayTags_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_GameplayTags_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_GameplayTasks_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_GameplayTasks_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_AIModule_1_of_3_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_AIModule_2_of_3_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_AIModule_3_of_3_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_AIModule_generated_1_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_AIModule_generated_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_DatabaseSupport_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_ReliabilityHandlerComponent_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_PacketHandler_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_PacketHandler_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_HardwareSurvey_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_SynthBenchmark_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_GeometryCache_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_ActorSequence_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_ActorSequence_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_JsonUtilities_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_JsonUtilities_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_LevelSequence_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_LevelSequence_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_MovieSceneCapture_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_MovieSceneCapture_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_MoviePlayer_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_MoviePlayer_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_StreamingPauseRendering_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_VectorVM_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Internationalization_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Landscape_3_of_3_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Landscape_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_HTTP_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_MovieScene_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_MovieScene_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_AnimGraphRuntime_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_AnimGraphRuntime_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_MovieSceneTracks_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_MovieSceneTracks_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_SlateRHIRenderer_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_UMG_1_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_UMG_2_of_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_UMG_generated_1_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_UMG_generated_2_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Launch_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_CinematicCamera_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_CinematicCamera_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Analytics_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_AnalyticsET_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Navmesh_1_of_3_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Navmesh_2_of_3_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Navmesh_3_of_3_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_Messaging_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_AssetRegistry_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_EngineMessages_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_EngineMessages_generated_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_Module_EngineSettings_cpp()
    })
}, {
    func: (function() {
        __GLOBAL__sub_I_EngineSettings_generated_cpp()
    })
});
memoryInitializer = Module["wasmJSMethod"].indexOf("asmjs") >= 0 || Module["wasmJSMethod"].indexOf("interpret-asm2wasm") >= 0 ? "UE4Game-HTML5-Shipping.js.mem" : null;
var STATIC_BUMP = 8093744;
Module["STATIC_BASE"] = STATIC_BASE;
Module["STATIC_BUMP"] = STATIC_BUMP;
var tempDoublePtr = STATICTOP;
STATICTOP += 16;
var JSEvents = {
    keyEvent: 0,
    mouseEvent: 0,
    wheelEvent: 0,
    uiEvent: 0,
    focusEvent: 0,
    deviceOrientationEvent: 0,
    deviceMotionEvent: 0,
    fullscreenChangeEvent: 0,
    pointerlockChangeEvent: 0,
    visibilityChangeEvent: 0,
    touchEvent: 0,
    lastGamepadState: null,
    lastGamepadStateFrame: null,
    numGamepadsConnected: 0,
    previousFullscreenElement: null,
    previousScreenX: null,
    previousScreenY: null,
    removeEventListenersRegistered: false,
    staticInit: (function() {
        if (typeof window !== "undefined") {
            window.addEventListener("gamepadconnected", (function() {
                ++JSEvents.numGamepadsConnected
            }));
            window.addEventListener("gamepaddisconnected", (function() {
                --JSEvents.numGamepadsConnected
            }))
        }
    }),
    registerRemoveEventListeners: (function() {
        if (!JSEvents.removeEventListenersRegistered) {
            __ATEXIT__.push((function() {
                for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
                    JSEvents._removeHandler(i)
                }
            }));
            JSEvents.removeEventListenersRegistered = true
        }
    }),
    findEventTarget: (function(target) {
        if (target) {
            if (typeof target == "number") {
                target = Pointer_stringify(target)
            }
            if (target == "#window") return window;
            else if (target == "#document") return document;
            else if (target == "#screen") return window.screen;
            else if (target == "#canvas") return Module["canvas"];
            if (typeof target == "string") return document.getElementById(target);
            else return target
        } else {
            return window
        }
    }),
    deferredCalls: [],
    deferCall: (function(targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
            if (arrA.length != arrB.length) return false;
            for (var i in arrA) {
                if (arrA[i] != arrB[i]) return false
            }
            return true
        }
        for (var i in JSEvents.deferredCalls) {
            var call = JSEvents.deferredCalls[i];
            if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
                return
            }
        }
        JSEvents.deferredCalls.push({
            targetFunction: targetFunction,
            precedence: precedence,
            argsList: argsList
        });
        JSEvents.deferredCalls.sort((function(x, y) {
            return x.precedence < y.precedence
        }))
    }),
    removeDeferredCalls: (function(targetFunction) {
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
            if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
                JSEvents.deferredCalls.splice(i, 1);
                --i
            }
        }
    }),
    canPerformEventHandlerRequests: (function() {
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls
    }),
    runDeferredCalls: (function() {
        if (!JSEvents.canPerformEventHandlerRequests()) {
            return
        }
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
            var call = JSEvents.deferredCalls[i];
            JSEvents.deferredCalls.splice(i, 1);
            --i;
            call.targetFunction.apply(this, call.argsList)
        }
    }),
    inEventHandler: 0,
    currentEventHandler: null,
    eventHandlers: [],
    isInternetExplorer: (function() {
        return navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0
    }),
    removeAllHandlersOnTarget: (function(target, eventTypeString) {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
                JSEvents._removeHandler(i--)
            }
        }
    }),
    _removeHandler: (function(i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1)
    }),
    registerOrRemoveHandler: (function(eventHandler) {
        var jsEventHandler = function jsEventHandler(event) {
            ++JSEvents.inEventHandler;
            JSEvents.currentEventHandler = eventHandler;
            JSEvents.runDeferredCalls();
            eventHandler.handlerFunc(event);
            JSEvents.runDeferredCalls();
            --JSEvents.inEventHandler
        };
        if (eventHandler.callbackfunc) {
            eventHandler.eventListenerFunc = jsEventHandler;
            var programmaticallyInjectingInputStream = location.search.indexOf("playback") != -1;
            if (!programmaticallyInjectingInputStream || eventHandler.eventTypeString.indexOf("mouse") == -1 && eventHandler.eventTypeString.indexOf("key") == -1 && eventHandler.eventTypeString.indexOf("blur") == -1 && eventHandler.eventTypeString.indexOf("focus") == -1) {
                eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture)
            }
            JSEvents.eventHandlers.push(eventHandler);
            JSEvents.registerRemoveEventListeners()
        } else {
            for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
                if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
                    JSEvents._removeHandler(i--)
                }
            }
        }
    }),
    registerKeyEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.keyEvent) {
            JSEvents.keyEvent = _malloc(164)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            stringToUTF8(e.key ? e.key : "", JSEvents.keyEvent + 0, 32);
            stringToUTF8(e.code ? e.code : "", JSEvents.keyEvent + 32, 32);
            HEAP32[JSEvents.keyEvent + 64 >> 2] = e.location;
            HEAP32[JSEvents.keyEvent + 68 >> 2] = e.ctrlKey;
            HEAP32[JSEvents.keyEvent + 72 >> 2] = e.shiftKey;
            HEAP32[JSEvents.keyEvent + 76 >> 2] = e.altKey;
            HEAP32[JSEvents.keyEvent + 80 >> 2] = e.metaKey;
            HEAP32[JSEvents.keyEvent + 84 >> 2] = e.repeat;
            stringToUTF8(e.locale ? e.locale : "", JSEvents.keyEvent + 88, 32);
            stringToUTF8(e.char ? e.char : "", JSEvents.keyEvent + 120, 32);
            HEAP32[JSEvents.keyEvent + 152 >> 2] = e.charCode;
            HEAP32[JSEvents.keyEvent + 156 >> 2] = e.keyCode;
            HEAP32[JSEvents.keyEvent + 160 >> 2] = e.which;
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.keyEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: JSEvents.findEventTarget(target),
            allowsDeferredCalls: JSEvents.isInternetExplorer() ? false : true,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    getBoundingClientRectOrZeros: (function(target) {
        return target.getBoundingClientRect ? target.getBoundingClientRect() : {
            left: 0,
            top: 0
        }
    }),
    fillMouseEventData: (function(eventStruct, e, target) {
        HEAPF64[eventStruct >> 3] = JSEvents.tick();
        HEAP32[eventStruct + 8 >> 2] = e.screenX;
        HEAP32[eventStruct + 12 >> 2] = e.screenY;
        HEAP32[eventStruct + 16 >> 2] = e.clientX;
        HEAP32[eventStruct + 20 >> 2] = e.clientY;
        HEAP32[eventStruct + 24 >> 2] = e.ctrlKey;
        HEAP32[eventStruct + 28 >> 2] = e.shiftKey;
        HEAP32[eventStruct + 32 >> 2] = e.altKey;
        HEAP32[eventStruct + 36 >> 2] = e.metaKey;
        HEAP16[eventStruct + 40 >> 1] = e.button;
        HEAP16[eventStruct + 42 >> 1] = e.buttons;
        HEAP32[eventStruct + 44 >> 2] = e["movementX"] || e["mozMovementX"] || e["webkitMovementX"] || e.screenX - JSEvents.previousScreenX;
        HEAP32[eventStruct + 48 >> 2] = e["movementY"] || e["mozMovementY"] || e["webkitMovementY"] || e.screenY - JSEvents.previousScreenY;
        if (Module["canvas"]) {
            var rect = Module["canvas"].getBoundingClientRect();
            HEAP32[eventStruct + 60 >> 2] = e.clientX - rect.left;
            HEAP32[eventStruct + 64 >> 2] = e.clientY - rect.top
        } else {
            HEAP32[eventStruct + 60 >> 2] = 0;
            HEAP32[eventStruct + 64 >> 2] = 0
        }
        if (target) {
            var rect = JSEvents.getBoundingClientRectOrZeros(target);
            HEAP32[eventStruct + 52 >> 2] = e.clientX - rect.left;
            HEAP32[eventStruct + 56 >> 2] = e.clientY - rect.top
        } else {
            HEAP32[eventStruct + 52 >> 2] = 0;
            HEAP32[eventStruct + 56 >> 2] = 0
        }
        JSEvents.previousScreenX = e.screenX;
        JSEvents.previousScreenY = e.screenY
    }),
    registerMouseEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.mouseEvent) {
            JSEvents.mouseEvent = _malloc(72)
        }
        target = JSEvents.findEventTarget(target);
        var handlerFunc = (function(event) {
            var e = event || window.event;
            JSEvents.fillMouseEventData(JSEvents.mouseEvent, e, target);
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.mouseEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: target,
            allowsDeferredCalls: eventTypeString != "mousemove" && eventTypeString != "mouseenter" && eventTypeString != "mouseleave",
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        if (JSEvents.isInternetExplorer() && eventTypeString == "mousedown") eventHandler.allowsDeferredCalls = false;
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    registerWheelEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.wheelEvent) {
            JSEvents.wheelEvent = _malloc(104)
        }
        target = JSEvents.findEventTarget(target);
        var wheelHandlerFunc = (function(event) {
            var e = event || window.event;
            JSEvents.fillMouseEventData(JSEvents.wheelEvent, e, target);
            HEAPF64[JSEvents.wheelEvent + 72 >> 3] = e["deltaX"];
            HEAPF64[JSEvents.wheelEvent + 80 >> 3] = e["deltaY"];
            HEAPF64[JSEvents.wheelEvent + 88 >> 3] = e["deltaZ"];
            HEAP32[JSEvents.wheelEvent + 96 >> 2] = e["deltaMode"];
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.wheelEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var mouseWheelHandlerFunc = (function(event) {
            var e = event || window.event;
            JSEvents.fillMouseEventData(JSEvents.wheelEvent, e, target);
            HEAPF64[JSEvents.wheelEvent + 72 >> 3] = e["wheelDeltaX"] || 0;
            HEAPF64[JSEvents.wheelEvent + 80 >> 3] = -(e["wheelDeltaY"] ? e["wheelDeltaY"] : e["wheelDelta"]);
            HEAPF64[JSEvents.wheelEvent + 88 >> 3] = 0;
            HEAP32[JSEvents.wheelEvent + 96 >> 2] = 0;
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.wheelEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: target,
            allowsDeferredCalls: true,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: eventTypeString == "wheel" ? wheelHandlerFunc : mouseWheelHandlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    pageScrollPos: (function() {
        if (window.pageXOffset > 0 || window.pageYOffset > 0) {
            return [window.pageXOffset, window.pageYOffset]
        }
        if (typeof document.documentElement.scrollLeft !== "undefined" || typeof document.documentElement.scrollTop !== "undefined") {
            return [document.documentElement.scrollLeft, document.documentElement.scrollTop]
        }
        return [document.body.scrollLeft | 0, document.body.scrollTop | 0]
    }),
    registerUiEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.uiEvent) {
            JSEvents.uiEvent = _malloc(36)
        }
        if (eventTypeString == "scroll" && !target) {
            target = document
        } else {
            target = JSEvents.findEventTarget(target)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            if (e.target != target) {
                return
            }
            var scrollPos = JSEvents.pageScrollPos();
            HEAP32[JSEvents.uiEvent >> 2] = e.detail;
            HEAP32[JSEvents.uiEvent + 4 >> 2] = document.body.clientWidth;
            HEAP32[JSEvents.uiEvent + 8 >> 2] = document.body.clientHeight;
            HEAP32[JSEvents.uiEvent + 12 >> 2] = window.innerWidth;
            HEAP32[JSEvents.uiEvent + 16 >> 2] = window.innerHeight;
            HEAP32[JSEvents.uiEvent + 20 >> 2] = window.outerWidth;
            HEAP32[JSEvents.uiEvent + 24 >> 2] = window.outerHeight;
            HEAP32[JSEvents.uiEvent + 28 >> 2] = scrollPos[0];
            HEAP32[JSEvents.uiEvent + 32 >> 2] = scrollPos[1];
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.uiEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: target,
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    getNodeNameForTarget: (function(target) {
        if (!target) return "";
        if (target == window) return "#window";
        if (target == window.screen) return "#screen";
        return target && target.nodeName ? target.nodeName : ""
    }),
    registerFocusEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.focusEvent) {
            JSEvents.focusEvent = _malloc(256)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            var nodeName = JSEvents.getNodeNameForTarget(e.target);
            var id = e.target.id ? e.target.id : "";
            stringToUTF8(nodeName, JSEvents.focusEvent + 0, 128);
            stringToUTF8(id, JSEvents.focusEvent + 128, 128);
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.focusEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: JSEvents.findEventTarget(target),
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    tick: (function() {
        if (window["performance"] && window["performance"]["now"]) return window["performance"]["now"]();
        else return Date.now()
    }),
    registerDeviceOrientationEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.deviceOrientationEvent) {
            JSEvents.deviceOrientationEvent = _malloc(40)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            HEAPF64[JSEvents.deviceOrientationEvent >> 3] = JSEvents.tick();
            HEAPF64[JSEvents.deviceOrientationEvent + 8 >> 3] = e.alpha;
            HEAPF64[JSEvents.deviceOrientationEvent + 16 >> 3] = e.beta;
            HEAPF64[JSEvents.deviceOrientationEvent + 24 >> 3] = e.gamma;
            HEAP32[JSEvents.deviceOrientationEvent + 32 >> 2] = e.absolute;
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.deviceOrientationEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: JSEvents.findEventTarget(target),
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    registerDeviceMotionEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.deviceMotionEvent) {
            JSEvents.deviceMotionEvent = _malloc(80)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            HEAPF64[JSEvents.deviceOrientationEvent >> 3] = JSEvents.tick();
            HEAPF64[JSEvents.deviceMotionEvent + 8 >> 3] = e.acceleration.x;
            HEAPF64[JSEvents.deviceMotionEvent + 16 >> 3] = e.acceleration.y;
            HEAPF64[JSEvents.deviceMotionEvent + 24 >> 3] = e.acceleration.z;
            HEAPF64[JSEvents.deviceMotionEvent + 32 >> 3] = e.accelerationIncludingGravity.x;
            HEAPF64[JSEvents.deviceMotionEvent + 40 >> 3] = e.accelerationIncludingGravity.y;
            HEAPF64[JSEvents.deviceMotionEvent + 48 >> 3] = e.accelerationIncludingGravity.z;
            HEAPF64[JSEvents.deviceMotionEvent + 56 >> 3] = e.rotationRate.alpha;
            HEAPF64[JSEvents.deviceMotionEvent + 64 >> 3] = e.rotationRate.beta;
            HEAPF64[JSEvents.deviceMotionEvent + 72 >> 3] = e.rotationRate.gamma;
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.deviceMotionEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: JSEvents.findEventTarget(target),
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    screenOrientation: (function() {
        if (!window.screen) return undefined;
        return window.screen.orientation || window.screen.mozOrientation || window.screen.webkitOrientation || window.screen.msOrientation
    }),
    fillOrientationChangeEventData: (function(eventStruct, e) {
        var orientations = ["portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"];
        var orientations2 = ["portrait", "portrait", "landscape", "landscape"];
        var orientationString = JSEvents.screenOrientation();
        var orientation = orientations.indexOf(orientationString);
        if (orientation == -1) {
            orientation = orientations2.indexOf(orientationString)
        }
        HEAP32[eventStruct >> 2] = 1 << orientation;
        HEAP32[eventStruct + 4 >> 2] = window.orientation
    }),
    registerOrientationChangeEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.orientationChangeEvent) {
            JSEvents.orientationChangeEvent = _malloc(8)
        }
        if (!target) {
            target = window.screen
        } else {
            target = JSEvents.findEventTarget(target)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            JSEvents.fillOrientationChangeEventData(JSEvents.orientationChangeEvent, e);
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.orientationChangeEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        if (eventTypeString == "orientationchange" && window.screen.mozOrientation !== undefined) {
            eventTypeString = "mozorientationchange"
        }
        var eventHandler = {
            target: target,
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    fullscreenEnabled: (function() {
        return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled
    }),
    fillFullscreenChangeEventData: (function(eventStruct, e) {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        var isFullscreen = !!fullscreenElement;
        HEAP32[eventStruct >> 2] = isFullscreen;
        HEAP32[eventStruct + 4 >> 2] = JSEvents.fullscreenEnabled();
        var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
        var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
        var id = reportedElement && reportedElement.id ? reportedElement.id : "";
        stringToUTF8(nodeName, eventStruct + 8, 128);
        stringToUTF8(id, eventStruct + 136, 128);
        HEAP32[eventStruct + 264 >> 2] = reportedElement ? reportedElement.clientWidth : 0;
        HEAP32[eventStruct + 268 >> 2] = reportedElement ? reportedElement.clientHeight : 0;
        HEAP32[eventStruct + 272 >> 2] = screen.width;
        HEAP32[eventStruct + 276 >> 2] = screen.height;
        if (isFullscreen) {
            JSEvents.previousFullscreenElement = fullscreenElement
        }
    }),
    registerFullscreenChangeEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.fullscreenChangeEvent) {
            JSEvents.fullscreenChangeEvent = _malloc(280)
        }
        if (!target) {
            target = document
        } else {
            target = JSEvents.findEventTarget(target)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            JSEvents.fillFullscreenChangeEventData(JSEvents.fullscreenChangeEvent, e);
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.fullscreenChangeEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: target,
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    resizeCanvasForFullscreen: (function(target, strategy) {
        var restoreOldStyle = __registerRestoreOldStyle(target);
        var cssWidth = strategy.softFullscreen ? window.innerWidth : screen.width;
        var cssHeight = strategy.softFullscreen ? window.innerHeight : screen.height;
        var rect = target.getBoundingClientRect();
        var windowedCssWidth = rect.right - rect.left;
        var windowedCssHeight = rect.bottom - rect.top;
        var windowedRttWidth = target.width;
        var windowedRttHeight = target.height;
        if (strategy.scaleMode == 3) {
            __setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
            cssWidth = windowedCssWidth;
            cssHeight = windowedCssHeight
        } else if (strategy.scaleMode == 2) {
            if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
                var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
                __setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
                cssHeight = desiredCssHeight
            } else {
                var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
                __setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
                cssWidth = desiredCssWidth
            }
        }
        if (!target.style.backgroundColor) target.style.backgroundColor = "black";
        if (!document.body.style.backgroundColor) document.body.style.backgroundColor = "black";
        target.style.width = cssWidth + "px";
        target.style.height = cssHeight + "px";
        if (strategy.filteringMode == 1) {
            target.style.imageRendering = "optimizeSpeed";
            target.style.imageRendering = "-moz-crisp-edges";
            target.style.imageRendering = "-o-crisp-edges";
            target.style.imageRendering = "-webkit-optimize-contrast";
            target.style.imageRendering = "optimize-contrast";
            target.style.imageRendering = "crisp-edges";
            target.style.imageRendering = "pixelated"
        }
        var dpiScale = strategy.canvasResolutionScaleMode == 2 ? window.devicePixelRatio : 1;
        if (strategy.canvasResolutionScaleMode != 0) {
            target.width = cssWidth * dpiScale;
            target.height = cssHeight * dpiScale;
            if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, target.width, target.height)
        }
        return restoreOldStyle
    }),
    requestFullscreen: (function(target, strategy) {
        if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
            JSEvents.resizeCanvasForFullscreen(target, strategy)
        }
        if (target.requestFullscreen) {
            target.requestFullscreen()
        } else if (target.msRequestFullscreen) {
            target.msRequestFullscreen()
        } else if (target.mozRequestFullScreen) {
            target.mozRequestFullScreen()
        } else if (target.mozRequestFullscreen) {
            target.mozRequestFullscreen()
        } else if (target.webkitRequestFullscreen) {
            target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        } else {
            if (typeof JSEvents.fullscreenEnabled() === "undefined") {
                return -1
            } else {
                return -3
            }
        }
        if (strategy.canvasResizedCallback) {
            Module["dynCall_iiii"](strategy.canvasResizedCallback, 37, 0, strategy.canvasResizedCallbackUserData)
        }
        return 0
    }),
    fillPointerlockChangeEventData: (function(eventStruct, e) {
        var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
        var isPointerlocked = !!pointerLockElement;
        HEAP32[eventStruct >> 2] = isPointerlocked;
        var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
        var id = pointerLockElement && pointerLockElement.id ? pointerLockElement.id : "";
        stringToUTF8(nodeName, eventStruct + 4, 128);
        stringToUTF8(id, eventStruct + 132, 128)
    }),
    registerPointerlockChangeEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.pointerlockChangeEvent) {
            JSEvents.pointerlockChangeEvent = _malloc(260)
        }
        if (!target) {
            target = document
        } else {
            target = JSEvents.findEventTarget(target)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            JSEvents.fillPointerlockChangeEventData(JSEvents.pointerlockChangeEvent, e);
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.pointerlockChangeEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: target,
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    registerPointerlockErrorEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!target) {
            target = document
        } else {
            target = JSEvents.findEventTarget(target)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, 0, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: target,
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    requestPointerLock: (function(target) {
        if (target.requestPointerLock) {
            target.requestPointerLock()
        } else if (target.mozRequestPointerLock) {
            target.mozRequestPointerLock()
        } else if (target.webkitRequestPointerLock) {
            target.webkitRequestPointerLock()
        } else if (target.msRequestPointerLock) {
            target.msRequestPointerLock()
        } else {
            if (document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock || document.body.msRequestPointerLock) {
                return -3
            } else {
                return -1
            }
        }
        return 0
    }),
    fillVisibilityChangeEventData: (function(eventStruct, e) {
        var visibilityStates = ["hidden", "visible", "prerender", "unloaded"];
        var visibilityState = visibilityStates.indexOf(document.visibilityState);
        HEAP32[eventStruct >> 2] = document.hidden;
        HEAP32[eventStruct + 4 >> 2] = visibilityState
    }),
    registerVisibilityChangeEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.visibilityChangeEvent) {
            JSEvents.visibilityChangeEvent = _malloc(8)
        }
        if (!target) {
            target = document
        } else {
            target = JSEvents.findEventTarget(target)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            JSEvents.fillVisibilityChangeEventData(JSEvents.visibilityChangeEvent, e);
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.visibilityChangeEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: target,
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    registerTouchEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.touchEvent) {
            JSEvents.touchEvent = _malloc(1684)
        }
        target = JSEvents.findEventTarget(target);
        var handlerFunc = (function(event) {
            var e = event || window.event;
            var touches = {};
            for (var i = 0; i < e.touches.length; ++i) {
                var touch = e.touches[i];
                touches[touch.identifier] = touch
            }
            for (var i = 0; i < e.changedTouches.length; ++i) {
                var touch = e.changedTouches[i];
                touches[touch.identifier] = touch;
                touch.changed = true
            }
            for (var i = 0; i < e.targetTouches.length; ++i) {
                var touch = e.targetTouches[i];
                touches[touch.identifier].onTarget = true
            }
            var ptr = JSEvents.touchEvent;
            HEAP32[ptr + 4 >> 2] = e.ctrlKey;
            HEAP32[ptr + 8 >> 2] = e.shiftKey;
            HEAP32[ptr + 12 >> 2] = e.altKey;
            HEAP32[ptr + 16 >> 2] = e.metaKey;
            ptr += 20;
            var canvasRect = Module["canvas"] ? Module["canvas"].getBoundingClientRect() : undefined;
            var targetRect = JSEvents.getBoundingClientRectOrZeros(target);
            var numTouches = 0;
            for (var i in touches) {
                var t = touches[i];
                HEAP32[ptr >> 2] = t.identifier;
                HEAP32[ptr + 4 >> 2] = t.screenX;
                HEAP32[ptr + 8 >> 2] = t.screenY;
                HEAP32[ptr + 12 >> 2] = t.clientX;
                HEAP32[ptr + 16 >> 2] = t.clientY;
                HEAP32[ptr + 20 >> 2] = t.pageX;
                HEAP32[ptr + 24 >> 2] = t.pageY;
                HEAP32[ptr + 28 >> 2] = t.changed;
                HEAP32[ptr + 32 >> 2] = t.onTarget;
                if (canvasRect) {
                    HEAP32[ptr + 44 >> 2] = t.clientX - canvasRect.left;
                    HEAP32[ptr + 48 >> 2] = t.clientY - canvasRect.top
                } else {
                    HEAP32[ptr + 44 >> 2] = 0;
                    HEAP32[ptr + 48 >> 2] = 0
                }
                HEAP32[ptr + 36 >> 2] = t.clientX - targetRect.left;
                HEAP32[ptr + 40 >> 2] = t.clientY - targetRect.top;
                ptr += 52;
                if (++numTouches >= 32) {
                    break
                }
            }
            HEAP32[JSEvents.touchEvent >> 2] = numTouches;
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.touchEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: target,
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    fillGamepadEventData: (function(eventStruct, e) {
        HEAPF64[eventStruct >> 3] = e.timestamp;
        for (var i = 0; i < e.axes.length; ++i) {
            HEAPF64[eventStruct + i * 8 + 16 >> 3] = e.axes[i]
        }
        for (var i = 0; i < e.buttons.length; ++i) {
            if (typeof e.buttons[i] === "object") {
                HEAPF64[eventStruct + i * 8 + 528 >> 3] = e.buttons[i].value
            } else {
                HEAPF64[eventStruct + i * 8 + 528 >> 3] = e.buttons[i]
            }
        }
        for (var i = 0; i < e.buttons.length; ++i) {
            if (typeof e.buttons[i] === "object") {
                HEAP32[eventStruct + i * 4 + 1040 >> 2] = e.buttons[i].pressed
            } else {
                HEAP32[eventStruct + i * 4 + 1040 >> 2] = e.buttons[i] == 1
            }
        }
        HEAP32[eventStruct + 1296 >> 2] = e.connected;
        HEAP32[eventStruct + 1300 >> 2] = e.index;
        HEAP32[eventStruct + 8 >> 2] = e.axes.length;
        HEAP32[eventStruct + 12 >> 2] = e.buttons.length;
        stringToUTF8(e.id, eventStruct + 1304, 64);
        stringToUTF8(e.mapping, eventStruct + 1368, 64)
    }),
    registerGamepadEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.gamepadEvent) {
            JSEvents.gamepadEvent = _malloc(1432)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            JSEvents.fillGamepadEventData(JSEvents.gamepadEvent, e.gamepad);
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.gamepadEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: JSEvents.findEventTarget(target),
            allowsDeferredCalls: true,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    registerBeforeUnloadEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        var handlerFunc = (function(event) {
            var e = event || window.event;
            var confirmationMessage = Module["dynCall_iiii"](callbackfunc, eventTypeId, 0, userData);
            if (confirmationMessage) {
                confirmationMessage = Pointer_stringify(confirmationMessage)
            }
            if (confirmationMessage) {
                e.preventDefault();
                e.returnValue = confirmationMessage;
                return confirmationMessage
            }
        });
        var eventHandler = {
            target: JSEvents.findEventTarget(target),
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    battery: (function() {
        return navigator.battery || navigator.mozBattery || navigator.webkitBattery
    }),
    fillBatteryEventData: (function(eventStruct, e) {
        HEAPF64[eventStruct >> 3] = e.chargingTime;
        HEAPF64[eventStruct + 8 >> 3] = e.dischargingTime;
        HEAPF64[eventStruct + 16 >> 3] = e.level;
        HEAP32[eventStruct + 24 >> 2] = e.charging
    }),
    registerBatteryEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.batteryEvent) {
            JSEvents.batteryEvent = _malloc(32)
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            JSEvents.fillBatteryEventData(JSEvents.batteryEvent, JSEvents.battery());
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, JSEvents.batteryEvent, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: JSEvents.findEventTarget(target),
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    }),
    registerWebGlEventCallback: (function(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!target) {
            target = Module["canvas"]
        }
        var handlerFunc = (function(event) {
            var e = event || window.event;
            var shouldCancel = Module["dynCall_iiii"](callbackfunc, eventTypeId, 0, userData);
            if (shouldCancel) {
                e.preventDefault()
            }
        });
        var eventHandler = {
            target: JSEvents.findEventTarget(target),
            allowsDeferredCalls: false,
            eventTypeString: eventTypeString,
            callbackfunc: callbackfunc,
            handlerFunc: handlerFunc,
            useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler)
    })
};

function _emscripten_set_visibilitychange_callback(userData, useCapture, callbackfunc) {
    JSEvents.registerVisibilityChangeEventCallback(document, userData, useCapture, callbackfunc, 21, "visibilitychange");
    return 0
}
var GL = {
    counter: 1,
    lastError: 0,
    buffers: [],
    mappedBuffers: {},
    programs: [],
    framebuffers: [],
    renderbuffers: [],
    textures: [],
    uniforms: [],
    shaders: [],
    vaos: [],
    contexts: [],
    currentContext: null,
    offscreenCanvases: {},
    timerQueriesEXT: [],
    queries: [],
    samplers: [],
    transformFeedbacks: [],
    syncs: [],
    byteSizeByTypeRoot: 5120,
    byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
    programInfos: {},
    stringCache: {},
    stringiCache: {},
    tempFixedLengthArray: [],
    packAlignment: 4,
    unpackAlignment: 4,
    init: (function() {
        GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);
        for (var i = 0; i < GL.MINI_TEMP_BUFFER_SIZE; i++) {
            GL.miniTempBufferViews[i] = GL.miniTempBuffer.subarray(0, i + 1)
        }
        for (var i = 0; i < 32; i++) {
            GL.tempFixedLengthArray.push((new Array(i)).fill(0))
        }
    }),
    recordError: function recordError(errorCode) {
        if (!GL.lastError) {
            GL.lastError = errorCode
        }
    },
    getNewId: (function(table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
            table[i] = null
        }
        return ret
    }),
    MINI_TEMP_BUFFER_SIZE: 256,
    miniTempBuffer: null,
    miniTempBufferViews: [0],
    getSource: (function(shader, count, string, length) {
        var source = "";
        for (var i = 0; i < count; ++i) {
            var frag;
            if (length) {
                var len = HEAP32[length + i * 4 >> 2];
                if (len < 0) {
                    frag = Pointer_stringify(HEAP32[string + i * 4 >> 2])
                } else {
                    frag = Pointer_stringify(HEAP32[string + i * 4 >> 2], len)
                }
            } else {
                frag = Pointer_stringify(HEAP32[string + i * 4 >> 2])
            }
            source += frag
        }
        return source
    }),
    createContext: (function(canvas, webGLContextAttributes) {
        if (typeof webGLContextAttributes["majorVersion"] === "undefined" && typeof webGLContextAttributes["minorVersion"] === "undefined") {
            if (typeof WebGL2RenderingContext !== "undefined") webGLContextAttributes["majorVersion"] = 2;
            else webGLContextAttributes["majorVersion"] = 1;
            webGLContextAttributes["minorVersion"] = 0
        }
        var ctx;
        var errorInfo = "?";

        function onContextCreationError(event) {
            errorInfo = event.statusMessage || errorInfo
        }
        try {
            canvas.addEventListener("webglcontextcreationerror", onContextCreationError, false);
            try {
                if (Module["preinitializedWebGLContext"]) {
                    ctx = Module["preinitializedWebGLContext"];
                    GL.uniforms = Module["precompiledUniforms"];
                    GL.counter = Math.max(GL.counter, Module["glIDCounter"])
                } else if (webGLContextAttributes["majorVersion"] == 1 && webGLContextAttributes["minorVersion"] == 0) {
                    ctx = canvas.getContext("webgl", webGLContextAttributes) || canvas.getContext("experimental-webgl", webGLContextAttributes)
                } else if (webGLContextAttributes["majorVersion"] == 2 && webGLContextAttributes["minorVersion"] == 0) {
                    ctx = canvas.getContext("webgl2", webGLContextAttributes) || canvas.getContext("experimental-webgl2", webGLContextAttributes)
                } else {
                    throw "Unsupported WebGL context version " + majorVersion + "." + minorVersion + "!"
                }
            } finally {
                canvas.removeEventListener("webglcontextcreationerror", onContextCreationError, false)
            }
            if (!ctx) throw ":("
        } catch (e) {
            Module.print("Could not create canvas: " + [errorInfo, e, JSON.stringify(webGLContextAttributes)]);
            return 0
        }
        if (!ctx) return 0;
        return GL.registerContext(ctx, webGLContextAttributes)
    }),
    registerContext: (function(ctx, webGLContextAttributes) {
        var handle = GL.getNewId(GL.contexts);
        var context = {
            handle: handle,
            attributes: webGLContextAttributes,
            version: webGLContextAttributes["majorVersion"],
            GLctx: ctx
        };

        function getChromeVersion() {
            var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
            return raw ? parseInt(raw[2], 10) : false
        }
        context.supportsWebGL2EntryPoints = context.version >= 2 && (getChromeVersion() === false || getChromeVersion() >= 58);
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes["enableExtensionsByDefault"] === "undefined" || webGLContextAttributes["enableExtensionsByDefault"]) {
            GL.initExtensions(context)
        }
        return handle
    }),
    makeContextCurrent: (function(contextHandle) {
        var context = GL.contexts[contextHandle];
        if (!context) return false;
        GLctx = Module.ctx = context.GLctx;
        GL.currentContext = context;
        return true
    }),
    getContext: (function(contextHandle) {
        return GL.contexts[contextHandle]
    }),
    deleteContext: (function(contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
        if (typeof JSEvents === "object") JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
        GL.contexts[contextHandle] = null
    }),
    initExtensions: (function(context) {
        if (!context) context = GL.currentContext;
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
        var GLctx = context.GLctx;
        context.maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
        if (context.version < 2) {
            var instancedArraysExt = GLctx.getExtension("ANGLE_instanced_arrays");
            if (instancedArraysExt) {
                GLctx["vertexAttribDivisor"] = (function(index, divisor) {
                    instancedArraysExt["vertexAttribDivisorANGLE"](index, divisor)
                });
                GLctx["drawArraysInstanced"] = (function(mode, first, count, primcount) {
                    instancedArraysExt["drawArraysInstancedANGLE"](mode, first, count, primcount)
                });
                GLctx["drawElementsInstanced"] = (function(mode, count, type, indices, primcount) {
                    instancedArraysExt["drawElementsInstancedANGLE"](mode, count, type, indices, primcount)
                })
            }
            var vaoExt = GLctx.getExtension("OES_vertex_array_object");
            if (vaoExt) {
                GLctx["createVertexArray"] = (function() {
                    return vaoExt["createVertexArrayOES"]()
                });
                GLctx["deleteVertexArray"] = (function(vao) {
                    vaoExt["deleteVertexArrayOES"](vao)
                });
                GLctx["bindVertexArray"] = (function(vao) {
                    vaoExt["bindVertexArrayOES"](vao)
                });
                GLctx["isVertexArray"] = (function(vao) {
                    return vaoExt["isVertexArrayOES"](vao)
                })
            }
            var drawBuffersExt = GLctx.getExtension("WEBGL_draw_buffers");
            if (drawBuffersExt) {
                GLctx["drawBuffers"] = (function(n, bufs) {
                    drawBuffersExt["drawBuffersWEBGL"](n, bufs)
                })
            }
        }
        GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
        var automaticallyEnabledExtensions = ["OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives", "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture", "OES_element_index_uint", "EXT_texture_filter_anisotropic", "ANGLE_instanced_arrays", "OES_texture_float_linear", "OES_texture_half_float_linear", "WEBGL_compressed_texture_atc", "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float", "EXT_frag_depth", "EXT_sRGB", "WEBGL_draw_buffers", "WEBGL_shared_resources", "EXT_shader_texture_lod", "EXT_color_buffer_float"];
        var exts = GLctx.getSupportedExtensions();
        if (exts && exts.length > 0) {
            GLctx.getSupportedExtensions().forEach((function(ext) {
                if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
                    GLctx.getExtension(ext)
                }
            }))
        }
    }),
    populateUniformTable: (function(program) {
        var p = GL.programs[program];
        GL.programInfos[program] = {
            uniforms: {},
            maxUniformLength: 0,
            maxAttributeLength: -1,
            maxUniformBlockNameLength: -1
        };
        var ptable = GL.programInfos[program];
        var utable = ptable.uniforms;
        var numUniforms = GLctx.getProgramParameter(p, GLctx.ACTIVE_UNIFORMS);
        for (var i = 0; i < numUniforms; ++i) {
            var u = GLctx.getActiveUniform(p, i);
            var name = u.name;
            ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length + 1);
            if (name.indexOf("]", name.length - 1) !== -1) {
                var ls = name.lastIndexOf("[");
                name = name.slice(0, ls)
            }
            var loc = GLctx.getUniformLocation(p, name);
            if (loc != null) {
                var id = GL.getNewId(GL.uniforms);
                utable[name] = [u.size, id];
                GL.uniforms[id] = loc;
                for (var j = 1; j < u.size; ++j) {
                    var n = name + "[" + j + "]";
                    loc = GLctx.getUniformLocation(p, n);
                    id = GL.getNewId(GL.uniforms);
                    GL.uniforms[id] = loc
                }
            }
        }
    })
};

function _emscripten_glIsRenderbuffer(renderbuffer) {
    var rb = GL.renderbuffers[renderbuffer];
    if (!rb) return 0;
    return GLctx.isRenderbuffer(rb)
}

function ___setErrNo(value) {
    if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
    return value
}
var ERRNO_CODES = {
    EPERM: 1,
    ENOENT: 2,
    ESRCH: 3,
    EINTR: 4,
    EIO: 5,
    ENXIO: 6,
    E2BIG: 7,
    ENOEXEC: 8,
    EBADF: 9,
    ECHILD: 10,
    EAGAIN: 11,
    EWOULDBLOCK: 11,
    ENOMEM: 12,
    EACCES: 13,
    EFAULT: 14,
    ENOTBLK: 15,
    EBUSY: 16,
    EEXIST: 17,
    EXDEV: 18,
    ENODEV: 19,
    ENOTDIR: 20,
    EISDIR: 21,
    EINVAL: 22,
    ENFILE: 23,
    EMFILE: 24,
    ENOTTY: 25,
    ETXTBSY: 26,
    EFBIG: 27,
    ENOSPC: 28,
    ESPIPE: 29,
    EROFS: 30,
    EMLINK: 31,
    EPIPE: 32,
    EDOM: 33,
    ERANGE: 34,
    ENOMSG: 42,
    EIDRM: 43,
    ECHRNG: 44,
    EL2NSYNC: 45,
    EL3HLT: 46,
    EL3RST: 47,
    ELNRNG: 48,
    EUNATCH: 49,
    ENOCSI: 50,
    EL2HLT: 51,
    EDEADLK: 35,
    ENOLCK: 37,
    EBADE: 52,
    EBADR: 53,
    EXFULL: 54,
    ENOANO: 55,
    EBADRQC: 56,
    EBADSLT: 57,
    EDEADLOCK: 35,
    EBFONT: 59,
    ENOSTR: 60,
    ENODATA: 61,
    ETIME: 62,
    ENOSR: 63,
    ENONET: 64,
    ENOPKG: 65,
    EREMOTE: 66,
    ENOLINK: 67,
    EADV: 68,
    ESRMNT: 69,
    ECOMM: 70,
    EPROTO: 71,
    EMULTIHOP: 72,
    EDOTDOT: 73,
    EBADMSG: 74,
    ENOTUNIQ: 76,
    EBADFD: 77,
    EREMCHG: 78,
    ELIBACC: 79,
    ELIBBAD: 80,
    ELIBSCN: 81,
    ELIBMAX: 82,
    ELIBEXEC: 83,
    ENOSYS: 38,
    ENOTEMPTY: 39,
    ENAMETOOLONG: 36,
    ELOOP: 40,
    EOPNOTSUPP: 95,
    EPFNOSUPPORT: 96,
    ECONNRESET: 104,
    ENOBUFS: 105,
    EAFNOSUPPORT: 97,
    EPROTOTYPE: 91,
    ENOTSOCK: 88,
    ENOPROTOOPT: 92,
    ESHUTDOWN: 108,
    ECONNREFUSED: 111,
    EADDRINUSE: 98,
    ECONNABORTED: 103,
    ENETUNREACH: 101,
    ENETDOWN: 100,
    ETIMEDOUT: 110,
    EHOSTDOWN: 112,
    EHOSTUNREACH: 113,
    EINPROGRESS: 115,
    EALREADY: 114,
    EDESTADDRREQ: 89,
    EMSGSIZE: 90,
    EPROTONOSUPPORT: 93,
    ESOCKTNOSUPPORT: 94,
    EADDRNOTAVAIL: 99,
    ENETRESET: 102,
    EISCONN: 106,
    ENOTCONN: 107,
    ETOOMANYREFS: 109,
    EUSERS: 87,
    EDQUOT: 122,
    ESTALE: 116,
    ENOTSUP: 95,
    ENOMEDIUM: 123,
    EILSEQ: 84,
    EOVERFLOW: 75,
    ECANCELED: 125,
    ENOTRECOVERABLE: 131,
    EOWNERDEAD: 130,
    ESTRPIPE: 86
};
var Sockets = {
    BUFFER_SIZE: 10240,
    MAX_BUFFER_SIZE: 10485760,
    nextFd: 1,
    fds: {},
    nextport: 1,
    maxport: 65535,
    peer: null,
    connections: {},
    portmap: {},
    localAddr: 4261412874,
    addrPool: [33554442, 50331658, 67108874, 83886090, 100663306, 117440522, 134217738, 150994954, 167772170, 184549386, 201326602, 218103818, 234881034]
};

function __inet_pton4_raw(str) {
    var b = str.split(".");
    for (var i = 0; i < 4; i++) {
        var tmp = Number(b[i]);
        if (isNaN(tmp)) return null;
        b[i] = tmp
    }
    return (b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24) >>> 0
}
var _htons = undefined;
Module["_htons"] = _htons;

function __inet_pton6_raw(str) {
    var words;
    var w, offset, z;
    var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
    var parts = [];
    if (!valid6regx.test(str)) {
        return null
    }
    if (str === "::") {
        return [0, 0, 0, 0, 0, 0, 0, 0]
    }
    if (str.indexOf("::") === 0) {
        str = str.replace("::", "Z:")
    } else {
        str = str.replace("::", ":Z:")
    }
    if (str.indexOf(".") > 0) {
        str = str.replace(new RegExp("[.]", "g"), ":");
        words = str.split(":");
        words[words.length - 4] = parseInt(words[words.length - 4]) + parseInt(words[words.length - 3]) * 256;
        words[words.length - 3] = parseInt(words[words.length - 2]) + parseInt(words[words.length - 1]) * 256;
        words = words.slice(0, words.length - 2)
    } else {
        words = str.split(":")
    }
    offset = 0;
    z = 0;
    for (w = 0; w < words.length; w++) {
        if (typeof words[w] === "string") {
            if (words[w] === "Z") {
                for (z = 0; z < 8 - words.length + 1; z++) {
                    parts[w + z] = 0
                }
                offset = z - 1
            } else {
                parts[w + offset] = _htons(parseInt(words[w], 16))
            }
        } else {
            parts[w + offset] = words[w]
        }
    }
    return [parts[1] << 16 | parts[0], parts[3] << 16 | parts[2], parts[5] << 16 | parts[4], parts[7] << 16 | parts[6]]
}
var DNS = {
    address_map: {
        id: 1,
        addrs: {},
        names: {}
    },
    lookup_name: (function(name) {
        var res = __inet_pton4_raw(name);
        if (res !== null) {
            return name
        }
        res = __inet_pton6_raw(name);
        if (res !== null) {
            return name
        }
        var addr;
        if (DNS.address_map.addrs[name]) {
            addr = DNS.address_map.addrs[name]
        } else {
            var id = DNS.address_map.id++;
            assert(id < 65535, "exceeded max address mappings of 65535");
            addr = "172.29." + (id & 255) + "." + (id & 65280);
            DNS.address_map.names[addr] = name;
            DNS.address_map.addrs[name] = addr
        }
        return addr
    }),
    lookup_addr: (function(addr) {
        if (DNS.address_map.names[addr]) {
            return DNS.address_map.names[addr]
        }
        return null
    })
};

function __inet_ntop4_raw(addr) {
    return (addr & 255) + "." + (addr >> 8 & 255) + "." + (addr >> 16 & 255) + "." + (addr >> 24 & 255)
}

function __inet_ntop6_raw(ints) {
    var str = "";
    var word = 0;
    var longest = 0;
    var lastzero = 0;
    var zstart = 0;
    var len = 0;
    var i = 0;
    var parts = [ints[0] & 65535, ints[0] >> 16, ints[1] & 65535, ints[1] >> 16, ints[2] & 65535, ints[2] >> 16, ints[3] & 65535, ints[3] >> 16];
    var hasipv4 = true;
    var v4part = "";
    for (i = 0; i < 5; i++) {
        if (parts[i] !== 0) {
            hasipv4 = false;
            break
        }
    }
    if (hasipv4) {
        v4part = __inet_ntop4_raw(parts[6] | parts[7] << 16);
        if (parts[5] === -1) {
            str = "::ffff:";
            str += v4part;
            return str
        }
        if (parts[5] === 0) {
            str = "::";
            if (v4part === "0.0.0.0") v4part = "";
            if (v4part === "0.0.0.1") v4part = "1";
            str += v4part;
            return str
        }
    }
    for (word = 0; word < 8; word++) {
        if (parts[word] === 0) {
            if (word - lastzero > 1) {
                len = 0
            }
            lastzero = word;
            len++
        }
        if (len > longest) {
            longest = len;
            zstart = word - longest + 1
        }
    }
    for (word = 0; word < 8; word++) {
        if (longest > 1) {
            if (parts[word] === 0 && word >= zstart && word < zstart + longest) {
                if (word === zstart) {
                    str += ":";
                    if (zstart === 0) str += ":"
                }
                continue
            }
        }
        str += Number(_ntohs(parts[word] & 65535)).toString(16);
        str += word < 7 ? ":" : ""
    }
    return str
}

function __write_sockaddr(sa, family, addr, port) {
    switch (family) {
        case 2:
            addr = __inet_pton4_raw(addr);
            HEAP16[sa >> 1] = family;
            HEAP32[sa + 4 >> 2] = addr;
            HEAP16[sa + 2 >> 1] = _htons(port);
            break;
        case 10:
            addr = __inet_pton6_raw(addr);
            HEAP32[sa >> 2] = family;
            HEAP32[sa + 8 >> 2] = addr[0];
            HEAP32[sa + 12 >> 2] = addr[1];
            HEAP32[sa + 16 >> 2] = addr[2];
            HEAP32[sa + 20 >> 2] = addr[3];
            HEAP16[sa + 2 >> 1] = _htons(port);
            HEAP32[sa + 4 >> 2] = 0;
            HEAP32[sa + 24 >> 2] = 0;
            break;
        default:
            return {
                errno: ERRNO_CODES.EAFNOSUPPORT
            }
    }
    return {}
}

function _getaddrinfo(node, service, hint, out) {
    var addrs = [];
    var addr = 0;
    var port = 0;
    var flags = 0;
    var family = 0;
    var type = 0;
    var proto = 0;
    var ai;

    function allocaddrinfo(family, type, proto, canon, addr, port) {
        var sa, salen, ai;
        var res;
        salen = family === 10 ? 28 : 16;
        addr = family === 10 ? __inet_ntop6_raw(addr) : __inet_ntop4_raw(addr);
        sa = _malloc(salen);
        res = __write_sockaddr(sa, family, addr, port);
        assert(!res.errno);
        ai = _malloc(32);
        HEAP32[ai + 4 >> 2] = family;
        HEAP32[ai + 8 >> 2] = type;
        HEAP32[ai + 12 >> 2] = proto;
        if (canon) {
            HEAP32[ai + 24 >> 2] = canon
        }
        HEAP32[ai + 20 >> 2] = sa;
        if (family === 10) {
            HEAP32[ai + 16 >> 2] = 28
        } else {
            HEAP32[ai + 16 >> 2] = 16
        }
        HEAP32[ai + 28 >> 2] = 0;
        return ai
    }
    if (hint) {
        flags = HEAP32[hint >> 2];
        family = HEAP32[hint + 4 >> 2];
        type = HEAP32[hint + 8 >> 2];
        proto = HEAP32[hint + 12 >> 2]
    }
    if (type && !proto) {
        proto = type === 2 ? 17 : 6
    }
    if (!type && proto) {
        type = proto === 17 ? 2 : 1
    }
    if (proto === 0) {
        proto = 6
    }
    if (type === 0) {
        type = 1
    }
    if (!node && !service) {
        return -2
    }
    if (flags & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) {
        return -1
    }
    if (hint !== 0 && HEAP32[hint >> 2] & 2 && !node) {
        return -1
    }
    if (flags & 32) {
        return -2
    }
    if (type !== 0 && type !== 1 && type !== 2) {
        return -7
    }
    if (family !== 0 && family !== 2 && family !== 10) {
        return -6
    }
    if (service) {
        service = Pointer_stringify(service);
        port = parseInt(service, 10);
        if (isNaN(port)) {
            if (flags & 1024) {
                return -2
            }
            return -8
        }
    }
    if (!node) {
        if (family === 0) {
            family = 2
        }
        if ((flags & 1) === 0) {
            if (family === 2) {
                addr = _htonl(2130706433)
            } else {
                addr = [0, 0, 0, 1]
            }
        }
        ai = allocaddrinfo(family, type, proto, null, addr, port);
        HEAP32[out >> 2] = ai;
        return 0
    }
    node = Pointer_stringify(node);
    addr = __inet_pton4_raw(node);
    if (addr !== null) {
        if (family === 0 || family === 2) {
            family = 2
        } else if (family === 10 && flags & 8) {
            addr = [0, 0, _htonl(65535), addr];
            family = 10
        } else {
            return -2
        }
    } else {
        addr = __inet_pton6_raw(node);
        if (addr !== null) {
            if (family === 0 || family === 10) {
                family = 10
            } else {
                return -2
            }
        }
    }
    if (addr != null) {
        ai = allocaddrinfo(family, type, proto, node, addr, port);
        HEAP32[out >> 2] = ai;
        return 0
    }
    if (flags & 4) {
        return -2
    }
    node = DNS.lookup_name(node);
    addr = __inet_pton4_raw(node);
    if (family === 0) {
        family = 2
    } else if (family === 10) {
        addr = [0, 0, _htonl(65535), addr]
    }
    ai = allocaddrinfo(family, type, proto, null, addr, port);
    HEAP32[out >> 2] = ai;
    return 0
}

function _emscripten_glStencilMaskSeparate(x0, x1) {
    GLctx["stencilMaskSeparate"](x0, x1)
}

function _emscripten_set_main_loop_timing(mode, value) {
    var forceNoVsync = location.search.indexOf("novsync") != -1;
    if (forceNoVsync) mode = 2;
    Browser.mainLoop.timingMode = mode;
    Browser.mainLoop.timingValue = value;
    if (!Browser.mainLoop.func) {
        return 1
    }
    if (mode == 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
            var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
            setTimeout(Browser.mainLoop.runner, timeUntilNextTick)
        };
        Browser.mainLoop.method = "timeout"
    } else if (mode == 1) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
            Browser.requestAnimationFrame(Browser.mainLoop.runner)
        };
        Browser.mainLoop.method = "rAF"
    } else if (mode == 2) {
        if (!window["setImmediate"]) {
            var setImmediates = [];
            var emscriptenMainLoopMessageId = "setimmediate";

            function Browser_setImmediate_messageHandler(event) {
                if (event.source === window && event.data === emscriptenMainLoopMessageId) {
                    event.stopPropagation();
                    setImmediates.shift()()
                }
            }
            window.addEventListener("message", Browser_setImmediate_messageHandler, true);
            window["setImmediate"] = function Browser_emulated_setImmediate(func) {
                setImmediates.push(func);
                if (ENVIRONMENT_IS_WORKER) {
                    if (Module["setImmediates"] === undefined) Module["setImmediates"] = [];
                    Module["setImmediates"].push(func);
                    window.postMessage({
                        target: emscriptenMainLoopMessageId
                    })
                } else window.postMessage(emscriptenMainLoopMessageId, "*")
            }
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
            window["setImmediate"](Browser.mainLoop.runner)
        };
        Browser.mainLoop.method = "immediate"
    }
    return 0
}

function _emscripten_get_now() {
    abort()
}

function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg, noSetTiming) {
    Module["noExitRuntime"] = true;
    assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
    Browser.mainLoop.func = func;
    Browser.mainLoop.arg = arg;
    var browserIterationFunc;
    if (typeof arg !== "undefined") {
        browserIterationFunc = (function() {
            Module["dynCall_vi"](func, arg)
        })
    } else {
        browserIterationFunc = (function() {
            Module["dynCall_v"](func)
        })
    }
    var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
    Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
            var start = Date.now();
            var blocker = Browser.mainLoop.queue.shift();
            blocker.func(blocker.arg);
            if (Browser.mainLoop.remainingBlockers) {
                var remaining = Browser.mainLoop.remainingBlockers;
                var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
                if (blocker.counted) {
                    Browser.mainLoop.remainingBlockers = next
                } else {
                    next = next + .5;
                    Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9
                }
            }
            console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + " ms");
            Browser.mainLoop.updateStatus();
            if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
            setTimeout(Browser.mainLoop.runner, 0);
            return
        }
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
            Browser.mainLoop.scheduler();
            return
        } else if (Browser.mainLoop.timingMode == 0) {
            Browser.mainLoop.tickStartTime = _emscripten_get_now()
        }
        if (Browser.mainLoop.method === "timeout" && Module.ctx) {
            Module.printErr("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");
            Browser.mainLoop.method = ""
        }
        if (Module["referenceTestPreTick"]) Module["referenceTestPreTick"]();
        Browser.mainLoop.runIter(browserIterationFunc);
        if (Module["referenceTestTick"]) Module["referenceTestTick"]();
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
        if (typeof SDL === "object" && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
        Browser.mainLoop.scheduler()
    };
    if (!noSetTiming) {
        if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps);
        else _emscripten_set_main_loop_timing(1, 1);
        Browser.mainLoop.scheduler()
    }
    if (simulateInfiniteLoop) {
        throw "SimulateInfiniteLoop"
    }
}
var Browser = {
    mainLoop: {
        scheduler: null,
        method: "",
        currentlyRunningMainloop: 0,
        func: null,
        arg: 0,
        timingMode: 0,
        timingValue: 0,
        currentFrameNumber: 0,
        queue: [],
        pause: (function() {
            Browser.mainLoop.scheduler = null;
            Browser.mainLoop.currentlyRunningMainloop++
        }),
        resume: (function() {
            Browser.mainLoop.currentlyRunningMainloop++;
            var timingMode = Browser.mainLoop.timingMode;
            var timingValue = Browser.mainLoop.timingValue;
            var func = Browser.mainLoop.func;
            Browser.mainLoop.func = null;
            _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg, true);
            _emscripten_set_main_loop_timing(timingMode, timingValue);
            Browser.mainLoop.scheduler()
        }),
        updateStatus: (function() {
            if (Module["setStatus"]) {
                var message = Module["statusMessage"] || "Please wait...";
                var remaining = Browser.mainLoop.remainingBlockers;
                var expected = Browser.mainLoop.expectedBlockers;
                if (remaining) {
                    if (remaining < expected) {
                        Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")")
                    } else {
                        Module["setStatus"](message)
                    }
                } else {
                    Module["setStatus"]("")
                }
            }
        }),
        runIter: (function(func) {
            if (ABORT) return;
            if (Module["preMainLoop"]) {
                var preRet = Module["preMainLoop"]();
                if (preRet === false) {
                    return
                }
            }
            try {
                func()
            } catch (e) {
                if (e instanceof ExitStatus) {
                    return
                } else {
                    if (e && typeof e === "object" && e.stack) Module.printErr("exception thrown: " + [e, e.stack]);
                    throw e
                }
            }
            if (Module["postMainLoop"]) Module["postMainLoop"]()
        })
    },
    isFullscreen: false,
    pointerLock: false,
    moduleContextCreatedCallbacks: [],
    workers: [],
    init: (function() {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
        if (Browser.initted) return;
        Browser.initted = true;
        try {
            new Blob;
            Browser.hasBlobConstructor = true
        } catch (e) {
            Browser.hasBlobConstructor = false;
            console.log("warning: no blob constructor, cannot create blobs with mimetypes")
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null;
        Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
            console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
            Module.noImageDecoding = true
        }
        var imagePlugin = {};
        imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
            return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name)
        };
        imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
            var b = null;
            if (Browser.hasBlobConstructor) {
                try {
                    b = new Blob([byteArray], {
                        type: Browser.getMimetype(name)
                    });
                    if (b.size !== byteArray.length) {
                        b = new Blob([(new Uint8Array(byteArray)).buffer], {
                            type: Browser.getMimetype(name)
                        })
                    }
                } catch (e) {
                    Runtime.warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder")
                }
            }
            if (!b) {
                var bb = new Browser.BlobBuilder;
                bb.append((new Uint8Array(byteArray)).buffer);
                b = bb.getBlob()
            }
            var url = Browser.URLObject.createObjectURL(b);
            var img = new Image;
            img.onload = function img_onload() {
                assert(img.complete, "Image " + name + " could not be decoded");
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                Module["preloadedImages"][name] = canvas;
                Browser.URLObject.revokeObjectURL(url);
                if (onload) onload(byteArray)
            };
            img.onerror = function img_onerror(event) {
                console.log("Image " + url + " could not be decoded");
                if (onerror) onerror()
            };
            img.src = url
        };
        Module["preloadPlugins"].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
            return !Module.noAudioDecoding && name.substr(-4) in {
                ".ogg": 1,
                ".wav": 1,
                ".mp3": 1
            }
        };
        audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
            var done = false;

            function finish(audio) {
                if (done) return;
                done = true;
                Module["preloadedAudios"][name] = audio;
                if (onload) onload(byteArray)
            }

            function fail() {
                if (done) return;
                done = true;
                Module["preloadedAudios"][name] = new Audio;
                if (onerror) onerror()
            }
            if (Browser.hasBlobConstructor) {
                try {
                    var b = new Blob([byteArray], {
                        type: Browser.getMimetype(name)
                    })
                } catch (e) {
                    return fail()
                }
                var url = Browser.URLObject.createObjectURL(b);
                var audio = new Audio;
                audio.addEventListener("canplaythrough", (function() {
                    finish(audio)
                }), false);
                audio.onerror = function audio_onerror(event) {
                    if (done) return;
                    console.log("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");

                    function encode64(data) {
                        var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                        var PAD = "=";
                        var ret = "";
                        var leftchar = 0;
                        var leftbits = 0;
                        for (var i = 0; i < data.length; i++) {
                            leftchar = leftchar << 8 | data[i];
                            leftbits += 8;
                            while (leftbits >= 6) {
                                var curr = leftchar >> leftbits - 6 & 63;
                                leftbits -= 6;
                                ret += BASE[curr]
                            }
                        }
                        if (leftbits == 2) {
                            ret += BASE[(leftchar & 3) << 4];
                            ret += PAD + PAD
                        } else if (leftbits == 4) {
                            ret += BASE[(leftchar & 15) << 2];
                            ret += PAD
                        }
                        return ret
                    }
                    audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
                    finish(audio)
                };
                audio.src = url;
                Browser.safeSetTimeout((function() {
                    finish(audio)
                }), 1e4)
            } else {
                return fail()
            }
        };
        Module["preloadPlugins"].push(audioPlugin);

        function pointerLockChange() {
            Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"]
        }
        var canvas = Module["canvas"];
        if (canvas) {
            canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (function() {});
            canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || (function() {});
            canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
            document.addEventListener("pointerlockchange", pointerLockChange, false);
            document.addEventListener("mozpointerlockchange", pointerLockChange, false);
            document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
            document.addEventListener("mspointerlockchange", pointerLockChange, false);
            if (Module["elementPointerLock"]) {
                canvas.addEventListener("click", (function(ev) {
                    if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
                        Module["canvas"].requestPointerLock();
                        ev.preventDefault()
                    }
                }), false)
            }
        }
    }),
    createContext: (function(canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
        var ctx;
        var contextHandle;
        if (useWebGL) {
            var contextAttributes = {
                antialias: false,
                alpha: false
            };
            if (webGLContextAttributes) {
                for (var attribute in webGLContextAttributes) {
                    contextAttributes[attribute] = webGLContextAttributes[attribute]
                }
            }
            contextHandle = GL.createContext(canvas, contextAttributes);
            if (contextHandle) {
                ctx = GL.getContext(contextHandle).GLctx
            }
        } else {
            ctx = canvas.getContext("2d")
        }
        if (!ctx) return null;
        if (setInModule) {
            if (!useWebGL) assert(typeof GLctx === "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
            Module.ctx = ctx;
            if (useWebGL) GL.makeContextCurrent(contextHandle);
            Module.useWebGL = useWebGL;
            Browser.moduleContextCreatedCallbacks.forEach((function(callback) {
                callback()
            }));
            Browser.init()
        }
        return ctx
    }),
    destroyContext: (function(canvas, useWebGL, setInModule) {}),
    fullscreenHandlersInstalled: false,
    lockPointer: undefined,
    resizeCanvas: undefined,
    requestFullscreen: (function(lockPointer, resizeCanvas, vrDevice) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        Browser.vrDevice = vrDevice;
        if (typeof Browser.lockPointer === "undefined") Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === "undefined") Browser.resizeCanvas = false;
        if (typeof Browser.vrDevice === "undefined") Browser.vrDevice = null;
        var canvas = Module["canvas"];

        function fullscreenChange() {
            Browser.isFullscreen = false;
            var canvasContainer = canvas.parentNode;
            if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
                canvas.exitFullscreen = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || (function() {});
                canvas.exitFullscreen = canvas.exitFullscreen.bind(document);
                if (Browser.lockPointer) canvas.requestPointerLock();
                Browser.isFullscreen = true;
                if (Browser.resizeCanvas) Browser.setFullscreenCanvasSize()
            } else {
                canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                canvasContainer.parentNode.removeChild(canvasContainer);
                if (Browser.resizeCanvas) Browser.setWindowedCanvasSize()
            }
            if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullscreen);
            if (Module["onFullscreen"]) Module["onFullscreen"](Browser.isFullscreen);
            Browser.updateCanvasDimensions(canvas)
        }
        if (!Browser.fullscreenHandlersInstalled) {
            Browser.fullscreenHandlersInstalled = true;
            document.addEventListener("fullscreenchange", fullscreenChange, false);
            document.addEventListener("mozfullscreenchange", fullscreenChange, false);
            document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
            document.addEventListener("MSFullscreenChange", fullscreenChange, false)
        }
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? (function() {
            canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"])
        }) : null) || (canvasContainer["webkitRequestFullScreen"] ? (function() {
            canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])
        }) : null);
        if (vrDevice) {
            canvasContainer.requestFullscreen({
                vrDisplay: vrDevice
            })
        } else {
            canvasContainer.requestFullscreen()
        }
    }),
    requestFullScreen: (function(lockPointer, resizeCanvas, vrDevice) {
        Module.printErr("Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead.");
        Browser.requestFullScreen = (function(lockPointer, resizeCanvas, vrDevice) {
            return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice)
        });
        return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice)
    }),
    nextRAF: 0,
    fakeRequestAnimationFrame: (function(func) {
        var now = Date.now();
        if (Browser.nextRAF === 0) {
            Browser.nextRAF = now + 1e3 / 60
        } else {
            while (now + 2 >= Browser.nextRAF) {
                Browser.nextRAF += 1e3 / 60
            }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay)
    }),
    requestAnimationFrame: function requestAnimationFrame(func) {
        if (typeof window === "undefined") {
            Browser.fakeRequestAnimationFrame(func)
        } else {
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = window["requestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["msRequestAnimationFrame"] || window["oRequestAnimationFrame"] || Browser.fakeRequestAnimationFrame
            }
            window.requestAnimationFrame(func)
        }
    },
    safeCallback: (function(func) {
        return (function() {
            if (!ABORT) return func.apply(null, arguments)
        })
    }),
    allowAsyncCallbacks: true,
    queuedAsyncCallbacks: [],
    pauseAsyncCallbacks: (function() {
        Browser.allowAsyncCallbacks = false
    }),
    resumeAsyncCallbacks: (function() {
        Browser.allowAsyncCallbacks = true;
        if (Browser.queuedAsyncCallbacks.length > 0) {
            var callbacks = Browser.queuedAsyncCallbacks;
            Browser.queuedAsyncCallbacks = [];
            callbacks.forEach((function(func) {
                func()
            }))
        }
    }),
    safeRequestAnimationFrame: (function(func) {
        return Browser.requestAnimationFrame((function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
                func()
            } else {
                Browser.queuedAsyncCallbacks.push(func)
            }
        }))
    }),
    safeSetTimeout: (function(func, timeout) {
        Module["noExitRuntime"] = true;
        return setTimeout((function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
                func()
            } else {
                Browser.queuedAsyncCallbacks.push(func)
            }
        }), timeout)
    }),
    safeSetInterval: (function(func, timeout) {
        Module["noExitRuntime"] = true;
        return setInterval((function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
                func()
            }
        }), timeout)
    }),
    getMimetype: (function(name) {
        return {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "bmp": "image/bmp",
            "ogg": "audio/ogg",
            "wav": "audio/wav",
            "mp3": "audio/mpeg"
        }[name.substr(name.lastIndexOf(".") + 1)]
    }),
    getUserMedia: (function(func) {
        if (!window.getUserMedia) {
            window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"]
        }
        window.getUserMedia(func)
    }),
    getMovementX: (function(event) {
        return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0
    }),
    getMovementY: (function(event) {
        return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0
    }),
    getMouseWheelDelta: (function(event) {
        var delta = 0;
        switch (event.type) {
            case "DOMMouseScroll":
                delta = event.detail;
                break;
            case "mousewheel":
                delta = event.wheelDelta;
                break;
            case "wheel":
                delta = event["deltaY"];
                break;
            default:
                throw "unrecognized mouse wheel event: " + event.type
        }
        return delta
    }),
    mouseX: 0,
    mouseY: 0,
    mouseMovementX: 0,
    mouseMovementY: 0,
    touches: {},
    lastTouches: {},
    calculateMouseEvent: (function(event) {
        if (Browser.pointerLock) {
            if (event.type != "mousemove" && "mozMovementX" in event) {
                Browser.mouseMovementX = Browser.mouseMovementY = 0
            } else {
                Browser.mouseMovementX = Browser.getMovementX(event);
                Browser.mouseMovementY = Browser.getMovementY(event)
            }
            if (typeof SDL != "undefined") {
                Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
                Browser.mouseY = SDL.mouseY + Browser.mouseMovementY
            } else {
                Browser.mouseX += Browser.mouseMovementX;
                Browser.mouseY += Browser.mouseMovementY
            }
        } else {
            var rect = Module["canvas"].getBoundingClientRect();
            var cw = Module["canvas"].width;
            var ch = Module["canvas"].height;
            var scrollX = typeof window.scrollX !== "undefined" ? window.scrollX : window.pageXOffset;
            var scrollY = typeof window.scrollY !== "undefined" ? window.scrollY : window.pageYOffset;
            if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                var touch = event.touch;
                if (touch === undefined) {
                    return
                }
                var adjustedX = touch.pageX - (scrollX + rect.left);
                var adjustedY = touch.pageY - (scrollY + rect.top);
                adjustedX = adjustedX * (cw / rect.width);
                adjustedY = adjustedY * (ch / rect.height);
                var coords = {
                    x: adjustedX,
                    y: adjustedY
                };
                if (event.type === "touchstart") {
                    Browser.lastTouches[touch.identifier] = coords;
                    Browser.touches[touch.identifier] = coords
                } else if (event.type === "touchend" || event.type === "touchmove") {
                    var last = Browser.touches[touch.identifier];
                    if (!last) last = coords;
                    Browser.lastTouches[touch.identifier] = last;
                    Browser.touches[touch.identifier] = coords
                }
                return
            }
            var x = event.pageX - (scrollX + rect.left);
            var y = event.pageY - (scrollY + rect.top);
            x = x * (cw / rect.width);
            y = y * (ch / rect.height);
            Browser.mouseMovementX = x - Browser.mouseX;
            Browser.mouseMovementY = y - Browser.mouseY;
            Browser.mouseX = x;
            Browser.mouseY = y
        }
    }),
    asyncLoad: (function(url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
        Module["readAsync"](url, (function(arrayBuffer) {
            assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
            onload(new Uint8Array(arrayBuffer));
            if (dep) removeRunDependency(dep)
        }), (function(event) {
            if (onerror) {
                onerror()
            } else {
                throw 'Loading data file "' + url + '" failed.'
            }
        }));
        if (dep) addRunDependency(dep)
    }),
    resizeListeners: [],
    updateResizeListeners: (function() {
        var canvas = Module["canvas"];
        Browser.resizeListeners.forEach((function(listener) {
            listener(canvas.width, canvas.height)
        }))
    }),
    setCanvasSize: (function(width, height, noUpdates) {
        var canvas = Module["canvas"];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners()
    }),
    windowedWidth: 0,
    windowedHeight: 0,
    setFullscreenCanvasSize: (function() {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2];
            flags = flags | 8388608;
            HEAP32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2] = flags
        }
        Browser.updateResizeListeners()
    }),
    setWindowedCanvasSize: (function() {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2];
            flags = flags & ~8388608;
            HEAP32[SDL.screen + Runtime.QUANTUM_SIZE * 0 >> 2] = flags
        }
        Browser.updateResizeListeners()
    }),
    updateCanvasDimensions: (function(canvas, wNative, hNative) {
        if (wNative && hNative) {
            canvas.widthNative = wNative;
            canvas.heightNative = hNative
        } else {
            wNative = canvas.widthNative;
            hNative = canvas.heightNative
        }
        var w = wNative;
        var h = hNative;
        if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
            if (w / h < Module["forcedAspectRatio"]) {
                w = Math.round(h * Module["forcedAspectRatio"])
            } else {
                h = Math.round(w / Module["forcedAspectRatio"])
            }
        }
        if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
            var factor = Math.min(screen.width / w, screen.height / h);
            w = Math.round(w * factor);
            h = Math.round(h * factor)
        }
        if (Browser.resizeCanvas) {
            if (canvas.width != w) canvas.width = w;
            if (canvas.height != h) canvas.height = h;
            if (typeof canvas.style != "undefined") {
                canvas.style.removeProperty("width");
                canvas.style.removeProperty("height")
            }
        } else {
            if (canvas.width != wNative) canvas.width = wNative;
            if (canvas.height != hNative) canvas.height = hNative;
            if (typeof canvas.style != "undefined") {
                if (w != wNative || h != hNative) {
                    canvas.style.setProperty("width", w + "px", "important");
                    canvas.style.setProperty("height", h + "px", "important")
                } else {
                    canvas.style.removeProperty("width");
                    canvas.style.removeProperty("height")
                }
            }
        }
    }),
    wgetRequests: {},
    nextWgetRequestHandle: 0,
    getNextWgetRequestHandle: (function() {
        var handle = Browser.nextWgetRequestHandle;
        Browser.nextWgetRequestHandle++;
        return handle
    })
};
var EGL = {
    errorCode: 12288,
    defaultDisplayInitialized: false,
    currentContext: 0,
    currentReadSurface: 0,
    currentDrawSurface: 0,
    stringCache: {},
    setErrorCode: (function(code) {
        EGL.errorCode = code
    }),
    chooseConfig: (function(display, attribList, config, config_size, numConfigs) {
        if (display != 62e3) {
            EGL.setErrorCode(12296);
            return 0
        }
        if ((!config || !config_size) && !numConfigs) {
            EGL.setErrorCode(12300);
            return 0
        }
        if (numConfigs) {
            HEAP32[numConfigs >> 2] = 1
        }
        if (config && config_size > 0) {
            HEAP32[config >> 2] = 62002
        }
        EGL.setErrorCode(12288);
        return 1
    })
};

function _eglWaitClient() {
    EGL.setErrorCode(12288);
    return 1
}

function _eglTerminate(display) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    EGL.currentContext = 0;
    EGL.currentReadSurface = 0;
    EGL.currentDrawSurface = 0;
    EGL.defaultDisplayInitialized = false;
    EGL.setErrorCode(12288);
    return 1
}

function _emscripten_glGetInfoLogARB() {
    Module["printErr"]("missing function: emscripten_glGetInfoLogARB");
    abort(-1)
}
Module["_pthread_mutex_lock"] = _pthread_mutex_lock;

function _glLinkProgram(program) {
    if (Module["precompiledPrograms"]) {
        var vs = GL.programs[program].vs.source;
        var fs = GL.programs[program].fs.source;
        for (var i = 0; i < Module["precompiledPrograms"].length; ++i) {
            var p = Module["precompiledPrograms"][i];
            if (vs == p.vs && fs == p.fs) {
                if (GLctx.getParameter(GLctx.CURRENT_PROGRAM) == GL.programs[program]) {
                    GLctx.useProgram(p.program)
                }
                GL.programs[program] = p.program;
                GL.programs[program].isPrelinked = true;
                GL.programInfos[program] = p.programInfos;
                Module["precompiledPrograms"].splice(i, 1);
                return
            }
        }
    } else {
        if (!Module["programs"]) Module["programs"] = {};
        if (!Module["programs"][program]) Module["programs"][program] = {};
        if (!Module["programs"][program]["attribs"]) Module["programs"][program]["attribs"] = {};
        if (!Module["programs"][program]["pendingAttribs"]) Module["programs"][program]["pendingAttribs"] = {};
        var shaders = GLctx.getAttachedShaders(GL.programs[program]);
        Module["programs"][program].vs = shaders && shaders.length >= 1 ? GLctx.getShaderSource(shaders[0]) : "";
        Module["programs"][program].fs = shaders && shaders.length >= 2 ? GLctx.getShaderSource(shaders[1]) : "";
        for (var i in Module["programs"][program]["pendingAttribs"]) Module["programs"][program]["attribs"][i] = Module["programs"][program]["pendingAttribs"][i];
        Module["programs"][program]["pendingAttribs"] = {}
    }
    GLctx.linkProgram(GL.programs[program]);
    GL.programInfos[program] = null;
    GL.populateUniformTable(program)
}

function _emscripten_set_mouseleave_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 34, "mouseleave");
    return 0
}

function _emscripten_glStencilFunc(x0, x1, x2) {
    GLctx["stencilFunc"](x0, x1, x2)
}
var __currentFullscreenStrategy = {};

function _emscripten_exit_fullscreen() {
    if (typeof JSEvents.fullscreenEnabled() === "undefined") return -1;
    JSEvents.removeDeferredCalls(JSEvents.requestFullscreen);
    if (document.exitFullscreen) {
        document.exitFullscreen()
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    } else {
        return -1
    }
    if (__currentFullscreenStrategy.canvasResizedCallback) {
        Module["dynCall_iiii"](__currentFullscreenStrategy.canvasResizedCallback, 37, 0, __currentFullscreenStrategy.canvasResizedCallbackUserData)
    }
    return 0
}

function _glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
    GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer])
}

function _emscripten_glVertexPointer() {
    throw "Legacy GL function (glVertexPointer) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation."
}

function _emscripten_glUniform3iv(location, count, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniform3iv(GL.uniforms[location], HEAP32, value >> 2, count * 3);
        return
    }
    GLctx.uniform3iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 12 >> 2))
}

function _emscripten_glUniform4f(location, v0, v1, v2, v3) {
    GLctx.uniform4f(GL.uniforms[location], v0, v1, v2, v3)
}

function _emscripten_glShaderSource(shader, count, string, length) {
    var source = GL.getSource(shader, count, string, length);
    if (GL.currentContext.version >= 2) {
        if (source.indexOf("#version 100") != -1) {
            source = source.replace(/#extension GL_OES_standard_derivatives : enable/g, "");
            source = source.replace(/#extension GL_EXT_shader_texture_lod : enable/g, "");
            var prelude = "";
            if (source.indexOf("gl_FragColor") != -1) {
                prelude += "out mediump vec4 GL_FragColor;\n";
                source = source.replace(/gl_FragColor/g, "GL_FragColor")
            }
            if (source.indexOf("attribute") != -1) {
                source = source.replace(/attribute/g, "in");
                source = source.replace(/varying/g, "out")
            } else {
                source = source.replace(/varying/g, "in")
            }
            source = source.replace(/textureCubeLodEXT/g, "textureCubeLod");
            source = source.replace(/texture2DLodEXT/g, "texture2DLod");
            source = source.replace(/texture2DProjLodEXT/g, "texture2DProjLod");
            source = source.replace(/texture2DGradEXT/g, "texture2DGrad");
            source = source.replace(/texture2DProjGradEXT/g, "texture2DProjGrad");
            source = source.replace(/textureCubeGradEXT/g, "textureCubeGrad");
            source = source.replace(/textureCube/g, "texture");
            source = source.replace(/texture1D/g, "texture");
            source = source.replace(/texture2D/g, "texture");
            source = source.replace(/texture3D/g, "texture");
            source = source.replace(/#version 100/g, "#version 300 es\n" + prelude)
        }
    }
    GL.shaders[shader].source = source;
    if (Module["precompiledPrograms"]) return;
    if (!Module["shaders"]) Module["shaders"] = [];
    var recordedShader = {
        name: shader,
        code: source
    };
    Module["shaders"].push(recordedShader);
    GLctx.shaderSource(GL.shaders[shader], source)
}

function _pthread_mutex_init() {}
var _llvm_pow_f32 = Math_pow;
var _tzname = STATICTOP;
STATICTOP += 16;
var _daylight = STATICTOP;
STATICTOP += 16;
var _timezone = STATICTOP;
STATICTOP += 16;

function _tzset() {
    if (_tzset.called) return;
    _tzset.called = true;
    HEAP32[_timezone >> 2] = -(new Date).getTimezoneOffset() * 60;
    var winter = new Date(2e3, 0, 1);
    var summer = new Date(2e3, 6, 1);
    HEAP32[_daylight >> 2] = Number(winter.getTimezoneOffset() != summer.getTimezoneOffset());

    function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT"
    }
    var winterName = extractZone(winter);
    var summerName = extractZone(summer);
    var winterNamePtr = allocate(intArrayFromString(winterName), "i8", ALLOC_NORMAL);
    var summerNamePtr = allocate(intArrayFromString(summerName), "i8", ALLOC_NORMAL);
    if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
        HEAP32[_tzname >> 2] = winterNamePtr;
        HEAP32[_tzname + 4 >> 2] = summerNamePtr
    } else {
        HEAP32[_tzname >> 2] = summerNamePtr;
        HEAP32[_tzname + 4 >> 2] = winterNamePtr
    }
}

function _mktime(tmPtr) {
    _tzset();
    var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0);
    var dst = HEAP32[tmPtr + 32 >> 2];
    var guessedOffset = date.getTimezoneOffset();
    var start = new Date(date.getFullYear(), 0, 1);
    var summerOffset = (new Date(2e3, 6, 1)).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dstOffset = Math.min(winterOffset, summerOffset);
    if (dst < 0) {
        HEAP32[tmPtr + 32 >> 2] = Number(dstOffset == guessedOffset)
    } else if (dst > 0 != (dstOffset == guessedOffset)) {
        var nonDstOffset = Math.max(winterOffset, summerOffset);
        var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
        date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4)
    }
    HEAP32[tmPtr + 24 >> 2] = date.getDay();
    var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    return date.getTime() / 1e3 | 0
}

function _emscripten_glIsTexture(texture) {
    var texture = GL.textures[texture];
    if (!texture) return 0;
    return GLctx.isTexture(texture)
}

function _emscripten_glTexParameterf(x0, x1, x2) {
    GLctx["texParameterf"](x0, x1, x2)
}
var DLFCN = {
    error: null,
    errorMsg: null,
    loadedLibs: {},
    loadedLibNames: {}
};

function _dlerror() {
    if (DLFCN.errorMsg === null) {
        return 0
    } else {
        if (DLFCN.error) _free(DLFCN.error);
        var msgArr = intArrayFromString(DLFCN.errorMsg);
        DLFCN.error = allocate(msgArr, "i8", ALLOC_NORMAL);
        DLFCN.errorMsg = null;
        return DLFCN.error
    }
}

function _eglWaitGL() {
    return _eglWaitClient.apply(null, arguments)
}

function _glCompileShader(shader) {
    if (Module["precompiledPrograms"]) return;
    GLctx.compileShader(GL.shaders[shader])
}
var ERRNO_MESSAGES = {
    0: "Success",
    1: "Not super-user",
    2: "No such file or directory",
    3: "No such process",
    4: "Interrupted system call",
    5: "I/O error",
    6: "No such device or address",
    7: "Arg list too long",
    8: "Exec format error",
    9: "Bad file number",
    10: "No children",
    11: "No more processes",
    12: "Not enough core",
    13: "Permission denied",
    14: "Bad address",
    15: "Block device required",
    16: "Mount device busy",
    17: "File exists",
    18: "Cross-device link",
    19: "No such device",
    20: "Not a directory",
    21: "Is a directory",
    22: "Invalid argument",
    23: "Too many open files in system",
    24: "Too many open files",
    25: "Not a typewriter",
    26: "Text file busy",
    27: "File too large",
    28: "No space left on device",
    29: "Illegal seek",
    30: "Read only file system",
    31: "Too many links",
    32: "Broken pipe",
    33: "Math arg out of domain of func",
    34: "Math result not representable",
    35: "File locking deadlock error",
    36: "File or path name too long",
    37: "No record locks available",
    38: "Function not implemented",
    39: "Directory not empty",
    40: "Too many symbolic links",
    42: "No message of desired type",
    43: "Identifier removed",
    44: "Channel number out of range",
    45: "Level 2 not synchronized",
    46: "Level 3 halted",
    47: "Level 3 reset",
    48: "Link number out of range",
    49: "Protocol driver not attached",
    50: "No CSI structure available",
    51: "Level 2 halted",
    52: "Invalid exchange",
    53: "Invalid request descriptor",
    54: "Exchange full",
    55: "No anode",
    56: "Invalid request code",
    57: "Invalid slot",
    59: "Bad font file fmt",
    60: "Device not a stream",
    61: "No data (for no delay io)",
    62: "Timer expired",
    63: "Out of streams resources",
    64: "Machine is not on the network",
    65: "Package not installed",
    66: "The object is remote",
    67: "The link has been severed",
    68: "Advertise error",
    69: "Srmount error",
    70: "Communication error on send",
    71: "Protocol error",
    72: "Multihop attempted",
    73: "Cross mount point (not really error)",
    74: "Trying to read unreadable message",
    75: "Value too large for defined data type",
    76: "Given log. name not unique",
    77: "f.d. invalid for this operation",
    78: "Remote address changed",
    79: "Can   access a needed shared lib",
    80: "Accessing a corrupted shared lib",
    81: ".lib section in a.out corrupted",
    82: "Attempting to link in too many libs",
    83: "Attempting to exec a shared library",
    84: "Illegal byte sequence",
    86: "Streams pipe error",
    87: "Too many users",
    88: "Socket operation on non-socket",
    89: "Destination address required",
    90: "Message too long",
    91: "Protocol wrong type for socket",
    92: "Protocol not available",
    93: "Unknown protocol",
    94: "Socket type not supported",
    95: "Not supported",
    96: "Protocol family not supported",
    97: "Address family not supported by protocol family",
    98: "Address already in use",
    99: "Address not available",
    100: "Network interface is not configured",
    101: "Network is unreachable",
    102: "Connection reset by network",
    103: "Connection aborted",
    104: "Connection reset by peer",
    105: "No buffer space available",
    106: "Socket is already connected",
    107: "Socket is not connected",
    108: "Can't send after socket shutdown",
    109: "Too many references",
    110: "Connection timed out",
    111: "Connection refused",
    112: "Host is down",
    113: "Host is unreachable",
    114: "Socket already connected",
    115: "Connection already in progress",
    116: "Stale file handle",
    122: "Quota exceeded",
    123: "No medium (in tape drive)",
    125: "Operation canceled",
    130: "Previous owner died",
    131: "State not recoverable"
};
var PATH = {
    splitPath: (function(filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1)
    }),
    normalizeArray: (function(parts, allowAboveRoot) {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
                parts.splice(i, 1)
            } else if (last === "..") {
                parts.splice(i, 1);
                up++
            } else if (up) {
                parts.splice(i, 1);
                up--
            }
        }
        if (allowAboveRoot) {
            for (; up--; up) {
                parts.unshift("..")
            }
        }
        return parts
    }),
    normalize: (function(path) {
        var isAbsolute = path.charAt(0) === "/",
            trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(path.split("/").filter((function(p) {
            return !!p
        })), !isAbsolute).join("/");
        if (!path && !isAbsolute) {
            path = "."
        }
        if (path && trailingSlash) {
            path += "/"
        }
        return (isAbsolute ? "/" : "") + path
    }),
    dirname: (function(path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
            return "."
        }
        if (dir) {
            dir = dir.substr(0, dir.length - 1)
        }
        return root + dir
    }),
    basename: (function(path) {
        if (path === "/") return "/";
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1) return path;
        return path.substr(lastSlash + 1)
    }),
    extname: (function(path) {
        return PATH.splitPath(path)[3]
    }),
    join: (function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join("/"))
    }),
    join2: (function(l, r) {
        return PATH.normalize(l + "/" + r)
    }),
    resolve: (function() {
        var resolvedPath = "",
            resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : FS.cwd();
            if (typeof path !== "string") {
                throw new TypeError("Arguments to path.resolve must be strings")
            } else if (!path) {
                return ""
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charAt(0) === "/"
        }
        resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((function(p) {
            return !!p
        })), !resolvedAbsolute).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
    }),
    relative: (function(from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);

        function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
                if (arr[start] !== "") break
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
                if (arr[end] !== "") break
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1)
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break
            }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..")
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/")
    })
};
var TTY = {
    ttys: [],
    init: (function() {}),
    shutdown: (function() {}),
    register: (function(dev, ops) {
        TTY.ttys[dev] = {
            input: [],
            output: [],
            ops: ops
        };
        FS.registerDevice(dev, TTY.stream_ops)
    }),
    stream_ops: {
        open: (function(stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
                throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
            }
            stream.tty = tty;
            stream.seekable = false
        }),
        close: (function(stream) {
            stream.tty.ops.flush(stream.tty)
        }),
        flush: (function(stream) {
            stream.tty.ops.flush(stream.tty)
        }),
        read: (function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
                var result;
                try {
                    result = stream.tty.ops.get_char(stream.tty)
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES.EIO)
                }
                if (result === undefined && bytesRead === 0) {
                    throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset + i] = result
            }
            if (bytesRead) {
                stream.node.timestamp = Date.now()
            }
            return bytesRead
        }),
        write: (function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(ERRNO_CODES.ENXIO)
            }
            for (var i = 0; i < length; i++) {
                try {
                    stream.tty.ops.put_char(stream.tty, buffer[offset + i])
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES.EIO)
                }
            }
            if (length) {
                stream.node.timestamp = Date.now()
            }
            return i
        })
    },
    default_tty_ops: {
        get_char: (function(tty) {
            if (!tty.input.length) {
                var result = null;
                if (ENVIRONMENT_IS_NODE) {
                    var BUFSIZE = 256;
                    var buf = new Buffer(BUFSIZE);
                    var bytesRead = 0;
                    var isPosixPlatform = process.platform != "win32";
                    var fd = process.stdin.fd;
                    if (isPosixPlatform) {
                        var usingDevice = false;
                        try {
                            fd = fs.openSync("/dev/stdin", "r");
                            usingDevice = true
                        } catch (e) {}
                    }
                    try {
                        bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null)
                    } catch (e) {
                        if (e.toString().indexOf("EOF") != -1) bytesRead = 0;
                        else throw e
                    }
                    if (usingDevice) {
                        fs.closeSync(fd)
                    }
                    if (bytesRead > 0) {
                        result = buf.slice(0, bytesRead).toString("utf-8")
                    } else {
                        result = null
                    }
                } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                    result = window.prompt("Input: ");
                    if (result !== null) {
                        result += "\n"
                    }
                } else if (typeof readline == "function") {
                    result = readline();
                    if (result !== null) {
                        result += "\n"
                    }
                }
                if (!result) {
                    return null
                }
                tty.input = intArrayFromString(result, true)
            }
            return tty.input.shift()
        }),
        put_char: (function(tty, val) {
            if (val === null || val === 10) {
                Module["print"](UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0) tty.output.push(val)
            }
        }),
        flush: (function(tty) {
            if (tty.output && tty.output.length > 0) {
                Module["print"](UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        })
    },
    default_tty1_ops: {
        put_char: (function(tty, val) {
            if (val === null || val === 10) {
                Module["printErr"](UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0) tty.output.push(val)
            }
        }),
        flush: (function(tty) {
            if (tty.output && tty.output.length > 0) {
                Module["printErr"](UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        })
    }
};
var MEMFS = {
    ops_table: null,
    mount: (function(mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0)
    }),
    createNode: (function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
                dir: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        lookup: MEMFS.node_ops.lookup,
                        mknod: MEMFS.node_ops.mknod,
                        rename: MEMFS.node_ops.rename,
                        unlink: MEMFS.node_ops.unlink,
                        rmdir: MEMFS.node_ops.rmdir,
                        readdir: MEMFS.node_ops.readdir,
                        symlink: MEMFS.node_ops.symlink
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek
                    }
                },
                file: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek,
                        read: MEMFS.stream_ops.read,
                        write: MEMFS.stream_ops.write,
                        allocate: MEMFS.stream_ops.allocate,
                        mmap: MEMFS.stream_ops.mmap,
                        msync: MEMFS.stream_ops.msync
                    }
                },
                link: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        readlink: MEMFS.node_ops.readlink
                    },
                    stream: {}
                },
                chrdev: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: FS.chrdev_stream_ops
                }
            }
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {}
        } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null
        } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream
        } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream
        }
        node.timestamp = Date.now();
        if (parent) {
            parent.contents[name] = node
        }
        return node
    }),
    getFileDataAsRegularArray: (function(node) {
        if (node.contents && node.contents.subarray) {
            var arr = [];
            for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
            return arr
        }
        return node.contents
    }),
    getFileDataAsTypedArray: (function(node) {
        if (!node.contents) return new Uint8Array;
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents)
    }),
    expandFileStorage: (function(node, newCapacity) {
        if (node.contents && node.contents.subarray && newCapacity > node.contents.length) {
            node.contents = MEMFS.getFileDataAsRegularArray(node);
            node.usedBytes = node.contents.length
        }
        if (!node.contents || node.contents.subarray) {
            var prevCapacity = node.contents ? node.contents.length : 0;
            if (prevCapacity >= newCapacity) return;
            var CAPACITY_DOUBLING_MAX = 1024 * 1024;
            newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) | 0);
            if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
            var oldContents = node.contents;
            node.contents = new Uint8Array(newCapacity);
            if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
            return
        }
        if (!node.contents && newCapacity > 0) node.contents = [];
        while (node.contents.length < newCapacity) node.contents.push(0)
    }),
    resizeFileStorage: (function(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0;
            return
        }
        if (!node.contents || node.contents.subarray) {
            var oldContents = node.contents;
            node.contents = new Uint8Array(new ArrayBuffer(newSize));
            if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
            }
            node.usedBytes = newSize;
            return
        }
        if (!node.contents) node.contents = [];
        if (node.contents.length > newSize) node.contents.length = newSize;
        else
            while (node.contents.length < newSize) node.contents.push(0);
        node.usedBytes = newSize
    }),
    node_ops: {
        getattr: (function(node) {
            var attr = {};
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
                attr.size = 4096
            } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes
            } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length
            } else {
                attr.size = 0
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr
        }),
        setattr: (function(node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp
            }
            if (attr.size !== undefined) {
                MEMFS.resizeFileStorage(node, attr.size)
            }
        }),
        lookup: (function(parent, name) {
            throw FS.genericErrors[ERRNO_CODES.ENOENT]
        }),
        mknod: (function(parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev)
        }),
        rename: (function(old_node, new_dir, new_name) {
            if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name)
                } catch (e) {}
                if (new_node) {
                    for (var i in new_node.contents) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                    }
                }
            }
            delete old_node.parent.contents[old_node.name];
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            old_node.parent = new_dir
        }),
        unlink: (function(parent, name) {
            delete parent.contents[name]
        }),
        rmdir: (function(parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
            }
            delete parent.contents[name]
        }),
        readdir: (function(node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                    continue
                }
                entries.push(key)
            }
            return entries
        }),
        symlink: (function(parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
            node.link = oldpath;
            return node
        }),
        readlink: (function(node) {
            if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            return node.link
        })
    },
    stream_ops: {
        read: (function(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes) return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            assert(size >= 0);
            if (size > 8 && contents.subarray) {
                buffer.set(contents.subarray(position, position + size), offset)
            } else {
                for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i]
            }
            return size
        }),
        write: (function(stream, buffer, offset, length, position, canOwn) {
            if (!length) return 0;
            var node = stream.node;
            node.timestamp = Date.now();
            if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                    node.contents = buffer.subarray(offset, offset + length);
                    node.usedBytes = length;
                    return length
                } else if (node.usedBytes === 0 && position === 0) {
                    node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
                    node.usedBytes = length;
                    return length
                } else if (position + length <= node.usedBytes) {
                    node.contents.set(buffer.subarray(offset, offset + length), position);
                    return length
                }
            }
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position);
            else {
                for (var i = 0; i < length; i++) {
                    node.contents[position + i] = buffer[offset + i]
                }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length
        }),
        llseek: (function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += stream.node.usedBytes
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            return position
        }),
        allocate: (function(stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
        }),
        mmap: (function(stream, buffer, offset, length, position, prot, flags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            if (!(flags & 2) && (contents.buffer === buffer || contents.buffer === buffer.buffer)) {
                allocated = false;
                ptr = contents.byteOffset
            } else {
                if (position > 0 || position + length < stream.node.usedBytes) {
                    if (contents.subarray) {
                        contents = contents.subarray(position, position + length)
                    } else {
                        contents = Array.prototype.slice.call(contents, position, position + length)
                    }
                }
                allocated = true;
                ptr = _malloc(length);
                if (!ptr) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOMEM)
                }
                buffer.set(contents, ptr)
            }
            return {
                ptr: ptr,
                allocated: allocated
            }
        }),
        msync: (function(stream, buffer, offset, length, mmapFlags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
            }
            if (mmapFlags & 2) {
                return 0
            }
            var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            return 0
        })
    }
};
var IDBFS = {
    dbs: {},
    indexedDB: (function() {
        if (typeof indexedDB !== "undefined") return indexedDB;
        var ret = null;
        if (typeof window === "object") ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        assert(ret, "IDBFS used, but indexedDB not supported");
        return ret
    }),
    DB_VERSION: 21,
    DB_STORE_NAME: "FILE_DATA",
    mount: (function(mount) {
        return MEMFS.mount.apply(null, arguments)
    }),
    syncfs: (function(mount, populate, callback) {
        IDBFS.getLocalSet(mount, (function(err, local) {
            if (err) return callback(err);
            IDBFS.getRemoteSet(mount, (function(err, remote) {
                if (err) return callback(err);
                var src = populate ? remote : local;
                var dst = populate ? local : remote;
                IDBFS.reconcile(src, dst, callback)
            }))
        }))
    }),
    getDB: (function(name, callback) {
        var db = IDBFS.dbs[name];
        if (db) {
            return callback(null, db)
        }
        var req;
        try {
            req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION)
        } catch (e) {
            return callback(e)
        }
        if (!req) {
            return callback("Unable to connect to IndexedDB")
        }
        req.onupgradeneeded = (function(e) {
            var db = e.target.result;
            var transaction = e.target.transaction;
            var fileStore;
            if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME)
            } else {
                fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME)
            }
            if (!fileStore.indexNames.contains("timestamp")) {
                fileStore.createIndex("timestamp", "timestamp", {
                    unique: false
                })
            }
        });
        req.onsuccess = (function() {
            db = req.result;
            IDBFS.dbs[name] = db;
            callback(null, db)
        });
        req.onerror = (function(e) {
            callback(this.error);
            e.preventDefault()
        })
    }),
    getLocalSet: (function(mount, callback) {
        var entries = {};

        function isRealDir(p) {
            return p !== "." && p !== ".."
        }

        function toAbsolute(root) {
            return (function(p) {
                return PATH.join2(root, p)
            })
        }
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
        while (check.length) {
            var path = check.pop();
            var stat;
            try {
                stat = FS.stat(path)
            } catch (e) {
                return callback(e)
            }
            if (FS.isDir(stat.mode)) {
                check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))
            }
            entries[path] = {
                timestamp: stat.mtime
            }
        }
        return callback(null, {
            type: "local",
            entries: entries
        })
    }),
    getRemoteSet: (function(mount, callback) {
        var entries = {};
        IDBFS.getDB(mount.mountpoint, (function(err, db) {
            if (err) return callback(err);
            var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
            transaction.onerror = (function(e) {
                callback(this.error);
                e.preventDefault()
            });
            var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
            var index = store.index("timestamp");
            index.openKeyCursor().onsuccess = (function(event) {
                var cursor = event.target.result;
                if (!cursor) {
                    return callback(null, {
                        type: "remote",
                        db: db,
                        entries: entries
                    })
                }
                entries[cursor.primaryKey] = {
                    timestamp: cursor.key
                };
                cursor.continue()
            })
        }))
    }),
    loadLocalEntry: (function(path, callback) {
        var stat, node;
        try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path)
        } catch (e) {
            return callback(e)
        }
        if (FS.isDir(stat.mode)) {
            return callback(null, {
                timestamp: stat.mtime,
                mode: stat.mode
            })
        } else if (FS.isFile(stat.mode)) {
            node.contents = MEMFS.getFileDataAsTypedArray(node);
            return callback(null, {
                timestamp: stat.mtime,
                mode: stat.mode,
                contents: node.contents
            })
        } else {
            return callback(new Error("node type not supported"))
        }
    }),
    storeLocalEntry: (function(path, entry, callback) {
        try {
            if (FS.isDir(entry.mode)) {
                FS.mkdir(path, entry.mode)
            } else if (FS.isFile(entry.mode)) {
                FS.writeFile(path, entry.contents, {
                    encoding: "binary",
                    canOwn: true
                })
            } else {
                return callback(new Error("node type not supported"))
            }
            FS.chmod(path, entry.mode);
            FS.utime(path, entry.timestamp, entry.timestamp)
        } catch (e) {
            return callback(e)
        }
        callback(null)
    }),
    removeLocalEntry: (function(path, callback) {
        try {
            var lookup = FS.lookupPath(path);
            var stat = FS.stat(path);
            if (FS.isDir(stat.mode)) {
                FS.rmdir(path)
            } else if (FS.isFile(stat.mode)) {
                FS.unlink(path)
            }
        } catch (e) {
            return callback(e)
        }
        callback(null)
    }),
    loadRemoteEntry: (function(store, path, callback) {
        var req = store.get(path);
        req.onsuccess = (function(event) {
            callback(null, event.target.result)
        });
        req.onerror = (function(e) {
            callback(this.error);
            e.preventDefault()
        })
    }),
    storeRemoteEntry: (function(store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = (function() {
            callback(null)
        });
        req.onerror = (function(e) {
            callback(this.error);
            e.preventDefault()
        })
    }),
    removeRemoteEntry: (function(store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = (function() {
            callback(null)
        });
        req.onerror = (function(e) {
            callback(this.error);
            e.preventDefault()
        })
    }),
    reconcile: (function(src, dst, callback) {
        var total = 0;
        var create = [];
        Object.keys(src.entries).forEach((function(key) {
            var e = src.entries[key];
            var e2 = dst.entries[key];
            if (!e2 || e.timestamp > e2.timestamp) {
                create.push(key);
                total++
            }
        }));
        var remove = [];
        Object.keys(dst.entries).forEach((function(key) {
            var e = dst.entries[key];
            var e2 = src.entries[key];
            if (!e2) {
                remove.push(key);
                total++
            }
        }));
        if (!total) {
            return callback(null)
        }
        var completed = 0;
        var db = src.type === "remote" ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);

        function done(err) {
            if (err) {
                if (!done.errored) {
                    done.errored = true;
                    return callback(err)
                }
                return
            }
            if (++completed >= total) {
                return callback(null)
            }
        }
        transaction.onerror = (function(e) {
            done(this.error);
            e.preventDefault()
        });
        create.sort().forEach((function(path) {
            if (dst.type === "local") {
                IDBFS.loadRemoteEntry(store, path, (function(err, entry) {
                    if (err) return done(err);
                    IDBFS.storeLocalEntry(path, entry, done)
                }))
            } else {
                IDBFS.loadLocalEntry(path, (function(err, entry) {
                    if (err) return done(err);
                    IDBFS.storeRemoteEntry(store, path, entry, done)
                }))
            }
        }));
        remove.sort().reverse().forEach((function(path) {
            if (dst.type === "local") {
                IDBFS.removeLocalEntry(path, done)
            } else {
                IDBFS.removeRemoteEntry(store, path, done)
            }
        }))
    })
};
var NODEFS = {
    isWindows: false,
    staticInit: (function() {
        NODEFS.isWindows = !!process.platform.match(/^win/)
    }),
    mount: (function(mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0)
    }),
    createNode: (function(parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node
    }),
    getMode: (function(path) {
        var stat;
        try {
            stat = fs.lstatSync(path);
            if (NODEFS.isWindows) {
                stat.mode = stat.mode | (stat.mode & 146) >> 1
            }
        } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code])
        }
        return stat.mode
    }),
    realPath: (function(node) {
        var parts = [];
        while (node.parent !== node) {
            parts.push(node.name);
            node = node.parent
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts)
    }),
    flagsToPermissionStringMap: {
        0: "r",
        1: "r+",
        2: "r+",
        64: "r",
        65: "r+",
        66: "r+",
        129: "rx+",
        193: "rx+",
        514: "w+",
        577: "w",
        578: "w+",
        705: "wx",
        706: "wx+",
        1024: "a",
        1025: "a",
        1026: "a+",
        1089: "a",
        1090: "a+",
        1153: "ax",
        1154: "ax+",
        1217: "ax",
        1218: "ax+",
        4096: "rs",
        4098: "rs+"
    },
    flagsToPermissionString: (function(flags) {
        flags &= ~2097152;
        flags &= ~2048;
        flags &= ~32768;
        flags &= ~524288;
        if (flags in NODEFS.flagsToPermissionStringMap) {
            return NODEFS.flagsToPermissionStringMap[flags]
        } else {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
    }),
    node_ops: {
        getattr: (function(node) {
            var path = NODEFS.realPath(node);
            var stat;
            try {
                stat = fs.lstatSync(path)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
            if (NODEFS.isWindows && !stat.blksize) {
                stat.blksize = 4096
            }
            if (NODEFS.isWindows && !stat.blocks) {
                stat.blocks = (stat.size + stat.blksize - 1) / stat.blksize | 0
            }
            return {
                dev: stat.dev,
                ino: stat.ino,
                mode: stat.mode,
                nlink: stat.nlink,
                uid: stat.uid,
                gid: stat.gid,
                rdev: stat.rdev,
                size: stat.size,
                atime: stat.atime,
                mtime: stat.mtime,
                ctime: stat.ctime,
                blksize: stat.blksize,
                blocks: stat.blocks
            }
        }),
        setattr: (function(node, attr) {
            var path = NODEFS.realPath(node);
            try {
                if (attr.mode !== undefined) {
                    fs.chmodSync(path, attr.mode);
                    node.mode = attr.mode
                }
                if (attr.timestamp !== undefined) {
                    var date = new Date(attr.timestamp);
                    fs.utimesSync(path, date, date)
                }
                if (attr.size !== undefined) {
                    fs.truncateSync(path, attr.size)
                }
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        lookup: (function(parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            var mode = NODEFS.getMode(path);
            return NODEFS.createNode(parent, name, mode)
        }),
        mknod: (function(parent, name, mode, dev) {
            var node = NODEFS.createNode(parent, name, mode, dev);
            var path = NODEFS.realPath(node);
            try {
                if (FS.isDir(node.mode)) {
                    fs.mkdirSync(path, node.mode)
                } else {
                    fs.writeFileSync(path, "", {
                        mode: node.mode
                    })
                }
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
            return node
        }),
        rename: (function(oldNode, newDir, newName) {
            var oldPath = NODEFS.realPath(oldNode);
            var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
            try {
                fs.renameSync(oldPath, newPath)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        unlink: (function(parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            try {
                fs.unlinkSync(path)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        rmdir: (function(parent, name) {
            var path = PATH.join2(NODEFS.realPath(parent), name);
            try {
                fs.rmdirSync(path)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        readdir: (function(node) {
            var path = NODEFS.realPath(node);
            try {
                return fs.readdirSync(path)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        symlink: (function(parent, newName, oldPath) {
            var newPath = PATH.join2(NODEFS.realPath(parent), newName);
            try {
                fs.symlinkSync(oldPath, newPath)
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        readlink: (function(node) {
            var path = NODEFS.realPath(node);
            try {
                path = fs.readlinkSync(path);
                path = NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root), path);
                return path
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        })
    },
    stream_ops: {
        open: (function(stream) {
            var path = NODEFS.realPath(stream.node);
            try {
                if (FS.isFile(stream.node.mode)) {
                    stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags))
                }
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        close: (function(stream) {
            try {
                if (FS.isFile(stream.node.mode) && stream.nfd) {
                    fs.closeSync(stream.nfd)
                }
            } catch (e) {
                if (!e.code) throw e;
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
        }),
        read: (function(stream, buffer, offset, length, position) {
            if (length === 0) return 0;
            var nbuffer = new Buffer(length);
            var res;
            try {
                res = fs.readSync(stream.nfd, nbuffer, 0, length, position)
            } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
            if (res > 0) {
                for (var i = 0; i < res; i++) {
                    buffer[offset + i] = nbuffer[i]
                }
            }
            return res
        }),
        write: (function(stream, buffer, offset, length, position) {
            var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
            var res;
            try {
                res = fs.writeSync(stream.nfd, nbuffer, 0, length, position)
            } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code])
            }
            return res
        }),
        llseek: (function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    try {
                        var stat = fs.fstatSync(stream.nfd);
                        position += stat.size
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES[e.code])
                    }
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            return position
        })
    }
};
var WORKERFS = {
    DIR_MODE: 16895,
    FILE_MODE: 33279,
    reader: null,
    mount: (function(mount) {
        assert(ENVIRONMENT_IS_WORKER);
        if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync;
        var root = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0);
        var createdParents = {};

        function ensureParent(path) {
            var parts = path.split("/");
            var parent = root;
            for (var i = 0; i < parts.length - 1; i++) {
                var curr = parts.slice(0, i + 1).join("/");
                if (!createdParents[curr]) {
                    createdParents[curr] = WORKERFS.createNode(parent, parts[i], WORKERFS.DIR_MODE, 0)
                }
                parent = createdParents[curr]
            }
            return parent
        }

        function base(path) {
            var parts = path.split("/");
            return parts[parts.length - 1]
        }
        Array.prototype.forEach.call(mount.opts["files"] || [], (function(file) {
            WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate)
        }));
        (mount.opts["blobs"] || []).forEach((function(obj) {
            WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"])
        }));
        (mount.opts["packages"] || []).forEach((function(pack) {
            pack["metadata"].files.forEach((function(file) {
                var name = file.filename.substr(1);
                WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack["blob"].slice(file.start, file.end))
            }))
        }));
        return root
    }),
    createNode: (function(parent, name, mode, dev, contents, mtime) {
        var node = FS.createNode(parent, name, mode);
        node.mode = mode;
        node.node_ops = WORKERFS.node_ops;
        node.stream_ops = WORKERFS.stream_ops;
        node.timestamp = (mtime || new Date).getTime();
        assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
        if (mode === WORKERFS.FILE_MODE) {
            node.size = contents.size;
            node.contents = contents
        } else {
            node.size = 4096;
            node.contents = {}
        }
        if (parent) {
            parent.contents[name] = node
        }
        return node
    }),
    node_ops: {
        getattr: (function(node) {
            return {
                dev: 1,
                ino: undefined,
                mode: node.mode,
                nlink: 1,
                uid: 0,
                gid: 0,
                rdev: undefined,
                size: node.size,
                atime: new Date(node.timestamp),
                mtime: new Date(node.timestamp),
                ctime: new Date(node.timestamp),
                blksize: 4096,
                blocks: Math.ceil(node.size / 4096)
            }
        }),
        setattr: (function(node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp
            }
        }),
        lookup: (function(parent, name) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }),
        mknod: (function(parent, name, mode, dev) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }),
        rename: (function(oldNode, newDir, newName) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }),
        unlink: (function(parent, name) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }),
        rmdir: (function(parent, name) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }),
        readdir: (function(node) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }),
        symlink: (function(parent, newName, oldPath) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }),
        readlink: (function(node) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        })
    },
    stream_ops: {
        read: (function(stream, buffer, offset, length, position) {
            if (position >= stream.node.size) return 0;
            var chunk = stream.node.contents.slice(position, position + length);
            var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
            buffer.set(new Uint8Array(ab), offset);
            return chunk.size
        }),
        write: (function(stream, buffer, offset, length, position) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO)
        }),
        llseek: (function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += stream.node.size
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            return position
        })
    }
};
STATICTOP += 16;
STATICTOP += 16;
STATICTOP += 16;
var FS = {
    root: null,
    mounts: [],
    devices: [null],
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: false,
    ignorePermissions: true,
    trackingDelegate: {},
    tracking: {
        openFlags: {
            READ: 1,
            WRITE: 2
        }
    },
    ErrnoError: null,
    genericErrors: {},
    filesystems: null,
    syncFSRequests: 0,
    handleFSError: (function(e) {
        if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
        return ___setErrNo(e.errno)
    }),
    lookupPath: (function(path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
        if (!path) return {
            path: "",
            node: null
        };
        var defaults = {
            follow_mount: true,
            recurse_count: 0
        };
        for (var key in defaults) {
            if (opts[key] === undefined) {
                opts[key] = defaults[key]
            }
        }
        if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
        }
        var parts = PATH.normalizeArray(path.split("/").filter((function(p) {
            return !!p
        })), false);
        var current = FS.root;
        var current_path = "/";
        for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
                break
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                    current = current.mounted.root
                }
            }
            if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                    var link = FS.readlink(current_path);
                    current_path = PATH.resolve(PATH.dirname(current_path), link);
                    var lookup = FS.lookupPath(current_path, {
                        recurse_count: opts.recurse_count
                    });
                    current = lookup.node;
                    if (count++ > 40) {
                        throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                    }
                }
            }
        }
        return {
            path: current_path,
            node: current
        }
    }),
    getPath: (function(node) {
        var path;
        while (true) {
            if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path) return mount;
                return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
            }
            path = path ? node.name + "/" + path : node.name;
            node = node.parent
        }
    }),
    hashName: (function(parentid, name) {
        var hash = 0;
        name = name.toLowerCase();
        for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0
        }
        return (parentid + hash >>> 0) % FS.nameTable.length
    }),
    hashAddNode: (function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node
    }),
    hashRemoveNode: (function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next
        } else {
            var current = FS.nameTable[hash];
            while (current) {
                if (current.name_next === node) {
                    current.name_next = node.name_next;
                    break
                }
                current = current.name_next
            }
        }
    }),
    lookupNode: (function(parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
            throw new FS.ErrnoError(err, parent)
        }
        var hash = FS.hashName(parent.id, name);
        name = name.toLowerCase();
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            nodeName = nodeName.toLowerCase();
            if (node.parent.id === parent.id && nodeName === name) {
                return node
            }
        }
        return FS.lookup(parent, name)
    }),
    createNode: (function(parent, name, mode, rdev) {
        if (!FS.FSNode) {
            FS.FSNode = (function(parent, name, mode, rdev) {
                if (!parent) {
                    parent = this
                }
                this.parent = parent;
                this.mount = parent.mount;
                this.mounted = null;
                this.id = FS.nextInode++;
                this.name = name;
                this.mode = mode;
                this.node_ops = {};
                this.stream_ops = {};
                this.rdev = rdev
            });
            FS.FSNode.prototype = {};
            var readMode = 292 | 73;
            var writeMode = 146;
            Object.defineProperties(FS.FSNode.prototype, {
                read: {
                    get: (function() {
                        return (this.mode & readMode) === readMode
                    }),
                    set: (function(val) {
                        val ? this.mode |= readMode : this.mode &= ~readMode
                    })
                },
                write: {
                    get: (function() {
                        return (this.mode & writeMode) === writeMode
                    }),
                    set: (function(val) {
                        val ? this.mode |= writeMode : this.mode &= ~writeMode
                    })
                },
                isFolder: {
                    get: (function() {
                        return FS.isDir(this.mode)
                    })
                },
                isDevice: {
                    get: (function() {
                        return FS.isChrdev(this.mode)
                    })
                }
            })
        }
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node
    }),
    destroyNode: (function(node) {
        FS.hashRemoveNode(node)
    }),
    isRoot: (function(node) {
        return node === node.parent
    }),
    isMountpoint: (function(node) {
        return !!node.mounted
    }),
    isFile: (function(mode) {
        return (mode & 61440) === 32768
    }),
    isDir: (function(mode) {
        return (mode & 61440) === 16384
    }),
    isLink: (function(mode) {
        return (mode & 61440) === 40960
    }),
    isChrdev: (function(mode) {
        return (mode & 61440) === 8192
    }),
    isBlkdev: (function(mode) {
        return (mode & 61440) === 24576
    }),
    isFIFO: (function(mode) {
        return (mode & 61440) === 4096
    }),
    isSocket: (function(mode) {
        return (mode & 49152) === 49152
    }),
    flagModes: {
        "r": 0,
        "rs": 1052672,
        "r+": 2,
        "w": 577,
        "wx": 705,
        "xw": 705,
        "w+": 578,
        "wx+": 706,
        "xw+": 706,
        "a": 1089,
        "ax": 1217,
        "xa": 1217,
        "a+": 1090,
        "ax+": 1218,
        "xa+": 1218
    },
    modeStringToFlags: (function(str) {
        var flags = FS.flagModes[str];
        if (typeof flags === "undefined") {
            throw new Error("Unknown file open mode: " + str)
        }
        return flags
    }),
    flagsToPermissionString: (function(flag) {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
            perms += "w"
        }
        return perms
    }),
    nodePermissions: (function(node, perms) {
        if (FS.ignorePermissions) {
            return 0
        }
        if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
            return ERRNO_CODES.EACCES
        } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
            return ERRNO_CODES.EACCES
        } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
            return ERRNO_CODES.EACCES
        }
        return 0
    }),
    mayLookup: (function(dir) {
        var err = FS.nodePermissions(dir, "x");
        if (err) return err;
        if (!dir.node_ops.lookup) return ERRNO_CODES.EACCES;
        return 0
    }),
    mayCreate: (function(dir, name) {
        try {
            var node = FS.lookupNode(dir, name);
            return ERRNO_CODES.EEXIST
        } catch (e) {}
        return FS.nodePermissions(dir, "wx")
    }),
    mayDelete: (function(dir, name, isdir) {
        var node;
        try {
            node = FS.lookupNode(dir, name)
        } catch (e) {
            return e.errno
        }
        var err = FS.nodePermissions(dir, "wx");
        if (err) {
            return err
        }
        if (isdir) {
            if (!FS.isDir(node.mode)) {
                return ERRNO_CODES.ENOTDIR
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return ERRNO_CODES.EBUSY
            }
        } else {
            if (FS.isDir(node.mode)) {
                return ERRNO_CODES.EISDIR
            }
        }
        return 0
    }),
    mayOpen: (function(node, flags) {
        if (!node) {
            return ERRNO_CODES.ENOENT
        }
        if (FS.isLink(node.mode)) {
            return ERRNO_CODES.ELOOP
        } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                return ERRNO_CODES.EISDIR
            }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
    }),
    MAX_OPEN_FDS: 4096,
    nextfd: (function(fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
                return fd
            }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE)
    }),
    getStream: (function(fd) {
        return FS.streams[fd]
    }),
    createStream: (function(stream, fd_start, fd_end) {
        if (!FS.FSStream) {
            FS.FSStream = (function() {});
            FS.FSStream.prototype = {};
            Object.defineProperties(FS.FSStream.prototype, {
                object: {
                    get: (function() {
                        return this.node
                    }),
                    set: (function(val) {
                        this.node = val
                    })
                },
                isRead: {
                    get: (function() {
                        return (this.flags & 2097155) !== 1
                    })
                },
                isWrite: {
                    get: (function() {
                        return (this.flags & 2097155) !== 0
                    })
                },
                isAppend: {
                    get: (function() {
                        return this.flags & 1024
                    })
                }
            })
        }
        var newStream = new FS.FSStream;
        for (var p in stream) {
            newStream[p] = stream[p]
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream
    }),
    closeStream: (function(fd) {
        FS.streams[fd] = null
    }),
    chrdev_stream_ops: {
        open: (function(stream) {
            var device = FS.getDevice(stream.node.rdev);
            stream.stream_ops = device.stream_ops;
            if (stream.stream_ops.open) {
                stream.stream_ops.open(stream)
            }
        }),
        llseek: (function() {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
        })
    },
    major: (function(dev) {
        return dev >> 8
    }),
    minor: (function(dev) {
        return dev & 255
    }),
    makedev: (function(ma, mi) {
        return ma << 8 | mi
    }),
    registerDevice: (function(dev, ops) {
        FS.devices[dev] = {
            stream_ops: ops
        }
    }),
    getDevice: (function(dev) {
        return FS.devices[dev]
    }),
    getMounts: (function(mount) {
        var mounts = [];
        var check = [mount];
        while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts)
        }
        return mounts
    }),
    syncfs: (function(populate, callback) {
        if (typeof populate === "function") {
            callback = populate;
            populate = false
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
            console.log("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work")
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;

        function doCallback(err) {
            assert(FS.syncFSRequests > 0);
            FS.syncFSRequests--;
            return callback(err)
        }

        function done(err) {
            if (err) {
                if (!done.errored) {
                    done.errored = true;
                    return doCallback(err)
                }
                return
            }
            if (++completed >= mounts.length) {
                doCallback(null)
            }
        }
        mounts.forEach((function(mount) {
            if (!mount.type.syncfs) {
                return done(null)
            }
            mount.type.syncfs(mount, populate, done)
        }))
    }),
    mount: (function(type, opts, mountpoint) {
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
        } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, {
                follow_mount: false
            });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
            }
            if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
            }
        }
        var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            mounts: []
        };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
            FS.root = mountRoot
        } else if (node) {
            node.mounted = mount;
            if (node.mount) {
                node.mount.mounts.push(mount)
            }
        }
        return mountRoot
    }),
    unmount: (function(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, {
            follow_mount: false
        });
        if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach((function(hash) {
            var current = FS.nameTable[hash];
            while (current) {
                var next = current.name_next;
                if (mounts.indexOf(current.mount) !== -1) {
                    FS.destroyNode(current)
                }
                current = next
            }
        }));
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1)
    }),
    lookup: (function(parent, name) {
        return parent.node_ops.lookup(parent, name)
    }),
    mknod: (function(path, mode, dev) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var err = FS.mayCreate(parent, name);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        return parent.node_ops.mknod(parent, name, mode, dev)
    }),
    create: (function(path, mode) {
        mode = mode !== undefined ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0)
    }),
    mkdir: (function(path, mode) {
        mode = mode !== undefined ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0)
    }),
    mkdirTree: (function(path, mode) {
        var dirs = path.split("/");
        var d = "";
        for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += "/" + dirs[i];
            try {
                FS.mkdir(d, mode)
            } catch (e) {
                if (e.errno != ERRNO_CODES.EEXIST) throw e
            }
        }
    }),
    mkdev: (function(path, mode, dev) {
        if (typeof dev === "undefined") {
            dev = mode;
            mode = 438
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev)
    }),
    symlink: (function(oldpath, newpath) {
        if (!PATH.resolve(oldpath)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        var lookup = FS.lookupPath(newpath, {
            parent: true
        });
        var parent = lookup.node;
        if (!parent) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        return parent.node_ops.symlink(parent, newname, oldpath)
    }),
    rename: (function(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        try {
            lookup = FS.lookupPath(old_path, {
                parent: true
            });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, {
                parent: true
            });
            new_dir = lookup.node
        } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
        }
        if (!old_dir || !new_dir) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(ERRNO_CODES.EXDEV)
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
        }
        var new_node;
        try {
            new_node = FS.lookupNode(new_dir, new_name)
        } catch (e) {}
        if (old_node === new_node) {
            return
        }
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        err = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
        }
        if (new_dir !== old_dir) {
            err = FS.nodePermissions(old_dir, "w");
            if (err) {
                throw new FS.ErrnoError(err)
            }
        }
        try {
            if (FS.trackingDelegate["willMovePath"]) {
                FS.trackingDelegate["willMovePath"](old_path, new_path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
        }
        FS.hashRemoveNode(old_node);
        try {
            old_dir.node_ops.rename(old_node, new_dir, new_name)
        } catch (e) {
            throw e
        } finally {
            FS.hashAddNode(old_node)
        }
        try {
            if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path)
        } catch (e) {
            console.log("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
        }
    }),
    rmdir: (function(path) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
            console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
        }
    }),
    readdir: (function(path) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
        }
        return node.node_ops.readdir(node)
    }),
    unlink: (function(path) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
            console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
        }
    }),
    readlink: (function(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        return PATH.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
    }),
    stat: (function(path, dontFollow) {
        var lookup = FS.lookupPath(path, {
            follow: !dontFollow
        });
        var node = lookup.node;
        if (!node) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        return node.node_ops.getattr(node)
    }),
    lstat: (function(path) {
        return FS.stat(path, true)
    }),
    chmod: (function(path, mode, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        node.node_ops.setattr(node, {
            mode: mode & 4095 | node.mode & ~4095,
            timestamp: Date.now()
        })
    }),
    lchmod: (function(path, mode) {
        FS.chmod(path, mode, true)
    }),
    fchmod: (function(fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        FS.chmod(stream.node, mode)
    }),
    chown: (function(path, uid, gid, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        node.node_ops.setattr(node, {
            timestamp: Date.now()
        })
    }),
    lchown: (function(path, uid, gid) {
        FS.chown(path, uid, gid, true)
    }),
    fchown: (function(fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        FS.chown(stream.node, uid, gid)
    }),
    truncate: (function(path, len) {
        if (len < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: true
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(ERRNO_CODES.EPERM)
        }
        if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
        }
        if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var err = FS.nodePermissions(node, "w");
        if (err) {
            throw new FS.ErrnoError(err)
        }
        node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
        })
    }),
    ftruncate: (function(fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        FS.truncate(stream.node, len)
    }),
    utime: (function(path, atime, mtime) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
        })
    }),
    open: (function(path, flags, mode, fd_start, fd_end) {
        if (path === "") {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === "undefined" ? 438 : mode;
        if (flags & 64) {
            mode = mode & 4095 | 32768
        } else {
            mode = 0
        }
        var node;
        if (typeof path === "object") {
            node = path
        } else {
            path = PATH.normalize(path);
            try {
                var lookup = FS.lookupPath(path, {
                    follow: !(flags & 131072)
                });
                node = lookup.node
            } catch (e) {}
        }
        var created = false;
        if (flags & 64) {
            if (node) {
                if (flags & 128) {
                    throw new FS.ErrnoError(ERRNO_CODES.EEXIST)
                }
            } else {
                node = FS.mknod(path, mode, 0);
                created = true
            }
        }
        if (!node) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        if (FS.isChrdev(node.mode)) {
            flags &= ~512
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
        }
        if (!created) {
            var err = FS.mayOpen(node, flags);
            if (err) {
                throw new FS.ErrnoError(err)
            }
        }
        if (flags & 512) {
            FS.truncate(node, 0)
        }
        flags &= ~(128 | 512);
        var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            ungotten: [],
            error: false
        }, fd_start, fd_end);
        if (stream.stream_ops.open) {
            stream.stream_ops.open(stream)
        }
        if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
                Module["printErr"]("read file: " + path)
            }
        }
        try {
            if (FS.trackingDelegate["onOpenFile"]) {
                var trackingFlags = 0;
                if ((flags & 2097155) !== 1) {
                    trackingFlags |= FS.tracking.openFlags.READ
                }
                if ((flags & 2097155) !== 0) {
                    trackingFlags |= FS.tracking.openFlags.WRITE
                }
                FS.trackingDelegate["onOpenFile"](path, trackingFlags)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message)
        }
        return stream
    }),
    close: (function(stream) {
        if (stream.getdents) stream.getdents = null;
        try {
            if (stream.stream_ops.close) {
                stream.stream_ops.close(stream)
            }
        } catch (e) {
            throw e
        } finally {
            FS.closeStream(stream.fd)
        }
    }),
    llseek: (function(stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position
    }),
    read: (function(stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
        }
        if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        var seeking = true;
        if (typeof position === "undefined") {
            position = stream.position;
            seeking = false
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead
    }),
    write: (function(stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EISDIR)
        }
        if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        if (stream.flags & 1024) {
            FS.llseek(stream, 0, 2)
        }
        var seeking = true;
        if (typeof position === "undefined") {
            position = stream.position;
            seeking = false
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        try {
            if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path)
        } catch (e) {
            console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + e.message)
        }
        return bytesWritten
    }),
    allocate: (function(stream, offset, length) {
        if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EBADF)
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
        }
        if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)
        }
        stream.stream_ops.allocate(stream, offset, length)
    }),
    mmap: (function(stream, buffer, offset, length, position, prot, flags) {
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(ERRNO_CODES.EACCES)
        }
        if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV)
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags)
    }),
    msync: (function(stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
            return 0
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
    }),
    munmap: (function(stream) {
        return 0
    }),
    ioctl: (function(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTTY)
        }
        return stream.stream_ops.ioctl(stream, cmd, arg)
    }),
    readFile: (function(path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "r";
        opts.encoding = opts.encoding || "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"')
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0)
        } else if (opts.encoding === "binary") {
            ret = buf
        }
        FS.close(stream);
        return ret
    }),
    writeFile: (function(path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "w";
        opts.encoding = opts.encoding || "utf8";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"')
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === "utf8") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, 0, opts.canOwn)
        } else if (opts.encoding === "binary") {
            FS.write(stream, data, 0, data.length, 0, opts.canOwn)
        }
        FS.close(stream)
    }),
    cwd: (function() {
        return FS.currentPath
    }),
    chdir: (function(path) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        if (lookup.node === null) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
        }
        if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
        }
        var err = FS.nodePermissions(lookup.node, "x");
        if (err) {
            throw new FS.ErrnoError(err)
        }
        FS.currentPath = lookup.path
    }),
    createDefaultDirectories: (function() {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user")
    }),
    createDefaultDevices: (function() {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
            read: (function() {
                return 0
            }),
            write: (function(stream, buffer, offset, length, pos) {
                return length
            })
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var random_device;
        if (typeof crypto !== "undefined") {
            var randomBuffer = new Uint8Array(1);
            random_device = (function() {
                crypto.getRandomValues(randomBuffer);
                return randomBuffer[0]
            })
        } else if (ENVIRONMENT_IS_NODE) {
            random_device = (function() {
                return require("crypto").randomBytes(1)[0]
            })
        } else {
            random_device = (function() {
                return Math.random() * 256 | 0
            })
        }
        FS.createDevice("/dev", "random", random_device);
        FS.createDevice("/dev", "urandom", random_device);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp")
    }),
    createSpecialDirectories: (function() {
        FS.mkdir("/proc");
        FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount({
            mount: (function() {
                var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
                node.node_ops = {
                    lookup: (function(parent, name) {
                        var fd = +name;
                        var stream = FS.getStream(fd);
                        if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                        var ret = {
                            parent: null,
                            mount: {
                                mountpoint: "fake"
                            },
                            node_ops: {
                                readlink: (function() {
                                    return stream.path
                                })
                            }
                        };
                        ret.parent = ret;
                        return ret
                    })
                };
                return node
            })
        }, {}, "/proc/self/fd")
    }),
    createStandardStreams: (function() {
        if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdin")
        }
        if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdout")
        }
        if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"])
        } else {
            FS.symlink("/dev/tty1", "/dev/stderr")
        }
        var stdin = FS.open("/dev/stdin", "r");
        assert(stdin.fd === 0, "invalid handle for stdin (" + stdin.fd + ")");
        var stdout = FS.open("/dev/stdout", "w");
        assert(stdout.fd === 1, "invalid handle for stdout (" + stdout.fd + ")");
        var stderr = FS.open("/dev/stderr", "w");
        assert(stderr.fd === 2, "invalid handle for stderr (" + stderr.fd + ")")
    }),
    ensureErrnoError: (function() {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = (function(errno) {
                this.errno = errno;
                for (var key in ERRNO_CODES) {
                    if (ERRNO_CODES[key] === errno) {
                        this.code = key;
                        break
                    }
                }
            });
            this.setErrno(errno);
            this.message = ERRNO_MESSAGES[errno]
        };
        FS.ErrnoError.prototype = new Error;
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        [ERRNO_CODES.ENOENT].forEach((function(code) {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>"
        }))
    }),
    staticInit: (function() {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = {
            "MEMFS": MEMFS,
            "IDBFS": IDBFS,
            "NODEFS": NODEFS,
            "WORKERFS": WORKERFS
        }
    }),
    init: (function(input, output, error) {
        assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
        FS.init.initialized = true;
        FS.ensureErrnoError();
        Module["stdin"] = input || Module["stdin"];
        Module["stdout"] = output || Module["stdout"];
        Module["stderr"] = error || Module["stderr"];
        FS.createStandardStreams()
    }),
    quit: (function() {
        FS.init.initialized = false;
        var fflush = Module["_fflush"];
        if (fflush) fflush(0);
        for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
                continue
            }
            FS.close(stream)
        }
    }),
    getMode: (function(canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode
    }),
    joinPath: (function(parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == "/") path = path.substr(1);
        return path
    }),
    absolutePath: (function(relative, base) {
        return PATH.resolve(base, relative)
    }),
    standardizePath: (function(path) {
        return PATH.normalize(path)
    }),
    findObject: (function(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
            return ret.object
        } else {
            ___setErrNo(ret.error);
            return null
        }
    }),
    analyzePath: (function(path, dontResolveLastLink) {
        try {
            var lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            path = lookup.path
        } catch (e) {}
        var ret = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null
        };
        try {
            var lookup = FS.lookupPath(path, {
                parent: true
            });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/"
        } catch (e) {
            ret.error = e.errno
        }
        return ret
    }),
    createFolder: (function(parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode)
    }),
    createPath: (function(parent, path, canRead, canWrite) {
        parent = typeof parent === "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
                FS.mkdir(current)
            } catch (e) {}
            parent = current
        }
        return current
    }),
    createFile: (function(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode)
    }),
    createDataFile: (function(parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
            if (typeof data === "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
                data = arr
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, "w");
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode)
        }
        return node
    }),
    createDevice: (function(parent, name, input, output) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
            open: (function(stream) {
                stream.seekable = false
            }),
            close: (function(stream) {
                if (output && output.buffer && output.buffer.length) {
                    output(10)
                }
            }),
            read: (function(stream, buffer, offset, length, pos) {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = input()
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES.EIO)
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                    }
                    if (result === null || result === undefined) break;
                    bytesRead++;
                    buffer[offset + i] = result
                }
                if (bytesRead) {
                    stream.node.timestamp = Date.now()
                }
                return bytesRead
            }),
            write: (function(stream, buffer, offset, length, pos) {
                for (var i = 0; i < length; i++) {
                    try {
                        output(buffer[offset + i])
                    } catch (e) {
                        throw new FS.ErrnoError(ERRNO_CODES.EIO)
                    }
                }
                if (length) {
                    stream.node.timestamp = Date.now()
                }
                return i
            })
        });
        return FS.mkdev(path, mode, dev)
    }),
    createLink: (function(parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path)
    }),
    forceLoadFile: (function(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
        } else if (Module["read"]) {
            try {
                obj.contents = intArrayFromString(Module["read"](obj.url), true);
                obj.usedBytes = obj.contents.length
            } catch (e) {
                success = false
            }
        } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.")
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success
    }),
    createLazyFile: (function(parent, name, url, canRead, canWrite) {
        function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
                return undefined
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset]
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest;
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
                if (xhr.overrideMimeType) {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined")
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                    return new Uint8Array(xhr.response || [])
                } else {
                    return intArrayFromString(xhr.responseText || "", true)
                }
            });
            var lazyArray = this;
            lazyArray.setDataGetter((function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                    lazyArray.chunks[chunkNum] = doXHR(start, end)
                }
                if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum]
            }));
            if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                console.log("LazyFiles on gzip forces download of the whole file when length is accessed")
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true
        };
        if (typeof XMLHttpRequest !== "undefined") {
            if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array;
            Object.defineProperties(lazyArray, {
                length: {
                    get: (function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._length
                    })
                },
                chunkSize: {
                    get: (function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._chunkSize
                    })
                }
            });
            var properties = {
                isDevice: false,
                contents: lazyArray
            }
        } else {
            var properties = {
                isDevice: false,
                url: url
            }
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
            node.contents = properties.contents
        } else if (properties.url) {
            node.contents = null;
            node.url = properties.url
        }
        Object.defineProperties(node, {
            usedBytes: {
                get: (function() {
                    return this.contents.length
                })
            }
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach((function(key) {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
                if (!FS.forceLoadFile(node)) {
                    throw new FS.ErrnoError(ERRNO_CODES.EIO)
                }
                return fn.apply(null, arguments)
            }
        }));
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
            if (!FS.forceLoadFile(node)) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO)
            }
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            assert(size >= 0);
            if (contents.slice) {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i]
                }
            } else {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents.get(position + i)
                }
            }
            return size
        };
        node.stream_ops = stream_ops;
        return node
    }),
    createPreloadedFile: (function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init();
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency("cp " + fullname);

        function processData(byteArray) {
            function finish(byteArray) {
                if (preFinish) preFinish();
                if (!dontCreateFile) {
                    FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
                }
                if (onload) onload();
                removeRunDependency(dep)
            }
            var handled = false;
            Module["preloadPlugins"].forEach((function(plugin) {
                if (handled) return;
                if (plugin["canHandle"](fullname)) {
                    plugin["handle"](byteArray, fullname, finish, (function() {
                        if (onerror) onerror();
                        removeRunDependency(dep)
                    }));
                    handled = true
                }
            }));
            if (!handled) finish(byteArray)
        }
        addRunDependency(dep);
        if (typeof url == "string") {
            Browser.asyncLoad(url, (function(byteArray) {
                processData(byteArray)
            }), onerror)
        } else {
            processData(url)
        }
    }),
    indexedDB: (function() {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    }),
    DB_NAME: (function() {
        return "EM_FS_" + window.location.pathname
    }),
    DB_VERSION: 20,
    DB_STORE_NAME: "FILE_DATA",
    saveFilesToDB: (function(paths, onload, onerror) {
        onload = onload || (function() {});
        onerror = onerror || (function() {});
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
            console.log("creating db");
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME)
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
                fail = 0,
                total = paths.length;

            function finish() {
                if (fail == 0) onload();
                else onerror()
            }
            paths.forEach((function(path) {
                var putRequest = files.put(FS.analyzePath(path).object.contents, path);
                putRequest.onsuccess = function putRequest_onsuccess() {
                    ok++;
                    if (ok + fail == total) finish()
                };
                putRequest.onerror = function putRequest_onerror() {
                    fail++;
                    if (ok + fail == total) finish()
                }
            }));
            transaction.onerror = onerror
        };
        openRequest.onerror = onerror
    }),
    loadFilesFromDB: (function(paths, onload, onerror) {
        onload = onload || (function() {});
        onerror = onerror || (function() {});
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = onerror;
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            try {
                var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
            } catch (e) {
                onerror(e);
                return
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
                fail = 0,
                total = paths.length;

            function finish() {
                if (fail == 0) onload();
                else onerror()
            }
            paths.forEach((function(path) {
                var getRequest = files.get(path);
                getRequest.onsuccess = function getRequest_onsuccess() {
                    if (FS.analyzePath(path).exists) {
                        FS.unlink(path)
                    }
                    FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                    ok++;
                    if (ok + fail == total) finish()
                };
                getRequest.onerror = function getRequest_onerror() {
                    fail++;
                    if (ok + fail == total) finish()
                }
            }));
            transaction.onerror = onerror
        };
        openRequest.onerror = onerror
    })
};
var SYSCALLS = {
    DEFAULT_POLLMASK: 5,
    mappings: {},
    umask: 511,
    calculateAt: (function(dirfd, path) {
        if (path[0] !== "/") {
            var dir;
            if (dirfd === -100) {
                dir = FS.cwd()
            } else {
                var dirstream = FS.getStream(dirfd);
                if (!dirstream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                dir = dirstream.path
            }
            path = PATH.join2(dir, path)
        }
        return path
    }),
    doStat: (function(func, path, buf) {
        try {
            var stat = func(path)
        } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
                return -ERRNO_CODES.ENOTDIR
            }
            throw e
        }
        HEAP32[buf >> 2] = stat.dev;
        HEAP32[buf + 4 >> 2] = 0;
        HEAP32[buf + 8 >> 2] = stat.ino;
        HEAP32[buf + 12 >> 2] = stat.mode;
        HEAP32[buf + 16 >> 2] = stat.nlink;
        HEAP32[buf + 20 >> 2] = stat.uid;
        HEAP32[buf + 24 >> 2] = stat.gid;
        HEAP32[buf + 28 >> 2] = stat.rdev;
        HEAP32[buf + 32 >> 2] = 0;
        HEAP32[buf + 36 >> 2] = stat.size;
        HEAP32[buf + 40 >> 2] = 4096;
        HEAP32[buf + 44 >> 2] = stat.blocks;
        HEAP32[buf + 48 >> 2] = stat.atime.getTime() / 1e3 | 0;
        HEAP32[buf + 52 >> 2] = 0;
        HEAP32[buf + 56 >> 2] = stat.mtime.getTime() / 1e3 | 0;
        HEAP32[buf + 60 >> 2] = 0;
        HEAP32[buf + 64 >> 2] = stat.ctime.getTime() / 1e3 | 0;
        HEAP32[buf + 68 >> 2] = 0;
        HEAP32[buf + 72 >> 2] = stat.ino;
        return 0
    }),
    doMsync: (function(addr, stream, len, flags) {
        var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
        FS.msync(stream, buffer, 0, len, flags)
    }),
    doMkdir: (function(path, mode) {
        path = PATH.normalize(path);
        if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
        FS.mkdir(path, mode, 0);
        return 0
    }),
    doMknod: (function(path, mode, dev) {
        switch (mode & 61440) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
                break;
            default:
                return -ERRNO_CODES.EINVAL
        }
        FS.mknod(path, mode, dev);
        return 0
    }),
    doReadlink: (function(path, buf, bufsize) {
        if (bufsize <= 0) return -ERRNO_CODES.EINVAL;
        var ret = FS.readlink(path);
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf + len];
        stringToUTF8(ret, buf, bufsize + 1);
        HEAP8[buf + len] = endChar;
        return len
    }),
    doAccess: (function(path, amode) {
        if (amode & ~7) {
            return -ERRNO_CODES.EINVAL
        }
        var node;
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        node = lookup.node;
        var perms = "";
        if (amode & 4) perms += "r";
        if (amode & 2) perms += "w";
        if (amode & 1) perms += "x";
        if (perms && FS.nodePermissions(node, perms)) {
            return -ERRNO_CODES.EACCES
        }
        return 0
    }),
    doDup: (function(path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd
    }),
    doReadv: (function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break
        }
        return ret
    }),
    doWritev: (function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr
        }
        return ret
    }),
    varargs: 0,
    get: (function(varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret
    }),
    getStr: (function() {
        var ret = Pointer_stringify(SYSCALLS.get());
        return ret
    }),
    getStreamFromFD: (function() {
        var stream = FS.getStream(SYSCALLS.get());
        if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return stream
    }),
    getSocketFromFD: (function() {
        var socket = SOCKFS.getSocket(SYSCALLS.get());
        if (!socket) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return socket
    }),
    getSocketAddress: (function(allowNull) {
        var addrp = SYSCALLS.get(),
            addrlen = SYSCALLS.get();
        if (allowNull && addrp === 0) return null;
        var info = __read_sockaddr(addrp, addrlen);
        if (info.errno) throw new FS.ErrnoError(info.errno);
        info.addr = DNS.lookup_addr(info.addr) || info.addr;
        return info
    }),
    get64: (function() {
        var low = SYSCALLS.get(),
            high = SYSCALLS.get();
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low
    }),
    getZero: (function() {
        assert(SYSCALLS.get() === 0)
    })
};

function ___syscall54(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            op = SYSCALLS.get();
        switch (op) {
            case 21505:
                {
                    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
                    return 0
                };
            case 21506:
                {
                    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
                    return 0
                };
            case 21519:
                {
                    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
                    var argp = SYSCALLS.get();HEAP32[argp >> 2] = 0;
                    return 0
                };
            case 21520:
                {
                    if (!stream.tty) return -ERRNO_CODES.ENOTTY;
                    return -ERRNO_CODES.EINVAL
                };
            case 21531:
                {
                    var argp = SYSCALLS.get();
                    return FS.ioctl(stream, op, argp)
                };
            default:
                abort("bad ioctl syscall " + op)
        }
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}
var ___tm_current = STATICTOP;
STATICTOP += 48;
var ___tm_timezone = allocate(intArrayFromString("GMT"), "i8", ALLOC_STATIC);

function _localtime_r(time, tmPtr) {
    _tzset();
    var date = new Date(HEAP32[time >> 2] * 1e3);
    HEAP32[tmPtr >> 2] = date.getSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getHours();
    HEAP32[tmPtr + 12 >> 2] = date.getDate();
    HEAP32[tmPtr + 16 >> 2] = date.getMonth();
    HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
    HEAP32[tmPtr + 24 >> 2] = date.getDay();
    var start = new Date(date.getFullYear(), 0, 1);
    var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
    var summerOffset = (new Date(2e3, 6, 1)).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dst = date.getTimezoneOffset() == Math.min(winterOffset, summerOffset) | 0;
    HEAP32[tmPtr + 32 >> 2] = dst;
    var zonePtr = HEAP32[_tzname + (dst ? Runtime.QUANTUM_SIZE : 0) >> 2];
    HEAP32[tmPtr + 40 >> 2] = zonePtr;
    return tmPtr
}

function _localtime(time) {
    return _localtime_r(time, ___tm_current)
}

function _eglSwapBuffers() {
    if (!EGL.defaultDisplayInitialized) {
        EGL.setErrorCode(12289)
    } else if (!Module.ctx) {
        EGL.setErrorCode(12290)
    } else if (Module.ctx.isContextLost()) {
        EGL.setErrorCode(12302)
    } else {
        EGL.setErrorCode(12288);
        return 1
    }
    return 0
}

function _emscripten_glFrustum() {
    Module["printErr"]("missing function: emscripten_glFrustum");
    abort(-1)
}

function _emscripten_glGetTexParameterfv(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAPF32[params >> 2] = GLctx.getTexParameter(target, pname)
}

function _emscripten_glUniform4i(location, v0, v1, v2, v3) {
    GLctx.uniform4i(GL.uniforms[location], v0, v1, v2, v3)
}

function _glDepthRangef(x0, x1) {
    GLctx["depthRange"](x0, x1)
}

function _emscripten_glViewport(x0, x1, x2, x3) {
    GLctx["viewport"](x0, x1, x2, x3)
}

function _dlclose(handle) {
    if (!DLFCN.loadedLibs[handle]) {
        DLFCN.errorMsg = "Tried to dlclose() unopened handle: " + handle;
        return 1
    } else {
        var lib_record = DLFCN.loadedLibs[handle];
        if (--lib_record.refcount == 0) {
            if (lib_record.module.cleanups) {
                lib_record.module.cleanups.forEach((function(cleanup) {
                    cleanup()
                }))
            }
            delete DLFCN.loadedLibNames[lib_record.name];
            delete DLFCN.loadedLibs[handle]
        }
        return 0
    }
}

function __emscripten_sample_gamepad_data() {
    if (!JSEvents.numGamepadsConnected) return;
    if (Browser.mainLoop.currentFrameNumber !== JSEvents.lastGamepadStateFrame || !Browser.mainLoop.currentFrameNumber) {
        JSEvents.lastGamepadState = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : null;
        JSEvents.lastGamepadStateFrame = Browser.mainLoop.currentFrameNumber
    }
}

function _emscripten_get_gamepad_status(index, gamepadState) {
    __emscripten_sample_gamepad_data();
    if (!JSEvents.lastGamepadState) return -1;
    if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
    if (!JSEvents.lastGamepadState[index]) return -7;
    JSEvents.fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
    return 0
}

function _glClearDepthf(x0) {
    GLctx["clearDepth"](x0)
}

function _utime(path, times) {
    var time;
    if (times) {
        var offset = 4;
        time = HEAP32[times + offset >> 2];
        time *= 1e3
    } else {
        time = Date.now()
    }
    path = Pointer_stringify(path);
    try {
        FS.utime(path, time, time);
        return 0
    } catch (e) {
        FS.handleFSError(e);
        return -1
    }
}

function _emscripten_glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
    GLctx["copyTexImage2D"](x0, x1, x2, x3, x4, x5, x6, x7)
}
var AL = {
    contexts: [],
    currentContext: null,
    alcErr: 0,
    stringCache: {},
    alcStringCache: {},
    QUEUE_INTERVAL: 25,
    QUEUE_LOOKAHEAD: 100,
    newSrcId: 1,
    updateSources: function updateSources(context) {
        if (Browser.mainLoop.timingMode == 1 && document["visibilityState"] != "visible") return;
        for (var srcId in context.src) {
            AL.updateSource(context.src[srcId])
        }
    },
    updateSource: function updateSource(src) {
        if (Browser.mainLoop.timingMode == 1 && document["visibilityState"] != "visible") return;
        if (src.state !== 4114) {
            return
        }
        var currentTime = src.context.ctx.currentTime;
        var startTime = src.bufferPosition;
        for (var i = src.buffersPlayed; i < src.queue.length; i++) {
            var entry = src.queue[i];
            var startOffset = (startTime - currentTime) / src.playbackRate;
            var endTime;
            if (entry.src) endTime = startTime + entry.src.duration;
            else endTime = startTime + entry.buffer.duration / src.playbackRate;
            if (currentTime >= endTime) {
                src.bufferPosition = endTime;
                src.buffersPlayed = i + 1;
                if (src.buffersPlayed >= src.queue.length) {
                    if (src.loop) {
                        AL.setSourceState(src, 4114)
                    } else {
                        AL.setSourceState(src, 4116)
                    }
                }
            } else if (startOffset < AL.QUEUE_LOOKAHEAD / 1e3 && !entry.src) {
                var offset = Math.abs(Math.min(startOffset, 0));
                entry.src = src.context.ctx.createBufferSource();
                entry.src.buffer = entry.buffer;
                entry.src.connect(src.gain);
                if (src.playbackRate != 1) entry.src.playbackRate.value = src.playbackRate;
                entry.src.duration = entry.buffer.duration / src.playbackRate;
                if (typeof entry.src.start !== "undefined") {
                    entry.src.start(startTime, offset)
                } else if (typeof entry.src.noteOn !== "undefined") {
                    entry.src.noteOn(startTime)
                }
            }
            startTime = endTime
        }
    },
    setSourceState: function setSourceState(src, state) {
        if (state === 4114) {
            if (src.state !== 4115) {
                src.state = 4114;
                src.bufferPosition = AL.currentContext.ctx.currentTime;
                src.buffersPlayed = 0
            } else {
                src.state = 4114;
                src.bufferPosition = AL.currentContext.ctx.currentTime - src.bufferPosition
            }
            AL.stopSourceQueue(src);
            AL.updateSource(src)
        } else if (state === 4115) {
            if (src.state === 4114) {
                src.state = 4115;
                src.bufferPosition = AL.currentContext.ctx.currentTime - src.bufferPosition;
                AL.stopSourceQueue(src)
            }
        } else if (state === 4116) {
            if (src.state !== 4113) {
                src.state = 4116;
                src.buffersPlayed = src.queue.length;
                AL.stopSourceQueue(src)
            }
        } else if (state == 4113) {
            if (src.state !== 4113) {
                src.state = 4113;
                src.bufferPosition = 0;
                src.buffersPlayed = 0
            }
        }
    },
    stopSourceQueue: function stopSourceQueue(src) {
        for (var i = 0; i < src.queue.length; i++) {
            var entry = src.queue[i];
            if (entry.src) {
                entry.src.stop(0);
                entry.src = null
            }
        }
    }
};

function _alcGetString(device, param) {
    if (AL.alcStringCache[param]) return AL.alcStringCache[param];
    var ret;
    switch (param) {
        case 0:
            ret = "No Error";
            break;
        case 40961:
            ret = "Invalid Device";
            break;
        case 40962:
            ret = "Invalid Context";
            break;
        case 40963:
            ret = "Invalid Enum";
            break;
        case 40964:
            ret = "Invalid Value";
            break;
        case 40965:
            ret = "Out of Memory";
            break;
        case 4100:
            if (typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined") {
                ret = "Device"
            } else {
                return 0
            }
            break;
        case 4101:
            if (typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined") {
                ret = "Device "
            } else {
                ret = " "
            }
            break;
        case 785:
            return 0;
            break;
        case 784:
            ret = " ";
            break;
        case 4102:
            if (!device) {
                AL.alcErr = 40961;
                return 0
            }
            ret = "";
            break;
        default:
            AL.alcErr = 40963;
            return 0
    }
    ret = allocate(intArrayFromString(ret), "i8", ALLOC_NORMAL);
    AL.alcStringCache[param] = ret;
    return ret
}

function _emscripten_glTexParameterfv(target, pname, params) {
    var param = HEAPF32[params >> 2];
    GLctx.texParameterf(target, pname, param)
}

function _gethostbyname(name) {
    name = Pointer_stringify(name);
    var ret = _malloc(20);
    var nameBuf = _malloc(name.length + 1);
    stringToUTF8(name, nameBuf, name.length + 1);
    HEAP32[ret >> 2] = nameBuf;
    var aliasesBuf = _malloc(4);
    HEAP32[aliasesBuf >> 2] = 0;
    HEAP32[ret + 4 >> 2] = aliasesBuf;
    var afinet = 2;
    HEAP32[ret + 8 >> 2] = afinet;
    HEAP32[ret + 12 >> 2] = 4;
    var addrListBuf = _malloc(12);
    HEAP32[addrListBuf >> 2] = addrListBuf + 8;
    HEAP32[addrListBuf + 4 >> 2] = 0;
    HEAP32[addrListBuf + 8 >> 2] = __inet_pton4_raw(DNS.lookup_name(name));
    HEAP32[ret + 16 >> 2] = addrListBuf;
    return ret
}

function _gethostbyaddr(addr, addrlen, type) {
    if (type !== 2) {
        ___setErrNo(ERRNO_CODES.EAFNOSUPPORT);
        return null
    }
    addr = HEAP32[addr >> 2];
    var host = __inet_ntop4_raw(addr);
    var lookup = DNS.lookup_addr(host);
    if (lookup) {
        host = lookup
    }
    var hostp = allocate(intArrayFromString(host), "i8", ALLOC_STACK);
    return _gethostbyname(hostp)
}

function _emscripten_glDepthRangef(x0, x1) {
    GLctx["depthRange"](x0, x1)
}
var _llvm_fabs_f32 = Math_abs;

function _emscripten_glUniform3f(location, v0, v1, v2) {
    GLctx.uniform3f(GL.uniforms[location], v0, v1, v2)
}

function _emscripten_glGetObjectParameterivARB() {
    Module["printErr"]("missing function: emscripten_glGetObjectParameterivARB");
    abort(-1)
}

function _emscripten_glBlendFunc(x0, x1) {
    GLctx["blendFunc"](x0, x1)
}

function _emscripten_glUniform3i(location, v0, v1, v2) {
    GLctx.uniform3i(GL.uniforms[location], v0, v1, v2)
}

function _emscripten_glStencilOp(x0, x1, x2) {
    GLctx["stencilOp"](x0, x1, x2)
}

function _glCreateShader(shaderType) {
    var id = GL.getNewId(GL.shaders);
    GL.shaders[id] = Module["precompiledPrograms"] ? {} : GLctx.createShader(shaderType);
    GL.shaders[id].isVertexShader = shaderType == 35633;
    return id;
    GL.shaders[id] = GLctx.createShader(shaderType);
    return id
}

function _glUniform1i(location, v0) {
    GLctx.uniform1i(GL.uniforms[location], v0)
}

function _emscripten_glBindAttribLocation(program, index, name) {
    name = Pointer_stringify(name);
    if (!Module["programs"]) Module["programs"] = {};
    if (!Module["programs"][program]) Module["programs"][program] = {};
    if (!Module["programs"][program]["pendingAttribs"]) Module["programs"][program]["pendingAttribs"] = {};
    Module["programs"][program]["pendingAttribs"][name] = index;
    GLctx.bindAttribLocation(GL.programs[program], index, name)
}

function _glGenRenderbuffers(n, renderbuffers) {
    for (var i = 0; i < n; i++) {
        var renderbuffer = GLctx.createRenderbuffer();
        if (!renderbuffer) {
            GL.recordError(1282);
            while (i < n) HEAP32[renderbuffers + i++ * 4 >> 2] = 0;
            return
        }
        var id = GL.getNewId(GL.renderbuffers);
        renderbuffer.name = id;
        GL.renderbuffers[id] = renderbuffer;
        HEAP32[renderbuffers + i * 4 >> 2] = id
    }
}

function _glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, HEAPU8, data, imageSize);
        return
    }
    GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray(data, data + imageSize) : null)
}

function _glDisable(x0) {
    GLctx["disable"](x0)
}
var UE_JSlib = {
    UE_SendAndRecievePayLoad: (function(request) {
        if (request.UE_fetch.postData) {
            request.open("POST", request.UE_fetch.url, false);
            request.overrideMimeType("text/plain; charset=x-user-defined");
            request.send(request.UE_fetch.postData)
        } else {
            request.open("GET", request.UE_fetch.url, false);
            request.send()
        }
        if (request.status != 200) {
            console.log("Fetching " + _url + " failed: " + request.responseText);
            Module.HEAP32[request.UE_fetch.outsizeptr >> 2] = 0;
            Module.HEAP32[request.UE_fetch.outdataptr >> 2] = 0;
            return
        }
        var replyString = request.responseText;
        var replyLength = replyString.length;
        var outdata = Module._malloc(replyLength);
        if (!outdata) {
            console.log("Failed to allocate " + replyLength + " bytes in heap for reply");
            Module.HEAP32[request.UE_fetch.outsizeptr >> 2] = 0;
            Module.HEAP32[request.UE_fetch.outdataptr >> 2] = 0;
            return
        }
        var replyDest = Module.HEAP8.subarray(outdata, outdata + replyLength);
        for (var i = 0; i < replyLength; ++i) {
            replyDest[i] = replyString.charCodeAt(i) & 255
        }
        Module.HEAP32[request.UE_fetch.outsizeptr >> 2] = replyLength;
        Module.HEAP32[request.UE_fetch.outdataptr >> 2] = outdata
    }),
    onBeforeUnload_callbacks: [],
    onBeforeUnload_debug_helper: (function(dummyfile) {
        var debug_xhr = new XMLHttpRequest;
        debug_xhr.open("GET", dummyfile, false);
        debug_xhr.addEventListener("load", (function(e) {
            if (debug_xhr.status === 200 || _url.substr(0, 4).toLowerCase() !== "http") console.log("debug_xhr.response: " + debug_xhr.response);
            else console.log("debug_xhr.response: FAILED")
        }));
        debug_xhr.addEventListener("error", (function(e) {
            console.log("debug_xhr.onerror: FAILED")
        }));
        debug_xhr.send(null)
    }),
    onBeforeUnload: (function(e) {
        window.removeEventListener("beforeunload", UE_JSlib.onBeforeUnload, false);
        var callbacks = UE_JSlib.onBeforeUnload_callbacks;
        UE_JSlib.onBeforeUnload_callbacks = [];
        for (var x in callbacks) {
            var contexts = callbacks[0].ctx;
            for (var y in contexts) {
                try {
                    Runtime.dynCall("vi", callbacks[x].callback, [contexts[y]])
                } catch (e) {}
            }
        }
    }),
    onBeforeUnload_setup: (function() {
        window.addEventListener("beforeunload", UE_JSlib.onBeforeUnload)
    })
};

function _UE_GetCurrentCultureName(address, outsize) {
    var culture_name = navigator.language || navigator.browserLanguage;
    if (!culture_name || culture_name.length >= outsize) return 0;
    Module.writeAsciiToMemory(culture_name, address);
    return 1
}

function _glBlendFuncSeparate(x0, x1, x2, x3) {
    GLctx["blendFuncSeparate"](x0, x1, x2, x3)
}

function _emscripten_glEnableVertexAttribArray(index) {
    GLctx.enableVertexAttribArray(index)
}
Module["_memset"] = _memset;

function _emscripten_glUniform1i(location, v0) {
    GLctx.uniform1i(GL.uniforms[location], v0)
}

function _alDeleteBuffers(count, buffers) {
    if (Module["disableAudio"]) return;
    if (!AL.currentContext) {
        return
    }
    if (count > AL.currentContext.buf.length) {
        AL.currentContext.err = 40963;
        return
    }
    for (var i = 0; i < count; ++i) {
        var bufferIdx = HEAP32[buffers + i * 4 >> 2] - 1;
        if (bufferIdx >= AL.currentContext.buf.length || !AL.currentContext.buf[bufferIdx]) {
            AL.currentContext.err = 40961;
            return
        }
        var buffer = AL.currentContext.buf[bufferIdx];
        for (var srcId in AL.currentContext.src) {
            var src = AL.currentContext.src[srcId];
            if (!src) {
                continue
            }
            for (var k = 0; k < src.queue.length; k++) {
                if (buffer === src.queue[k].buffer) {
                    AL.currentContext.err = 40964;
                    return
                }
            }
        }
    }
    for (var i = 0; i < count; ++i) {
        var bufferIdx = HEAP32[buffers + i * 4 >> 2] - 1;
        delete AL.currentContext.buf[bufferIdx]
    }
}

function _glDrawBuffers(n, bufs) {
    var bufArray = GL.tempFixedLengthArray[n];
    for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[bufs + i * 4 >> 2]
    }
    GLctx["drawBuffers"](bufArray)
}

function emscriptenWebGLGet(name_, p, type) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    var ret = undefined;
    switch (name_) {
        case 36346:
            ret = 1;
            break;
        case 36344:
            if (type !== "Integer" && type !== "Integer64") {
                GL.recordError(1280)
            }
            return;
        case 34814:
        case 36345:
            ret = 0;
            break;
        case 34466:
            var formats = GLctx.getParameter(34467);
            ret = formats.length;
            break;
        case 33309:
            if (GLctx.canvas.GLctxObject.version < 2) {
                GL.recordError(1282);
                return
            }
            var exts = GLctx.getSupportedExtensions();
            ret = 2 * exts.length;
            break;
        case 33307:
        case 33308:
            if (GLctx.canvas.GLctxObject.version < 2) {
                GL.recordError(1280);
                return
            }
            ret = name_ == 33307 ? 3 : 0;
            break
    }
    if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof result) {
            case "number":
                ret = result;
                break;
            case "boolean":
                ret = result ? 1 : 0;
                break;
            case "string":
                GL.recordError(1280);
                return;
            case "object":
                if (result === null) {
                    switch (name_) {
                        case 34964:
                        case 35725:
                        case 34965:
                        case 36006:
                        case 36007:
                        case 32873:
                        case 34229:
                        case 35097:
                        case 36389:
                        case 34068:
                            {
                                ret = 0;
                                break
                            };
                        default:
                            {
                                GL.recordError(1280);
                                return
                            }
                    }
                } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
                    for (var i = 0; i < result.length; ++i) {
                        switch (type) {
                            case "Integer":
                                HEAP32[p + i * 4 >> 2] = result[i];
                                break;
                            case "Float":
                                HEAPF32[p + i * 4 >> 2] = result[i];
                                break;
                            case "Boolean":
                                HEAP8[p + i >> 0] = result[i] ? 1 : 0;
                                break;
                            default:
                                throw "internal glGet error, bad type: " + type
                        }
                    }
                    return
                } else if (result instanceof WebGLBuffer || result instanceof WebGLProgram || result instanceof WebGLFramebuffer || result instanceof WebGLRenderbuffer || result instanceof WebGLQuery || result instanceof WebGLSampler || result instanceof WebGLSync || result instanceof WebGLTransformFeedback || result instanceof WebGLVertexArrayObject || result instanceof WebGLTexture) {
                    ret = result.name | 0
                } else {
                    GL.recordError(1280);
                    return
                }
                break;
            default:
                GL.recordError(1280);
                return
        }
    }
    switch (type) {
        case "Integer64":
            tempI64 = [ret >>> 0, (tempDouble = ret, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[p >> 2] = tempI64[0], HEAP32[p + 4 >> 2] = tempI64[1];
            break;
        case "Integer":
            HEAP32[p >> 2] = ret;
            break;
        case "Float":
            HEAPF32[p >> 2] = ret;
            break;
        case "Boolean":
            HEAP8[p >> 0] = ret ? 1 : 0;
            break;
        default:
            throw "internal glGet error, bad type: " + type
    }
}

function _glGetIntegerv(name_, p) {
    emscriptenWebGLGet(name_, p, "Integer")
}

function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
    GLctx["copyTexSubImage2D"](x0, x1, x2, x3, x4, x5, x6, x7)
}

function _emscripten_set_touchcancel_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel");
    return 0
}

function _glBindFramebuffer(target, framebuffer) {
    GLctx.bindFramebuffer(target, framebuffer ? GL.framebuffers[framebuffer] : null)
}

function ___lock() {}

function _emscripten_glBlendFuncSeparate(x0, x1, x2, x3) {
    GLctx["blendFuncSeparate"](x0, x1, x2, x3)
}

function _glCullFace(x0) {
    GLctx["cullFace"](x0)
}

function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
    if (!pointer) {
        GL.recordError(1281);
        return
    }
    HEAP32[pointer >> 2] = GLctx.getVertexAttribOffset(index, pname)
}

function _emscripten_glVertexAttrib3f(x0, x1, x2, x3) {
    GLctx["vertexAttrib3f"](x0, x1, x2, x3)
}

function _emscripten_set_mousemove_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove");
    return 0
}

function _emscripten_glNormalPointer() {
    Module["printErr"]("missing function: emscripten_glNormalPointer");
    abort(-1)
}
var _emscripten_GetProcAddress = undefined;
Module["_emscripten_GetProcAddress"] = _emscripten_GetProcAddress;

function _eglGetProcAddress(name_) {
    return _emscripten_GetProcAddress(name_)
}

function _glDeleteProgram(id) {
    if (!id) return;
    var program = GL.programs[id];
    if (!program) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteProgram(program);
    program.name = 0;
    GL.programs[id] = null;
    GL.programInfos[id] = null
}

function _glRenderbufferStorage(x0, x1, x2, x3) {
    GLctx["renderbufferStorage"](x0, x1, x2, x3)
}

function _emscripten_get_pointerlock_status(pointerlockStatus) {
    if (pointerlockStatus) JSEvents.fillPointerlockChangeEventData(pointerlockStatus);
    if (!document.body || !document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock) {
        return -1
    }
    return 0
}

function _alSourcePlay(source) {
    if (Module["disableAudio"]) return;
    if (!AL.currentContext) {
        return
    }
    var src = AL.currentContext.src[source];
    if (!src) {
        AL.currentContext.err = 40961;
        return
    }
    AL.setSourceState(src, 4114)
}

function _glAttachShader(program, shader) {
    if (GL.shaders[shader].isVertexShader) GL.programs[program].vs = GL.shaders[shader];
    else GL.programs[program].fs = GL.shaders[shader];
    if (Module["precompiledPrograms"]) return;
    GLctx.attachShader(GL.programs[program], GL.shaders[shader])
}

function _eglSwapInterval(display, interval) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (interval == 0) _emscripten_set_main_loop_timing(0, 0);
    else _emscripten_set_main_loop_timing(1, interval);
    EGL.setErrorCode(12288);
    return 1
}

function _glClearBufferfv(buffer, drawbuffer, value) {
    GLctx["clearBufferfv"](buffer, drawbuffer, HEAPF32, value >> 2)
}

function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    var data = GLctx.getVertexAttrib(index, pname);
    if (pname == 34975) {
        HEAP32[params >> 2] = data["name"]
    } else if (typeof data == "number" || typeof data == "boolean") {
        switch (type) {
            case "Integer":
                HEAP32[params >> 2] = data;
                break;
            case "Float":
                HEAPF32[params >> 2] = data;
                break;
            case "FloatToInteger":
                HEAP32[params >> 2] = Math.fround(data);
                break;
            default:
                throw "internal emscriptenWebGLGetVertexAttrib() error, bad type: " + type
        }
    } else {
        for (var i = 0; i < data.length; i++) {
            switch (type) {
                case "Integer":
                    HEAP32[params + i >> 2] = data[i];
                    break;
                case "Float":
                    HEAPF32[params + i >> 2] = data[i];
                    break;
                case "FloatToInteger":
                    HEAP32[params + i >> 2] = Math.fround(data[i]);
                    break;
                default:
                    throw "internal emscriptenWebGLGetVertexAttrib() error, bad type: " + type
            }
        }
    }
}

function _emscripten_glGetVertexAttribfv(index, pname, params) {
    emscriptenWebGLGetVertexAttrib(index, pname, params, "Float")
}

function _emscripten_set_touchstart_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart");
    return 0
}

function _emscripten_glDeleteShader(id) {
    if (!id) return;
    var shader = GL.shaders[id];
    if (!shader) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteShader(shader);
    GL.shaders[id] = null
}

function _emscripten_glDrawArraysInstanced(mode, first, count, primcount) {
    GLctx["drawArraysInstanced"](mode, first, count, primcount)
}

function _emscripten_glDeleteBuffers(n, buffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[buffers + i * 4 >> 2];
        var buffer = GL.buffers[id];
        if (!buffer) continue;
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
        if (id == GL.currArrayBuffer) GL.currArrayBuffer = 0;
        if (id == GL.currElementArrayBuffer) GL.currElementArrayBuffer = 0
    }
}

function _glDrawElements(mode, count, type, indices) {
    GLctx.drawElements(mode, count, type, indices)
}

function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniformMatrix2fv(GL.uniforms[location], !!transpose, HEAPF32, value >> 2, count * 4);
        return
    }
    var view;
    if (4 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        view = GL.miniTempBufferViews[4 * count - 1];
        for (var i = 0; i < 4 * count; i += 4) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2]
        }
    } else {
        view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2)
    }
    GLctx.uniformMatrix2fv(GL.uniforms[location], !!transpose, view)
}

function ___syscall5(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var pathname = SYSCALLS.getStr(),
            flags = SYSCALLS.get(),
            mode = SYSCALLS.get();
        var stream = FS.open(pathname, flags, mode);
        return stream.fd
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall4(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            buf = SYSCALLS.get(),
            count = SYSCALLS.get();
        return FS.write(stream, HEAP8, buf, count)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _glClearBufferfi(x0, x1, x2, x3) {
    GLctx["clearBufferfi"](x0, x1, x2, x3)
}

function ___syscall6(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD();
        FS.close(stream);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _emscripten_glGetVertexAttribiv(index, pname, params) {
    emscriptenWebGLGetVertexAttrib(index, pname, params, "FloatToInteger")
}

function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, HEAPF32, value >> 2, count * 16);
        return
    }
    var view;
    if (16 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        view = GL.miniTempBufferViews[16 * count - 1];
        for (var i = 0; i < 16 * count; i += 16) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
            view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
            view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
            view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
            view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
            view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2];
            view[i + 9] = HEAPF32[value + (4 * i + 36) >> 2];
            view[i + 10] = HEAPF32[value + (4 * i + 40) >> 2];
            view[i + 11] = HEAPF32[value + (4 * i + 44) >> 2];
            view[i + 12] = HEAPF32[value + (4 * i + 48) >> 2];
            view[i + 13] = HEAPF32[value + (4 * i + 52) >> 2];
            view[i + 14] = HEAPF32[value + (4 * i + 56) >> 2];
            view[i + 15] = HEAPF32[value + (4 * i + 60) >> 2]
        }
    } else {
        view = HEAPF32.subarray(value >> 2, value + count * 64 >> 2)
    }
    GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view)
}

function _glDrawArraysInstanced(mode, first, count, primcount) {
    GLctx["drawArraysInstanced"](mode, first, count, primcount)
}

function _emscripten_glEnableClientState() {
    Module["printErr"]("missing function: emscripten_glEnableClientState");
    abort(-1)
}

function _emscripten_glGetPointerv() {
    Module["printErr"]("missing function: emscripten_glGetPointerv");
    abort(-1)
}

function ___syscall142(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var nfds = SYSCALLS.get(),
            readfds = SYSCALLS.get(),
            writefds = SYSCALLS.get(),
            exceptfds = SYSCALLS.get(),
            timeout = SYSCALLS.get();
        assert(nfds <= 64, "nfds must be less than or equal to 64");
        assert(!exceptfds, "exceptfds not supported");
        var total = 0;
        var srcReadLow = readfds ? HEAP32[readfds >> 2] : 0,
            srcReadHigh = readfds ? HEAP32[readfds + 4 >> 2] : 0;
        var srcWriteLow = writefds ? HEAP32[writefds >> 2] : 0,
            srcWriteHigh = writefds ? HEAP32[writefds + 4 >> 2] : 0;
        var srcExceptLow = exceptfds ? HEAP32[exceptfds >> 2] : 0,
            srcExceptHigh = exceptfds ? HEAP32[exceptfds + 4 >> 2] : 0;
        var dstReadLow = 0,
            dstReadHigh = 0;
        var dstWriteLow = 0,
            dstWriteHigh = 0;
        var dstExceptLow = 0,
            dstExceptHigh = 0;
        var allLow = (readfds ? HEAP32[readfds >> 2] : 0) | (writefds ? HEAP32[writefds >> 2] : 0) | (exceptfds ? HEAP32[exceptfds >> 2] : 0);
        var allHigh = (readfds ? HEAP32[readfds + 4 >> 2] : 0) | (writefds ? HEAP32[writefds + 4 >> 2] : 0) | (exceptfds ? HEAP32[exceptfds + 4 >> 2] : 0);

        function check(fd, low, high, val) {
            return fd < 32 ? low & val : high & val
        }
        for (var fd = 0; fd < nfds; fd++) {
            var mask = 1 << fd % 32;
            if (!check(fd, allLow, allHigh, mask)) {
                continue
            }
            var stream = FS.getStream(fd);
            if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            var flags = SYSCALLS.DEFAULT_POLLMASK;
            if (stream.stream_ops.poll) {
                flags = stream.stream_ops.poll(stream)
            }
            if (flags & 1 && check(fd, srcReadLow, srcReadHigh, mask)) {
                fd < 32 ? dstReadLow = dstReadLow | mask : dstReadHigh = dstReadHigh | mask;
                total++
            }
            if (flags & 4 && check(fd, srcWriteLow, srcWriteHigh, mask)) {
                fd < 32 ? dstWriteLow = dstWriteLow | mask : dstWriteHigh = dstWriteHigh | mask;
                total++
            }
            if (flags & 2 && check(fd, srcExceptLow, srcExceptHigh, mask)) {
                fd < 32 ? dstExceptLow = dstExceptLow | mask : dstExceptHigh = dstExceptHigh | mask;
                total++
            }
        }
        if (readfds) {
            HEAP32[readfds >> 2] = dstReadLow;
            HEAP32[readfds + 4 >> 2] = dstReadHigh
        }
        if (writefds) {
            HEAP32[writefds >> 2] = dstWriteLow;
            HEAP32[writefds + 4 >> 2] = dstWriteHigh
        }
        if (exceptfds) {
            HEAP32[exceptfds >> 2] = dstExceptLow;
            HEAP32[exceptfds + 4 >> 2] = dstExceptHigh
        }
        return total
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _emscripten_get_canvas_size(width, height, isFullscreen) {
    var canvas = Module["canvas"];
    HEAP32[width >> 2] = canvas.width;
    HEAP32[height >> 2] = canvas.height;
    HEAP32[isFullscreen >> 2] = Browser.isFullscreen ? 1 : 0
}

function _eglChooseConfig(display, attrib_list, configs, config_size, numConfigs) {
    return EGL.chooseConfig(display, attrib_list, configs, config_size, numConfigs)
}

function ___syscall146(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            iov = SYSCALLS.get(),
            iovcnt = SYSCALLS.get();
        return SYSCALLS.doWritev(stream, iov, iovcnt)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _alSource3f(source, param, v1, v2, v3) {
    if (Module["disableAudio"]) return;
    if (!AL.currentContext) {
        return
    }
    var src = AL.currentContext.src[source];
    if (!src) {
        AL.currentContext.err = 40961;
        return
    }
    switch (param) {
        case 4100:
            src.position[0] = v1;
            src.position[1] = v2;
            src.position[2] = v3;
            break;
        case 4101:
            src.direction[0] = v1;
            src.direction[1] = v2;
            src.direction[2] = v3;
            break;
        case 4102:
            src.velocity[0] = v1;
            src.velocity[1] = v2;
            src.velocity[2] = v3;
            break;
        default:
            AL.currentContext.err = 40962;
            break
    }
}

function _alSourcefv(source, param, value) {
    _alSource3f(source, param, HEAPF32[value >> 2], HEAPF32[value + 4 >> 2], HEAPF32[value + 8 >> 2])
}

function ___syscall145(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            iov = SYSCALLS.get(),
            iovcnt = SYSCALLS.get();
        return SYSCALLS.doReadv(stream, iov, iovcnt)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _emscripten_glStencilMask(x0) {
    GLctx["stencilMask"](x0)
}

function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) {
    GLctx["stencilFuncSeparate"](x0, x1, x2, x3)
}

function _eglGetConfigAttrib(display, config, attribute, value) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (config != 62002) {
        EGL.setErrorCode(12293);
        return 0
    }
    if (!value) {
        EGL.setErrorCode(12300);
        return 0
    }
    EGL.setErrorCode(12288);
    switch (attribute) {
        case 12320:
            HEAP32[value >> 2] = 32;
            return 1;
        case 12321:
            HEAP32[value >> 2] = 8;
            return 1;
        case 12322:
            HEAP32[value >> 2] = 8;
            return 1;
        case 12323:
            HEAP32[value >> 2] = 8;
            return 1;
        case 12324:
            HEAP32[value >> 2] = 8;
            return 1;
        case 12325:
            HEAP32[value >> 2] = 24;
            return 1;
        case 12326:
            HEAP32[value >> 2] = 8;
            return 1;
        case 12327:
            HEAP32[value >> 2] = 12344;
            return 1;
        case 12328:
            HEAP32[value >> 2] = 62002;
            return 1;
        case 12329:
            HEAP32[value >> 2] = 0;
            return 1;
        case 12330:
            HEAP32[value >> 2] = 4096;
            return 1;
        case 12331:
            HEAP32[value >> 2] = 16777216;
            return 1;
        case 12332:
            HEAP32[value >> 2] = 4096;
            return 1;
        case 12333:
            HEAP32[value >> 2] = 0;
            return 1;
        case 12334:
            HEAP32[value >> 2] = 0;
            return 1;
        case 12335:
            HEAP32[value >> 2] = 12344;
            return 1;
        case 12337:
            HEAP32[value >> 2] = 4;
            return 1;
        case 12338:
            HEAP32[value >> 2] = 1;
            return 1;
        case 12339:
            HEAP32[value >> 2] = 4;
            return 1;
        case 12340:
            HEAP32[value >> 2] = 12344;
            return 1;
        case 12341:
        case 12342:
        case 12343:
            HEAP32[value >> 2] = -1;
            return 1;
        case 12345:
        case 12346:
            HEAP32[value >> 2] = 0;
            return 1;
        case 12347:
        case 12348:
            HEAP32[value >> 2] = 1;
            return 1;
        case 12349:
        case 12350:
            HEAP32[value >> 2] = 0;
            return 1;
        case 12351:
            HEAP32[value >> 2] = 12430;
            return 1;
        case 12352:
            HEAP32[value >> 2] = 4;
            return 1;
        case 12354:
            HEAP32[value >> 2] = 0;
            return 1;
        default:
            EGL.setErrorCode(12292);
            return 0
    }
}

function _pthread_mutexattr_setprotocol() {}

function _emscripten_glClearDepthf(x0) {
    GLctx["clearDepth"](x0)
}

function __ZSt18uncaught_exceptionv() {
    return !!__ZSt18uncaught_exceptionv.uncaught_exception
}
var EXCEPTIONS = {
    last: 0,
    caught: [],
    infos: {},
    deAdjust: (function(adjusted) {
        if (!adjusted || EXCEPTIONS.infos[adjusted]) return adjusted;
        for (var ptr in EXCEPTIONS.infos) {
            var info = EXCEPTIONS.infos[ptr];
            if (info.adjusted === adjusted) {
                return ptr
            }
        }
        return adjusted
    }),
    addRef: (function(ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount++
    }),
    decRef: (function(ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        assert(info.refcount > 0);
        info.refcount--;
        if (info.refcount === 0 && !info.rethrown) {
            if (info.destructor) {
                Module["dynCall_vi"](info.destructor, ptr)
            }
            delete EXCEPTIONS.infos[ptr];
            ___cxa_free_exception(ptr)
        }
    }),
    clearRef: (function(ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount = 0
    })
};

function ___resumeException(ptr) {
    if (!EXCEPTIONS.last) {
        EXCEPTIONS.last = ptr
    }
    throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."
}

function ___cxa_find_matching_catch() {
    var thrown = EXCEPTIONS.last;
    if (!thrown) {
        return (Runtime.setTempRet0(0), 0) | 0
    }
    var info = EXCEPTIONS.infos[thrown];
    var throwntype = info.type;
    if (!throwntype) {
        return (Runtime.setTempRet0(0), thrown) | 0
    }
    var typeArray = Array.prototype.slice.call(arguments);
    var pointer = Module["___cxa_is_pointer_type"](throwntype);
    if (!___cxa_find_matching_catch.buffer) ___cxa_find_matching_catch.buffer = _malloc(4);
    HEAP32[___cxa_find_matching_catch.buffer >> 2] = thrown;
    thrown = ___cxa_find_matching_catch.buffer;
    for (var i = 0; i < typeArray.length; i++) {
        if (typeArray[i] && Module["___cxa_can_catch"](typeArray[i], throwntype, thrown)) {
            thrown = HEAP32[thrown >> 2];
            info.adjusted = thrown;
            return (Runtime.setTempRet0(typeArray[i]), thrown) | 0
        }
    }
    thrown = HEAP32[thrown >> 2];
    return (Runtime.setTempRet0(throwntype), thrown) | 0
}

function ___cxa_throw(ptr, type, destructor) {
    EXCEPTIONS.infos[ptr] = {
        ptr: ptr,
        adjusted: ptr,
        type: type,
        destructor: destructor,
        refcount: 0,
        caught: false,
        rethrown: false
    };
    EXCEPTIONS.last = ptr;
    if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1
    } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++
    }
    throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch."
}

function _emscripten_set_touchend_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend");
    return 0
}

function _glUseProgram(program) {
    GLctx.useProgram(program ? GL.programs[program] : null)
}
var _environ = STATICTOP;
STATICTOP += 16;

function ___buildEnvironment(env) {
    var MAX_ENV_VALUES = 64;
    var TOTAL_ENV_SIZE = 1024;
    var poolPtr;
    var envPtr;
    if (!___buildEnvironment.called) {
        ___buildEnvironment.called = true;
        ENV["USER"] = ENV["LOGNAME"] = "web_user";
        ENV["PATH"] = "/";
        ENV["PWD"] = "/";
        ENV["HOME"] = "/home/web_user";
        ENV["LANG"] = "C";
        ENV["_"] = Module["thisProgram"];
        poolPtr = allocate(TOTAL_ENV_SIZE, "i8", ALLOC_STATIC);
        envPtr = allocate(MAX_ENV_VALUES * 4, "i8*", ALLOC_STATIC);
        HEAP32[envPtr >> 2] = poolPtr;
        HEAP32[_environ >> 2] = envPtr
    } else {
        envPtr = HEAP32[_environ >> 2];
        poolPtr = HEAP32[envPtr >> 2]
    }
    var strings = [];
    var totalSize = 0;
    for (var key in env) {
        if (typeof env[key] === "string") {
            var line = key + "=" + env[key];
            strings.push(line);
            totalSize += line.length
        }
    }
    if (totalSize > TOTAL_ENV_SIZE) {
        throw new Error("Environment size exceeded TOTAL_ENV_SIZE!")
    }
    var ptrSize = 4;
    for (var i = 0; i < strings.length; i++) {
        var line = strings[i];
        writeAsciiToMemory(line, poolPtr);
        HEAP32[envPtr + i * ptrSize >> 2] = poolPtr;
        poolPtr += line.length + 1
    }
    HEAP32[envPtr + strings.length * ptrSize >> 2] = 0
}
var ENV = {};

function _dlopen(filename, flag) {
    abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/kripken/emscripten/wiki/Linking");
    var searchpaths = [];
    if (filename === 0) {
        filename = "__self__"
    } else {
        var strfilename = Pointer_stringify(filename);
        var isValidFile = (function(filename) {
            var target = FS.findObject(filename);
            return target && !target.isFolder && !target.isDevice
        });
        if (isValidFile(strfilename)) {
            filename = strfilename
        } else {
            if (ENV["LD_LIBRARY_PATH"]) {
                searchpaths = ENV["LD_LIBRARY_PATH"].split(":")
            }
            for (var ident in searchpaths) {
                var searchfile = PATH.join2(searchpaths[ident], strfilename);
                if (isValidFile(searchfile)) {
                    filename = searchfile;
                    break
                }
            }
        }
    }
    if (DLFCN.loadedLibNames[filename]) {
        var handle = DLFCN.loadedLibNames[filename];
        DLFCN.loadedLibs[handle].refcount++;
        return handle
    }
    if (filename === "__self__") {
        var handle = -1;
        var lib_module = Module;
        var cached_functions = {}
    } else {
        var target = FS.findObject(filename);
        if (!target || target.isFolder || target.isDevice) {
            DLFCN.errorMsg = "Could not find dynamic lib: " + filename;
            return 0
        }
        FS.forceLoadFile(target);
        var lib_module;
        try {
            var lib_data = FS.readFile(filename, {
                encoding: "binary"
            });
            if (!(lib_data instanceof Uint8Array)) lib_data = new Uint8Array(lib_data);
            lib_module = Runtime.loadWebAssemblyModule(lib_data)
        } catch (e) {
            DLFCN.errorMsg = "Could not evaluate dynamic lib: " + filename + "\n" + e;
            return 0
        }
        var handle = 1;
        for (var key in DLFCN.loadedLibs) {
            if (DLFCN.loadedLibs.hasOwnProperty(key)) handle++
        }
        if (flag & 256) {
            for (var ident in lib_module) {
                if (lib_module.hasOwnProperty(ident)) {
                    if (ident[0] == "_") {
                        Module[ident] = lib_module[ident]
                    }
                }
            }
        }
        var cached_functions = {}
    }
    DLFCN.loadedLibs[handle] = {
        refcount: 1,
        name: filename,
        module: lib_module,
        cached_functions: cached_functions
    };
    DLFCN.loadedLibNames[filename] = handle;
    return handle
}

function __setLetterbox(element, topBottom, leftRight) {
    if (JSEvents.isInternetExplorer()) {
        element.style.marginLeft = element.style.marginRight = leftRight + "px";
        element.style.marginTop = element.style.marginBottom = topBottom + "px"
    } else {
        element.style.paddingLeft = element.style.paddingRight = leftRight + "px";
        element.style.paddingTop = element.style.paddingBottom = topBottom + "px"
    }
}

function _emscripten_do_request_fullscreen(target, strategy) {
    if (typeof JSEvents.fullscreenEnabled() === "undefined") return -1;
    if (!JSEvents.fullscreenEnabled()) return -3;
    if (!target) target = "#canvas";
    target = JSEvents.findEventTarget(target);
    if (!target) return -4;
    if (!target.requestFullscreen && !target.msRequestFullscreen && !target.mozRequestFullScreen && !target.mozRequestFullscreen && !target.webkitRequestFullscreen) {
        return -3
    }
    var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
    if (!canPerformRequests) {
        if (strategy.deferUntilInEventHandler) {
            JSEvents.deferCall(JSEvents.requestFullscreen, 1, [target, strategy]);
            return 1
        } else {
            return -2
        }
    }
    return JSEvents.requestFullscreen(target, strategy)
}

function __registerRestoreOldStyle(canvas) {
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    var oldCssWidth = canvas.style.width;
    var oldCssHeight = canvas.style.height;
    var oldBackgroundColor = canvas.style.backgroundColor;
    var oldDocumentBackgroundColor = document.body.style.backgroundColor;
    var oldPaddingLeft = canvas.style.paddingLeft;
    var oldPaddingRight = canvas.style.paddingRight;
    var oldPaddingTop = canvas.style.paddingTop;
    var oldPaddingBottom = canvas.style.paddingBottom;
    var oldMarginLeft = canvas.style.marginLeft;
    var oldMarginRight = canvas.style.marginRight;
    var oldMarginTop = canvas.style.marginTop;
    var oldMarginBottom = canvas.style.marginBottom;
    var oldDocumentBodyMargin = document.body.style.margin;
    var oldDocumentOverflow = document.documentElement.style.overflow;
    var oldDocumentScroll = document.body.scroll;
    var oldImageRendering = canvas.style.imageRendering;

    function restoreOldStyle() {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        if (!fullscreenElement) {
            document.removeEventListener("fullscreenchange", restoreOldStyle);
            document.removeEventListener("mozfullscreenchange", restoreOldStyle);
            document.removeEventListener("webkitfullscreenchange", restoreOldStyle);
            document.removeEventListener("MSFullscreenChange", restoreOldStyle);
            canvas.width = oldWidth;
            canvas.height = oldHeight;
            canvas.style.width = oldCssWidth;
            canvas.style.height = oldCssHeight;
            canvas.style.backgroundColor = oldBackgroundColor;
            if (!oldDocumentBackgroundColor) document.body.style.backgroundColor = "white";
            document.body.style.backgroundColor = oldDocumentBackgroundColor;
            canvas.style.paddingLeft = oldPaddingLeft;
            canvas.style.paddingRight = oldPaddingRight;
            canvas.style.paddingTop = oldPaddingTop;
            canvas.style.paddingBottom = oldPaddingBottom;
            canvas.style.marginLeft = oldMarginLeft;
            canvas.style.marginRight = oldMarginRight;
            canvas.style.marginTop = oldMarginTop;
            canvas.style.marginBottom = oldMarginBottom;
            document.body.style.margin = oldDocumentBodyMargin;
            document.documentElement.style.overflow = oldDocumentOverflow;
            document.body.scroll = oldDocumentScroll;
            canvas.style.imageRendering = oldImageRendering;
            if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
            if (__currentFullscreenStrategy.canvasResizedCallback) {
                Module["dynCall_iiii"](__currentFullscreenStrategy.canvasResizedCallback, 37, 0, __currentFullscreenStrategy.canvasResizedCallbackUserData)
            }
        }
    }
    document.addEventListener("fullscreenchange", restoreOldStyle);
    document.addEventListener("mozfullscreenchange", restoreOldStyle);
    document.addEventListener("webkitfullscreenchange", restoreOldStyle);
    document.addEventListener("MSFullscreenChange", restoreOldStyle);
    return restoreOldStyle
}

function _emscripten_request_fullscreen_strategy(target, deferUntilInEventHandler, fullscreenStrategy) {
    var strategy = {};
    strategy.scaleMode = HEAP32[fullscreenStrategy >> 2];
    strategy.canvasResolutionScaleMode = HEAP32[fullscreenStrategy + 4 >> 2];
    strategy.filteringMode = HEAP32[fullscreenStrategy + 8 >> 2];
    strategy.deferUntilInEventHandler = deferUntilInEventHandler;
    strategy.canvasResizedCallback = HEAP32[fullscreenStrategy + 12 >> 2];
    strategy.canvasResizedCallbackUserData = HEAP32[fullscreenStrategy + 16 >> 2];
    __currentFullscreenStrategy = strategy;
    return _emscripten_do_request_fullscreen(target, strategy)
}

function _alSourceStop(source) {
    if (Module["disableAudio"]) return;
    if (!AL.currentContext) {
        return
    }
    var src = AL.currentContext.src[source];
    if (!src) {
        AL.currentContext.err = 40961;
        return
    }
    AL.setSourceState(src, 4116)
}

function _glBindRenderbuffer(target, renderbuffer) {
    GLctx.bindRenderbuffer(target, renderbuffer ? GL.renderbuffers[renderbuffer] : null)
}

function _emscripten_glGenRenderbuffers(n, renderbuffers) {
    for (var i = 0; i < n; i++) {
        var renderbuffer = GLctx.createRenderbuffer();
        if (!renderbuffer) {
            GL.recordError(1282);
            while (i < n) HEAP32[renderbuffers + i++ * 4 >> 2] = 0;
            return
        }
        var id = GL.getNewId(GL.renderbuffers);
        renderbuffer.name = id;
        GL.renderbuffers[id] = renderbuffer;
        HEAP32[renderbuffers + i * 4 >> 2] = id
    }
}

function _emscripten_glBlendEquation(x0) {
    GLctx["blendEquation"](x0)
}

function _glDeleteFramebuffers(n, framebuffers) {
    for (var i = 0; i < n; ++i) {
        var id = HEAP32[framebuffers + i * 4 >> 2];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue;
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null
    }
}

function _glDrawArrays(mode, first, count) {
    GLctx.drawArrays(mode, first, count)
}

function _emscripten_glDepthFunc(x0) {
    GLctx["depthFunc"](x0)
}

function _realloc() {
    throw "bad"
}
Module["_realloc"] = _realloc;
Module["_saveSetjmp"] = _saveSetjmp;

function _emscripten_get_num_gamepads() {
    if (!JSEvents.numGamepadsConnected) return 0;
    __emscripten_sample_gamepad_data();
    if (!JSEvents.lastGamepadState) return -1;
    return JSEvents.lastGamepadState.length
}

function _emscripten_set_blur_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerFocusEventCallback(target, userData, useCapture, callbackfunc, 12, "blur");
    return 0
}

function _emscripten_glReleaseShaderCompiler() {}

function _sigaction(signum, act, oldact) {
    return 0
}

function _emscripten_glUniform4iv(location, count, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniform4iv(GL.uniforms[location], HEAP32, value >> 2, count * 4);
        return
    }
    GLctx.uniform4iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 16 >> 2))
}

function _glClear(x0) {
    GLctx["clear"](x0)
}

function _glVertexAttrib4fv(index, v) {
    GLctx.vertexAttrib4f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2], HEAPF32[v + 12 >> 2])
}

function _emscripten_set_resize_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize");
    return 0
}

function _emscripten_glLoadIdentity() {
    throw "Legacy GL function (glLoadIdentity) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation."
}

function _emscripten_set_element_css_size(target, width, height) {
    if (!target) {
        target = Module["canvas"]
    } else {
        target = JSEvents.findEventTarget(target)
    }
    if (!target) return -4;
    target.style.setProperty("width", width + "px");
    target.style.setProperty("height", height + "px");
    return 0
}

function _alDistanceModel(model) {
    if (model !== 0) {}
}

function _glActiveTexture(unit) {
    GLctx.activeTexture(unit)
}

function _glEnableVertexAttribArray(index) {
    GLctx.enableVertexAttribArray(index)
}

function _emscripten_glAttachShader(program, shader) {
    if (GL.shaders[shader].isVertexShader) GL.programs[program].vs = GL.shaders[shader];
    else GL.programs[program].fs = GL.shaders[shader];
    if (Module["precompiledPrograms"]) return;
    GLctx.attachShader(GL.programs[program], GL.shaders[shader])
}

function _glBindTexture(target, texture) {
    GLctx.bindTexture(target, texture ? GL.textures[texture] : null)
}

function _glStencilOp(x0, x1, x2) {
    GLctx["stencilOp"](x0, x1, x2)
}

function emscriptenWebGLComputeImageSize(width, height, sizePerPixel, alignment) {
    function roundedToNextMultipleOf(x, y) {
        return Math.floor((x + y - 1) / y) * y
    }
    var plainRowSize = width * sizePerPixel;
    var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
    return height <= 0 ? 0 : (height - 1) * alignedRowSize + plainRowSize
}

function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
    var sizePerPixel;
    var numChannels;
    switch (format) {
        case 6406:
        case 6409:
        case 6402:
        case 6403:
        case 36244:
            numChannels = 1;
            break;
        case 6410:
        case 33319:
        case 33320:
            numChannels = 2;
            break;
        case 6407:
        case 35904:
        case 36248:
            numChannels = 3;
            break;
        case 6408:
        case 35906:
        case 36249:
            numChannels = 4;
            break;
        default:
            GL.recordError(1280);
            return null
    }
    switch (type) {
        case 5121:
        case 5120:
            sizePerPixel = numChannels * 1;
            break;
        case 5123:
        case 36193:
        case 5131:
        case 5122:
            sizePerPixel = numChannels * 2;
            break;
        case 5125:
        case 5126:
        case 5124:
            sizePerPixel = numChannels * 4;
            break;
        case 34042:
        case 35902:
        case 33640:
        case 35899:
        case 34042:
            sizePerPixel = 4;
            break;
        case 33635:
        case 32819:
        case 32820:
            sizePerPixel = 2;
            break;
        default:
            GL.recordError(1280);
            return null
    }
    var bytes = emscriptenWebGLComputeImageSize(width, height, sizePerPixel, GL.unpackAlignment);
    switch (type) {
        case 5120:
            return HEAP8.subarray(pixels, pixels + bytes);
        case 5121:
            return HEAPU8.subarray(pixels, pixels + bytes);
        case 5122:
            return HEAP16.subarray(pixels >> 1, pixels + bytes >> 1);
        case 5124:
            return HEAP32.subarray(pixels >> 2, pixels + bytes >> 2);
        case 5126:
            return HEAPF32.subarray(pixels >> 2, pixels + bytes >> 2);
        case 5125:
        case 34042:
        case 35902:
        case 33640:
        case 35899:
        case 34042:
            return HEAPU32.subarray(pixels >> 2, pixels + bytes >> 2);
        case 5123:
        case 33635:
        case 32819:
        case 32820:
        case 36193:
        case 5131:
            return HEAPU16.subarray(pixels >> 1, pixels + bytes >> 1);
        default:
            GL.recordError(1280);
            return null
    }
}

function emscriptenWebGLGetHeapForType(type) {
    switch (type) {
        case 5120:
            return HEAP8;
        case 5121:
            return HEAPU8;
        case 5122:
            return HEAP16;
        case 5123:
        case 33635:
        case 32819:
        case 32820:
        case 36193:
        case 5131:
            return HEAPU16;
        case 5124:
            return HEAP32;
        case 5125:
        case 34042:
        case 35902:
        case 33640:
        case 35899:
        case 34042:
            return HEAPU32;
        case 5126:
            return HEAPF32;
        default:
            return null
    }
}

function emscriptenWebGLGetShiftForType(type) {
    switch (type) {
        case 5120:
        case 5121:
            return 0;
        case 5122:
        case 5123:
        case 33635:
        case 32819:
        case 32820:
        case 36193:
        case 5131:
            return 1;
        case 5124:
        case 5126:
        case 5125:
        case 34042:
        case 35902:
        case 33640:
        case 35899:
        case 34042:
            return 2;
        default:
            return 0
    }
}

function _glReadPixels(x, y, width, height, format, type, pixels) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        if (GLctx.currentPixelPackBufferBinding) {
            GLctx.readPixels(x, y, width, height, format, type, pixels)
        } else {
            GLctx.readPixels(x, y, width, height, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type))
        }
        return
    }
    var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
    if (!pixelData) {
        GL.recordError(1280);
        return
    }
    GLctx.readPixels(x, y, width, height, format, type, pixelData)
}

function _glStencilMask(x0) {
    GLctx["stencilMask"](x0)
}

function _glFramebufferTexture2D(target, attachment, textarget, texture, level) {
    GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level)
}

function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
    if (!target) target = "#canvas";
    target = JSEvents.findEventTarget(target);
    if (!target) return -4;
    if (!target.requestPointerLock && !target.mozRequestPointerLock && !target.webkitRequestPointerLock && !target.msRequestPointerLock) {
        return -1
    }
    var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
    if (!canPerformRequests) {
        if (deferUntilInEventHandler) {
            JSEvents.deferCall(JSEvents.requestPointerLock, 2, [target]);
            return 1
        } else {
            return -2
        }
    }
    return JSEvents.requestPointerLock(target)
}

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

function _eglCreateWindowSurface(display, config, win, attrib_list) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (config != 62002) {
        EGL.setErrorCode(12293);
        return 0
    }
    EGL.setErrorCode(12288);
    return 62006
}

function _emscripten_glColorPointer() {
    Module["printErr"]("missing function: emscripten_glColorPointer");
    abort(-1)
}

function _alSourceUnqueueBuffers(source, count, buffers) {
    if (Module["disableAudio"]) return;
    if (!AL.currentContext) {
        return
    }
    var src = AL.currentContext.src[source];
    if (!src) {
        AL.currentContext.err = 40961;
        return
    }
    if (count > src.buffersPlayed) {
        AL.currentContext.err = 40963;
        return
    }
    for (var i = 0; i < count; i++) {
        var entry = src.queue.shift();
        for (var j = 0; j < AL.currentContext.buf.length; j++) {
            var b = AL.currentContext.buf[j];
            if (b && b == entry.buffer) {
                HEAP32[buffers + i * 4 >> 2] = j + 1;
                break
            }
        }
        src.buffersPlayed--
    }
    AL.updateSource(src)
}

function _emscripten_set_pointerlockchange_callback(target, userData, useCapture, callbackfunc) {
    if (!document || !document.body || !document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock) {
        return -1
    }
    if (!target) target = document;
    else {
        target = JSEvents.findEventTarget(target);
        if (!target) return -4
    }
    JSEvents.registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "pointerlockchange");
    JSEvents.registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mozpointerlockchange");
    JSEvents.registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "webkitpointerlockchange");
    JSEvents.registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mspointerlockchange");
    return 0
}
Module["_pthread_cond_broadcast"] = _pthread_cond_broadcast;

function _alGetSourcei(source, param, value) {
    if (!AL.currentContext) {
        return
    }
    var src = AL.currentContext.src[source];
    if (!src) {
        AL.currentContext.err = 40961;
        return
    }
    AL.updateSource(src);
    switch (param) {
        case 514:
            HEAP32[value >> 2] = src.panner ? 1 : 0;
            break;
        case 4097:
            HEAP32[value >> 2] = src.coneInnerAngle;
            break;
        case 4098:
            HEAP32[value >> 2] = src.coneOuterAngle;
            break;
        case 4103:
            HEAP32[value >> 2] = src.loop;
            break;
        case 4105:
            if (!src.queue.length) {
                HEAP32[value >> 2] = 0
            } else {
                var buffer = src.queue[src.buffersPlayed].buffer;
                for (var i = 0; i < AL.currentContext.buf.length; ++i) {
                    if (buffer == AL.currentContext.buf[i]) {
                        HEAP32[value >> 2] = i + 1;
                        return
                    }
                }
                HEAP32[value >> 2] = 0
            }
            break;
        case 4112:
            HEAP32[value >> 2] = src.state;
            break;
        case 4117:
            HEAP32[value >> 2] = src.queue.length;
            break;
        case 4118:
            if (src.loop) {
                HEAP32[value >> 2] = 0
            } else {
                HEAP32[value >> 2] = src.buffersPlayed
            }
            break;
        default:
            AL.currentContext.err = 40962;
            break
    }
}

function _gettimeofday(ptr) {
    var now = Date.now();
    HEAP32[ptr >> 2] = now / 1e3 | 0;
    HEAP32[ptr + 4 >> 2] = now % 1e3 * 1e3 | 0;
    return 0
}

function _emscripten_glClearStencil(x0) {
    GLctx["clearStencil"](x0)
}

function _UE_GSystemResolution(resX, resY) {
    UE_JSlib.UE_GSystemResolution_ResX = (function() {
        return Runtime.dynCall("i", resX, [])
    });
    UE_JSlib.UE_GSystemResolution_ResY = (function() {
        return Runtime.dynCall("i", resY, [])
    })
}

function _emscripten_glDetachShader(program, shader) {
    GLctx.detachShader(GL.programs[program], GL.shaders[shader])
}

function _emscripten_get_device_pixel_ratio() {
    return window.devicePixelRatio || 1
}

function _emscripten_glDeleteVertexArrays(n, vaos) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[vaos + i * 4 >> 2];
        GLctx["deleteVertexArray"](GL.vaos[id]);
        GL.vaos[id] = null
    }
}

function _alGenSources(count, sources) {
    if (!AL.currentContext) {
        return
    }
    for (var i = 0; i < count; ++i) {
        var gain = AL.currentContext.ctx.createGain();
        gain.connect(AL.currentContext.gain);
        AL.currentContext.src[AL.newSrcId] = {
            context: AL.currentContext,
            state: 4113,
            queue: [],
            loop: false,
            playbackRate: 1,
            _position: [0, 0, 0],
            _velocity: [0, 0, 0],
            _direction: [0, 0, 0],
            get refDistance() {
                return this._refDistance || 1
            },
            set refDistance(val) {
                this._refDistance = val;
                if (this.panner) this.panner.refDistance = val
            },
            get maxDistance() {
                return this._maxDistance || 1e4
            },
            set maxDistance(val) {
                this._maxDistance = val;
                if (this.panner) this.panner.maxDistance = val
            },
            get rolloffFactor() {
                return this._rolloffFactor || 1
            },
            set rolloffFactor(val) {
                this._rolloffFactor = val;
                if (this.panner) this.panner.rolloffFactor = val
            },
            get position() {
                return this._position
            },
            set position(val) {
                this._position[0] = val[0];
                this._position[1] = val[1];
                this._position[2] = val[2];
                if (this.panner) this.panner.setPosition(val[0], val[1], val[2])
            },
            get velocity() {
                return this._velocity
            },
            set velocity(val) {
                this._velocity[0] = val[0];
                this._velocity[1] = val[1];
                this._velocity[2] = val[2]
            },
            get direction() {
                return this._direction
            },
            set direction(val) {
                this._direction[0] = val[0];
                this._direction[1] = val[1];
                this._direction[2] = val[2];
                if (this.panner) this.panner.setOrientation(val[0], val[1], val[2])
            },
            get coneOuterGain() {
                return this._coneOuterGain || 0
            },
            set coneOuterGain(val) {
                this._coneOuterGain = val;
                if (this.panner) this.panner.coneOuterGain = val
            },
            get coneInnerAngle() {
                return this._coneInnerAngle || 360
            },
            set coneInnerAngle(val) {
                this._coneInnerAngle = val;
                if (this.panner) this.panner.coneInnerAngle = val
            },
            get coneOuterAngle() {
                return this._coneOuterAngle || 360
            },
            set coneOuterAngle(val) {
                this._coneOuterAngle = val;
                if (this.panner) this.panner.coneOuterAngle = val
            },
            gain: gain,
            panner: null,
            buffersPlayed: 0,
            bufferPosition: 0
        };
        HEAP32[sources + i * 4 >> 2] = AL.newSrcId;
        AL.newSrcId++
    }
}

function _emscripten_glTexParameteri(x0, x1, x2) {
    GLctx["texParameteri"](x0, x1, x2)
}

function _glGenFramebuffers(n, ids) {
    for (var i = 0; i < n; ++i) {
        var framebuffer = GLctx.createFramebuffer();
        if (!framebuffer) {
            GL.recordError(1282);
            while (i < n) HEAP32[ids + i++ * 4 >> 2] = 0;
            return
        }
        var id = GL.getNewId(GL.framebuffers);
        framebuffer.name = id;
        GL.framebuffers[id] = framebuffer;
        HEAP32[ids + i * 4 >> 2] = id
    }
}

function _emscripten_get_element_css_size(target, width, height) {
    if (!target) {
        target = Module["canvas"]
    } else {
        target = JSEvents.findEventTarget(target)
    }
    if (!target) return -4;
    if (target.getBoundingClientRect) {
        var rect = target.getBoundingClientRect();
        HEAPF64[width >> 3] = rect.right - rect.left;
        HEAPF64[height >> 3] = rect.bottom - rect.top
    } else {
        HEAPF64[width >> 3] = target.clientWidth;
        HEAPF64[height >> 3] = target.clientHeight
    }
    return 0
}

function _UE_SaveGame(name, userIndex, indata, insize) {
    var _name = Pointer_stringify(name);
    var gamedata = Module.HEAPU8.subarray(indata, indata + insize);
    var b64encoded = base64EncArr(gamedata);
    $.jStorage.set(_name, b64encoded);
    return true
}

function _glStencilFunc(x0, x1, x2) {
    GLctx["stencilFunc"](x0, x1, x2)
}

function _pthread_mutex_destroy() {}

function _emscripten_glGetTexParameteriv(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >> 2] = GLctx.getTexParameter(target, pname)
}

function ___syscall122(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var buf = SYSCALLS.get();
        if (!buf) return -ERRNO_CODES.EFAULT;
        var layout = {
            "sysname": 0,
            "nodename": 65,
            "domainname": 325,
            "machine": 260,
            "version": 195,
            "release": 130,
            "__size__": 390
        };

        function copyString(element, value) {
            var offset = layout[element];
            writeAsciiToMemory(value, buf + offset)
        }
        copyString("sysname", "Emscripten");
        copyString("nodename", "emscripten");
        copyString("release", "1.0");
        copyString("version", "#1");
        copyString("machine", "x86-JS");
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _alDeleteSources(count, sources) {
    if (Module["disableAudio"]) return;
    if (!AL.currentContext) {
        return
    }
    for (var i = 0; i < count; ++i) {
        var sourceIdx = HEAP32[sources + i * 4 >> 2];
        delete AL.currentContext.src[sourceIdx]
    }
}

function _glGetString(name_) {
    if (GL.stringCache[name_]) return GL.stringCache[name_];
    var ret;
    switch (name_) {
        case 7936:
        case 7937:
        case 37445:
        case 37446:
            ret = allocate(intArrayFromString(GLctx.getParameter(name_)), "i8", ALLOC_NORMAL);
            break;
        case 7938:
            var glVersion = GLctx.getParameter(GLctx.VERSION);
            if (GLctx.canvas.GLctxObject.version >= 2) glVersion = "OpenGL ES 3.0 (" + glVersion + ")";
            else {
                glVersion = "OpenGL ES 2.0 (" + glVersion + ")"
            }
            ret = allocate(intArrayFromString(glVersion), "i8", ALLOC_NORMAL);
            break;
        case 7939:
            var exts = GLctx.getSupportedExtensions();
            var gl_exts = [];
            for (var i in exts) {
                gl_exts.push(exts[i]);
                gl_exts.push("GL_" + exts[i])
            }
            ret = allocate(intArrayFromString(gl_exts.join(" ")), "i8", ALLOC_NORMAL);
            break;
        case 35724:
            var glslVersion = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION);
            var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
            var ver_num = glslVersion.match(ver_re);
            if (ver_num !== null) {
                if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
                glslVersion = "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")"
            }
            ret = allocate(intArrayFromString(glslVersion), "i8", ALLOC_NORMAL);
            break;
        default:
            GL.recordError(1280);
            return 0
    }
    GL.stringCache[name_] = ret;
    return ret
}

function _emscripten_glGenerateMipmap(x0) {
    GLctx["generateMipmap"](x0)
}

function _emscripten_glSampleCoverage(value, invert) {
    GLctx.sampleCoverage(value, !!invert)
}

function _emscripten_glCullFace(x0) {
    GLctx["cullFace"](x0)
}

function _glDeleteTextures(n, textures) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[textures + i * 4 >> 2];
        var texture = GL.textures[id];
        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null
    }
}

function _glDisableVertexAttribArray(index) {
    GLctx.disableVertexAttribArray(index)
}

function _emscripten_glUseProgram(program) {
    GLctx.useProgram(program ? GL.programs[program] : null)
}

function _emscripten_glHint(x0, x1) {
    GLctx["hint"](x0, x1)
}

function _emscripten_glFramebufferTexture2D(target, attachment, textarget, texture, level) {
    GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level)
}

function _dlsym(handle, symbol) {
    symbol = Pointer_stringify(symbol);
    if (!DLFCN.loadedLibs[handle]) {
        DLFCN.errorMsg = "Tried to dlsym() from an unopened handle: " + handle;
        return 0
    } else {
        var lib = DLFCN.loadedLibs[handle];
        symbol = "_" + symbol;
        if (lib.cached_functions.hasOwnProperty(symbol)) {
            return lib.cached_functions[symbol]
        }
        if (!lib.module.hasOwnProperty(symbol)) {
            DLFCN.errorMsg = 'Tried to lookup unknown symbol "' + symbol + '" in dynamic lib: ' + lib.name;
            return 0
        } else {
            var result = lib.module[symbol];
            if (typeof result == "function") {
                result = Runtime.addFunction(result);
                lib.cached_functions = result
            }
            return result
        }
    }
}

function _glStencilOpSeparate(x0, x1, x2, x3) {
    GLctx["stencilOpSeparate"](x0, x1, x2, x3)
}

function _emscripten_glMatrixMode() {
    throw "Legacy GL function (glMatrixMode) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation."
}

function _abort() {
    Module["abort"]()
}

function _emscripten_glVertexAttribDivisor(index, divisor) {
    GLctx["vertexAttribDivisor"](index, divisor)
}

function _emscripten_glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
    GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer])
}

function _alSourcePause(source) {
    if (Module["disableAudio"]) return;
    if (!AL.currentContext) {
        return
    }
    var src = AL.currentContext.src[source];
    if (!src) {
        AL.currentContext.err = 40961;
        return
    }
    AL.setSourceState(src, 4115)
}

function _alGenBuffers(count, buffers) {
    if (!AL.currentContext) {
        return
    }
    for (var i = 0; i < count; ++i) {
        AL.currentContext.buf.push(null);
        HEAP32[buffers + i * 4 >> 2] = AL.currentContext.buf.length
    }
}

function _emscripten_glPolygonOffset(x0, x1) {
    GLctx["polygonOffset"](x0, x1)
}

function _emscripten_glIsBuffer(buffer) {
    var b = GL.buffers[buffer];
    if (!b) return 0;
    return GLctx.isBuffer(b)
}

function _emscripten_glUniform2iv(location, count, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniform2iv(GL.uniforms[location], HEAP32, value >> 2, count * 2);
        return
    }
    GLctx.uniform2iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 8 >> 2))
}

function _alcProcessContext(context) {}

function _glEnable(x0) {
    GLctx["enable"](x0)
}

function _alBufferData(buffer, format, data, size, freq) {
    if (Module["disableAudio"]) return;
    if (!AL.currentContext) {
        return
    }
    if (buffer > AL.currentContext.buf.length) {
        return
    }
    try {
        switch (format) {
            case 4352:
                var buf = AL.currentContext.ctx.createBuffer(1, size, freq);
                buf.bytesPerSample = 1;
                var channel0 = buf.getChannelData(0);
                for (var i = 0; i < size; ++i) channel0[i] = HEAPU8[data++] * .0078125 - 1;
                break;
            case 4353:
                var buf = AL.currentContext.ctx.createBuffer(1, size >> 1, freq);
                buf.bytesPerSample = 2;
                var channel0 = buf.getChannelData(0);
                data >>= 1;
                for (var i = 0; i < size >> 1; ++i) channel0[i] = HEAP16[data++] * 30517578125e-15;
                break;
            case 4354:
                var buf = AL.currentContext.ctx.createBuffer(2, size >> 1, freq);
                buf.bytesPerSample = 1;
                var channel0 = buf.getChannelData(0);
                var channel1 = buf.getChannelData(1);
                for (var i = 0; i < size >> 1; ++i) {
                    channel0[i] = HEAPU8[data++] * .0078125 - 1;
                    channel1[i] = HEAPU8[data++] * .0078125 - 1
                }
                break;
            case 4355:
                var buf = AL.currentContext.ctx.createBuffer(2, size >> 2, freq);
                buf.bytesPerSample = 2;
                var channel0 = buf.getChannelData(0);
                var channel1 = buf.getChannelData(1);
                data >>= 1;
                for (var i = 0; i < size >> 2; ++i) {
                    channel0[i] = HEAP16[data++] * 30517578125e-15;
                    channel1[i] = HEAP16[data++] * 30517578125e-15
                }
                break;
            case 65552:
                var buf = AL.currentContext.ctx.createBuffer(1, size >> 2, freq);
                buf.bytesPerSample = 4;
                var channel0 = buf.getChannelData(0);
                data >>= 2;
                for (var i = 0; i < size >> 2; ++i) channel0[i] = HEAPF32[data++];
                break;
            case 65553:
                var buf = AL.currentContext.ctx.createBuffer(2, size >> 3, freq);
                buf.bytesPerSample = 4;
                var channel0 = buf.getChannelData(0);
                var channel1 = buf.getChannelData(1);
                data >>= 2;
                for (var i = 0; i < size >> 2; ++i) {
                    channel0[i] = HEAPF32[data++];
                    channel1[i] = HEAPF32[data++]
                }
                break;
            default:
                AL.currentContext.err = 40963;
                break
        }
        AL.currentContext.buf[buffer - 1] = buf
    } catch (e) {
        AL.currentContext.err = 40963
    }
}

function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    if (GL.currentContext.version >= 2) {
        if (type == 36193) type = 5131
    }
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texSubImage2D(target, level, internalFormat, width, height, border, format, type, pixels)
        } else if (pixels != 0) {
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type))
        } else {
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, null)
        }
        return
    }
    var pixelData = null;
    if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
    GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData)
}
var cttz_i8 = allocate([8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0], "i8", ALLOC_STATIC);

function _llvm_cttz_i32(x) {
    x = x | 0;
    var ret = 0;
    ret = HEAP8[cttz_i8 + (x & 255) >> 0] | 0;
    if ((ret | 0) < 8) return ret | 0;
    ret = HEAP8[cttz_i8 + (x >> 8 & 255) >> 0] | 0;
    if ((ret | 0) < 8) return ret + 8 | 0;
    ret = HEAP8[cttz_i8 + (x >> 16 & 255) >> 0] | 0;
    if ((ret | 0) < 8) return ret + 16 | 0;
    return (HEAP8[cttz_i8 + (x >>> 24) >> 0] | 0) + 24 | 0
}

function _glBindBufferRange(target, index, buffer, offset, ptrsize) {
    var bufferObj = buffer ? GL.buffers[buffer] : null;
    GLctx["bindBufferRange"](target, index, bufferObj, offset, ptrsize)
}

function _emscripten_glUniform2f(location, v0, v1) {
    GLctx.uniform2f(GL.uniforms[location], v0, v1)
}

function _emscripten_glBindVertexArray(vao) {
    GLctx["bindVertexArray"](GL.vaos[vao])
}

function _emscripten_glCompileShader(shader) {
    if (Module["precompiledPrograms"]) return;
    GLctx.compileShader(GL.shaders[shader])
}

function _emscripten_glUniform2i(location, v0, v1) {
    GLctx.uniform2i(GL.uniforms[location], v0, v1)
}

function _glBlendFunc(x0, x1) {
    GLctx["blendFunc"](x0, x1)
}

function _glCreateProgram() {
    var id = GL.getNewId(GL.programs);
    var program = GLctx.createProgram();
    program.name = id;
    GL.programs[id] = program;
    return id
}

function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[renderbuffers + i * 4 >> 2];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue;
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null
    }
}

function ___cxa_pure_virtual() {
    ABORT = true;
    throw "Pure virtual function called!"
}
Module["_testSetjmp"] = _testSetjmp;

function _longjmp(env, value) {
    Module["setThrew"](env, value || 1);
    throw "longjmp"
}

function _emscripten_glDepthMask(flag) {
    GLctx.depthMask(!!flag)
}

function __hideEverythingExceptGivenElement(onlyVisibleElement) {
    var child = onlyVisibleElement;
    var parent = child.parentNode;
    var hiddenElements = [];
    while (child != document.body) {
        var children = parent.children;
        for (var i = 0; i < children.length; ++i) {
            if (children[i] != child) {
                hiddenElements.push({
                    node: children[i],
                    displayState: children[i].style.display
                });
                children[i].style.display = "none"
            }
        }
        child = parent;
        parent = parent.parentNode
    }
    return hiddenElements
}
var __restoreOldWindowedStyle = null;

function __restoreHiddenElements(hiddenElements) {
    for (var i = 0; i < hiddenElements.length; ++i) {
        hiddenElements[i].node.style.display = hiddenElements[i].displayState
    }
}

function __softFullscreenResizeWebGLRenderTarget() {
    var inHiDPIFullscreenMode = __currentFullscreenStrategy.canvasResolutionScaleMode == 2;
    var inAspectRatioFixedFullscreenMode = __currentFullscreenStrategy.scaleMode == 2;
    var inPixelPerfectFullscreenMode = __currentFullscreenStrategy.canvasResolutionScaleMode != 0;
    var inCenteredWithoutScalingFullscreenMode = __currentFullscreenStrategy.scaleMode == 3;
    var screenWidth = inHiDPIFullscreenMode ? Math.round(window.innerWidth * window.devicePixelRatio) : window.innerWidth;
    var screenHeight = inHiDPIFullscreenMode ? Math.round(window.innerHeight * window.devicePixelRatio) : window.innerHeight;
    var w = screenWidth;
    var h = screenHeight;
    var canvas = __currentFullscreenStrategy.target;
    var x = canvas.width;
    var y = canvas.height;
    var topMargin;
    if (inAspectRatioFixedFullscreenMode) {
        if (w * y < x * h) h = w * y / x | 0;
        else if (w * y > x * h) w = h * x / y | 0;
        topMargin = (screenHeight - h) / 2 | 0
    }
    if (inPixelPerfectFullscreenMode) {
        canvas.width = w;
        canvas.height = h;
        if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, canvas.width, canvas.height)
    }
    if (inHiDPIFullscreenMode) {
        topMargin /= window.devicePixelRatio;
        w /= window.devicePixelRatio;
        h /= window.devicePixelRatio;
        w = Math.round(w * 1e4) / 1e4;
        h = Math.round(h * 1e4) / 1e4;
        topMargin = Math.round(topMargin * 1e4) / 1e4
    }
    if (inCenteredWithoutScalingFullscreenMode) {
        var t = (window.innerHeight - parseInt(canvas.style.height)) / 2;
        var b = (window.innerWidth - parseInt(canvas.style.width)) / 2;
        __setLetterbox(canvas, t, b)
    } else {
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        var b = (window.innerWidth - w) / 2;
        __setLetterbox(canvas, topMargin, b)
    }
    if (!inCenteredWithoutScalingFullscreenMode && __currentFullscreenStrategy.canvasResizedCallback) {
        Module["dynCall_iiii"](__currentFullscreenStrategy.canvasResizedCallback, 37, 0, __currentFullscreenStrategy.canvasResizedCallbackUserData)
    }
}

function _emscripten_enter_soft_fullscreen(target, fullscreenStrategy) {
    if (!target) target = "#canvas";
    target = JSEvents.findEventTarget(target);
    if (!target) return -4;
    var strategy = {};
    strategy.scaleMode = HEAP32[fullscreenStrategy >> 2];
    strategy.canvasResolutionScaleMode = HEAP32[fullscreenStrategy + 4 >> 2];
    strategy.filteringMode = HEAP32[fullscreenStrategy + 8 >> 2];
    strategy.canvasResizedCallback = HEAP32[fullscreenStrategy + 12 >> 2];
    strategy.canvasResizedCallbackUserData = HEAP32[fullscreenStrategy + 16 >> 2];
    strategy.target = target;
    strategy.softFullscreen = true;
    var restoreOldStyle = JSEvents.resizeCanvasForFullscreen(target, strategy);
    document.documentElement.style.overflow = "hidden";
    document.body.scroll = "no";
    document.body.style.margin = "0px";
    var hiddenElements = __hideEverythingExceptGivenElement(target);

    function restoreWindowedState() {
        restoreOldStyle();
        __restoreHiddenElements(hiddenElements);
        window.removeEventListener("resize", __softFullscreenResizeWebGLRenderTarget);
        if (strategy.canvasResizedCallback) {
            Module["dynCall_iiii"](strategy.canvasResizedCallback, 37, 0, strategy.canvasResizedCallbackUserData)
        }
    }
    __restoreOldWindowedStyle = restoreWindowedState;
    __currentFullscreenStrategy = strategy;
    window.addEventListener("resize", __softFullscreenResizeWebGLRenderTarget);
    if (strategy.canvasResizedCallback) {
        Module["dynCall_iiii"](strategy.canvasResizedCallback, 37, 0, strategy.canvasResizedCallbackUserData)
    }
    return 0
}

function _emscripten_glDepthRange(x0, x1) {
    GLctx["depthRange"](x0, x1)
}

function _emscripten_set_fullscreenchange_callback(target, userData, useCapture, callbackfunc) {
    if (typeof JSEvents.fullscreenEnabled() === "undefined") return -1;
    if (!target) target = document;
    else {
        target = JSEvents.findEventTarget(target);
        if (!target) return -4
    }
    JSEvents.registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "fullscreenchange");
    JSEvents.registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "mozfullscreenchange");
    JSEvents.registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "webkitfullscreenchange");
    JSEvents.registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "msfullscreenchange");
    return 0
}

function _emscripten_glVertexAttrib1fv(index, v) {
    GLctx.vertexAttrib1f(index, HEAPF32[v >> 2])
}

function _glPolygonOffset(x0, x1) {
    GLctx["polygonOffset"](x0, x1)
}

function ___syscall140(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            offset_high = SYSCALLS.get(),
            offset_low = SYSCALLS.get(),
            result = SYSCALLS.get(),
            whence = SYSCALLS.get();
        var offset = offset_low;
        assert(offset_high === 0);
        FS.llseek(stream, offset, whence);
        HEAP32[result >> 2] = stream.position;
        if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _alSourcei(source, param, value) {
    if (Module["disableAudio"]) return;
    if (!AL.currentContext) {
        return
    }
    var src = AL.currentContext.src[source];
    if (!src) {
        AL.currentContext.err = 40961;
        return
    }
    switch (param) {
        case 4097:
            src.coneInnerAngle = value;
            break;
        case 4098:
            src.coneOuterAngle = value;
            break;
        case 4103:
            src.loop = value === 1;
            break;
        case 4105:
            var buffer = AL.currentContext.buf[value - 1];
            if (value == 0) {
                src.queue = []
            } else {
                src.queue = [{
                    buffer: buffer
                }]
            }
            AL.updateSource(src);
            break;
        case 514:
            if (value === 1) {
                if (src.panner) {
                    src.panner = null;
                    src.gain.disconnect();
                    src.gain.connect(AL.currentContext.gain)
                }
            } else if (value === 0) {
                if (!src.panner) {
                    var panner = src.panner = AL.currentContext.ctx.createPanner();
                    panner.panningModel = "equalpower";
                    panner.distanceModel = "linear";
                    panner.refDistance = src.refDistance;
                    panner.maxDistance = src.maxDistance;
                    panner.rolloffFactor = src.rolloffFactor;
                    panner.setPosition(src.position[0], src.position[1], src.position[2]);
                    panner.connect(AL.currentContext.gain);
                    src.gain.disconnect();
                    src.gain.connect(panner)
                }
            } else {
                AL.currentContext.err = 40963
            }
            break;
        default:
            AL.currentContext.err = 40962;
            break
    }
}

function _emscripten_glVertexAttrib1f(x0, x1) {
    GLctx["vertexAttrib1f"](x0, x1)
}

function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
    var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
    HEAP32[range >> 2] = result.rangeMin;
    HEAP32[range + 4 >> 2] = result.rangeMax;
    HEAP32[precision >> 2] = result.precision
}

function _emscripten_glUniform1fv(location, count, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniform1fv(GL.uniforms[location], HEAPF32, value >> 2, count);
        return
    }
    var view;
    if (count <= GL.MINI_TEMP_BUFFER_SIZE) {
        view = GL.miniTempBufferViews[count - 1];
        for (var i = 0; i < count; ++i) {
            view[i] = HEAPF32[value + 4 * i >> 2]
        }
    } else {
        view = HEAPF32.subarray(value >> 2, value + count * 4 >> 2)
    }
    GLctx.uniform1fv(GL.uniforms[location], view)
}
var SOCKFS = {
    mount: (function(mount) {
        Module["websocket"] = Module["websocket"] && "object" === typeof Module["websocket"] ? Module["websocket"] : {};
        Module["websocket"]._callbacks = {};
        Module["websocket"]["on"] = (function(event, callback) {
            if ("function" === typeof callback) {
                this._callbacks[event] = callback
            }
            return this
        });
        Module["websocket"].emit = (function(event, param) {
            if ("function" === typeof this._callbacks[event]) {
                this._callbacks[event].call(this, param)
            }
        });
        return FS.createNode(null, "/", 16384 | 511, 0)
    }),
    createSocket: (function(family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
            assert(streaming == (protocol == 6))
        }
        var sock = {
            family: family,
            type: type,
            protocol: protocol,
            server: null,
            error: null,
            peers: {},
            pending: [],
            recv_queue: [],
            sock_ops: SOCKFS.websocket_sock_ops
        };
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
        var stream = FS.createStream({
            path: name,
            node: node,
            flags: FS.modeStringToFlags("r+"),
            seekable: false,
            stream_ops: SOCKFS.stream_ops
        });
        sock.stream = stream;
        return sock
    }),
    getSocket: (function(fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
            return null
        }
        return stream.node.sock
    }),
    stream_ops: {
        poll: (function(stream) {
            var sock = stream.node.sock;
            return sock.sock_ops.poll(sock)
        }),
        ioctl: (function(stream, request, varargs) {
            var sock = stream.node.sock;
            return sock.sock_ops.ioctl(sock, request, varargs)
        }),
        read: (function(stream, buffer, offset, length, position) {
            var sock = stream.node.sock;
            var msg = sock.sock_ops.recvmsg(sock, length);
            if (!msg) {
                return 0
            }
            buffer.set(msg.buffer, offset);
            return msg.buffer.length
        }),
        write: (function(stream, buffer, offset, length, position) {
            var sock = stream.node.sock;
            return sock.sock_ops.sendmsg(sock, buffer, offset, length)
        }),
        close: (function(stream) {
            var sock = stream.node.sock;
            sock.sock_ops.close(sock)
        })
    },
    nextname: (function() {
        if (!SOCKFS.nextname.current) {
            SOCKFS.nextname.current = 0
        }
        return "socket[" + SOCKFS.nextname.current++ + "]"
    }),
    websocket_sock_ops: {
        createPeer: (function(sock, addr, port) {
            var ws;
            if (typeof addr === "object") {
                ws = addr;
                addr = null;
                port = null
            }
            if (ws) {
                if (ws._socket) {
                    addr = ws._socket.remoteAddress;
                    port = ws._socket.remotePort
                } else {
                    var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
                    if (!result) {
                        throw new Error("WebSocket URL must be in the format ws(s)://address:port")
                    }
                    addr = result[1];
                    port = parseInt(result[2], 10)
                }
            } else {
                try {
                    var runtimeConfig = Module["websocket"] && "object" === typeof Module["websocket"];
                    var url = "ws:#".replace("#", "//");
                    if (runtimeConfig) {
                        if ("string" === typeof Module["websocket"]["url"]) {
                            url = Module["websocket"]["url"]
                        }
                    }
                    if (url === "ws://" || url === "wss://") {
                        var parts = addr.split("/");
                        url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/")
                    }
                    var subProtocols = "binary";
                    if (runtimeConfig) {
                        if ("string" === typeof Module["websocket"]["subprotocol"]) {
                            subProtocols = Module["websocket"]["subprotocol"]
                        }
                    }
                    subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
                    var opts = ENVIRONMENT_IS_NODE ? {
                        "protocol": subProtocols.toString()
                    } : subProtocols;
                    var WebSocketConstructor;
                    if (ENVIRONMENT_IS_NODE) {
                        WebSocketConstructor = require("ws")
                    } else if (ENVIRONMENT_IS_WEB) {
                        WebSocketConstructor = window["WebSocket"]
                    } else {
                        WebSocketConstructor = WebSocket
                    }
                    ws = new WebSocketConstructor(url, opts);
                    ws.binaryType = "arraybuffer"
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH)
                }
            }
            var peer = {
                addr: addr,
                port: port,
                socket: ws,
                dgram_send_queue: []
            };
            SOCKFS.websocket_sock_ops.addPeer(sock, peer);
            SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
            if (sock.type === 2 && typeof sock.sport !== "undefined") {
                peer.dgram_send_queue.push(new Uint8Array([255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), (sock.sport & 65280) >> 8, sock.sport & 255]))
            }
            return peer
        }),
        getPeer: (function(sock, addr, port) {
            return sock.peers[addr + ":" + port]
        }),
        addPeer: (function(sock, peer) {
            sock.peers[peer.addr + ":" + peer.port] = peer
        }),
        removePeer: (function(sock, peer) {
            delete sock.peers[peer.addr + ":" + peer.port]
        }),
        handlePeerEvents: (function(sock, peer) {
            var first = true;
            var handleOpen = (function() {
                Module["websocket"].emit("open", sock.stream.fd);
                try {
                    var queued = peer.dgram_send_queue.shift();
                    while (queued) {
                        peer.socket.send(queued);
                        queued = peer.dgram_send_queue.shift()
                    }
                } catch (e) {
                    peer.socket.close()
                }
            });

            function handleMessage(data) {
                assert(typeof data !== "string" && data.byteLength !== undefined);
                if (data.byteLength == 0) {
                    return
                }
                data = new Uint8Array(data);
                var wasfirst = first;
                first = false;
                if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
                    var newport = data[8] << 8 | data[9];
                    SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                    peer.port = newport;
                    SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                    return
                }
                sock.recv_queue.push({
                    addr: peer.addr,
                    port: peer.port,
                    data: data
                });
                Module["websocket"].emit("message", sock.stream.fd)
            }
            if (ENVIRONMENT_IS_NODE) {
                peer.socket.on("open", handleOpen);
                peer.socket.on("message", (function(data, flags) {
                    if (!flags.binary) {
                        return
                    }
                    handleMessage((new Uint8Array(data)).buffer)
                }));
                peer.socket.on("close", (function() {
                    Module["websocket"].emit("close", sock.stream.fd)
                }));
                peer.socket.on("error", (function(error) {
                    sock.error = ERRNO_CODES.ECONNREFUSED;
                    Module["websocket"].emit("error", [sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused"])
                }))
            } else {
                peer.socket.onopen = handleOpen;
                peer.socket.onclose = (function() {
                    Module["websocket"].emit("close", sock.stream.fd)
                });
                peer.socket.onmessage = function peer_socket_onmessage(event) {
                    handleMessage(event.data)
                };
                peer.socket.onerror = (function(error) {
                    sock.error = ERRNO_CODES.ECONNREFUSED;
                    Module["websocket"].emit("error", [sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused"])
                })
            }
        }),
        poll: (function(sock) {
            if (sock.type === 1 && sock.server) {
                return sock.pending.length ? 64 | 1 : 0
            }
            var mask = 0;
            var dest = sock.type === 1 ? SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null;
            if (sock.recv_queue.length || !dest || dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
                mask |= 64 | 1
            }
            if (!dest || dest && dest.socket.readyState === dest.socket.OPEN) {
                mask |= 4
            }
            if (dest && dest.socket.readyState === dest.socket.CLOSING || dest && dest.socket.readyState === dest.socket.CLOSED) {
                mask |= 16
            }
            return mask
        }),
        ioctl: (function(sock, request, arg) {
            switch (request) {
                case 21531:
                    var bytes = 0;
                    if (sock.recv_queue.length) {
                        bytes = sock.recv_queue[0].data.length
                    }
                    HEAP32[arg >> 2] = bytes;
                    return 0;
                default:
                    return ERRNO_CODES.EINVAL
            }
        }),
        close: (function(sock) {
            if (sock.server) {
                try {
                    sock.server.close()
                } catch (e) {}
                sock.server = null
            }
            var peers = Object.keys(sock.peers);
            for (var i = 0; i < peers.length; i++) {
                var peer = sock.peers[peers[i]];
                try {
                    peer.socket.close()
                } catch (e) {}
                SOCKFS.websocket_sock_ops.removePeer(sock, peer)
            }
            return 0
        }),
        bind: (function(sock, addr, port) {
            if (typeof sock.saddr !== "undefined" || typeof sock.sport !== "undefined") {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            sock.saddr = addr;
            sock.sport = port;
            if (sock.type === 2) {
                if (sock.server) {
                    sock.server.close();
                    sock.server = null
                }
                try {
                    sock.sock_ops.listen(sock, 0)
                } catch (e) {
                    if (!(e instanceof FS.ErrnoError)) throw e;
                    if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e
                }
            }
        }),
        connect: (function(sock, addr, port) {
            if (sock.server) {
                throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)
            }
            if (typeof sock.daddr !== "undefined" && typeof sock.dport !== "undefined") {
                var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                if (dest) {
                    if (dest.socket.readyState === dest.socket.CONNECTING) {
                        throw new FS.ErrnoError(ERRNO_CODES.EALREADY)
                    } else {
                        throw new FS.ErrnoError(ERRNO_CODES.EISCONN)
                    }
                }
            }
            var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
            sock.daddr = peer.addr;
            sock.dport = peer.port;
            throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS)
        }),
        listen: (function(sock, backlog) {
            if (!ENVIRONMENT_IS_NODE) {
                throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)
            }
            if (sock.server) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            var WebSocketServer = require("ws").Server;
            var host = sock.saddr;
            sock.server = new WebSocketServer({
                host: host,
                port: sock.sport
            });
            Module["websocket"].emit("listen", sock.stream.fd);
            sock.server.on("connection", (function(ws) {
                if (sock.type === 1) {
                    var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
                    var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
                    newsock.daddr = peer.addr;
                    newsock.dport = peer.port;
                    sock.pending.push(newsock);
                    Module["websocket"].emit("connection", newsock.stream.fd)
                } else {
                    SOCKFS.websocket_sock_ops.createPeer(sock, ws);
                    Module["websocket"].emit("connection", sock.stream.fd)
                }
            }));
            sock.server.on("closed", (function() {
                Module["websocket"].emit("close", sock.stream.fd);
                sock.server = null
            }));
            sock.server.on("error", (function(error) {
                sock.error = ERRNO_CODES.EHOSTUNREACH;
                Module["websocket"].emit("error", [sock.stream.fd, sock.error, "EHOSTUNREACH: Host is unreachable"])
            }))
        }),
        accept: (function(listensock) {
            if (!listensock.server) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
            var newsock = listensock.pending.shift();
            newsock.stream.flags = listensock.stream.flags;
            return newsock
        }),
        getname: (function(sock, peer) {
            var addr, port;
            if (peer) {
                if (sock.daddr === undefined || sock.dport === undefined) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)
                }
                addr = sock.daddr;
                port = sock.dport
            } else {
                addr = sock.saddr || 0;
                port = sock.sport || 0
            }
            return {
                addr: addr,
                port: port
            }
        }),
        sendmsg: (function(sock, buffer, offset, length, addr, port) {
            if (sock.type === 2) {
                if (addr === undefined || port === undefined) {
                    addr = sock.daddr;
                    port = sock.dport
                }
                if (addr === undefined || port === undefined) {
                    throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ)
                }
            } else {
                addr = sock.daddr;
                port = sock.dport
            }
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
            if (sock.type === 1) {
                if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                    throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)
                } else if (dest.socket.readyState === dest.socket.CONNECTING) {
                    throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                }
            }
            var data;
            if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
                data = buffer.slice(offset, offset + length)
            } else {
                data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length)
            }
            if (sock.type === 2) {
                if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
                    if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                        dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port)
                    }
                    dest.dgram_send_queue.push(data);
                    return length
                }
            }
            try {
                dest.socket.send(data);
                return length
            } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
            }
        }),
        recvmsg: (function(sock, length) {
            if (sock.type === 1 && sock.server) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)
            }
            var queued = sock.recv_queue.shift();
            if (!queued) {
                if (sock.type === 1) {
                    var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                    if (!dest) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)
                    } else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                        return null
                    } else {
                        throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                    }
                } else {
                    throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)
                }
            }
            var queuedLength = queued.data.byteLength || queued.data.length;
            var queuedOffset = queued.data.byteOffset || 0;
            var queuedBuffer = queued.data.buffer || queued.data;
            var bytesRead = Math.min(length, queuedLength);
            var res = {
                buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
                addr: queued.addr,
                port: queued.port
            };
            if (sock.type === 1 && bytesRead < queuedLength) {
                var bytesRemaining = queuedLength - bytesRead;
                queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
                sock.recv_queue.unshift(queued)
            }
            return res
        })
    }
};

function __read_sockaddr(sa, salen) {
    var family = HEAP16[sa >> 1];
    var port = _ntohs(HEAP16[sa + 2 >> 1]);
    var addr;
    switch (family) {
        case 2:
            if (salen !== 16) {
                return {
                    errno: ERRNO_CODES.EINVAL
                }
            }
            addr = HEAP32[sa + 4 >> 2];
            addr = __inet_ntop4_raw(addr);
            break;
        case 10:
            if (salen !== 28) {
                return {
                    errno: ERRNO_CODES.EINVAL
                }
            }
            addr = [HEAP32[sa + 8 >> 2], HEAP32[sa + 12 >> 2], HEAP32[sa + 16 >> 2], HEAP32[sa + 20 >> 2]];
            addr = __inet_ntop6_raw(addr);
            break;
        default:
            return {
                errno: ERRNO_CODES.EAFNOSUPPORT
            }
    }
    return {
        family: family,
        addr: addr,
        port: port
    }
}

function ___syscall102(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var call = SYSCALLS.get(),
            socketvararg = SYSCALLS.get();
        SYSCALLS.varargs = socketvararg;
        switch (call) {
            case 1:
                {
                    var domain = SYSCALLS.get(),
                        type = SYSCALLS.get(),
                        protocol = SYSCALLS.get();
                    var sock = SOCKFS.createSocket(domain, type, protocol);assert(sock.stream.fd < 64);
                    return sock.stream.fd
                };
            case 2:
                {
                    var sock = SYSCALLS.getSocketFromFD(),
                        info = SYSCALLS.getSocketAddress();sock.sock_ops.bind(sock, info.addr, info.port);
                    return 0
                };
            case 3:
                {
                    var sock = SYSCALLS.getSocketFromFD(),
                        info = SYSCALLS.getSocketAddress();sock.sock_ops.connect(sock, info.addr, info.port);
                    return 0
                };
            case 4:
                {
                    var sock = SYSCALLS.getSocketFromFD(),
                        backlog = SYSCALLS.get();sock.sock_ops.listen(sock, backlog);
                    return 0
                };
            case 5:
                {
                    var sock = SYSCALLS.getSocketFromFD(),
                        addr = SYSCALLS.get(),
                        addrlen = SYSCALLS.get();
                    var newsock = sock.sock_ops.accept(sock);
                    if (addr) {
                        var res = __write_sockaddr(addr, newsock.family, DNS.lookup_name(newsock.daddr), newsock.dport);
                        assert(!res.errno)
                    }
                    return newsock.stream.fd
                };
            case 6:
                {
                    var sock = SYSCALLS.getSocketFromFD(),
                        addr = SYSCALLS.get(),
                        addrlen = SYSCALLS.get();
                    var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(sock.saddr || "0.0.0.0"), sock.sport);assert(!res.errno);
                    return 0
                };
            case 7:
                {
                    var sock = SYSCALLS.getSocketFromFD(),
                        addr = SYSCALLS.get(),
                        addrlen = SYSCALLS.get();
                    if (!sock.daddr) {
                        return -ERRNO_CODES.ENOTCONN
                    }
                    var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(sock.daddr), sock.dport);assert(!res.errno);
                    return 0
                };
            case 11:
                {
                    var sock = SYSCALLS.getSocketFromFD(),
                        message = SYSCALLS.get(),
                        length = SYSCALLS.get(),
                        flags = SYSCALLS.get(),
                        dest = SYSCALLS.getSocketAddress(true);
                    if (!dest) {
                        return FS.write(sock.stream, HEAP8, message, length)
                    } else {
                        return sock.sock_ops.sendmsg(sock, HEAP8, message, length, dest.addr, dest.port)
                    }
                };
            case 12:
                {
                    var sock = SYSCALLS.getSocketFromFD(),
                        buf = SYSCALLS.get(),
                        len = SYSCALLS.get(),
                        flags = SYSCALLS.get(),
                        addr = SYSCALLS.get(),
                        addrlen = SYSCALLS.get();
                    var msg = sock.sock_ops.recvmsg(sock, len);
                    if (!msg) return 0;
                    if (addr) {
                        var res = __write_sockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port);
                        assert(!res.errno)
                    }
                    HEAPU8.set(msg.buffer, buf);
                    return msg.buffer.byteLength
                };
            case 14:
                {
                    return -ERRNO_CODES.ENOPROTOOPT
                };
            case 15:
                {
                    var sock = SYSCALLS.getSocketFromFD(),
                        level = SYSCALLS.get(),
                        optname = SYSCALLS.get(),
                        optval = SYSCALLS.get(),
                        optlen = SYSCALLS.get();
                    if (level === 1) {
                        if (optname === 4) {
                            HEAP32[optval >> 2] = sock.error;
                            HEAP32[optlen >> 2] = 4;
                            sock.error = null;
                            return 0
                        }
                    }
                    return -ERRNO_CODES.ENOPROTOOPT
                };
            case 16:
                {
                    var sock = SYSCALLS.getSocketFromFD(),
                        message = SYSCALLS.get(),
                        flags = SYSCALLS.get();
                    var iov = HEAP32[message + 8 >> 2];
                    var num = HEAP32[message + 12 >> 2];
                    var addr, port;
                    var name = HEAP32[message >> 2];
                    var namelen = HEAP32[message + 4 >> 2];
                    if (name) {
                        var info = __read_sockaddr(name, namelen);
                        if (info.errno) return -info.errno;
                        port = info.port;
                        addr = DNS.lookup_addr(info.addr) || info.addr
                    }
                    var total = 0;
                    for (var i = 0; i < num; i++) {
                        total += HEAP32[iov + (8 * i + 4) >> 2]
                    }
                    var view = new Uint8Array(total);
                    var offset = 0;
                    for (var i = 0; i < num; i++) {
                        var iovbase = HEAP32[iov + (8 * i + 0) >> 2];
                        var iovlen = HEAP32[iov + (8 * i + 4) >> 2];
                        for (var j = 0; j < iovlen; j++) {
                            view[offset++] = HEAP8[iovbase + j >> 0]
                        }
                    }
                    return sock.sock_ops.sendmsg(sock, view, 0, total, addr, port)
                };
            case 17:
                {
                    var sock = SYSCALLS.getSocketFromFD(),
                        message = SYSCALLS.get(),
                        flags = SYSCALLS.get();
                    var iov = HEAP32[message + 8 >> 2];
                    var num = HEAP32[message + 12 >> 2];
                    var total = 0;
                    for (var i = 0; i < num; i++) {
                        total += HEAP32[iov + (8 * i + 4) >> 2]
                    }
                    var msg = sock.sock_ops.recvmsg(sock, total);
                    if (!msg) return 0;
                    var name = HEAP32[message >> 2];
                    if (name) {
                        var res = __write_sockaddr(name, sock.family, DNS.lookup_name(msg.addr), msg.port);
                        assert(!res.errno)
                    }
                    var bytesRead = 0;
                    var bytesRemaining = msg.buffer.byteLength;
                    for (var i = 0; bytesRemaining > 0 && i < num; i++) {
                        var iovbase = HEAP32[iov + (8 * i + 0) >> 2];
                        var iovlen = HEAP32[iov + (8 * i + 4) >> 2];
                        if (!iovlen) {
                            continue
                        }
                        var length = Math.min(iovlen, bytesRemaining);
                        var buf = msg.buffer.subarray(bytesRead, bytesRead + length);
                        HEAPU8.set(buf, iovbase + bytesRead);
                        bytesRead += length;
                        bytesRemaining -= length
                    }
                    return bytesRead
                };
            default:
                abort("unsupported socketcall syscall " + call)
        }
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _emscripten_glBindRenderbuffer(target, renderbuffer) {
    GLctx.bindRenderbuffer(target, renderbuffer ? GL.renderbuffers[renderbuffer] : null)
}

function _emscripten_set_wheel_callback(target, userData, useCapture, callbackfunc) {
    target = JSEvents.findEventTarget(target);
    if (typeof target.onwheel !== "undefined") {
        JSEvents.registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel");
        return 0
    } else if (typeof target.onmousewheel !== "undefined") {
        JSEvents.registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "mousewheel");
        return 0
    } else {
        return -1
    }
}

function _emscripten_set_gamepaddisconnected_callback(userData, useCapture, callbackfunc) {
    if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
    JSEvents.registerGamepadEventCallback(window, userData, useCapture, callbackfunc, 27, "gamepaddisconnected");
    return 0
}

function _glDrawElementsInstanced(mode, count, type, indices, primcount) {
    GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
}

function _emscripten_set_mouseenter_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 33, "mouseenter");
    return 0
}

function _emscripten_glBindProgramARB() {
    Module["printErr"]("missing function: emscripten_glBindProgramARB");
    abort(-1)
}

function _glGetBooleanv(name_, p) {
    emscriptenWebGLGet(name_, p, "Boolean")
}

function _glDepthFunc(x0) {
    GLctx["depthFunc"](x0)
}

function _emscripten_glCheckFramebufferStatus(x0) {
    return GLctx["checkFramebufferStatus"](x0)
}

function _emscripten_glDeleteProgram(id) {
    if (!id) return;
    var program = GL.programs[id];
    if (!program) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteProgram(program);
    program.name = 0;
    GL.programs[id] = null;
    GL.programInfos[id] = null
}

function _glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, HEAPU8, data, imageSize);
        return
    }
    GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray(data, data + imageSize) : null)
}

function _emscripten_glDisable(x0) {
    GLctx["disable"](x0)
}

function _glPixelStorei(pname, param) {
    if (pname == 3333) {
        GL.packAlignment = param
    } else if (pname == 3317) {
        GL.unpackAlignment = param
    }
    GLctx.pixelStorei(pname, param)
}

function _emscripten_glVertexAttrib3fv(index, v) {
    GLctx.vertexAttrib3f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2])
}

function _glFlush() {
    GLctx["flush"]()
}

function _glClearColor(x0, x1, x2, x3) {
    GLctx["clearColor"](x0, x1, x2, x3)
}

function _emscripten_glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
    program = GL.programs[program];
    var info = GLctx.getActiveAttrib(program, index);
    if (!info) return;
    if (bufSize > 0 && name) {
        var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    } else {
        if (length) HEAP32[length >> 2] = 0
    }
    if (size) HEAP32[size >> 2] = info.size;
    if (type) HEAP32[type >> 2] = info.type
}

function _emscripten_glIsFramebuffer(framebuffer) {
    var fb = GL.framebuffers[framebuffer];
    if (!fb) return 0;
    return GLctx.isFramebuffer(fb)
}

function _emscripten_glLineWidth(x0) {
    GLctx["lineWidth"](x0)
}

function _glClearBufferiv(buffer, drawbuffer, value) {
    GLctx["clearBufferiv"](buffer, drawbuffer, HEAP32, value >> 2)
}

function _emscripten_glGetString(name_) {
    if (GL.stringCache[name_]) return GL.stringCache[name_];
    var ret;
    switch (name_) {
        case 7936:
        case 7937:
        case 37445:
        case 37446:
            ret = allocate(intArrayFromString(GLctx.getParameter(name_)), "i8", ALLOC_NORMAL);
            break;
        case 7938:
            var glVersion = GLctx.getParameter(GLctx.VERSION);
            if (GLctx.canvas.GLctxObject.version >= 2) glVersion = "OpenGL ES 3.0 (" + glVersion + ")";
            else {
                glVersion = "OpenGL ES 2.0 (" + glVersion + ")"
            }
            ret = allocate(intArrayFromString(glVersion), "i8", ALLOC_NORMAL);
            break;
        case 7939:
            var exts = GLctx.getSupportedExtensions();
            var gl_exts = [];
            for (var i in exts) {
                gl_exts.push(exts[i]);
                gl_exts.push("GL_" + exts[i])
            }
            ret = allocate(intArrayFromString(gl_exts.join(" ")), "i8", ALLOC_NORMAL);
            break;
        case 35724:
            var glslVersion = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION);
            var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
            var ver_num = glslVersion.match(ver_re);
            if (ver_num !== null) {
                if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
                glslVersion = "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")"
            }
            ret = allocate(intArrayFromString(glslVersion), "i8", ALLOC_NORMAL);
            break;
        default:
            GL.recordError(1280);
            return 0
    }
    GL.stringCache[name_] = ret;
    return ret
}

function ___syscall192(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var addr = SYSCALLS.get(),
            len = SYSCALLS.get(),
            prot = SYSCALLS.get(),
            flags = SYSCALLS.get(),
            fd = SYSCALLS.get(),
            off = SYSCALLS.get();
        off <<= 12;
        var ptr;
        var allocated = false;
        if (fd === -1) {
            ptr = _memalign(PAGE_SIZE, len);
            if (!ptr) return -ERRNO_CODES.ENOMEM;
            _memset(ptr, 0, len);
            allocated = true
        } else {
            var info = FS.getStream(fd);
            if (!info) return -ERRNO_CODES.EBADF;
            var res = FS.mmap(info, HEAPU8, addr, len, off, prot, flags);
            ptr = res.ptr;
            allocated = res.allocated
        }
        SYSCALLS.mappings[ptr] = {
            malloc: ptr,
            len: len,
            allocated: allocated,
            fd: fd,
            flags: flags
        };
        return ptr
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall195(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr(),
            buf = SYSCALLS.get();
        return SYSCALLS.doStat(FS.stat, path, buf)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _eglDestroySurface(display, surface) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (surface != 62006) {
        EGL.setErrorCode(12301);
        return 1
    }
    if (EGL.currentReadSurface == surface) {
        EGL.currentReadSurface = 0
    }
    if (EGL.currentDrawSurface == surface) {
        EGL.currentDrawSurface = 0
    }
    EGL.setErrorCode(12288);
    return 1
}

function _emscripten_glGetAttribLocation(program, name) {
    program = GL.programs[program];
    name = Pointer_stringify(name);
    return GLctx.getAttribLocation(program, name)
}

function ___syscall3(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            buf = SYSCALLS.get(),
            count = SYSCALLS.get();
        return FS.read(stream, HEAP8, buf, count)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _emscripten_glRotatef() {
    Module["printErr"]("missing function: emscripten_glRotatef");
    abort(-1)
}

function _emscripten_glGetIntegerv(name_, p) {
    emscriptenWebGLGet(name_, p, "Integer")
}

function _emscripten_request_fullscreen(target, deferUntilInEventHandler) {
    var strategy = {};
    strategy.scaleMode = 0;
    strategy.canvasResolutionScaleMode = 0;
    strategy.filteringMode = 0;
    strategy.deferUntilInEventHandler = deferUntilInEventHandler;
    return _emscripten_do_request_fullscreen(target, strategy)
}

function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
    var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
    HEAP32[params >> 2] = result
}

function _glBlendEquationSeparate(x0, x1) {
    GLctx["blendEquationSeparate"](x0, x1)
}

function _glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
    var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
    HEAP32[range >> 2] = result.rangeMin;
    HEAP32[range + 4 >> 2] = result.rangeMax;
    HEAP32[precision >> 2] = result.precision
}

function _emscripten_glClientActiveTexture() {
    Module["printErr"]("missing function: emscripten_glClientActiveTexture");
    abort(-1)
}

function _emscripten_set_focus_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, "focus");
    return 0
}

function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
    return dest
}
Module["_memcpy"] = _memcpy;

function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
    if (maxLength > 0 && infoLog) {
        var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
        if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    } else {
        if (length) HEAP32[length >> 2] = 0
    }
}

function _emscripten_set_mouseup_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup");
    return 0
}

function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) {
    GLctx["stencilOpSeparate"](x0, x1, x2, x3)
}
var GLUT = {
    initTime: null,
    idleFunc: null,
    displayFunc: null,
    keyboardFunc: null,
    keyboardUpFunc: null,
    specialFunc: null,
    specialUpFunc: null,
    reshapeFunc: null,
    motionFunc: null,
    passiveMotionFunc: null,
    mouseFunc: null,
    buttons: 0,
    modifiers: 0,
    initWindowWidth: 256,
    initWindowHeight: 256,
    initDisplayMode: 18,
    windowX: 0,
    windowY: 0,
    windowWidth: 0,
    windowHeight: 0,
    requestedAnimationFrame: false,
    saveModifiers: (function(event) {
        GLUT.modifiers = 0;
        if (event["shiftKey"]) GLUT.modifiers += 1;
        if (event["ctrlKey"]) GLUT.modifiers += 2;
        if (event["altKey"]) GLUT.modifiers += 4
    }),
    onMousemove: (function(event) {
        var lastX = Browser.mouseX;
        var lastY = Browser.mouseY;
        Browser.calculateMouseEvent(event);
        var newX = Browser.mouseX;
        var newY = Browser.mouseY;
        if (newX == lastX && newY == lastY) return;
        if (GLUT.buttons == 0 && event.target == Module["canvas"] && GLUT.passiveMotionFunc) {
            event.preventDefault();
            GLUT.saveModifiers(event);
            Module["dynCall_vii"](GLUT.passiveMotionFunc, lastX, lastY)
        } else if (GLUT.buttons != 0 && GLUT.motionFunc) {
            event.preventDefault();
            GLUT.saveModifiers(event);
            Module["dynCall_vii"](GLUT.motionFunc, lastX, lastY)
        }
    }),
    getSpecialKey: (function(keycode) {
        var key = null;
        switch (keycode) {
            case 8:
                key = 120;
                break;
            case 46:
                key = 111;
                break;
            case 112:
                key = 1;
                break;
            case 113:
                key = 2;
                break;
            case 114:
                key = 3;
                break;
            case 115:
                key = 4;
                break;
            case 116:
                key = 5;
                break;
            case 117:
                key = 6;
                break;
            case 118:
                key = 7;
                break;
            case 119:
                key = 8;
                break;
            case 120:
                key = 9;
                break;
            case 121:
                key = 10;
                break;
            case 122:
                key = 11;
                break;
            case 123:
                key = 12;
                break;
            case 37:
                key = 100;
                break;
            case 38:
                key = 101;
                break;
            case 39:
                key = 102;
                break;
            case 40:
                key = 103;
                break;
            case 33:
                key = 104;
                break;
            case 34:
                key = 105;
                break;
            case 36:
                key = 106;
                break;
            case 35:
                key = 107;
                break;
            case 45:
                key = 108;
                break;
            case 16:
            case 5:
                key = 112;
                break;
            case 6:
                key = 113;
                break;
            case 17:
            case 3:
                key = 114;
                break;
            case 4:
                key = 115;
                break;
            case 18:
            case 2:
                key = 116;
                break;
            case 1:
                key = 117;
                break
        }
        return key
    }),
    getASCIIKey: (function(event) {
        if (event["ctrlKey"] || event["altKey"] || event["metaKey"]) return null;
        var keycode = event["keyCode"];
        if (48 <= keycode && keycode <= 57) return keycode;
        if (65 <= keycode && keycode <= 90) return event["shiftKey"] ? keycode : keycode + 32;
        if (96 <= keycode && keycode <= 105) return keycode - 48;
        if (106 <= keycode && keycode <= 111) return keycode - 106 + 42;
        switch (keycode) {
            case 9:
            case 13:
            case 27:
            case 32:
            case 61:
                return keycode
        }
        var s = event["shiftKey"];
        switch (keycode) {
            case 186:
                return s ? 58 : 59;
            case 187:
                return s ? 43 : 61;
            case 188:
                return s ? 60 : 44;
            case 189:
                return s ? 95 : 45;
            case 190:
                return s ? 62 : 46;
            case 191:
                return s ? 63 : 47;
            case 219:
                return s ? 123 : 91;
            case 220:
                return s ? 124 : 47;
            case 221:
                return s ? 125 : 93;
            case 222:
                return s ? 34 : 39
        }
        return null
    }),
    onKeydown: (function(event) {
        if (GLUT.specialFunc || GLUT.keyboardFunc) {
            var key = GLUT.getSpecialKey(event["keyCode"]);
            if (key !== null) {
                if (GLUT.specialFunc) {
                    event.preventDefault();
                    GLUT.saveModifiers(event);
                    Module["dynCall_viii"](GLUT.specialFunc, key, Browser.mouseX, Browser.mouseY)
                }
            } else {
                key = GLUT.getASCIIKey(event);
                if (key !== null && GLUT.keyboardFunc) {
                    event.preventDefault();
                    GLUT.saveModifiers(event);
                    Module["dynCall_viii"](GLUT.keyboardFunc, key, Browser.mouseX, Browser.mouseY)
                }
            }
        }
    }),
    onKeyup: (function(event) {
        if (GLUT.specialUpFunc || GLUT.keyboardUpFunc) {
            var key = GLUT.getSpecialKey(event["keyCode"]);
            if (key !== null) {
                if (GLUT.specialUpFunc) {
                    event.preventDefault();
                    GLUT.saveModifiers(event);
                    Module["dynCall_viii"](GLUT.specialUpFunc, key, Browser.mouseX, Browser.mouseY)
                }
            } else {
                key = GLUT.getASCIIKey(event);
                if (key !== null && GLUT.keyboardUpFunc) {
                    event.preventDefault();
                    GLUT.saveModifiers(event);
                    Module["dynCall_viii"](GLUT.keyboardUpFunc, key, Browser.mouseX, Browser.mouseY)
                }
            }
        }
    }),
    touchHandler: (function(event) {
        if (event.target != Module["canvas"]) {
            return
        }
        var touches = event.changedTouches,
            main = touches[0],
            type = "";
        switch (event.type) {
            case "touchstart":
                type = "mousedown";
                break;
            case "touchmove":
                type = "mousemove";
                break;
            case "touchend":
                type = "mouseup";
                break;
            default:
                return
        }
        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1, main.screenX, main.screenY, main.clientX, main.clientY, false, false, false, false, 0, null);
        main.target.dispatchEvent(simulatedEvent);
        event.preventDefault()
    }),
    onMouseButtonDown: (function(event) {
        Browser.calculateMouseEvent(event);
        GLUT.buttons |= 1 << event["button"];
        if (event.target == Module["canvas"] && GLUT.mouseFunc) {
            try {
                event.target.setCapture()
            } catch (e) {}
            event.preventDefault();
            GLUT.saveModifiers(event);
            Module["dynCall_viiii"](GLUT.mouseFunc, event["button"], 0, Browser.mouseX, Browser.mouseY)
        }
    }),
    onMouseButtonUp: (function(event) {
        Browser.calculateMouseEvent(event);
        GLUT.buttons &= ~(1 << event["button"]);
        if (GLUT.mouseFunc) {
            event.preventDefault();
            GLUT.saveModifiers(event);
            Module["dynCall_viiii"](GLUT.mouseFunc, event["button"], 1, Browser.mouseX, Browser.mouseY)
        }
    }),
    onMouseWheel: (function(event) {
        Browser.calculateMouseEvent(event);
        var e = window.event || event;
        var delta = -Browser.getMouseWheelDelta(event);
        delta = delta == 0 ? 0 : delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1);
        var button = 3;
        if (delta < 0) {
            button = 4
        }
        if (GLUT.mouseFunc) {
            event.preventDefault();
            GLUT.saveModifiers(event);
            Module["dynCall_viiii"](GLUT.mouseFunc, button, 0, Browser.mouseX, Browser.mouseY)
        }
    }),
    onFullscreenEventChange: (function(event) {
        var width;
        var height;
        if (document["fullscreen"] || document["fullScreen"] || document["mozFullScreen"] || document["webkitIsFullScreen"]) {
            width = screen["width"];
            height = screen["height"]
        } else {
            width = GLUT.windowWidth;
            height = GLUT.windowHeight;
            document.removeEventListener("fullscreenchange", GLUT.onFullscreenEventChange, true);
            document.removeEventListener("mozfullscreenchange", GLUT.onFullscreenEventChange, true);
            document.removeEventListener("webkitfullscreenchange", GLUT.onFullscreenEventChange, true)
        }
        Browser.setCanvasSize(width, height);
        if (GLUT.reshapeFunc) {
            Module["dynCall_vii"](GLUT.reshapeFunc, width, height)
        }
        _glutPostRedisplay()
    }),
    requestFullscreen: (function() {
        Browser.requestFullscreen(false, false)
    }),
    requestFullScreen: (function() {
        Module.printErr("GLUT.requestFullScreen() is deprecated. Please call GLUT.requestFullscreen instead.");
        GLUT.requestFullScreen = (function() {
            return GLUT.requestFullscreen()
        });
        return GLUT.requestFullscreen()
    }),
    exitFullscreen: (function() {
        var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["webkitCancelFullScreen"] || (function() {});
        CFS.apply(document, [])
    }),
    cancelFullScreen: (function() {
        Module.printErr("GLUT.cancelFullScreen() is deprecated. Please call GLUT.exitFullscreen instead.");
        GLUT.cancelFullScreen = (function() {
            return GLUT.exitFullscreen()
        });
        return GLUT.exitFullscreen()
    })
};

function _glutInitDisplayMode(mode) {
    GLUT.initDisplayMode = mode
}

function _glutCreateWindow(name) {
    var contextAttributes = {
        antialias: (GLUT.initDisplayMode & 128) != 0,
        depth: (GLUT.initDisplayMode & 16) != 0,
        stencil: (GLUT.initDisplayMode & 32) != 0,
        alpha: (GLUT.initDisplayMode & 8) != 0
    };
    Module.ctx = Browser.createContext(Module["canvas"], true, true, contextAttributes);
    return Module.ctx ? 1 : 0
}

function _eglCreateContext(display, config, hmm, contextAttribs) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    var glesContextVersion = 1;
    for (;;) {
        var param = HEAP32[contextAttribs >> 2];
        if (param == 12440) {
            glesContextVersion = HEAP32[contextAttribs + 4 >> 2]
        } else if (param == 12344) {
            break
        } else {
            EGL.setErrorCode(12292);
            return 0
        }
        contextAttribs += 8
    }
    if (glesContextVersion != 2) {
        EGL.setErrorCode(12293);
        return 0
    }
    _glutInitDisplayMode(178);
    EGL.windowID = _glutCreateWindow();
    if (EGL.windowID != 0) {
        EGL.setErrorCode(12288);
        return 62004
    } else {
        EGL.setErrorCode(12297);
        return 0
    }
}

function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        if (GLctx.currentPixelPackBufferBinding) {
            GLctx.readPixels(x, y, width, height, format, type, pixels)
        } else {
            GLctx.readPixels(x, y, width, height, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type))
        }
        return
    }
    var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
    if (!pixelData) {
        GL.recordError(1280);
        return
    }
    GLctx.readPixels(x, y, width, height, format, type, pixelData)
}

function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, HEAPU8, data, imageSize);
        return
    }
    GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray(data, data + imageSize) : null)
}

function _emscripten_glGetError() {
    if (Module["precompiledPrograms"]) return 0;
    if (GL.lastError) {
        var error = GL.lastError;
        GL.lastError = 0;
        return error
    } else {
        return GLctx.getError()
    }
}

function _eglBindAPI(api) {
    if (api == 12448) {
        EGL.setErrorCode(12288);
        return 1
    } else {
        EGL.setErrorCode(12300);
        return 0
    }
}

function ___syscall39(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr(),
            mode = SYSCALLS.get();
        return SYSCALLS.doMkdir(path, mode)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall38(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var old_path = SYSCALLS.getStr(),
            new_path = SYSCALLS.getStr();
        FS.rename(old_path, new_path);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _glStencilFuncSeparate(x0, x1, x2, x3) {
    GLctx["stencilFuncSeparate"](x0, x1, x2, x3)
}

function ___syscall33(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr(),
            amode = SYSCALLS.get();
        return SYSCALLS.doAccess(path, amode)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _pthread_cleanup_push(routine, arg) {
    __ATEXIT__.push((function() {
        Module["dynCall_vi"](routine, arg)
    }));
    _pthread_cleanup_push.level = __ATEXIT__.length
}

function _UE_MessageBox(type, message, caption) {
    var text = Pointer_stringify(message);
    if (!type) return confirm(text);
    alert(text);
    return 1
}

function _emscripten_glIsEnabled(x0) {
    return GLctx["isEnabled"](x0)
}

function _alSourceQueueBuffers(source, count, buffers) {
    if (Module["disableAudio"]) return;
    if (!AL.currentContext) {
        return
    }
    var src = AL.currentContext.src[source];
    if (!src) {
        AL.currentContext.err = 40961;
        return
    }
    for (var i = 0; i < count; ++i) {
        var bufferIdx = HEAP32[buffers + i * 4 >> 2];
        if (bufferIdx > AL.currentContext.buf.length) {
            AL.currentContext.err = 40961;
            return
        }
    }
    for (var i = 0; i < count; ++i) {
        var bufferIdx = HEAP32[buffers + i * 4 >> 2];
        var buffer = AL.currentContext.buf[bufferIdx - 1];
        src.queue.push({
            buffer: buffer,
            src: null
        })
    }
    AL.updateSource(src)
}

function _glUniform4iv(location, count, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniform4iv(GL.uniforms[location], HEAP32, value >> 2, count * 4);
        return
    }
    GLctx.uniform4iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 16 >> 2))
}

function _glClearStencil(x0) {
    GLctx["clearStencil"](x0)
}

function _alSourcef(source, param, value) {
    if (!AL.currentContext) {
        return
    }
    var src = AL.currentContext.src[source];
    if (!src) {
        AL.currentContext.err = 40961;
        return
    }
    switch (param) {
        case 4099:
            if (value <= 0) {
                AL.currentContext.err = 40963;
                return
            }
            src.playbackRate = value;
            if (src.state === 4114) {
                var entry = src.queue[src.buffersPlayed];
                if (!entry || !entry.src) return;
                var currentTime = AL.currentContext.ctx.currentTime;
                var oldrate = entry.src.playbackRate.value;
                var offset = currentTime - src.bufferPosition;
                entry.src.duration = (entry.src.duration - offset) * oldrate / src.playbackRate;
                if (entry.src.playbackRate.value != src.playbackRate) entry.src.playbackRate.value = src.playbackRate;
                src.bufferPosition = currentTime;
                for (var k = src.buffersPlayed + 1; k < src.queue.length; k++) {
                    var entry = src.queue[k];
                    if (entry.src) {
                        entry.src.stop();
                        entry.src = null
                    }
                }
                AL.updateSource(src)
            }
            break;
        case 4106:
            if (src.gain.gain.value != value) src.gain.gain.value = value;
            break;
        case 4131:
            src.maxDistance = value;
            break;
        case 4129:
            src.rolloffFactor = value;
            break;
        case 4130:
            src.coneOuterGain = value;
            break;
        case 4097:
            src.coneInnerAngle = value;
            break;
        case 4098:
            src.coneOuterAngle = value;
            break;
        case 4128:
            src.refDistance = value;
            break;
        default:
            AL.currentContext.err = 40962;
            break
    }
}
Module["_memmove"] = _memmove;

function _glGenTextures(n, textures) {
    for (var i = 0; i < n; i++) {
        var texture = GLctx.createTexture();
        if (!texture) {
            GL.recordError(1282);
            while (i < n) HEAP32[textures + i++ * 4 >> 2] = 0;
            return
        }
        var id = GL.getNewId(GL.textures);
        texture.name = id;
        GL.textures[id] = texture;
        HEAP32[textures + i * 4 >> 2] = id
    }
}
var __sigalrm_handler = 0;

function _signal(sig, func) {
    if (sig == 14) {
        __sigalrm_handler = func
    } else {}
    return 0
}

function _emscripten_glVertexAttrib4f(x0, x1, x2, x3, x4) {
    GLctx["vertexAttrib4f"](x0, x1, x2, x3, x4)
}

function ___gxx_personality_v0() {}

function _UE_BrowserWebGLVersion() {
    return Module["WEBGL_VERSION"]
}
var _llvm_pow_f64 = Math_pow;

function _emscripten_glClear(x0) {
    GLctx["clear"](x0)
}

function ___syscall40(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr();
        FS.rmdir(path);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _alGetError() {
    if (!AL.currentContext) {
        return 40964
    } else {
        var err = AL.currentContext.err;
        AL.currentContext.err = 0;
        return err
    }
}

function emscriptenWebGLGetUniform(program, location, params, type) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    var data = GLctx.getUniform(GL.programs[program], GL.uniforms[location]);
    if (typeof data == "number" || typeof data == "boolean") {
        switch (type) {
            case "Integer":
                HEAP32[params >> 2] = data;
                break;
            case "Float":
                HEAPF32[params >> 2] = data;
                break;
            default:
                throw "internal emscriptenWebGLGetUniform() error, bad type: " + type
        }
    } else {
        for (var i = 0; i < data.length; i++) {
            switch (type) {
                case "Integer":
                    HEAP32[params + i >> 2] = data[i];
                    break;
                case "Float":
                    HEAPF32[params + i >> 2] = data[i];
                    break;
                default:
                    throw "internal emscriptenWebGLGetUniform() error, bad type: " + type
            }
        }
    }
}

function _emscripten_glGetUniformfv(program, location, params) {
    emscriptenWebGLGetUniform(program, location, params, "Float")
}

function _emscripten_get_now_is_monotonic() {
    return ENVIRONMENT_IS_NODE || typeof dateNow !== "undefined" || (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && self["performance"] && self["performance"]["now"]
}

function _clock_gettime(clk_id, tp) {
    var now;
    if (clk_id === 0) {
        now = Date.now()
    } else if (clk_id === 1 && _emscripten_get_now_is_monotonic()) {
        now = _emscripten_get_now()
    } else {
        ___setErrNo(ERRNO_CODES.EINVAL);
        return -1
    }
    HEAP32[tp >> 2] = now / 1e3 | 0;
    HEAP32[tp + 4 >> 2] = now % 1e3 * 1e3 * 1e3 | 0;
    return 0
}

function _glDeleteRenderbuffers(n, renderbuffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[renderbuffers + i * 4 >> 2];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue;
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null
    }
}

function _emscripten_glDisableVertexAttribArray(index) {
    GLctx.disableVertexAttribArray(index)
}

function _pthread_mutexattr_init() {}

function _alcOpenDevice(deviceName) {
    if (typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined") {
        return 1
    } else {
        return 0
    }
}

function _glGetProgramiv(program, pname, p) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    if (program >= GL.counter) {
        GL.recordError(1281);
        return
    }
    var ptable = GL.programInfos[program];
    if (!ptable) {
        GL.recordError(1282);
        return
    }
    if (pname == 35716) {
        var log = GLctx.getProgramInfoLog(GL.programs[program]);
        if (log === null) log = "(unknown error)";
        HEAP32[p >> 2] = log.length + 1
    } else if (pname == 35719) {
        HEAP32[p >> 2] = ptable.maxUniformLength
    } else if (pname == 35722) {
        if (ptable.maxAttributeLength == -1) {
            var program = GL.programs[program];
            var numAttribs = GLctx.getProgramParameter(program, GLctx.ACTIVE_ATTRIBUTES);
            ptable.maxAttributeLength = 0;
            for (var i = 0; i < numAttribs; ++i) {
                var activeAttrib = GLctx.getActiveAttrib(program, i);
                ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length + 1)
            }
        }
        HEAP32[p >> 2] = ptable.maxAttributeLength
    } else if (pname == 35381) {
        if (ptable.maxUniformBlockNameLength == -1) {
            var program = GL.programs[program];
            var numBlocks = GLctx.getProgramParameter(program, GLctx.ACTIVE_UNIFORM_BLOCKS);
            ptable.maxUniformBlockNameLength = 0;
            for (var i = 0; i < numBlocks; ++i) {
                var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
                ptable.maxUniformBlockNameLength = Math.max(ptable.maxUniformBlockNameLength, activeBlockName.length + 1)
            }
        }
        HEAP32[p >> 2] = ptable.maxUniformBlockNameLength
    } else {
        HEAP32[p >> 2] = GLctx.getProgramParameter(GL.programs[program], pname)
    }
}

function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
    GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr)
}

function _emscripten_exit_pointerlock() {
    JSEvents.removeDeferredCalls(JSEvents.requestPointerLock);
    if (document.exitPointerLock) {
        document.exitPointerLock()
    } else if (document.msExitPointerLock) {
        document.msExitPointerLock()
    } else if (document.mozExitPointerLock) {
        document.mozExitPointerLock()
    } else if (document.webkitExitPointerLock) {
        document.webkitExitPointerLock()
    } else {
        return -1
    }
    return 0
}

function _emscripten_glBindBuffer(target, buffer) {
    var bufferObj = buffer ? GL.buffers[buffer] : null;
    if (target == 35051) {
        GLctx.currentPixelPackBufferBinding = buffer
    } else if (target == 35052) {
        GLctx.currentPixelUnpackBufferBinding = buffer
    }
    GLctx.bindBuffer(target, bufferObj)
}

function _emscripten_glGetBufferParameteriv(target, value, data) {
    if (!data) {
        GL.recordError(1281);
        return
    }
    HEAP32[data >> 2] = GLctx.getBufferParameter(target, value)
}

function _glBlendEquation(x0) {
    GLctx["blendEquation"](x0)
}

function _glGetUniformLocation(program, name) {
    name = Pointer_stringify(name);
    var arrayOffset = 0;
    if (name.indexOf("]", name.length - 1) !== -1) {
        var ls = name.lastIndexOf("[");
        var arrayIndex = name.slice(ls + 1, -1);
        if (arrayIndex.length > 0) {
            arrayOffset = parseInt(arrayIndex);
            if (arrayOffset < 0) {
                return -1
            }
        }
        name = name.slice(0, ls)
    }
    var ptable = GL.programInfos[program];
    if (!ptable) {
        return -1
    }
    var utable = ptable.uniforms;
    var uniformInfo = utable[name];
    if (uniformInfo && arrayOffset < uniformInfo[0]) {
        return uniformInfo[1] + arrayOffset
    } else {
        return -1
    }
}

function _emscripten_glGetAttachedShaders(program, maxCount, count, shaders) {
    var result = GLctx.getAttachedShaders(GL.programs[program]);
    var len = result.length;
    if (len > maxCount) {
        len = maxCount
    }
    HEAP32[count >> 2] = len;
    for (var i = 0; i < len; ++i) {
        var id = GL.shaders.indexOf(result[i]);
        HEAP32[shaders + i * 4 >> 2] = id
    }
}

function _UE_MakeHTTPDataRequest(ctx, url, verb, payload, payloadsize, headers, async, freeBuffer, onload, onerror, onprogress) {
    var _url = Pointer_stringify(url);
    var _verb = Pointer_stringify(verb);
    var _headers = Pointer_stringify(headers);
    var xhr = new XMLHttpRequest;
    xhr.UE_fetch = {
        verb: _verb,
        url: _url,
        async: !!async,
        postData: null,
        timeout: 2
    };
    if (_verb === "POST") {
        xhr.UE_fetch.postData = Module.HEAP8.subarray(payload, payload + payloadsize)
    }
    xhr.open(_verb, _url, !!async);
    xhr.responseType = "arraybuffer";
    var _headerArray = _headers.split("%");
    for (var headerArrayidx = 0; headerArrayidx < _headerArray.length; headerArrayidx++) {
        var header = _headerArray[headerArrayidx].split(":");
        xhr.setRequestHeader(header[0], header[1].trim())
    }
    xhr.addEventListener("load", (function(e) {
        if (xhr.status === 200 || _url.substr(0, 4).toLowerCase() !== "http") {
            var headers = xhr.getAllResponseHeaders();
            var header_byteArray = (new TextEncoder("utf-8")).encode(headers);
            var header_buffer = _malloc(header_byteArray.length);
            HEAPU8.set(header_byteArray, header_buffer);
            var byteArray = new Uint8Array(xhr.response);
            var buffer = _malloc(byteArray.length);
            HEAPU8.set(byteArray, buffer);
            if (onload) Runtime.dynCall("viiii", onload, [ctx, buffer, byteArray.length, header_buffer]);
            if (freeBuffer) _free(buffer);
            _free(header_buffer)
        } else {
            if (onerror) Runtime.dynCall("viii", onerror, [ctx, xhr.status, xhr.statusText])
        }
    }));
    xhr.addEventListener("error", (function(e) {
        if (xhr.responseURL == "") console.log("ERROR: Cross-Origin Resource Sharing [CORS] check FAILED");
        if (onerror) Runtime.dynCall("viii", onerror, [ctx, xhr.status, xhr.statusText])
    }));
    xhr.addEventListener("progress", (function(e) {
        if (onprogress) Runtime.dynCall("viii", onprogress, [ctx, e.loaded, e.lengthComputable || e.lengthComputable === undefined ? e.total : 0])
    }));
    xhr.addEventListener("timeout", (function(e) {
        if (!this.UE_fetch.timeout) {
            console.log("Fetching " + this.UE_fetch.url + " timed out");
            if (onerror) Runtime.dynCall("viii", onerror, [ctx, xhr.status, xhr.statusText]);
            return
        }
        this.UE_fetch.timeout--;
        xhr.open(this.UE_fetch.verb, this.UE_fetch.url, this.UE_fetch.async);
        xhr.responseType = "arraybuffer";
        xhr.send(xhr.UE_fetch.postData)
    }));
    try {
        if (xhr.channel instanceof Ci.nsIHttpChannel) xhr.channel.redirectionLimit = 0
    } catch (ex) {}
    xhr.send(xhr.UE_fetch.postData)
}

function _emscripten_glFinish() {
    GLctx["finish"]()
}

function _emscripten_glFrontFace(x0) {
    GLctx["frontFace"](x0)
}

function _pthread_cond_wait() {
    return 0
}

function _emscripten_glUniform1iv(location, count, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniform1iv(GL.uniforms[location], HEAP32, value >> 2, count);
        return
    }
    GLctx.uniform1iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 4 >> 2))
}

function _glUniform4fv(location, count, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniform4fv(GL.uniforms[location], HEAPF32, value >> 2, count * 4);
        return
    }
    var view;
    if (4 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        view = GL.miniTempBufferViews[4 * count - 1];
        for (var i = 0; i < 4 * count; i += 4) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2]
        }
    } else {
        view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2)
    }
    GLctx.uniform4fv(GL.uniforms[location], view)
}

function _emscripten_glTexCoordPointer() {
    Module["printErr"]("missing function: emscripten_glTexCoordPointer");
    abort(-1)
}

function _inet_addr(ptr) {
    var addr = __inet_pton4_raw(Pointer_stringify(ptr));
    if (addr === null) {
        return -1
    }
    return addr
}

function __exit(status) {
    Module["exit"](status)
}

function _exit(status) {
    __exit(status)
}

function _glVertexAttribDivisor(index, divisor) {
    GLctx["vertexAttribDivisor"](index, divisor)
}

function _emscripten_set_mousedown_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown");
    return 0
}

function _emscripten_set_keyup_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup");
    return 0
}

function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) {
    GLctx["renderbufferStorage"](x0, x1, x2, x3)
}

function _glCheckFramebufferStatus(x0) {
    return GLctx["checkFramebufferStatus"](x0)
}

function ___syscall15(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr(),
            mode = SYSCALLS.get();
        FS.chmod(path, mode);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall10(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr();
        FS.unlink(path);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _emscripten_glTexParameteriv(target, pname, params) {
    var param = HEAP32[params >> 2];
    GLctx.texParameteri(target, pname, param)
}

function _glBlitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) {
    GLctx["blitFramebuffer"](x0, x1, x2, x3, x4, x5, x6, x7, x8, x9)
}

function _glBindAttribLocation(program, index, name) {
    name = Pointer_stringify(name);
    if (!Module["programs"]) Module["programs"] = {};
    if (!Module["programs"][program]) Module["programs"][program] = {};
    if (!Module["programs"][program]["pendingAttribs"]) Module["programs"][program]["pendingAttribs"] = {};
    Module["programs"][program]["pendingAttribs"][name] = index;
    GLctx.bindAttribLocation(GL.programs[program], index, name)
}

function _emscripten_glShaderBinary() {
    GL.recordError(1280)
}

function _emscripten_glIsProgram(program) {
    var program = GL.programs[program];
    if (!program) return 0;
    return GLctx.isProgram(program)
}

function ___cxa_begin_catch(ptr) {
    var info = EXCEPTIONS.infos[ptr];
    if (info && !info.caught) {
        info.caught = true;
        __ZSt18uncaught_exceptionv.uncaught_exception--
    }
    if (info) info.rethrown = false;
    EXCEPTIONS.caught.push(ptr);
    EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ptr));
    return ptr
}

function _eglInitialize(display, majorVersion, minorVersion) {
    if (display == 62e3) {
        if (majorVersion) {
            HEAP32[majorVersion >> 2] = 1
        }
        if (minorVersion) {
            HEAP32[minorVersion >> 2] = 4
        }
        EGL.defaultDisplayInitialized = true;
        EGL.setErrorCode(12288);
        return 1
    } else {
        EGL.setErrorCode(12296);
        return 0
    }
}

function _emscripten_glBlendColor(x0, x1, x2, x3) {
    GLctx["blendColor"](x0, x1, x2, x3)
}

function _emscripten_glGetShaderiv(shader, pname, p) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    if (pname == 35713) {
        HEAP32[p >> 2] = 1;
        return
    }
    if (pname == 35716) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = "(unknown error)";
        HEAP32[p >> 2] = log.length + 1
    } else {
        HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname)
    }
}

function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, HEAPF32, value >> 2, count * 9);
        return
    }
    var view;
    if (9 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        view = GL.miniTempBufferViews[9 * count - 1];
        for (var i = 0; i < 9 * count; i += 9) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
            view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
            view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
            view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
            view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
            view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2]
        }
    } else {
        view = HEAPF32.subarray(value >> 2, value + count * 36 >> 2)
    }
    GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, view)
}

function _emscripten_glVertexAttrib2f(x0, x1, x2) {
    GLctx["vertexAttrib2f"](x0, x1, x2)
}

function _emscripten_glUniform4fv(location, count, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniform4fv(GL.uniforms[location], HEAPF32, value >> 2, count * 4);
        return
    }
    var view;
    if (4 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        view = GL.miniTempBufferViews[4 * count - 1];
        for (var i = 0; i < 4 * count; i += 4) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2]
        }
    } else {
        view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2)
    }
    GLctx.uniform4fv(GL.uniforms[location], view)
}

function _glBufferSubData(target, offset, size, data) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.bufferSubData(target, offset, HEAPU8, data, size);
        return
    }
    GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size))
}

function _emscripten_glGetUniformiv(program, location, params) {
    emscriptenWebGLGetUniform(program, location, params, "Integer")
}

function _alcDestroyContext(context) {
    clearInterval(AL.contexts[context - 1].interval)
}

function _glUniform4uiv(location, count, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniform4uiv(GL.uniforms[location], HEAPU32, value >> 2, count * 4)
    } else {
        GLctx.uniform4uiv(GL.uniforms[location], HEAPU32.subarray(value >> 2, value + count * 16 >> 2))
    }
}

function _emscripten_glGenFramebuffers(n, ids) {
    for (var i = 0; i < n; ++i) {
        var framebuffer = GLctx.createFramebuffer();
        if (!framebuffer) {
            GL.recordError(1282);
            while (i < n) HEAP32[ids + i++ * 4 >> 2] = 0;
            return
        }
        var id = GL.getNewId(GL.framebuffers);
        framebuffer.name = id;
        GL.framebuffers[id] = framebuffer;
        HEAP32[ids + i * 4 >> 2] = id
    }
}
var _llvm_sqrt_f32 = Math_sqrt;

function _emscripten_glBlendEquationSeparate(x0, x1) {
    GLctx["blendEquationSeparate"](x0, x1)
}

function _eglWaitNative(nativeEngineId) {
    EGL.setErrorCode(12288);
    return 1
}

function _usleep(useconds) {
    var msec = useconds / 1e3;
    if ((ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && self["performance"] && self["performance"]["now"]) {
        var start = self["performance"]["now"]();
        while (self["performance"]["now"]() - start < msec) {}
    } else {
        var start = Date.now();
        while (Date.now() - start < msec) {}
    }
    return 0
}

function _nanosleep(rqtp, rmtp) {
    var seconds = HEAP32[rqtp >> 2];
    var nanoseconds = HEAP32[rqtp + 4 >> 2];
    if (rmtp !== 0) {
        HEAP32[rmtp >> 2] = 0;
        HEAP32[rmtp + 4 >> 2] = 0
    }
    return _usleep(seconds * 1e6 + nanoseconds / 1e3)
}

function _emscripten_glBindTexture(target, texture) {
    GLctx.bindTexture(target, texture ? GL.textures[texture] : null)
}

function _emscripten_glDrawElements(mode, count, type, indices) {
    GLctx.drawElements(mode, count, type, indices)
}

function _emscripten_glDrawRangeElements(mode, start, end, count, type, indices) {
    _emscripten_glDrawElements(mode, count, type, indices);
    GLctx.drawElements(mode, count, type, indices)
}

function _emscripten_glGenTextures(n, textures) {
    for (var i = 0; i < n; i++) {
        var texture = GLctx.createTexture();
        if (!texture) {
            GL.recordError(1282);
            while (i < n) HEAP32[textures + i++ * 4 >> 2] = 0;
            return
        }
        var id = GL.getNewId(GL.textures);
        texture.name = id;
        GL.textures[id] = texture;
        HEAP32[textures + i * 4 >> 2] = id
    }
}

function _emscripten_glVertexAttrib2fv(index, v) {
    GLctx.vertexAttrib2f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2])
}

function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
    program = GL.programs[program];
    var info = GLctx.getActiveUniform(program, index);
    if (!info) return;
    if (bufSize > 0 && name) {
        var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
        if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    } else {
        if (length) HEAP32[length >> 2] = 0
    }
    if (size) HEAP32[size >> 2] = info.size;
    if (type) HEAP32[type >> 2] = info.type
}
Module["_roundf"] = _roundf;

function _emscripten_glDeleteObjectARB() {
    Module["printErr"]("missing function: emscripten_glDeleteObjectARB");
    abort(-1)
}

function _emscripten_set_touchmove_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove");
    return 0
}

function _emscripten_glUniform1f(location, v0) {
    GLctx.uniform1f(GL.uniforms[location], v0)
}

function _alcCreateContext(device, attrList) {
    if (device != 1) {
        return 0
    }
    if (attrList) {
        return 0
    }
    var ctx;
    try {
        ctx = new AudioContext
    } catch (e) {
        try {
            ctx = new webkitAudioContext
        } catch (e) {}
    }
    if (ctx) {
        if (typeof ctx.createGain === "undefined") ctx.createGain = ctx.createGainNode;
        var gain = ctx.createGain();
        gain.connect(ctx.destination);
        ctx.listener._position = [0, 0, 0];
        ctx.listener._velocity = [0, 0, 0];
        ctx.listener._orientation = [0, 0, 0, 0, 0, 0];
        var context = {
            ctx: ctx,
            err: 0,
            src: {},
            buf: [],
            interval: setInterval((function() {
                AL.updateSources(context)
            }), AL.QUEUE_INTERVAL),
            gain: gain
        };
        AL.contexts.push(context);
        return AL.contexts.length
    } else {
        return 0
    }
}

function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
    GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr)
}

function _alcCloseDevice(device) {}

function _glShaderSource(shader, count, string, length) {
    var source = GL.getSource(shader, count, string, length);
    if (GL.currentContext.version >= 2) {
        if (source.indexOf("#version 100") != -1) {
            source = source.replace(/#extension GL_OES_standard_derivatives : enable/g, "");
            source = source.replace(/#extension GL_EXT_shader_texture_lod : enable/g, "");
            var prelude = "";
            if (source.indexOf("gl_FragColor") != -1) {
                prelude += "out mediump vec4 GL_FragColor;\n";
                source = source.replace(/gl_FragColor/g, "GL_FragColor")
            }
            if (source.indexOf("attribute") != -1) {
                source = source.replace(/attribute/g, "in");
                source = source.replace(/varying/g, "out")
            } else {
                source = source.replace(/varying/g, "in")
            }
            source = source.replace(/textureCubeLodEXT/g, "textureCubeLod");
            source = source.replace(/texture2DLodEXT/g, "texture2DLod");
            source = source.replace(/texture2DProjLodEXT/g, "texture2DProjLod");
            source = source.replace(/texture2DGradEXT/g, "texture2DGrad");
            source = source.replace(/texture2DProjGradEXT/g, "texture2DProjGrad");
            source = source.replace(/textureCubeGradEXT/g, "textureCubeGrad");
            source = source.replace(/textureCube/g, "texture");
            source = source.replace(/texture1D/g, "texture");
            source = source.replace(/texture2D/g, "texture");
            source = source.replace(/texture3D/g, "texture");
            source = source.replace(/#version 100/g, "#version 300 es\n" + prelude)
        }
    }
    GL.shaders[shader].source = source;
    if (Module["precompiledPrograms"]) return;
    if (!Module["shaders"]) Module["shaders"] = [];
    var recordedShader = {
        name: shader,
        code: source
    };
    Module["shaders"].push(recordedShader);
    GLctx.shaderSource(GL.shaders[shader], source)
}

function _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    if (GL.currentContext.version >= 2) {
        if (type == 36193) type = 5131
    }
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texSubImage2D(target, level, internalFormat, width, height, border, format, type, pixels)
        } else if (pixels != 0) {
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type))
        } else {
            GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, null)
        }
        return
    }
    var pixelData = null;
    if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
    GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData)
}

function _UE_EngineRegisterCanvasResizeListener(listener) {
    UE_JSlib.UE_CanvasSizeChanged = (function() {
        Runtime.dynCall("v", listener)
    })
}

function _emscripten_glDrawArrays(mode, first, count) {
    GLctx.drawArrays(mode, first, count)
}

function _emscripten_glGenBuffers(n, buffers) {
    for (var i = 0; i < n; i++) {
        var buffer = GLctx.createBuffer();
        if (!buffer) {
            GL.recordError(1282);
            while (i < n) HEAP32[buffers + i++ * 4 >> 2] = 0;
            return
        }
        var id = GL.getNewId(GL.buffers);
        buffer.name = id;
        GL.buffers[id] = buffer;
        HEAP32[buffers + i * 4 >> 2] = id
    }
}

function _emscripten_glClearDepth(x0) {
    GLctx["clearDepth"](x0)
}

function _emscripten_set_keypress_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress");
    return 0
}

function _glutDestroyWindow(name) {
    Module.ctx = Browser.destroyContext(Module["canvas"], true, true);
    return 1
}

function _eglDestroyContext(display, context) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (context != 62004) {
        EGL.setErrorCode(12294);
        return 0
    }
    EGL.setErrorCode(12288);
    return 1
}

function _emscripten_glGetUniformLocation(program, name) {
    name = Pointer_stringify(name);
    var arrayOffset = 0;
    if (name.indexOf("]", name.length - 1) !== -1) {
        var ls = name.lastIndexOf("[");
        var arrayIndex = name.slice(ls + 1, -1);
        if (arrayIndex.length > 0) {
            arrayOffset = parseInt(arrayIndex);
            if (arrayOffset < 0) {
                return -1
            }
        }
        name = name.slice(0, ls)
    }
    var ptable = GL.programInfos[program];
    if (!ptable) {
        return -1
    }
    var utable = ptable.uniforms;
    var uniformInfo = utable[name];
    if (uniformInfo && arrayOffset < uniformInfo[0]) {
        return uniformInfo[1] + arrayOffset
    } else {
        return -1
    }
}

function _glBindBuffer(target, buffer) {
    var bufferObj = buffer ? GL.buffers[buffer] : null;
    if (target == 35051) {
        GLctx.currentPixelPackBufferBinding = buffer
    } else if (target == 35052) {
        GLctx.currentPixelUnpackBufferBinding = buffer
    }
    GLctx.bindBuffer(target, bufferObj)
}

function _pthread_mutexattr_destroy() {}

function _emscripten_glUniform2fv(location, count, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniform2fv(GL.uniforms[location], HEAPF32, value >> 2, count * 2);
        return
    }
    var view;
    if (2 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        view = GL.miniTempBufferViews[2 * count - 1];
        for (var i = 0; i < 2 * count; i += 2) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2]
        }
    } else {
        view = HEAPF32.subarray(value >> 2, value + count * 8 >> 2)
    }
    GLctx.uniform2fv(GL.uniforms[location], view)
}

function ___syscall91(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var addr = SYSCALLS.get(),
            len = SYSCALLS.get();
        var info = SYSCALLS.mappings[addr];
        if (!info) return 0;
        if (len === info.len) {
            var stream = FS.getStream(info.fd);
            SYSCALLS.doMsync(addr, stream, len, info.flags);
            FS.munmap(stream);
            SYSCALLS.mappings[addr] = null;
            if (info.allocated) {
                _free(info.malloc)
            }
        }
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function _emscripten_glVertexAttrib4fv(index, v) {
    GLctx.vertexAttrib4f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2], HEAPF32[v + 12 >> 2])
}

function _emscripten_glScissor(x0, x1, x2, x3) {
    GLctx["scissor"](x0, x1, x2, x3)
}

function _glBufferData(target, size, data, usage) {
    if (!data) {
        GLctx.bufferData(target, size, usage)
    } else {
        if (GL.currentContext.supportsWebGL2EntryPoints) {
            GLctx.bufferData(target, HEAPU8, usage, data, size);
            return
        }
        GLctx.bufferData(target, HEAPU8.subarray(data, data + size), usage)
    }
}

function _emscripten_glLinkProgram(program) {
    if (Module["precompiledPrograms"]) {
        var vs = GL.programs[program].vs.source;
        var fs = GL.programs[program].fs.source;
        for (var i = 0; i < Module["precompiledPrograms"].length; ++i) {
            var p = Module["precompiledPrograms"][i];
            if (vs == p.vs && fs == p.fs) {
                if (GLctx.getParameter(GLctx.CURRENT_PROGRAM) == GL.programs[program]) {
                    GLctx.useProgram(p.program)
                }
                GL.programs[program] = p.program;
                GL.programs[program].isPrelinked = true;
                GL.programInfos[program] = p.programInfos;
                Module["precompiledPrograms"].splice(i, 1);
                return
            }
        }
    } else {
        if (!Module["programs"]) Module["programs"] = {};
        if (!Module["programs"][program]) Module["programs"][program] = {};
        if (!Module["programs"][program]["attribs"]) Module["programs"][program]["attribs"] = {};
        if (!Module["programs"][program]["pendingAttribs"]) Module["programs"][program]["pendingAttribs"] = {};
        var shaders = GLctx.getAttachedShaders(GL.programs[program]);
        Module["programs"][program].vs = shaders && shaders.length >= 1 ? GLctx.getShaderSource(shaders[0]) : "";
        Module["programs"][program].fs = shaders && shaders.length >= 2 ? GLctx.getShaderSource(shaders[1]) : "";
        for (var i in Module["programs"][program]["pendingAttribs"]) Module["programs"][program]["attribs"][i] = Module["programs"][program]["pendingAttribs"][i];
        Module["programs"][program]["pendingAttribs"] = {}
    }
    GLctx.linkProgram(GL.programs[program]);
    GL.programInfos[program] = null;
    GL.populateUniformTable(program)
}

function _pthread_cond_timedwait() {
    return 0
}

function _sched_yield() {
    return 0
}

function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
    if (!params) {
        GL.recordError(1281);
        return
    }
    HEAP32[params >> 2] = GLctx.getRenderbufferParameter(target, pname)
}

function _emscripten_longjmp(env, value) {
    _longjmp(env, value)
}

function _glGenBuffers(n, buffers) {
    for (var i = 0; i < n; i++) {
        var buffer = GLctx.createBuffer();
        if (!buffer) {
            GL.recordError(1282);
            while (i < n) HEAP32[buffers + i++ * 4 >> 2] = 0;
            return
        }
        var id = GL.getNewId(GL.buffers);
        buffer.name = id;
        GL.buffers[id] = buffer;
        HEAP32[buffers + i * 4 >> 2] = id
    }
}

function _UE_LoadGame(name, userIndex, outdataptr, outsizeptr) {
    var _name = Pointer_stringify(name);
    var b64encoded = $.jStorage.get(_name);
    if (b64encoded === null) return false;
    var decodedArray = base64DecToArr(b64encoded);
    var outdata = Module._malloc(decodedArray.length);
    var dest = Module.HEAPU8.subarray(outdata, outdata + decodedArray.length);
    for (var i = 0; i < decodedArray.length; ++i) {
        dest[i] = decodedArray[i]
    }
    Module.HEAP32[outsizeptr >> 2] = decodedArray.length;
    Module.HEAP32[outdataptr >> 2] = outdata;
    return true
}

function _glGetError() {
    if (Module["precompiledPrograms"]) return 0;
    if (GL.lastError) {
        var error = GL.lastError;
        GL.lastError = 0;
        return error
    } else {
        return GLctx.getError()
    }
}

function _emscripten_glDrawBuffers(n, bufs) {
    var bufArray = GL.tempFixedLengthArray[n];
    for (var i = 0; i < n; i++) {
        bufArray[i] = HEAP32[bufs + i * 4 >> 2]
    }
    GLctx["drawBuffers"](bufArray)
}

function _emscripten_glValidateProgram(program) {
    GLctx.validateProgram(GL.programs[program])
}
Module["_pthread_mutex_unlock"] = _pthread_mutex_unlock;
Module["_llvm_bswap_i16"] = _llvm_bswap_i16;

function _emscripten_glBindFramebuffer(target, framebuffer) {
    GLctx.bindFramebuffer(target, framebuffer ? GL.framebuffers[framebuffer] : null)
}

function _emscripten_glEnable(x0) {
    GLctx["enable"](x0)
}

function _emscripten_glBufferSubData(target, offset, size, data) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.bufferSubData(target, offset, HEAPU8, data, size);
        return
    }
    GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size))
}

function _emscripten_set_keydown_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown");
    return 0
}

function _emscripten_glBufferData(target, size, data, usage) {
    if (!data) {
        GLctx.bufferData(target, size, usage)
    } else {
        if (GL.currentContext.supportsWebGL2EntryPoints) {
            GLctx.bufferData(target, HEAPU8, usage, data, size);
            return
        }
        GLctx.bufferData(target, HEAPU8.subarray(data, data + size), usage)
    }
}
Module["_sbrk"] = _sbrk;

function _alcMakeContextCurrent(context) {
    if (context == 0) {
        AL.currentContext = null;
        return 0
    } else {
        AL.currentContext = AL.contexts[context - 1];
        Module["AL"] = AL;
        Module["ALctx"] = AL.currentContext;
        return 1
    }
}

function _emscripten_glDeleteFramebuffers(n, framebuffers) {
    for (var i = 0; i < n; ++i) {
        var id = HEAP32[framebuffers + i * 4 >> 2];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue;
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null
    }
}

function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
    var result = GLctx.getShaderSource(GL.shaders[shader]);
    if (!result) return;
    if (bufSize > 0 && source) {
        var numBytesWrittenExclNull = stringToUTF8(result, source, bufSize);
        if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    } else {
        if (length) HEAP32[length >> 2] = 0
    }
}

function _emscripten_glActiveTexture(unit) {
    GLctx.activeTexture(unit)
}
Module["_llvm_bswap_i32"] = _llvm_bswap_i32;

function _emscripten_set_click_callback(target, userData, useCapture, callbackfunc) {
    JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 4, "click");
    return 0
}

function _emscripten_set_gamepadconnected_callback(userData, useCapture, callbackfunc) {
    if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
    JSEvents.registerGamepadEventCallback(window, userData, useCapture, callbackfunc, 26, "gamepadconnected");
    return 0
}

function _emscripten_glGetFloatv(name_, p) {
    emscriptenWebGLGet(name_, p, "Float")
}
var _strlen = undefined;
Module["_strlen"] = _strlen;

function __reallyNegative(x) {
    return x < 0 || x === 0 && 1 / x === -Infinity
}

function __formatString(format, varargs) {
    assert((varargs & 3) === 0);
    var textIndex = format;
    var argIndex = varargs;

    function getNextArg(type) {
        var ret;
        argIndex = Runtime.prepVararg(argIndex, type);
        if (type === "double") {
            ret = HEAPF64[argIndex >> 3];
            argIndex += 8
        } else if (type == "i64") {
            ret = [HEAP32[argIndex >> 2], HEAP32[argIndex + 4 >> 2]];
            argIndex += 8
        } else {
            assert((argIndex & 3) === 0);
            type = "i32";
            ret = HEAP32[argIndex >> 2];
            argIndex += 4
        }
        return ret
    }
    var ret = [];
    var curr, next, currArg;
    while (1) {
        var startTextIndex = textIndex;
        curr = HEAP8[textIndex >> 0];
        if (curr === 0) break;
        next = HEAP8[textIndex + 1 >> 0];
        if (curr == 37) {
            var flagAlwaysSigned = false;
            var flagLeftAlign = false;
            var flagAlternative = false;
            var flagZeroPad = false;
            var flagPadSign = false;
            flagsLoop: while (1) {
                switch (next) {
                    case 43:
                        flagAlwaysSigned = true;
                        break;
                    case 45:
                        flagLeftAlign = true;
                        break;
                    case 35:
                        flagAlternative = true;
                        break;
                    case 48:
                        if (flagZeroPad) {
                            break flagsLoop
                        } else {
                            flagZeroPad = true;
                            break
                        };
                    case 32:
                        flagPadSign = true;
                        break;
                    default:
                        break flagsLoop
                }
                textIndex++;
                next = HEAP8[textIndex + 1 >> 0]
            }
            var width = 0;
            if (next == 42) {
                width = getNextArg("i32");
                textIndex++;
                next = HEAP8[textIndex + 1 >> 0]
            } else {
                while (next >= 48 && next <= 57) {
                    width = width * 10 + (next - 48);
                    textIndex++;
                    next = HEAP8[textIndex + 1 >> 0]
                }
            }
            var precisionSet = false,
                precision = -1;
            if (next == 46) {
                precision = 0;
                precisionSet = true;
                textIndex++;
                next = HEAP8[textIndex + 1 >> 0];
                if (next == 42) {
                    precision = getNextArg("i32");
                    textIndex++
                } else {
                    while (1) {
                        var precisionChr = HEAP8[textIndex + 1 >> 0];
                        if (precisionChr < 48 || precisionChr > 57) break;
                        precision = precision * 10 + (precisionChr - 48);
                        textIndex++
                    }
                }
                next = HEAP8[textIndex + 1 >> 0]
            }
            if (precision < 0) {
                precision = 6;
                precisionSet = false
            }
            var argSize;
            switch (String.fromCharCode(next)) {
                case "h":
                    var nextNext = HEAP8[textIndex + 2 >> 0];
                    if (nextNext == 104) {
                        textIndex++;
                        argSize = 1
                    } else {
                        argSize = 2
                    }
                    break;
                case "l":
                    var nextNext = HEAP8[textIndex + 2 >> 0];
                    if (nextNext == 108) {
                        textIndex++;
                        argSize = 8
                    } else {
                        argSize = 4
                    }
                    break;
                case "L":
                case "q":
                case "j":
                    argSize = 8;
                    break;
                case "z":
                case "t":
                case "I":
                    argSize = 4;
                    break;
                default:
                    argSize = null
            }
            if (argSize) textIndex++;
            next = HEAP8[textIndex + 1 >> 0];
            switch (String.fromCharCode(next)) {
                case "d":
                case "i":
                case "u":
                case "o":
                case "x":
                case "X":
                case "p":
                    {
                        var signed = next == 100 || next == 105;argSize = argSize || 4;
                        var currArg = getNextArg("i" + argSize * 8);
                        var origArg = currArg;
                        var argText;
                        if (argSize == 8) {
                            currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117)
                        }
                        if (argSize <= 4) {
                            var limit = Math.pow(256, argSize) - 1;
                            currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8)
                        }
                        var currAbsArg = Math.abs(currArg);
                        var prefix = "";
                        if (next == 100 || next == 105) {
                            if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null);
                            else argText = reSign(currArg, 8 * argSize, 1).toString(10)
                        } else if (next == 117) {
                            if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true);
                            else argText = unSign(currArg, 8 * argSize, 1).toString(10);
                            currArg = Math.abs(currArg)
                        } else if (next == 111) {
                            argText = (flagAlternative ? "0" : "") + currAbsArg.toString(8)
                        } else if (next == 120 || next == 88) {
                            prefix = flagAlternative && currArg != 0 ? "0x" : "";
                            if (argSize == 8 && i64Math) {
                                if (origArg[1]) {
                                    argText = (origArg[1] >>> 0).toString(16);
                                    var lower = (origArg[0] >>> 0).toString(16);
                                    while (lower.length < 8) lower = "0" + lower;
                                    argText += lower
                                } else {
                                    argText = (origArg[0] >>> 0).toString(16)
                                }
                            } else if (currArg < 0) {
                                currArg = -currArg;
                                argText = (currAbsArg - 1).toString(16);
                                var buffer = [];
                                for (var i = 0; i < argText.length; i++) {
                                    buffer.push((15 - parseInt(argText[i], 16)).toString(16))
                                }
                                argText = buffer.join("");
                                while (argText.length < argSize * 2) argText = "f" + argText
                            } else {
                                argText = currAbsArg.toString(16)
                            }
                            if (next == 88) {
                                prefix = prefix.toUpperCase();
                                argText = argText.toUpperCase()
                            }
                        } else if (next == 112) {
                            if (currAbsArg === 0) {
                                argText = "(nil)"
                            } else {
                                prefix = "0x";
                                argText = currAbsArg.toString(16)
                            }
                        }
                        if (precisionSet) {
                            while (argText.length < precision) {
                                argText = "0" + argText
                            }
                        }
                        if (currArg >= 0) {
                            if (flagAlwaysSigned) {
                                prefix = "+" + prefix
                            } else if (flagPadSign) {
                                prefix = " " + prefix
                            }
                        }
                        if (argText.charAt(0) == "-") {
                            prefix = "-" + prefix;
                            argText = argText.substr(1)
                        }
                        while (prefix.length + argText.length < width) {
                            if (flagLeftAlign) {
                                argText += " "
                            } else {
                                if (flagZeroPad) {
                                    argText = "0" + argText
                                } else {
                                    prefix = " " + prefix
                                }
                            }
                        }
                        argText = prefix + argText;argText.split("").forEach((function(chr) {
                            ret.push(chr.charCodeAt(0))
                        }));
                        break
                    };
                case "f":
                case "F":
                case "e":
                case "E":
                case "g":
                case "G":
                    {
                        var currArg = getNextArg("double");
                        var argText;
                        if (isNaN(currArg)) {
                            argText = "nan";
                            flagZeroPad = false
                        } else if (!isFinite(currArg)) {
                            argText = (currArg < 0 ? "-" : "") + "inf";
                            flagZeroPad = false
                        } else {
                            var isGeneral = false;
                            var effectivePrecision = Math.min(precision, 20);
                            if (next == 103 || next == 71) {
                                isGeneral = true;
                                precision = precision || 1;
                                var exponent = parseInt(currArg.toExponential(effectivePrecision).split("e")[1], 10);
                                if (precision > exponent && exponent >= -4) {
                                    next = (next == 103 ? "f" : "F").charCodeAt(0);
                                    precision -= exponent + 1
                                } else {
                                    next = (next == 103 ? "e" : "E").charCodeAt(0);
                                    precision--
                                }
                                effectivePrecision = Math.min(precision, 20)
                            }
                            if (next == 101 || next == 69) {
                                argText = currArg.toExponential(effectivePrecision);
                                if (/[eE][-+]\d$/.test(argText)) {
                                    argText = argText.slice(0, -1) + "0" + argText.slice(-1)
                                }
                            } else if (next == 102 || next == 70) {
                                argText = currArg.toFixed(effectivePrecision);
                                if (currArg === 0 && __reallyNegative(currArg)) {
                                    argText = "-" + argText
                                }
                            }
                            var parts = argText.split("e");
                            if (isGeneral && !flagAlternative) {
                                while (parts[0].length > 1 && parts[0].indexOf(".") != -1 && (parts[0].slice(-1) == "0" || parts[0].slice(-1) == ".")) {
                                    parts[0] = parts[0].slice(0, -1)
                                }
                            } else {
                                if (flagAlternative && argText.indexOf(".") == -1) parts[0] += ".";
                                while (precision > effectivePrecision++) parts[0] += "0"
                            }
                            argText = parts[0] + (parts.length > 1 ? "e" + parts[1] : "");
                            if (next == 69) argText = argText.toUpperCase();
                            if (currArg >= 0) {
                                if (flagAlwaysSigned) {
                                    argText = "+" + argText
                                } else if (flagPadSign) {
                                    argText = " " + argText
                                }
                            }
                        }
                        while (argText.length < width) {
                            if (flagLeftAlign) {
                                argText += " "
                            } else {
                                if (flagZeroPad && (argText[0] == "-" || argText[0] == "+")) {
                                    argText = argText[0] + "0" + argText.slice(1)
                                } else {
                                    argText = (flagZeroPad ? "0" : " ") + argText
                                }
                            }
                        }
                        if (next < 97) argText = argText.toUpperCase();argText.split("").forEach((function(chr) {
                            ret.push(chr.charCodeAt(0))
                        }));
                        break
                    };
                case "s":
                    {
                        var arg = getNextArg("i8*");
                        var argLength = arg ? _strlen(arg) : "(null)".length;
                        if (precisionSet) argLength = Math.min(argLength, precision);
                        if (!flagLeftAlign) {
                            while (argLength < width--) {
                                ret.push(32)
                            }
                        }
                        if (arg) {
                            for (var i = 0; i < argLength; i++) {
                                ret.push(HEAPU8[arg++ >> 0])
                            }
                        } else {
                            ret = ret.concat(intArrayFromString("(null)".substr(0, argLength), true))
                        }
                        if (flagLeftAlign) {
                            while (argLength < width--) {
                                ret.push(32)
                            }
                        }
                        break
                    };
                case "c":
                    {
                        if (flagLeftAlign) ret.push(getNextArg("i8"));
                        while (--width > 0) {
                            ret.push(32)
                        }
                        if (!flagLeftAlign) ret.push(getNextArg("i8"));
                        break
                    };
                case "n":
                    {
                        var ptr = getNextArg("i32*");HEAP32[ptr >> 2] = ret.length;
                        break
                    };
                case "%":
                    {
                        ret.push(curr);
                        break
                    };
                default:
                    {
                        for (var i = startTextIndex; i < textIndex + 2; i++) {
                            ret.push(HEAP8[i >> 0])
                        }
                    }
            }
            textIndex += 2
        } else {
            ret.push(curr);
            textIndex += 1
        }
    }
    return ret
}

function __emscripten_traverse_stack(args) {
    if (!args || !args.callee || !args.callee.name) {
        return [null, "", ""]
    }
    var funstr = args.callee.toString();
    var funcname = args.callee.name;
    var str = "(";
    var first = true;
    for (i in args) {
        var a = args[i];
        if (!first) {
            str += ", "
        }
        first = false;
        if (typeof a === "number" || typeof a === "string") {
            str += a
        } else {
            str += "(" + typeof a + ")"
        }
    }
    str += ")";
    var caller = args.callee.caller;
    args = caller ? caller.arguments : [];
    if (first) str = "";
    return [args, funcname, str]
}

function _emscripten_get_callstack_js(flags) {
    var callstack = jsStackTrace();
    var iThisFunc = callstack.lastIndexOf("_emscripten_log");
    var iThisFunc2 = callstack.lastIndexOf("_emscripten_get_callstack");
    var iNextLine = callstack.indexOf("\n", Math.max(iThisFunc, iThisFunc2)) + 1;
    callstack = callstack.slice(iNextLine);
    if (flags & 8 && typeof emscripten_source_map === "undefined") {
        Runtime.warnOnce('Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.');
        flags ^= 8;
        flags |= 16
    }
    var stack_args = null;
    if (flags & 128) {
        var stack_args = __emscripten_traverse_stack(arguments);
        while (stack_args[1].indexOf("_emscripten_") >= 0) stack_args = __emscripten_traverse_stack(stack_args[0])
    }
    lines = callstack.split("\n");
    callstack = "";
    var newFirefoxRe = new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");
    var firefoxRe = new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?");
    var chromeRe = new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");
    for (l in lines) {
        var line = lines[l];
        var jsSymbolName = "";
        var file = "";
        var lineno = 0;
        var column = 0;
        var parts = chromeRe.exec(line);
        if (parts && parts.length == 5) {
            jsSymbolName = parts[1];
            file = parts[2];
            lineno = parts[3];
            column = parts[4]
        } else {
            parts = newFirefoxRe.exec(line);
            if (!parts) parts = firefoxRe.exec(line);
            if (parts && parts.length >= 4) {
                jsSymbolName = parts[1];
                file = parts[2];
                lineno = parts[3];
                column = parts[4] | 0
            } else {
                callstack += line + "\n";
                continue
            }
        }
        var cSymbolName = flags & 32 ? demangle(jsSymbolName) : jsSymbolName;
        if (!cSymbolName) {
            cSymbolName = jsSymbolName
        }
        var haveSourceMap = false;
        if (flags & 8) {
            var orig = emscripten_source_map.originalPositionFor({
                line: lineno,
                column: column
            });
            haveSourceMap = orig && orig.source;
            if (haveSourceMap) {
                if (flags & 64) {
                    orig.source = orig.source.substring(orig.source.replace(/\\/g, "/").lastIndexOf("/") + 1)
                }
                callstack += "    at " + cSymbolName + " (" + orig.source + ":" + orig.line + ":" + orig.column + ")\n"
            }
        }
        if (flags & 16 || !haveSourceMap) {
            if (flags & 64) {
                file = file.substring(file.replace(/\\/g, "/").lastIndexOf("/") + 1)
            }
            callstack += (haveSourceMap ? "     = " + jsSymbolName : "    at " + cSymbolName) + " (" + file + ":" + lineno + ":" + column + ")\n"
        }
        if (flags & 128 && stack_args[0]) {
            if (stack_args[1] == jsSymbolName && stack_args[2].length > 0) {
                callstack = callstack.replace(/\s+$/, "");
                callstack += " with values: " + stack_args[1] + stack_args[2] + "\n"
            }
            stack_args = __emscripten_traverse_stack(stack_args[0])
        }
    }
    callstack = callstack.replace(/\s+$/, "");
    return callstack
}

function _emscripten_log_js(flags, str) {
    if (flags & 24) {
        str = str.replace(/\s+$/, "");
        str += (str.length > 0 ? "\n" : "") + _emscripten_get_callstack_js(flags)
    }
    if (flags & 1) {
        if (flags & 4) {
            console.error(str)
        } else if (flags & 2) {
            console.warn(str)
        } else {
            console.log(str)
        }
    } else if (flags & 6) {
        Module.printErr(str)
    } else {
        Module.print(str)
    }
}

function _emscripten_log(flags, varargs) {
    var format = HEAP32[varargs >> 2];
    varargs += Math.max(Runtime.getNativeFieldSize("i32"), Runtime.getAlignSize("i32", null, true));
    var str = "";
    if (format) {
        var result = __formatString(format, varargs);
        for (var i = 0; i < result.length; ++i) {
            str += String.fromCharCode(result[i])
        }
    }
    _emscripten_log_js(flags, str)
}

function _glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
    if (GL.currentContext.version >= 2) {
        if (format == 6402 && internalFormat == 6402 && type == 5125) {
            internalFormat = 33190
        }
        if (type == 36193) {
            type = 5131;
            if (format == 6408 && internalFormat == 6408) {
                internalFormat = 34842
            }
        }
        if (internalFormat == 34041) {
            internalFormat = 35056
        }
    }
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels)
        } else if (pixels != 0) {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type))
        } else {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, null)
        }
        return
    }
    var pixelData = null;
    if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat);
    GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData)
}

function _emscripten_glUniform3fv(location, count, value) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx.uniform3fv(GL.uniforms[location], HEAPF32, value >> 2, count * 3);
        return
    }
    var view;
    if (3 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        view = GL.miniTempBufferViews[3 * count - 1];
        for (var i = 0; i < 3 * count; i += 3) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2]
        }
    } else {
        view = HEAPF32.subarray(value >> 2, value + count * 12 >> 2)
    }
    GLctx.uniform3fv(GL.uniforms[location], view)
}

function _emscripten_glDrawElementsInstanced(mode, count, type, indices, primcount) {
    GLctx["drawElementsInstanced"](mode, count, type, indices, primcount)
}

function _eglMakeCurrent(display, draw, read, context) {
    if (display != 62e3) {
        EGL.setErrorCode(12296);
        return 0
    }
    if (context != 0 && context != 62004) {
        EGL.setErrorCode(12294);
        return 0
    }
    if (read != 0 && read != 62006 || draw != 0 && draw != 62006) {
        EGL.setErrorCode(12301);
        return 0
    }
    EGL.currentContext = context;
    EGL.currentDrawSurface = draw;
    EGL.currentReadSurface = read;
    EGL.setErrorCode(12288);
    return 1
}

function _pthread_mutexattr_settype() {}

function _pthread_cond_destroy() {
    return 0
}

function _glDeleteBuffers(n, buffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[buffers + i * 4 >> 2];
        var buffer = GL.buffers[id];
        if (!buffer) continue;
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
        if (id == GL.currArrayBuffer) GL.currArrayBuffer = 0;
        if (id == GL.currElementArrayBuffer) GL.currElementArrayBuffer = 0
    }
}

function _emscripten_glCreateProgram() {
    var id = GL.getNewId(GL.programs);
    var program = GLctx.createProgram();
    program.name = id;
    GL.programs[id] = program;
    return id
}

function _pthread_once(ptr, func) {
    if (!_pthread_once.seen) _pthread_once.seen = {};
    if (ptr in _pthread_once.seen) return;
    Module["dynCall_v"](func);
    _pthread_once.seen[ptr] = 1
}

function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, HEAPU8, data, imageSize);
        return
    }
    GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray(data, data + imageSize) : null)
}

function _emscripten_glClearColor(x0, x1, x2, x3) {
    GLctx["clearColor"](x0, x1, x2, x3)
}

function ___unlock() {}

function _glScissor(x0, x1, x2, x3) {
    GLctx["scissor"](x0, x1, x2, x3)
}

function _emscripten_async_wget2(url, file, request, param, arg, onload, onerror, onprogress) {
    Module["noExitRuntime"] = true;
    var _url = Pointer_stringify(url);
    var _file = Pointer_stringify(file);
    _file = PATH.resolve(FS.cwd(), _file);
    var _request = Pointer_stringify(request);
    var _param = Pointer_stringify(param);
    var index = _file.lastIndexOf("/");
    var http = new XMLHttpRequest;
    http.open(_request, _url, true);
    http.responseType = "arraybuffer";
    var handle = Browser.getNextWgetRequestHandle();
    var destinationDirectory = PATH.dirname(_file);
    http.onload = function http_onload(e) {
        if (http.status == 200) {
            try {
                FS.unlink(_file)
            } catch (e) {}
            FS.mkdirTree(destinationDirectory);
            FS.createDataFile(_file.substr(0, index), _file.substr(index + 1), new Uint8Array(http.response), true, true, false);
            if (onload) {
                var stack = Runtime.stackSave();
                Module["dynCall_viii"](onload, handle, arg, allocate(intArrayFromString(_file), "i8", ALLOC_STACK));
                Runtime.stackRestore(stack)
            }
        } else {
            if (onerror) Module["dynCall_viii"](onerror, handle, arg, http.status)
        }
        delete Browser.wgetRequests[handle]
    };
    http.onerror = function http_onerror(e) {
        if (onerror) Module["dynCall_viii"](onerror, handle, arg, http.status);
        delete Browser.wgetRequests[handle]
    };
    http.onprogress = function http_onprogress(e) {
        if (e.lengthComputable || e.lengthComputable === undefined && e.total != 0) {
            var percentComplete = e.loaded / e.total * 100;
            if (onprogress) Module["dynCall_viii"](onprogress, handle, arg, percentComplete)
        }
    };
    http.onabort = function http_onabort(e) {
        delete Browser.wgetRequests[handle]
    };
    try {
        if (http.channel instanceof Ci.nsIHttpChannel) http.channel.redirectionLimit = 0
    } catch (ex) {}
    if (_request == "POST") {
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send(_param)
    } else {
        http.send(null)
    }
    Browser.wgetRequests[handle] = http;
    return handle
}

function _emscripten_glLoadMatrixf() {
    Module["printErr"]("missing function: emscripten_glLoadMatrixf");
    abort(-1)
}

function _malloc(bytes) {
    var ptr = Runtime.dynamicAlloc(bytes + 8);
    return ptr + 8 & 4294967288
}
Module["_malloc"] = _malloc;

function ___cxa_allocate_exception(size) {
    return _malloc(size)
}

function _glDeleteShader(id) {
    if (!id) return;
    var shader = GL.shaders[id];
    if (!shader) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteShader(shader);
    GL.shaders[id] = null
}

function _emscripten_glGetProgramiv(program, pname, p) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    if (program >= GL.counter) {
        GL.recordError(1281);
        return
    }
    var ptable = GL.programInfos[program];
    if (!ptable) {
        GL.recordError(1282);
        return
    }
    if (pname == 35716) {
        var log = GLctx.getProgramInfoLog(GL.programs[program]);
        if (log === null) log = "(unknown error)";
        HEAP32[p >> 2] = log.length + 1
    } else if (pname == 35719) {
        HEAP32[p >> 2] = ptable.maxUniformLength
    } else if (pname == 35722) {
        if (ptable.maxAttributeLength == -1) {
            var program = GL.programs[program];
            var numAttribs = GLctx.getProgramParameter(program, GLctx.ACTIVE_ATTRIBUTES);
            ptable.maxAttributeLength = 0;
            for (var i = 0; i < numAttribs; ++i) {
                var activeAttrib = GLctx.getActiveAttrib(program, i);
                ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length + 1)
            }
        }
        HEAP32[p >> 2] = ptable.maxAttributeLength
    } else if (pname == 35381) {
        if (ptable.maxUniformBlockNameLength == -1) {
            var program = GL.programs[program];
            var numBlocks = GLctx.getProgramParameter(program, GLctx.ACTIVE_UNIFORM_BLOCKS);
            ptable.maxUniformBlockNameLength = 0;
            for (var i = 0; i < numBlocks; ++i) {
                var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
                ptable.maxUniformBlockNameLength = Math.max(ptable.maxUniformBlockNameLength, activeBlockName.length + 1)
            }
        }
        HEAP32[p >> 2] = ptable.maxUniformBlockNameLength
    } else {
        HEAP32[p >> 2] = GLctx.getProgramParameter(GL.programs[program], pname)
    }
}

function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
    var log = GLctx.getProgramInfoLog(GL.programs[program]);
    if (log === null) log = "(unknown error)";
    if (maxLength > 0 && infoLog) {
        var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
        if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
    } else {
        if (length) HEAP32[length >> 2] = 0
    }
}

function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
    if (GL.currentContext.version >= 2) {
        if (format == 6402 && internalFormat == 6402 && type == 5125) {
            internalFormat = 33190
        }
        if (type == 36193) {
            type = 5131;
            if (format == 6408 && internalFormat == 6408) {
                internalFormat = 34842
            }
        }
        if (internalFormat == 34041) {
            internalFormat = 35056
        }
    }
    if (GL.currentContext.supportsWebGL2EntryPoints) {
        if (GLctx.currentPixelUnpackBufferBinding) {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels)
        } else if (pixels != 0) {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, emscriptenWebGLGetHeapForType(type), pixels >> emscriptenWebGLGetShiftForType(type))
        } else {
            GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, null)
        }
        return
    }
    var pixelData = null;
    if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat);
    GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData)
}

function _emscripten_glGenVertexArrays(n, arrays) {
    for (var i = 0; i < n; i++) {
        var vao = GLctx["createVertexArray"]();
        if (!vao) {
            GL.recordError(1282);
            while (i < n) HEAP32[arrays + i++ * 4 >> 2] = 0;
            return
        }
        var id = GL.getNewId(GL.vaos);
        vao.name = id;
        GL.vaos[id] = vao;
        HEAP32[arrays + i * 4 >> 2] = id
    }
}

function _glViewport(x0, x1, x2, x3) {
    GLctx["viewport"](x0, x1, x2, x3)
}

function _emscripten_glFlush() {
    GLctx["flush"]()
}

function _glDepthMask(flag) {
    GLctx.depthMask(!!flag)
}

function _emscripten_glCreateShader(shaderType) {
    var id = GL.getNewId(GL.shaders);
    GL.shaders[id] = Module["precompiledPrograms"] ? {} : GLctx.createShader(shaderType);
    GL.shaders[id].isVertexShader = shaderType == 35633;
    return id;
    GL.shaders[id] = GLctx.createShader(shaderType);
    return id
}

function _getenv(name) {
    if (name === 0) return 0;
    name = Pointer_stringify(name);
    if (!ENV.hasOwnProperty(name)) return 0;
    if (_getenv.ret) _free(_getenv.ret);
    _getenv.ret = allocate(intArrayFromString(ENV[name]), "i8", ALLOC_NORMAL);
    return _getenv.ret
}

function _pthread_cond_init() {
    return 0
}

function _glColorMask(red, green, blue, alpha) {
    GLctx.colorMask(!!red, !!green, !!blue, !!alpha)
}

function _emscripten_glIsShader(shader) {
    var s = GL.shaders[shader];
    if (!s) return 0;
    return GLctx.isShader(s)
}

function _glTexParameteri(x0, x1, x2) {
    GLctx["texParameteri"](x0, x1, x2)
}

function _emscripten_glColorMask(red, green, blue, alpha) {
    GLctx.colorMask(!!red, !!green, !!blue, !!alpha)
}

function _emscripten_glPixelStorei(pname, param) {
    if (pname == 3333) {
        GL.packAlignment = param
    } else if (pname == 3317) {
        GL.unpackAlignment = param
    }
    GLctx.pixelStorei(pname, param)
}

function _pthread_cleanup_pop() {
    assert(_pthread_cleanup_push.level == __ATEXIT__.length, "cannot pop if something else added meanwhile!");
    __ATEXIT__.pop();
    _pthread_cleanup_push.level = __ATEXIT__.length
}

function _emscripten_glDeleteTextures(n, textures) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[textures + i * 4 >> 2];
        var texture = GL.textures[id];
        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null
    }
}

function _eglGetDisplay(nativeDisplayType) {
    EGL.setErrorCode(12288);
    return 62e3
}

function _emscripten_set_canvas_size(width, height) {
    Browser.setCanvasSize(width, height)
}

function _UE_DoesSaveGameExist(name, userIndex) {
    var _name = Pointer_stringify(name);
    var b64encoded = $.jStorage.get(_name);
    return !!b64encoded
}

function _time(ptr) {
    var ret = Date.now() / 1e3 | 0;
    if (ptr) {
        HEAP32[ptr >> 2] = ret
    }
    return ret
}
Module["_pthread_self"] = _pthread_self;

function _emscripten_glGetBooleanv(name_, p) {
    emscriptenWebGLGet(name_, p, "Boolean")
}

function ___syscall221(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            cmd = SYSCALLS.get();
        switch (cmd) {
            case 0:
                {
                    var arg = SYSCALLS.get();
                    if (arg < 0) {
                        return -ERRNO_CODES.EINVAL
                    }
                    var newStream;newStream = FS.open(stream.path, stream.flags, 0, arg);
                    return newStream.fd
                };
            case 1:
            case 2:
                return 0;
            case 3:
                return stream.flags;
            case 4:
                {
                    var arg = SYSCALLS.get();stream.flags |= arg;
                    return 0
                };
            case 12:
            case 12:
                {
                    var arg = SYSCALLS.get();
                    var offset = 0;HEAP16[arg + offset >> 1] = 2;
                    return 0
                };
            case 13:
            case 14:
            case 13:
            case 14:
                return 0;
            case 16:
            case 8:
                return -ERRNO_CODES.EINVAL;
            case 9:
                ___setErrNo(ERRNO_CODES.EINVAL);
                return -1;
            default:
                {
                    return -ERRNO_CODES.EINVAL
                }
        }
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall220(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            dirp = SYSCALLS.get(),
            count = SYSCALLS.get();
        if (!stream.getdents) {
            stream.getdents = FS.readdir(stream.path)
        }
        var pos = 0;
        while (stream.getdents.length > 0 && pos + 268 <= count) {
            var id;
            var type;
            var name = stream.getdents.pop();
            assert(name.length < 256);
            if (name[0] === ".") {
                id = 1;
                type = 4
            } else {
                var child = FS.lookupNode(stream.node, name);
                id = child.id;
                type = FS.isChrdev(child.mode) ? 2 : FS.isDir(child.mode) ? 4 : FS.isLink(child.mode) ? 10 : 8
            }
            HEAP32[dirp + pos >> 2] = id;
            HEAP32[dirp + pos + 4 >> 2] = stream.position;
            HEAP16[dirp + pos + 8 >> 1] = 268;
            HEAP8[dirp + pos + 10 >> 0] = type;
            for (var i = 0; i < name.length; i++) {
                HEAP8[dirp + pos + (11 + i) >> 0] = name.charCodeAt(i)
            }
            HEAP8[dirp + pos + (11 + i) >> 0] = 0;
            pos += 268
        }
        return pos
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}
JSEvents.staticInit();
var GLctx;
GL.init();
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas, vrDevice) {
    Module.printErr("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead.");
    Module["requestFullScreen"] = Module["requestFullscreen"];
    Browser.requestFullScreen(lockPointer, resizeCanvas, vrDevice)
};
Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas, vrDevice) {
    Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice)
};
Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
    Browser.requestAnimationFrame(func)
};
Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
    Browser.setCanvasSize(width, height, noUpdates)
};
Module["pauseMainLoop"] = function Module_pauseMainLoop() {
    Browser.mainLoop.pause()
};
Module["resumeMainLoop"] = function Module_resumeMainLoop() {
    Browser.mainLoop.resume()
};
Module["getUserMedia"] = function Module_getUserMedia() {
    Browser.getUserMedia()
};
Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
    return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes)
};
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function _emscripten_get_now_actual() {
        var t = process["hrtime"]();
        return t[0] * 1e3 + t[1] / 1e6
    }
} else if (typeof dateNow !== "undefined") {
    _emscripten_get_now = dateNow
} else if (typeof self === "object" && self["performance"] && typeof self["performance"]["now"] === "function") {
    _emscripten_get_now = (function() {
        return self["performance"]["now"]()
    })
} else if (typeof performance === "object" && typeof performance["now"] === "function") {
    _emscripten_get_now = (function() {
        return performance["now"]()
    })
} else {
    _emscripten_get_now = Date.now
}
FS.staticInit();
__ATINIT__.unshift((function() {
    if (!Module["noFSInit"] && !FS.init.initialized) FS.init()
}));
__ATMAIN__.push((function() {
    FS.ignorePermissions = false
}));
__ATEXIT__.push((function() {
    FS.quit()
}));
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
__ATINIT__.unshift((function() {
    TTY.init()
}));
__ATEXIT__.push((function() {
    TTY.shutdown()
}));
if (ENVIRONMENT_IS_NODE) {
    var fs = require("fs");
    var NODEJS_PATH = require("path");
    NODEFS.staticInit()
}
___buildEnvironment(ENV);
__ATINIT__.push((function() {
    SOCKFS.root = FS.mount(SOCKFS, {}, null)
}));
DYNAMICTOP_PTR = allocate(1, "i32", ALLOC_STATIC);
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
STACK_MAX = STACK_BASE + TOTAL_STACK;
DYNAMIC_BASE = Runtime.alignMemory(STACK_MAX);
HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
staticSealed = true;
Module["wasmTableSize"] = 143152;
Module["wasmMaxTableSize"] = 143152;

function invoke_iiiiiif(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iiiiiif"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viij(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_viij"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiff(index, a1, a2, a3) {
    try {
        return Module["dynCall_fiff"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fifi(index, a1, a2, a3) {
    try {
        return Module["dynCall_fifi"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viffif(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viffif"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iiiiiii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_jiii(index, a1, a2, a3) {
    try {
        return Module["dynCall_jiii"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiij(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iiiiiij"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vifiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        Module["dynCall_vifiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiffifi(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_viiffifi"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iidf(index, a1, a2, a3) {
    try {
        return Module["dynCall_iidf"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
    try {
        Module["dynCall_viiiiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vif(index, a1, a2) {
    try {
        Module["dynCall_vif"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iidi(index, a1, a2, a3) {
    try {
        return Module["dynCall_iidi"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iifiiifiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14) {
    try {
        return Module["dynCall_iifiiifiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_jiji(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_jiji"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iifff(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iifff"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiifiiiif(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    try {
        return Module["dynCall_iiiiifiiiif"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiiiif(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        Module["dynCall_viiiiiiif"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiiffii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        return Module["dynCall_iiiiiiffii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiifii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iiiiifii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiiffi(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        Module["dynCall_viiiiiffi"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viifiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_viifiiii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiidi(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iiiidi"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_jij(index, a1, a2, a3) {
    try {
        return Module["dynCall_jij"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiifiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_iiiiifiii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiffi(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iiffi"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_jii(index, a1, a2) {
    try {
        return Module["dynCall_jii"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
    try {
        return Module["dynCall_iiiiiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iidiii(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iidiii"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fif(index, a1, a2) {
    try {
        return Module["dynCall_fif"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viifiii(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viifiii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fij(index, a1, a2, a3) {
    try {
        return Module["dynCall_fij"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fii(index, a1, a2) {
    try {
        return Module["dynCall_fii"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiiff(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_viiiiiff"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viffdd(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viffdd"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiddii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iiiiddii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_di(index, a1) {
    try {
        return Module["dynCall_di"](index, a1)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viff(index, a1, a2, a3) {
    try {
        Module["dynCall_viff"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iifiiiiij(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        return Module["dynCall_iifiiiiij"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiifiii(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iiifiii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vijjjii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        Module["dynCall_vijjjii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiif(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viiiif"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viijj(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viijj"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viffff(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viffff"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiifiif(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_viiifiif"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iidfi(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iidfi"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiji(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viiji"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_didd(index, a1, a2, a3) {
    try {
        return Module["dynCall_didd"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiffi(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viiffi"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_dii(index, a1, a2) {
    try {
        return Module["dynCall_dii"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_did(index, a1, a2) {
    try {
        return Module["dynCall_did"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiiiiiif(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_fiiiiiif"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iifii(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iifii"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiifiifi(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iiifiifi"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiii(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iiiii"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iidii(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iidii"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiij(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iiiij"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vdd(index, a1, a2) {
    try {
        Module["dynCall_vdd"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_jiijjiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        return Module["dynCall_jiijjiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viif(index, a1, a2, a3) {
    try {
        Module["dynCall_viif"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiif(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iiiif"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vffff(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_vffff"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viifiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        Module["dynCall_viifiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vdddddd(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_vdddddd"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiji(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iiiji"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viidf(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_viidf"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiifii(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viiifii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viijijj(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        Module["dynCall_viijijj"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiiijiijiijii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
    try {
        return Module["dynCall_fiiijiijiijii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiffiiiffffi(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
    try {
        Module["dynCall_viiffiiiffffi"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiiiiiifiifif(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
    try {
        return Module["dynCall_fiiiiiifiifif"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiffii(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viiffii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        return Module["dynCall_iiiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vidiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_vidiiiii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iifffffii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_iifffffii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiffi(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_fiffi"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiifii(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iiifii"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiiiiiiiifii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14) {
    try {
        Module["dynCall_viiiiiiiiiiifii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viffiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        Module["dynCall_viffiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiifiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        Module["dynCall_viiifiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiif(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viiiiif"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viffi(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_viffi"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiifiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_iiiifiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vifi(index, a1, a2, a3) {
    try {
        Module["dynCall_vifi"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiifiiif(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        Module["dynCall_viiiifiiif"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vifff(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_vifff"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viiiiii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiidi(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viiidi"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viii(index, a1, a2, a3) {
    try {
        Module["dynCall_viii"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14) {
    try {
        Module["dynCall_viiiiiiiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiii(index, a1, a2, a3) {
    try {
        return Module["dynCall_fiii"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iifiii(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iifiii"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiif(index, a1, a2, a3) {
    try {
        return Module["dynCall_fiif"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_v(index) {
    try {
        Module["dynCall_v"](index)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vidi(index, a1, a2, a3) {
    try {
        Module["dynCall_vidi"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiffffffii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    try {
        Module["dynCall_viiffffffii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_diid(index, a1, a2, a3) {
    try {
        return Module["dynCall_diid"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_ji(index, a1) {
    try {
        return Module["dynCall_ji"](index, a1)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiffiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        return Module["dynCall_iiffiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    try {
        Module["dynCall_viiiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vifffiii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_vifffiii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiffiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
    try {
        return Module["dynCall_iiiiffiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_diii(index, a1, a2, a3) {
    try {
        return Module["dynCall_diii"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiddii(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iiiddii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_fiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vifiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        Module["dynCall_vifiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiffi(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iiiffi"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiiii(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_fiiii"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iiiiii"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiifiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        return Module["dynCall_iiiiiifiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiifii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_viiiifii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiffffiifii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
    try {
        return Module["dynCall_iiiffffiifii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vijii(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_vijii"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiffi(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iiiiffi"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viffii(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viffii"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiij(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viiij"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiifiif(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        return Module["dynCall_iiiiiifiif"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiif(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iiiiif"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiifiif(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        Module["dynCall_viiiifiif"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiijji(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iiijji"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiffffffffiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14) {
    try {
        Module["dynCall_viiffffffffiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_jiijjjiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
    try {
        return Module["dynCall_jiijjjiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vid(index, a1, a2) {
    try {
        Module["dynCall_vid"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiidi(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iiidi"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vij(index, a1, a2, a3) {
    try {
        Module["dynCall_vij"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiffii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_iiiiiffii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vii(index, a1, a2) {
    try {
        Module["dynCall_vii"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiid(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viiiid"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vijji(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_vijji"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiifiii(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_fiifiii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiffiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iiffiiii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iifiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    try {
        return Module["dynCall_iifiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vff(index, a1, a2) {
    try {
        Module["dynCall_vff"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viifii(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viifii"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fi(index, a1) {
    try {
        return Module["dynCall_fi"](index, a1)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiii(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viiiii"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_jiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_jiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vf(index, a1) {
    try {
        Module["dynCall_vf"](index, a1)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiidii(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iiiidii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiffffi(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_iiiiffffi"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiiifi(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_iiiiiiifi"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        Module["dynCall_viiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vifiii(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_vifiii"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiiiiiifiiiif(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
    try {
        return Module["dynCall_fiiiiiifiiiif"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiij(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viiiij"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iijjji(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_iijjji"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiifiiiiif(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
    try {
        Module["dynCall_viiiifiiiiif"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13) {
    try {
        Module["dynCall_viiiiiiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vifiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    try {
        Module["dynCall_vifiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiifi(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iiiiifi"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fifiii(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_fifiii"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viji(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_viji"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iid(index, a1, a2) {
    try {
        return Module["dynCall_iid"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iif(index, a1, a2) {
    try {
        return Module["dynCall_iif"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vifiiii(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_vifiiii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_viiiiiii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vifii(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_vifii"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        Module["dynCall_viiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iii(index, a1, a2) {
    try {
        return Module["dynCall_iii"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iijjiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_iijjiii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iij(index, a1, a2, a3) {
    try {
        return Module["dynCall_iij"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiifii(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iiiifii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_f(index) {
    try {
        return Module["dynCall_f"](index)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_jiiii(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_jiiii"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiifi(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iiiiiifi"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_i(index) {
    try {
        return Module["dynCall_i"](index)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiffii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iiiiffii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viififi(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viififi"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iijiii(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iijiii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiifi(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viiiifi"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iijiiii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iijiiii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viid(index, a1, a2, a3) {
    try {
        Module["dynCall_viid"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiji(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iiji"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iijj(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iijj"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fifii(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_fifii"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiifi(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iiiifi"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vd(index, a1) {
    try {
        Module["dynCall_vd"](index, a1)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viifi(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_viifi"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiifi(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_fiifi"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vi(index, a1) {
    try {
        Module["dynCall_vi"](index, a1)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiff(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viiiff"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    try {
        return Module["dynCall_iiiiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_ii(index, a1) {
    try {
        return Module["dynCall_ii"](index, a1)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiff(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iiiff"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiifif(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viiifif"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iijji(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iijji"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiifiiiiif(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
    try {
        return Module["dynCall_iiiiifiiiiif"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiff(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_viiff"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiiiffi(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_viiiiffi"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iifi(index, a1, a2, a3) {
    try {
        return Module["dynCall_iifi"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vidii(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_vidii"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiif(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_viiif"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vidiiii(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_vidiiii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiffii(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iiiffii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiifi(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iiifi"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiii(index, a1, a2, a3) {
    try {
        return Module["dynCall_iiii"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iidiiii(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iidiiii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiij(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_iiij"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viifff(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viifff"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiiifiif(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    try {
        return Module["dynCall_iiiiiiifiif"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vifiiifiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14) {
    try {
        Module["dynCall_vifiiifiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vifiifi(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_vifiifi"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiif(index, a1, a2, a3) {
    try {
        return Module["dynCall_iiif"](index, a1, a2, a3)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viffiii(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viffiii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiiiiiifi(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_fiiiiiifi"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_jiiiiii(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_jiiiiii"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_fiiiiifi(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_fiiiiifi"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiifi(index, a1, a2, a3, a4, a5) {
    try {
        Module["dynCall_viiifi"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viffffff(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_viffffff"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) {
    try {
        return Module["dynCall_iiiiiiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiifiii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iiiifiii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiifiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
    try {
        return Module["dynCall_iiiifiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iijii(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iijii"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viifiifi(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_viifiifi"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viffffffffffffiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17) {
    try {
        Module["dynCall_viffffffffffffiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_vfi(index, a1, a2) {
    try {
        Module["dynCall_vfi"](index, a1, a2)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iififi(index, a1, a2, a3, a4, a5) {
    try {
        return Module["dynCall_iififi"](index, a1, a2, a3, a4, a5)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiidii(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        return Module["dynCall_iiiiidii"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_jiij(index, a1, a2, a3, a4) {
    try {
        return Module["dynCall_jiij"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viifiiff(index, a1, a2, a3, a4, a5, a6, a7) {
    try {
        Module["dynCall_viifiiff"](index, a1, a2, a3, a4, a5, a6, a7)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiffffiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
    try {
        Module["dynCall_viiffffiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiffffi(index, a1, a2, a3, a4, a5, a6) {
    try {
        return Module["dynCall_iiffffi"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiiiif(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_iiiiiiiif"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
    try {
        return Module["dynCall_iiiiiiiii"](index, a1, a2, a3, a4, a5, a6, a7, a8)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viiii(index, a1, a2, a3, a4) {
    try {
        Module["dynCall_viiii"](index, a1, a2, a3, a4)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}

function invoke_viffffi(index, a1, a2, a3, a4, a5, a6) {
    try {
        Module["dynCall_viffffi"](index, a1, a2, a3, a4, a5, a6)
    } catch (e) {
        if (typeof e !== "number" && e !== "longjmp") throw e;
        Module["setThrew"](1, 0)
    }
}
Module.asmGlobalArg = {
    "Math": Math,
    "Int8Array": Int8Array,
    "Int16Array": Int16Array,
    "Int32Array": Int32Array,
    "Uint8Array": Uint8Array,
    "Uint16Array": Uint16Array,
    "Uint32Array": Uint32Array,
    "Float32Array": Float32Array,
    "Float64Array": Float64Array,
    "NaN": NaN,
    "Infinity": Infinity,
    "byteLength": byteLength
};
Module.asmLibraryArg = {
    "abort": abort,
    "assert": assert,
    "enlargeMemory": enlargeMemory,
    "getTotalMemory": getTotalMemory,
    "abortOnCannotGrowMemory": abortOnCannotGrowMemory,
    "invoke_iiiiiif": invoke_iiiiiif,
    "invoke_viij": invoke_viij,
    "invoke_fiff": invoke_fiff,
    "invoke_fifi": invoke_fifi,
    "invoke_viffif": invoke_viffif,
    "invoke_iiiiiii": invoke_iiiiiii,
    "invoke_jiii": invoke_jiii,
    "invoke_iiiiiij": invoke_iiiiiij,
    "invoke_vifiiiiii": invoke_vifiiiiii,
    "invoke_viiffifi": invoke_viiffifi,
    "invoke_iidf": invoke_iidf,
    "invoke_viiiiiiiiiii": invoke_viiiiiiiiiii,
    "invoke_vif": invoke_vif,
    "invoke_iidi": invoke_iidi,
    "invoke_iifiiifiiiiiiii": invoke_iifiiifiiiiiiii,
    "invoke_jiji": invoke_jiji,
    "invoke_iifff": invoke_iifff,
    "invoke_iiiiifiiiif": invoke_iiiiifiiiif,
    "invoke_viiiiiiif": invoke_viiiiiiif,
    "invoke_iiiiiiffii": invoke_iiiiiiffii,
    "invoke_iiiiifii": invoke_iiiiifii,
    "invoke_viiiiiffi": invoke_viiiiiffi,
    "invoke_viifiiii": invoke_viifiiii,
    "invoke_iiiidi": invoke_iiiidi,
    "invoke_jij": invoke_jij,
    "invoke_iiiiifiii": invoke_iiiiifiii,
    "invoke_iiffi": invoke_iiffi,
    "invoke_jii": invoke_jii,
    "invoke_iiiiiiiiiiii": invoke_iiiiiiiiiiii,
    "invoke_iidiii": invoke_iidiii,
    "invoke_fif": invoke_fif,
    "invoke_viifiii": invoke_viifiii,
    "invoke_fij": invoke_fij,
    "invoke_fii": invoke_fii,
    "invoke_viiiiiff": invoke_viiiiiff,
    "invoke_viffdd": invoke_viffdd,
    "invoke_iiiiddii": invoke_iiiiddii,
    "invoke_di": invoke_di,
    "invoke_viff": invoke_viff,
    "invoke_iifiiiiij": invoke_iifiiiiij,
    "invoke_iiifiii": invoke_iiifiii,
    "invoke_vijjjii": invoke_vijjjii,
    "invoke_viiiif": invoke_viiiif,
    "invoke_viijj": invoke_viijj,
    "invoke_viffff": invoke_viffff,
    "invoke_viiifiif": invoke_viiifiif,
    "invoke_iidfi": invoke_iidfi,
    "invoke_viiji": invoke_viiji,
    "invoke_didd": invoke_didd,
    "invoke_viiffi": invoke_viiffi,
    "invoke_dii": invoke_dii,
    "invoke_did": invoke_did,
    "invoke_fiiiiiif": invoke_fiiiiiif,
    "invoke_iifii": invoke_iifii,
    "invoke_iiifiifi": invoke_iiifiifi,
    "invoke_iiiii": invoke_iiiii,
    "invoke_iidii": invoke_iidii,
    "invoke_iiiij": invoke_iiiij,
    "invoke_vdd": invoke_vdd,
    "invoke_jiijjiii": invoke_jiijjiii,
    "invoke_viif": invoke_viif,
    "invoke_iiiif": invoke_iiiif,
    "invoke_iiiiiiii": invoke_iiiiiiii,
    "invoke_vffff": invoke_vffff,
    "invoke_viifiiiii": invoke_viifiiiii,
    "invoke_vdddddd": invoke_vdddddd,
    "invoke_iiiji": invoke_iiiji,
    "invoke_viidf": invoke_viidf,
    "invoke_viiifii": invoke_viiifii,
    "invoke_viijijj": invoke_viijijj,
    "invoke_fiiijiijiijii": invoke_fiiijiijiijii,
    "invoke_viiffiiiffffi": invoke_viiffiiiffffi,
    "invoke_fiiiiiifiifif": invoke_fiiiiiifiifif,
    "invoke_viiffii": invoke_viiffii,
    "invoke_iiiiiiiiii": invoke_iiiiiiiiii,
    "invoke_vidiiiii": invoke_vidiiiii,
    "invoke_iifffffii": invoke_iifffffii,
    "invoke_fiffi": invoke_fiffi,
    "invoke_iiifii": invoke_iiifii,
    "invoke_viiiiiiiiiiifii": invoke_viiiiiiiiiiifii,
    "invoke_viffiiiii": invoke_viffiiiii,
    "invoke_viiifiiiii": invoke_viiifiiiii,
    "invoke_viiiiif": invoke_viiiiif,
    "invoke_viffi": invoke_viffi,
    "invoke_iiiifiiii": invoke_iiiifiiii,
    "invoke_vifi": invoke_vifi,
    "invoke_viiiifiiif": invoke_viiiifiiif,
    "invoke_vifff": invoke_vifff,
    "invoke_viiiiii": invoke_viiiiii,
    "invoke_viiidi": invoke_viiidi,
    "invoke_viii": invoke_viii,
    "invoke_viiiiiiiiiiiiii": invoke_viiiiiiiiiiiiii,
    "invoke_fiii": invoke_fiii,
    "invoke_iifiii": invoke_iifiii,
    "invoke_fiif": invoke_fiif,
    "invoke_v": invoke_v,
    "invoke_vidi": invoke_vidi,
    "invoke_viiffffffii": invoke_viiffffffii,
    "invoke_diid": invoke_diid,
    "invoke_ji": invoke_ji,
    "invoke_iiffiiiiii": invoke_iiffiiiiii,
    "invoke_viiiiiiiiii": invoke_viiiiiiiiii,
    "invoke_vifffiii": invoke_vifffiii,
    "invoke_iiiiffiiiiiii": invoke_iiiiffiiiiiii,
    "invoke_diii": invoke_diii,
    "invoke_iiiddii": invoke_iiiddii,
    "invoke_fiiiiiiii": invoke_fiiiiiiii,
    "invoke_vifiiiiiii": invoke_vifiiiiiii,
    "invoke_iiiffi": invoke_iiiffi,
    "invoke_fiiii": invoke_fiiii,
    "invoke_iiiiii": invoke_iiiiii,
    "invoke_iiiiiifiii": invoke_iiiiiifiii,
    "invoke_viiiifii": invoke_viiiifii,
    "invoke_iiiffffiifii": invoke_iiiffffiifii,
    "invoke_vijii": invoke_vijii,
    "invoke_iiiiffi": invoke_iiiiffi,
    "invoke_viffii": invoke_viffii,
    "invoke_viiij": invoke_viiij,
    "invoke_iiiiiifiif": invoke_iiiiiifiif,
    "invoke_iiiiif": invoke_iiiiif,
    "invoke_viiiifiif": invoke_viiiifiif,
    "invoke_iiijji": invoke_iiijji,
    "invoke_viiffffffffiiii": invoke_viiffffffffiiii,
    "invoke_jiijjjiiii": invoke_jiijjjiiii,
    "invoke_vid": invoke_vid,
    "invoke_iiidi": invoke_iiidi,
    "invoke_vij": invoke_vij,
    "invoke_iiiiiffii": invoke_iiiiiffii,
    "invoke_vii": invoke_vii,
    "invoke_viiiid": invoke_viiiid,
    "invoke_vijji": invoke_vijji,
    "invoke_fiifiii": invoke_fiifiii,
    "invoke_iiffiiii": invoke_iiffiiii,
    "invoke_iifiiiiiiii": invoke_iifiiiiiiii,
    "invoke_vff": invoke_vff,
    "invoke_viifii": invoke_viifii,
    "invoke_fi": invoke_fi,
    "invoke_viiiii": invoke_viiiii,
    "invoke_jiiiiiiii": invoke_jiiiiiiii,
    "invoke_vf": invoke_vf,
    "invoke_iiiidii": invoke_iiiidii,
    "invoke_iiiiffffi": invoke_iiiiffffi,
    "invoke_iiiiiiifi": invoke_iiiiiiifi,
    "invoke_viiiiiiii": invoke_viiiiiiii,
    "invoke_vifiii": invoke_vifiii,
    "invoke_fiiiiiifiiiif": invoke_fiiiiiifiiiif,
    "invoke_viiiij": invoke_viiiij,
    "invoke_iijjji": invoke_iijjji,
    "invoke_viiiifiiiiif": invoke_viiiifiiiiif,
    "invoke_viiiiiiiiiiiii": invoke_viiiiiiiiiiiii,
    "invoke_vifiiiiiiii": invoke_vifiiiiiiii,
    "invoke_iiiiifi": invoke_iiiiifi,
    "invoke_fifiii": invoke_fifiii,
    "invoke_viji": invoke_viji,
    "invoke_iid": invoke_iid,
    "invoke_iif": invoke_iif,
    "invoke_vifiiii": invoke_vifiiii,
    "invoke_viiiiiii": invoke_viiiiiii,
    "invoke_vifii": invoke_vifii,
    "invoke_viiiiiiiii": invoke_viiiiiiiii,
    "invoke_iii": invoke_iii,
    "invoke_iijjiii": invoke_iijjiii,
    "invoke_iij": invoke_iij,
    "invoke_iiiifii": invoke_iiiifii,
    "invoke_f": invoke_f,
    "invoke_jiiii": invoke_jiiii,
    "invoke_iiiiiifi": invoke_iiiiiifi,
    "invoke_i": invoke_i,
    "invoke_iiiiffii": invoke_iiiiffii,
    "invoke_viififi": invoke_viififi,
    "invoke_iijiii": invoke_iijiii,
    "invoke_viiiifi": invoke_viiiifi,
    "invoke_iijiiii": invoke_iijiiii,
    "invoke_viid": invoke_viid,
    "invoke_iiji": invoke_iiji,
    "invoke_iijj": invoke_iijj,
    "invoke_fifii": invoke_fifii,
    "invoke_iiiifi": invoke_iiiifi,
    "invoke_vd": invoke_vd,
    "invoke_viifi": invoke_viifi,
    "invoke_fiifi": invoke_fiifi,
    "invoke_vi": invoke_vi,
    "invoke_viiiff": invoke_viiiff,
    "invoke_iiiiiiiiiii": invoke_iiiiiiiiiii,
    "invoke_ii": invoke_ii,
    "invoke_iiiff": invoke_iiiff,
    "invoke_viiifif": invoke_viiifif,
    "invoke_iijji": invoke_iijji,
    "invoke_iiiiifiiiiif": invoke_iiiiifiiiiif,
    "invoke_viiff": invoke_viiff,
    "invoke_viiiiffi": invoke_viiiiffi,
    "invoke_iifi": invoke_iifi,
    "invoke_vidii": invoke_vidii,
    "invoke_viiif": invoke_viiif,
    "invoke_vidiiii": invoke_vidiiii,
    "invoke_iiiffii": invoke_iiiffii,
    "invoke_iiifi": invoke_iiifi,
    "invoke_iiii": invoke_iiii,
    "invoke_iidiiii": invoke_iidiiii,
    "invoke_iiij": invoke_iiij,
    "invoke_viifff": invoke_viifff,
    "invoke_iiiiiiifiif": invoke_iiiiiiifiif,
    "invoke_vifiiifiiiiiiii": invoke_vifiiifiiiiiiii,
    "invoke_vifiifi": invoke_vifiifi,
    "invoke_iiif": invoke_iiif,
    "invoke_viffiii": invoke_viffiii,
    "invoke_fiiiiiifi": invoke_fiiiiiifi,
    "invoke_jiiiiii": invoke_jiiiiii,
    "invoke_fiiiiifi": invoke_fiiiiifi,
    "invoke_viiifi": invoke_viiifi,
    "invoke_viffffff": invoke_viffffff,
    "invoke_iiiiiiiiiiiii": invoke_iiiiiiiiiiiii,
    "invoke_iiiifiii": invoke_iiiifiii,
    "invoke_iiiifiiiii": invoke_iiiifiiiii,
    "invoke_iijii": invoke_iijii,
    "invoke_viifiifi": invoke_viifiifi,
    "invoke_viffffffffffffiiii": invoke_viffffffffffffiiii,
    "invoke_vfi": invoke_vfi,
    "invoke_iififi": invoke_iififi,
    "invoke_iiiiidii": invoke_iiiiidii,
    "invoke_jiij": invoke_jiij,
    "invoke_viifiiff": invoke_viifiiff,
    "invoke_viiffffiiii": invoke_viiffffiiii,
    "invoke_iiffffi": invoke_iiffffi,
    "invoke_iiiiiiiif": invoke_iiiiiiiif,
    "invoke_iiiiiiiii": invoke_iiiiiiiii,
    "invoke_viiii": invoke_viiii,
    "invoke_viffffi": invoke_viffffi,
    "_emscripten_glGetTexParameterfv": _emscripten_glGetTexParameterfv,
    "_glClearStencil": _glClearStencil,
    "__inet_ntop6_raw": __inet_ntop6_raw,
    "___syscall220": ___syscall220,
    "_emscripten_glBlendFuncSeparate": _emscripten_glBlendFuncSeparate,
    "_emscripten_glGetIntegerv": _emscripten_glGetIntegerv,
    "_llvm_cttz_i32": _llvm_cttz_i32,
    "_emscripten_glDepthFunc": _emscripten_glDepthFunc,
    "_glDisableVertexAttribArray": _glDisableVertexAttribArray,
    "_emscripten_memcpy_big": _emscripten_memcpy_big,
    "_glStencilFunc": _glStencilFunc,
    "_emscripten_glUniform1f": _emscripten_glUniform1f,
    "emscriptenWebGLComputeImageSize": emscriptenWebGLComputeImageSize,
    "___syscall221": ___syscall221,
    "_emscripten_glUniform1i": _emscripten_glUniform1i,
    "_emscripten_glIsProgram": _emscripten_glIsProgram,
    "_glFramebufferRenderbuffer": _glFramebufferRenderbuffer,
    "_gmtime_r": _gmtime_r,
    "_emscripten_glTexParameteriv": _emscripten_glTexParameteriv,
    "_UE_GetCurrentCultureName": _UE_GetCurrentCultureName,
    "___syscall140": ___syscall140,
    "_alSourcePause": _alSourcePause,
    "___syscall142": ___syscall142,
    "___syscall145": ___syscall145,
    "___syscall146": ___syscall146,
    "_emscripten_glAttachShader": _emscripten_glAttachShader,
    "_emscripten_get_now_is_monotonic": _emscripten_get_now_is_monotonic,
    "_alcCreateContext": _alcCreateContext,
    "_emscripten_glTexParameterfv": _emscripten_glTexParameterfv,
    "__inet_ntop4_raw": __inet_ntop4_raw,
    "_emscripten_glUniformMatrix2fv": _emscripten_glUniformMatrix2fv,
    "_emscripten_glDrawArraysInstanced": _emscripten_glDrawArraysInstanced,
    "_glClearBufferiv": _glClearBufferiv,
    "_glDepthMask": _glDepthMask,
    "_alcMakeContextCurrent": _alcMakeContextCurrent,
    "_glClearBufferfi": _glClearBufferfi,
    "_emscripten_glVertexAttrib2fv": _emscripten_glVertexAttrib2fv,
    "_glViewport": _glViewport,
    "_alSourcef": _alSourcef,
    "_glClearBufferfv": _glClearBufferfv,
    "_emscripten_glFlush": _emscripten_glFlush,
    "_alSourcei": _alSourcei,
    "_alGenBuffers": _alGenBuffers,
    "_nanosleep": _nanosleep,
    "___syscall91": ___syscall91,
    "_pthread_once": _pthread_once,
    "_pthread_mutexattr_setprotocol": _pthread_mutexattr_setprotocol,
    "_dlopen": _dlopen,
    "_glDrawArraysInstanced": _glDrawArraysInstanced,
    "_eglWaitClient": _eglWaitClient,
    "_glAttachShader": _glAttachShader,
    "_emscripten_glTexCoordPointer": _emscripten_glTexCoordPointer,
    "_emscripten_set_blur_callback": _emscripten_set_blur_callback,
    "_emscripten_glReadPixels": _emscripten_glReadPixels,
    "_emscripten_glStencilFuncSeparate": _emscripten_glStencilFuncSeparate,
    "_emscripten_glVertexAttrib3f": _emscripten_glVertexAttrib3f,
    "_dlerror": _dlerror,
    "_glCullFace": _glCullFace,
    "_emscripten_get_gamepad_status": _emscripten_get_gamepad_status,
    "_sched_yield": _sched_yield,
    "_inet_addr": _inet_addr,
    "_alcProcessContext": _alcProcessContext,
    "_glCompressedTexImage2D": _glCompressedTexImage2D,
    "_emscripten_glUniform1iv": _emscripten_glUniform1iv,
    "emscriptenWebGLGetUniform": emscriptenWebGLGetUniform,
    "_glClearColor": _glClearColor,
    "_emscripten_glGetBufferParameteriv": _emscripten_glGetBufferParameteriv,
    "_emscripten_set_gamepadconnected_callback": _emscripten_set_gamepadconnected_callback,
    "_glDrawArrays": _glDrawArrays,
    "_glGetError": _glGetError,
    "_emscripten_glDepthRange": _emscripten_glDepthRange,
    "_glActiveTexture": _glActiveTexture,
    "_emscripten_asm_const_iii": _emscripten_asm_const_iii,
    "_eglMakeCurrent": _eglMakeCurrent,
    "_emscripten_glCopyTexImage2D": _emscripten_glCopyTexImage2D,
    "_emscripten_glFramebufferTexture2D": _emscripten_glFramebufferTexture2D,
    "_glEnableVertexAttribArray": _glEnableVertexAttribArray,
    "_pthread_cond_timedwait": _pthread_cond_timedwait,
    "_alDistanceModel": _alDistanceModel,
    "_glVertexAttrib4fv": _glVertexAttrib4fv,
    "_glDeleteBuffers": _glDeleteBuffers,
    "_localtime": _localtime,
    "_glCompressedTexSubImage2D": _glCompressedTexSubImage2D,
    "_emscripten_glRenderbufferStorage": _emscripten_glRenderbufferStorage,
    "_emscripten_set_keydown_callback": _emscripten_set_keydown_callback,
    "_emscripten_glVertexPointer": _emscripten_glVertexPointer,
    "__read_sockaddr": __read_sockaddr,
    "_eglInitialize": _eglInitialize,
    "_glLinkProgram": _glLinkProgram,
    "_emscripten_glGetUniformfv": _emscripten_glGetUniformfv,
    "_emscripten_glStencilOp": _emscripten_glStencilOp,
    "_emscripten_glBlendEquation": _emscripten_glBlendEquation,
    "_emscripten_glVertexAttrib1fv": _emscripten_glVertexAttrib1fv,
    "_emscripten_glBufferSubData": _emscripten_glBufferSubData,
    "_emscripten_glGetProgramInfoLog": _emscripten_glGetProgramInfoLog,
    "_emscripten_glUniform4fv": _emscripten_glUniform4fv,
    "___cxa_throw": ___cxa_throw,
    "_emscripten_glUniform2fv": _emscripten_glUniform2fv,
    "_emscripten_glBindBuffer": _emscripten_glBindBuffer,
    "_emscripten_glGetFloatv": _emscripten_glGetFloatv,
    "_pthread_mutex_init": _pthread_mutex_init,
    "_glBlendEquationSeparate": _glBlendEquationSeparate,
    "_glTexSubImage2D": _glTexSubImage2D,
    "_glUseProgram": _glUseProgram,
    "_eglGetDisplay": _eglGetDisplay,
    "_emscripten_glCullFace": _emscripten_glCullFace,
    "_emscripten_glStencilMaskSeparate": _emscripten_glStencilMaskSeparate,
    "_emscripten_glUniform3fv": _emscripten_glUniform3fv,
    "_emscripten_asm_const_ii": _emscripten_asm_const_ii,
    "_glBindBuffer": _glBindBuffer,
    "_alSource3f": _alSource3f,
    "_emscripten_glDisableVertexAttribArray": _emscripten_glDisableVertexAttribArray,
    "_eglBindAPI": _eglBindAPI,
    "_glPolygonOffset": _glPolygonOffset,
    "_eglCreateContext": _eglCreateContext,
    "_emscripten_set_touchstart_callback": _emscripten_set_touchstart_callback,
    "_emscripten_glGetBooleanv": _emscripten_glGetBooleanv,
    "_glGetShaderPrecisionFormat": _glGetShaderPrecisionFormat,
    "_emscripten_glVertexAttribDivisor": _emscripten_glVertexAttribDivisor,
    "_glDrawElementsInstanced": _glDrawElementsInstanced,
    "_emscripten_glDeleteObjectARB": _emscripten_glDeleteObjectARB,
    "_UE_LoadGame": _UE_LoadGame,
    "_emscripten_glGetShaderPrecisionFormat": _emscripten_glGetShaderPrecisionFormat,
    "__write_sockaddr": __write_sockaddr,
    "_emscripten_request_fullscreen_strategy": _emscripten_request_fullscreen_strategy,
    "_llvm_sqrt_f32": _llvm_sqrt_f32,
    "_emscripten_glIsEnabled": _emscripten_glIsEnabled,
    "_emscripten_glStencilOpSeparate": _emscripten_glStencilOpSeparate,
    "_emscripten_glGetActiveAttrib": _emscripten_glGetActiveAttrib,
    "_emscripten_set_click_callback": _emscripten_set_click_callback,
    "_emscripten_asm_const_iiiii": _emscripten_asm_const_iiiii,
    "___syscall122": ___syscall122,
    "_emscripten_get_callstack_js": _emscripten_get_callstack_js,
    "___cxa_find_matching_catch": ___cxa_find_matching_catch,
    "_emscripten_glClear": _emscripten_glClear,
    "_glDrawElements": _glDrawElements,
    "_glBufferSubData": _glBufferSubData,
    "_emscripten_glValidateProgram": _emscripten_glValidateProgram,
    "_UE_MakeHTTPDataRequest": _UE_MakeHTTPDataRequest,
    "_emscripten_glUniform4iv": _emscripten_glUniform4iv,
    "___setErrNo": ___setErrNo,
    "_eglSwapBuffers": _eglSwapBuffers,
    "_glStencilOpSeparate": _glStencilOpSeparate,
    "_emscripten_glVertexAttrib2f": _emscripten_glVertexAttrib2f,
    "___resumeException": ___resumeException,
    "_emscripten_log_js": _emscripten_log_js,
    "_mktime": _mktime,
    "_emscripten_glGetError": _emscripten_glGetError,
    "_gethostbyaddr": _gethostbyaddr,
    "_emscripten_glStencilMask": _emscripten_glStencilMask,
    "_glGenTextures": _glGenTextures,
    "_glGetIntegerv": _glGetIntegerv,
    "_eglCreateWindowSurface": _eglCreateWindowSurface,
    "_emscripten_glClearStencil": _emscripten_glClearStencil,
    "emscriptenWebGLGet": emscriptenWebGLGet,
    "_emscripten_get_device_pixel_ratio": _emscripten_get_device_pixel_ratio,
    "_emscripten_set_mouseup_callback": _emscripten_set_mouseup_callback,
    "_emscripten_glFinish": _emscripten_glFinish,
    "_emscripten_glClearDepth": _emscripten_glClearDepth,
    "_emscripten_glUniform1fv": _emscripten_glUniform1fv,
    "_glBindFramebuffer": _glBindFramebuffer,
    "_glGenFramebuffers": _glGenFramebuffers,
    "_emscripten_set_resize_callback": _emscripten_set_resize_callback,
    "_emscripten_glUniform4i": _emscripten_glUniform4i,
    "_llvm_pow_f64": _llvm_pow_f64,
    "__emscripten_sample_gamepad_data": __emscripten_sample_gamepad_data,
    "_glDeleteFramebuffers": _glDeleteFramebuffers,
    "_emscripten_glUniform4f": _emscripten_glUniform4f,
    "_glCheckFramebufferStatus": _glCheckFramebufferStatus,
    "_dlclose": _dlclose,
    "_emscripten_glBlendFunc": _emscripten_glBlendFunc,
    "_glBlendFuncSeparate": _glBlendFuncSeparate,
    "___syscall192": ___syscall192,
    "_localtime_r": _localtime_r,
    "_glBindTexture": _glBindTexture,
    "_alcDestroyContext": _alcDestroyContext,
    "_emscripten_glGetVertexAttribiv": _emscripten_glGetVertexAttribiv,
    "_glReadPixels": _glReadPixels,
    "_emscripten_glUniformMatrix3fv": _emscripten_glUniformMatrix3fv,
    "___syscall33": ___syscall33,
    "__setLetterbox": __setLetterbox,
    "___syscall39": ___syscall39,
    "___syscall38": ___syscall38,
    "_alcGetString": _alcGetString,
    "_emscripten_glGetObjectParameterivARB": _emscripten_glGetObjectParameterivARB,
    "_emscripten_glGetUniformiv": _emscripten_glGetUniformiv,
    "_glGetProgramiv": _glGetProgramiv,
    "_glScissor": _glScissor,
    "_emscripten_glClearColor": _emscripten_glClearColor,
    "_eglDestroySurface": _eglDestroySurface,
    "_sigaction": _sigaction,
    "_emscripten_set_mousemove_callback": _emscripten_set_mousemove_callback,
    "_glBlitFramebuffer": _glBlitFramebuffer,
    "_glDepthRangef": _glDepthRangef,
    "_emscripten_glDeleteTextures": _emscripten_glDeleteTextures,
    "_eglDestroyContext": _eglDestroyContext,
    "_emscripten_exit_fullscreen": _emscripten_exit_fullscreen,
    "_emscripten_get_element_css_size": _emscripten_get_element_css_size,
    "_glUniform4fv": _glUniform4fv,
    "_emscripten_glStencilFunc": _emscripten_glStencilFunc,
    "__exit": __exit,
    "_glBindAttribLocation": _glBindAttribLocation,
    "_emscripten_glColorMask": _emscripten_glColorMask,
    "_glVertexAttribDivisor": _glVertexAttribDivisor,
    "_eglGetConfigAttrib": _eglGetConfigAttrib,
    "_emscripten_enter_soft_fullscreen": _emscripten_enter_soft_fullscreen,
    "_emscripten_glBindTexture": _emscripten_glBindTexture,
    "_emscripten_glGenRenderbuffers": _emscripten_glGenRenderbuffers,
    "_glFramebufferTexture2D": _glFramebufferTexture2D,
    "_glUniform4iv": _glUniform4iv,
    "_emscripten_set_main_loop": _emscripten_set_main_loop,
    "_alGenSources": _alGenSources,
    "_emscripten_glIsShader": _emscripten_glIsShader,
    "_emscripten_asm_const_iiii": _emscripten_asm_const_iiii,
    "_alcOpenDevice": _alcOpenDevice,
    "_emscripten_glCompressedTexImage2D": _emscripten_glCompressedTexImage2D,
    "_glDisable": _glDisable,
    "_emscripten_glGetInfoLogARB": _emscripten_glGetInfoLogARB,
    "_emscripten_longjmp": _emscripten_longjmp,
    "__formatString": __formatString,
    "_glStencilFuncSeparate": _glStencilFuncSeparate,
    "__softFullscreenResizeWebGLRenderTarget": __softFullscreenResizeWebGLRenderTarget,
    "_emscripten_glReleaseShaderCompiler": _emscripten_glReleaseShaderCompiler,
    "_dlsym": _dlsym,
    "_emscripten_glFrontFace": _emscripten_glFrontFace,
    "_glDeleteProgram": _glDeleteProgram,
    "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv,
    "_glBlendEquation": _glBlendEquation,
    "_emscripten_glUseProgram": _emscripten_glUseProgram,
    "_glCreateProgram": _glCreateProgram,
    "_clock_gettime": _clock_gettime,
    "_emscripten_set_touchmove_callback": _emscripten_set_touchmove_callback,
    "_glBlendFunc": _glBlendFunc,
    "_emscripten_glUniform3iv": _emscripten_glUniform3iv,
    "_glCreateShader": _glCreateShader,
    "_utime": _utime,
    "_emscripten_glLineWidth": _emscripten_glLineWidth,
    "_pthread_mutexattr_settype": _pthread_mutexattr_settype,
    "_glGenBuffers": _glGenBuffers,
    "_glShaderSource": _glShaderSource,
    "_emscripten_glScissor": _emscripten_glScissor,
    "_pthread_cleanup_push": _pthread_cleanup_push,
    "_emscripten_set_element_css_size": _emscripten_set_element_css_size,
    "_glGetBooleanv": _glGetBooleanv,
    "_alSourcePlay": _alSourcePlay,
    "_glPixelStorei": _glPixelStorei,
    "_emscripten_glIsBuffer": _emscripten_glIsBuffer,
    "_emscripten_glVertexAttrib1f": _emscripten_glVertexAttrib1f,
    "_glVertexAttribPointer": _glVertexAttribPointer,
    "_emscripten_glCompressedTexSubImage2D": _emscripten_glCompressedTexSubImage2D,
    "_UE_MessageBox": _UE_MessageBox,
    "_emscripten_glGetAttachedShaders": _emscripten_glGetAttachedShaders,
    "_emscripten_glGenTextures": _emscripten_glGenTextures,
    "_glBindRenderbuffer": _glBindRenderbuffer,
    "_pthread_cond_init": _pthread_cond_init,
    "_alGetSourcei": _alGetSourcei,
    "_gmtime": _gmtime,
    "_alSourceQueueBuffers": _alSourceQueueBuffers,
    "_emscripten_glGetTexParameteriv": _emscripten_glGetTexParameteriv,
    "_glDeleteTextures": _glDeleteTextures,
    "_emscripten_set_mousedown_callback": _emscripten_set_mousedown_callback,
    "_emscripten_glClientActiveTexture": _emscripten_glClientActiveTexture,
    "_emscripten_glCheckFramebufferStatus": _emscripten_glCheckFramebufferStatus,
    "_eglWaitGL": _eglWaitGL,
    "_emscripten_glUniform3f": _emscripten_glUniform3f,
    "_emscripten_glUniform3i": _emscripten_glUniform3i,
    "_glDrawBuffers": _glDrawBuffers,
    "_emscripten_glDeleteShader": _emscripten_glDeleteShader,
    "_glEnable": _glEnable,
    "_alDeleteSources": _alDeleteSources,
    "_emscripten_glGetUniformLocation": _emscripten_glGetUniformLocation,
    "_emscripten_glEnableVertexAttribArray": _emscripten_glEnableVertexAttribArray,
    "_alGetError": _alGetError,
    "_emscripten_get_now": _emscripten_get_now,
    "__registerRestoreOldStyle": __registerRestoreOldStyle,
    "_glUniform4uiv": _glUniform4uiv,
    "_emscripten_request_fullscreen": _emscripten_request_fullscreen,
    "emscriptenWebGLGetTexPixelData": emscriptenWebGLGetTexPixelData,
    "_gettimeofday": _gettimeofday,
    "_eglWaitNative": _eglWaitNative,
    "_emscripten_set_pointerlockchange_callback": _emscripten_set_pointerlockchange_callback,
    "_glGetString": _glGetString,
    "_emscripten_async_wget2": _emscripten_async_wget2,
    "_eglChooseConfig": _eglChooseConfig,
    "_emscripten_glDrawElements": _emscripten_glDrawElements,
    "_emscripten_get_num_gamepads": _emscripten_get_num_gamepads,
    "___buildEnvironment": ___buildEnvironment,
    "emscriptenWebGLGetShiftForType": emscriptenWebGLGetShiftForType,
    "_glClearDepthf": _glClearDepthf,
    "_tzset": _tzset,
    "_emscripten_glGetAttribLocation": _emscripten_glGetAttribLocation,
    "_emscripten_glDisable": _emscripten_glDisable,
    "_emscripten_glDeleteRenderbuffers": _emscripten_glDeleteRenderbuffers,
    "_emscripten_glDrawElementsInstanced": _emscripten_glDrawElementsInstanced,
    "_emscripten_glVertexAttrib4f": _emscripten_glVertexAttrib4f,
    "_emscripten_glPixelStorei": _emscripten_glPixelStorei,
    "_llvm_fabs_f32": _llvm_fabs_f32,
    "_getenv": _getenv,
    "_emscripten_set_gamepaddisconnected_callback": _emscripten_set_gamepaddisconnected_callback,
    "_gethostbyname": _gethostbyname,
    "_alcCloseDevice": _alcCloseDevice,
    "_emscripten_glFramebufferRenderbuffer": _emscripten_glFramebufferRenderbuffer,
    "_glBufferData": _glBufferData,
    "_emscripten_glRotatef": _emscripten_glRotatef,
    "_emscripten_glGetShaderiv": _emscripten_glGetShaderiv,
    "___cxa_pure_virtual": ___cxa_pure_virtual,
    "_emscripten_glUniformMatrix4fv": _emscripten_glUniformMatrix4fv,
    "_emscripten_glGetPointerv": _emscripten_glGetPointerv,
    "_pthread_cond_wait": _pthread_cond_wait,
    "_emscripten_glIsRenderbuffer": _emscripten_glIsRenderbuffer,
    "_emscripten_request_pointerlock": _emscripten_request_pointerlock,
    "___syscall40": ___syscall40,
    "_emscripten_set_touchcancel_callback": _emscripten_set_touchcancel_callback,
    "__inet_pton6_raw": __inet_pton6_raw,
    "_glDeleteRenderbuffers": _glDeleteRenderbuffers,
    "_emscripten_set_focus_callback": _emscripten_set_focus_callback,
    "_pthread_mutexattr_destroy": _pthread_mutexattr_destroy,
    "_emscripten_glGetVertexAttribfv": _emscripten_glGetVertexAttribfv,
    "__reallyNegative": __reallyNegative,
    "_emscripten_glVertexAttrib3fv": _emscripten_glVertexAttrib3fv,
    "_glGetUniformLocation": _glGetUniformLocation,
    "_emscripten_glCompileShader": _emscripten_glCompileShader,
    "_glClear": _glClear,
    "emscriptenWebGLGetHeapForType": emscriptenWebGLGetHeapForType,
    "_emscripten_glLinkProgram": _emscripten_glLinkProgram,
    "_alDeleteBuffers": _alDeleteBuffers,
    "_UE_EngineRegisterCanvasResizeListener": _UE_EngineRegisterCanvasResizeListener,
    "_emscripten_get_pointerlock_status": _emscripten_get_pointerlock_status,
    "_emscripten_glDrawRangeElements": _emscripten_glDrawRangeElements,
    "___unlock": ___unlock,
    "_emscripten_glDeleteFramebuffers": _emscripten_glDeleteFramebuffers,
    "_glColorMask": _glColorMask,
    "_emscripten_glGenBuffers": _emscripten_glGenBuffers,
    "_emscripten_glCreateProgram": _emscripten_glCreateProgram,
    "_glTexParameteri": _glTexParameteri,
    "_emscripten_glDetachShader": _emscripten_glDetachShader,
    "_emscripten_glEnableClientState": _emscripten_glEnableClientState,
    "_emscripten_do_request_fullscreen": _emscripten_do_request_fullscreen,
    "_emscripten_set_mouseleave_callback": _emscripten_set_mouseleave_callback,
    "_emscripten_set_fullscreenchange_callback": _emscripten_set_fullscreenchange_callback,
    "_emscripten_glVertexAttribPointer": _emscripten_glVertexAttribPointer,
    "_emscripten_set_keyup_callback": _emscripten_set_keyup_callback,
    "_alBufferData": _alBufferData,
    "_emscripten_glDrawArrays": _emscripten_glDrawArrays,
    "_emscripten_glPolygonOffset": _emscripten_glPolygonOffset,
    "_longjmp": _longjmp,
    "_emscripten_glBlendColor": _emscripten_glBlendColor,
    "_signal": _signal,
    "_emscripten_set_main_loop_timing": _emscripten_set_main_loop_timing,
    "___cxa_begin_catch": ___cxa_begin_catch,
    "_emscripten_glGetProgramiv": _emscripten_glGetProgramiv,
    "_emscripten_glSampleCoverage": _emscripten_glSampleCoverage,
    "_glStencilOp": _glStencilOp,
    "_emscripten_glGetShaderSource": _emscripten_glGetShaderSource,
    "__emscripten_traverse_stack": __emscripten_traverse_stack,
    "_emscripten_glTexImage2D": _emscripten_glTexImage2D,
    "_glRenderbufferStorage": _glRenderbufferStorage,
    "_emscripten_get_canvas_size": _emscripten_get_canvas_size,
    "_emscripten_glBlendEquationSeparate": _emscripten_glBlendEquationSeparate,
    "_emscripten_glGetString": _emscripten_glGetString,
    "_emscripten_glIsFramebuffer": _emscripten_glIsFramebuffer,
    "_getaddrinfo": _getaddrinfo,
    "_emscripten_glBindProgramARB": _emscripten_glBindProgramARB,
    "_glutCreateWindow": _glutCreateWindow,
    "_emscripten_glUniform2i": _emscripten_glUniform2i,
    "_emscripten_glUniform2f": _emscripten_glUniform2f,
    "_alSourcefv": _alSourcefv,
    "__restoreHiddenElements": __restoreHiddenElements,
    "_emscripten_glTexParameterf": _emscripten_glTexParameterf,
    "_emscripten_glTexParameteri": _emscripten_glTexParameteri,
    "_glutInitDisplayMode": _glutInitDisplayMode,
    "_emscripten_glGenVertexArrays": _emscripten_glGenVertexArrays,
    "_pthread_cond_destroy": _pthread_cond_destroy,
    "_emscripten_set_visibilitychange_callback": _emscripten_set_visibilitychange_callback,
    "_eglGetProcAddress": _eglGetProcAddress,
    "_emscripten_glBindAttribLocation": _emscripten_glBindAttribLocation,
    "_llvm_pow_f32": _llvm_pow_f32,
    "_glDepthFunc": _glDepthFunc,
    "___cxa_allocate_exception": ___cxa_allocate_exception,
    "_emscripten_set_canvas_size": _emscripten_set_canvas_size,
    "_emscripten_glTexSubImage2D": _emscripten_glTexSubImage2D,
    "_emscripten_asm_const_v": _emscripten_asm_const_v,
    "_emscripten_glClearDepthf": _emscripten_glClearDepthf,
    "_emscripten_set_mouseenter_callback": _emscripten_set_mouseenter_callback,
    "_UE_SaveGame": _UE_SaveGame,
    "_emscripten_glMatrixMode": _emscripten_glMatrixMode,
    "___syscall15": ___syscall15,
    "___syscall10": ___syscall10,
    "_emscripten_glNormalPointer": _emscripten_glNormalPointer,
    "_emscripten_glBindVertexArray": _emscripten_glBindVertexArray,
    "_UE_BrowserWebGLVersion": _UE_BrowserWebGLVersion,
    "_emscripten_glEnable": _emscripten_glEnable,
    "___syscall3": ___syscall3,
    "___lock": ___lock,
    "_emscripten_glBindFramebuffer": _emscripten_glBindFramebuffer,
    "___syscall6": ___syscall6,
    "___syscall5": ___syscall5,
    "___syscall4": ___syscall4,
    "_emscripten_glBindRenderbuffer": _emscripten_glBindRenderbuffer,
    "_time": _time,
    "_emscripten_glGetFramebufferAttachmentParameteriv": _emscripten_glGetFramebufferAttachmentParameteriv,
    "_exit": _exit,
    "_pthread_cleanup_pop": _pthread_cleanup_pop,
    "__inet_pton4_raw": __inet_pton4_raw,
    "___syscall102": ___syscall102,
    "_emscripten_set_keypress_callback": _emscripten_set_keypress_callback,
    "_emscripten_glLoadMatrixf": _emscripten_glLoadMatrixf,
    "_emscripten_glShaderBinary": _emscripten_glShaderBinary,
    "_UE_DoesSaveGameExist": _UE_DoesSaveGameExist,
    "_emscripten_glGetShaderInfoLog": _emscripten_glGetShaderInfoLog,
    "_emscripten_glGetVertexAttribPointerv": _emscripten_glGetVertexAttribPointerv,
    "_emscripten_glDeleteVertexArrays": _emscripten_glDeleteVertexArrays,
    "_emscripten_glGetActiveUniform": _emscripten_glGetActiveUniform,
    "emscriptenWebGLGetVertexAttrib": emscriptenWebGLGetVertexAttrib,
    "___syscall195": ___syscall195,
    "_eglSwapInterval": _eglSwapInterval,
    "_emscripten_glDeleteProgram": _emscripten_glDeleteProgram,
    "_glUniform1i": _glUniform1i,
    "_glutDestroyWindow": _glutDestroyWindow,
    "_emscripten_glCreateShader": _emscripten_glCreateShader,
    "_pthread_mutex_destroy": _pthread_mutex_destroy,
    "_emscripten_glColorPointer": _emscripten_glColorPointer,
    "_emscripten_glViewport": _emscripten_glViewport,
    "_emscripten_glDepthMask": _emscripten_glDepthMask,
    "_emscripten_glDrawBuffers": _emscripten_glDrawBuffers,
    "_alSourceStop": _alSourceStop,
    "_glCompileShader": _glCompileShader,
    "_emscripten_exit_pointerlock": _emscripten_exit_pointerlock,
    "_emscripten_glVertexAttrib4fv": _emscripten_glVertexAttrib4fv,
    "_abort": _abort,
    "_glTexImage2D": _glTexImage2D,
    "_emscripten_glGenFramebuffers": _emscripten_glGenFramebuffers,
    "_glFlush": _glFlush,
    "_emscripten_glLoadIdentity": _emscripten_glLoadIdentity,
    "_glDeleteShader": _glDeleteShader,
    "_emscripten_glShaderSource": _emscripten_glShaderSource,
    "___gxx_personality_v0": ___gxx_personality_v0,
    "_usleep": _usleep,
    "_glBindBufferRange": _glBindBufferRange,
    "_emscripten_set_touchend_callback": _emscripten_set_touchend_callback,
    "_emscripten_glGetRenderbufferParameteriv": _emscripten_glGetRenderbufferParameteriv,
    "_glGenRenderbuffers": _glGenRenderbuffers,
    "_eglTerminate": _eglTerminate,
    "_emscripten_log": _emscripten_log,
    "_emscripten_glFrustum": _emscripten_glFrustum,
    "_emscripten_glDepthRangef": _emscripten_glDepthRangef,
    "_emscripten_glGenerateMipmap": _emscripten_glGenerateMipmap,
    "_emscripten_glIsTexture": _emscripten_glIsTexture,
    "_emscripten_glHint": _emscripten_glHint,
    "_emscripten_glActiveTexture": _emscripten_glActiveTexture,
    "_emscripten_set_wheel_callback": _emscripten_set_wheel_callback,
    "_emscripten_glDeleteBuffers": _emscripten_glDeleteBuffers,
    "___syscall54": ___syscall54,
    "_UE_GSystemResolution": _UE_GSystemResolution,
    "_emscripten_glUniform2iv": _emscripten_glUniform2iv,
    "_pthread_mutexattr_init": _pthread_mutexattr_init,
    "_emscripten_asm_const_i": _emscripten_asm_const_i,
    "__hideEverythingExceptGivenElement": __hideEverythingExceptGivenElement,
    "_emscripten_glBufferData": _emscripten_glBufferData,
    "_emscripten_glCopyTexSubImage2D": _emscripten_glCopyTexSubImage2D,
    "_glStencilMask": _glStencilMask,
    "_alSourceUnqueueBuffers": _alSourceUnqueueBuffers,
    "DYNAMICTOP_PTR": DYNAMICTOP_PTR,
    "tempDoublePtr": tempDoublePtr,
    "ABORT": ABORT,
    "STACKTOP": STACKTOP,
    "STACK_MAX": STACK_MAX,
    "cttz_i8": cttz_i8,
    "_tzname": _tzname
};
var asm = Module["asm"](Module.asmGlobalArg, Module.asmLibraryArg, buffer);
Module["asm"] = asm;
var __GLOBAL__sub_I_Module_OpenGLDrv_1_of_2_cpp = Module["__GLOBAL__sub_I_Module_OpenGLDrv_1_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_OpenGLDrv_1_of_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Renderer_2_of_10_cpp = Module["__GLOBAL__sub_I_Module_Renderer_2_of_10_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Renderer_2_of_10_cpp"].apply(null, arguments)
});
var _strlen = Module["_strlen"] = (function() {
    return Module["asm"]["_strlen"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_AppFramework_1_of_2_cpp = Module["__GLOBAL__sub_I_Module_AppFramework_1_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_AppFramework_1_of_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_LightPropagationVolumeRuntime_generated_cpp = Module["__GLOBAL__sub_I_LightPropagationVolumeRuntime_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_LightPropagationVolumeRuntime_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_4_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_4_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_4_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_21_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_21_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_21_of_37_cpp"].apply(null, arguments)
});
var runPostSets = Module["runPostSets"] = (function() {
    return Module["asm"]["runPostSets"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_CableComponent_cpp = Module["__GLOBAL__sub_I_Module_CableComponent_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_CableComponent_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_BuildPatchServices_generated_cpp = Module["__GLOBAL__sub_I_BuildPatchServices_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_BuildPatchServices_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_19_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_19_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_19_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_NullDrv_cpp = Module["__GLOBAL__sub_I_Module_NullDrv_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_NullDrv_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_AnimGraphRuntime_generated_cpp = Module["__GLOBAL__sub_I_AnimGraphRuntime_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_AnimGraphRuntime_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_10_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_10_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_10_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_RenderCore_cpp = Module["__GLOBAL__sub_I_Module_RenderCore_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_RenderCore_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_24_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_24_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_24_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Core_1_of_7_cpp = Module["__GLOBAL__sub_I_Module_Core_1_of_7_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Core_1_of_7_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_OpenGLDrv_2_of_2_cpp = Module["__GLOBAL__sub_I_Module_OpenGLDrv_2_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_OpenGLDrv_2_of_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_HardwareSurvey_cpp = Module["__GLOBAL__sub_I_Module_HardwareSurvey_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_HardwareSurvey_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_22_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_22_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_22_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_NullNetworkReplayStreaming_cpp = Module["__GLOBAL__sub_I_Module_NullNetworkReplayStreaming_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_NullNetworkReplayStreaming_cpp"].apply(null, arguments)
});
var _sbrk = Module["_sbrk"] = (function() {
    return Module["asm"]["_sbrk"].apply(null, arguments)
});
var _memcpy = Module["_memcpy"] = (function() {
    return Module["asm"]["_memcpy"].apply(null, arguments)
});
var __GLOBAL__sub_I_VectorVM_generated_cpp = Module["__GLOBAL__sub_I_VectorVM_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_VectorVM_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_AIModule_generated_1_cpp = Module["__GLOBAL__sub_I_AIModule_generated_1_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_AIModule_generated_1_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_PakFile_cpp = Module["__GLOBAL__sub_I_Module_PakFile_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_PakFile_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Engine_generated_1_cpp = Module["__GLOBAL__sub_I_Engine_generated_1_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Engine_generated_1_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Renderer_4_of_10_cpp = Module["__GLOBAL__sub_I_Module_Renderer_4_of_10_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Renderer_4_of_10_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Serialization_generated_cpp = Module["__GLOBAL__sub_I_Serialization_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Serialization_generated_cpp"].apply(null, arguments)
});
var stackAlloc = Module["stackAlloc"] = (function() {
    return Module["asm"]["stackAlloc"].apply(null, arguments)
});
var __GLOBAL__sub_I_SessionMessages_generated_cpp = Module["__GLOBAL__sub_I_SessionMessages_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_SessionMessages_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_ImageWrapper_cpp = Module["__GLOBAL__sub_I_Module_ImageWrapper_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_ImageWrapper_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_ArchVisCharacter_cpp = Module["__GLOBAL__sub_I_Module_ArchVisCharacter_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_ArchVisCharacter_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_18_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_18_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_18_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_5_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_5_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_5_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_AIModule_generated_2_cpp = Module["__GLOBAL__sub_I_AIModule_generated_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_AIModule_generated_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_StreamingPauseRendering_cpp = Module["__GLOBAL__sub_I_Module_StreamingPauseRendering_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_StreamingPauseRendering_cpp"].apply(null, arguments)
});
var ___cxa_can_catch = Module["___cxa_can_catch"] = (function() {
    return Module["asm"]["___cxa_can_catch"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_FacialAnimation_cpp = Module["__GLOBAL__sub_I_Module_FacialAnimation_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_FacialAnimation_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_17_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_17_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_17_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_MaterialShaderQualitySettings_cpp = Module["__GLOBAL__sub_I_Module_MaterialShaderQualitySettings_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_MaterialShaderQualitySettings_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_13_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_13_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_13_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Renderer_3_of_10_cpp = Module["__GLOBAL__sub_I_Module_Renderer_3_of_10_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Renderer_3_of_10_cpp"].apply(null, arguments)
});
var getTempRet0 = Module["getTempRet0"] = (function() {
    return Module["asm"]["getTempRet0"].apply(null, arguments)
});
var _free = Module["_free"] = (function() {
    return Module["asm"]["_free"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Niagara_cpp = Module["__GLOBAL__sub_I_Module_Niagara_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Niagara_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_AnimGraphRuntime_cpp = Module["__GLOBAL__sub_I_Module_AnimGraphRuntime_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_AnimGraphRuntime_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_MovieScene_cpp = Module["__GLOBAL__sub_I_Module_MovieScene_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_MovieScene_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_7_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_7_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_7_of_37_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_286 = Module["___cxx_global_var_init_286"] = (function() {
    return Module["asm"]["___cxx_global_var_init_286"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_33_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_33_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_33_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_23_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_23_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_23_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_SessionServices_cpp = Module["__GLOBAL__sub_I_Module_SessionServices_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_SessionServices_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_MediaUtils_cpp = Module["__GLOBAL__sub_I_Module_MediaUtils_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_MediaUtils_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_35_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_35_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_35_of_37_cpp"].apply(null, arguments)
});
var _strstr = Module["_strstr"] = (function() {
    return Module["asm"]["_strstr"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_16_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_16_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_16_of_37_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_289 = Module["___cxx_global_var_init_289"] = (function() {
    return Module["asm"]["___cxx_global_var_init_289"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_CoreUObject_1_of_6_cpp = Module["__GLOBAL__sub_I_Module_CoreUObject_1_of_6_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_CoreUObject_1_of_6_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_16 = Module["___cxx_global_var_init_16"] = (function() {
    return Module["asm"]["___cxx_global_var_init_16"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Landscape_1_of_3_cpp = Module["__GLOBAL__sub_I_Module_Landscape_1_of_3_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Landscape_1_of_3_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_AIModule_3_of_3_cpp = Module["__GLOBAL__sub_I_Module_AIModule_3_of_3_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_AIModule_3_of_3_cpp"].apply(null, arguments)
});
var _memalign = Module["_memalign"] = (function() {
    return Module["asm"]["_memalign"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_3_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_3_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_3_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_ActorSequence_cpp = Module["__GLOBAL__sub_I_Module_ActorSequence_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_ActorSequence_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_SessionMessages_cpp = Module["__GLOBAL__sub_I_Module_SessionMessages_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_SessionMessages_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Engine_generated_4_cpp = Module["__GLOBAL__sub_I_Engine_generated_4_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Engine_generated_4_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_OnlineSubsystemNull_cpp = Module["__GLOBAL__sub_I_Module_OnlineSubsystemNull_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_OnlineSubsystemNull_cpp"].apply(null, arguments)
});
var _main = Module["_main"] = (function() {
    return Module["asm"]["_main"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_PhysXVehicles_cpp = Module["__GLOBAL__sub_I_Module_PhysXVehicles_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_PhysXVehicles_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Navmesh_2_of_3_cpp = Module["__GLOBAL__sub_I_Module_Navmesh_2_of_3_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Navmesh_2_of_3_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_HTTP_cpp = Module["__GLOBAL__sub_I_Module_HTTP_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_HTTP_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Navmesh_1_of_3_cpp = Module["__GLOBAL__sub_I_Module_Navmesh_1_of_3_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Navmesh_1_of_3_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_SlateCore_1_of_2_cpp = Module["__GLOBAL__sub_I_Module_SlateCore_1_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_SlateCore_1_of_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_AnalyticsET_cpp = Module["__GLOBAL__sub_I_Module_AnalyticsET_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_AnalyticsET_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_25_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_25_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_25_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_27_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_27_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_27_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_DatabaseSupport_cpp = Module["__GLOBAL__sub_I_Module_DatabaseSupport_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_DatabaseSupport_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_OnlineSubsystem_generated_cpp = Module["__GLOBAL__sub_I_OnlineSubsystem_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_OnlineSubsystem_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Foliage_cpp = Module["__GLOBAL__sub_I_Module_Foliage_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Foliage_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_AIModule_1_of_3_cpp = Module["__GLOBAL__sub_I_Module_AIModule_1_of_3_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_AIModule_1_of_3_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_CharacterAI_cpp = Module["__GLOBAL__sub_I_Module_CharacterAI_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_CharacterAI_cpp"].apply(null, arguments)
});
var ___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = (function() {
    return Module["asm"]["___cxa_is_pointer_type"].apply(null, arguments)
});
var __GLOBAL__sub_I_Landscape_generated_cpp = Module["__GLOBAL__sub_I_Landscape_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Landscape_generated_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_867 = Module["___cxx_global_var_init_867"] = (function() {
    return Module["asm"]["___cxx_global_var_init_867"].apply(null, arguments)
});
var __GLOBAL__sub_I_MoviePlayer_generated_cpp = Module["__GLOBAL__sub_I_MoviePlayer_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_MoviePlayer_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_MediaAssets_generated_cpp = Module["__GLOBAL__sub_I_MediaAssets_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_MediaAssets_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_UMG_1_of_2_cpp = Module["__GLOBAL__sub_I_Module_UMG_1_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_UMG_1_of_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Core_3_of_7_cpp = Module["__GLOBAL__sub_I_Module_Core_3_of_7_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Core_3_of_7_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_LocationServicesBPLibrary_generated_cpp = Module["__GLOBAL__sub_I_LocationServicesBPLibrary_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_LocationServicesBPLibrary_generated_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_292 = Module["___cxx_global_var_init_292"] = (function() {
    return Module["asm"]["___cxx_global_var_init_292"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_SandboxFile_cpp = Module["__GLOBAL__sub_I_Module_SandboxFile_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_SandboxFile_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Core_4_of_7_cpp = Module["__GLOBAL__sub_I_Module_Core_4_of_7_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Core_4_of_7_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_EngineSettings_generated_cpp = Module["__GLOBAL__sub_I_EngineSettings_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_EngineSettings_generated_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_295 = Module["___cxx_global_var_init_295"] = (function() {
    return Module["asm"]["___cxx_global_var_init_295"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Launch_cpp = Module["__GLOBAL__sub_I_Module_Launch_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Launch_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_BuildPatchServices_1_of_2_cpp = Module["__GLOBAL__sub_I_Module_BuildPatchServices_1_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_BuildPatchServices_1_of_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_CableComponent_generated_cpp = Module["__GLOBAL__sub_I_CableComponent_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_CableComponent_generated_cpp"].apply(null, arguments)
});
var _ntohs = Module["_ntohs"] = (function() {
    return Module["asm"]["_ntohs"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_OnlineSubsystem_cpp = Module["__GLOBAL__sub_I_Module_OnlineSubsystem_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_OnlineSubsystem_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_MoviePlayer_cpp = Module["__GLOBAL__sub_I_Module_MoviePlayer_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_MoviePlayer_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_37_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_37_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_37_of_37_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_277 = Module["___cxx_global_var_init_277"] = (function() {
    return Module["asm"]["___cxx_global_var_init_277"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_LocationServicesBPLibrary_cpp = Module["__GLOBAL__sub_I_Module_LocationServicesBPLibrary_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_LocationServicesBPLibrary_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_272 = Module["___cxx_global_var_init_272"] = (function() {
    return Module["asm"]["___cxx_global_var_init_272"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_30_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_30_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_30_of_37_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_186 = Module["___cxx_global_var_init_186"] = (function() {
    return Module["asm"]["___cxx_global_var_init_186"].apply(null, arguments)
});
var ___cxx_global_var_init_185 = Module["___cxx_global_var_init_185"] = (function() {
    return Module["asm"]["___cxx_global_var_init_185"].apply(null, arguments)
});
var ___cxx_global_var_init_184 = Module["___cxx_global_var_init_184"] = (function() {
    return Module["asm"]["___cxx_global_var_init_184"].apply(null, arguments)
});
var _llvm_bswap_i32 = Module["_llvm_bswap_i32"] = (function() {
    return Module["asm"]["_llvm_bswap_i32"].apply(null, arguments)
});
var __GLOBAL__sub_I_Engine_generated_2_cpp = Module["__GLOBAL__sub_I_Engine_generated_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Engine_generated_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_JsonUtilities_generated_cpp = Module["__GLOBAL__sub_I_JsonUtilities_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_JsonUtilities_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Renderer_8_of_10_cpp = Module["__GLOBAL__sub_I_Module_Renderer_8_of_10_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Renderer_8_of_10_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Renderer_1_of_10_cpp = Module["__GLOBAL__sub_I_Module_Renderer_1_of_10_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Renderer_1_of_10_cpp"].apply(null, arguments)
});
var establishStackSpace = Module["establishStackSpace"] = (function() {
    return Module["asm"]["establishStackSpace"].apply(null, arguments)
});
var __GLOBAL__sub_I_GameplayTags_generated_cpp = Module["__GLOBAL__sub_I_GameplayTags_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_GameplayTags_generated_cpp"].apply(null, arguments)
});
var _on_fatal = Module["_on_fatal"] = (function() {
    return Module["asm"]["_on_fatal"].apply(null, arguments)
});
var __GLOBAL__sub_I_SwSolverKernel_cpp = Module["__GLOBAL__sub_I_SwSolverKernel_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_SwSolverKernel_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Media_cpp = Module["__GLOBAL__sub_I_Module_Media_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Media_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_OnlineSubsystemUtils_1_of_2_cpp = Module["__GLOBAL__sub_I_Module_OnlineSubsystemUtils_1_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_OnlineSubsystemUtils_1_of_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_ReliabilityHandlerComponent_cpp = Module["__GLOBAL__sub_I_Module_ReliabilityHandlerComponent_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_ReliabilityHandlerComponent_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_NetworkReplayStreaming_cpp = Module["__GLOBAL__sub_I_Module_NetworkReplayStreaming_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_NetworkReplayStreaming_cpp"].apply(null, arguments)
});
var _pthread_mutex_lock = Module["_pthread_mutex_lock"] = (function() {
    return Module["asm"]["_pthread_mutex_lock"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_HTML5Networking_cpp = Module["__GLOBAL__sub_I_Module_HTML5Networking_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_HTML5Networking_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_ArchVisCharacter_generated_cpp = Module["__GLOBAL__sub_I_ArchVisCharacter_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_ArchVisCharacter_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_29_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_29_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_29_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_14_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_14_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_14_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_SynthBenchmark_cpp = Module["__GLOBAL__sub_I_Module_SynthBenchmark_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_SynthBenchmark_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_2_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_2_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_2_of_37_cpp"].apply(null, arguments)
});
var _roundf = Module["_roundf"] = (function() {
    return Module["asm"]["_roundf"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_UtilityShaders_cpp = Module["__GLOBAL__sub_I_Module_UtilityShaders_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_UtilityShaders_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_8_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_8_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_8_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_AIModule_2_of_3_cpp = Module["__GLOBAL__sub_I_Module_AIModule_2_of_3_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_AIModule_2_of_3_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_JsonUtilities_cpp = Module["__GLOBAL__sub_I_Module_JsonUtilities_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_JsonUtilities_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_LevelSequence_generated_cpp = Module["__GLOBAL__sub_I_LevelSequence_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_LevelSequence_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Serialization_cpp = Module["__GLOBAL__sub_I_Module_Serialization_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Serialization_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Messaging_cpp = Module["__GLOBAL__sub_I_Module_Messaging_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Messaging_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_187 = Module["___cxx_global_var_init_187"] = (function() {
    return Module["asm"]["___cxx_global_var_init_187"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_AppFramework_2_of_2_cpp = Module["__GLOBAL__sub_I_Module_AppFramework_2_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_AppFramework_2_of_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Slate_generated_cpp = Module["__GLOBAL__sub_I_Slate_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Slate_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_CoreUObject_4_of_6_cpp = Module["__GLOBAL__sub_I_Module_CoreUObject_4_of_6_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_CoreUObject_4_of_6_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_222 = Module["___cxx_global_var_init_222"] = (function() {
    return Module["asm"]["___cxx_global_var_init_222"].apply(null, arguments)
});
var __GLOBAL__sub_I_HTML5Networking_generated_cpp = Module["__GLOBAL__sub_I_HTML5Networking_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_HTML5Networking_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Slate_3_of_5_cpp = Module["__GLOBAL__sub_I_Module_Slate_3_of_5_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Slate_3_of_5_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_MapPakDownloader_cpp = Module["__GLOBAL__sub_I_Module_MapPakDownloader_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_MapPakDownloader_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_ShaderCore_cpp = Module["__GLOBAL__sub_I_Module_ShaderCore_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_ShaderCore_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_OnlineSubsystemUtils_generated_cpp = Module["__GLOBAL__sub_I_OnlineSubsystemUtils_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_OnlineSubsystemUtils_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_SwSolver_cpp = Module["__GLOBAL__sub_I_SwSolver_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_SwSolver_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_AssetRegistry_cpp = Module["__GLOBAL__sub_I_Module_AssetRegistry_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_AssetRegistry_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Renderer_7_of_10_cpp = Module["__GLOBAL__sub_I_Module_Renderer_7_of_10_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Renderer_7_of_10_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_ALAudio_cpp = Module["__GLOBAL__sub_I_Module_ALAudio_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_ALAudio_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_GameLiveStreaming_cpp = Module["__GLOBAL__sub_I_Module_GameLiveStreaming_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_GameLiveStreaming_cpp"].apply(null, arguments)
});
var _memset = Module["_memset"] = (function() {
    return Module["asm"]["_memset"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_MobilePatchingUtils_cpp = Module["__GLOBAL__sub_I_Module_MobilePatchingUtils_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_MobilePatchingUtils_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_NpActor_cpp = Module["__GLOBAL__sub_I_NpActor_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_NpActor_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_CoreUObject_2_of_6_cpp = Module["__GLOBAL__sub_I_Module_CoreUObject_2_of_6_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_CoreUObject_2_of_6_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_UMG_generated_2_cpp = Module["__GLOBAL__sub_I_UMG_generated_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_UMG_generated_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Slate_1_of_5_cpp = Module["__GLOBAL__sub_I_Module_Slate_1_of_5_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Slate_1_of_5_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Core_7_of_7_cpp = Module["__GLOBAL__sub_I_Module_Core_7_of_7_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Core_7_of_7_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_36_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_36_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_36_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_PacketHandler_cpp = Module["__GLOBAL__sub_I_Module_PacketHandler_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_PacketHandler_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Renderer_10_of_10_cpp = Module["__GLOBAL__sub_I_Module_Renderer_10_of_10_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Renderer_10_of_10_cpp"].apply(null, arguments)
});
var setTempRet0 = Module["setTempRet0"] = (function() {
    return Module["asm"]["setTempRet0"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Advertising_cpp = Module["__GLOBAL__sub_I_Module_Advertising_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Advertising_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Projects_cpp = Module["__GLOBAL__sub_I_Module_Projects_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Projects_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_MediaAssets_cpp = Module["__GLOBAL__sub_I_Module_MediaAssets_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_MediaAssets_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_SwCollision_cpp = Module["__GLOBAL__sub_I_SwCollision_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_SwCollision_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_26_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_26_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_26_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_LightPropagationVolumeRuntime_cpp = Module["__GLOBAL__sub_I_Module_LightPropagationVolumeRuntime_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_LightPropagationVolumeRuntime_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_UMG_2_of_2_cpp = Module["__GLOBAL__sub_I_Module_UMG_2_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_UMG_2_of_2_cpp"].apply(null, arguments)
});
var _llvm_bswap_i16 = Module["_llvm_bswap_i16"] = (function() {
    return Module["asm"]["_llvm_bswap_i16"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_InputCore_cpp = Module["__GLOBAL__sub_I_Module_InputCore_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_InputCore_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_9_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_9_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_9_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_CoreUObject_3_of_6_cpp = Module["__GLOBAL__sub_I_Module_CoreUObject_3_of_6_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_CoreUObject_3_of_6_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_CoreUObject_6_of_6_cpp = Module["__GLOBAL__sub_I_Module_CoreUObject_6_of_6_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_CoreUObject_6_of_6_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_HeadMountedDisplay_cpp = Module["__GLOBAL__sub_I_Module_HeadMountedDisplay_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_HeadMountedDisplay_cpp"].apply(null, arguments)
});
var _pthread_cond_broadcast = Module["_pthread_cond_broadcast"] = (function() {
    return Module["asm"]["_pthread_cond_broadcast"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_GameplayTasks_cpp = Module["__GLOBAL__sub_I_Module_GameplayTasks_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_GameplayTasks_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Internationalization_cpp = Module["__GLOBAL__sub_I_Module_Internationalization_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Internationalization_cpp"].apply(null, arguments)
});
var _testSetjmp = Module["_testSetjmp"] = (function() {
    return Module["asm"]["_testSetjmp"].apply(null, arguments)
});
var __GLOBAL__sub_I_PhysXVehicles_generated_cpp = Module["__GLOBAL__sub_I_PhysXVehicles_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_PhysXVehicles_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_SlateRHIRenderer_cpp = Module["__GLOBAL__sub_I_Module_SlateRHIRenderer_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_SlateRHIRenderer_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_GameplayTags_cpp = Module["__GLOBAL__sub_I_Module_GameplayTags_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_GameplayTags_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_MovieScene_generated_cpp = Module["__GLOBAL__sub_I_MovieScene_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_MovieScene_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_SwSelfCollision_cpp = Module["__GLOBAL__sub_I_SwSelfCollision_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_SwSelfCollision_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_HeadMountedDisplay_generated_cpp = Module["__GLOBAL__sub_I_HeadMountedDisplay_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_HeadMountedDisplay_generated_cpp"].apply(null, arguments)
});
var setThrew = Module["setThrew"] = (function() {
    return Module["asm"]["setThrew"].apply(null, arguments)
});
var _malloc = Module["_malloc"] = (function() {
    return Module["asm"]["_malloc"].apply(null, arguments)
});
var __GLOBAL__sub_I_MobilePatchingUtils_generated_cpp = Module["__GLOBAL__sub_I_MobilePatchingUtils_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_MobilePatchingUtils_generated_cpp"].apply(null, arguments)
});
var _emscripten_replace_memory = Module["_emscripten_replace_memory"] = (function() {
    return Module["asm"]["_emscripten_replace_memory"].apply(null, arguments)
});
var __GLOBAL__sub_I_GameplayTasks_generated_cpp = Module["__GLOBAL__sub_I_GameplayTasks_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_GameplayTasks_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_GeometryCache_generated_cpp = Module["__GLOBAL__sub_I_GeometryCache_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_GeometryCache_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_EngineSettings_cpp = Module["__GLOBAL__sub_I_Module_EngineSettings_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_EngineSettings_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_1_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_1_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_1_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_InputCore_generated_cpp = Module["__GLOBAL__sub_I_InputCore_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_InputCore_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Navmesh_3_of_3_cpp = Module["__GLOBAL__sub_I_Module_Navmesh_3_of_3_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Navmesh_3_of_3_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_CinematicCamera_generated_cpp = Module["__GLOBAL__sub_I_CinematicCamera_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_CinematicCamera_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_HttpNetworkReplayStreaming_cpp = Module["__GLOBAL__sub_I_Module_HttpNetworkReplayStreaming_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_HttpNetworkReplayStreaming_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_ImageCore_cpp = Module["__GLOBAL__sub_I_Module_ImageCore_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_ImageCore_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_ExampleDeviceProfileSelector_cpp = Module["__GLOBAL__sub_I_Module_ExampleDeviceProfileSelector_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_ExampleDeviceProfileSelector_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_11_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_11_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_11_of_37_cpp"].apply(null, arguments)
});
var stackSave = Module["stackSave"] = (function() {
    return Module["asm"]["stackSave"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_31_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_31_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_31_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_20_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_20_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_20_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_OnlineSubsystemUtils_2_of_2_cpp = Module["__GLOBAL__sub_I_Module_OnlineSubsystemUtils_2_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_OnlineSubsystemUtils_2_of_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Foliage_generated_cpp = Module["__GLOBAL__sub_I_Foliage_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Foliage_generated_cpp"].apply(null, arguments)
});
var ___cxx_global_var_init_221 = Module["___cxx_global_var_init_221"] = (function() {
    return Module["asm"]["___cxx_global_var_init_221"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_12_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_12_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_12_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Niagara_generated_cpp = Module["__GLOBAL__sub_I_Niagara_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Niagara_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_FacialAnimation_generated_cpp = Module["__GLOBAL__sub_I_FacialAnimation_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_FacialAnimation_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_34_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_34_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_34_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_SlateCore_2_of_2_cpp = Module["__GLOBAL__sub_I_Module_SlateCore_2_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_SlateCore_2_of_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_GeometryCache_cpp = Module["__GLOBAL__sub_I_Module_GeometryCache_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_GeometryCache_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_PtDynamics_cpp = Module["__GLOBAL__sub_I_PtDynamics_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_PtDynamics_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_28_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_28_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_28_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_CoreUObject_5_of_6_cpp = Module["__GLOBAL__sub_I_Module_CoreUObject_5_of_6_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_CoreUObject_5_of_6_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_MovieSceneCapture_generated_cpp = Module["__GLOBAL__sub_I_MovieSceneCapture_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_MovieSceneCapture_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_EngineMessages_generated_cpp = Module["__GLOBAL__sub_I_EngineMessages_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_EngineMessages_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_PacketHandler_generated_cpp = Module["__GLOBAL__sub_I_PacketHandler_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_PacketHandler_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_CoreUObject_generated_cpp = Module["__GLOBAL__sub_I_CoreUObject_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_CoreUObject_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Sockets_cpp = Module["__GLOBAL__sub_I_Module_Sockets_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Sockets_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Core_5_of_7_cpp = Module["__GLOBAL__sub_I_Module_Core_5_of_7_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Core_5_of_7_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Core_2_of_7_cpp = Module["__GLOBAL__sub_I_Module_Core_2_of_7_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Core_2_of_7_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_SwInterCollision_cpp = Module["__GLOBAL__sub_I_SwInterCollision_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_SwInterCollision_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_MovieSceneCapture_cpp = Module["__GLOBAL__sub_I_Module_MovieSceneCapture_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_MovieSceneCapture_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Slate_2_of_5_cpp = Module["__GLOBAL__sub_I_Module_Slate_2_of_5_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Slate_2_of_5_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Slate_5_of_5_cpp = Module["__GLOBAL__sub_I_Module_Slate_5_of_5_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Slate_5_of_5_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_ActorSequence_generated_cpp = Module["__GLOBAL__sub_I_ActorSequence_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_ActorSequence_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Slate_4_of_5_cpp = Module["__GLOBAL__sub_I_Module_Slate_4_of_5_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Slate_4_of_5_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Networking_cpp = Module["__GLOBAL__sub_I_Module_Networking_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Networking_cpp"].apply(null, arguments)
});
var _htonl = Module["_htonl"] = (function() {
    return Module["asm"]["_htonl"].apply(null, arguments)
});
var _realloc = Module["_realloc"] = (function() {
    return Module["asm"]["_realloc"].apply(null, arguments)
});
var __GLOBAL__sub_I_MovieSceneTracks_generated_cpp = Module["__GLOBAL__sub_I_MovieSceneTracks_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_MovieSceneTracks_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_SlateNullRenderer_cpp = Module["__GLOBAL__sub_I_Module_SlateNullRenderer_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_SlateNullRenderer_cpp"].apply(null, arguments)
});
var _pthread_self = Module["_pthread_self"] = (function() {
    return Module["asm"]["_pthread_self"].apply(null, arguments)
});
var _pthread_mutex_unlock = Module["_pthread_mutex_unlock"] = (function() {
    return Module["asm"]["_pthread_mutex_unlock"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_UE4Game_cpp = Module["__GLOBAL__sub_I_Module_UE4Game_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_UE4Game_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Voice_cpp = Module["__GLOBAL__sub_I_Module_Voice_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Voice_cpp"].apply(null, arguments)
});
var stackRestore = Module["stackRestore"] = (function() {
    return Module["asm"]["stackRestore"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Renderer_5_of_10_cpp = Module["__GLOBAL__sub_I_Module_Renderer_5_of_10_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Renderer_5_of_10_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Landscape_2_of_3_cpp = Module["__GLOBAL__sub_I_Module_Landscape_2_of_3_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Landscape_2_of_3_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Landscape_3_of_3_cpp = Module["__GLOBAL__sub_I_Module_Landscape_3_of_3_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Landscape_3_of_3_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_32_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_32_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_32_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_LevelSequence_cpp = Module["__GLOBAL__sub_I_Module_LevelSequence_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_LevelSequence_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Json_cpp = Module["__GLOBAL__sub_I_Module_Json_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Json_cpp"].apply(null, arguments)
});
var _htons = Module["_htons"] = (function() {
    return Module["asm"]["_htons"].apply(null, arguments)
});
var _emscripten_GetProcAddress = Module["_emscripten_GetProcAddress"] = (function() {
    return Module["asm"]["_emscripten_GetProcAddress"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Renderer_9_of_10_cpp = Module["__GLOBAL__sub_I_Module_Renderer_9_of_10_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Renderer_9_of_10_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Renderer_6_of_10_cpp = Module["__GLOBAL__sub_I_Module_Renderer_6_of_10_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Renderer_6_of_10_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Core_6_of_7_cpp = Module["__GLOBAL__sub_I_Module_Core_6_of_7_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Core_6_of_7_cpp"].apply(null, arguments)
});
var ___errno_location = Module["___errno_location"] = (function() {
    return Module["asm"]["___errno_location"].apply(null, arguments)
});
var __GLOBAL__sub_I_SwFactory_cpp = Module["__GLOBAL__sub_I_SwFactory_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_SwFactory_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Paper2D_cpp = Module["__GLOBAL__sub_I_Module_Paper2D_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Paper2D_cpp"].apply(null, arguments)
});
var _saveSetjmp = Module["_saveSetjmp"] = (function() {
    return Module["asm"]["_saveSetjmp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Analytics_cpp = Module["__GLOBAL__sub_I_Module_Analytics_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Analytics_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_VectorVM_cpp = Module["__GLOBAL__sub_I_Module_VectorVM_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_VectorVM_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_UMG_generated_1_cpp = Module["__GLOBAL__sub_I_UMG_generated_1_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_UMG_generated_1_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_BuildPatchServices_2_of_2_cpp = Module["__GLOBAL__sub_I_Module_BuildPatchServices_2_of_2_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_BuildPatchServices_2_of_2_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_MovieSceneTracks_cpp = Module["__GLOBAL__sub_I_Module_MovieSceneTracks_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_MovieSceneTracks_cpp"].apply(null, arguments)
});
var _memmove = Module["_memmove"] = (function() {
    return Module["asm"]["_memmove"].apply(null, arguments)
});
var __GLOBAL__sub_I_GameLiveStreaming_generated_cpp = Module["__GLOBAL__sub_I_GameLiveStreaming_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_GameLiveStreaming_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_6_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_6_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_6_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_EngineMessages_cpp = Module["__GLOBAL__sub_I_Module_EngineMessages_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_EngineMessages_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_MaterialShaderQualitySettings_generated_cpp = Module["__GLOBAL__sub_I_MaterialShaderQualitySettings_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_MaterialShaderQualitySettings_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_SlateCore_generated_cpp = Module["__GLOBAL__sub_I_SlateCore_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_SlateCore_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_Engine_15_of_37_cpp = Module["__GLOBAL__sub_I_Module_Engine_15_of_37_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_Engine_15_of_37_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Paper2D_generated_cpp = Module["__GLOBAL__sub_I_Paper2D_generated_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Paper2D_generated_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_RHI_cpp = Module["__GLOBAL__sub_I_Module_RHI_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_RHI_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Module_CinematicCamera_cpp = Module["__GLOBAL__sub_I_Module_CinematicCamera_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Module_CinematicCamera_cpp"].apply(null, arguments)
});
var __GLOBAL__sub_I_Engine_generated_3_cpp = Module["__GLOBAL__sub_I_Engine_generated_3_cpp"] = (function() {
    return Module["asm"]["__GLOBAL__sub_I_Engine_generated_3_cpp"].apply(null, arguments)
});
var dynCall_iiiiiif = Module["dynCall_iiiiiif"] = (function() {
    return Module["asm"]["dynCall_iiiiiif"].apply(null, arguments)
});
var dynCall_viij = Module["dynCall_viij"] = (function() {
    return Module["asm"]["dynCall_viij"].apply(null, arguments)
});
var dynCall_fiff = Module["dynCall_fiff"] = (function() {
    return Module["asm"]["dynCall_fiff"].apply(null, arguments)
});
var dynCall_fifi = Module["dynCall_fifi"] = (function() {
    return Module["asm"]["dynCall_fifi"].apply(null, arguments)
});
var dynCall_viffif = Module["dynCall_viffif"] = (function() {
    return Module["asm"]["dynCall_viffif"].apply(null, arguments)
});
var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = (function() {
    return Module["asm"]["dynCall_iiiiiii"].apply(null, arguments)
});
var dynCall_jiii = Module["dynCall_jiii"] = (function() {
    return Module["asm"]["dynCall_jiii"].apply(null, arguments)
});
var dynCall_iiiiiij = Module["dynCall_iiiiiij"] = (function() {
    return Module["asm"]["dynCall_iiiiiij"].apply(null, arguments)
});
var dynCall_vifiiiiii = Module["dynCall_vifiiiiii"] = (function() {
    return Module["asm"]["dynCall_vifiiiiii"].apply(null, arguments)
});
var dynCall_viiffifi = Module["dynCall_viiffifi"] = (function() {
    return Module["asm"]["dynCall_viiffifi"].apply(null, arguments)
});
var dynCall_iidf = Module["dynCall_iidf"] = (function() {
    return Module["asm"]["dynCall_iidf"].apply(null, arguments)
});
var dynCall_viiiiiiiiiii = Module["dynCall_viiiiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_viiiiiiiiiii"].apply(null, arguments)
});
var dynCall_vif = Module["dynCall_vif"] = (function() {
    return Module["asm"]["dynCall_vif"].apply(null, arguments)
});
var dynCall_iidi = Module["dynCall_iidi"] = (function() {
    return Module["asm"]["dynCall_iidi"].apply(null, arguments)
});
var dynCall_iifiiifiiiiiiii = Module["dynCall_iifiiifiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_iifiiifiiiiiiii"].apply(null, arguments)
});
var dynCall_jiji = Module["dynCall_jiji"] = (function() {
    return Module["asm"]["dynCall_jiji"].apply(null, arguments)
});
var dynCall_iifff = Module["dynCall_iifff"] = (function() {
    return Module["asm"]["dynCall_iifff"].apply(null, arguments)
});
var dynCall_iiiiifiiiif = Module["dynCall_iiiiifiiiif"] = (function() {
    return Module["asm"]["dynCall_iiiiifiiiif"].apply(null, arguments)
});
var dynCall_viiiiiiif = Module["dynCall_viiiiiiif"] = (function() {
    return Module["asm"]["dynCall_viiiiiiif"].apply(null, arguments)
});
var dynCall_iiiiiiffii = Module["dynCall_iiiiiiffii"] = (function() {
    return Module["asm"]["dynCall_iiiiiiffii"].apply(null, arguments)
});
var dynCall_iiiiifii = Module["dynCall_iiiiifii"] = (function() {
    return Module["asm"]["dynCall_iiiiifii"].apply(null, arguments)
});
var dynCall_viiiiiffi = Module["dynCall_viiiiiffi"] = (function() {
    return Module["asm"]["dynCall_viiiiiffi"].apply(null, arguments)
});
var dynCall_viifiiii = Module["dynCall_viifiiii"] = (function() {
    return Module["asm"]["dynCall_viifiiii"].apply(null, arguments)
});
var dynCall_iiiidi = Module["dynCall_iiiidi"] = (function() {
    return Module["asm"]["dynCall_iiiidi"].apply(null, arguments)
});
var dynCall_jij = Module["dynCall_jij"] = (function() {
    return Module["asm"]["dynCall_jij"].apply(null, arguments)
});
var dynCall_iiiiifiii = Module["dynCall_iiiiifiii"] = (function() {
    return Module["asm"]["dynCall_iiiiifiii"].apply(null, arguments)
});
var dynCall_iiffi = Module["dynCall_iiffi"] = (function() {
    return Module["asm"]["dynCall_iiffi"].apply(null, arguments)
});
var dynCall_jii = Module["dynCall_jii"] = (function() {
    return Module["asm"]["dynCall_jii"].apply(null, arguments)
});
var dynCall_iiiiiiiiiiii = Module["dynCall_iiiiiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_iiiiiiiiiiii"].apply(null, arguments)
});
var dynCall_iidiii = Module["dynCall_iidiii"] = (function() {
    return Module["asm"]["dynCall_iidiii"].apply(null, arguments)
});
var dynCall_fif = Module["dynCall_fif"] = (function() {
    return Module["asm"]["dynCall_fif"].apply(null, arguments)
});
var dynCall_viifiii = Module["dynCall_viifiii"] = (function() {
    return Module["asm"]["dynCall_viifiii"].apply(null, arguments)
});
var dynCall_fij = Module["dynCall_fij"] = (function() {
    return Module["asm"]["dynCall_fij"].apply(null, arguments)
});
var dynCall_fii = Module["dynCall_fii"] = (function() {
    return Module["asm"]["dynCall_fii"].apply(null, arguments)
});
var dynCall_viiiiiff = Module["dynCall_viiiiiff"] = (function() {
    return Module["asm"]["dynCall_viiiiiff"].apply(null, arguments)
});
var dynCall_viffdd = Module["dynCall_viffdd"] = (function() {
    return Module["asm"]["dynCall_viffdd"].apply(null, arguments)
});
var dynCall_iiiiddii = Module["dynCall_iiiiddii"] = (function() {
    return Module["asm"]["dynCall_iiiiddii"].apply(null, arguments)
});
var dynCall_di = Module["dynCall_di"] = (function() {
    return Module["asm"]["dynCall_di"].apply(null, arguments)
});
var dynCall_viff = Module["dynCall_viff"] = (function() {
    return Module["asm"]["dynCall_viff"].apply(null, arguments)
});
var dynCall_iifiiiiij = Module["dynCall_iifiiiiij"] = (function() {
    return Module["asm"]["dynCall_iifiiiiij"].apply(null, arguments)
});
var dynCall_iiifiii = Module["dynCall_iiifiii"] = (function() {
    return Module["asm"]["dynCall_iiifiii"].apply(null, arguments)
});
var dynCall_vijjjii = Module["dynCall_vijjjii"] = (function() {
    return Module["asm"]["dynCall_vijjjii"].apply(null, arguments)
});
var dynCall_viiiif = Module["dynCall_viiiif"] = (function() {
    return Module["asm"]["dynCall_viiiif"].apply(null, arguments)
});
var dynCall_viijj = Module["dynCall_viijj"] = (function() {
    return Module["asm"]["dynCall_viijj"].apply(null, arguments)
});
var dynCall_viffff = Module["dynCall_viffff"] = (function() {
    return Module["asm"]["dynCall_viffff"].apply(null, arguments)
});
var dynCall_viiifiif = Module["dynCall_viiifiif"] = (function() {
    return Module["asm"]["dynCall_viiifiif"].apply(null, arguments)
});
var dynCall_iidfi = Module["dynCall_iidfi"] = (function() {
    return Module["asm"]["dynCall_iidfi"].apply(null, arguments)
});
var dynCall_viiji = Module["dynCall_viiji"] = (function() {
    return Module["asm"]["dynCall_viiji"].apply(null, arguments)
});
var dynCall_didd = Module["dynCall_didd"] = (function() {
    return Module["asm"]["dynCall_didd"].apply(null, arguments)
});
var dynCall_viiffi = Module["dynCall_viiffi"] = (function() {
    return Module["asm"]["dynCall_viiffi"].apply(null, arguments)
});
var dynCall_dii = Module["dynCall_dii"] = (function() {
    return Module["asm"]["dynCall_dii"].apply(null, arguments)
});
var dynCall_did = Module["dynCall_did"] = (function() {
    return Module["asm"]["dynCall_did"].apply(null, arguments)
});
var dynCall_fiiiiiif = Module["dynCall_fiiiiiif"] = (function() {
    return Module["asm"]["dynCall_fiiiiiif"].apply(null, arguments)
});
var dynCall_iifii = Module["dynCall_iifii"] = (function() {
    return Module["asm"]["dynCall_iifii"].apply(null, arguments)
});
var dynCall_iiifiifi = Module["dynCall_iiifiifi"] = (function() {
    return Module["asm"]["dynCall_iiifiifi"].apply(null, arguments)
});
var dynCall_iiiii = Module["dynCall_iiiii"] = (function() {
    return Module["asm"]["dynCall_iiiii"].apply(null, arguments)
});
var dynCall_iidii = Module["dynCall_iidii"] = (function() {
    return Module["asm"]["dynCall_iidii"].apply(null, arguments)
});
var dynCall_iiiij = Module["dynCall_iiiij"] = (function() {
    return Module["asm"]["dynCall_iiiij"].apply(null, arguments)
});
var dynCall_vdd = Module["dynCall_vdd"] = (function() {
    return Module["asm"]["dynCall_vdd"].apply(null, arguments)
});
var dynCall_jiijjiii = Module["dynCall_jiijjiii"] = (function() {
    return Module["asm"]["dynCall_jiijjiii"].apply(null, arguments)
});
var dynCall_viif = Module["dynCall_viif"] = (function() {
    return Module["asm"]["dynCall_viif"].apply(null, arguments)
});
var dynCall_iiiif = Module["dynCall_iiiif"] = (function() {
    return Module["asm"]["dynCall_iiiif"].apply(null, arguments)
});
var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = (function() {
    return Module["asm"]["dynCall_iiiiiiii"].apply(null, arguments)
});
var dynCall_vffff = Module["dynCall_vffff"] = (function() {
    return Module["asm"]["dynCall_vffff"].apply(null, arguments)
});
var dynCall_viifiiiii = Module["dynCall_viifiiiii"] = (function() {
    return Module["asm"]["dynCall_viifiiiii"].apply(null, arguments)
});
var dynCall_vdddddd = Module["dynCall_vdddddd"] = (function() {
    return Module["asm"]["dynCall_vdddddd"].apply(null, arguments)
});
var dynCall_iiiji = Module["dynCall_iiiji"] = (function() {
    return Module["asm"]["dynCall_iiiji"].apply(null, arguments)
});
var dynCall_viidf = Module["dynCall_viidf"] = (function() {
    return Module["asm"]["dynCall_viidf"].apply(null, arguments)
});
var dynCall_viiifii = Module["dynCall_viiifii"] = (function() {
    return Module["asm"]["dynCall_viiifii"].apply(null, arguments)
});
var dynCall_viijijj = Module["dynCall_viijijj"] = (function() {
    return Module["asm"]["dynCall_viijijj"].apply(null, arguments)
});
var dynCall_fiiijiijiijii = Module["dynCall_fiiijiijiijii"] = (function() {
    return Module["asm"]["dynCall_fiiijiijiijii"].apply(null, arguments)
});
var dynCall_viiffiiiffffi = Module["dynCall_viiffiiiffffi"] = (function() {
    return Module["asm"]["dynCall_viiffiiiffffi"].apply(null, arguments)
});
var dynCall_fiiiiiifiifif = Module["dynCall_fiiiiiifiifif"] = (function() {
    return Module["asm"]["dynCall_fiiiiiifiifif"].apply(null, arguments)
});
var dynCall_viiffii = Module["dynCall_viiffii"] = (function() {
    return Module["asm"]["dynCall_viiffii"].apply(null, arguments)
});
var dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_iiiiiiiiii"].apply(null, arguments)
});
var dynCall_vidiiiii = Module["dynCall_vidiiiii"] = (function() {
    return Module["asm"]["dynCall_vidiiiii"].apply(null, arguments)
});
var dynCall_iifffffii = Module["dynCall_iifffffii"] = (function() {
    return Module["asm"]["dynCall_iifffffii"].apply(null, arguments)
});
var dynCall_fiffi = Module["dynCall_fiffi"] = (function() {
    return Module["asm"]["dynCall_fiffi"].apply(null, arguments)
});
var dynCall_iiifii = Module["dynCall_iiifii"] = (function() {
    return Module["asm"]["dynCall_iiifii"].apply(null, arguments)
});
var dynCall_viiiiiiiiiiifii = Module["dynCall_viiiiiiiiiiifii"] = (function() {
    return Module["asm"]["dynCall_viiiiiiiiiiifii"].apply(null, arguments)
});
var dynCall_viffiiiii = Module["dynCall_viffiiiii"] = (function() {
    return Module["asm"]["dynCall_viffiiiii"].apply(null, arguments)
});
var dynCall_viiifiiiii = Module["dynCall_viiifiiiii"] = (function() {
    return Module["asm"]["dynCall_viiifiiiii"].apply(null, arguments)
});
var dynCall_viiiiif = Module["dynCall_viiiiif"] = (function() {
    return Module["asm"]["dynCall_viiiiif"].apply(null, arguments)
});
var dynCall_viffi = Module["dynCall_viffi"] = (function() {
    return Module["asm"]["dynCall_viffi"].apply(null, arguments)
});
var dynCall_iiiifiiii = Module["dynCall_iiiifiiii"] = (function() {
    return Module["asm"]["dynCall_iiiifiiii"].apply(null, arguments)
});
var dynCall_vifi = Module["dynCall_vifi"] = (function() {
    return Module["asm"]["dynCall_vifi"].apply(null, arguments)
});
var dynCall_viiiifiiif = Module["dynCall_viiiifiiif"] = (function() {
    return Module["asm"]["dynCall_viiiifiiif"].apply(null, arguments)
});
var dynCall_vifff = Module["dynCall_vifff"] = (function() {
    return Module["asm"]["dynCall_vifff"].apply(null, arguments)
});
var dynCall_viiiiii = Module["dynCall_viiiiii"] = (function() {
    return Module["asm"]["dynCall_viiiiii"].apply(null, arguments)
});
var dynCall_viiidi = Module["dynCall_viiidi"] = (function() {
    return Module["asm"]["dynCall_viiidi"].apply(null, arguments)
});
var dynCall_viii = Module["dynCall_viii"] = (function() {
    return Module["asm"]["dynCall_viii"].apply(null, arguments)
});
var dynCall_viiiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_viiiiiiiiiiiiii"].apply(null, arguments)
});
var dynCall_fiii = Module["dynCall_fiii"] = (function() {
    return Module["asm"]["dynCall_fiii"].apply(null, arguments)
});
var dynCall_iifiii = Module["dynCall_iifiii"] = (function() {
    return Module["asm"]["dynCall_iifiii"].apply(null, arguments)
});
var dynCall_fiif = Module["dynCall_fiif"] = (function() {
    return Module["asm"]["dynCall_fiif"].apply(null, arguments)
});
var dynCall_v = Module["dynCall_v"] = (function() {
    return Module["asm"]["dynCall_v"].apply(null, arguments)
});
var dynCall_vidi = Module["dynCall_vidi"] = (function() {
    return Module["asm"]["dynCall_vidi"].apply(null, arguments)
});
var dynCall_viiffffffii = Module["dynCall_viiffffffii"] = (function() {
    return Module["asm"]["dynCall_viiffffffii"].apply(null, arguments)
});
var dynCall_diid = Module["dynCall_diid"] = (function() {
    return Module["asm"]["dynCall_diid"].apply(null, arguments)
});
var dynCall_ji = Module["dynCall_ji"] = (function() {
    return Module["asm"]["dynCall_ji"].apply(null, arguments)
});
var dynCall_iiffiiiiii = Module["dynCall_iiffiiiiii"] = (function() {
    return Module["asm"]["dynCall_iiffiiiiii"].apply(null, arguments)
});
var dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_viiiiiiiiii"].apply(null, arguments)
});
var dynCall_vifffiii = Module["dynCall_vifffiii"] = (function() {
    return Module["asm"]["dynCall_vifffiii"].apply(null, arguments)
});
var dynCall_iiiiffiiiiiii = Module["dynCall_iiiiffiiiiiii"] = (function() {
    return Module["asm"]["dynCall_iiiiffiiiiiii"].apply(null, arguments)
});
var dynCall_diii = Module["dynCall_diii"] = (function() {
    return Module["asm"]["dynCall_diii"].apply(null, arguments)
});
var dynCall_iiiddii = Module["dynCall_iiiddii"] = (function() {
    return Module["asm"]["dynCall_iiiddii"].apply(null, arguments)
});
var dynCall_fiiiiiiii = Module["dynCall_fiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_fiiiiiiii"].apply(null, arguments)
});
var dynCall_vifiiiiiii = Module["dynCall_vifiiiiiii"] = (function() {
    return Module["asm"]["dynCall_vifiiiiiii"].apply(null, arguments)
});
var dynCall_iiiffi = Module["dynCall_iiiffi"] = (function() {
    return Module["asm"]["dynCall_iiiffi"].apply(null, arguments)
});
var dynCall_fiiii = Module["dynCall_fiiii"] = (function() {
    return Module["asm"]["dynCall_fiiii"].apply(null, arguments)
});
var dynCall_iiiiii = Module["dynCall_iiiiii"] = (function() {
    return Module["asm"]["dynCall_iiiiii"].apply(null, arguments)
});
var dynCall_iiiiiifiii = Module["dynCall_iiiiiifiii"] = (function() {
    return Module["asm"]["dynCall_iiiiiifiii"].apply(null, arguments)
});
var dynCall_viiiifii = Module["dynCall_viiiifii"] = (function() {
    return Module["asm"]["dynCall_viiiifii"].apply(null, arguments)
});
var dynCall_iiiffffiifii = Module["dynCall_iiiffffiifii"] = (function() {
    return Module["asm"]["dynCall_iiiffffiifii"].apply(null, arguments)
});
var dynCall_vijii = Module["dynCall_vijii"] = (function() {
    return Module["asm"]["dynCall_vijii"].apply(null, arguments)
});
var dynCall_iiiiffi = Module["dynCall_iiiiffi"] = (function() {
    return Module["asm"]["dynCall_iiiiffi"].apply(null, arguments)
});
var dynCall_viffii = Module["dynCall_viffii"] = (function() {
    return Module["asm"]["dynCall_viffii"].apply(null, arguments)
});
var dynCall_viiij = Module["dynCall_viiij"] = (function() {
    return Module["asm"]["dynCall_viiij"].apply(null, arguments)
});
var dynCall_iiiiiifiif = Module["dynCall_iiiiiifiif"] = (function() {
    return Module["asm"]["dynCall_iiiiiifiif"].apply(null, arguments)
});
var dynCall_iiiiif = Module["dynCall_iiiiif"] = (function() {
    return Module["asm"]["dynCall_iiiiif"].apply(null, arguments)
});
var dynCall_viiiifiif = Module["dynCall_viiiifiif"] = (function() {
    return Module["asm"]["dynCall_viiiifiif"].apply(null, arguments)
});
var dynCall_iiijji = Module["dynCall_iiijji"] = (function() {
    return Module["asm"]["dynCall_iiijji"].apply(null, arguments)
});
var dynCall_viiffffffffiiii = Module["dynCall_viiffffffffiiii"] = (function() {
    return Module["asm"]["dynCall_viiffffffffiiii"].apply(null, arguments)
});
var dynCall_jiijjjiiii = Module["dynCall_jiijjjiiii"] = (function() {
    return Module["asm"]["dynCall_jiijjjiiii"].apply(null, arguments)
});
var dynCall_vid = Module["dynCall_vid"] = (function() {
    return Module["asm"]["dynCall_vid"].apply(null, arguments)
});
var dynCall_iiidi = Module["dynCall_iiidi"] = (function() {
    return Module["asm"]["dynCall_iiidi"].apply(null, arguments)
});
var dynCall_vij = Module["dynCall_vij"] = (function() {
    return Module["asm"]["dynCall_vij"].apply(null, arguments)
});
var dynCall_iiiiiffii = Module["dynCall_iiiiiffii"] = (function() {
    return Module["asm"]["dynCall_iiiiiffii"].apply(null, arguments)
});
var dynCall_vii = Module["dynCall_vii"] = (function() {
    return Module["asm"]["dynCall_vii"].apply(null, arguments)
});
var dynCall_viiiid = Module["dynCall_viiiid"] = (function() {
    return Module["asm"]["dynCall_viiiid"].apply(null, arguments)
});
var dynCall_vijji = Module["dynCall_vijji"] = (function() {
    return Module["asm"]["dynCall_vijji"].apply(null, arguments)
});
var dynCall_fiifiii = Module["dynCall_fiifiii"] = (function() {
    return Module["asm"]["dynCall_fiifiii"].apply(null, arguments)
});
var dynCall_iiffiiii = Module["dynCall_iiffiiii"] = (function() {
    return Module["asm"]["dynCall_iiffiiii"].apply(null, arguments)
});
var dynCall_iifiiiiiiii = Module["dynCall_iifiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_iifiiiiiiii"].apply(null, arguments)
});
var dynCall_vff = Module["dynCall_vff"] = (function() {
    return Module["asm"]["dynCall_vff"].apply(null, arguments)
});
var dynCall_viifii = Module["dynCall_viifii"] = (function() {
    return Module["asm"]["dynCall_viifii"].apply(null, arguments)
});
var dynCall_fi = Module["dynCall_fi"] = (function() {
    return Module["asm"]["dynCall_fi"].apply(null, arguments)
});
var dynCall_viiiii = Module["dynCall_viiiii"] = (function() {
    return Module["asm"]["dynCall_viiiii"].apply(null, arguments)
});
var dynCall_jiiiiiiii = Module["dynCall_jiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_jiiiiiiii"].apply(null, arguments)
});
var dynCall_vf = Module["dynCall_vf"] = (function() {
    return Module["asm"]["dynCall_vf"].apply(null, arguments)
});
var dynCall_iiiidii = Module["dynCall_iiiidii"] = (function() {
    return Module["asm"]["dynCall_iiiidii"].apply(null, arguments)
});
var dynCall_iiiiffffi = Module["dynCall_iiiiffffi"] = (function() {
    return Module["asm"]["dynCall_iiiiffffi"].apply(null, arguments)
});
var dynCall_iiiiiiifi = Module["dynCall_iiiiiiifi"] = (function() {
    return Module["asm"]["dynCall_iiiiiiifi"].apply(null, arguments)
});
var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = (function() {
    return Module["asm"]["dynCall_viiiiiiii"].apply(null, arguments)
});
var dynCall_vifiii = Module["dynCall_vifiii"] = (function() {
    return Module["asm"]["dynCall_vifiii"].apply(null, arguments)
});
var dynCall_fiiiiiifiiiif = Module["dynCall_fiiiiiifiiiif"] = (function() {
    return Module["asm"]["dynCall_fiiiiiifiiiif"].apply(null, arguments)
});
var dynCall_viiiij = Module["dynCall_viiiij"] = (function() {
    return Module["asm"]["dynCall_viiiij"].apply(null, arguments)
});
var dynCall_iijjji = Module["dynCall_iijjji"] = (function() {
    return Module["asm"]["dynCall_iijjji"].apply(null, arguments)
});
var dynCall_viiiifiiiiif = Module["dynCall_viiiifiiiiif"] = (function() {
    return Module["asm"]["dynCall_viiiifiiiiif"].apply(null, arguments)
});
var dynCall_viiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_viiiiiiiiiiiii"].apply(null, arguments)
});
var dynCall_vifiiiiiiii = Module["dynCall_vifiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_vifiiiiiiii"].apply(null, arguments)
});
var dynCall_iiiiifi = Module["dynCall_iiiiifi"] = (function() {
    return Module["asm"]["dynCall_iiiiifi"].apply(null, arguments)
});
var dynCall_fifiii = Module["dynCall_fifiii"] = (function() {
    return Module["asm"]["dynCall_fifiii"].apply(null, arguments)
});
var dynCall_viji = Module["dynCall_viji"] = (function() {
    return Module["asm"]["dynCall_viji"].apply(null, arguments)
});
var dynCall_iid = Module["dynCall_iid"] = (function() {
    return Module["asm"]["dynCall_iid"].apply(null, arguments)
});
var dynCall_iif = Module["dynCall_iif"] = (function() {
    return Module["asm"]["dynCall_iif"].apply(null, arguments)
});
var dynCall_vifiiii = Module["dynCall_vifiiii"] = (function() {
    return Module["asm"]["dynCall_vifiiii"].apply(null, arguments)
});
var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = (function() {
    return Module["asm"]["dynCall_viiiiiii"].apply(null, arguments)
});
var dynCall_vifii = Module["dynCall_vifii"] = (function() {
    return Module["asm"]["dynCall_vifii"].apply(null, arguments)
});
var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_viiiiiiiii"].apply(null, arguments)
});
var dynCall_iii = Module["dynCall_iii"] = (function() {
    return Module["asm"]["dynCall_iii"].apply(null, arguments)
});
var dynCall_iijjiii = Module["dynCall_iijjiii"] = (function() {
    return Module["asm"]["dynCall_iijjiii"].apply(null, arguments)
});
var dynCall_iij = Module["dynCall_iij"] = (function() {
    return Module["asm"]["dynCall_iij"].apply(null, arguments)
});
var dynCall_iiiifii = Module["dynCall_iiiifii"] = (function() {
    return Module["asm"]["dynCall_iiiifii"].apply(null, arguments)
});
var dynCall_f = Module["dynCall_f"] = (function() {
    return Module["asm"]["dynCall_f"].apply(null, arguments)
});
var dynCall_jiiii = Module["dynCall_jiiii"] = (function() {
    return Module["asm"]["dynCall_jiiii"].apply(null, arguments)
});
var dynCall_iiiiiifi = Module["dynCall_iiiiiifi"] = (function() {
    return Module["asm"]["dynCall_iiiiiifi"].apply(null, arguments)
});
var dynCall_i = Module["dynCall_i"] = (function() {
    return Module["asm"]["dynCall_i"].apply(null, arguments)
});
var dynCall_iiiiffii = Module["dynCall_iiiiffii"] = (function() {
    return Module["asm"]["dynCall_iiiiffii"].apply(null, arguments)
});
var dynCall_viififi = Module["dynCall_viififi"] = (function() {
    return Module["asm"]["dynCall_viififi"].apply(null, arguments)
});
var dynCall_iijiii = Module["dynCall_iijiii"] = (function() {
    return Module["asm"]["dynCall_iijiii"].apply(null, arguments)
});
var dynCall_viiiifi = Module["dynCall_viiiifi"] = (function() {
    return Module["asm"]["dynCall_viiiifi"].apply(null, arguments)
});
var dynCall_iijiiii = Module["dynCall_iijiiii"] = (function() {
    return Module["asm"]["dynCall_iijiiii"].apply(null, arguments)
});
var dynCall_viid = Module["dynCall_viid"] = (function() {
    return Module["asm"]["dynCall_viid"].apply(null, arguments)
});
var dynCall_iiji = Module["dynCall_iiji"] = (function() {
    return Module["asm"]["dynCall_iiji"].apply(null, arguments)
});
var dynCall_iijj = Module["dynCall_iijj"] = (function() {
    return Module["asm"]["dynCall_iijj"].apply(null, arguments)
});
var dynCall_fifii = Module["dynCall_fifii"] = (function() {
    return Module["asm"]["dynCall_fifii"].apply(null, arguments)
});
var dynCall_iiiifi = Module["dynCall_iiiifi"] = (function() {
    return Module["asm"]["dynCall_iiiifi"].apply(null, arguments)
});
var dynCall_vd = Module["dynCall_vd"] = (function() {
    return Module["asm"]["dynCall_vd"].apply(null, arguments)
});
var dynCall_viifi = Module["dynCall_viifi"] = (function() {
    return Module["asm"]["dynCall_viifi"].apply(null, arguments)
});
var dynCall_fiifi = Module["dynCall_fiifi"] = (function() {
    return Module["asm"]["dynCall_fiifi"].apply(null, arguments)
});
var dynCall_vi = Module["dynCall_vi"] = (function() {
    return Module["asm"]["dynCall_vi"].apply(null, arguments)
});
var dynCall_viiiff = Module["dynCall_viiiff"] = (function() {
    return Module["asm"]["dynCall_viiiff"].apply(null, arguments)
});
var dynCall_iiiiiiiiiii = Module["dynCall_iiiiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_iiiiiiiiiii"].apply(null, arguments)
});
var dynCall_ii = Module["dynCall_ii"] = (function() {
    return Module["asm"]["dynCall_ii"].apply(null, arguments)
});
var dynCall_iiiff = Module["dynCall_iiiff"] = (function() {
    return Module["asm"]["dynCall_iiiff"].apply(null, arguments)
});
var dynCall_viiifif = Module["dynCall_viiifif"] = (function() {
    return Module["asm"]["dynCall_viiifif"].apply(null, arguments)
});
var dynCall_iijji = Module["dynCall_iijji"] = (function() {
    return Module["asm"]["dynCall_iijji"].apply(null, arguments)
});
var dynCall_iiiiifiiiiif = Module["dynCall_iiiiifiiiiif"] = (function() {
    return Module["asm"]["dynCall_iiiiifiiiiif"].apply(null, arguments)
});
var dynCall_viiff = Module["dynCall_viiff"] = (function() {
    return Module["asm"]["dynCall_viiff"].apply(null, arguments)
});
var dynCall_viiiiffi = Module["dynCall_viiiiffi"] = (function() {
    return Module["asm"]["dynCall_viiiiffi"].apply(null, arguments)
});
var dynCall_iifi = Module["dynCall_iifi"] = (function() {
    return Module["asm"]["dynCall_iifi"].apply(null, arguments)
});
var dynCall_vidii = Module["dynCall_vidii"] = (function() {
    return Module["asm"]["dynCall_vidii"].apply(null, arguments)
});
var dynCall_viiif = Module["dynCall_viiif"] = (function() {
    return Module["asm"]["dynCall_viiif"].apply(null, arguments)
});
var dynCall_vidiiii = Module["dynCall_vidiiii"] = (function() {
    return Module["asm"]["dynCall_vidiiii"].apply(null, arguments)
});
var dynCall_iiiffii = Module["dynCall_iiiffii"] = (function() {
    return Module["asm"]["dynCall_iiiffii"].apply(null, arguments)
});
var dynCall_iiifi = Module["dynCall_iiifi"] = (function() {
    return Module["asm"]["dynCall_iiifi"].apply(null, arguments)
});
var dynCall_iiii = Module["dynCall_iiii"] = (function() {
    return Module["asm"]["dynCall_iiii"].apply(null, arguments)
});
var dynCall_iidiiii = Module["dynCall_iidiiii"] = (function() {
    return Module["asm"]["dynCall_iidiiii"].apply(null, arguments)
});
var dynCall_iiij = Module["dynCall_iiij"] = (function() {
    return Module["asm"]["dynCall_iiij"].apply(null, arguments)
});
var dynCall_viifff = Module["dynCall_viifff"] = (function() {
    return Module["asm"]["dynCall_viifff"].apply(null, arguments)
});
var dynCall_iiiiiiifiif = Module["dynCall_iiiiiiifiif"] = (function() {
    return Module["asm"]["dynCall_iiiiiiifiif"].apply(null, arguments)
});
var dynCall_vifiiifiiiiiiii = Module["dynCall_vifiiifiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_vifiiifiiiiiiii"].apply(null, arguments)
});
var dynCall_vifiifi = Module["dynCall_vifiifi"] = (function() {
    return Module["asm"]["dynCall_vifiifi"].apply(null, arguments)
});
var dynCall_iiif = Module["dynCall_iiif"] = (function() {
    return Module["asm"]["dynCall_iiif"].apply(null, arguments)
});
var dynCall_viffiii = Module["dynCall_viffiii"] = (function() {
    return Module["asm"]["dynCall_viffiii"].apply(null, arguments)
});
var dynCall_fiiiiiifi = Module["dynCall_fiiiiiifi"] = (function() {
    return Module["asm"]["dynCall_fiiiiiifi"].apply(null, arguments)
});
var dynCall_jiiiiii = Module["dynCall_jiiiiii"] = (function() {
    return Module["asm"]["dynCall_jiiiiii"].apply(null, arguments)
});
var dynCall_fiiiiifi = Module["dynCall_fiiiiifi"] = (function() {
    return Module["asm"]["dynCall_fiiiiifi"].apply(null, arguments)
});
var dynCall_viiifi = Module["dynCall_viiifi"] = (function() {
    return Module["asm"]["dynCall_viiifi"].apply(null, arguments)
});
var dynCall_viffffff = Module["dynCall_viffffff"] = (function() {
    return Module["asm"]["dynCall_viffffff"].apply(null, arguments)
});
var dynCall_iiiiiiiiiiiii = Module["dynCall_iiiiiiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_iiiiiiiiiiiii"].apply(null, arguments)
});
var dynCall_iiiifiii = Module["dynCall_iiiifiii"] = (function() {
    return Module["asm"]["dynCall_iiiifiii"].apply(null, arguments)
});
var dynCall_iiiifiiiii = Module["dynCall_iiiifiiiii"] = (function() {
    return Module["asm"]["dynCall_iiiifiiiii"].apply(null, arguments)
});
var dynCall_iijii = Module["dynCall_iijii"] = (function() {
    return Module["asm"]["dynCall_iijii"].apply(null, arguments)
});
var dynCall_viifiifi = Module["dynCall_viifiifi"] = (function() {
    return Module["asm"]["dynCall_viifiifi"].apply(null, arguments)
});
var dynCall_viffffffffffffiiii = Module["dynCall_viffffffffffffiiii"] = (function() {
    return Module["asm"]["dynCall_viffffffffffffiiii"].apply(null, arguments)
});
var dynCall_vfi = Module["dynCall_vfi"] = (function() {
    return Module["asm"]["dynCall_vfi"].apply(null, arguments)
});
var dynCall_iififi = Module["dynCall_iififi"] = (function() {
    return Module["asm"]["dynCall_iififi"].apply(null, arguments)
});
var dynCall_iiiiidii = Module["dynCall_iiiiidii"] = (function() {
    return Module["asm"]["dynCall_iiiiidii"].apply(null, arguments)
});
var dynCall_jiij = Module["dynCall_jiij"] = (function() {
    return Module["asm"]["dynCall_jiij"].apply(null, arguments)
});
var dynCall_viifiiff = Module["dynCall_viifiiff"] = (function() {
    return Module["asm"]["dynCall_viifiiff"].apply(null, arguments)
});
var dynCall_viiffffiiii = Module["dynCall_viiffffiiii"] = (function() {
    return Module["asm"]["dynCall_viiffffiiii"].apply(null, arguments)
});
var dynCall_iiffffi = Module["dynCall_iiffffi"] = (function() {
    return Module["asm"]["dynCall_iiffffi"].apply(null, arguments)
});
var dynCall_iiiiiiiif = Module["dynCall_iiiiiiiif"] = (function() {
    return Module["asm"]["dynCall_iiiiiiiif"].apply(null, arguments)
});
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = (function() {
    return Module["asm"]["dynCall_iiiiiiiii"].apply(null, arguments)
});
var dynCall_viiii = Module["dynCall_viiii"] = (function() {
    return Module["asm"]["dynCall_viiii"].apply(null, arguments)
});
var dynCall_viffffi = Module["dynCall_viffffi"] = (function() {
    return Module["asm"]["dynCall_viffffi"].apply(null, arguments)
});
Runtime.stackAlloc = Module["stackAlloc"];
Runtime.stackSave = Module["stackSave"];
Runtime.stackRestore = Module["stackRestore"];
Runtime.establishStackSpace = Module["establishStackSpace"];
Runtime.setTempRet0 = Module["setTempRet0"];
Runtime.getTempRet0 = Module["getTempRet0"];
Module["asm"] = asm;
if (memoryInitializer) {
    if (typeof Module["locateFile"] === "function") {
        memoryInitializer = Module["locateFile"](memoryInitializer)
    } else if (Module["memoryInitializerPrefixURL"]) {
        memoryInitializer = Module["memoryInitializerPrefixURL"] + memoryInitializer
    }
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
        var data = Module["readBinary"](memoryInitializer);
        HEAPU8.set(data, Runtime.GLOBAL_BASE)
    } else {
        addRunDependency("memory initializer");
        var applyMemoryInitializer = (function(data) {
            if (data.byteLength) data = new Uint8Array(data);
            HEAPU8.set(data, Runtime.GLOBAL_BASE);
            if (Module["memoryInitializerRequest"]) delete Module["memoryInitializerRequest"].response;
            removeRunDependency("memory initializer")
        });

        function doBrowserLoad() {
            Module["readAsync"](memoryInitializer, applyMemoryInitializer, (function() {
                throw "could not load memory initializer " + memoryInitializer
            }))
        }
        if (Module["memoryInitializerRequest"]) {
            function useRequest() {
                var request = Module["memoryInitializerRequest"];
                if (request.status !== 200 && request.status !== 0) {
                    console.warn("a problem seems to have happened with Module.memoryInitializerRequest, status: " + request.status + ", retrying " + memoryInitializer);
                    doBrowserLoad();
                    return
                }
                applyMemoryInitializer(request.response)
            }
            if (Module["memoryInitializerRequest"].response) {
                setTimeout(useRequest, 0)
            } else {
                Module["memoryInitializerRequest"].addEventListener("load", useRequest)
            }
        } else {
            doBrowserLoad()
        }
    }
}

function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status
}
ExitStatus.prototype = new Error;
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
var preloadStartTime = null;
var calledMain = false;
dependenciesFulfilled = function runCaller() {
    if (!Module["calledRun"]) run();
    if (!Module["calledRun"]) dependenciesFulfilled = runCaller
};
Module["callMain"] = Module.callMain = function callMain(args) {
    args = args || [];
    ensureInitRuntime();
    var argc = args.length + 1;

    function pad() {
        for (var i = 0; i < 4 - 1; i++) {
            argv.push(0)
        }
    }
    var argv = [allocate(intArrayFromString(Module["thisProgram"]), "i8", ALLOC_NORMAL)];
    pad();
    for (var i = 0; i < argc - 1; i = i + 1) {
        argv.push(allocate(intArrayFromString(args[i]), "i8", ALLOC_NORMAL));
        pad()
    }
    argv.push(0);
    argv = allocate(argv, "i32", ALLOC_NORMAL);
    try {
        var ret = Module["_main"](argc, argv, 0);
        exit(ret, true)
    } catch (e) {
        if (e instanceof ExitStatus) {
            return
        } else if (e == "SimulateInfiniteLoop") {
            Module["noExitRuntime"] = true;
            return
        } else {
            if (e && typeof e === "object" && e.stack) Module.printErr("exception thrown: " + [e, e.stack]);
            throw e
        }
    } finally {
        calledMain = true
    }
};

function run(args) {
    args = args || Module["arguments"];
    if (preloadStartTime === null) preloadStartTime = Date.now();
    if (runDependencies > 0) {
        return
    }
    preRun();
    if (runDependencies > 0) return;
    if (Module["calledRun"]) return;

    function doRun() {
        if (Module["calledRun"]) return;
        Module["calledRun"] = true;
        if (ABORT) return;
        ensureInitRuntime();
        preMain();
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        if (Module["_main"] && shouldRunNow) Module["callMain"](args);
        postRun()
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout((function() {
            setTimeout((function() {
                Module["setStatus"]("")
            }), 1);
            doRun()
        }), 1)
    } else {
        doRun()
    }
}
Module["run"] = Module.run = run;

function exit(status, implicit) {
    if (implicit && Module["noExitRuntime"]) {
        return
    }
    if (Module["noExitRuntime"]) {} else {
        ABORT = true;
        EXITSTATUS = status;
        STACKTOP = initialStackTop;
        exitRuntime();
        if (Module["onExit"]) Module["onExit"](status)
    }
    if (ENVIRONMENT_IS_NODE) {
        process["exit"](status)
    } else if (ENVIRONMENT_IS_SHELL && typeof quit === "function") {
        quit(status)
    }
    throw new ExitStatus(status)
}
Module["exit"] = Module.exit = exit;
var abortDecorators = [];

function abort(what) {
    if (what !== undefined) {
        Module.print(what);
        Module.printErr(what);
        what = JSON.stringify(what)
    } else {
        what = ""
    }
    ABORT = true;
    EXITSTATUS = 1;
    var extra = "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";
    var output = "abort(" + what + ") at " + stackTrace() + extra;
    if (abortDecorators) {
        abortDecorators.forEach((function(decorator) {
            output = decorator(output, what)
        }))
    }
    throw output
}
Module["abort"] = Module.abort = abort;
if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
    }
}
var shouldRunNow = true;
if (Module["noInitialRun"]) {
    shouldRunNow = false
}
Module["noExitRuntime"] = true;
run()