// This is ammo.js, a port of Bullet Physics to JavaScript. zlib licensed.
var Ammo = function(Ammo) {
    Ammo = Ammo || {};

    var b;
    b || (b = typeof Ammo !== 'undefined' ? Ammo : {});
    var aa = {},
        ba;
    for (ba in b) b.hasOwnProperty(ba) && (aa[ba] = b[ba]);
    b.arguments = [];
    b.thisProgram = "./this.program";
    b.quit = function(a, c) {
        throw c;
    };
    b.preRun = [];
    b.postRun = [];
    var ca = !1,
        da = !1,
        ea = !1,
        fa = !1;
    if (b.ENVIRONMENT)
        if ("WEB" === b.ENVIRONMENT) ca = !0;
        else if ("WORKER" === b.ENVIRONMENT) da = !0;
    else if ("NODE" === b.ENVIRONMENT) ea = !0;
    else if ("SHELL" === b.ENVIRONMENT) fa = !0;
    else throw Error("Module['ENVIRONMENT'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL.");
    else ca = "object" === typeof window, da = "function" === typeof importScripts, ea = "object" === typeof process && "function" === typeof require && !ca && !da, fa = !ca && !ea && !da;
    if (ea) {
        var ha, ia;
        b.read = function(a, c) {
            ha || (ha = require("fs"));
            ia || (ia = require("path"));
            a = ia.normalize(a);
            a = ha.readFileSync(a);
            return c ? a : a.toString()
        };
        b.readBinary = function(a) {
            a = b.read(a, !0);
            a.buffer || (a = new Uint8Array(a));
            assert(a.buffer);
            return a
        };
        1 < process.argv.length && (b.thisProgram = process.argv[1].replace(/\\/g, "/"));
        b.arguments = process.argv.slice(2);
        process.on("uncaughtException", function(a) {
            if (!(a instanceof ja)) throw a;
        });
        process.on("unhandledRejection", function() {
            process.exit(1)
        });
        b.inspect =
            function() {
                return "[Emscripten Module object]"
            }
    } else if (fa) "undefined" != typeof read && (b.read = function(a) {
        return read(a)
    }), b.readBinary = function(a) {
        if ("function" === typeof readbuffer) return new Uint8Array(readbuffer(a));
        a = read(a, "binary");
        assert("object" === typeof a);
        return a
    }, "undefined" != typeof scriptArgs ? b.arguments = scriptArgs : "undefined" != typeof arguments && (b.arguments = arguments), "function" === typeof quit && (b.quit = function(a) {
        quit(a)
    });
    else if (ca || da) b.read = function(a) {
        var c = new XMLHttpRequest;
        c.open("GET",
            a, !1);
        c.send(null);
        return c.responseText
    }, da && (b.readBinary = function(a) {
        var c = new XMLHttpRequest;
        c.open("GET", a, !1);
        c.responseType = "arraybuffer";
        c.send(null);
        return new Uint8Array(c.response)
    }), b.readAsync = function(a, c, d) {
        var e = new XMLHttpRequest;
        e.open("GET", a, !0);
        e.responseType = "arraybuffer";
        e.onload = function() {
            200 == e.status || 0 == e.status && e.response ? c(e.response) : d()
        };
        e.onerror = d;
        e.send(null)
    }, "undefined" != typeof arguments && (b.arguments = arguments), b.setWindowTitle = function(a) {
        document.title = a
    };
    b.print = "undefined" !== typeof console ? console.log : "undefined" !== typeof print ? print : null;
    b.printErr = "undefined" !== typeof printErr ? printErr : "undefined" !== typeof console && console.warn || b.print;
    b.print = b.print;
    b.printErr = b.printErr;
    for (ba in aa) aa.hasOwnProperty(ba) && (b[ba] = aa[ba]);
    aa = void 0;

    function ka(a) {
        var c;
        c || (c = 16);
        return Math.ceil(a / c) * c
    }
    var la = 0;

    function assert(a, c) {
        a || ma("Assertion failed: " + c)
    }
    var na = "undefined" !== typeof TextDecoder ? new TextDecoder("utf8") : void 0;
    "undefined" !== typeof TextDecoder && new TextDecoder("utf-16le");
    var buffer, oa, pa, qa, ra;

    function sa() {
        b.HEAP8 = new Int8Array(buffer);
        b.HEAP16 = pa = new Int16Array(buffer);
        b.HEAP32 = qa = new Int32Array(buffer);
        b.HEAPU8 = oa = new Uint8Array(buffer);
        b.HEAPU16 = new Uint16Array(buffer);
        b.HEAPU32 = new Uint32Array(buffer);
        b.HEAPF32 = ra = new Float32Array(buffer);
        b.HEAPF64 = new Float64Array(buffer)
    }
    var ta, ua, va, wa, xa, ya, za, Aa;
    ta = ua = wa = xa = ya = za = Aa = 0;
    va = !1;

    function Ba() {
        ma("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + Ca + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")
    }
    var Da = b.TOTAL_STACK || 5242880,
        Ca = b.TOTAL_MEMORY || 67108864;
    Ca < Da && b.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was " + Ca + "! (TOTAL_STACK=" + Da + ")");
    b.buffer ? buffer = b.buffer : ("object" === typeof WebAssembly && "function" === typeof WebAssembly.Memory ? (b.wasmMemory = new WebAssembly.Memory({
        initial: Ca / 65536,
        maximum: Ca / 65536
    }), buffer = b.wasmMemory.buffer) : buffer = new ArrayBuffer(Ca), b.buffer = buffer);
    sa();
    qa[0] = 1668509029;
    pa[1] = 25459;
    if (115 !== oa[2] || 99 !== oa[3]) throw "Runtime error: expected the system to be little-endian!";

    function Ea(a) {
        for (; 0 < a.length;) {
            var c = a.shift();
            if ("function" == typeof c) c();
            else {
                var d = c.o;
                "number" === typeof d ? void 0 === c.f ? b.dynCall_v(d) : b.dynCall_vi(d, c.f) : d(void 0 === c.f ? null : c.f)
            }
        }
    }
    var Fa = [],
        Ga = [],
        Ha = [],
        Ia = [],
        Ja = [],
        Ka = !1;

    function La() {
        var a = b.preRun.shift();
        Fa.unshift(a)
    }
    var Ma = 0,
        Na = null,
        Oa = null;
    b.preloadedImages = {};
    b.preloadedAudios = {};

    function Pa(a) {
        return String.prototype.startsWith ? a.startsWith("data:application/octet-stream;base64,") : 0 === a.indexOf("data:application/octet-stream;base64,")
    }
    (function() {
        function a() {
            try {
                if (b.wasmBinary) return new Uint8Array(b.wasmBinary);
                if (b.readBinary) return b.readBinary(f);
                throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";
            } catch (Xb) {
                ma(Xb)
            }
        }

        function c() {
            return b.wasmBinary || !ca && !da || "function" !== typeof fetch ? new Promise(function(c) {
                c(a())
            }) : fetch(f, {
                credentials: "same-origin"
            }).then(function(a) {
                if (!a.ok) throw "failed to load wasm binary file at '" +
                    f + "'";
                return a.arrayBuffer()
            }).catch(function() {
                return a()
            })
        }

        function d(a) {
            function d(a) {
                t = a.exports;
                if (t.memory) {
                    a = t.memory;
                    var c = b.buffer;
                    a.byteLength < c.byteLength && b.printErr("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");
                    c = new Int8Array(c);
                    (new Int8Array(a)).set(c);
                    b.buffer = buffer = a;
                    sa()
                }
                b.asm = t;
                b.usingWasm = !0;
                Ma--;
                b.monitorRunDependencies && b.monitorRunDependencies(Ma);
                0 == Ma && (null !== Na && (clearInterval(Na), Na = null), Oa && (a = Oa, Oa = null,
                    a()))
            }

            function e(a) {
                d(a.instance)
            }

            function h(a) {
                c().then(function(a) {
                    return WebAssembly.instantiate(a, l)
                }).then(a).catch(function(a) {
                    b.printErr("failed to asynchronously prepare wasm: " + a);
                    ma(a)
                })
            }
            if ("object" !== typeof WebAssembly) return b.printErr("no native wasm support detected"), !1;
            if (!(b.wasmMemory instanceof WebAssembly.Memory)) return b.printErr("no native wasm Memory in use"), !1;
            a.memory = b.wasmMemory;
            l.global = {
                NaN: NaN,
                Infinity: Infinity
            };
            l["global.Math"] = Math;
            l.env = a;
            Ma++;
            b.monitorRunDependencies &&
                b.monitorRunDependencies(Ma);
            if (b.instantiateWasm) try {
                return b.instantiateWasm(l, d)
            } catch (rc) {
                return b.printErr("Module.instantiateWasm callback failed with error: " + rc), !1
            }
            b.wasmBinary || "function" !== typeof WebAssembly.instantiateStreaming || Pa(f) || "function" !== typeof fetch ? h(e) : WebAssembly.instantiateStreaming(fetch(f, {
                credentials: "same-origin"
            }), l).then(e).catch(function(a) {
                b.printErr("wasm streaming compile failed: " + a);
                b.printErr("falling back to ArrayBuffer instantiation");
                h(e)
            });
            return {}
        }
        var e =
            "ammo.wasm.wast",
            f = "ammo_profiled.wasm",
            h = "ammo.wasm.temp.asm.js";
        "function" === typeof b.locateFile && (Pa(e) || (e = b.locateFile(e)), Pa(f) || (f = b.locateFile(f)), Pa(h) || (h = b.locateFile(h)));
        var l = {
                global: null,
                env: null,
                asm2wasm: {
                    "f64-rem": function(a, c) {
                        return a % c
                    },
                    "debugger": function() {
                        debugger
                    }
                },
                parent: b
            },
            t = null;
        b.asmPreload = b.asm;
        var E = b.reallocBuffer;
        b.reallocBuffer = function(a) {
            if ("asmjs" === Sa) var c = E(a);
            else a: {
                var d = b.usingWasm ? 65536 : 16777216;0 < a % d && (a += d - a % d);d = b.buffer.byteLength;
                if (b.usingWasm) try {
                    c = -1 !== b.wasmMemory.grow((a - d) / 65536) ? b.buffer = b.wasmMemory.buffer : null;
                    break a
                } catch (ky) {
                    c = null;
                    break a
                }
                c = void 0
            }
            return c
        };
        var Sa = "";
        b.asm = function(a, c) {
            if (!c.table) {
                a = b.wasmTableSize;
                void 0 === a && (a = 1024);
                var e = b.wasmMaxTableSize;
                c.table = "object" === typeof WebAssembly && "function" === typeof WebAssembly.Table ? void 0 !== e ? new WebAssembly.Table({
                    initial: a,
                    maximum: e,
                    element: "anyfunc"
                }) : new WebAssembly.Table({
                    initial: a,
                    element: "anyfunc"
                }) : Array(a);
                b.wasmTable = c.table
            }
            c.memoryBase || (c.memoryBase = b.STATIC_BASE);
            c.tableBase || (c.tableBase = 0);
            (c = d(c)) || ma("no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods");
            return c
        }
    })();
    var Qa = [function(a, c, d, e, f, h, l, t) {
        a = b.getCache(b.ConcreteContactResultCallback)[a];
        if (!a.hasOwnProperty("addSingleResult")) throw "a JSImplementation must implement all functions, you forgot ConcreteContactResultCallback::addSingleResult.";
        return a.addSingleResult(c, d, e, f, h, l, t)
    }];
    ta = 1024;
    ua = ta + 27872;
    Ga.push({
        o: function() {
            Ra()
        }
    });
    b.STATIC_BASE = ta;
    b.STATIC_BUMP = 27872;
    ua += 16;
    var Ta = 0;

    function Ua() {
        Ta += 4;
        return qa[Ta - 4 >> 2]
    }
    var Va = {};

    function Wa(a, c) {
        Ta = c;
        try {
            var d = Ua(),
                e = Ua(),
                f = Ua();
            a = 0;
            Wa.i || (Wa.i = [null, [],
                []
            ], Wa.v = function(a, c) {
                var d = Wa.i[a];
                assert(d);
                if (0 === c || 10 === c) {
                    a = 1 === a ? b.print : b.printErr;
                    a: {
                        for (var e = c = 0; d[e];) ++e;
                        if (16 < e - c && d.subarray && na) c = na.decode(d.subarray(c, e));
                        else
                            for (e = "";;) {
                                var f = d[c++];
                                if (!f) {
                                    c = e;
                                    break a
                                }
                                if (f & 128) {
                                    var h = d[c++] & 63;
                                    if (192 == (f & 224)) e += String.fromCharCode((f & 31) << 6 | h);
                                    else {
                                        var l = d[c++] & 63;
                                        if (224 == (f & 240)) f = (f & 15) << 12 | h << 6 | l;
                                        else {
                                            var t = d[c++] & 63;
                                            if (240 == (f & 248)) f = (f & 7) << 18 | h << 12 | l << 6 | t;
                                            else {
                                                var E =
                                                    d[c++] & 63;
                                                if (248 == (f & 252)) f = (f & 3) << 24 | h << 18 | l << 12 | t << 6 | E;
                                                else {
                                                    var Sa = d[c++] & 63;
                                                    f = (f & 1) << 30 | h << 24 | l << 18 | t << 12 | E << 6 | Sa
                                                }
                                            }
                                        }
                                        65536 > f ? e += String.fromCharCode(f) : (f -= 65536, e += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023))
                                    }
                                } else e += String.fromCharCode(f)
                            }
                    }
                    a(c);
                    d.length = 0
                } else d.push(c)
            });
            for (c = 0; c < f; c++) {
                for (var h = qa[e + 8 * c >> 2], l = qa[e + (8 * c + 4) >> 2], t = 0; t < l; t++) Wa.v(d, oa[h + t]);
                a += l
            }
            return a
        } catch (E) {
            return "undefined" !== typeof FS && E instanceof FS.h || ma(E), -E.j
        }
    }
    var Xa = {},
        Ya = 1;

    function Za(a, c) {
        Za.g || (Za.g = {});
        a in Za.g || (b.dynCall_v(c), Za.g[a] = 1)
    }
    assert(!va);
    var $a = ua;
    ua = ua + 4 + 15 & -16;
    Aa = $a;
    wa = xa = ka(ua);
    ya = wa + Da;
    za = ka(ya);
    qa[Aa >> 2] = za;
    va = !0;
    b.wasmTableSize = 1393;
    b.wasmMaxTableSize = 1393;
    b.l = {};
    b.m = {
        abort: ma,
        enlargeMemory: function() {
            Ba()
        },
        getTotalMemory: function() {
            return Ca
        },
        abortOnCannotGrowMemory: Ba,
        ___cxa_pure_virtual: function() {
            la = !0;
            throw "Pure virtual function called!";
        },
        ___setErrNo: function(a) {
            b.___errno_location && (qa[b.___errno_location() >> 2] = a);
            return a
        },
        ___syscall140: function(a, c) {
            Ta = c;
            try {
                var d = Va.s();
                Ua();
                var e = Ua(),
                    f = Ua(),
                    h = Ua();
                FS.A(d, e, h);
                qa[f >> 2] = d.position;
                d.u && 0 === e && 0 === h && (d.u = null);
                return 0
            } catch (l) {
                return "undefined" !== typeof FS && l instanceof FS.h || ma(l), -l.j
            }
        },
        ___syscall146: Wa,
        ___syscall6: function(a, c) {
            Ta = c;
            try {
                var d = Va.s();
                FS.close(d);
                return 0
            } catch (e) {
                return "undefined" !== typeof FS && e instanceof FS.h || ma(e), -e.j
            }
        },
        _abort: function() {
            b.abort()
        },
        _emscripten_asm_const_diiiiiiii: function(a, c, d, e, f, h, l, t, E) {
            return Qa[a](c, d, e, f, h, l, t, E)
        },
        _emscripten_memcpy_big: function(a, c, d) {
            oa.set(oa.subarray(c, c + d), a);
            return a
        },
        _gettimeofday: function(a) {
            var c = Date.now();
            qa[a >> 2] = c / 1E3 | 0;
            qa[a + 4 >> 2] = c % 1E3 * 1E3 | 0;
            return 0
        },
        _llvm_trap: function() {
            ma("trap!")
        },
        _pthread_getspecific: function(a) {
            return Xa[a] ||
                0
        },
        _pthread_key_create: function(a) {
            if (0 == a) return 22;
            qa[a >> 2] = Ya;
            Xa[Ya] = 0;
            Ya++;
            return 0
        },
        _pthread_once: Za,
        _pthread_setspecific: function(a, c) {
            if (!(a in Xa)) return 22;
            Xa[a] = c;
            return 0
        },
        DYNAMICTOP_PTR: Aa,
        STACKTOP: xa
    };
    var ab = b.asm(b.l, b.m, buffer);
    b.asm = ab;
	
	function wasmProfiler() {
		if (b.asm != null && typeof b.asm._resetInstCounters === "function") {
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
				
			addCountLo[0] = b.asm._getI32AddCountLo();
			andCountLo[0] = b.asm._getI32AndCountLo();
			shlCountLo[0] = b.asm._getI32ShlCountLo();
			shrCountLo[0] = b.asm._getI32ShruCountLo();
			xorCountLo[0] = b.asm._getI32XorCountLo();
			addCountHi[0] = b.asm._getI32AddCountHi();
			andCountHi[0] = b.asm._getI32AndCountHi();
			shlCountHi[0] = b.asm._getI32ShlCountHi();
			shrCountHi[0] = b.asm._getI32ShruCountHi();
			xorCountHi[0] = b.asm._getI32XorCountHi();
			b.asm._resetInstCounters();	
			
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
	
    var Ra = b.__GLOBAL__sub_I_btQuickprof_cpp = function() {
            return b.asm.__GLOBAL__sub_I_btQuickprof_cpp.apply(null, arguments)
        },
        bb = b._emscripten_bind_Anchor___destroy___0 = function() {
            return b.asm._emscripten_bind_Anchor___destroy___0.apply(null, arguments)
        },
        cb = b._emscripten_bind_Anchor_get_m_body_0 = function() {
            return b.asm._emscripten_bind_Anchor_get_m_body_0.apply(null, arguments)
        },
        db = b._emscripten_bind_Anchor_get_m_c0_0 = function() {
            return b.asm._emscripten_bind_Anchor_get_m_c0_0.apply(null, arguments)
        },
        eb = b._emscripten_bind_Anchor_get_m_c1_0 =
        function() {
            return b.asm._emscripten_bind_Anchor_get_m_c1_0.apply(null, arguments)
        },
        fb = b._emscripten_bind_Anchor_get_m_c2_0 = function() {
            return b.asm._emscripten_bind_Anchor_get_m_c2_0.apply(null, arguments)
        },
        gb = b._emscripten_bind_Anchor_get_m_influence_0 = function() {
            return b.asm._emscripten_bind_Anchor_get_m_influence_0.apply(null, arguments)
        },
        hb = b._emscripten_bind_Anchor_get_m_local_0 = function() {
            return b.asm._emscripten_bind_Anchor_get_m_local_0.apply(null, arguments)
        },
        ib = b._emscripten_bind_Anchor_get_m_node_0 =
        function() {
            return b.asm._emscripten_bind_Anchor_get_m_node_0.apply(null, arguments)
        },
        jb = b._emscripten_bind_Anchor_set_m_body_1 = function() {
            return b.asm._emscripten_bind_Anchor_set_m_body_1.apply(null, arguments)
        },
        kb = b._emscripten_bind_Anchor_set_m_c0_1 = function() {
            return b.asm._emscripten_bind_Anchor_set_m_c0_1.apply(null, arguments)
        },
        lb = b._emscripten_bind_Anchor_set_m_c1_1 = function() {
            return b.asm._emscripten_bind_Anchor_set_m_c1_1.apply(null, arguments)
        },
        mb = b._emscripten_bind_Anchor_set_m_c2_1 = function() {
            return b.asm._emscripten_bind_Anchor_set_m_c2_1.apply(null,
                arguments)
        },
        nb = b._emscripten_bind_Anchor_set_m_influence_1 = function() {
            return b.asm._emscripten_bind_Anchor_set_m_influence_1.apply(null, arguments)
        },
        ob = b._emscripten_bind_Anchor_set_m_local_1 = function() {
            return b.asm._emscripten_bind_Anchor_set_m_local_1.apply(null, arguments)
        },
        pb = b._emscripten_bind_Anchor_set_m_node_1 = function() {
            return b.asm._emscripten_bind_Anchor_set_m_node_1.apply(null, arguments)
        },
        qb = b._emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2.apply(null,
                arguments)
        },
        rb = b._emscripten_bind_ClosestConvexResultCallback___destroy___0 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback___destroy___0.apply(null, arguments)
        },
        sb = b._emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0.apply(null, arguments)
        },
        tb = b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0.apply(null,
                arguments)
        },
        ub = b._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0.apply(null, arguments)
        },
        vb = b._emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0.apply(null, arguments)
        },
        wb = b._emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0.apply(null,
                arguments)
        },
        xb = b._emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0.apply(null, arguments)
        },
        yb = b._emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0.apply(null, arguments)
        },
        zb = b._emscripten_bind_ClosestConvexResultCallback_hasHit_0 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_hasHit_0.apply(null,
                arguments)
        },
        Ab = b._emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1.apply(null, arguments)
        },
        Bb = b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1.apply(null, arguments)
        },
        Cb = b._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1.apply(null,
                arguments)
        },
        Db = b._emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1.apply(null, arguments)
        },
        Eb = b._emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1.apply(null, arguments)
        },
        Fb = b._emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1.apply(null,
                arguments)
        },
        Gb = b._emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1 = function() {
            return b.asm._emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1.apply(null, arguments)
        },
        Hb = b._emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2.apply(null, arguments)
        },
        Ib = b._emscripten_bind_ClosestRayResultCallback___destroy___0 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback___destroy___0.apply(null,
                arguments)
        },
        Jb = b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0.apply(null, arguments)
        },
        Kb = b._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0.apply(null, arguments)
        },
        Lb = b._emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0.apply(null,
                arguments)
        },
        Mb = b._emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0.apply(null, arguments)
        },
        Nb = b._emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0.apply(null, arguments)
        },
        Ob = b._emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0.apply(null,
                arguments)
        },
        Pb = b._emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0.apply(null, arguments)
        },
        Qb = b._emscripten_bind_ClosestRayResultCallback_hasHit_0 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_hasHit_0.apply(null, arguments)
        },
        Rb = b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1.apply(null,
                arguments)
        },
        Sb = b._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1.apply(null, arguments)
        },
        Tb = b._emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1.apply(null, arguments)
        },
        Ub = b._emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1.apply(null,
                arguments)
        },
        Vb = b._emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1.apply(null, arguments)
        },
        Wb = b._emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1.apply(null, arguments)
        },
        Yb = b._emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1 = function() {
            return b.asm._emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1.apply(null,
                arguments)
        },
        Zb = b._emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0 = function() {
            return b.asm._emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0.apply(null, arguments)
        },
        $b = b._emscripten_bind_ConcreteContactResultCallback___destroy___0 = function() {
            return b.asm._emscripten_bind_ConcreteContactResultCallback___destroy___0.apply(null, arguments)
        },
        ac = b._emscripten_bind_ConcreteContactResultCallback_addSingleResult_7 = function() {
            return b.asm._emscripten_bind_ConcreteContactResultCallback_addSingleResult_7.apply(null,
                arguments)
        },
        bc = b._emscripten_bind_Config___destroy___0 = function() {
            return b.asm._emscripten_bind_Config___destroy___0.apply(null, arguments)
        },
        cc = b._emscripten_bind_Config_get_citerations_0 = function() {
            return b.asm._emscripten_bind_Config_get_citerations_0.apply(null, arguments)
        },
        dc = b._emscripten_bind_Config_get_collisions_0 = function() {
            return b.asm._emscripten_bind_Config_get_collisions_0.apply(null, arguments)
        },
        ec = b._emscripten_bind_Config_get_diterations_0 = function() {
            return b.asm._emscripten_bind_Config_get_diterations_0.apply(null,
                arguments)
        },
        fc = b._emscripten_bind_Config_get_kAHR_0 = function() {
            return b.asm._emscripten_bind_Config_get_kAHR_0.apply(null, arguments)
        },
        hc = b._emscripten_bind_Config_get_kCHR_0 = function() {
            return b.asm._emscripten_bind_Config_get_kCHR_0.apply(null, arguments)
        },
        ic = b._emscripten_bind_Config_get_kDF_0 = function() {
            return b.asm._emscripten_bind_Config_get_kDF_0.apply(null, arguments)
        },
        jc = b._emscripten_bind_Config_get_kDG_0 = function() {
            return b.asm._emscripten_bind_Config_get_kDG_0.apply(null, arguments)
        },
        kc = b._emscripten_bind_Config_get_kDP_0 =
        function() {
            return b.asm._emscripten_bind_Config_get_kDP_0.apply(null, arguments)
        },
        lc = b._emscripten_bind_Config_get_kKHR_0 = function() {
            return b.asm._emscripten_bind_Config_get_kKHR_0.apply(null, arguments)
        },
        mc = b._emscripten_bind_Config_get_kLF_0 = function() {
            return b.asm._emscripten_bind_Config_get_kLF_0.apply(null, arguments)
        },
        nc = b._emscripten_bind_Config_get_kMT_0 = function() {
            return b.asm._emscripten_bind_Config_get_kMT_0.apply(null, arguments)
        },
        oc = b._emscripten_bind_Config_get_kPR_0 = function() {
            return b.asm._emscripten_bind_Config_get_kPR_0.apply(null,
                arguments)
        },
        pc = b._emscripten_bind_Config_get_kSHR_0 = function() {
            return b.asm._emscripten_bind_Config_get_kSHR_0.apply(null, arguments)
        },
        qc = b._emscripten_bind_Config_get_kSKHR_CL_0 = function() {
            return b.asm._emscripten_bind_Config_get_kSKHR_CL_0.apply(null, arguments)
        },
        sc = b._emscripten_bind_Config_get_kSK_SPLT_CL_0 = function() {
            return b.asm._emscripten_bind_Config_get_kSK_SPLT_CL_0.apply(null, arguments)
        },
        tc = b._emscripten_bind_Config_get_kSRHR_CL_0 = function() {
            return b.asm._emscripten_bind_Config_get_kSRHR_CL_0.apply(null,
                arguments)
        },
        uc = b._emscripten_bind_Config_get_kSR_SPLT_CL_0 = function() {
            return b.asm._emscripten_bind_Config_get_kSR_SPLT_CL_0.apply(null, arguments)
        },
        vc = b._emscripten_bind_Config_get_kSSHR_CL_0 = function() {
            return b.asm._emscripten_bind_Config_get_kSSHR_CL_0.apply(null, arguments)
        },
        wc = b._emscripten_bind_Config_get_kSS_SPLT_CL_0 = function() {
            return b.asm._emscripten_bind_Config_get_kSS_SPLT_CL_0.apply(null, arguments)
        },
        xc = b._emscripten_bind_Config_get_kVCF_0 = function() {
            return b.asm._emscripten_bind_Config_get_kVCF_0.apply(null,
                arguments)
        },
        yc = b._emscripten_bind_Config_get_kVC_0 = function() {
            return b.asm._emscripten_bind_Config_get_kVC_0.apply(null, arguments)
        },
        zc = b._emscripten_bind_Config_get_maxvolume_0 = function() {
            return b.asm._emscripten_bind_Config_get_maxvolume_0.apply(null, arguments)
        },
        Ac = b._emscripten_bind_Config_get_piterations_0 = function() {
            return b.asm._emscripten_bind_Config_get_piterations_0.apply(null, arguments)
        },
        Bc = b._emscripten_bind_Config_get_timescale_0 = function() {
            return b.asm._emscripten_bind_Config_get_timescale_0.apply(null,
                arguments)
        },
        Cc = b._emscripten_bind_Config_get_viterations_0 = function() {
            return b.asm._emscripten_bind_Config_get_viterations_0.apply(null, arguments)
        },
        Dc = b._emscripten_bind_Config_set_citerations_1 = function() {
            return b.asm._emscripten_bind_Config_set_citerations_1.apply(null, arguments)
        },
        Ec = b._emscripten_bind_Config_set_collisions_1 = function() {
            return b.asm._emscripten_bind_Config_set_collisions_1.apply(null, arguments)
        },
        Fc = b._emscripten_bind_Config_set_diterations_1 = function() {
            return b.asm._emscripten_bind_Config_set_diterations_1.apply(null,
                arguments)
        },
        Gc = b._emscripten_bind_Config_set_kAHR_1 = function() {
            return b.asm._emscripten_bind_Config_set_kAHR_1.apply(null, arguments)
        },
        Hc = b._emscripten_bind_Config_set_kCHR_1 = function() {
            return b.asm._emscripten_bind_Config_set_kCHR_1.apply(null, arguments)
        },
        Ic = b._emscripten_bind_Config_set_kDF_1 = function() {
            return b.asm._emscripten_bind_Config_set_kDF_1.apply(null, arguments)
        },
        Jc = b._emscripten_bind_Config_set_kDG_1 = function() {
            return b.asm._emscripten_bind_Config_set_kDG_1.apply(null, arguments)
        },
        Kc = b._emscripten_bind_Config_set_kDP_1 =
        function() {
            return b.asm._emscripten_bind_Config_set_kDP_1.apply(null, arguments)
        },
        Lc = b._emscripten_bind_Config_set_kKHR_1 = function() {
            return b.asm._emscripten_bind_Config_set_kKHR_1.apply(null, arguments)
        },
        Mc = b._emscripten_bind_Config_set_kLF_1 = function() {
            return b.asm._emscripten_bind_Config_set_kLF_1.apply(null, arguments)
        },
        Nc = b._emscripten_bind_Config_set_kMT_1 = function() {
            return b.asm._emscripten_bind_Config_set_kMT_1.apply(null, arguments)
        },
        Oc = b._emscripten_bind_Config_set_kPR_1 = function() {
            return b.asm._emscripten_bind_Config_set_kPR_1.apply(null,
                arguments)
        },
        Pc = b._emscripten_bind_Config_set_kSHR_1 = function() {
            return b.asm._emscripten_bind_Config_set_kSHR_1.apply(null, arguments)
        },
        Qc = b._emscripten_bind_Config_set_kSKHR_CL_1 = function() {
            return b.asm._emscripten_bind_Config_set_kSKHR_CL_1.apply(null, arguments)
        },
        Rc = b._emscripten_bind_Config_set_kSK_SPLT_CL_1 = function() {
            return b.asm._emscripten_bind_Config_set_kSK_SPLT_CL_1.apply(null, arguments)
        },
        Sc = b._emscripten_bind_Config_set_kSRHR_CL_1 = function() {
            return b.asm._emscripten_bind_Config_set_kSRHR_CL_1.apply(null,
                arguments)
        },
        Tc = b._emscripten_bind_Config_set_kSR_SPLT_CL_1 = function() {
            return b.asm._emscripten_bind_Config_set_kSR_SPLT_CL_1.apply(null, arguments)
        },
        Uc = b._emscripten_bind_Config_set_kSSHR_CL_1 = function() {
            return b.asm._emscripten_bind_Config_set_kSSHR_CL_1.apply(null, arguments)
        },
        Vc = b._emscripten_bind_Config_set_kSS_SPLT_CL_1 = function() {
            return b.asm._emscripten_bind_Config_set_kSS_SPLT_CL_1.apply(null, arguments)
        },
        Wc = b._emscripten_bind_Config_set_kVCF_1 = function() {
            return b.asm._emscripten_bind_Config_set_kVCF_1.apply(null,
                arguments)
        },
        Xc = b._emscripten_bind_Config_set_kVC_1 = function() {
            return b.asm._emscripten_bind_Config_set_kVC_1.apply(null, arguments)
        },
        Yc = b._emscripten_bind_Config_set_maxvolume_1 = function() {
            return b.asm._emscripten_bind_Config_set_maxvolume_1.apply(null, arguments)
        },
        Zc = b._emscripten_bind_Config_set_piterations_1 = function() {
            return b.asm._emscripten_bind_Config_set_piterations_1.apply(null, arguments)
        },
        $c = b._emscripten_bind_Config_set_timescale_1 = function() {
            return b.asm._emscripten_bind_Config_set_timescale_1.apply(null,
                arguments)
        },
        ad = b._emscripten_bind_Config_set_viterations_1 = function() {
            return b.asm._emscripten_bind_Config_set_viterations_1.apply(null, arguments)
        },
        bd = b._emscripten_bind_ContactResultCallback___destroy___0 = function() {
            return b.asm._emscripten_bind_ContactResultCallback___destroy___0.apply(null, arguments)
        },
        cd = b._emscripten_bind_ContactResultCallback_addSingleResult_7 = function() {
            return b.asm._emscripten_bind_ContactResultCallback_addSingleResult_7.apply(null, arguments)
        },
        dd = b._emscripten_bind_ConvexResultCallback___destroy___0 =
        function() {
            return b.asm._emscripten_bind_ConvexResultCallback___destroy___0.apply(null, arguments)
        },
        ed = b._emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0 = function() {
            return b.asm._emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0.apply(null, arguments)
        },
        fd = b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0 = function() {
            return b.asm._emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0.apply(null, arguments)
        },
        gd = b._emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0 =
        function() {
            return b.asm._emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0.apply(null, arguments)
        },
        hd = b._emscripten_bind_ConvexResultCallback_hasHit_0 = function() {
            return b.asm._emscripten_bind_ConvexResultCallback_hasHit_0.apply(null, arguments)
        },
        id = b._emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1 = function() {
            return b.asm._emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1.apply(null, arguments)
        },
        jd = b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1 =
        function() {
            return b.asm._emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1.apply(null, arguments)
        },
        kd = b._emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1 = function() {
            return b.asm._emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1.apply(null, arguments)
        },
        ld = b._emscripten_bind_LocalConvexResult_LocalConvexResult_5 = function() {
            return b.asm._emscripten_bind_LocalConvexResult_LocalConvexResult_5.apply(null, arguments)
        },
        md = b._emscripten_bind_LocalConvexResult___destroy___0 =
        function() {
            return b.asm._emscripten_bind_LocalConvexResult___destroy___0.apply(null, arguments)
        },
        nd = b._emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0 = function() {
            return b.asm._emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0.apply(null, arguments)
        },
        od = b._emscripten_bind_LocalConvexResult_get_m_hitFraction_0 = function() {
            return b.asm._emscripten_bind_LocalConvexResult_get_m_hitFraction_0.apply(null, arguments)
        },
        pd = b._emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0 = function() {
            return b.asm._emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0.apply(null,
                arguments)
        },
        qd = b._emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0 = function() {
            return b.asm._emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0.apply(null, arguments)
        },
        rd = b._emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0 = function() {
            return b.asm._emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0.apply(null, arguments)
        },
        sd = b._emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1 = function() {
            return b.asm._emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1.apply(null,
                arguments)
        },
        td = b._emscripten_bind_LocalConvexResult_set_m_hitFraction_1 = function() {
            return b.asm._emscripten_bind_LocalConvexResult_set_m_hitFraction_1.apply(null, arguments)
        },
        ud = b._emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1 = function() {
            return b.asm._emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1.apply(null, arguments)
        },
        vd = b._emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1 = function() {
            return b.asm._emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1.apply(null, arguments)
        },
        wd = b._emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1 = function() {
            return b.asm._emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1.apply(null, arguments)
        },
        xd = b._emscripten_bind_LocalShapeInfo___destroy___0 = function() {
            return b.asm._emscripten_bind_LocalShapeInfo___destroy___0.apply(null, arguments)
        },
        yd = b._emscripten_bind_LocalShapeInfo_get_m_shapePart_0 = function() {
            return b.asm._emscripten_bind_LocalShapeInfo_get_m_shapePart_0.apply(null, arguments)
        },
        zd = b._emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0 =
        function() {
            return b.asm._emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0.apply(null, arguments)
        },
        Ad = b._emscripten_bind_LocalShapeInfo_set_m_shapePart_1 = function() {
            return b.asm._emscripten_bind_LocalShapeInfo_set_m_shapePart_1.apply(null, arguments)
        },
        Bd = b._emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1 = function() {
            return b.asm._emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1.apply(null, arguments)
        },
        Cd = b._emscripten_bind_Material___destroy___0 = function() {
            return b.asm._emscripten_bind_Material___destroy___0.apply(null,
                arguments)
        },
        Dd = b._emscripten_bind_Material_get_m_flags_0 = function() {
            return b.asm._emscripten_bind_Material_get_m_flags_0.apply(null, arguments)
        },
        Ed = b._emscripten_bind_Material_get_m_kAST_0 = function() {
            return b.asm._emscripten_bind_Material_get_m_kAST_0.apply(null, arguments)
        },
        Fd = b._emscripten_bind_Material_get_m_kLST_0 = function() {
            return b.asm._emscripten_bind_Material_get_m_kLST_0.apply(null, arguments)
        },
        Gd = b._emscripten_bind_Material_get_m_kVST_0 = function() {
            return b.asm._emscripten_bind_Material_get_m_kVST_0.apply(null,
                arguments)
        },
        Hd = b._emscripten_bind_Material_set_m_flags_1 = function() {
            return b.asm._emscripten_bind_Material_set_m_flags_1.apply(null, arguments)
        },
        Id = b._emscripten_bind_Material_set_m_kAST_1 = function() {
            return b.asm._emscripten_bind_Material_set_m_kAST_1.apply(null, arguments)
        },
        Jd = b._emscripten_bind_Material_set_m_kLST_1 = function() {
            return b.asm._emscripten_bind_Material_set_m_kLST_1.apply(null, arguments)
        },
        Kd = b._emscripten_bind_Material_set_m_kVST_1 = function() {
            return b.asm._emscripten_bind_Material_set_m_kVST_1.apply(null,
                arguments)
        },
        Ld = b._emscripten_bind_Node___destroy___0 = function() {
            return b.asm._emscripten_bind_Node___destroy___0.apply(null, arguments)
        },
        Md = b._emscripten_bind_Node_get_m_f_0 = function() {
            return b.asm._emscripten_bind_Node_get_m_f_0.apply(null, arguments)
        },
        Nd = b._emscripten_bind_Node_get_m_n_0 = function() {
            return b.asm._emscripten_bind_Node_get_m_n_0.apply(null, arguments)
        },
        Od = b._emscripten_bind_Node_get_m_v_0 = function() {
            return b.asm._emscripten_bind_Node_get_m_v_0.apply(null, arguments)
        },
        Pd = b._emscripten_bind_Node_get_m_x_0 =
        function() {
            return b.asm._emscripten_bind_Node_get_m_x_0.apply(null, arguments)
        },
        Qd = b._emscripten_bind_Node_set_m_f_1 = function() {
            return b.asm._emscripten_bind_Node_set_m_f_1.apply(null, arguments)
        },
        Rd = b._emscripten_bind_Node_set_m_n_1 = function() {
            return b.asm._emscripten_bind_Node_set_m_n_1.apply(null, arguments)
        },
        Sd = b._emscripten_bind_Node_set_m_v_1 = function() {
            return b.asm._emscripten_bind_Node_set_m_v_1.apply(null, arguments)
        },
        Td = b._emscripten_bind_Node_set_m_x_1 = function() {
            return b.asm._emscripten_bind_Node_set_m_x_1.apply(null,
                arguments)
        },
        Ud = b._emscripten_bind_RayResultCallback___destroy___0 = function() {
            return b.asm._emscripten_bind_RayResultCallback___destroy___0.apply(null, arguments)
        },
        Vd = b._emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0 = function() {
            return b.asm._emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0.apply(null, arguments)
        },
        Wd = b._emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0 = function() {
            return b.asm._emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0.apply(null,
                arguments)
        },
        Xd = b._emscripten_bind_RayResultCallback_get_m_collisionObject_0 = function() {
            return b.asm._emscripten_bind_RayResultCallback_get_m_collisionObject_0.apply(null, arguments)
        },
        Yd = b._emscripten_bind_RayResultCallback_hasHit_0 = function() {
            return b.asm._emscripten_bind_RayResultCallback_hasHit_0.apply(null, arguments)
        },
        Zd = b._emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1 = function() {
            return b.asm._emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1.apply(null, arguments)
        },
        $d = b._emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1 = function() {
            return b.asm._emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1.apply(null, arguments)
        },
        ae = b._emscripten_bind_RayResultCallback_set_m_collisionObject_1 = function() {
            return b.asm._emscripten_bind_RayResultCallback_set_m_collisionObject_1.apply(null, arguments)
        },
        be = b._emscripten_bind_RaycastInfo___destroy___0 = function() {
            return b.asm._emscripten_bind_RaycastInfo___destroy___0.apply(null, arguments)
        },
        ce = b._emscripten_bind_RaycastInfo_get_m_contactNormalWS_0 =
        function() {
            return b.asm._emscripten_bind_RaycastInfo_get_m_contactNormalWS_0.apply(null, arguments)
        },
        de = b._emscripten_bind_RaycastInfo_get_m_contactPointWS_0 = function() {
            return b.asm._emscripten_bind_RaycastInfo_get_m_contactPointWS_0.apply(null, arguments)
        },
        ee = b._emscripten_bind_RaycastInfo_get_m_groundObject_0 = function() {
            return b.asm._emscripten_bind_RaycastInfo_get_m_groundObject_0.apply(null, arguments)
        },
        fe = b._emscripten_bind_RaycastInfo_get_m_hardPointWS_0 = function() {
            return b.asm._emscripten_bind_RaycastInfo_get_m_hardPointWS_0.apply(null,
                arguments)
        },
        ge = b._emscripten_bind_RaycastInfo_get_m_isInContact_0 = function() {
            return b.asm._emscripten_bind_RaycastInfo_get_m_isInContact_0.apply(null, arguments)
        },
        he = b._emscripten_bind_RaycastInfo_get_m_suspensionLength_0 = function() {
            return b.asm._emscripten_bind_RaycastInfo_get_m_suspensionLength_0.apply(null, arguments)
        },
        ie = b._emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0 = function() {
            return b.asm._emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0.apply(null, arguments)
        },
        je = b._emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0 =
        function() {
            return b.asm._emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0.apply(null, arguments)
        },
        ke = b._emscripten_bind_RaycastInfo_set_m_contactNormalWS_1 = function() {
            return b.asm._emscripten_bind_RaycastInfo_set_m_contactNormalWS_1.apply(null, arguments)
        },
        le = b._emscripten_bind_RaycastInfo_set_m_contactPointWS_1 = function() {
            return b.asm._emscripten_bind_RaycastInfo_set_m_contactPointWS_1.apply(null, arguments)
        },
        me = b._emscripten_bind_RaycastInfo_set_m_groundObject_1 = function() {
            return b.asm._emscripten_bind_RaycastInfo_set_m_groundObject_1.apply(null,
                arguments)
        },
        ne = b._emscripten_bind_RaycastInfo_set_m_hardPointWS_1 = function() {
            return b.asm._emscripten_bind_RaycastInfo_set_m_hardPointWS_1.apply(null, arguments)
        },
        oe = b._emscripten_bind_RaycastInfo_set_m_isInContact_1 = function() {
            return b.asm._emscripten_bind_RaycastInfo_set_m_isInContact_1.apply(null, arguments)
        },
        pe = b._emscripten_bind_RaycastInfo_set_m_suspensionLength_1 = function() {
            return b.asm._emscripten_bind_RaycastInfo_set_m_suspensionLength_1.apply(null, arguments)
        },
        qe = b._emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1 =
        function() {
            return b.asm._emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1.apply(null, arguments)
        },
        re = b._emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1 = function() {
            return b.asm._emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1.apply(null, arguments)
        },
        se = b._emscripten_bind_VoidPtr___destroy___0 = function() {
            return b.asm._emscripten_bind_VoidPtr___destroy___0.apply(null, arguments)
        },
        te = b._emscripten_bind_btActionInterface___destroy___0 = function() {
            return b.asm._emscripten_bind_btActionInterface___destroy___0.apply(null,
                arguments)
        },
        ue = b._emscripten_bind_btActionInterface_updateAction_2 = function() {
            return b.asm._emscripten_bind_btActionInterface_updateAction_2.apply(null, arguments)
        },
        ve = b._emscripten_bind_btAxisSweep3___destroy___0 = function() {
            return b.asm._emscripten_bind_btAxisSweep3___destroy___0.apply(null, arguments)
        },
        we = b._emscripten_bind_btAxisSweep3_btAxisSweep3_2 = function() {
            return b.asm._emscripten_bind_btAxisSweep3_btAxisSweep3_2.apply(null, arguments)
        },
        xe = b._emscripten_bind_btAxisSweep3_btAxisSweep3_3 = function() {
            return b.asm._emscripten_bind_btAxisSweep3_btAxisSweep3_3.apply(null,
                arguments)
        },
        ye = b._emscripten_bind_btAxisSweep3_btAxisSweep3_4 = function() {
            return b.asm._emscripten_bind_btAxisSweep3_btAxisSweep3_4.apply(null, arguments)
        },
        ze = b._emscripten_bind_btAxisSweep3_btAxisSweep3_5 = function() {
            return b.asm._emscripten_bind_btAxisSweep3_btAxisSweep3_5.apply(null, arguments)
        },
        Ae = b._emscripten_bind_btBoxShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btBoxShape___destroy___0.apply(null, arguments)
        },
        Be = b._emscripten_bind_btBoxShape_btBoxShape_1 = function() {
            return b.asm._emscripten_bind_btBoxShape_btBoxShape_1.apply(null,
                arguments)
        },
        Ce = b._emscripten_bind_btBoxShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btBoxShape_calculateLocalInertia_2.apply(null, arguments)
        },
        De = b._emscripten_bind_btBoxShape_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btBoxShape_getLocalScaling_0.apply(null, arguments)
        },
        Ee = b._emscripten_bind_btBoxShape_getMargin_0 = function() {
            return b.asm._emscripten_bind_btBoxShape_getMargin_0.apply(null, arguments)
        },
        Fe = b._emscripten_bind_btBoxShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btBoxShape_setLocalScaling_1.apply(null,
                arguments)
        },
        Ge = b._emscripten_bind_btBoxShape_setMargin_1 = function() {
            return b.asm._emscripten_bind_btBoxShape_setMargin_1.apply(null, arguments)
        },
        He = b._emscripten_bind_btBroadphaseInterface___destroy___0 = function() {
            return b.asm._emscripten_bind_btBroadphaseInterface___destroy___0.apply(null, arguments)
        },
        Ie = b._emscripten_bind_btBvhTriangleMeshShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btBvhTriangleMeshShape___destroy___0.apply(null, arguments)
        },
        Je = b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2 =
        function() {
            return b.asm._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2.apply(null, arguments)
        },
        Ke = b._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3 = function() {
            return b.asm._emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3.apply(null, arguments)
        },
        Le = b._emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2.apply(null, arguments)
        },
        Me = b._emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0 =
        function() {
            return b.asm._emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0.apply(null, arguments)
        },
        Ne = b._emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1.apply(null, arguments)
        },
        Oe = b._emscripten_bind_btCapsuleShapeX___destroy___0 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeX___destroy___0.apply(null, arguments)
        },
        Pe = b._emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2.apply(null,
                arguments)
        },
        Qe = b._emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2.apply(null, arguments)
        },
        Re = b._emscripten_bind_btCapsuleShapeX_getHalfHeight_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeX_getHalfHeight_0.apply(null, arguments)
        },
        Se = b._emscripten_bind_btCapsuleShapeX_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeX_getLocalScaling_0.apply(null, arguments)
        },
        Te = b._emscripten_bind_btCapsuleShapeX_getMargin_0 =
        function() {
            return b.asm._emscripten_bind_btCapsuleShapeX_getMargin_0.apply(null, arguments)
        },
        Ue = b._emscripten_bind_btCapsuleShapeX_getRadius_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeX_getRadius_0.apply(null, arguments)
        },
        Ve = b._emscripten_bind_btCapsuleShapeX_getUpAxis_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeX_getUpAxis_0.apply(null, arguments)
        },
        We = b._emscripten_bind_btCapsuleShapeX_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeX_setLocalScaling_1.apply(null,
                arguments)
        },
        Xe = b._emscripten_bind_btCapsuleShapeX_setMargin_1 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeX_setMargin_1.apply(null, arguments)
        },
        Ye = b._emscripten_bind_btCapsuleShapeZ___destroy___0 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeZ___destroy___0.apply(null, arguments)
        },
        Ze = b._emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2.apply(null, arguments)
        },
        $e = b._emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2 =
        function() {
            return b.asm._emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2.apply(null, arguments)
        },
        af = b._emscripten_bind_btCapsuleShapeZ_getHalfHeight_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeZ_getHalfHeight_0.apply(null, arguments)
        },
        bf = b._emscripten_bind_btCapsuleShapeZ_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeZ_getLocalScaling_0.apply(null, arguments)
        },
        cf = b._emscripten_bind_btCapsuleShapeZ_getMargin_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeZ_getMargin_0.apply(null,
                arguments)
        },
        df = b._emscripten_bind_btCapsuleShapeZ_getRadius_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeZ_getRadius_0.apply(null, arguments)
        },
        ef = b._emscripten_bind_btCapsuleShapeZ_getUpAxis_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeZ_getUpAxis_0.apply(null, arguments)
        },
        ff = b._emscripten_bind_btCapsuleShapeZ_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeZ_setLocalScaling_1.apply(null, arguments)
        },
        gf = b._emscripten_bind_btCapsuleShapeZ_setMargin_1 = function() {
            return b.asm._emscripten_bind_btCapsuleShapeZ_setMargin_1.apply(null,
                arguments)
        },
        hf = b._emscripten_bind_btCapsuleShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btCapsuleShape___destroy___0.apply(null, arguments)
        },
        jf = b._emscripten_bind_btCapsuleShape_btCapsuleShape_2 = function() {
            return b.asm._emscripten_bind_btCapsuleShape_btCapsuleShape_2.apply(null, arguments)
        },
        kf = b._emscripten_bind_btCapsuleShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btCapsuleShape_calculateLocalInertia_2.apply(null, arguments)
        },
        lf = b._emscripten_bind_btCapsuleShape_getHalfHeight_0 =
        function() {
            return b.asm._emscripten_bind_btCapsuleShape_getHalfHeight_0.apply(null, arguments)
        },
        mf = b._emscripten_bind_btCapsuleShape_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShape_getLocalScaling_0.apply(null, arguments)
        },
        nf = b._emscripten_bind_btCapsuleShape_getMargin_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShape_getMargin_0.apply(null, arguments)
        },
        of = b._emscripten_bind_btCapsuleShape_getRadius_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShape_getRadius_0.apply(null,
                arguments)
        },
        pf = b._emscripten_bind_btCapsuleShape_getUpAxis_0 = function() {
            return b.asm._emscripten_bind_btCapsuleShape_getUpAxis_0.apply(null, arguments)
        },
        qf = b._emscripten_bind_btCapsuleShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btCapsuleShape_setLocalScaling_1.apply(null, arguments)
        },
        rf = b._emscripten_bind_btCapsuleShape_setMargin_1 = function() {
            return b.asm._emscripten_bind_btCapsuleShape_setMargin_1.apply(null, arguments)
        },
        sf = b._emscripten_bind_btCollisionConfiguration___destroy___0 =
        function() {
            return b.asm._emscripten_bind_btCollisionConfiguration___destroy___0.apply(null, arguments)
        },
        tf = b._emscripten_bind_btCollisionDispatcher___destroy___0 = function() {
            return b.asm._emscripten_bind_btCollisionDispatcher___destroy___0.apply(null, arguments)
        },
        uf = b._emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1 = function() {
            return b.asm._emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1.apply(null, arguments)
        },
        vf = b._emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1 =
        function() {
            return b.asm._emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1.apply(null, arguments)
        },
        wf = b._emscripten_bind_btCollisionDispatcher_getNumManifolds_0 = function() {
            return b.asm._emscripten_bind_btCollisionDispatcher_getNumManifolds_0.apply(null, arguments)
        },
        xf = b._emscripten_bind_btCollisionObject___destroy___0 = function() {
            return b.asm._emscripten_bind_btCollisionObject___destroy___0.apply(null, arguments)
        },
        yf = b._emscripten_bind_btCollisionObject_activate_0 = function() {
            return b.asm._emscripten_bind_btCollisionObject_activate_0.apply(null,
                arguments)
        },
        zf = b._emscripten_bind_btCollisionObject_activate_1 = function() {
            return b.asm._emscripten_bind_btCollisionObject_activate_1.apply(null, arguments)
        },
        Af = b._emscripten_bind_btCollisionObject_forceActivationState_1 = function() {
            return b.asm._emscripten_bind_btCollisionObject_forceActivationState_1.apply(null, arguments)
        },
        Bf = b._emscripten_bind_btCollisionObject_getCollisionFlags_0 = function() {
            return b.asm._emscripten_bind_btCollisionObject_getCollisionFlags_0.apply(null, arguments)
        },
        Cf = b._emscripten_bind_btCollisionObject_getCollisionShape_0 =
        function() {
            return b.asm._emscripten_bind_btCollisionObject_getCollisionShape_0.apply(null, arguments)
        },
        Df = b._emscripten_bind_btCollisionObject_getUserIndex_0 = function() {
            return b.asm._emscripten_bind_btCollisionObject_getUserIndex_0.apply(null, arguments)
        },
        Ef = b._emscripten_bind_btCollisionObject_getUserPointer_0 = function() {
            return b.asm._emscripten_bind_btCollisionObject_getUserPointer_0.apply(null, arguments)
        },
        Ff = b._emscripten_bind_btCollisionObject_getWorldTransform_0 = function() {
            return b.asm._emscripten_bind_btCollisionObject_getWorldTransform_0.apply(null,
                arguments)
        },
        Gf = b._emscripten_bind_btCollisionObject_isActive_0 = function() {
            return b.asm._emscripten_bind_btCollisionObject_isActive_0.apply(null, arguments)
        },
        Hf = b._emscripten_bind_btCollisionObject_isKinematicObject_0 = function() {
            return b.asm._emscripten_bind_btCollisionObject_isKinematicObject_0.apply(null, arguments)
        },
        If = b._emscripten_bind_btCollisionObject_isStaticObject_0 = function() {
            return b.asm._emscripten_bind_btCollisionObject_isStaticObject_0.apply(null, arguments)
        },
        Jf = b._emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0 =
        function() {
            return b.asm._emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0.apply(null, arguments)
        },
        Kf = b._emscripten_bind_btCollisionObject_setActivationState_1 = function() {
            return b.asm._emscripten_bind_btCollisionObject_setActivationState_1.apply(null, arguments)
        },
        Lf = b._emscripten_bind_btCollisionObject_setAnisotropicFriction_2 = function() {
            return b.asm._emscripten_bind_btCollisionObject_setAnisotropicFriction_2.apply(null, arguments)
        },
        Mf = b._emscripten_bind_btCollisionObject_setCcdMotionThreshold_1 =
        function() {
            return b.asm._emscripten_bind_btCollisionObject_setCcdMotionThreshold_1.apply(null, arguments)
        },
        Nf = b._emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1 = function() {
            return b.asm._emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1.apply(null, arguments)
        },
        Of = b._emscripten_bind_btCollisionObject_setCollisionFlags_1 = function() {
            return b.asm._emscripten_bind_btCollisionObject_setCollisionFlags_1.apply(null, arguments)
        },
        Pf = b._emscripten_bind_btCollisionObject_setCollisionShape_1 =
        function() {
            return b.asm._emscripten_bind_btCollisionObject_setCollisionShape_1.apply(null, arguments)
        },
        Qf = b._emscripten_bind_btCollisionObject_setContactProcessingThreshold_1 = function() {
            return b.asm._emscripten_bind_btCollisionObject_setContactProcessingThreshold_1.apply(null, arguments)
        },
        Rf = b._emscripten_bind_btCollisionObject_setFriction_1 = function() {
            return b.asm._emscripten_bind_btCollisionObject_setFriction_1.apply(null, arguments)
        },
        Sf = b._emscripten_bind_btCollisionObject_setRestitution_1 = function() {
            return b.asm._emscripten_bind_btCollisionObject_setRestitution_1.apply(null,
                arguments)
        },
        Tf = b._emscripten_bind_btCollisionObject_setRollingFriction_1 = function() {
            return b.asm._emscripten_bind_btCollisionObject_setRollingFriction_1.apply(null, arguments)
        },
        Uf = b._emscripten_bind_btCollisionObject_setUserIndex_1 = function() {
            return b.asm._emscripten_bind_btCollisionObject_setUserIndex_1.apply(null, arguments)
        },
        Vf = b._emscripten_bind_btCollisionObject_setUserPointer_1 = function() {
            return b.asm._emscripten_bind_btCollisionObject_setUserPointer_1.apply(null, arguments)
        },
        Wf = b._emscripten_bind_btCollisionObject_setWorldTransform_1 =
        function() {
            return b.asm._emscripten_bind_btCollisionObject_setWorldTransform_1.apply(null, arguments)
        },
        Xf = b._emscripten_bind_btCollisionShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btCollisionShape___destroy___0.apply(null, arguments)
        },
        Yf = b._emscripten_bind_btCollisionShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btCollisionShape_calculateLocalInertia_2.apply(null, arguments)
        },
        Zf = b._emscripten_bind_btCollisionShape_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btCollisionShape_getLocalScaling_0.apply(null,
                arguments)
        },
        $f = b._emscripten_bind_btCollisionShape_getMargin_0 = function() {
            return b.asm._emscripten_bind_btCollisionShape_getMargin_0.apply(null, arguments)
        },
        ag = b._emscripten_bind_btCollisionShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btCollisionShape_setLocalScaling_1.apply(null, arguments)
        },
        bg = b._emscripten_bind_btCollisionShape_setMargin_1 = function() {
            return b.asm._emscripten_bind_btCollisionShape_setMargin_1.apply(null, arguments)
        },
        cg = b._emscripten_bind_btCollisionWorld___destroy___0 =
        function() {
            return b.asm._emscripten_bind_btCollisionWorld___destroy___0.apply(null, arguments)
        },
        dg = b._emscripten_bind_btCollisionWorld_addCollisionObject_1 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_addCollisionObject_1.apply(null, arguments)
        },
        eg = b._emscripten_bind_btCollisionWorld_addCollisionObject_2 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_addCollisionObject_2.apply(null, arguments)
        },
        fg = b._emscripten_bind_btCollisionWorld_addCollisionObject_3 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_addCollisionObject_3.apply(null,
                arguments)
        },
        gg = b._emscripten_bind_btCollisionWorld_contactPairTest_3 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_contactPairTest_3.apply(null, arguments)
        },
        hg = b._emscripten_bind_btCollisionWorld_contactTest_2 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_contactTest_2.apply(null, arguments)
        },
        ig = b._emscripten_bind_btCollisionWorld_convexSweepTest_5 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_convexSweepTest_5.apply(null, arguments)
        },
        jg = b._emscripten_bind_btCollisionWorld_getBroadphase_0 =
        function() {
            return b.asm._emscripten_bind_btCollisionWorld_getBroadphase_0.apply(null, arguments)
        },
        kg = b._emscripten_bind_btCollisionWorld_getDispatchInfo_0 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_getDispatchInfo_0.apply(null, arguments)
        },
        lg = b._emscripten_bind_btCollisionWorld_getDispatcher_0 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_getDispatcher_0.apply(null, arguments)
        },
        mg = b._emscripten_bind_btCollisionWorld_getPairCache_0 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_getPairCache_0.apply(null,
                arguments)
        },
        ng = b._emscripten_bind_btCollisionWorld_rayTest_3 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_rayTest_3.apply(null, arguments)
        },
        og = b._emscripten_bind_btCollisionWorld_removeCollisionObject_1 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_removeCollisionObject_1.apply(null, arguments)
        },
        pg = b._emscripten_bind_btCollisionWorld_updateSingleAabb_1 = function() {
            return b.asm._emscripten_bind_btCollisionWorld_updateSingleAabb_1.apply(null, arguments)
        },
        qg = b._emscripten_bind_btCompoundShape___destroy___0 =
        function() {
            return b.asm._emscripten_bind_btCompoundShape___destroy___0.apply(null, arguments)
        },
        rg = b._emscripten_bind_btCompoundShape_addChildShape_2 = function() {
            return b.asm._emscripten_bind_btCompoundShape_addChildShape_2.apply(null, arguments)
        },
        sg = b._emscripten_bind_btCompoundShape_btCompoundShape_0 = function() {
            return b.asm._emscripten_bind_btCompoundShape_btCompoundShape_0.apply(null, arguments)
        },
        tg = b._emscripten_bind_btCompoundShape_btCompoundShape_1 = function() {
            return b.asm._emscripten_bind_btCompoundShape_btCompoundShape_1.apply(null,
                arguments)
        },
        ug = b._emscripten_bind_btCompoundShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btCompoundShape_calculateLocalInertia_2.apply(null, arguments)
        },
        vg = b._emscripten_bind_btCompoundShape_getChildShape_1 = function() {
            return b.asm._emscripten_bind_btCompoundShape_getChildShape_1.apply(null, arguments)
        },
        wg = b._emscripten_bind_btCompoundShape_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btCompoundShape_getLocalScaling_0.apply(null, arguments)
        },
        xg = b._emscripten_bind_btCompoundShape_getMargin_0 =
        function() {
            return b.asm._emscripten_bind_btCompoundShape_getMargin_0.apply(null, arguments)
        },
        yg = b._emscripten_bind_btCompoundShape_getNumChildShapes_0 = function() {
            return b.asm._emscripten_bind_btCompoundShape_getNumChildShapes_0.apply(null, arguments)
        },
        zg = b._emscripten_bind_btCompoundShape_removeChildShapeByIndex_1 = function() {
            return b.asm._emscripten_bind_btCompoundShape_removeChildShapeByIndex_1.apply(null, arguments)
        },
        Ag = b._emscripten_bind_btCompoundShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btCompoundShape_setLocalScaling_1.apply(null,
                arguments)
        },
        Bg = b._emscripten_bind_btCompoundShape_setMargin_1 = function() {
            return b.asm._emscripten_bind_btCompoundShape_setMargin_1.apply(null, arguments)
        },
        Cg = b._emscripten_bind_btConcaveShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btConcaveShape___destroy___0.apply(null, arguments)
        },
        Dg = b._emscripten_bind_btConcaveShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btConcaveShape_calculateLocalInertia_2.apply(null, arguments)
        },
        Eg = b._emscripten_bind_btConcaveShape_getLocalScaling_0 =
        function() {
            return b.asm._emscripten_bind_btConcaveShape_getLocalScaling_0.apply(null, arguments)
        },
        Fg = b._emscripten_bind_btConcaveShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btConcaveShape_setLocalScaling_1.apply(null, arguments)
        },
        Gg = b._emscripten_bind_btConeShapeX___destroy___0 = function() {
            return b.asm._emscripten_bind_btConeShapeX___destroy___0.apply(null, arguments)
        },
        Hg = b._emscripten_bind_btConeShapeX_btConeShapeX_2 = function() {
            return b.asm._emscripten_bind_btConeShapeX_btConeShapeX_2.apply(null,
                arguments)
        },
        Ig = b._emscripten_bind_btConeShapeX_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btConeShapeX_calculateLocalInertia_2.apply(null, arguments)
        },
        Jg = b._emscripten_bind_btConeShapeX_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btConeShapeX_getLocalScaling_0.apply(null, arguments)
        },
        Kg = b._emscripten_bind_btConeShapeX_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btConeShapeX_setLocalScaling_1.apply(null, arguments)
        },
        Lg = b._emscripten_bind_btConeShapeZ___destroy___0 =
        function() {
            return b.asm._emscripten_bind_btConeShapeZ___destroy___0.apply(null, arguments)
        },
        Mg = b._emscripten_bind_btConeShapeZ_btConeShapeZ_2 = function() {
            return b.asm._emscripten_bind_btConeShapeZ_btConeShapeZ_2.apply(null, arguments)
        },
        Ng = b._emscripten_bind_btConeShapeZ_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btConeShapeZ_calculateLocalInertia_2.apply(null, arguments)
        },
        Og = b._emscripten_bind_btConeShapeZ_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btConeShapeZ_getLocalScaling_0.apply(null,
                arguments)
        },
        Pg = b._emscripten_bind_btConeShapeZ_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btConeShapeZ_setLocalScaling_1.apply(null, arguments)
        },
        Qg = b._emscripten_bind_btConeShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btConeShape___destroy___0.apply(null, arguments)
        },
        Rg = b._emscripten_bind_btConeShape_btConeShape_2 = function() {
            return b.asm._emscripten_bind_btConeShape_btConeShape_2.apply(null, arguments)
        },
        Sg = b._emscripten_bind_btConeShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btConeShape_calculateLocalInertia_2.apply(null,
                arguments)
        },
        Tg = b._emscripten_bind_btConeShape_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btConeShape_getLocalScaling_0.apply(null, arguments)
        },
        Ug = b._emscripten_bind_btConeShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btConeShape_setLocalScaling_1.apply(null, arguments)
        },
        Vg = b._emscripten_bind_btConeTwistConstraint___destroy___0 = function() {
            return b.asm._emscripten_bind_btConeTwistConstraint___destroy___0.apply(null, arguments)
        },
        Wg = b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2 =
        function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2.apply(null, arguments)
        },
        Xg = b._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4 = function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4.apply(null, arguments)
        },
        Yg = b._emscripten_bind_btConeTwistConstraint_enableFeedback_1 = function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_enableFeedback_1.apply(null, arguments)
        },
        Zg = b._emscripten_bind_btConeTwistConstraint_enableMotor_1 =
        function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_enableMotor_1.apply(null, arguments)
        },
        $g = b._emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0 = function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0.apply(null, arguments)
        },
        ah = b._emscripten_bind_btConeTwistConstraint_getParam_2 = function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_getParam_2.apply(null, arguments)
        },
        bh = b._emscripten_bind_btConeTwistConstraint_setAngularOnly_1 =
        function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_setAngularOnly_1.apply(null, arguments)
        },
        ch = b._emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1 = function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1.apply(null, arguments)
        },
        dh = b._emscripten_bind_btConeTwistConstraint_setDamping_1 = function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_setDamping_1.apply(null, arguments)
        },
        eh = b._emscripten_bind_btConeTwistConstraint_setLimit_2 =
        function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_setLimit_2.apply(null, arguments)
        },
        fh = b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1 = function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1.apply(null, arguments)
        },
        gh = b._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1 = function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1.apply(null, arguments)
        },
        hh = b._emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1 =
        function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1.apply(null, arguments)
        },
        ih = b._emscripten_bind_btConeTwistConstraint_setMotorTarget_1 = function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_setMotorTarget_1.apply(null, arguments)
        },
        jh = b._emscripten_bind_btConeTwistConstraint_setParam_3 = function() {
            return b.asm._emscripten_bind_btConeTwistConstraint_setParam_3.apply(null, arguments)
        },
        kh = b._emscripten_bind_btConstraintSetting___destroy___0 = function() {
            return b.asm._emscripten_bind_btConstraintSetting___destroy___0.apply(null,
                arguments)
        },
        lh = b._emscripten_bind_btConstraintSetting_btConstraintSetting_0 = function() {
            return b.asm._emscripten_bind_btConstraintSetting_btConstraintSetting_0.apply(null, arguments)
        },
        mh = b._emscripten_bind_btConstraintSetting_get_m_damping_0 = function() {
            return b.asm._emscripten_bind_btConstraintSetting_get_m_damping_0.apply(null, arguments)
        },
        nh = b._emscripten_bind_btConstraintSetting_get_m_impulseClamp_0 = function() {
            return b.asm._emscripten_bind_btConstraintSetting_get_m_impulseClamp_0.apply(null, arguments)
        },
        oh = b._emscripten_bind_btConstraintSetting_get_m_tau_0 = function() {
            return b.asm._emscripten_bind_btConstraintSetting_get_m_tau_0.apply(null, arguments)
        },
        ph = b._emscripten_bind_btConstraintSetting_set_m_damping_1 = function() {
            return b.asm._emscripten_bind_btConstraintSetting_set_m_damping_1.apply(null, arguments)
        },
        qh = b._emscripten_bind_btConstraintSetting_set_m_impulseClamp_1 = function() {
            return b.asm._emscripten_bind_btConstraintSetting_set_m_impulseClamp_1.apply(null, arguments)
        },
        rh = b._emscripten_bind_btConstraintSetting_set_m_tau_1 =
        function() {
            return b.asm._emscripten_bind_btConstraintSetting_set_m_tau_1.apply(null, arguments)
        },
        sh = b._emscripten_bind_btConstraintSolver___destroy___0 = function() {
            return b.asm._emscripten_bind_btConstraintSolver___destroy___0.apply(null, arguments)
        },
        th = b._emscripten_bind_btContactSolverInfo___destroy___0 = function() {
            return b.asm._emscripten_bind_btContactSolverInfo___destroy___0.apply(null, arguments)
        },
        uh = b._emscripten_bind_btContactSolverInfo_get_m_numIterations_0 = function() {
            return b.asm._emscripten_bind_btContactSolverInfo_get_m_numIterations_0.apply(null,
                arguments)
        },
        vh = b._emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0 = function() {
            return b.asm._emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0.apply(null, arguments)
        },
        wh = b._emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0 = function() {
            return b.asm._emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0.apply(null, arguments)
        },
        xh = b._emscripten_bind_btContactSolverInfo_set_m_numIterations_1 = function() {
            return b.asm._emscripten_bind_btContactSolverInfo_set_m_numIterations_1.apply(null,
                arguments)
        },
        yh = b._emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1 = function() {
            return b.asm._emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1.apply(null, arguments)
        },
        zh = b._emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1 = function() {
            return b.asm._emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1.apply(null, arguments)
        },
        Ah = b._emscripten_bind_btConvexHullShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btConvexHullShape___destroy___0.apply(null,
                arguments)
        },
        Bh = b._emscripten_bind_btConvexHullShape_addPoint_1 = function() {
            return b.asm._emscripten_bind_btConvexHullShape_addPoint_1.apply(null, arguments)
        },
        Ch = b._emscripten_bind_btConvexHullShape_addPoint_2 = function() {
            return b.asm._emscripten_bind_btConvexHullShape_addPoint_2.apply(null, arguments)
        },
        Dh = b._emscripten_bind_btConvexHullShape_btConvexHullShape_0 = function() {
            return b.asm._emscripten_bind_btConvexHullShape_btConvexHullShape_0.apply(null, arguments)
        },
        Eh = b._emscripten_bind_btConvexHullShape_calculateLocalInertia_2 =
        function() {
            return b.asm._emscripten_bind_btConvexHullShape_calculateLocalInertia_2.apply(null, arguments)
        },
        Fh = b._emscripten_bind_btConvexHullShape_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btConvexHullShape_getLocalScaling_0.apply(null, arguments)
        },
        Gh = b._emscripten_bind_btConvexHullShape_getMargin_0 = function() {
            return b.asm._emscripten_bind_btConvexHullShape_getMargin_0.apply(null, arguments)
        },
        Hh = b._emscripten_bind_btConvexHullShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btConvexHullShape_setLocalScaling_1.apply(null,
                arguments)
        },
        Ih = b._emscripten_bind_btConvexHullShape_setMargin_1 = function() {
            return b.asm._emscripten_bind_btConvexHullShape_setMargin_1.apply(null, arguments)
        },
        Jh = b._emscripten_bind_btConvexShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btConvexShape___destroy___0.apply(null, arguments)
        },
        Kh = b._emscripten_bind_btConvexShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btConvexShape_calculateLocalInertia_2.apply(null, arguments)
        },
        Lh = b._emscripten_bind_btConvexShape_getLocalScaling_0 =
        function() {
            return b.asm._emscripten_bind_btConvexShape_getLocalScaling_0.apply(null, arguments)
        },
        Mh = b._emscripten_bind_btConvexShape_getMargin_0 = function() {
            return b.asm._emscripten_bind_btConvexShape_getMargin_0.apply(null, arguments)
        },
        Nh = b._emscripten_bind_btConvexShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btConvexShape_setLocalScaling_1.apply(null, arguments)
        },
        Oh = b._emscripten_bind_btConvexShape_setMargin_1 = function() {
            return b.asm._emscripten_bind_btConvexShape_setMargin_1.apply(null,
                arguments)
        },
        Ph = b._emscripten_bind_btConvexTriangleMeshShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btConvexTriangleMeshShape___destroy___0.apply(null, arguments)
        },
        Qh = b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1 = function() {
            return b.asm._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1.apply(null, arguments)
        },
        Rh = b._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2 = function() {
            return b.asm._emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2.apply(null,
                arguments)
        },
        Sh = b._emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2.apply(null, arguments)
        },
        Th = b._emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0.apply(null, arguments)
        },
        Uh = b._emscripten_bind_btConvexTriangleMeshShape_getMargin_0 = function() {
            return b.asm._emscripten_bind_btConvexTriangleMeshShape_getMargin_0.apply(null,
                arguments)
        },
        Vh = b._emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1.apply(null, arguments)
        },
        Wh = b._emscripten_bind_btConvexTriangleMeshShape_setMargin_1 = function() {
            return b.asm._emscripten_bind_btConvexTriangleMeshShape_setMargin_1.apply(null, arguments)
        },
        Xh = b._emscripten_bind_btCylinderShapeX___destroy___0 = function() {
            return b.asm._emscripten_bind_btCylinderShapeX___destroy___0.apply(null, arguments)
        },
        Yh = b._emscripten_bind_btCylinderShapeX_btCylinderShapeX_1 =
        function() {
            return b.asm._emscripten_bind_btCylinderShapeX_btCylinderShapeX_1.apply(null, arguments)
        },
        Zh = b._emscripten_bind_btCylinderShapeX_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btCylinderShapeX_calculateLocalInertia_2.apply(null, arguments)
        },
        $h = b._emscripten_bind_btCylinderShapeX_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btCylinderShapeX_getLocalScaling_0.apply(null, arguments)
        },
        ai = b._emscripten_bind_btCylinderShapeX_getMargin_0 = function() {
            return b.asm._emscripten_bind_btCylinderShapeX_getMargin_0.apply(null,
                arguments)
        },
        bi = b._emscripten_bind_btCylinderShapeX_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btCylinderShapeX_setLocalScaling_1.apply(null, arguments)
        },
        ci = b._emscripten_bind_btCylinderShapeX_setMargin_1 = function() {
            return b.asm._emscripten_bind_btCylinderShapeX_setMargin_1.apply(null, arguments)
        },
        di = b._emscripten_bind_btCylinderShapeZ___destroy___0 = function() {
            return b.asm._emscripten_bind_btCylinderShapeZ___destroy___0.apply(null, arguments)
        },
        ei = b._emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1 =
        function() {
            return b.asm._emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1.apply(null, arguments)
        },
        fi = b._emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2.apply(null, arguments)
        },
        gi = b._emscripten_bind_btCylinderShapeZ_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btCylinderShapeZ_getLocalScaling_0.apply(null, arguments)
        },
        hi = b._emscripten_bind_btCylinderShapeZ_getMargin_0 = function() {
            return b.asm._emscripten_bind_btCylinderShapeZ_getMargin_0.apply(null,
                arguments)
        },
        ii = b._emscripten_bind_btCylinderShapeZ_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btCylinderShapeZ_setLocalScaling_1.apply(null, arguments)
        },
        ji = b._emscripten_bind_btCylinderShapeZ_setMargin_1 = function() {
            return b.asm._emscripten_bind_btCylinderShapeZ_setMargin_1.apply(null, arguments)
        },
        ki = b._emscripten_bind_btCylinderShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btCylinderShape___destroy___0.apply(null, arguments)
        },
        li = b._emscripten_bind_btCylinderShape_btCylinderShape_1 =
        function() {
            return b.asm._emscripten_bind_btCylinderShape_btCylinderShape_1.apply(null, arguments)
        },
        mi = b._emscripten_bind_btCylinderShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btCylinderShape_calculateLocalInertia_2.apply(null, arguments)
        },
        ni = b._emscripten_bind_btCylinderShape_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btCylinderShape_getLocalScaling_0.apply(null, arguments)
        },
        oi = b._emscripten_bind_btCylinderShape_getMargin_0 = function() {
            return b.asm._emscripten_bind_btCylinderShape_getMargin_0.apply(null,
                arguments)
        },
        pi = b._emscripten_bind_btCylinderShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btCylinderShape_setLocalScaling_1.apply(null, arguments)
        },
        qi = b._emscripten_bind_btCylinderShape_setMargin_1 = function() {
            return b.asm._emscripten_bind_btCylinderShape_setMargin_1.apply(null, arguments)
        },
        ri = b._emscripten_bind_btDbvtBroadphase___destroy___0 = function() {
            return b.asm._emscripten_bind_btDbvtBroadphase___destroy___0.apply(null, arguments)
        },
        si = b._emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0 =
        function() {
            return b.asm._emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0.apply(null, arguments)
        },
        ti = b._emscripten_bind_btDefaultCollisionConfiguration___destroy___0 = function() {
            return b.asm._emscripten_bind_btDefaultCollisionConfiguration___destroy___0.apply(null, arguments)
        },
        ui = b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0 = function() {
            return b.asm._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0.apply(null, arguments)
        },
        vi = b._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1 =
        function() {
            return b.asm._emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1.apply(null, arguments)
        },
        wi = b._emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0 = function() {
            return b.asm._emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0.apply(null, arguments)
        },
        xi = b._emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0 = function() {
            return b.asm._emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0.apply(null,
                arguments)
        },
        yi = b._emscripten_bind_btDefaultMotionState___destroy___0 = function() {
            return b.asm._emscripten_bind_btDefaultMotionState___destroy___0.apply(null, arguments)
        },
        zi = b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_0 = function() {
            return b.asm._emscripten_bind_btDefaultMotionState_btDefaultMotionState_0.apply(null, arguments)
        },
        Ai = b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_1 = function() {
            return b.asm._emscripten_bind_btDefaultMotionState_btDefaultMotionState_1.apply(null,
                arguments)
        },
        Bi = b._emscripten_bind_btDefaultMotionState_btDefaultMotionState_2 = function() {
            return b.asm._emscripten_bind_btDefaultMotionState_btDefaultMotionState_2.apply(null, arguments)
        },
        Ci = b._emscripten_bind_btDefaultMotionState_getWorldTransform_1 = function() {
            return b.asm._emscripten_bind_btDefaultMotionState_getWorldTransform_1.apply(null, arguments)
        },
        Di = b._emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0 = function() {
            return b.asm._emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0.apply(null,
                arguments)
        },
        Ei = b._emscripten_bind_btDefaultMotionState_setWorldTransform_1 = function() {
            return b.asm._emscripten_bind_btDefaultMotionState_setWorldTransform_1.apply(null, arguments)
        },
        Fi = b._emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1 = function() {
            return b.asm._emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1.apply(null, arguments)
        },
        Gi = b._emscripten_bind_btDefaultSoftBodySolver___destroy___0 = function() {
            return b.asm._emscripten_bind_btDefaultSoftBodySolver___destroy___0.apply(null,
                arguments)
        },
        Hi = b._emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0 = function() {
            return b.asm._emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0.apply(null, arguments)
        },
        Ii = b._emscripten_bind_btDefaultVehicleRaycaster___destroy___0 = function() {
            return b.asm._emscripten_bind_btDefaultVehicleRaycaster___destroy___0.apply(null, arguments)
        },
        Ji = b._emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1 = function() {
            return b.asm._emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1.apply(null,
                arguments)
        },
        Ki = b._emscripten_bind_btDefaultVehicleRaycaster_castRay_3 = function() {
            return b.asm._emscripten_bind_btDefaultVehicleRaycaster_castRay_3.apply(null, arguments)
        },
        Li = b._emscripten_bind_btDiscreteDynamicsWorld___destroy___0 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld___destroy___0.apply(null, arguments)
        },
        Mi = b._emscripten_bind_btDiscreteDynamicsWorld_addAction_1 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_addAction_1.apply(null, arguments)
        },
        Ni = b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1 =
        function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1.apply(null, arguments)
        },
        Oi = b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2.apply(null, arguments)
        },
        Pi = b._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3.apply(null, arguments)
        },
        Qi = b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1 =
        function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1.apply(null, arguments)
        },
        Ri = b._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2.apply(null, arguments)
        },
        Si = b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1.apply(null, arguments)
        },
        Ti = b._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3.apply(null,
                arguments)
        },
        Ui = b._emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4.apply(null, arguments)
        },
        Vi = b._emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3.apply(null, arguments)
        },
        Wi = b._emscripten_bind_btDiscreteDynamicsWorld_contactTest_2 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_contactTest_2.apply(null,
                arguments)
        },
        Xi = b._emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5.apply(null, arguments)
        },
        Yi = b._emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0.apply(null, arguments)
        },
        Zi = b._emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0.apply(null,
                arguments)
        },
        $i = b._emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0.apply(null, arguments)
        },
        aj = b._emscripten_bind_btDiscreteDynamicsWorld_getGravity_0 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_getGravity_0.apply(null, arguments)
        },
        bj = b._emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0.apply(null, arguments)
        },
        cj = b._emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0.apply(null, arguments)
        },
        dj = b._emscripten_bind_btDiscreteDynamicsWorld_rayTest_3 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_rayTest_3.apply(null, arguments)
        },
        ej = b._emscripten_bind_btDiscreteDynamicsWorld_removeAction_1 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_removeAction_1.apply(null, arguments)
        },
        fj = b._emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1 =
        function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1.apply(null, arguments)
        },
        gj = b._emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1.apply(null, arguments)
        },
        hj = b._emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1.apply(null, arguments)
        },
        ij = b._emscripten_bind_btDiscreteDynamicsWorld_setGravity_1 =
        function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_setGravity_1.apply(null, arguments)
        },
        jj = b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1.apply(null, arguments)
        },
        kj = b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2.apply(null, arguments)
        },
        lj = b._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3.apply(null,
                arguments)
        },
        mj = b._emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1 = function() {
            return b.asm._emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1.apply(null, arguments)
        },
        nj = b._emscripten_bind_btDispatcherInfo___destroy___0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo___destroy___0.apply(null, arguments)
        },
        oj = b._emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0.apply(null, arguments)
        },
        pj = b._emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0.apply(null, arguments)
        },
        qj = b._emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0.apply(null, arguments)
        },
        rj = b._emscripten_bind_btDispatcherInfo_get_m_enableSPU_0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_get_m_enableSPU_0.apply(null,
                arguments)
        },
        sj = b._emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0.apply(null, arguments)
        },
        tj = b._emscripten_bind_btDispatcherInfo_get_m_stepCount_0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_get_m_stepCount_0.apply(null, arguments)
        },
        uj = b._emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0.apply(null, arguments)
        },
        vj =
        b._emscripten_bind_btDispatcherInfo_get_m_timeStep_0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_get_m_timeStep_0.apply(null, arguments)
        },
        wj = b._emscripten_bind_btDispatcherInfo_get_m_useContinuous_0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_get_m_useContinuous_0.apply(null, arguments)
        },
        xj = b._emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0.apply(null,
                arguments)
        },
        yj = b._emscripten_bind_btDispatcherInfo_get_m_useEpa_0 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_get_m_useEpa_0.apply(null, arguments)
        },
        zj = b._emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1.apply(null, arguments)
        },
        Aj = b._emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1.apply(null,
                arguments)
        },
        Bj = b._emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1.apply(null, arguments)
        },
        Cj = b._emscripten_bind_btDispatcherInfo_set_m_enableSPU_1 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_set_m_enableSPU_1.apply(null, arguments)
        },
        Dj = b._emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1.apply(null, arguments)
        },
        Ej =
        b._emscripten_bind_btDispatcherInfo_set_m_stepCount_1 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_set_m_stepCount_1.apply(null, arguments)
        },
        Fj = b._emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1.apply(null, arguments)
        },
        Gj = b._emscripten_bind_btDispatcherInfo_set_m_timeStep_1 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_set_m_timeStep_1.apply(null, arguments)
        },
        Hj = b._emscripten_bind_btDispatcherInfo_set_m_useContinuous_1 =
        function() {
            return b.asm._emscripten_bind_btDispatcherInfo_set_m_useContinuous_1.apply(null, arguments)
        },
        Ij = b._emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1.apply(null, arguments)
        },
        Jj = b._emscripten_bind_btDispatcherInfo_set_m_useEpa_1 = function() {
            return b.asm._emscripten_bind_btDispatcherInfo_set_m_useEpa_1.apply(null, arguments)
        },
        Kj = b._emscripten_bind_btDispatcher___destroy___0 =
        function() {
            return b.asm._emscripten_bind_btDispatcher___destroy___0.apply(null, arguments)
        },
        Lj = b._emscripten_bind_btDispatcher_getManifoldByIndexInternal_1 = function() {
            return b.asm._emscripten_bind_btDispatcher_getManifoldByIndexInternal_1.apply(null, arguments)
        },
        Mj = b._emscripten_bind_btDispatcher_getNumManifolds_0 = function() {
            return b.asm._emscripten_bind_btDispatcher_getNumManifolds_0.apply(null, arguments)
        },
        Nj = b._emscripten_bind_btDynamicsWorld___destroy___0 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld___destroy___0.apply(null,
                arguments)
        },
        Oj = b._emscripten_bind_btDynamicsWorld_addAction_1 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_addAction_1.apply(null, arguments)
        },
        Pj = b._emscripten_bind_btDynamicsWorld_addCollisionObject_1 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_addCollisionObject_1.apply(null, arguments)
        },
        Qj = b._emscripten_bind_btDynamicsWorld_addCollisionObject_2 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_addCollisionObject_2.apply(null, arguments)
        },
        Rj = b._emscripten_bind_btDynamicsWorld_addCollisionObject_3 =
        function() {
            return b.asm._emscripten_bind_btDynamicsWorld_addCollisionObject_3.apply(null, arguments)
        },
        Sj = b._emscripten_bind_btDynamicsWorld_contactPairTest_3 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_contactPairTest_3.apply(null, arguments)
        },
        Tj = b._emscripten_bind_btDynamicsWorld_contactTest_2 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_contactTest_2.apply(null, arguments)
        },
        Uj = b._emscripten_bind_btDynamicsWorld_convexSweepTest_5 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_convexSweepTest_5.apply(null,
                arguments)
        },
        Vj = b._emscripten_bind_btDynamicsWorld_getBroadphase_0 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_getBroadphase_0.apply(null, arguments)
        },
        Wj = b._emscripten_bind_btDynamicsWorld_getDispatchInfo_0 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_getDispatchInfo_0.apply(null, arguments)
        },
        Xj = b._emscripten_bind_btDynamicsWorld_getDispatcher_0 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_getDispatcher_0.apply(null, arguments)
        },
        Yj = b._emscripten_bind_btDynamicsWorld_getPairCache_0 =
        function() {
            return b.asm._emscripten_bind_btDynamicsWorld_getPairCache_0.apply(null, arguments)
        },
        Zj = b._emscripten_bind_btDynamicsWorld_getSolverInfo_0 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_getSolverInfo_0.apply(null, arguments)
        },
        ak = b._emscripten_bind_btDynamicsWorld_rayTest_3 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_rayTest_3.apply(null, arguments)
        },
        bk = b._emscripten_bind_btDynamicsWorld_removeAction_1 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_removeAction_1.apply(null,
                arguments)
        },
        ck = b._emscripten_bind_btDynamicsWorld_removeCollisionObject_1 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_removeCollisionObject_1.apply(null, arguments)
        },
        dk = b._emscripten_bind_btDynamicsWorld_updateSingleAabb_1 = function() {
            return b.asm._emscripten_bind_btDynamicsWorld_updateSingleAabb_1.apply(null, arguments)
        },
        ek = b._emscripten_bind_btFixedConstraint___destroy___0 = function() {
            return b.asm._emscripten_bind_btFixedConstraint___destroy___0.apply(null, arguments)
        },
        fk = b._emscripten_bind_btFixedConstraint_btFixedConstraint_4 =
        function() {
            return b.asm._emscripten_bind_btFixedConstraint_btFixedConstraint_4.apply(null, arguments)
        },
        gk = b._emscripten_bind_btFixedConstraint_enableFeedback_1 = function() {
            return b.asm._emscripten_bind_btFixedConstraint_enableFeedback_1.apply(null, arguments)
        },
        hk = b._emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0 = function() {
            return b.asm._emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0.apply(null, arguments)
        },
        ik = b._emscripten_bind_btFixedConstraint_getParam_2 = function() {
            return b.asm._emscripten_bind_btFixedConstraint_getParam_2.apply(null,
                arguments)
        },
        jk = b._emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1 = function() {
            return b.asm._emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1.apply(null, arguments)
        },
        kk = b._emscripten_bind_btFixedConstraint_setParam_3 = function() {
            return b.asm._emscripten_bind_btFixedConstraint_setParam_3.apply(null, arguments)
        },
        lk = b._emscripten_bind_btGeneric6DofConstraint___destroy___0 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint___destroy___0.apply(null, arguments)
        },
        mk =
        b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3.apply(null, arguments)
        },
        nk = b._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5.apply(null, arguments)
        },
        ok = b._emscripten_bind_btGeneric6DofConstraint_enableFeedback_1 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint_enableFeedback_1.apply(null,
                arguments)
        },
        pk = b._emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0.apply(null, arguments)
        },
        qk = b._emscripten_bind_btGeneric6DofConstraint_getParam_2 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint_getParam_2.apply(null, arguments)
        },
        rk = b._emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1.apply(null,
                arguments)
        },
        sk = b._emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1.apply(null, arguments)
        },
        tk = b._emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1.apply(null, arguments)
        },
        uk = b._emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1.apply(null,
                arguments)
        },
        vk = b._emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1.apply(null, arguments)
        },
        wk = b._emscripten_bind_btGeneric6DofConstraint_setParam_3 = function() {
            return b.asm._emscripten_bind_btGeneric6DofConstraint_setParam_3.apply(null, arguments)
        },
        xk = b._emscripten_bind_btGeneric6DofSpringConstraint___destroy___0 = function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint___destroy___0.apply(null,
                arguments)
        },
        yk = b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3 = function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3.apply(null, arguments)
        },
        zk = b._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5 = function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5.apply(null, arguments)
        },
        Ak = b._emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1 =
        function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1.apply(null, arguments)
        },
        Bk = b._emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2 = function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2.apply(null, arguments)
        },
        Ck = b._emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0 = function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0.apply(null, arguments)
        },
        Dk = b._emscripten_bind_btGeneric6DofSpringConstraint_getParam_2 =
        function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_getParam_2.apply(null, arguments)
        },
        Ek = b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1 = function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1.apply(null, arguments)
        },
        Fk = b._emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1 = function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1.apply(null, arguments)
        },
        Gk = b._emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1 =
        function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1.apply(null, arguments)
        },
        Hk = b._emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2 = function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2.apply(null, arguments)
        },
        Ik = b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1 = function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1.apply(null, arguments)
        },
        Jk = b._emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1 =
        function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1.apply(null, arguments)
        },
        Kk = b._emscripten_bind_btGeneric6DofSpringConstraint_setParam_3 = function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_setParam_3.apply(null, arguments)
        },
        Lk = b._emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2 = function() {
            return b.asm._emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2.apply(null, arguments)
        },
        Mk = b._emscripten_bind_btGhostObject___destroy___0 =
        function() {
            return b.asm._emscripten_bind_btGhostObject___destroy___0.apply(null, arguments)
        },
        Nk = b._emscripten_bind_btGhostObject_activate_0 = function() {
            return b.asm._emscripten_bind_btGhostObject_activate_0.apply(null, arguments)
        },
        Ok = b._emscripten_bind_btGhostObject_activate_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_activate_1.apply(null, arguments)
        },
        Pk = b._emscripten_bind_btGhostObject_btGhostObject_0 = function() {
            return b.asm._emscripten_bind_btGhostObject_btGhostObject_0.apply(null, arguments)
        },
        Qk = b._emscripten_bind_btGhostObject_forceActivationState_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_forceActivationState_1.apply(null, arguments)
        },
        Rk = b._emscripten_bind_btGhostObject_getCollisionFlags_0 = function() {
            return b.asm._emscripten_bind_btGhostObject_getCollisionFlags_0.apply(null, arguments)
        },
        Sk = b._emscripten_bind_btGhostObject_getCollisionShape_0 = function() {
            return b.asm._emscripten_bind_btGhostObject_getCollisionShape_0.apply(null, arguments)
        },
        Tk = b._emscripten_bind_btGhostObject_getNumOverlappingObjects_0 =
        function() {
            return b.asm._emscripten_bind_btGhostObject_getNumOverlappingObjects_0.apply(null, arguments)
        },
        Uk = b._emscripten_bind_btGhostObject_getOverlappingObject_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_getOverlappingObject_1.apply(null, arguments)
        },
        Vk = b._emscripten_bind_btGhostObject_getUserIndex_0 = function() {
            return b.asm._emscripten_bind_btGhostObject_getUserIndex_0.apply(null, arguments)
        },
        Wk = b._emscripten_bind_btGhostObject_getUserPointer_0 = function() {
            return b.asm._emscripten_bind_btGhostObject_getUserPointer_0.apply(null,
                arguments)
        },
        Xk = b._emscripten_bind_btGhostObject_getWorldTransform_0 = function() {
            return b.asm._emscripten_bind_btGhostObject_getWorldTransform_0.apply(null, arguments)
        },
        Yk = b._emscripten_bind_btGhostObject_isActive_0 = function() {
            return b.asm._emscripten_bind_btGhostObject_isActive_0.apply(null, arguments)
        },
        Zk = b._emscripten_bind_btGhostObject_isKinematicObject_0 = function() {
            return b.asm._emscripten_bind_btGhostObject_isKinematicObject_0.apply(null, arguments)
        },
        $k = b._emscripten_bind_btGhostObject_isStaticObject_0 =
        function() {
            return b.asm._emscripten_bind_btGhostObject_isStaticObject_0.apply(null, arguments)
        },
        al = b._emscripten_bind_btGhostObject_isStaticOrKinematicObject_0 = function() {
            return b.asm._emscripten_bind_btGhostObject_isStaticOrKinematicObject_0.apply(null, arguments)
        },
        bl = b._emscripten_bind_btGhostObject_setActivationState_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_setActivationState_1.apply(null, arguments)
        },
        cl = b._emscripten_bind_btGhostObject_setAnisotropicFriction_2 = function() {
            return b.asm._emscripten_bind_btGhostObject_setAnisotropicFriction_2.apply(null,
                arguments)
        },
        dl = b._emscripten_bind_btGhostObject_setCcdMotionThreshold_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_setCcdMotionThreshold_1.apply(null, arguments)
        },
        el = b._emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1.apply(null, arguments)
        },
        fl = b._emscripten_bind_btGhostObject_setCollisionFlags_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_setCollisionFlags_1.apply(null, arguments)
        },
        gl = b._emscripten_bind_btGhostObject_setCollisionShape_1 =
        function() {
            return b.asm._emscripten_bind_btGhostObject_setCollisionShape_1.apply(null, arguments)
        },
        hl = b._emscripten_bind_btGhostObject_setContactProcessingThreshold_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_setContactProcessingThreshold_1.apply(null, arguments)
        },
        il = b._emscripten_bind_btGhostObject_setFriction_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_setFriction_1.apply(null, arguments)
        },
        jl = b._emscripten_bind_btGhostObject_setRestitution_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_setRestitution_1.apply(null,
                arguments)
        },
        kl = b._emscripten_bind_btGhostObject_setRollingFriction_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_setRollingFriction_1.apply(null, arguments)
        },
        ll = b._emscripten_bind_btGhostObject_setUserIndex_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_setUserIndex_1.apply(null, arguments)
        },
        ml = b._emscripten_bind_btGhostObject_setUserPointer_1 = function() {
            return b.asm._emscripten_bind_btGhostObject_setUserPointer_1.apply(null, arguments)
        },
        nl = b._emscripten_bind_btGhostObject_setWorldTransform_1 =
        function() {
            return b.asm._emscripten_bind_btGhostObject_setWorldTransform_1.apply(null, arguments)
        },
        ol = b._emscripten_bind_btGhostPairCallback___destroy___0 = function() {
            return b.asm._emscripten_bind_btGhostPairCallback___destroy___0.apply(null, arguments)
        },
        pl = b._emscripten_bind_btGhostPairCallback_btGhostPairCallback_0 = function() {
            return b.asm._emscripten_bind_btGhostPairCallback_btGhostPairCallback_0.apply(null, arguments)
        },
        ql = b._emscripten_bind_btHeightfieldTerrainShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btHeightfieldTerrainShape___destroy___0.apply(null,
                arguments)
        },
        rl = b._emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9 = function() {
            return b.asm._emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9.apply(null, arguments)
        },
        sl = b._emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2.apply(null, arguments)
        },
        tl = b._emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0.apply(null,
                arguments)
        },
        ul = b._emscripten_bind_btHeightfieldTerrainShape_getMargin_0 = function() {
            return b.asm._emscripten_bind_btHeightfieldTerrainShape_getMargin_0.apply(null, arguments)
        },
        vl = b._emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1.apply(null, arguments)
        },
        wl = b._emscripten_bind_btHeightfieldTerrainShape_setMargin_1 = function() {
            return b.asm._emscripten_bind_btHeightfieldTerrainShape_setMargin_1.apply(null, arguments)
        },
        xl = b._emscripten_bind_btHingeConstraint___destroy___0 = function() {
            return b.asm._emscripten_bind_btHingeConstraint___destroy___0.apply(null, arguments)
        },
        yl = b._emscripten_bind_btHingeConstraint_btHingeConstraint_2 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_btHingeConstraint_2.apply(null, arguments)
        },
        zl = b._emscripten_bind_btHingeConstraint_btHingeConstraint_3 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_btHingeConstraint_3.apply(null, arguments)
        },
        Al = b._emscripten_bind_btHingeConstraint_btHingeConstraint_4 =
        function() {
            return b.asm._emscripten_bind_btHingeConstraint_btHingeConstraint_4.apply(null, arguments)
        },
        Bl = b._emscripten_bind_btHingeConstraint_btHingeConstraint_5 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_btHingeConstraint_5.apply(null, arguments)
        },
        Cl = b._emscripten_bind_btHingeConstraint_btHingeConstraint_6 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_btHingeConstraint_6.apply(null, arguments)
        },
        Dl = b._emscripten_bind_btHingeConstraint_btHingeConstraint_7 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_btHingeConstraint_7.apply(null,
                arguments)
        },
        El = b._emscripten_bind_btHingeConstraint_enableAngularMotor_3 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_enableAngularMotor_3.apply(null, arguments)
        },
        Fl = b._emscripten_bind_btHingeConstraint_enableFeedback_1 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_enableFeedback_1.apply(null, arguments)
        },
        Gl = b._emscripten_bind_btHingeConstraint_enableMotor_1 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_enableMotor_1.apply(null, arguments)
        },
        Hl = b._emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0 =
        function() {
            return b.asm._emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0.apply(null, arguments)
        },
        Il = b._emscripten_bind_btHingeConstraint_getParam_2 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_getParam_2.apply(null, arguments)
        },
        Jl = b._emscripten_bind_btHingeConstraint_setAngularOnly_1 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_setAngularOnly_1.apply(null, arguments)
        },
        Kl = b._emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1.apply(null,
                arguments)
        },
        Ll = b._emscripten_bind_btHingeConstraint_setLimit_4 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_setLimit_4.apply(null, arguments)
        },
        Ml = b._emscripten_bind_btHingeConstraint_setLimit_5 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_setLimit_5.apply(null, arguments)
        },
        Nl = b._emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1.apply(null, arguments)
        },
        Ol = b._emscripten_bind_btHingeConstraint_setMotorTarget_2 =
        function() {
            return b.asm._emscripten_bind_btHingeConstraint_setMotorTarget_2.apply(null, arguments)
        },
        Pl = b._emscripten_bind_btHingeConstraint_setParam_3 = function() {
            return b.asm._emscripten_bind_btHingeConstraint_setParam_3.apply(null, arguments)
        },
        Ql = b._emscripten_bind_btKinematicCharacterController___destroy___0 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController___destroy___0.apply(null, arguments)
        },
        Rl = b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3 =
        function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3.apply(null, arguments)
        },
        Sl = b._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4.apply(null, arguments)
        },
        Tl = b._emscripten_bind_btKinematicCharacterController_canJump_0 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_canJump_0.apply(null, arguments)
        },
        Ul = b._emscripten_bind_btKinematicCharacterController_getGhostObject_0 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_getGhostObject_0.apply(null, arguments)
        },
        Vl = b._emscripten_bind_btKinematicCharacterController_getGravity_0 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_getGravity_0.apply(null, arguments)
        },
        Wl = b._emscripten_bind_btKinematicCharacterController_getMaxSlope_0 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_getMaxSlope_0.apply(null,
                arguments)
        },
        Xl = b._emscripten_bind_btKinematicCharacterController_jump_0 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_jump_0.apply(null, arguments)
        },
        Yl = b._emscripten_bind_btKinematicCharacterController_onGround_0 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_onGround_0.apply(null, arguments)
        },
        Zl = b._emscripten_bind_btKinematicCharacterController_playerStep_2 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_playerStep_2.apply(null,
                arguments)
        },
        $l = b._emscripten_bind_btKinematicCharacterController_preStep_1 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_preStep_1.apply(null, arguments)
        },
        am = b._emscripten_bind_btKinematicCharacterController_setFallSpeed_1 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_setFallSpeed_1.apply(null, arguments)
        },
        bm = b._emscripten_bind_btKinematicCharacterController_setGravity_1 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_setGravity_1.apply(null,
                arguments)
        },
        cm = b._emscripten_bind_btKinematicCharacterController_setJumpSpeed_1 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_setJumpSpeed_1.apply(null, arguments)
        },
        dm = b._emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1.apply(null, arguments)
        },
        em = b._emscripten_bind_btKinematicCharacterController_setMaxSlope_1 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_setMaxSlope_1.apply(null,
                arguments)
        },
        fm = b._emscripten_bind_btKinematicCharacterController_setUpAxis_1 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_setUpAxis_1.apply(null, arguments)
        },
        gm = b._emscripten_bind_btKinematicCharacterController_setUpInterpolate_1 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_setUpInterpolate_1.apply(null, arguments)
        },
        hm = b._emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1.apply(null,
                arguments)
        },
        im = b._emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2.apply(null, arguments)
        },
        jm = b._emscripten_bind_btKinematicCharacterController_setWalkDirection_1 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_setWalkDirection_1.apply(null, arguments)
        },
        km = b._emscripten_bind_btKinematicCharacterController_updateAction_2 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_updateAction_2.apply(null,
                arguments)
        },
        lm = b._emscripten_bind_btKinematicCharacterController_warp_1 = function() {
            return b.asm._emscripten_bind_btKinematicCharacterController_warp_1.apply(null, arguments)
        },
        mm = b._emscripten_bind_btManifoldPoint___destroy___0 = function() {
            return b.asm._emscripten_bind_btManifoldPoint___destroy___0.apply(null, arguments)
        },
        nm = b._emscripten_bind_btManifoldPoint_getAppliedImpulse_0 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_getAppliedImpulse_0.apply(null, arguments)
        },
        om = b._emscripten_bind_btManifoldPoint_getDistance_0 =
        function() {
            return b.asm._emscripten_bind_btManifoldPoint_getDistance_0.apply(null, arguments)
        },
        pm = b._emscripten_bind_btManifoldPoint_getPositionWorldOnA_0 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_getPositionWorldOnA_0.apply(null, arguments)
        },
        qm = b._emscripten_bind_btManifoldPoint_getPositionWorldOnB_0 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_getPositionWorldOnB_0.apply(null, arguments)
        },
        rm = b._emscripten_bind_btManifoldPoint_get_m_localPointA_0 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_get_m_localPointA_0.apply(null,
                arguments)
        },
        sm = b._emscripten_bind_btManifoldPoint_get_m_localPointB_0 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_get_m_localPointB_0.apply(null, arguments)
        },
        tm = b._emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0.apply(null, arguments)
        },
        um = b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0.apply(null, arguments)
        },
        wm = b._emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0.apply(null, arguments)
        },
        xm = b._emscripten_bind_btManifoldPoint_set_m_localPointA_1 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_set_m_localPointA_1.apply(null, arguments)
        },
        ym = b._emscripten_bind_btManifoldPoint_set_m_localPointB_1 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_set_m_localPointB_1.apply(null, arguments)
        },
        zm = b._emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1 =
        function() {
            return b.asm._emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1.apply(null, arguments)
        },
        Am = b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1.apply(null, arguments)
        },
        Bm = b._emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1 = function() {
            return b.asm._emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1.apply(null, arguments)
        },
        Cm = b._emscripten_bind_btMatrix3x3___destroy___0 = function() {
            return b.asm._emscripten_bind_btMatrix3x3___destroy___0.apply(null,
                arguments)
        },
        Dm = b._emscripten_bind_btMatrix3x3_getRotation_1 = function() {
            return b.asm._emscripten_bind_btMatrix3x3_getRotation_1.apply(null, arguments)
        },
        Em = b._emscripten_bind_btMatrix3x3_getRow_1 = function() {
            return b.asm._emscripten_bind_btMatrix3x3_getRow_1.apply(null, arguments)
        },
        Fm = b._emscripten_bind_btMatrix3x3_setEulerZYX_3 = function() {
            return b.asm._emscripten_bind_btMatrix3x3_setEulerZYX_3.apply(null, arguments)
        },
        Gm = b._emscripten_bind_btMotionState___destroy___0 = function() {
            return b.asm._emscripten_bind_btMotionState___destroy___0.apply(null,
                arguments)
        },
        Hm = b._emscripten_bind_btMotionState_getWorldTransform_1 = function() {
            return b.asm._emscripten_bind_btMotionState_getWorldTransform_1.apply(null, arguments)
        },
        Im = b._emscripten_bind_btMotionState_setWorldTransform_1 = function() {
            return b.asm._emscripten_bind_btMotionState_setWorldTransform_1.apply(null, arguments)
        },
        Jm = b._emscripten_bind_btOverlappingPairCache___destroy___0 = function() {
            return b.asm._emscripten_bind_btOverlappingPairCache___destroy___0.apply(null, arguments)
        },
        Km = b._emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1 =
        function() {
            return b.asm._emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1.apply(null, arguments)
        },
        Lm = b._emscripten_bind_btOverlappingPairCallback___destroy___0 = function() {
            return b.asm._emscripten_bind_btOverlappingPairCallback___destroy___0.apply(null, arguments)
        },
        Mm = b._emscripten_bind_btPairCachingGhostObject___destroy___0 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject___destroy___0.apply(null, arguments)
        },
        Nm = b._emscripten_bind_btPairCachingGhostObject_activate_0 =
        function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_activate_0.apply(null, arguments)
        },
        Om = b._emscripten_bind_btPairCachingGhostObject_activate_1 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_activate_1.apply(null, arguments)
        },
        Pm = b._emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0.apply(null, arguments)
        },
        Qm = b._emscripten_bind_btPairCachingGhostObject_forceActivationState_1 =
        function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_forceActivationState_1.apply(null, arguments)
        },
        Rm = b._emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0.apply(null, arguments)
        },
        Sm = b._emscripten_bind_btPairCachingGhostObject_getCollisionShape_0 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_getCollisionShape_0.apply(null, arguments)
        },
        Tm = b._emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0 =
        function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0.apply(null, arguments)
        },
        Um = b._emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1.apply(null, arguments)
        },
        Vm = b._emscripten_bind_btPairCachingGhostObject_getUserIndex_0 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_getUserIndex_0.apply(null, arguments)
        },
        Wm = b._emscripten_bind_btPairCachingGhostObject_getUserPointer_0 =
        function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_getUserPointer_0.apply(null, arguments)
        },
        Xm = b._emscripten_bind_btPairCachingGhostObject_getWorldTransform_0 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_getWorldTransform_0.apply(null, arguments)
        },
        Ym = b._emscripten_bind_btPairCachingGhostObject_isActive_0 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_isActive_0.apply(null, arguments)
        },
        Zm = b._emscripten_bind_btPairCachingGhostObject_isKinematicObject_0 =
        function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_isKinematicObject_0.apply(null, arguments)
        },
        $m = b._emscripten_bind_btPairCachingGhostObject_isStaticObject_0 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_isStaticObject_0.apply(null, arguments)
        },
        an = b._emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0.apply(null, arguments)
        },
        bn = b._emscripten_bind_btPairCachingGhostObject_setActivationState_1 =
        function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setActivationState_1.apply(null, arguments)
        },
        cn = b._emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2.apply(null, arguments)
        },
        dn = b._emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1.apply(null, arguments)
        },
        en = b._emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1 =
        function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1.apply(null, arguments)
        },
        fn = b._emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1.apply(null, arguments)
        },
        gn = b._emscripten_bind_btPairCachingGhostObject_setCollisionShape_1 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setCollisionShape_1.apply(null, arguments)
        },
        hn = b._emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1 =
        function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1.apply(null, arguments)
        },
        jn = b._emscripten_bind_btPairCachingGhostObject_setFriction_1 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setFriction_1.apply(null, arguments)
        },
        kn = b._emscripten_bind_btPairCachingGhostObject_setRestitution_1 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setRestitution_1.apply(null, arguments)
        },
        ln = b._emscripten_bind_btPairCachingGhostObject_setRollingFriction_1 =
        function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setRollingFriction_1.apply(null, arguments)
        },
        mn = b._emscripten_bind_btPairCachingGhostObject_setUserIndex_1 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setUserIndex_1.apply(null, arguments)
        },
        nn = b._emscripten_bind_btPairCachingGhostObject_setUserPointer_1 = function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setUserPointer_1.apply(null, arguments)
        },
        on = b._emscripten_bind_btPairCachingGhostObject_setWorldTransform_1 =
        function() {
            return b.asm._emscripten_bind_btPairCachingGhostObject_setWorldTransform_1.apply(null, arguments)
        },
        pn = b._emscripten_bind_btPersistentManifold___destroy___0 = function() {
            return b.asm._emscripten_bind_btPersistentManifold___destroy___0.apply(null, arguments)
        },
        qn = b._emscripten_bind_btPersistentManifold_btPersistentManifold_0 = function() {
            return b.asm._emscripten_bind_btPersistentManifold_btPersistentManifold_0.apply(null, arguments)
        },
        rn = b._emscripten_bind_btPersistentManifold_getBody0_0 = function() {
            return b.asm._emscripten_bind_btPersistentManifold_getBody0_0.apply(null,
                arguments)
        },
        sn = b._emscripten_bind_btPersistentManifold_getBody1_0 = function() {
            return b.asm._emscripten_bind_btPersistentManifold_getBody1_0.apply(null, arguments)
        },
        tn = b._emscripten_bind_btPersistentManifold_getContactPoint_1 = function() {
            return b.asm._emscripten_bind_btPersistentManifold_getContactPoint_1.apply(null, arguments)
        },
        un = b._emscripten_bind_btPersistentManifold_getNumContacts_0 = function() {
            return b.asm._emscripten_bind_btPersistentManifold_getNumContacts_0.apply(null, arguments)
        },
        vn = b._emscripten_bind_btPoint2PointConstraint___destroy___0 =
        function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint___destroy___0.apply(null, arguments)
        },
        wn = b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2 = function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2.apply(null, arguments)
        },
        xn = b._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4 = function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4.apply(null, arguments)
        },
        yn = b._emscripten_bind_btPoint2PointConstraint_enableFeedback_1 =
        function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_enableFeedback_1.apply(null, arguments)
        },
        zn = b._emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0 = function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0.apply(null, arguments)
        },
        An = b._emscripten_bind_btPoint2PointConstraint_getParam_2 = function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_getParam_2.apply(null, arguments)
        },
        Bn = b._emscripten_bind_btPoint2PointConstraint_getPivotInA_0 =
        function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_getPivotInA_0.apply(null, arguments)
        },
        Cn = b._emscripten_bind_btPoint2PointConstraint_getPivotInB_0 = function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_getPivotInB_0.apply(null, arguments)
        },
        Dn = b._emscripten_bind_btPoint2PointConstraint_get_m_setting_0 = function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_get_m_setting_0.apply(null, arguments)
        },
        En = b._emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1 =
        function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1.apply(null, arguments)
        },
        Fn = b._emscripten_bind_btPoint2PointConstraint_setParam_3 = function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_setParam_3.apply(null, arguments)
        },
        Gn = b._emscripten_bind_btPoint2PointConstraint_setPivotA_1 = function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_setPivotA_1.apply(null, arguments)
        },
        Hn = b._emscripten_bind_btPoint2PointConstraint_setPivotB_1 = function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_setPivotB_1.apply(null,
                arguments)
        },
        In = b._emscripten_bind_btPoint2PointConstraint_set_m_setting_1 = function() {
            return b.asm._emscripten_bind_btPoint2PointConstraint_set_m_setting_1.apply(null, arguments)
        },
        Jn = b._emscripten_bind_btQuadWord___destroy___0 = function() {
            return b.asm._emscripten_bind_btQuadWord___destroy___0.apply(null, arguments)
        },
        Kn = b._emscripten_bind_btQuadWord_setW_1 = function() {
            return b.asm._emscripten_bind_btQuadWord_setW_1.apply(null, arguments)
        },
        Ln = b._emscripten_bind_btQuadWord_setX_1 = function() {
            return b.asm._emscripten_bind_btQuadWord_setX_1.apply(null,
                arguments)
        },
        Mn = b._emscripten_bind_btQuadWord_setY_1 = function() {
            return b.asm._emscripten_bind_btQuadWord_setY_1.apply(null, arguments)
        },
        Nn = b._emscripten_bind_btQuadWord_setZ_1 = function() {
            return b.asm._emscripten_bind_btQuadWord_setZ_1.apply(null, arguments)
        },
        On = b._emscripten_bind_btQuadWord_w_0 = function() {
            return b.asm._emscripten_bind_btQuadWord_w_0.apply(null, arguments)
        },
        Pn = b._emscripten_bind_btQuadWord_x_0 = function() {
            return b.asm._emscripten_bind_btQuadWord_x_0.apply(null, arguments)
        },
        Qn = b._emscripten_bind_btQuadWord_y_0 =
        function() {
            return b.asm._emscripten_bind_btQuadWord_y_0.apply(null, arguments)
        },
        Rn = b._emscripten_bind_btQuadWord_z_0 = function() {
            return b.asm._emscripten_bind_btQuadWord_z_0.apply(null, arguments)
        },
        Sn = b._emscripten_bind_btQuaternion___destroy___0 = function() {
            return b.asm._emscripten_bind_btQuaternion___destroy___0.apply(null, arguments)
        },
        Tn = b._emscripten_bind_btQuaternion_angleShortestPath_1 = function() {
            return b.asm._emscripten_bind_btQuaternion_angleShortestPath_1.apply(null, arguments)
        },
        Un = b._emscripten_bind_btQuaternion_angle_1 =
        function() {
            return b.asm._emscripten_bind_btQuaternion_angle_1.apply(null, arguments)
        },
        Vn = b._emscripten_bind_btQuaternion_btQuaternion_4 = function() {
            return b.asm._emscripten_bind_btQuaternion_btQuaternion_4.apply(null, arguments)
        },
        Wn = b._emscripten_bind_btQuaternion_dot_1 = function() {
            return b.asm._emscripten_bind_btQuaternion_dot_1.apply(null, arguments)
        },
        Xn = b._emscripten_bind_btQuaternion_getAngleShortestPath_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_getAngleShortestPath_0.apply(null, arguments)
        },
        Yn = b._emscripten_bind_btQuaternion_getAngle_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_getAngle_0.apply(null, arguments)
        },
        Zn = b._emscripten_bind_btQuaternion_getAxis_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_getAxis_0.apply(null, arguments)
        },
        $n = b._emscripten_bind_btQuaternion_inverse_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_inverse_0.apply(null, arguments)
        },
        ao = b._emscripten_bind_btQuaternion_length2_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_length2_0.apply(null,
                arguments)
        },
        bo = b._emscripten_bind_btQuaternion_length_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_length_0.apply(null, arguments)
        },
        co = b._emscripten_bind_btQuaternion_normalize_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_normalize_0.apply(null, arguments)
        },
        eo = b._emscripten_bind_btQuaternion_normalized_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_normalized_0.apply(null, arguments)
        },
        fo = b._emscripten_bind_btQuaternion_op_add_1 = function() {
            return b.asm._emscripten_bind_btQuaternion_op_add_1.apply(null,
                arguments)
        },
        go = b._emscripten_bind_btQuaternion_op_div_1 = function() {
            return b.asm._emscripten_bind_btQuaternion_op_div_1.apply(null, arguments)
        },
        ho = b._emscripten_bind_btQuaternion_op_mul_1 = function() {
            return b.asm._emscripten_bind_btQuaternion_op_mul_1.apply(null, arguments)
        },
        io = b._emscripten_bind_btQuaternion_op_mulq_1 = function() {
            return b.asm._emscripten_bind_btQuaternion_op_mulq_1.apply(null, arguments)
        },
        jo = b._emscripten_bind_btQuaternion_op_sub_1 = function() {
            return b.asm._emscripten_bind_btQuaternion_op_sub_1.apply(null,
                arguments)
        },
        ko = b._emscripten_bind_btQuaternion_setEulerZYX_3 = function() {
            return b.asm._emscripten_bind_btQuaternion_setEulerZYX_3.apply(null, arguments)
        },
        lo = b._emscripten_bind_btQuaternion_setRotation_2 = function() {
            return b.asm._emscripten_bind_btQuaternion_setRotation_2.apply(null, arguments)
        },
        mo = b._emscripten_bind_btQuaternion_setValue_4 = function() {
            return b.asm._emscripten_bind_btQuaternion_setValue_4.apply(null, arguments)
        },
        no = b._emscripten_bind_btQuaternion_setW_1 = function() {
            return b.asm._emscripten_bind_btQuaternion_setW_1.apply(null,
                arguments)
        },
        oo = b._emscripten_bind_btQuaternion_setX_1 = function() {
            return b.asm._emscripten_bind_btQuaternion_setX_1.apply(null, arguments)
        },
        po = b._emscripten_bind_btQuaternion_setY_1 = function() {
            return b.asm._emscripten_bind_btQuaternion_setY_1.apply(null, arguments)
        },
        qo = b._emscripten_bind_btQuaternion_setZ_1 = function() {
            return b.asm._emscripten_bind_btQuaternion_setZ_1.apply(null, arguments)
        },
        ro = b._emscripten_bind_btQuaternion_w_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_w_0.apply(null, arguments)
        },
        so = b._emscripten_bind_btQuaternion_x_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_x_0.apply(null, arguments)
        },
        to = b._emscripten_bind_btQuaternion_y_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_y_0.apply(null, arguments)
        },
        uo = b._emscripten_bind_btQuaternion_z_0 = function() {
            return b.asm._emscripten_bind_btQuaternion_z_0.apply(null, arguments)
        },
        vo = b._emscripten_bind_btRaycastVehicle___destroy___0 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle___destroy___0.apply(null, arguments)
        },
        wo = b._emscripten_bind_btRaycastVehicle_addWheel_7 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_addWheel_7.apply(null, arguments)
        },
        xo = b._emscripten_bind_btRaycastVehicle_applyEngineForce_2 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_applyEngineForce_2.apply(null, arguments)
        },
        yo = b._emscripten_bind_btRaycastVehicle_btRaycastVehicle_3 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_btRaycastVehicle_3.apply(null, arguments)
        },
        zo = b._emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0 =
        function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0.apply(null, arguments)
        },
        Ao = b._emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0.apply(null, arguments)
        },
        Bo = b._emscripten_bind_btRaycastVehicle_getForwardAxis_0 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getForwardAxis_0.apply(null, arguments)
        },
        Co = b._emscripten_bind_btRaycastVehicle_getForwardVector_0 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getForwardVector_0.apply(null,
                arguments)
        },
        Do = b._emscripten_bind_btRaycastVehicle_getNumWheels_0 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getNumWheels_0.apply(null, arguments)
        },
        Eo = b._emscripten_bind_btRaycastVehicle_getRightAxis_0 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getRightAxis_0.apply(null, arguments)
        },
        Fo = b._emscripten_bind_btRaycastVehicle_getRigidBody_0 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getRigidBody_0.apply(null, arguments)
        },
        Go = b._emscripten_bind_btRaycastVehicle_getSteeringValue_1 =
        function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getSteeringValue_1.apply(null, arguments)
        },
        Ho = b._emscripten_bind_btRaycastVehicle_getUpAxis_0 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getUpAxis_0.apply(null, arguments)
        },
        Io = b._emscripten_bind_btRaycastVehicle_getUserConstraintId_0 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getUserConstraintId_0.apply(null, arguments)
        },
        Jo = b._emscripten_bind_btRaycastVehicle_getUserConstraintType_0 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getUserConstraintType_0.apply(null,
                arguments)
        },
        Ko = b._emscripten_bind_btRaycastVehicle_getWheelInfo_1 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getWheelInfo_1.apply(null, arguments)
        },
        Lo = b._emscripten_bind_btRaycastVehicle_getWheelTransformWS_1 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_getWheelTransformWS_1.apply(null, arguments)
        },
        Mo = b._emscripten_bind_btRaycastVehicle_rayCast_1 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_rayCast_1.apply(null, arguments)
        },
        No = b._emscripten_bind_btRaycastVehicle_resetSuspension_0 =
        function() {
            return b.asm._emscripten_bind_btRaycastVehicle_resetSuspension_0.apply(null, arguments)
        },
        Oo = b._emscripten_bind_btRaycastVehicle_setBrake_2 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_setBrake_2.apply(null, arguments)
        },
        Po = b._emscripten_bind_btRaycastVehicle_setCoordinateSystem_3 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_setCoordinateSystem_3.apply(null, arguments)
        },
        Qo = b._emscripten_bind_btRaycastVehicle_setPitchControl_1 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_setPitchControl_1.apply(null,
                arguments)
        },
        Ro = b._emscripten_bind_btRaycastVehicle_setSteeringValue_2 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_setSteeringValue_2.apply(null, arguments)
        },
        So = b._emscripten_bind_btRaycastVehicle_setUserConstraintId_1 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_setUserConstraintId_1.apply(null, arguments)
        },
        To = b._emscripten_bind_btRaycastVehicle_setUserConstraintType_1 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_setUserConstraintType_1.apply(null, arguments)
        },
        Uo = b._emscripten_bind_btRaycastVehicle_updateAction_2 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_updateAction_2.apply(null, arguments)
        },
        Vo = b._emscripten_bind_btRaycastVehicle_updateFriction_1 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_updateFriction_1.apply(null, arguments)
        },
        Wo = b._emscripten_bind_btRaycastVehicle_updateSuspension_1 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_updateSuspension_1.apply(null, arguments)
        },
        Xo = b._emscripten_bind_btRaycastVehicle_updateVehicle_1 =
        function() {
            return b.asm._emscripten_bind_btRaycastVehicle_updateVehicle_1.apply(null, arguments)
        },
        Yo = b._emscripten_bind_btRaycastVehicle_updateWheelTransform_2 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_updateWheelTransform_2.apply(null, arguments)
        },
        Zo = b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1.apply(null, arguments)
        },
        $o = b._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2 = function() {
            return b.asm._emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2.apply(null,
                arguments)
        },
        ap = b._emscripten_bind_btRigidBodyConstructionInfo___destroy___0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo___destroy___0.apply(null, arguments)
        },
        bp = b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3.apply(null, arguments)
        },
        cp = b._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4.apply(null,
                arguments)
        },
        dp = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0.apply(null, arguments)
        },
        ep = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0.apply(null, arguments)
        },
        fp = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0 =
        function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0.apply(null, arguments)
        },
        gp = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0.apply(null, arguments)
        },
        hp = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0.apply(null,
                arguments)
        },
        ip = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0.apply(null, arguments)
        },
        jp = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0.apply(null, arguments)
        },
        kp = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0.apply(null,
                arguments)
        },
        lp = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0.apply(null, arguments)
        },
        mp = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0.apply(null, arguments)
        },
        np = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0.apply(null,
                arguments)
        },
        op = b._emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0.apply(null, arguments)
        },
        pp = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1.apply(null, arguments)
        },
        qp = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1 =
        function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1.apply(null, arguments)
        },
        rp = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1.apply(null, arguments)
        },
        sp = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1.apply(null,
                arguments)
        },
        tp = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1.apply(null, arguments)
        },
        up = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1.apply(null, arguments)
        },
        vp = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1 =
        function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1.apply(null, arguments)
        },
        wp = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1.apply(null, arguments)
        },
        xp = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1.apply(null, arguments)
        },
        yp = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1 =
        function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1.apply(null, arguments)
        },
        zp = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1.apply(null, arguments)
        },
        Ap = b._emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1 = function() {
            return b.asm._emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1.apply(null, arguments)
        },
        Bp = b._emscripten_bind_btRigidBody___destroy___0 =
        function() {
            return b.asm._emscripten_bind_btRigidBody___destroy___0.apply(null, arguments)
        },
        Cp = b._emscripten_bind_btRigidBody_activate_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_activate_0.apply(null, arguments)
        },
        Dp = b._emscripten_bind_btRigidBody_activate_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_activate_1.apply(null, arguments)
        },
        Ep = b._emscripten_bind_btRigidBody_applyCentralForce_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_applyCentralForce_1.apply(null, arguments)
        },
        Fp = b._emscripten_bind_btRigidBody_applyCentralImpulse_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_applyCentralImpulse_1.apply(null, arguments)
        },
        Gp = b._emscripten_bind_btRigidBody_applyCentralLocalForce_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_applyCentralLocalForce_1.apply(null, arguments)
        },
        Hp = b._emscripten_bind_btRigidBody_applyForce_2 = function() {
            return b.asm._emscripten_bind_btRigidBody_applyForce_2.apply(null, arguments)
        },
        Ip = b._emscripten_bind_btRigidBody_applyGravity_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_applyGravity_0.apply(null,
                arguments)
        },
        Jp = b._emscripten_bind_btRigidBody_applyImpulse_2 = function() {
            return b.asm._emscripten_bind_btRigidBody_applyImpulse_2.apply(null, arguments)
        },
        Kp = b._emscripten_bind_btRigidBody_applyLocalTorque_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_applyLocalTorque_1.apply(null, arguments)
        },
        Lp = b._emscripten_bind_btRigidBody_applyTorqueImpulse_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_applyTorqueImpulse_1.apply(null, arguments)
        },
        Mp = b._emscripten_bind_btRigidBody_applyTorque_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_applyTorque_1.apply(null,
                arguments)
        },
        Np = b._emscripten_bind_btRigidBody_btRigidBody_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_btRigidBody_1.apply(null, arguments)
        },
        Op = b._emscripten_bind_btRigidBody_forceActivationState_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_forceActivationState_1.apply(null, arguments)
        },
        Pp = b._emscripten_bind_btRigidBody_getAabb_2 = function() {
            return b.asm._emscripten_bind_btRigidBody_getAabb_2.apply(null, arguments)
        },
        Qp = b._emscripten_bind_btRigidBody_getAngularVelocity_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_getAngularVelocity_0.apply(null,
                arguments)
        },
        Rp = b._emscripten_bind_btRigidBody_getCenterOfMassTransform_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_getCenterOfMassTransform_0.apply(null, arguments)
        },
        Sp = b._emscripten_bind_btRigidBody_getCollisionFlags_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_getCollisionFlags_0.apply(null, arguments)
        },
        Tp = b._emscripten_bind_btRigidBody_getCollisionShape_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_getCollisionShape_0.apply(null, arguments)
        },
        Up = b._emscripten_bind_btRigidBody_getGravity_0 =
        function() {
            return b.asm._emscripten_bind_btRigidBody_getGravity_0.apply(null, arguments)
        },
        Vp = b._emscripten_bind_btRigidBody_getLinearVelocity_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_getLinearVelocity_0.apply(null, arguments)
        },
        Wp = b._emscripten_bind_btRigidBody_getMotionState_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_getMotionState_0.apply(null, arguments)
        },
        Xp = b._emscripten_bind_btRigidBody_getUserIndex_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_getUserIndex_0.apply(null,
                arguments)
        },
        Yp = b._emscripten_bind_btRigidBody_getUserPointer_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_getUserPointer_0.apply(null, arguments)
        },
        Zp = b._emscripten_bind_btRigidBody_getWorldTransform_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_getWorldTransform_0.apply(null, arguments)
        },
        $p = b._emscripten_bind_btRigidBody_isActive_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_isActive_0.apply(null, arguments)
        },
        aq = b._emscripten_bind_btRigidBody_isKinematicObject_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_isKinematicObject_0.apply(null,
                arguments)
        },
        bq = b._emscripten_bind_btRigidBody_isStaticObject_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_isStaticObject_0.apply(null, arguments)
        },
        cq = b._emscripten_bind_btRigidBody_isStaticOrKinematicObject_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_isStaticOrKinematicObject_0.apply(null, arguments)
        },
        dq = b._emscripten_bind_btRigidBody_setActivationState_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setActivationState_1.apply(null, arguments)
        },
        eq = b._emscripten_bind_btRigidBody_setAngularFactor_1 =
        function() {
            return b.asm._emscripten_bind_btRigidBody_setAngularFactor_1.apply(null, arguments)
        },
        fq = b._emscripten_bind_btRigidBody_setAngularVelocity_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setAngularVelocity_1.apply(null, arguments)
        },
        gq = b._emscripten_bind_btRigidBody_setAnisotropicFriction_2 = function() {
            return b.asm._emscripten_bind_btRigidBody_setAnisotropicFriction_2.apply(null, arguments)
        },
        hq = b._emscripten_bind_btRigidBody_setCcdMotionThreshold_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setCcdMotionThreshold_1.apply(null,
                arguments)
        },
        iq = b._emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1.apply(null, arguments)
        },
        jq = b._emscripten_bind_btRigidBody_setCenterOfMassTransform_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setCenterOfMassTransform_1.apply(null, arguments)
        },
        kq = b._emscripten_bind_btRigidBody_setCollisionFlags_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setCollisionFlags_1.apply(null, arguments)
        },
        lq = b._emscripten_bind_btRigidBody_setCollisionShape_1 =
        function() {
            return b.asm._emscripten_bind_btRigidBody_setCollisionShape_1.apply(null, arguments)
        },
        mq = b._emscripten_bind_btRigidBody_setContactProcessingThreshold_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setContactProcessingThreshold_1.apply(null, arguments)
        },
        nq = b._emscripten_bind_btRigidBody_setDamping_2 = function() {
            return b.asm._emscripten_bind_btRigidBody_setDamping_2.apply(null, arguments)
        },
        oq = b._emscripten_bind_btRigidBody_setFriction_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setFriction_1.apply(null,
                arguments)
        },
        pq = b._emscripten_bind_btRigidBody_setGravity_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setGravity_1.apply(null, arguments)
        },
        qq = b._emscripten_bind_btRigidBody_setLinearFactor_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setLinearFactor_1.apply(null, arguments)
        },
        rq = b._emscripten_bind_btRigidBody_setLinearVelocity_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setLinearVelocity_1.apply(null, arguments)
        },
        sq = b._emscripten_bind_btRigidBody_setMassProps_2 = function() {
            return b.asm._emscripten_bind_btRigidBody_setMassProps_2.apply(null,
                arguments)
        },
        tq = b._emscripten_bind_btRigidBody_setMotionState_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setMotionState_1.apply(null, arguments)
        },
        uq = b._emscripten_bind_btRigidBody_setRestitution_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setRestitution_1.apply(null, arguments)
        },
        vq = b._emscripten_bind_btRigidBody_setRollingFriction_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setRollingFriction_1.apply(null, arguments)
        },
        wq = b._emscripten_bind_btRigidBody_setSleepingThresholds_2 =
        function() {
            return b.asm._emscripten_bind_btRigidBody_setSleepingThresholds_2.apply(null, arguments)
        },
        xq = b._emscripten_bind_btRigidBody_setUserIndex_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setUserIndex_1.apply(null, arguments)
        },
        yq = b._emscripten_bind_btRigidBody_setUserPointer_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setUserPointer_1.apply(null, arguments)
        },
        zq = b._emscripten_bind_btRigidBody_setWorldTransform_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_setWorldTransform_1.apply(null,
                arguments)
        },
        Aq = b._emscripten_bind_btRigidBody_upcast_1 = function() {
            return b.asm._emscripten_bind_btRigidBody_upcast_1.apply(null, arguments)
        },
        Bq = b._emscripten_bind_btRigidBody_updateInertiaTensor_0 = function() {
            return b.asm._emscripten_bind_btRigidBody_updateInertiaTensor_0.apply(null, arguments)
        },
        Cq = b._emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0 = function() {
            return b.asm._emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0.apply(null, arguments)
        },
        Dq = b._emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0 =
        function() {
            return b.asm._emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0.apply(null, arguments)
        },
        Eq = b._emscripten_bind_btSliderConstraint___destroy___0 = function() {
            return b.asm._emscripten_bind_btSliderConstraint___destroy___0.apply(null, arguments)
        },
        Fq = b._emscripten_bind_btSliderConstraint_btSliderConstraint_3 = function() {
            return b.asm._emscripten_bind_btSliderConstraint_btSliderConstraint_3.apply(null, arguments)
        },
        Gq = b._emscripten_bind_btSliderConstraint_btSliderConstraint_5 =
        function() {
            return b.asm._emscripten_bind_btSliderConstraint_btSliderConstraint_5.apply(null, arguments)
        },
        Hq = b._emscripten_bind_btSliderConstraint_enableFeedback_1 = function() {
            return b.asm._emscripten_bind_btSliderConstraint_enableFeedback_1.apply(null, arguments)
        },
        Iq = b._emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0 = function() {
            return b.asm._emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0.apply(null, arguments)
        },
        Jq = b._emscripten_bind_btSliderConstraint_getParam_2 = function() {
            return b.asm._emscripten_bind_btSliderConstraint_getParam_2.apply(null,
                arguments)
        },
        Kq = b._emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1 = function() {
            return b.asm._emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1.apply(null, arguments)
        },
        Lq = b._emscripten_bind_btSliderConstraint_setLowerAngLimit_1 = function() {
            return b.asm._emscripten_bind_btSliderConstraint_setLowerAngLimit_1.apply(null, arguments)
        },
        Mq = b._emscripten_bind_btSliderConstraint_setLowerLinLimit_1 = function() {
            return b.asm._emscripten_bind_btSliderConstraint_setLowerLinLimit_1.apply(null,
                arguments)
        },
        Nq = b._emscripten_bind_btSliderConstraint_setParam_3 = function() {
            return b.asm._emscripten_bind_btSliderConstraint_setParam_3.apply(null, arguments)
        },
        Oq = b._emscripten_bind_btSliderConstraint_setUpperAngLimit_1 = function() {
            return b.asm._emscripten_bind_btSliderConstraint_setUpperAngLimit_1.apply(null, arguments)
        },
        Pq = b._emscripten_bind_btSliderConstraint_setUpperLinLimit_1 = function() {
            return b.asm._emscripten_bind_btSliderConstraint_setUpperLinLimit_1.apply(null, arguments)
        },
        Qq = b._emscripten_bind_btSoftBodyArray___destroy___0 =
        function() {
            return b.asm._emscripten_bind_btSoftBodyArray___destroy___0.apply(null, arguments)
        },
        Rq = b._emscripten_bind_btSoftBodyArray_at_1 = function() {
            return b.asm._emscripten_bind_btSoftBodyArray_at_1.apply(null, arguments)
        },
        Sq = b._emscripten_bind_btSoftBodyArray_size_0 = function() {
            return b.asm._emscripten_bind_btSoftBodyArray_size_0.apply(null, arguments)
        },
        Tq = b._emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4 = function() {
            return b.asm._emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4.apply(null, arguments)
        },
        Uq = b._emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4 = function() {
            return b.asm._emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4.apply(null, arguments)
        },
        Vq = b._emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5 = function() {
            return b.asm._emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5.apply(null, arguments)
        },
        Wq = b._emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10 = function() {
            return b.asm._emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10.apply(null, arguments)
        },
        Xq = b._emscripten_bind_btSoftBodyHelpers_CreatePatch_9 =
        function() {
            return b.asm._emscripten_bind_btSoftBodyHelpers_CreatePatch_9.apply(null, arguments)
        },
        Yq = b._emscripten_bind_btSoftBodyHelpers_CreateRope_5 = function() {
            return b.asm._emscripten_bind_btSoftBodyHelpers_CreateRope_5.apply(null, arguments)
        },
        Zq = b._emscripten_bind_btSoftBodyHelpers___destroy___0 = function() {
            return b.asm._emscripten_bind_btSoftBodyHelpers___destroy___0.apply(null, arguments)
        },
        $q = b._emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0 = function() {
            return b.asm._emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0.apply(null,
                arguments)
        },
        ar = b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0 = function() {
            return b.asm._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0.apply(null, arguments)
        },
        br = b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0 = function() {
            return b.asm._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0.apply(null, arguments)
        },
        cr = b._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1 =
        function() {
            return b.asm._emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1.apply(null, arguments)
        },
        dr = b._emscripten_bind_btSoftBodySolver___destroy___0 = function() {
            return b.asm._emscripten_bind_btSoftBodySolver___destroy___0.apply(null, arguments)
        },
        er = b._emscripten_bind_btSoftBodyWorldInfo___destroy___0 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo___destroy___0.apply(null, arguments)
        },
        fr = b._emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0 =
        function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0.apply(null, arguments)
        },
        gr = b._emscripten_bind_btSoftBodyWorldInfo_get_air_density_0 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_get_air_density_0.apply(null, arguments)
        },
        hr = b._emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0.apply(null, arguments)
        },
        ir = b._emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0.apply(null,
                arguments)
        },
        jr = b._emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0.apply(null, arguments)
        },
        kr = b._emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0.apply(null, arguments)
        },
        lr = b._emscripten_bind_btSoftBodyWorldInfo_get_water_density_0 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_get_water_density_0.apply(null, arguments)
        },
        mr = b._emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0.apply(null, arguments)
        },
        nr = b._emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0.apply(null, arguments)
        },
        or = b._emscripten_bind_btSoftBodyWorldInfo_set_air_density_1 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_set_air_density_1.apply(null, arguments)
        },
        pr = b._emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1 =
        function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1.apply(null, arguments)
        },
        qr = b._emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1.apply(null, arguments)
        },
        rr = b._emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1.apply(null, arguments)
        },
        sr = b._emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1.apply(null,
                arguments)
        },
        tr = b._emscripten_bind_btSoftBodyWorldInfo_set_water_density_1 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_set_water_density_1.apply(null, arguments)
        },
        ur = b._emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1.apply(null, arguments)
        },
        vr = b._emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1 = function() {
            return b.asm._emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1.apply(null, arguments)
        },
        wr = b._emscripten_bind_btSoftBody___destroy___0 = function() {
            return b.asm._emscripten_bind_btSoftBody___destroy___0.apply(null, arguments)
        },
        xr = b._emscripten_bind_btSoftBody_activate_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_activate_0.apply(null, arguments)
        },
        yr = b._emscripten_bind_btSoftBody_activate_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_activate_1.apply(null, arguments)
        },
        zr = b._emscripten_bind_btSoftBody_addAeroForceToNode_2 = function() {
            return b.asm._emscripten_bind_btSoftBody_addAeroForceToNode_2.apply(null,
                arguments)
        },
        Ar = b._emscripten_bind_btSoftBody_addForce_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_addForce_1.apply(null, arguments)
        },
        Br = b._emscripten_bind_btSoftBody_addForce_2 = function() {
            return b.asm._emscripten_bind_btSoftBody_addForce_2.apply(null, arguments)
        },
        Cr = b._emscripten_bind_btSoftBody_appendAnchor_4 = function() {
            return b.asm._emscripten_bind_btSoftBody_appendAnchor_4.apply(null, arguments)
        },
        Dr = b._emscripten_bind_btSoftBody_appendFace_4 = function() {
            return b.asm._emscripten_bind_btSoftBody_appendFace_4.apply(null,
                arguments)
        },
        Er = b._emscripten_bind_btSoftBody_appendLink_4 = function() {
            return b.asm._emscripten_bind_btSoftBody_appendLink_4.apply(null, arguments)
        },
        Fr = b._emscripten_bind_btSoftBody_appendMaterial_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_appendMaterial_0.apply(null, arguments)
        },
        Gr = b._emscripten_bind_btSoftBody_appendNode_2 = function() {
            return b.asm._emscripten_bind_btSoftBody_appendNode_2.apply(null, arguments)
        },
        Hr = b._emscripten_bind_btSoftBody_appendTetra_5 = function() {
            return b.asm._emscripten_bind_btSoftBody_appendTetra_5.apply(null,
                arguments)
        },
        Ir = b._emscripten_bind_btSoftBody_btSoftBody_4 = function() {
            return b.asm._emscripten_bind_btSoftBody_btSoftBody_4.apply(null, arguments)
        },
        Jr = b._emscripten_bind_btSoftBody_checkFace_3 = function() {
            return b.asm._emscripten_bind_btSoftBody_checkFace_3.apply(null, arguments)
        },
        Kr = b._emscripten_bind_btSoftBody_checkLink_2 = function() {
            return b.asm._emscripten_bind_btSoftBody_checkLink_2.apply(null, arguments)
        },
        Lr = b._emscripten_bind_btSoftBody_forceActivationState_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_forceActivationState_1.apply(null,
                arguments)
        },
        Mr = b._emscripten_bind_btSoftBody_generateBendingConstraints_2 = function() {
            return b.asm._emscripten_bind_btSoftBody_generateBendingConstraints_2.apply(null, arguments)
        },
        Nr = b._emscripten_bind_btSoftBody_generateClusters_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_generateClusters_1.apply(null, arguments)
        },
        Or = b._emscripten_bind_btSoftBody_generateClusters_2 = function() {
            return b.asm._emscripten_bind_btSoftBody_generateClusters_2.apply(null, arguments)
        },
        Pr = b._emscripten_bind_btSoftBody_getCollisionFlags_0 =
        function() {
            return b.asm._emscripten_bind_btSoftBody_getCollisionFlags_0.apply(null, arguments)
        },
        Qr = b._emscripten_bind_btSoftBody_getCollisionShape_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_getCollisionShape_0.apply(null, arguments)
        },
        Rr = b._emscripten_bind_btSoftBody_getTotalMass_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_getTotalMass_0.apply(null, arguments)
        },
        Sr = b._emscripten_bind_btSoftBody_getUserIndex_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_getUserIndex_0.apply(null,
                arguments)
        },
        Tr = b._emscripten_bind_btSoftBody_getUserPointer_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_getUserPointer_0.apply(null, arguments)
        },
        Ur = b._emscripten_bind_btSoftBody_getWorldTransform_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_getWorldTransform_0.apply(null, arguments)
        },
        Vr = b._emscripten_bind_btSoftBody_get_m_anchors_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_get_m_anchors_0.apply(null, arguments)
        },
        Wr = b._emscripten_bind_btSoftBody_get_m_cfg_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_get_m_cfg_0.apply(null,
                arguments)
        },
        Xr = b._emscripten_bind_btSoftBody_get_m_materials_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_get_m_materials_0.apply(null, arguments)
        },
        Yr = b._emscripten_bind_btSoftBody_get_m_nodes_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_get_m_nodes_0.apply(null, arguments)
        },
        Zr = b._emscripten_bind_btSoftBody_isActive_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_isActive_0.apply(null, arguments)
        },
        $r = b._emscripten_bind_btSoftBody_isKinematicObject_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_isKinematicObject_0.apply(null,
                arguments)
        },
        as = b._emscripten_bind_btSoftBody_isStaticObject_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_isStaticObject_0.apply(null, arguments)
        },
        bs = b._emscripten_bind_btSoftBody_isStaticOrKinematicObject_0 = function() {
            return b.asm._emscripten_bind_btSoftBody_isStaticOrKinematicObject_0.apply(null, arguments)
        },
        cs = b._emscripten_bind_btSoftBody_rotate_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_rotate_1.apply(null, arguments)
        },
        ds = b._emscripten_bind_btSoftBody_scale_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_scale_1.apply(null,
                arguments)
        },
        es = b._emscripten_bind_btSoftBody_setActivationState_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_setActivationState_1.apply(null, arguments)
        },
        gs = b._emscripten_bind_btSoftBody_setAnisotropicFriction_2 = function() {
            return b.asm._emscripten_bind_btSoftBody_setAnisotropicFriction_2.apply(null, arguments)
        },
        hs = b._emscripten_bind_btSoftBody_setCcdMotionThreshold_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_setCcdMotionThreshold_1.apply(null, arguments)
        },
        is = b._emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1 =
        function() {
            return b.asm._emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1.apply(null, arguments)
        },
        js = b._emscripten_bind_btSoftBody_setCollisionFlags_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_setCollisionFlags_1.apply(null, arguments)
        },
        ks = b._emscripten_bind_btSoftBody_setCollisionShape_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_setCollisionShape_1.apply(null, arguments)
        },
        ls = b._emscripten_bind_btSoftBody_setContactProcessingThreshold_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_setContactProcessingThreshold_1.apply(null,
                arguments)
        },
        ms = b._emscripten_bind_btSoftBody_setFriction_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_setFriction_1.apply(null, arguments)
        },
        ns = b._emscripten_bind_btSoftBody_setMass_2 = function() {
            return b.asm._emscripten_bind_btSoftBody_setMass_2.apply(null, arguments)
        },
        ps = b._emscripten_bind_btSoftBody_setRestitution_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_setRestitution_1.apply(null, arguments)
        },
        qs = b._emscripten_bind_btSoftBody_setRollingFriction_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_setRollingFriction_1.apply(null,
                arguments)
        },
        rs = b._emscripten_bind_btSoftBody_setTotalMass_2 = function() {
            return b.asm._emscripten_bind_btSoftBody_setTotalMass_2.apply(null, arguments)
        },
        ss = b._emscripten_bind_btSoftBody_setUserIndex_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_setUserIndex_1.apply(null, arguments)
        },
        ts = b._emscripten_bind_btSoftBody_setUserPointer_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_setUserPointer_1.apply(null, arguments)
        },
        us = b._emscripten_bind_btSoftBody_setWorldTransform_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_setWorldTransform_1.apply(null,
                arguments)
        },
        vs = b._emscripten_bind_btSoftBody_set_m_anchors_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_set_m_anchors_1.apply(null, arguments)
        },
        xs = b._emscripten_bind_btSoftBody_set_m_cfg_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_set_m_cfg_1.apply(null, arguments)
        },
        ys = b._emscripten_bind_btSoftBody_set_m_materials_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_set_m_materials_1.apply(null, arguments)
        },
        zs = b._emscripten_bind_btSoftBody_set_m_nodes_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_set_m_nodes_1.apply(null,
                arguments)
        },
        As = b._emscripten_bind_btSoftBody_transform_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_transform_1.apply(null, arguments)
        },
        Bs = b._emscripten_bind_btSoftBody_translate_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_translate_1.apply(null, arguments)
        },
        Cs = b._emscripten_bind_btSoftBody_upcast_1 = function() {
            return b.asm._emscripten_bind_btSoftBody_upcast_1.apply(null, arguments)
        },
        Ds = b._emscripten_bind_btSoftRigidDynamicsWorld___destroy___0 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld___destroy___0.apply(null,
                arguments)
        },
        Es = b._emscripten_bind_btSoftRigidDynamicsWorld_addAction_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_addAction_1.apply(null, arguments)
        },
        Fs = b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1.apply(null, arguments)
        },
        Gs = b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2.apply(null,
                arguments)
        },
        Hs = b._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3.apply(null, arguments)
        },
        Is = b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1.apply(null, arguments)
        },
        Js = b._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2.apply(null,
                arguments)
        },
        Ks = b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1.apply(null, arguments)
        },
        Ls = b._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3.apply(null, arguments)
        },
        Ms = b._emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3.apply(null, arguments)
        },
        Ns = b._emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5.apply(null, arguments)
        },
        Os = b._emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3.apply(null, arguments)
        },
        Ps = b._emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2.apply(null,
                arguments)
        },
        Qs = b._emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5.apply(null, arguments)
        },
        Rs = b._emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0.apply(null, arguments)
        },
        Ss = b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0.apply(null,
                arguments)
        },
        Ts = b._emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0.apply(null, arguments)
        },
        Us = b._emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0.apply(null, arguments)
        },
        Vs = b._emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0.apply(null, arguments)
        },
        Ws = b._emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0.apply(null, arguments)
        },
        Xs = b._emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0.apply(null, arguments)
        },
        Ys = b._emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0.apply(null, arguments)
        },
        Zs = b._emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3.apply(null, arguments)
        },
        $s = b._emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1.apply(null, arguments)
        },
        at = b._emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1.apply(null, arguments)
        },
        bt = b._emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1.apply(null, arguments)
        },
        ct = b._emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1.apply(null, arguments)
        },
        dt = b._emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1.apply(null,
                arguments)
        },
        et = b._emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1.apply(null, arguments)
        },
        ft = b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1.apply(null, arguments)
        },
        gt = b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2.apply(null,
                arguments)
        },
        ht = b._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3.apply(null, arguments)
        },
        it = b._emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1 = function() {
            return b.asm._emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1.apply(null, arguments)
        },
        jt = b._emscripten_bind_btSphereShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btSphereShape___destroy___0.apply(null, arguments)
        },
        kt =
        b._emscripten_bind_btSphereShape_btSphereShape_1 = function() {
            return b.asm._emscripten_bind_btSphereShape_btSphereShape_1.apply(null, arguments)
        },
        lt = b._emscripten_bind_btSphereShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btSphereShape_calculateLocalInertia_2.apply(null, arguments)
        },
        mt = b._emscripten_bind_btSphereShape_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btSphereShape_getLocalScaling_0.apply(null, arguments)
        },
        nt = b._emscripten_bind_btSphereShape_getMargin_0 =
        function() {
            return b.asm._emscripten_bind_btSphereShape_getMargin_0.apply(null, arguments)
        },
        ot = b._emscripten_bind_btSphereShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btSphereShape_setLocalScaling_1.apply(null, arguments)
        },
        pt = b._emscripten_bind_btSphereShape_setMargin_1 = function() {
            return b.asm._emscripten_bind_btSphereShape_setMargin_1.apply(null, arguments)
        },
        qt = b._emscripten_bind_btStaticPlaneShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btStaticPlaneShape___destroy___0.apply(null,
                arguments)
        },
        rt = b._emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2 = function() {
            return b.asm._emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2.apply(null, arguments)
        },
        st = b._emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2.apply(null, arguments)
        },
        tt = b._emscripten_bind_btStaticPlaneShape_getLocalScaling_0 = function() {
            return b.asm._emscripten_bind_btStaticPlaneShape_getLocalScaling_0.apply(null, arguments)
        },
        ut = b._emscripten_bind_btStaticPlaneShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btStaticPlaneShape_setLocalScaling_1.apply(null, arguments)
        },
        vt = b._emscripten_bind_btStridingMeshInterface___destroy___0 = function() {
            return b.asm._emscripten_bind_btStridingMeshInterface___destroy___0.apply(null, arguments)
        },
        wt = b._emscripten_bind_btTransform___destroy___0 = function() {
            return b.asm._emscripten_bind_btTransform___destroy___0.apply(null, arguments)
        },
        xt = b._emscripten_bind_btTransform_btTransform_0 =
        function() {
            return b.asm._emscripten_bind_btTransform_btTransform_0.apply(null, arguments)
        },
        yt = b._emscripten_bind_btTransform_btTransform_2 = function() {
            return b.asm._emscripten_bind_btTransform_btTransform_2.apply(null, arguments)
        },
        zt = b._emscripten_bind_btTransform_getBasis_0 = function() {
            return b.asm._emscripten_bind_btTransform_getBasis_0.apply(null, arguments)
        },
        At = b._emscripten_bind_btTransform_getOrigin_0 = function() {
            return b.asm._emscripten_bind_btTransform_getOrigin_0.apply(null, arguments)
        },
        Bt = b._emscripten_bind_btTransform_getRotation_0 =
        function() {
            return b.asm._emscripten_bind_btTransform_getRotation_0.apply(null, arguments)
        },
        Ct = b._emscripten_bind_btTransform_setFromOpenGLMatrix_1 = function() {
            return b.asm._emscripten_bind_btTransform_setFromOpenGLMatrix_1.apply(null, arguments)
        },
        Dt = b._emscripten_bind_btTransform_setIdentity_0 = function() {
            return b.asm._emscripten_bind_btTransform_setIdentity_0.apply(null, arguments)
        },
        Et = b._emscripten_bind_btTransform_setOrigin_1 = function() {
            return b.asm._emscripten_bind_btTransform_setOrigin_1.apply(null,
                arguments)
        },
        Ft = b._emscripten_bind_btTransform_setRotation_1 = function() {
            return b.asm._emscripten_bind_btTransform_setRotation_1.apply(null, arguments)
        },
        Gt = b._emscripten_bind_btTriangleMeshShape___destroy___0 = function() {
            return b.asm._emscripten_bind_btTriangleMeshShape___destroy___0.apply(null, arguments)
        },
        Ht = b._emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2 = function() {
            return b.asm._emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2.apply(null, arguments)
        },
        It = b._emscripten_bind_btTriangleMeshShape_getLocalScaling_0 =
        function() {
            return b.asm._emscripten_bind_btTriangleMeshShape_getLocalScaling_0.apply(null, arguments)
        },
        Jt = b._emscripten_bind_btTriangleMeshShape_setLocalScaling_1 = function() {
            return b.asm._emscripten_bind_btTriangleMeshShape_setLocalScaling_1.apply(null, arguments)
        },
        Kt = b._emscripten_bind_btTriangleMesh___destroy___0 = function() {
            return b.asm._emscripten_bind_btTriangleMesh___destroy___0.apply(null, arguments)
        },
        Lt = b._emscripten_bind_btTriangleMesh_addTriangle_3 = function() {
            return b.asm._emscripten_bind_btTriangleMesh_addTriangle_3.apply(null,
                arguments)
        },
        Mt = b._emscripten_bind_btTriangleMesh_addTriangle_4 = function() {
            return b.asm._emscripten_bind_btTriangleMesh_addTriangle_4.apply(null, arguments)
        },
        Nt = b._emscripten_bind_btTriangleMesh_btTriangleMesh_0 = function() {
            return b.asm._emscripten_bind_btTriangleMesh_btTriangleMesh_0.apply(null, arguments)
        },
        Ot = b._emscripten_bind_btTriangleMesh_btTriangleMesh_1 = function() {
            return b.asm._emscripten_bind_btTriangleMesh_btTriangleMesh_1.apply(null, arguments)
        },
        Pt = b._emscripten_bind_btTriangleMesh_btTriangleMesh_2 =
        function() {
            return b.asm._emscripten_bind_btTriangleMesh_btTriangleMesh_2.apply(null, arguments)
        },
        Qt = b._emscripten_bind_btTypedConstraint___destroy___0 = function() {
            return b.asm._emscripten_bind_btTypedConstraint___destroy___0.apply(null, arguments)
        },
        Rt = b._emscripten_bind_btTypedConstraint_enableFeedback_1 = function() {
            return b.asm._emscripten_bind_btTypedConstraint_enableFeedback_1.apply(null, arguments)
        },
        St = b._emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0 = function() {
            return b.asm._emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0.apply(null,
                arguments)
        },
        Tt = b._emscripten_bind_btTypedConstraint_getParam_2 = function() {
            return b.asm._emscripten_bind_btTypedConstraint_getParam_2.apply(null, arguments)
        },
        Ut = b._emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1 = function() {
            return b.asm._emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1.apply(null, arguments)
        },
        Vt = b._emscripten_bind_btTypedConstraint_setParam_3 = function() {
            return b.asm._emscripten_bind_btTypedConstraint_setParam_3.apply(null, arguments)
        },
        Wt = b._emscripten_bind_btVector3___destroy___0 =
        function() {
            return b.asm._emscripten_bind_btVector3___destroy___0.apply(null, arguments)
        },
        Xt = b._emscripten_bind_btVector3_btVector3_0 = function() {
            return b.asm._emscripten_bind_btVector3_btVector3_0.apply(null, arguments)
        },
        Yt = b._emscripten_bind_btVector3_btVector3_3 = function() {
            return b.asm._emscripten_bind_btVector3_btVector3_3.apply(null, arguments)
        },
        Zt = b._emscripten_bind_btVector3_dot_1 = function() {
            return b.asm._emscripten_bind_btVector3_dot_1.apply(null, arguments)
        },
        $t = b._emscripten_bind_btVector3_length_0 =
        function() {
            return b.asm._emscripten_bind_btVector3_length_0.apply(null, arguments)
        },
        au = b._emscripten_bind_btVector3_normalize_0 = function() {
            return b.asm._emscripten_bind_btVector3_normalize_0.apply(null, arguments)
        },
        bu = b._emscripten_bind_btVector3_op_add_1 = function() {
            return b.asm._emscripten_bind_btVector3_op_add_1.apply(null, arguments)
        },
        cu = b._emscripten_bind_btVector3_op_mul_1 = function() {
            return b.asm._emscripten_bind_btVector3_op_mul_1.apply(null, arguments)
        },
        du = b._emscripten_bind_btVector3_op_sub_1 =
        function() {
            return b.asm._emscripten_bind_btVector3_op_sub_1.apply(null, arguments)
        },
        eu = b._emscripten_bind_btVector3_rotate_2 = function() {
            return b.asm._emscripten_bind_btVector3_rotate_2.apply(null, arguments)
        },
        fu = b._emscripten_bind_btVector3_setValue_3 = function() {
            return b.asm._emscripten_bind_btVector3_setValue_3.apply(null, arguments)
        },
        gu = b._emscripten_bind_btVector3_setX_1 = function() {
            return b.asm._emscripten_bind_btVector3_setX_1.apply(null, arguments)
        },
        hu = b._emscripten_bind_btVector3_setY_1 = function() {
            return b.asm._emscripten_bind_btVector3_setY_1.apply(null,
                arguments)
        },
        iu = b._emscripten_bind_btVector3_setZ_1 = function() {
            return b.asm._emscripten_bind_btVector3_setZ_1.apply(null, arguments)
        },
        ju = b._emscripten_bind_btVector3_x_0 = function() {
            return b.asm._emscripten_bind_btVector3_x_0.apply(null, arguments)
        },
        ku = b._emscripten_bind_btVector3_y_0 = function() {
            return b.asm._emscripten_bind_btVector3_y_0.apply(null, arguments)
        },
        lu = b._emscripten_bind_btVector3_z_0 = function() {
            return b.asm._emscripten_bind_btVector3_z_0.apply(null, arguments)
        },
        mu = b._emscripten_bind_btVector4___destroy___0 =
        function() {
            return b.asm._emscripten_bind_btVector4___destroy___0.apply(null, arguments)
        },
        nu = b._emscripten_bind_btVector4_btVector4_0 = function() {
            return b.asm._emscripten_bind_btVector4_btVector4_0.apply(null, arguments)
        },
        ou = b._emscripten_bind_btVector4_btVector4_4 = function() {
            return b.asm._emscripten_bind_btVector4_btVector4_4.apply(null, arguments)
        },
        pu = b._emscripten_bind_btVector4_dot_1 = function() {
            return b.asm._emscripten_bind_btVector4_dot_1.apply(null, arguments)
        },
        qu = b._emscripten_bind_btVector4_length_0 =
        function() {
            return b.asm._emscripten_bind_btVector4_length_0.apply(null, arguments)
        },
        ru = b._emscripten_bind_btVector4_normalize_0 = function() {
            return b.asm._emscripten_bind_btVector4_normalize_0.apply(null, arguments)
        },
        su = b._emscripten_bind_btVector4_op_add_1 = function() {
            return b.asm._emscripten_bind_btVector4_op_add_1.apply(null, arguments)
        },
        tu = b._emscripten_bind_btVector4_op_mul_1 = function() {
            return b.asm._emscripten_bind_btVector4_op_mul_1.apply(null, arguments)
        },
        uu = b._emscripten_bind_btVector4_op_sub_1 =
        function() {
            return b.asm._emscripten_bind_btVector4_op_sub_1.apply(null, arguments)
        },
        vu = b._emscripten_bind_btVector4_rotate_2 = function() {
            return b.asm._emscripten_bind_btVector4_rotate_2.apply(null, arguments)
        },
        wu = b._emscripten_bind_btVector4_setValue_4 = function() {
            return b.asm._emscripten_bind_btVector4_setValue_4.apply(null, arguments)
        },
        xu = b._emscripten_bind_btVector4_setX_1 = function() {
            return b.asm._emscripten_bind_btVector4_setX_1.apply(null, arguments)
        },
        yu = b._emscripten_bind_btVector4_setY_1 = function() {
            return b.asm._emscripten_bind_btVector4_setY_1.apply(null,
                arguments)
        },
        zu = b._emscripten_bind_btVector4_setZ_1 = function() {
            return b.asm._emscripten_bind_btVector4_setZ_1.apply(null, arguments)
        },
        Au = b._emscripten_bind_btVector4_w_0 = function() {
            return b.asm._emscripten_bind_btVector4_w_0.apply(null, arguments)
        },
        Bu = b._emscripten_bind_btVector4_x_0 = function() {
            return b.asm._emscripten_bind_btVector4_x_0.apply(null, arguments)
        },
        Cu = b._emscripten_bind_btVector4_y_0 = function() {
            return b.asm._emscripten_bind_btVector4_y_0.apply(null, arguments)
        },
        Du = b._emscripten_bind_btVector4_z_0 =
        function() {
            return b.asm._emscripten_bind_btVector4_z_0.apply(null, arguments)
        },
        Eu = b._emscripten_bind_btVehicleRaycasterResult___destroy___0 = function() {
            return b.asm._emscripten_bind_btVehicleRaycasterResult___destroy___0.apply(null, arguments)
        },
        Fu = b._emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0 = function() {
            return b.asm._emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0.apply(null, arguments)
        },
        Gu = b._emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0 = function() {
            return b.asm._emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0.apply(null,
                arguments)
        },
        Hu = b._emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0 = function() {
            return b.asm._emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0.apply(null, arguments)
        },
        Iu = b._emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1 = function() {
            return b.asm._emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1.apply(null, arguments)
        },
        Ju = b._emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1 = function() {
            return b.asm._emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1.apply(null,
                arguments)
        },
        Ku = b._emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1 = function() {
            return b.asm._emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1.apply(null, arguments)
        },
        Lu = b._emscripten_bind_btVehicleRaycaster___destroy___0 = function() {
            return b.asm._emscripten_bind_btVehicleRaycaster___destroy___0.apply(null, arguments)
        },
        Mu = b._emscripten_bind_btVehicleRaycaster_castRay_3 = function() {
            return b.asm._emscripten_bind_btVehicleRaycaster_castRay_3.apply(null, arguments)
        },
        Nu = b._emscripten_bind_btVehicleTuning_btVehicleTuning_0 =
        function() {
            return b.asm._emscripten_bind_btVehicleTuning_btVehicleTuning_0.apply(null, arguments)
        },
        Ou = b._emscripten_bind_btVehicleTuning_get_m_frictionSlip_0 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_get_m_frictionSlip_0.apply(null, arguments)
        },
        Pu = b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0.apply(null, arguments)
        },
        Qu = b._emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0.apply(null,
                arguments)
        },
        Ru = b._emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0.apply(null, arguments)
        },
        Su = b._emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0.apply(null, arguments)
        },
        Tu = b._emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0.apply(null,
                arguments)
        },
        Uu = b._emscripten_bind_btVehicleTuning_set_m_frictionSlip_1 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_set_m_frictionSlip_1.apply(null, arguments)
        },
        Vu = b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1.apply(null, arguments)
        },
        Wu = b._emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1.apply(null,
                arguments)
        },
        Xu = b._emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1.apply(null, arguments)
        },
        Yu = b._emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1.apply(null, arguments)
        },
        Zu = b._emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1 = function() {
            return b.asm._emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1.apply(null,
                arguments)
        },
        $u = b._emscripten_bind_btWheelInfoConstructionInfo___destroy___0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo___destroy___0.apply(null, arguments)
        },
        av = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0.apply(null, arguments)
        },
        bv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0.apply(null,
                arguments)
        },
        cv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0.apply(null, arguments)
        },
        dv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0.apply(null, arguments)
        },
        ev = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0.apply(null,
                arguments)
        },
        fv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0.apply(null, arguments)
        },
        gv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0.apply(null, arguments)
        },
        hv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0.apply(null,
                arguments)
        },
        iv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0.apply(null, arguments)
        },
        jv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0.apply(null, arguments)
        },
        kv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0.apply(null,
                arguments)
        },
        lv = b._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0.apply(null, arguments)
        },
        mv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1.apply(null, arguments)
        },
        nv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1.apply(null,
                arguments)
        },
        ov = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1.apply(null, arguments)
        },
        pv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1.apply(null, arguments)
        },
        qv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1.apply(null,
                arguments)
        },
        rv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1.apply(null, arguments)
        },
        sv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1.apply(null, arguments)
        },
        tv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1.apply(null,
                arguments)
        },
        uv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1.apply(null, arguments)
        },
        vv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1.apply(null, arguments)
        },
        wv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1.apply(null,
                arguments)
        },
        xv = b._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1 = function() {
            return b.asm._emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1.apply(null, arguments)
        },
        yv = b._emscripten_bind_btWheelInfo___destroy___0 = function() {
            return b.asm._emscripten_bind_btWheelInfo___destroy___0.apply(null, arguments)
        },
        zv = b._emscripten_bind_btWheelInfo_btWheelInfo_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_btWheelInfo_1.apply(null, arguments)
        },
        Av = b._emscripten_bind_btWheelInfo_getSuspensionRestLength_0 =
        function() {
            return b.asm._emscripten_bind_btWheelInfo_getSuspensionRestLength_0.apply(null, arguments)
        },
        Bv = b._emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0.apply(null, arguments)
        },
        Cv = b._emscripten_bind_btWheelInfo_get_m_brake_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_brake_0.apply(null, arguments)
        },
        Dv = b._emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0.apply(null,
                arguments)
        },
        Ev = b._emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0.apply(null, arguments)
        },
        Fv = b._emscripten_bind_btWheelInfo_get_m_deltaRotation_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_deltaRotation_0.apply(null, arguments)
        },
        Gv = b._emscripten_bind_btWheelInfo_get_m_engineForce_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_engineForce_0.apply(null, arguments)
        },
        Hv = b._emscripten_bind_btWheelInfo_get_m_frictionSlip_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_frictionSlip_0.apply(null, arguments)
        },
        Iv = b._emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0.apply(null, arguments)
        },
        Jv = b._emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0.apply(null, arguments)
        },
        Kv = b._emscripten_bind_btWheelInfo_get_m_raycastInfo_0 =
        function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_raycastInfo_0.apply(null, arguments)
        },
        Lv = b._emscripten_bind_btWheelInfo_get_m_rollInfluence_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_rollInfluence_0.apply(null, arguments)
        },
        Mv = b._emscripten_bind_btWheelInfo_get_m_rotation_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_rotation_0.apply(null, arguments)
        },
        Nv = b._emscripten_bind_btWheelInfo_get_m_skidInfo_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_skidInfo_0.apply(null,
                arguments)
        },
        Ov = b._emscripten_bind_btWheelInfo_get_m_steering_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_steering_0.apply(null, arguments)
        },
        Pv = b._emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0.apply(null, arguments)
        },
        Qv = b._emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0.apply(null, arguments)
        },
        Rv = b._emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0.apply(null, arguments)
        },
        Sv = b._emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0.apply(null, arguments)
        },
        Tv = b._emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0.apply(null, arguments)
        },
        Uv = b._emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0 =
        function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0.apply(null, arguments)
        },
        Vv = b._emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0.apply(null, arguments)
        },
        Wv = b._emscripten_bind_btWheelInfo_get_m_wheelsRadius_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_wheelsRadius_0.apply(null, arguments)
        },
        Xv = b._emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0.apply(null,
                arguments)
        },
        Yv = b._emscripten_bind_btWheelInfo_get_m_worldTransform_0 = function() {
            return b.asm._emscripten_bind_btWheelInfo_get_m_worldTransform_0.apply(null, arguments)
        },
        Zv = b._emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1.apply(null, arguments)
        },
        $v = b._emscripten_bind_btWheelInfo_set_m_brake_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_brake_1.apply(null, arguments)
        },
        aw = b._emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1 =
        function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1.apply(null, arguments)
        },
        bw = b._emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1.apply(null, arguments)
        },
        cw = b._emscripten_bind_btWheelInfo_set_m_deltaRotation_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_deltaRotation_1.apply(null, arguments)
        },
        dw = b._emscripten_bind_btWheelInfo_set_m_engineForce_1 =
        function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_engineForce_1.apply(null, arguments)
        },
        ew = b._emscripten_bind_btWheelInfo_set_m_frictionSlip_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_frictionSlip_1.apply(null, arguments)
        },
        fw = b._emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1.apply(null, arguments)
        },
        gw = b._emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1.apply(null,
                arguments)
        },
        hw = b._emscripten_bind_btWheelInfo_set_m_raycastInfo_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_raycastInfo_1.apply(null, arguments)
        },
        iw = b._emscripten_bind_btWheelInfo_set_m_rollInfluence_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_rollInfluence_1.apply(null, arguments)
        },
        jw = b._emscripten_bind_btWheelInfo_set_m_rotation_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_rotation_1.apply(null, arguments)
        },
        kw = b._emscripten_bind_btWheelInfo_set_m_skidInfo_1 =
        function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_skidInfo_1.apply(null, arguments)
        },
        lw = b._emscripten_bind_btWheelInfo_set_m_steering_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_steering_1.apply(null, arguments)
        },
        mw = b._emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1.apply(null, arguments)
        },
        nw = b._emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1.apply(null,
                arguments)
        },
        ow = b._emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1.apply(null, arguments)
        },
        pw = b._emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1.apply(null, arguments)
        },
        qw = b._emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1.apply(null, arguments)
        },
        rw = b._emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1 =
        function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1.apply(null, arguments)
        },
        sw = b._emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1.apply(null, arguments)
        },
        tw = b._emscripten_bind_btWheelInfo_set_m_wheelsRadius_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_wheelsRadius_1.apply(null, arguments)
        },
        uw = b._emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1.apply(null,
                arguments)
        },
        vw = b._emscripten_bind_btWheelInfo_set_m_worldTransform_1 = function() {
            return b.asm._emscripten_bind_btWheelInfo_set_m_worldTransform_1.apply(null, arguments)
        },
        ww = b._emscripten_bind_btWheelInfo_updateWheel_2 = function() {
            return b.asm._emscripten_bind_btWheelInfo_updateWheel_2.apply(null, arguments)
        },
        xw = b._emscripten_bind_tAnchorArray___destroy___0 = function() {
            return b.asm._emscripten_bind_tAnchorArray___destroy___0.apply(null, arguments)
        },
        yw = b._emscripten_bind_tAnchorArray_at_1 = function() {
            return b.asm._emscripten_bind_tAnchorArray_at_1.apply(null,
                arguments)
        },
        zw = b._emscripten_bind_tAnchorArray_clear_0 = function() {
            return b.asm._emscripten_bind_tAnchorArray_clear_0.apply(null, arguments)
        },
        Aw = b._emscripten_bind_tAnchorArray_pop_back_0 = function() {
            return b.asm._emscripten_bind_tAnchorArray_pop_back_0.apply(null, arguments)
        },
        Bw = b._emscripten_bind_tAnchorArray_push_back_1 = function() {
            return b.asm._emscripten_bind_tAnchorArray_push_back_1.apply(null, arguments)
        },
        Cw = b._emscripten_bind_tAnchorArray_size_0 = function() {
            return b.asm._emscripten_bind_tAnchorArray_size_0.apply(null,
                arguments)
        },
        Dw = b._emscripten_bind_tMaterialArray___destroy___0 = function() {
            return b.asm._emscripten_bind_tMaterialArray___destroy___0.apply(null, arguments)
        },
        Ew = b._emscripten_bind_tMaterialArray_at_1 = function() {
            return b.asm._emscripten_bind_tMaterialArray_at_1.apply(null, arguments)
        },
        Fw = b._emscripten_bind_tMaterialArray_size_0 = function() {
            return b.asm._emscripten_bind_tMaterialArray_size_0.apply(null, arguments)
        },
        Gw = b._emscripten_bind_tNodeArray___destroy___0 = function() {
            return b.asm._emscripten_bind_tNodeArray___destroy___0.apply(null,
                arguments)
        },
        Hw = b._emscripten_bind_tNodeArray_at_1 = function() {
            return b.asm._emscripten_bind_tNodeArray_at_1.apply(null, arguments)
        },
        Iw = b._emscripten_bind_tNodeArray_size_0 = function() {
            return b.asm._emscripten_bind_tNodeArray_size_0.apply(null, arguments)
        },
        Jw = b._emscripten_enum_PHY_ScalarType_PHY_DOUBLE = function() {
            return b.asm._emscripten_enum_PHY_ScalarType_PHY_DOUBLE.apply(null, arguments)
        },
        Kw = b._emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88 = function() {
            return b.asm._emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88.apply(null,
                arguments)
        },
        Lw = b._emscripten_enum_PHY_ScalarType_PHY_FLOAT = function() {
            return b.asm._emscripten_enum_PHY_ScalarType_PHY_FLOAT.apply(null, arguments)
        },
        Mw = b._emscripten_enum_PHY_ScalarType_PHY_INTEGER = function() {
            return b.asm._emscripten_enum_PHY_ScalarType_PHY_INTEGER.apply(null, arguments)
        },
        Nw = b._emscripten_enum_PHY_ScalarType_PHY_SHORT = function() {
            return b.asm._emscripten_enum_PHY_ScalarType_PHY_SHORT.apply(null, arguments)
        },
        Ow = b._emscripten_enum_PHY_ScalarType_PHY_UCHAR = function() {
            return b.asm._emscripten_enum_PHY_ScalarType_PHY_UCHAR.apply(null,
                arguments)
        },
        Pw = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM = function() {
            return b.asm._emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM.apply(null, arguments)
        },
        Qw = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP = function() {
            return b.asm._emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP.apply(null, arguments)
        },
        Rw = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM = function() {
            return b.asm._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM.apply(null, arguments)
        },
        Sw = b._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP = function() {
            return b.asm._emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP.apply(null, arguments)
        };
    b._free = function() {
        return b.asm._free.apply(null, arguments)
    };
    b._malloc = function() {
        return b.asm._malloc.apply(null, arguments)
    };
    b.dynCall_v = function() {
        return b.asm.dynCall_v.apply(null, arguments)
    };
    b.dynCall_vi = function() {
        return b.asm.dynCall_vi.apply(null, arguments)
    };
    b.asm = ab;
    b.then = function(a) {
        if (b.calledRun) a(b);
        else {
            var c = b.onRuntimeInitialized;
            b.onRuntimeInitialized = function() {
                c && c();
                a(b)
            }
        }
        return b
    };

    function ja(a) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + a + ")";
        this.status = a
    }
    ja.prototype = Error();
    ja.prototype.constructor = ja;
    var Tw = null;
    Oa = function Uw() {
        b.calledRun || Vw();
        b.calledRun || (Oa = Uw)
    };

    function Vw() {
        function a() {
            if (!b.calledRun && (b.calledRun = !0, !la)) {
                Ka || (Ka = !0, Ea(Ga));
                Ea(Ha);
                if (b.onRuntimeInitialized) b.onRuntimeInitialized();
                if (b.postRun)
                    for ("function" == typeof b.postRun && (b.postRun = [b.postRun]); b.postRun.length;) {
                        var a = b.postRun.shift();
                        Ja.unshift(a)
                    }
                Ea(Ja)
            }
        }
        null === Tw && (Tw = Date.now());
        if (!(0 < Ma)) {
            if (b.preRun)
                for ("function" == typeof b.preRun && (b.preRun = [b.preRun]); b.preRun.length;) La();
            Ea(Fa);
            0 < Ma || b.calledRun || (b.setStatus ? (b.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                        b.setStatus("")
                    },
                    1);
                a()
            }, 1)) : a())
        }
    }
    b.run = Vw;
    b.exit = function(a, c) {
        if (!c || !b.noExitRuntime || 0 !== a) {
            if (!b.noExitRuntime && (la = !0, xa = void 0, Ea(Ia), b.onExit)) b.onExit(a);
            ea && process.exit(a);
            b.quit(a, new ja(a))
        }
    };

    function ma(a) {
        if (b.onAbort) b.onAbort(a);
        void 0 !== a ? (b.print(a), b.printErr(a), a = JSON.stringify(a)) : a = "";
        la = !0;
        throw "abort(" + a + "). Build with -s ASSERTIONS=1 for more info.";
    }
    b.abort = ma;
    if (b.preInit)
        for ("function" == typeof b.preInit && (b.preInit = [b.preInit]); 0 < b.preInit.length;) b.preInit.pop()();
    b.noExitRuntime = !0;
    Vw();

    function WrapperObject() {}
    WrapperObject.prototype = Object.create(WrapperObject.prototype);
    WrapperObject.prototype.constructor = WrapperObject;
    WrapperObject.prototype.b = WrapperObject;
    WrapperObject.c = {};
    b.WrapperObject = WrapperObject;

    function getCache(a) {
        return (a || WrapperObject).c
    }
    b.getCache = getCache;

    function wrapPointer(a, c) {
        var d = getCache(c),
            e = d[a];
        if (e) return e;
        e = Object.create((c || WrapperObject).prototype);
        e.a = a;
        return d[a] = e
    }
    b.wrapPointer = wrapPointer;

    function castObject(a, c) {
        return wrapPointer(a.a, c)
    }
    b.castObject = castObject;
    b.NULL = wrapPointer(0);

    function destroy(a) {
        if (!a.__destroy__) throw "Error: Cannot destroy object. (Did you create it yourself?)";
        a.__destroy__();
        delete getCache(a.b)[a.a]
    }
    b.destroy = destroy;

    function compare(a, c) {
        return a.a === c.a
    }
    b.compare = compare;

    function getPointer(a) {
        return a.a
    }
    b.getPointer = getPointer;

    function getClass(a) {
        return a.b
    }
    b.getClass = getClass;
    var Ww = 0,
        Xw = 0,
        Yw = 0,
        Zw = [],
        $w = 0;

    function ax() {
        if ($w) {
            for (var a = 0; a < Zw.length; a++) b._free(Zw[a]);
            Zw.length = 0;
            b._free(Ww);
            Ww = 0;
            Xw += $w;
            $w = 0
        }
        Ww || (Xw += 128, Ww = b._malloc(Xw), assert(Ww));
        Yw = 0
    }

    function bx(a, c) {
        assert(Ww);
        a = a.length * c.BYTES_PER_ELEMENT;
        a = a + 7 & -8;
        Yw + a >= Xw ? (assert(0 < a), $w += a, c = b._malloc(a), Zw.push(c)) : (c = Ww + Yw, Yw += a);
        return c
    }

    function cx(a, c, d) {
        switch (c.BYTES_PER_ELEMENT) {
            case 2:
                d >>= 1;
                break;
            case 4:
                d >>= 2;
                break;
            case 8:
                d >>= 3
        }
        for (var e = 0; e < a.length; e++) c[d + e] = a[e]
    }

    function ensureFloat32(a) {
        if ("object" === typeof a) {
            var c = bx(a, ra);
            cx(a, ra, c);
            return c
        }
        return a
    }

    function g() {
        throw "cannot construct a btCollisionWorld, no constructor in IDL";
    }
    g.prototype = Object.create(WrapperObject.prototype);
    g.prototype.constructor = g;
    g.prototype.b = g;
    g.c = {};
    b.btCollisionWorld = g;
    g.prototype.getDispatcher = function() {
        return wrapPointer(lg(this.a), dx)
    };
    g.prototype.rayTest = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        ng(e, a, c, d)
    };
    g.prototype.getPairCache = function() {
        return wrapPointer(mg(this.a), ex)
    };
    g.prototype.getDispatchInfo = function() {
        return wrapPointer(kg(this.a), k)
    };
    g.prototype.addCollisionObject = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        void 0 === c ? dg(e, a) : void 0 === d ? eg(e, a, c) : fg(e, a, c, d)
    };
    g.prototype.removeCollisionObject = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        og(c, a)
    };
    g.prototype.getBroadphase = function() {
        return wrapPointer(jg(this.a), fx)
    };
    g.prototype.convexSweepTest = function(a, c, d, e, f) {
        var h = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        ig(h, a, c, d, e, f)
    };
    g.prototype.contactPairTest = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        gg(e, a, c, d)
    };
    g.prototype.contactTest = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        hg(d, a, c)
    };
    g.prototype.updateSingleAabb = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        pg(c, a)
    };
    g.prototype.__destroy__ = function() {
        cg(this.a)
    };

    function m() {
        throw "cannot construct a btCollisionShape, no constructor in IDL";
    }
    m.prototype = Object.create(WrapperObject.prototype);
    m.prototype.constructor = m;
    m.prototype.b = m;
    m.c = {};
    b.btCollisionShape = m;
    m.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ag(c, a)
    };
    m.prototype.getLocalScaling = function() {
        return wrapPointer(Zf(this.a), n)
    };
    m.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Yf(d, a, c)
    };
    m.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        bg(c, a)
    };
    m.prototype.getMargin = function() {
        return $f(this.a)
    };
    m.prototype.__destroy__ = function() {
        Xf(this.a)
    };

    function p() {
        throw "cannot construct a btCollisionObject, no constructor in IDL";
    }
    p.prototype = Object.create(WrapperObject.prototype);
    p.prototype.constructor = p;
    p.prototype.b = p;
    p.c = {};
    b.btCollisionObject = p;
    p.prototype.setAnisotropicFriction = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Lf(d, a, c)
    };
    p.prototype.getCollisionShape = function() {
        return wrapPointer(Cf(this.a), m)
    };
    p.prototype.setContactProcessingThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Qf(c, a)
    };
    p.prototype.setActivationState = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Kf(c, a)
    };
    p.prototype.forceActivationState = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Af(c, a)
    };
    p.prototype.activate = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        void 0 === a ? yf(c) : zf(c, a)
    };
    p.prototype.isActive = function() {
        return !!Gf(this.a)
    };
    p.prototype.isKinematicObject = function() {
        return !!Hf(this.a)
    };
    p.prototype.isStaticObject = function() {
        return !!If(this.a)
    };
    p.prototype.isStaticOrKinematicObject = function() {
        return !!Jf(this.a)
    };
    p.prototype.setRestitution = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Sf(c, a)
    };
    p.prototype.setFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Rf(c, a)
    };
    p.prototype.setRollingFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Tf(c, a)
    };
    p.prototype.getWorldTransform = function() {
        return wrapPointer(Ff(this.a), q)
    };
    p.prototype.getCollisionFlags = function() {
        return Bf(this.a)
    };
    p.prototype.setCollisionFlags = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Of(c, a)
    };
    p.prototype.setWorldTransform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Wf(c, a)
    };
    p.prototype.setCollisionShape = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Pf(c, a)
    };
    p.prototype.setCcdMotionThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Mf(c, a)
    };
    p.prototype.setCcdSweptSphereRadius = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Nf(c, a)
    };
    p.prototype.getUserIndex = function() {
        return Df(this.a)
    };
    p.prototype.setUserIndex = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Uf(c, a)
    };
    p.prototype.getUserPointer = function() {
        return wrapPointer(Ef(this.a), VoidPtr)
    };
    p.prototype.setUserPointer = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Vf(c, a)
    };
    p.prototype.__destroy__ = function() {
        xf(this.a)
    };

    function r() {
        throw "cannot construct a btDynamicsWorld, no constructor in IDL";
    }
    r.prototype = Object.create(g.prototype);
    r.prototype.constructor = r;
    r.prototype.b = r;
    r.c = {};
    b.btDynamicsWorld = r;
    r.prototype.addAction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Oj(c, a)
    };
    r.prototype.removeAction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        bk(c, a)
    };
    r.prototype.getSolverInfo = function() {
        return wrapPointer(Zj(this.a), gx)
    };
    r.prototype.getDispatcher = function() {
        return wrapPointer(Xj(this.a), dx)
    };
    r.prototype.rayTest = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        ak(e, a, c, d)
    };
    r.prototype.getPairCache = function() {
        return wrapPointer(Yj(this.a), ex)
    };
    r.prototype.getDispatchInfo = function() {
        return wrapPointer(Wj(this.a), k)
    };
    r.prototype.addCollisionObject = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        void 0 === c ? Pj(e, a) : void 0 === d ? Qj(e, a, c) : Rj(e, a, c, d)
    };
    r.prototype.removeCollisionObject = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ck(c, a)
    };
    r.prototype.getBroadphase = function() {
        return wrapPointer(Vj(this.a), fx)
    };
    r.prototype.convexSweepTest = function(a, c, d, e, f) {
        var h = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        Uj(h, a, c, d, e, f)
    };
    r.prototype.contactPairTest = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Sj(e, a, c, d)
    };
    r.prototype.contactTest = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Tj(d, a, c)
    };
    r.prototype.updateSingleAabb = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        dk(c, a)
    };
    r.prototype.__destroy__ = function() {
        Nj(this.a)
    };

    function u() {
        throw "cannot construct a btTypedConstraint, no constructor in IDL";
    }
    u.prototype = Object.create(WrapperObject.prototype);
    u.prototype.constructor = u;
    u.prototype.b = u;
    u.c = {};
    b.btTypedConstraint = u;
    u.prototype.enableFeedback = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Rt(c, a)
    };
    u.prototype.getBreakingImpulseThreshold = function() {
        return St(this.a)
    };
    u.prototype.setBreakingImpulseThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ut(c, a)
    };
    u.prototype.getParam = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return Tt(d, a, c)
    };
    u.prototype.setParam = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Vt(e, a, c, d)
    };
    u.prototype.__destroy__ = function() {
        Qt(this.a)
    };

    function hx() {
        throw "cannot construct a btConcaveShape, no constructor in IDL";
    }
    hx.prototype = Object.create(m.prototype);
    hx.prototype.constructor = hx;
    hx.prototype.b = hx;
    hx.c = {};
    b.btConcaveShape = hx;
    hx.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Fg(c, a)
    };
    hx.prototype.getLocalScaling = function() {
        return wrapPointer(Eg(this.a), n)
    };
    hx.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Dg(d, a, c)
    };
    hx.prototype.__destroy__ = function() {
        Cg(this.a)
    };

    function v(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = jf(a, c);
        getCache(v)[this.a] = this
    }
    v.prototype = Object.create(m.prototype);
    v.prototype.constructor = v;
    v.prototype.b = v;
    v.c = {};
    b.btCapsuleShape = v;
    v.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        rf(c, a)
    };
    v.prototype.getMargin = function() {
        return nf(this.a)
    };
    v.prototype.getUpAxis = function() {
        return pf(this.a)
    };
    v.prototype.getRadius = function() {
        return of(this.a)
    };
    v.prototype.getHalfHeight = function() {
        return lf(this.a)
    };
    v.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        qf(c, a)
    };
    v.prototype.getLocalScaling = function() {
        return wrapPointer(mf(this.a), n)
    };
    v.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        kf(d, a, c)
    };
    v.prototype.__destroy__ = function() {
        hf(this.a)
    };

    function ix(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = void 0 === a ? ui() : vi(a);
        getCache(ix)[this.a] = this
    }
    ix.prototype = Object.create(WrapperObject.prototype);
    ix.prototype.constructor = ix;
    ix.prototype.b = ix;
    ix.c = {};
    b.btDefaultCollisionConfiguration = ix;
    ix.prototype.__destroy__ = function() {
        ti(this.a)
    };

    function jx() {
        throw "cannot construct a btTriangleMeshShape, no constructor in IDL";
    }
    jx.prototype = Object.create(hx.prototype);
    jx.prototype.constructor = jx;
    jx.prototype.b = jx;
    jx.c = {};
    b.btTriangleMeshShape = jx;
    jx.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Jt(c, a)
    };
    jx.prototype.getLocalScaling = function() {
        return wrapPointer(It(this.a), n)
    };
    jx.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Ht(d, a, c)
    };
    jx.prototype.__destroy__ = function() {
        Gt(this.a)
    };

    function kx() {
        throw "cannot construct a RayResultCallback, no constructor in IDL";
    }
    kx.prototype = Object.create(WrapperObject.prototype);
    kx.prototype.constructor = kx;
    kx.prototype.b = kx;
    kx.c = {};
    b.RayResultCallback = kx;
    kx.prototype.hasHit = function() {
        return !!Yd(this.a)
    };
    kx.prototype.get_m_collisionFilterGroup = function() {
        return Vd(this.a)
    };
    kx.prototype.set_m_collisionFilterGroup = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Zd(c, a)
    };
    kx.prototype.get_m_collisionFilterMask = function() {
        return Wd(this.a)
    };
    kx.prototype.set_m_collisionFilterMask = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        $d(c, a)
    };
    kx.prototype.get_m_collisionObject = function() {
        return wrapPointer(Xd(this.a), p)
    };
    kx.prototype.set_m_collisionObject = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ae(c, a)
    };
    kx.prototype.__destroy__ = function() {
        Ud(this.a)
    };

    function lx(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = Rg(a, c);
        getCache(lx)[this.a] = this
    }
    lx.prototype = Object.create(m.prototype);
    lx.prototype.constructor = lx;
    lx.prototype.b = lx;
    lx.c = {};
    b.btConeShape = lx;
    lx.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ug(c, a)
    };
    lx.prototype.getLocalScaling = function() {
        return wrapPointer(Tg(this.a), n)
    };
    lx.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Sg(d, a, c)
    };
    lx.prototype.__destroy__ = function() {
        Qg(this.a)
    };

    function mx() {
        throw "cannot construct a btActionInterface, no constructor in IDL";
    }
    mx.prototype = Object.create(WrapperObject.prototype);
    mx.prototype.constructor = mx;
    mx.prototype.b = mx;
    mx.c = {};
    b.btActionInterface = mx;
    mx.prototype.updateAction = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        ue(d, a, c)
    };
    mx.prototype.__destroy__ = function() {
        te(this.a)
    };

    function n(a, c, d) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        this.a = void 0 === a ? Xt() : void 0 === c ? _emscripten_bind_btVector3_btVector3_1(a) : void 0 === d ? _emscripten_bind_btVector3_btVector3_2(a, c) : Yt(a, c, d);
        getCache(n)[this.a] = this
    }
    n.prototype = Object.create(WrapperObject.prototype);
    n.prototype.constructor = n;
    n.prototype.b = n;
    n.c = {};
    b.btVector3 = n;
    n.prototype.length = n.prototype.length = function() {
        return $t(this.a)
    };
    n.prototype.x = n.prototype.x = function() {
        return ju(this.a)
    };
    n.prototype.y = n.prototype.y = function() {
        return ku(this.a)
    };
    n.prototype.z = n.prototype.z = function() {
        return lu(this.a)
    };
    n.prototype.setX = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        gu(c, a)
    };
    n.prototype.setY = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        hu(c, a)
    };
    n.prototype.setZ = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        iu(c, a)
    };
    n.prototype.setValue = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        fu(e, a, c, d)
    };
    n.prototype.normalize = n.prototype.normalize = function() {
        au(this.a)
    };
    n.prototype.rotate = n.prototype.rotate = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return wrapPointer(eu(d, a, c), n)
    };
    n.prototype.dot = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return Zt(c, a)
    };
    n.prototype.op_mul = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(cu(c, a), n)
    };
    n.prototype.op_add = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(bu(c, a), n)
    };
    n.prototype.op_sub = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(du(c, a), n)
    };
    n.prototype.__destroy__ = function() {
        Wt(this.a)
    };

    function nx() {
        throw "cannot construct a btVehicleRaycaster, no constructor in IDL";
    }
    nx.prototype = Object.create(WrapperObject.prototype);
    nx.prototype.constructor = nx;
    nx.prototype.b = nx;
    nx.c = {};
    b.btVehicleRaycaster = nx;
    nx.prototype.castRay = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Mu(e, a, c, d)
    };
    nx.prototype.__destroy__ = function() {
        Lu(this.a)
    };

    function w() {
        throw "cannot construct a btQuadWord, no constructor in IDL";
    }
    w.prototype = Object.create(WrapperObject.prototype);
    w.prototype.constructor = w;
    w.prototype.b = w;
    w.c = {};
    b.btQuadWord = w;
    w.prototype.x = w.prototype.x = function() {
        return Pn(this.a)
    };
    w.prototype.y = w.prototype.y = function() {
        return Qn(this.a)
    };
    w.prototype.z = w.prototype.z = function() {
        return Rn(this.a)
    };
    w.prototype.w = function() {
        return On(this.a)
    };
    w.prototype.setX = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ln(c, a)
    };
    w.prototype.setY = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Mn(c, a)
    };
    w.prototype.setZ = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Nn(c, a)
    };
    w.prototype.setW = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Kn(c, a)
    };
    w.prototype.__destroy__ = function() {
        Jn(this.a)
    };

    function ox(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = li(a);
        getCache(ox)[this.a] = this
    }
    ox.prototype = Object.create(m.prototype);
    ox.prototype.constructor = ox;
    ox.prototype.b = ox;
    ox.c = {};
    b.btCylinderShape = ox;
    ox.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        qi(c, a)
    };
    ox.prototype.getMargin = function() {
        return oi(this.a)
    };
    ox.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        pi(c, a)
    };
    ox.prototype.getLocalScaling = function() {
        return wrapPointer(ni(this.a), n)
    };
    ox.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        mi(d, a, c)
    };
    ox.prototype.__destroy__ = function() {
        ki(this.a)
    };

    function x(a, c, d, e) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        this.a = Ui(a, c, d, e);
        getCache(x)[this.a] = this
    }
    x.prototype = Object.create(r.prototype);
    x.prototype.constructor = x;
    x.prototype.b = x;
    x.c = {};
    b.btDiscreteDynamicsWorld = x;
    x.prototype.setGravity = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ij(c, a)
    };
    x.prototype.getGravity = function() {
        return wrapPointer(aj(this.a), n)
    };
    x.prototype.addRigidBody = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        void 0 === c ? Si(e, a) : void 0 === d ? _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_2(e, a, c) : Ti(e, a, c, d)
    };
    x.prototype.removeRigidBody = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        hj(c, a)
    };
    x.prototype.addConstraint = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        void 0 === c ? Qi(d, a) : Ri(d, a, c)
    };
    x.prototype.removeConstraint = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        gj(c, a)
    };
    x.prototype.stepSimulation = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        return void 0 === c ? jj(e, a) : void 0 === d ? kj(e, a, c) : lj(e, a, c, d)
    };
    x.prototype.getDispatcher = function() {
        return wrapPointer($i(this.a), dx)
    };
    x.prototype.rayTest = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        dj(e, a, c, d)
    };
    x.prototype.getPairCache = function() {
        return wrapPointer(bj(this.a), ex)
    };
    x.prototype.getDispatchInfo = function() {
        return wrapPointer(Zi(this.a), k)
    };
    x.prototype.addCollisionObject = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        void 0 === c ? Ni(e, a) : void 0 === d ? Oi(e, a, c) : Pi(e, a, c, d)
    };
    x.prototype.removeCollisionObject = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        fj(c, a)
    };
    x.prototype.getBroadphase = function() {
        return wrapPointer(Yi(this.a), fx)
    };
    x.prototype.convexSweepTest = function(a, c, d, e, f) {
        var h = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        Xi(h, a, c, d, e, f)
    };
    x.prototype.contactPairTest = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Vi(e, a, c, d)
    };
    x.prototype.contactTest = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Wi(d, a, c)
    };
    x.prototype.updateSingleAabb = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        mj(c, a)
    };
    x.prototype.addAction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Mi(c, a)
    };
    x.prototype.removeAction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ej(c, a)
    };
    x.prototype.getSolverInfo = function() {
        return wrapPointer(cj(this.a), gx)
    };
    x.prototype.__destroy__ = function() {
        Li(this.a)
    };

    function px() {
        throw "cannot construct a btConvexShape, no constructor in IDL";
    }
    px.prototype = Object.create(m.prototype);
    px.prototype.constructor = px;
    px.prototype.b = px;
    px.c = {};
    b.btConvexShape = px;
    px.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Nh(c, a)
    };
    px.prototype.getLocalScaling = function() {
        return wrapPointer(Lh(this.a), n)
    };
    px.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Kh(d, a, c)
    };
    px.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Oh(c, a)
    };
    px.prototype.getMargin = function() {
        return Mh(this.a)
    };
    px.prototype.__destroy__ = function() {
        Jh(this.a)
    };

    function dx() {
        throw "cannot construct a btDispatcher, no constructor in IDL";
    }
    dx.prototype = Object.create(WrapperObject.prototype);
    dx.prototype.constructor = dx;
    dx.prototype.b = dx;
    dx.c = {};
    b.btDispatcher = dx;
    dx.prototype.getNumManifolds = function() {
        return Mj(this.a)
    };
    dx.prototype.getManifoldByIndexInternal = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(Lj(c, a), qx)
    };
    dx.prototype.__destroy__ = function() {
        Kj(this.a)
    };

    function y(a, c, d, e, f) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        this.a = void 0 === e ? mk(a, c, d) : void 0 === f ? _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_4(a, c, d, e) : nk(a, c, d, e, f);
        getCache(y)[this.a] = this
    }
    y.prototype = Object.create(u.prototype);
    y.prototype.constructor = y;
    y.prototype.b = y;
    y.c = {};
    b.btGeneric6DofConstraint = y;
    y.prototype.setLinearLowerLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        uk(c, a)
    };
    y.prototype.setLinearUpperLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        vk(c, a)
    };
    y.prototype.setAngularLowerLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        rk(c, a)
    };
    y.prototype.setAngularUpperLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        sk(c, a)
    };
    y.prototype.enableFeedback = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ok(c, a)
    };
    y.prototype.getBreakingImpulseThreshold = function() {
        return pk(this.a)
    };
    y.prototype.setBreakingImpulseThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        tk(c, a)
    };
    y.prototype.getParam = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return qk(d, a, c)
    };
    y.prototype.setParam = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        wk(e, a, c, d)
    };
    y.prototype.__destroy__ = function() {
        lk(this.a)
    };

    function rx() {
        throw "cannot construct a btStridingMeshInterface, no constructor in IDL";
    }
    rx.prototype = Object.create(WrapperObject.prototype);
    rx.prototype.constructor = rx;
    rx.prototype.b = rx;
    rx.c = {};
    b.btStridingMeshInterface = rx;
    rx.prototype.__destroy__ = function() {
        vt(this.a)
    };

    function sx() {
        throw "cannot construct a btMotionState, no constructor in IDL";
    }
    sx.prototype = Object.create(WrapperObject.prototype);
    sx.prototype.constructor = sx;
    sx.prototype.b = sx;
    sx.c = {};
    b.btMotionState = sx;
    sx.prototype.getWorldTransform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Hm(c, a)
    };
    sx.prototype.setWorldTransform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Im(c, a)
    };
    sx.prototype.__destroy__ = function() {
        Gm(this.a)
    };

    function tx() {
        throw "cannot construct a ConvexResultCallback, no constructor in IDL";
    }
    tx.prototype = Object.create(WrapperObject.prototype);
    tx.prototype.constructor = tx;
    tx.prototype.b = tx;
    tx.c = {};
    b.ConvexResultCallback = tx;
    tx.prototype.hasHit = function() {
        return !!hd(this.a)
    };
    tx.prototype.get_m_collisionFilterGroup = function() {
        return fd(this.a)
    };
    tx.prototype.set_m_collisionFilterGroup = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        jd(c, a)
    };
    tx.prototype.get_m_collisionFilterMask = function() {
        return gd(this.a)
    };
    tx.prototype.set_m_collisionFilterMask = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        kd(c, a)
    };
    tx.prototype.get_m_closestHitFraction = function() {
        return ed(this.a)
    };
    tx.prototype.set_m_closestHitFraction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        id(c, a)
    };
    tx.prototype.__destroy__ = function() {
        dd(this.a)
    };

    function ux() {
        throw "cannot construct a ContactResultCallback, no constructor in IDL";
    }
    ux.prototype = Object.create(WrapperObject.prototype);
    ux.prototype.constructor = ux;
    ux.prototype.b = ux;
    ux.c = {};
    b.ContactResultCallback = ux;
    ux.prototype.addSingleResult = function(a, c, d, e, f, h, l) {
        var t = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        h && "object" === typeof h && (h = h.a);
        l && "object" === typeof l && (l = l.a);
        return cd(t, a, c, d, e, f, h, l)
    };
    ux.prototype.__destroy__ = function() {
        bd(this.a)
    };

    function vx() {
        throw "cannot construct a btSoftBodySolver, no constructor in IDL";
    }
    vx.prototype = Object.create(WrapperObject.prototype);
    vx.prototype.constructor = vx;
    vx.prototype.b = vx;
    vx.c = {};
    b.btSoftBodySolver = vx;
    vx.prototype.__destroy__ = function() {
        dr(this.a)
    };

    function z() {
        this.a = Pk();
        getCache(z)[this.a] = this
    }
    z.prototype = Object.create(p.prototype);
    z.prototype.constructor = z;
    z.prototype.b = z;
    z.c = {};
    b.btGhostObject = z;
    z.prototype.getNumOverlappingObjects = function() {
        return Tk(this.a)
    };
    z.prototype.getOverlappingObject = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(Uk(c, a), p)
    };
    z.prototype.setAnisotropicFriction = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        cl(d, a, c)
    };
    z.prototype.getCollisionShape = function() {
        return wrapPointer(Sk(this.a), m)
    };
    z.prototype.setContactProcessingThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        hl(c, a)
    };
    z.prototype.setActivationState = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        bl(c, a)
    };
    z.prototype.forceActivationState = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Qk(c, a)
    };
    z.prototype.activate = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        void 0 === a ? Nk(c) : Ok(c, a)
    };
    z.prototype.isActive = function() {
        return !!Yk(this.a)
    };
    z.prototype.isKinematicObject = function() {
        return !!Zk(this.a)
    };
    z.prototype.isStaticObject = function() {
        return !!$k(this.a)
    };
    z.prototype.isStaticOrKinematicObject = function() {
        return !!al(this.a)
    };
    z.prototype.setRestitution = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        jl(c, a)
    };
    z.prototype.setFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        il(c, a)
    };
    z.prototype.setRollingFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        kl(c, a)
    };
    z.prototype.getWorldTransform = function() {
        return wrapPointer(Xk(this.a), q)
    };
    z.prototype.getCollisionFlags = function() {
        return Rk(this.a)
    };
    z.prototype.setCollisionFlags = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        fl(c, a)
    };
    z.prototype.setWorldTransform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        nl(c, a)
    };
    z.prototype.setCollisionShape = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        gl(c, a)
    };
    z.prototype.setCcdMotionThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        dl(c, a)
    };
    z.prototype.setCcdSweptSphereRadius = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        el(c, a)
    };
    z.prototype.getUserIndex = function() {
        return Vk(this.a)
    };
    z.prototype.setUserIndex = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ll(c, a)
    };
    z.prototype.getUserPointer = function() {
        return wrapPointer(Wk(this.a), VoidPtr)
    };
    z.prototype.setUserPointer = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ml(c, a)
    };
    z.prototype.__destroy__ = function() {
        Mk(this.a)
    };

    function wx() {
        throw "cannot construct a btMatrix3x3, no constructor in IDL";
    }
    wx.prototype = Object.create(WrapperObject.prototype);
    wx.prototype.constructor = wx;
    wx.prototype.b = wx;
    wx.c = {};
    b.btMatrix3x3 = wx;
    wx.prototype.setEulerZYX = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Fm(e, a, c, d)
    };
    wx.prototype.getRotation = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Dm(c, a)
    };
    wx.prototype.getRow = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(Em(c, a), n)
    };
    wx.prototype.__destroy__ = function() {
        Cm(this.a)
    };

    function k() {
        throw "cannot construct a btDispatcherInfo, no constructor in IDL";
    }
    k.prototype = Object.create(WrapperObject.prototype);
    k.prototype.constructor = k;
    k.prototype.b = k;
    k.c = {};
    b.btDispatcherInfo = k;
    k.prototype.get_m_timeStep = function() {
        return vj(this.a)
    };
    k.prototype.set_m_timeStep = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Gj(c, a)
    };
    k.prototype.get_m_stepCount = function() {
        return tj(this.a)
    };
    k.prototype.set_m_stepCount = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ej(c, a)
    };
    k.prototype.get_m_dispatchFunc = function() {
        return qj(this.a)
    };
    k.prototype.set_m_dispatchFunc = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Bj(c, a)
    };
    k.prototype.get_m_timeOfImpact = function() {
        return uj(this.a)
    };
    k.prototype.set_m_timeOfImpact = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Fj(c, a)
    };
    k.prototype.get_m_useContinuous = function() {
        return !!wj(this.a)
    };
    k.prototype.set_m_useContinuous = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Hj(c, a)
    };
    k.prototype.get_m_enableSatConvex = function() {
        return !!sj(this.a)
    };
    k.prototype.set_m_enableSatConvex = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Dj(c, a)
    };
    k.prototype.get_m_enableSPU = function() {
        return !!rj(this.a)
    };
    k.prototype.set_m_enableSPU = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Cj(c, a)
    };
    k.prototype.get_m_useEpa = function() {
        return !!yj(this.a)
    };
    k.prototype.set_m_useEpa = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Jj(c, a)
    };
    k.prototype.get_m_allowedCcdPenetration = function() {
        return oj(this.a)
    };
    k.prototype.set_m_allowedCcdPenetration = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        zj(c, a)
    };
    k.prototype.get_m_useConvexConservativeDistanceUtil = function() {
        return !!xj(this.a)
    };
    k.prototype.set_m_useConvexConservativeDistanceUtil = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ij(c, a)
    };
    k.prototype.get_m_convexConservativeDistanceThreshold = function() {
        return pj(this.a)
    };
    k.prototype.set_m_convexConservativeDistanceThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Aj(c, a)
    };
    k.prototype.__destroy__ = function() {
        nj(this.a)
    };

    function A() {
        throw "cannot construct a Material, no constructor in IDL";
    }
    A.prototype = Object.create(WrapperObject.prototype);
    A.prototype.constructor = A;
    A.prototype.b = A;
    A.c = {};
    b.Material = A;
    A.prototype.get_m_kLST = function() {
        return Fd(this.a)
    };
    A.prototype.set_m_kLST = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Jd(c, a)
    };
    A.prototype.get_m_kAST = function() {
        return Ed(this.a)
    };
    A.prototype.set_m_kAST = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Id(c, a)
    };
    A.prototype.get_m_kVST = function() {
        return Gd(this.a)
    };
    A.prototype.set_m_kVST = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Kd(c, a)
    };
    A.prototype.get_m_flags = function() {
        return Dd(this.a)
    };
    A.prototype.set_m_flags = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Hd(c, a)
    };
    A.prototype.__destroy__ = function() {
        Cd(this.a)
    };

    function B() {
        throw "cannot construct a btWheelInfoConstructionInfo, no constructor in IDL";
    }
    B.prototype = Object.create(WrapperObject.prototype);
    B.prototype.constructor = B;
    B.prototype.b = B;
    B.c = {};
    b.btWheelInfoConstructionInfo = B;
    B.prototype.get_m_chassisConnectionCS = function() {
        return wrapPointer(bv(this.a), n)
    };
    B.prototype.set_m_chassisConnectionCS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        nv(c, a)
    };
    B.prototype.get_m_wheelDirectionCS = function() {
        return wrapPointer(iv(this.a), n)
    };
    B.prototype.set_m_wheelDirectionCS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        uv(c, a)
    };
    B.prototype.get_m_wheelAxleCS = function() {
        return wrapPointer(hv(this.a), n)
    };
    B.prototype.set_m_wheelAxleCS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        tv(c, a)
    };
    B.prototype.get_m_suspensionRestLength = function() {
        return fv(this.a)
    };
    B.prototype.set_m_suspensionRestLength = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        rv(c, a)
    };
    B.prototype.get_m_maxSuspensionTravelCm = function() {
        return ev(this.a)
    };
    B.prototype.set_m_maxSuspensionTravelCm = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        qv(c, a)
    };
    B.prototype.get_m_wheelRadius = function() {
        return jv(this.a)
    };
    B.prototype.set_m_wheelRadius = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        vv(c, a)
    };
    B.prototype.get_m_suspensionStiffness = function() {
        return gv(this.a)
    };
    B.prototype.set_m_suspensionStiffness = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        sv(c, a)
    };
    B.prototype.get_m_wheelsDampingCompression = function() {
        return kv(this.a)
    };
    B.prototype.set_m_wheelsDampingCompression = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        wv(c, a)
    };
    B.prototype.get_m_wheelsDampingRelaxation = function() {
        return lv(this.a)
    };
    B.prototype.set_m_wheelsDampingRelaxation = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        xv(c, a)
    };
    B.prototype.get_m_frictionSlip = function() {
        return cv(this.a)
    };
    B.prototype.set_m_frictionSlip = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ov(c, a)
    };
    B.prototype.get_m_maxSuspensionForce = function() {
        return dv(this.a)
    };
    B.prototype.set_m_maxSuspensionForce = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        pv(c, a)
    };
    B.prototype.get_m_bIsFrontWheel = function() {
        return !!av(this.a)
    };
    B.prototype.set_m_bIsFrontWheel = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        mv(c, a)
    };
    B.prototype.__destroy__ = function() {
        $u(this.a)
    };

    function xx(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = void 0 === c ? Qh(a) : Rh(a, c);
        getCache(xx)[this.a] = this
    }
    xx.prototype = Object.create(px.prototype);
    xx.prototype.constructor = xx;
    xx.prototype.b = xx;
    xx.c = {};
    b.btConvexTriangleMeshShape = xx;
    xx.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Vh(c, a)
    };
    xx.prototype.getLocalScaling = function() {
        return wrapPointer(Th(this.a), n)
    };
    xx.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Sh(d, a, c)
    };
    xx.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Wh(c, a)
    };
    xx.prototype.getMargin = function() {
        return Uh(this.a)
    };
    xx.prototype.__destroy__ = function() {
        Ph(this.a)
    };

    function fx() {
        throw "cannot construct a btBroadphaseInterface, no constructor in IDL";
    }
    fx.prototype = Object.create(WrapperObject.prototype);
    fx.prototype.constructor = fx;
    fx.prototype.b = fx;
    fx.c = {};
    b.btBroadphaseInterface = fx;
    fx.prototype.__destroy__ = function() {
        He(this.a)
    };

    function C(a, c, d, e) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        this.a = void 0 === e ? bp(a, c, d) : cp(a, c, d, e);
        getCache(C)[this.a] = this
    }
    C.prototype = Object.create(WrapperObject.prototype);
    C.prototype.constructor = C;
    C.prototype.b = C;
    C.c = {};
    b.btRigidBodyConstructionInfo = C;
    C.prototype.get_m_linearDamping = function() {
        return lp(this.a)
    };
    C.prototype.set_m_linearDamping = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        xp(c, a)
    };
    C.prototype.get_m_angularDamping = function() {
        return ip(this.a)
    };
    C.prototype.set_m_angularDamping = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        up(c, a)
    };
    C.prototype.get_m_friction = function() {
        return kp(this.a)
    };
    C.prototype.set_m_friction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        wp(c, a)
    };
    C.prototype.get_m_rollingFriction = function() {
        return op(this.a)
    };
    C.prototype.set_m_rollingFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ap(c, a)
    };
    C.prototype.get_m_restitution = function() {
        return np(this.a)
    };
    C.prototype.set_m_restitution = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        zp(c, a)
    };
    C.prototype.get_m_linearSleepingThreshold = function() {
        return mp(this.a)
    };
    C.prototype.set_m_linearSleepingThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        yp(c, a)
    };
    C.prototype.get_m_angularSleepingThreshold = function() {
        return jp(this.a)
    };
    C.prototype.set_m_angularSleepingThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        vp(c, a)
    };
    C.prototype.get_m_additionalDamping = function() {
        return !!gp(this.a)
    };
    C.prototype.set_m_additionalDamping = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        sp(c, a)
    };
    C.prototype.get_m_additionalDampingFactor = function() {
        return fp(this.a)
    };
    C.prototype.set_m_additionalDampingFactor = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        rp(c, a)
    };
    C.prototype.get_m_additionalLinearDampingThresholdSqr = function() {
        return hp(this.a)
    };
    C.prototype.set_m_additionalLinearDampingThresholdSqr = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        tp(c, a)
    };
    C.prototype.get_m_additionalAngularDampingThresholdSqr = function() {
        return ep(this.a)
    };
    C.prototype.set_m_additionalAngularDampingThresholdSqr = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        qp(c, a)
    };
    C.prototype.get_m_additionalAngularDampingFactor = function() {
        return dp(this.a)
    };
    C.prototype.set_m_additionalAngularDampingFactor = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        pp(c, a)
    };
    C.prototype.__destroy__ = function() {
        ap(this.a)
    };

    function yx() {
        throw "cannot construct a btCollisionConfiguration, no constructor in IDL";
    }
    yx.prototype = Object.create(WrapperObject.prototype);
    yx.prototype.constructor = yx;
    yx.prototype.b = yx;
    yx.c = {};
    b.btCollisionConfiguration = yx;
    yx.prototype.__destroy__ = function() {
        sf(this.a)
    };

    function qx() {
        this.a = qn();
        getCache(qx)[this.a] = this
    }
    qx.prototype = Object.create(WrapperObject.prototype);
    qx.prototype.constructor = qx;
    qx.prototype.b = qx;
    qx.c = {};
    b.btPersistentManifold = qx;
    qx.prototype.getBody0 = function() {
        return wrapPointer(rn(this.a), p)
    };
    qx.prototype.getBody1 = function() {
        return wrapPointer(sn(this.a), p)
    };
    qx.prototype.getNumContacts = function() {
        return un(this.a)
    };
    qx.prototype.getContactPoint = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(tn(c, a), D)
    };
    qx.prototype.__destroy__ = function() {
        pn(this.a)
    };

    function zx(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = void 0 === a ? sg() : tg(a);
        getCache(zx)[this.a] = this
    }
    zx.prototype = Object.create(m.prototype);
    zx.prototype.constructor = zx;
    zx.prototype.b = zx;
    zx.c = {};
    b.btCompoundShape = zx;
    zx.prototype.addChildShape = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        rg(d, a, c)
    };
    zx.prototype.removeChildShapeByIndex = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        zg(c, a)
    };
    zx.prototype.getNumChildShapes = function() {
        return yg(this.a)
    };
    zx.prototype.getChildShape = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(vg(c, a), m)
    };
    zx.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Bg(c, a)
    };
    zx.prototype.getMargin = function() {
        return xg(this.a)
    };
    zx.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ag(c, a)
    };
    zx.prototype.getLocalScaling = function() {
        return wrapPointer(wg(this.a), n)
    };
    zx.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        ug(d, a, c)
    };
    zx.prototype.__destroy__ = function() {
        qg(this.a)
    };

    function F(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = qb(a, c);
        getCache(F)[this.a] = this
    }
    F.prototype = Object.create(tx.prototype);
    F.prototype.constructor = F;
    F.prototype.b = F;
    F.c = {};
    b.ClosestConvexResultCallback = F;
    F.prototype.hasHit = function() {
        return !!zb(this.a)
    };
    F.prototype.get_m_convexFromWorld = function() {
        return wrapPointer(vb(this.a), n)
    };
    F.prototype.set_m_convexFromWorld = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Db(c, a)
    };
    F.prototype.get_m_convexToWorld = function() {
        return wrapPointer(wb(this.a), n)
    };
    F.prototype.set_m_convexToWorld = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Eb(c, a)
    };
    F.prototype.get_m_hitNormalWorld = function() {
        return wrapPointer(xb(this.a), n)
    };
    F.prototype.set_m_hitNormalWorld = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Fb(c, a)
    };
    F.prototype.get_m_hitPointWorld = function() {
        return wrapPointer(yb(this.a), n)
    };
    F.prototype.set_m_hitPointWorld = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Gb(c, a)
    };
    F.prototype.get_m_collisionFilterGroup = function() {
        return tb(this.a)
    };
    F.prototype.set_m_collisionFilterGroup = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Bb(c, a)
    };
    F.prototype.get_m_collisionFilterMask = function() {
        return ub(this.a)
    };
    F.prototype.set_m_collisionFilterMask = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Cb(c, a)
    };
    F.prototype.get_m_closestHitFraction = function() {
        return sb(this.a)
    };
    F.prototype.set_m_closestHitFraction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ab(c, a)
    };
    F.prototype.__destroy__ = function() {
        rb(this.a)
    };

    function Ax() {
        throw "cannot construct a tMaterialArray, no constructor in IDL";
    }
    Ax.prototype = Object.create(WrapperObject.prototype);
    Ax.prototype.constructor = Ax;
    Ax.prototype.b = Ax;
    Ax.c = {};
    b.tMaterialArray = Ax;
    Ax.prototype.size = Ax.prototype.size = function() {
        return Fw(this.a)
    };
    Ax.prototype.at = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(Ew(c, a), A)
    };
    Ax.prototype.__destroy__ = function() {
        Dw(this.a)
    };

    function Bx(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = Ji(a);
        getCache(Bx)[this.a] = this
    }
    Bx.prototype = Object.create(nx.prototype);
    Bx.prototype.constructor = Bx;
    Bx.prototype.b = Bx;
    Bx.c = {};
    b.btDefaultVehicleRaycaster = Bx;
    Bx.prototype.castRay = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Ki(e, a, c, d)
    };
    Bx.prototype.__destroy__ = function() {
        Ii(this.a)
    };

    function Cx() {
        this.a = lh();
        getCache(Cx)[this.a] = this
    }
    Cx.prototype = Object.create(WrapperObject.prototype);
    Cx.prototype.constructor = Cx;
    Cx.prototype.b = Cx;
    Cx.c = {};
    b.btConstraintSetting = Cx;
    Cx.prototype.get_m_tau = function() {
        return oh(this.a)
    };
    Cx.prototype.set_m_tau = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        rh(c, a)
    };
    Cx.prototype.get_m_damping = function() {
        return mh(this.a)
    };
    Cx.prototype.set_m_damping = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ph(c, a)
    };
    Cx.prototype.get_m_impulseClamp = function() {
        return nh(this.a)
    };
    Cx.prototype.set_m_impulseClamp = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        qh(c, a)
    };
    Cx.prototype.__destroy__ = function() {
        kh(this.a)
    };

    function Dx() {
        throw "cannot construct a LocalShapeInfo, no constructor in IDL";
    }
    Dx.prototype = Object.create(WrapperObject.prototype);
    Dx.prototype.constructor = Dx;
    Dx.prototype.b = Dx;
    Dx.c = {};
    b.LocalShapeInfo = Dx;
    Dx.prototype.get_m_shapePart = function() {
        return yd(this.a)
    };
    Dx.prototype.set_m_shapePart = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ad(c, a)
    };
    Dx.prototype.get_m_triangleIndex = function() {
        return zd(this.a)
    };
    Dx.prototype.set_m_triangleIndex = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Bd(c, a)
    };
    Dx.prototype.__destroy__ = function() {
        xd(this.a)
    };

    function G(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = Np(a);
        getCache(G)[this.a] = this
    }
    G.prototype = Object.create(p.prototype);
    G.prototype.constructor = G;
    G.prototype.b = G;
    G.c = {};
    b.btRigidBody = G;
    G.prototype.getCenterOfMassTransform = function() {
        return wrapPointer(Rp(this.a), q)
    };
    G.prototype.setCenterOfMassTransform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        jq(c, a)
    };
    G.prototype.setSleepingThresholds = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        wq(d, a, c)
    };
    G.prototype.setDamping = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        nq(d, a, c)
    };
    G.prototype.setMassProps = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        sq(d, a, c)
    };
    G.prototype.setLinearFactor = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        qq(c, a)
    };
    G.prototype.applyTorque = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Mp(c, a)
    };
    G.prototype.applyLocalTorque = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Kp(c, a)
    };
    G.prototype.applyForce = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Hp(d, a, c)
    };
    G.prototype.applyCentralForce = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ep(c, a)
    };
    G.prototype.applyCentralLocalForce = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Gp(c, a)
    };
    G.prototype.applyTorqueImpulse = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Lp(c, a)
    };
    G.prototype.applyImpulse = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Jp(d, a, c)
    };
    G.prototype.applyCentralImpulse = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Fp(c, a)
    };
    G.prototype.updateInertiaTensor = function() {
        Bq(this.a)
    };
    G.prototype.getLinearVelocity = function() {
        return wrapPointer(Vp(this.a), n)
    };
    G.prototype.getAngularVelocity = function() {
        return wrapPointer(Qp(this.a), n)
    };
    G.prototype.setLinearVelocity = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        rq(c, a)
    };
    G.prototype.setAngularVelocity = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        fq(c, a)
    };
    G.prototype.getMotionState = function() {
        return wrapPointer(Wp(this.a), sx)
    };
    G.prototype.setMotionState = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        tq(c, a)
    };
    G.prototype.setAngularFactor = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        eq(c, a)
    };
    G.prototype.upcast = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(Aq(c, a), G)
    };
    G.prototype.getAabb = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Pp(d, a, c)
    };
    G.prototype.applyGravity = function() {
        Ip(this.a)
    };
    G.prototype.getGravity = function() {
        return wrapPointer(Up(this.a), n)
    };
    G.prototype.setGravity = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        pq(c, a)
    };
    G.prototype.setAnisotropicFriction = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        gq(d, a, c)
    };
    G.prototype.getCollisionShape = function() {
        return wrapPointer(Tp(this.a), m)
    };
    G.prototype.setContactProcessingThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        mq(c, a)
    };
    G.prototype.setActivationState = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        dq(c, a)
    };
    G.prototype.forceActivationState = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Op(c, a)
    };
    G.prototype.activate = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        void 0 === a ? Cp(c) : Dp(c, a)
    };
    G.prototype.isActive = function() {
        return !!$p(this.a)
    };
    G.prototype.isKinematicObject = function() {
        return !!aq(this.a)
    };
    G.prototype.isStaticObject = function() {
        return !!bq(this.a)
    };
    G.prototype.isStaticOrKinematicObject = function() {
        return !!cq(this.a)
    };
    G.prototype.setRestitution = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        uq(c, a)
    };
    G.prototype.setFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        oq(c, a)
    };
    G.prototype.setRollingFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        vq(c, a)
    };
    G.prototype.getWorldTransform = function() {
        return wrapPointer(Zp(this.a), q)
    };
    G.prototype.getCollisionFlags = function() {
        return Sp(this.a)
    };
    G.prototype.setCollisionFlags = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        kq(c, a)
    };
    G.prototype.setWorldTransform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        zq(c, a)
    };
    G.prototype.setCollisionShape = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        lq(c, a)
    };
    G.prototype.setCcdMotionThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        hq(c, a)
    };
    G.prototype.setCcdSweptSphereRadius = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        iq(c, a)
    };
    G.prototype.getUserIndex = function() {
        return Xp(this.a)
    };
    G.prototype.setUserIndex = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        xq(c, a)
    };
    G.prototype.getUserPointer = function() {
        return wrapPointer(Yp(this.a), VoidPtr)
    };
    G.prototype.setUserPointer = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        yq(c, a)
    };
    G.prototype.__destroy__ = function() {
        Bp(this.a)
    };

    function Ex() {
        this.a = si();
        getCache(Ex)[this.a] = this
    }
    Ex.prototype = Object.create(WrapperObject.prototype);
    Ex.prototype.constructor = Ex;
    Ex.prototype.b = Ex;
    Ex.c = {};
    b.btDbvtBroadphase = Ex;
    Ex.prototype.__destroy__ = function() {
        ri(this.a)
    };

    function Fx() {
        this.a = Hi();
        getCache(Fx)[this.a] = this
    }
    Fx.prototype = Object.create(vx.prototype);
    Fx.prototype.constructor = Fx;
    Fx.prototype.b = Fx;
    Fx.c = {};
    b.btDefaultSoftBodySolver = Fx;
    Fx.prototype.__destroy__ = function() {
        Gi(this.a)
    };

    function Gx(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = uf(a);
        getCache(Gx)[this.a] = this
    }
    Gx.prototype = Object.create(dx.prototype);
    Gx.prototype.constructor = Gx;
    Gx.prototype.b = Gx;
    Gx.c = {};
    b.btCollisionDispatcher = Gx;
    Gx.prototype.getNumManifolds = function() {
        return wf(this.a)
    };
    Gx.prototype.getManifoldByIndexInternal = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(vf(c, a), qx)
    };
    Gx.prototype.__destroy__ = function() {
        tf(this.a)
    };

    function Hx(a, c, d, e, f) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        this.a = void 0 === d ? we(a, c) : void 0 === e ? xe(a, c, d) : void 0 === f ? ye(a, c, d, e) : ze(a, c, d, e, f);
        getCache(Hx)[this.a] = this
    }
    Hx.prototype = Object.create(WrapperObject.prototype);
    Hx.prototype.constructor = Hx;
    Hx.prototype.b = Hx;
    Hx.c = {};
    b.btAxisSweep3 = Hx;
    Hx.prototype.__destroy__ = function() {
        ve(this.a)
    };

    function VoidPtr() {
        throw "cannot construct a VoidPtr, no constructor in IDL";
    }
    VoidPtr.prototype = Object.create(WrapperObject.prototype);
    VoidPtr.prototype.constructor = VoidPtr;
    VoidPtr.prototype.b = VoidPtr;
    VoidPtr.c = {};
    b.VoidPtr = VoidPtr;
    VoidPtr.prototype.__destroy__ = function() {
        se(this.a)
    };

    function H() {
        this.a = fr();
        getCache(H)[this.a] = this
    }
    H.prototype = Object.create(WrapperObject.prototype);
    H.prototype.constructor = H;
    H.prototype.b = H;
    H.c = {};
    b.btSoftBodyWorldInfo = H;
    H.prototype.get_air_density = function() {
        return gr(this.a)
    };
    H.prototype.set_air_density = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        or(c, a)
    };
    H.prototype.get_water_density = function() {
        return lr(this.a)
    };
    H.prototype.set_water_density = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        tr(c, a)
    };
    H.prototype.get_water_offset = function() {
        return nr(this.a)
    };
    H.prototype.set_water_offset = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        vr(c, a)
    };
    H.prototype.get_m_maxDisplacement = function() {
        return kr(this.a)
    };
    H.prototype.set_m_maxDisplacement = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        sr(c, a)
    };
    H.prototype.get_water_normal = function() {
        return wrapPointer(mr(this.a), n)
    };
    H.prototype.set_water_normal = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ur(c, a)
    };
    H.prototype.get_m_broadphase = function() {
        return wrapPointer(hr(this.a), fx)
    };
    H.prototype.set_m_broadphase = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        pr(c, a)
    };
    H.prototype.get_m_dispatcher = function() {
        return wrapPointer(ir(this.a), dx)
    };
    H.prototype.set_m_dispatcher = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        qr(c, a)
    };
    H.prototype.get_m_gravity = function() {
        return wrapPointer(jr(this.a), n)
    };
    H.prototype.set_m_gravity = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        rr(c, a)
    };
    H.prototype.__destroy__ = function() {
        er(this.a)
    };

    function I(a, c, d, e) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        this.a = void 0 === d ? Wg(a, c) : void 0 === e ? _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_3(a, c, d) : Xg(a, c, d, e);
        getCache(I)[this.a] = this
    }
    I.prototype = Object.create(u.prototype);
    I.prototype.constructor = I;
    I.prototype.b = I;
    I.c = {};
    b.btConeTwistConstraint = I;
    I.prototype.setLimit = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        eh(d, a, c)
    };
    I.prototype.setAngularOnly = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        bh(c, a)
    };
    I.prototype.setDamping = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        dh(c, a)
    };
    I.prototype.enableMotor = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Zg(c, a)
    };
    I.prototype.setMaxMotorImpulse = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        gh(c, a)
    };
    I.prototype.setMaxMotorImpulseNormalized = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        fh(c, a)
    };
    I.prototype.setMotorTarget = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ih(c, a)
    };
    I.prototype.setMotorTargetInConstraintSpace = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        hh(c, a)
    };
    I.prototype.enableFeedback = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Yg(c, a)
    };
    I.prototype.getBreakingImpulseThreshold = function() {
        return $g(this.a)
    };
    I.prototype.setBreakingImpulseThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ch(c, a)
    };
    I.prototype.getParam = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return ah(d, a, c)
    };
    I.prototype.setParam = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        jh(e, a, c, d)
    };
    I.prototype.__destroy__ = function() {
        Vg(this.a)
    };

    function J(a, c, d, e, f, h, l) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        h && "object" === typeof h && (h = h.a);
        l && "object" === typeof l && (l = l.a);
        this.a = void 0 === d ? yl(a, c) : void 0 === e ? zl(a, c, d) : void 0 === f ? Al(a, c, d, e) : void 0 === h ? Bl(a, c, d, e, f) : void 0 === l ? Cl(a, c, d, e, f, h) : Dl(a, c, d, e, f, h, l);
        getCache(J)[this.a] = this
    }
    J.prototype = Object.create(u.prototype);
    J.prototype.constructor = J;
    J.prototype.b = J;
    J.c = {};
    b.btHingeConstraint = J;
    J.prototype.setLimit = function(a, c, d, e, f) {
        var h = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        void 0 === f ? Ll(h, a, c, d, e) : Ml(h, a, c, d, e, f)
    };
    J.prototype.enableAngularMotor = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        El(e, a, c, d)
    };
    J.prototype.setAngularOnly = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Jl(c, a)
    };
    J.prototype.enableMotor = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Gl(c, a)
    };
    J.prototype.setMaxMotorImpulse = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Nl(c, a)
    };
    J.prototype.setMotorTarget = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Ol(d, a, c)
    };
    J.prototype.enableFeedback = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Fl(c, a)
    };
    J.prototype.getBreakingImpulseThreshold = function() {
        return Hl(this.a)
    };
    J.prototype.setBreakingImpulseThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Kl(c, a)
    };
    J.prototype.getParam = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return Il(d, a, c)
    };
    J.prototype.setParam = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Pl(e, a, c, d)
    };
    J.prototype.__destroy__ = function() {
        xl(this.a)
    };

    function Ix(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = Mg(a, c);
        getCache(Ix)[this.a] = this
    }
    Ix.prototype = Object.create(lx.prototype);
    Ix.prototype.constructor = Ix;
    Ix.prototype.b = Ix;
    Ix.c = {};
    b.btConeShapeZ = Ix;
    Ix.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Pg(c, a)
    };
    Ix.prototype.getLocalScaling = function() {
        return wrapPointer(Og(this.a), n)
    };
    Ix.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Ng(d, a, c)
    };
    Ix.prototype.__destroy__ = function() {
        Lg(this.a)
    };

    function Jx(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = Hg(a, c);
        getCache(Jx)[this.a] = this
    }
    Jx.prototype = Object.create(lx.prototype);
    Jx.prototype.constructor = Jx;
    Jx.prototype.b = Jx;
    Jx.c = {};
    b.btConeShapeX = Jx;
    Jx.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Kg(c, a)
    };
    Jx.prototype.getLocalScaling = function() {
        return wrapPointer(Jg(this.a), n)
    };
    Jx.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Ig(d, a, c)
    };
    Jx.prototype.__destroy__ = function() {
        Gg(this.a)
    };

    function Kx(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = void 0 === a ? Nt() : void 0 === c ? Ot(a) : Pt(a, c);
        getCache(Kx)[this.a] = this
    }
    Kx.prototype = Object.create(rx.prototype);
    Kx.prototype.constructor = Kx;
    Kx.prototype.b = Kx;
    Kx.c = {};
    b.btTriangleMesh = Kx;
    Kx.prototype.addTriangle = function(a, c, d, e) {
        var f = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        void 0 === e ? Lt(f, a, c, d) : Mt(f, a, c, d, e)
    };
    Kx.prototype.__destroy__ = function() {
        Kt(this.a)
    };

    function Lx() {
        this.a = Dh();
        getCache(Lx)[this.a] = this
    }
    Lx.prototype = Object.create(m.prototype);
    Lx.prototype.constructor = Lx;
    Lx.prototype.b = Lx;
    Lx.c = {};
    b.btConvexHullShape = Lx;
    Lx.prototype.addPoint = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        void 0 === c ? Bh(d, a) : Ch(d, a, c)
    };
    Lx.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ih(c, a)
    };
    Lx.prototype.getMargin = function() {
        return Gh(this.a)
    };
    Lx.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Hh(c, a)
    };
    Lx.prototype.getLocalScaling = function() {
        return wrapPointer(Fh(this.a), n)
    };
    Lx.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Eh(d, a, c)
    };
    Lx.prototype.__destroy__ = function() {
        Ah(this.a)
    };

    function K() {
        this.a = Nu();
        getCache(K)[this.a] = this
    }
    K.prototype = Object.create(WrapperObject.prototype);
    K.prototype.constructor = K;
    K.prototype.b = K;
    K.c = {};
    b.btVehicleTuning = K;
    K.prototype.get_m_suspensionStiffness = function() {
        return Tu(this.a)
    };
    K.prototype.set_m_suspensionStiffness = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Zu(c, a)
    };
    K.prototype.get_m_suspensionCompression = function() {
        return Ru(this.a)
    };
    K.prototype.set_m_suspensionCompression = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Xu(c, a)
    };
    K.prototype.get_m_suspensionDamping = function() {
        return Su(this.a)
    };
    K.prototype.set_m_suspensionDamping = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Yu(c, a)
    };
    K.prototype.get_m_maxSuspensionTravelCm = function() {
        return Qu(this.a)
    };
    K.prototype.set_m_maxSuspensionTravelCm = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Wu(c, a)
    };
    K.prototype.get_m_frictionSlip = function() {
        return Ou(this.a)
    };
    K.prototype.set_m_frictionSlip = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Uu(c, a)
    };
    K.prototype.get_m_maxSuspensionForce = function() {
        return Pu(this.a)
    };
    K.prototype.set_m_maxSuspensionForce = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Vu(c, a)
    };

    function Mx() {
        throw "cannot construct a btCollisionObjectWrapper, no constructor in IDL";
    }
    Mx.prototype = Object.create(WrapperObject.prototype);
    Mx.prototype.constructor = Mx;
    Mx.prototype.b = Mx;
    Mx.c = {};
    b.btCollisionObjectWrapper = Mx;

    function Nx(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = void 0 === a ? zi() : void 0 === c ? Ai(a) : Bi(a, c);
        getCache(Nx)[this.a] = this
    }
    Nx.prototype = Object.create(sx.prototype);
    Nx.prototype.constructor = Nx;
    Nx.prototype.b = Nx;
    Nx.c = {};
    b.btDefaultMotionState = Nx;
    Nx.prototype.getWorldTransform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ci(c, a)
    };
    Nx.prototype.setWorldTransform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ei(c, a)
    };
    Nx.prototype.get_m_graphicsWorldTrans = function() {
        return wrapPointer(Di(this.a), q)
    };
    Nx.prototype.set_m_graphicsWorldTrans = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Fi(c, a)
    };
    Nx.prototype.__destroy__ = function() {
        yi(this.a)
    };

    function L(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = zv(a);
        getCache(L)[this.a] = this
    }
    L.prototype = Object.create(WrapperObject.prototype);
    L.prototype.constructor = L;
    L.prototype.b = L;
    L.c = {};
    b.btWheelInfo = L;
    L.prototype.getSuspensionRestLength = function() {
        return Av(this.a)
    };
    L.prototype.updateWheel = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        ww(d, a, c)
    };
    L.prototype.get_m_suspensionStiffness = function() {
        return Rv(this.a)
    };
    L.prototype.set_m_suspensionStiffness = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ow(c, a)
    };
    L.prototype.get_m_frictionSlip = function() {
        return Hv(this.a)
    };
    L.prototype.set_m_frictionSlip = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ew(c, a)
    };
    L.prototype.get_m_engineForce = function() {
        return Gv(this.a)
    };
    L.prototype.set_m_engineForce = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        dw(c, a)
    };
    L.prototype.get_m_rollInfluence = function() {
        return Lv(this.a)
    };
    L.prototype.set_m_rollInfluence = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        iw(c, a)
    };
    L.prototype.get_m_suspensionRestLength1 = function() {
        return Qv(this.a)
    };
    L.prototype.set_m_suspensionRestLength1 = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        nw(c, a)
    };
    L.prototype.get_m_wheelsRadius = function() {
        return Wv(this.a)
    };
    L.prototype.set_m_wheelsRadius = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        tw(c, a)
    };
    L.prototype.get_m_wheelsDampingCompression = function() {
        return Uv(this.a)
    };
    L.prototype.set_m_wheelsDampingCompression = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        rw(c, a)
    };
    L.prototype.get_m_wheelsDampingRelaxation = function() {
        return Vv(this.a)
    };
    L.prototype.set_m_wheelsDampingRelaxation = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        sw(c, a)
    };
    L.prototype.get_m_steering = function() {
        return Ov(this.a)
    };
    L.prototype.set_m_steering = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        lw(c, a)
    };
    L.prototype.get_m_maxSuspensionForce = function() {
        return Iv(this.a)
    };
    L.prototype.set_m_maxSuspensionForce = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        fw(c, a)
    };
    L.prototype.get_m_maxSuspensionTravelCm = function() {
        return Jv(this.a)
    };
    L.prototype.set_m_maxSuspensionTravelCm = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        gw(c, a)
    };
    L.prototype.get_m_wheelsSuspensionForce = function() {
        return Xv(this.a)
    };
    L.prototype.set_m_wheelsSuspensionForce = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        uw(c, a)
    };
    L.prototype.get_m_bIsFrontWheel = function() {
        return !!Bv(this.a)
    };
    L.prototype.set_m_bIsFrontWheel = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Zv(c, a)
    };
    L.prototype.get_m_raycastInfo = function() {
        return wrapPointer(Kv(this.a), M)
    };
    L.prototype.set_m_raycastInfo = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        hw(c, a)
    };
    L.prototype.get_m_chassisConnectionPointCS = function() {
        return wrapPointer(Dv(this.a), n)
    };
    L.prototype.set_m_chassisConnectionPointCS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        aw(c, a)
    };
    L.prototype.get_m_worldTransform = function() {
        return wrapPointer(Yv(this.a), q)
    };
    L.prototype.set_m_worldTransform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        vw(c, a)
    };
    L.prototype.get_m_wheelDirectionCS = function() {
        return wrapPointer(Tv(this.a), n)
    };
    L.prototype.set_m_wheelDirectionCS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        qw(c, a)
    };
    L.prototype.get_m_wheelAxleCS = function() {
        return wrapPointer(Sv(this.a), n)
    };
    L.prototype.set_m_wheelAxleCS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        pw(c, a)
    };
    L.prototype.get_m_rotation = function() {
        return Mv(this.a)
    };
    L.prototype.set_m_rotation = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        jw(c, a)
    };
    L.prototype.get_m_deltaRotation = function() {
        return Fv(this.a)
    };
    L.prototype.set_m_deltaRotation = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        cw(c, a)
    };
    L.prototype.get_m_brake = function() {
        return Cv(this.a)
    };
    L.prototype.set_m_brake = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        $v(c, a)
    };
    L.prototype.get_m_clippedInvContactDotSuspension = function() {
        return Ev(this.a)
    };
    L.prototype.set_m_clippedInvContactDotSuspension = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        bw(c, a)
    };
    L.prototype.get_m_suspensionRelativeVelocity = function() {
        return Pv(this.a)
    };
    L.prototype.set_m_suspensionRelativeVelocity = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        mw(c, a)
    };
    L.prototype.get_m_skidInfo = function() {
        return Nv(this.a)
    };
    L.prototype.set_m_skidInfo = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        kw(c, a)
    };
    L.prototype.__destroy__ = function() {
        yv(this.a)
    };

    function N(a, c, d, e) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        this.a = void 0 === a ? nu() : void 0 === c ? _emscripten_bind_btVector4_btVector4_1(a) : void 0 === d ? _emscripten_bind_btVector4_btVector4_2(a, c) : void 0 === e ? _emscripten_bind_btVector4_btVector4_3(a, c, d) : ou(a, c, d, e);
        getCache(N)[this.a] = this
    }
    N.prototype = Object.create(n.prototype);
    N.prototype.constructor = N;
    N.prototype.b = N;
    N.c = {};
    b.btVector4 = N;
    N.prototype.w = function() {
        return Au(this.a)
    };
    N.prototype.setValue = function(a, c, d, e) {
        var f = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        wu(f, a, c, d, e)
    };
    N.prototype.length = N.prototype.length = function() {
        return qu(this.a)
    };
    N.prototype.x = N.prototype.x = function() {
        return Bu(this.a)
    };
    N.prototype.y = N.prototype.y = function() {
        return Cu(this.a)
    };
    N.prototype.z = N.prototype.z = function() {
        return Du(this.a)
    };
    N.prototype.setX = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        xu(c, a)
    };
    N.prototype.setY = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        yu(c, a)
    };
    N.prototype.setZ = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        zu(c, a)
    };
    N.prototype.normalize = N.prototype.normalize = function() {
        ru(this.a)
    };
    N.prototype.rotate = N.prototype.rotate = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return wrapPointer(vu(d, a, c), n)
    };
    N.prototype.dot = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return pu(c, a)
    };
    N.prototype.op_mul = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(tu(c, a), n)
    };
    N.prototype.op_add = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(su(c, a), n)
    };
    N.prototype.op_sub = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(uu(c, a), n)
    };
    N.prototype.__destroy__ = function() {
        mu(this.a)
    };

    function Ox() {
        this.a = xi();
        getCache(Ox)[this.a] = this
    }
    Ox.prototype = Object.create(WrapperObject.prototype);
    Ox.prototype.constructor = Ox;
    Ox.prototype.b = Ox;
    Ox.c = {};
    b.btDefaultCollisionConstructionInfo = Ox;
    Ox.prototype.__destroy__ = function() {
        wi(this.a)
    };

    function O() {
        throw "cannot construct a Anchor, no constructor in IDL";
    }
    O.prototype = Object.create(WrapperObject.prototype);
    O.prototype.constructor = O;
    O.prototype.b = O;
    O.c = {};
    b.Anchor = O;
    O.prototype.get_m_node = function() {
        return wrapPointer(ib(this.a), Node)
    };
    O.prototype.set_m_node = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        pb(c, a)
    };
    O.prototype.get_m_local = function() {
        return wrapPointer(hb(this.a), n)
    };
    O.prototype.set_m_local = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ob(c, a)
    };
    O.prototype.get_m_body = function() {
        return wrapPointer(cb(this.a), G)
    };
    O.prototype.set_m_body = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        jb(c, a)
    };
    O.prototype.get_m_influence = function() {
        return gb(this.a)
    };
    O.prototype.set_m_influence = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        nb(c, a)
    };
    O.prototype.get_m_c0 = function() {
        return wrapPointer(db(this.a), wx)
    };
    O.prototype.set_m_c0 = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        kb(c, a)
    };
    O.prototype.get_m_c1 = function() {
        return wrapPointer(eb(this.a), n)
    };
    O.prototype.set_m_c1 = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        lb(c, a)
    };
    O.prototype.get_m_c2 = function() {
        return fb(this.a)
    };
    O.prototype.set_m_c2 = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        mb(c, a)
    };
    O.prototype.__destroy__ = function() {
        bb(this.a)
    };

    function Px() {
        throw "cannot construct a btVehicleRaycasterResult, no constructor in IDL";
    }
    Px.prototype = Object.create(WrapperObject.prototype);
    Px.prototype.constructor = Px;
    Px.prototype.b = Px;
    Px.c = {};
    b.btVehicleRaycasterResult = Px;
    Px.prototype.get_m_hitPointInWorld = function() {
        return wrapPointer(Hu(this.a), n)
    };
    Px.prototype.set_m_hitPointInWorld = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ku(c, a)
    };
    Px.prototype.get_m_hitNormalInWorld = function() {
        return wrapPointer(Gu(this.a), n)
    };
    Px.prototype.set_m_hitNormalInWorld = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ju(c, a)
    };
    Px.prototype.get_m_distFraction = function() {
        return Fu(this.a)
    };
    Px.prototype.set_m_distFraction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Iu(c, a)
    };
    Px.prototype.__destroy__ = function() {
        Eu(this.a)
    };

    function Qx() {
        throw "cannot construct a btConstraintSolver, no constructor in IDL";
    }
    Qx.prototype = Object.create(WrapperObject.prototype);
    Qx.prototype.constructor = Qx;
    Qx.prototype.b = Qx;
    Qx.c = {};
    b.btConstraintSolver = Qx;
    Qx.prototype.__destroy__ = function() {
        sh(this.a)
    };

    function P(a, c, d) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        this.a = yo(a, c, d);
        getCache(P)[this.a] = this
    }
    P.prototype = Object.create(mx.prototype);
    P.prototype.constructor = P;
    P.prototype.b = P;
    P.c = {};
    b.btRaycastVehicle = P;
    P.prototype.applyEngineForce = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        xo(d, a, c)
    };
    P.prototype.setSteeringValue = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Ro(d, a, c)
    };
    P.prototype.getWheelTransformWS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(Lo(c, a), q)
    };
    P.prototype.updateWheelTransform = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Yo(d, a, c)
    };
    P.prototype.addWheel = function(a, c, d, e, f, h, l) {
        var t = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        h && "object" === typeof h && (h = h.a);
        l && "object" === typeof l && (l = l.a);
        return wrapPointer(wo(t, a, c, d, e, f, h, l), L)
    };
    P.prototype.getNumWheels = function() {
        return Do(this.a)
    };
    P.prototype.getRigidBody = function() {
        return wrapPointer(Fo(this.a), G)
    };
    P.prototype.getWheelInfo = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(Ko(c, a), L)
    };
    P.prototype.setBrake = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Oo(d, a, c)
    };
    P.prototype.setCoordinateSystem = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Po(e, a, c, d)
    };
    P.prototype.getCurrentSpeedKmHour = function() {
        return Ao(this.a)
    };
    P.prototype.getChassisWorldTransform = function() {
        return wrapPointer(zo(this.a), q)
    };
    P.prototype.rayCast = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return Mo(c, a)
    };
    P.prototype.updateVehicle = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Xo(c, a)
    };
    P.prototype.resetSuspension = function() {
        No(this.a)
    };
    P.prototype.getSteeringValue = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return Go(c, a)
    };
    P.prototype.updateWheelTransformsWS = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        void 0 === c ? Zo(d, a) : $o(d, a, c)
    };
    P.prototype.setPitchControl = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Qo(c, a)
    };
    P.prototype.updateSuspension = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Wo(c, a)
    };
    P.prototype.updateFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Vo(c, a)
    };
    P.prototype.getRightAxis = function() {
        return Eo(this.a)
    };
    P.prototype.getUpAxis = function() {
        return Ho(this.a)
    };
    P.prototype.getForwardAxis = function() {
        return Bo(this.a)
    };
    P.prototype.getForwardVector = function() {
        return wrapPointer(Co(this.a), n)
    };
    P.prototype.getUserConstraintType = function() {
        return Jo(this.a)
    };
    P.prototype.setUserConstraintType = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        To(c, a)
    };
    P.prototype.setUserConstraintId = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        So(c, a)
    };
    P.prototype.getUserConstraintId = function() {
        return Io(this.a)
    };
    P.prototype.updateAction = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Uo(d, a, c)
    };
    P.prototype.__destroy__ = function() {
        vo(this.a)
    };

    function Rx(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = Yh(a);
        getCache(Rx)[this.a] = this
    }
    Rx.prototype = Object.create(ox.prototype);
    Rx.prototype.constructor = Rx;
    Rx.prototype.b = Rx;
    Rx.c = {};
    b.btCylinderShapeX = Rx;
    Rx.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ci(c, a)
    };
    Rx.prototype.getMargin = function() {
        return ai(this.a)
    };
    Rx.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        bi(c, a)
    };
    Rx.prototype.getLocalScaling = function() {
        return wrapPointer($h(this.a), n)
    };
    Rx.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Zh(d, a, c)
    };
    Rx.prototype.__destroy__ = function() {
        Xh(this.a)
    };

    function Sx(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = ei(a);
        getCache(Sx)[this.a] = this
    }
    Sx.prototype = Object.create(ox.prototype);
    Sx.prototype.constructor = Sx;
    Sx.prototype.b = Sx;
    Sx.c = {};
    b.btCylinderShapeZ = Sx;
    Sx.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ji(c, a)
    };
    Sx.prototype.getMargin = function() {
        return hi(this.a)
    };
    Sx.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ii(c, a)
    };
    Sx.prototype.getLocalScaling = function() {
        return wrapPointer(gi(this.a), n)
    };
    Sx.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        fi(d, a, c)
    };
    Sx.prototype.__destroy__ = function() {
        di(this.a)
    };

    function Tx() {
        this.a = Dq();
        getCache(Tx)[this.a] = this
    }
    Tx.prototype = Object.create(WrapperObject.prototype);
    Tx.prototype.constructor = Tx;
    Tx.prototype.b = Tx;
    Tx.c = {};
    b.btSequentialImpulseConstraintSolver = Tx;
    Tx.prototype.__destroy__ = function() {
        Cq(this.a)
    };

    function Ux() {
        throw "cannot construct a tAnchorArray, no constructor in IDL";
    }
    Ux.prototype = Object.create(WrapperObject.prototype);
    Ux.prototype.constructor = Ux;
    Ux.prototype.b = Ux;
    Ux.c = {};
    b.tAnchorArray = Ux;
    Ux.prototype.size = Ux.prototype.size = function() {
        return Cw(this.a)
    };
    Ux.prototype.at = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(yw(c, a), O)
    };
    Ux.prototype.clear = Ux.prototype.clear = function() {
        zw(this.a)
    };
    Ux.prototype.push_back = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Bw(c, a)
    };
    Ux.prototype.pop_back = function() {
        Aw(this.a)
    };
    Ux.prototype.__destroy__ = function() {
        xw(this.a)
    };

    function M() {
        throw "cannot construct a RaycastInfo, no constructor in IDL";
    }
    M.prototype = Object.create(WrapperObject.prototype);
    M.prototype.constructor = M;
    M.prototype.b = M;
    M.c = {};
    b.RaycastInfo = M;
    M.prototype.get_m_contactNormalWS = function() {
        return wrapPointer(ce(this.a), n)
    };
    M.prototype.set_m_contactNormalWS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ke(c, a)
    };
    M.prototype.get_m_contactPointWS = function() {
        return wrapPointer(de(this.a), n)
    };
    M.prototype.set_m_contactPointWS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        le(c, a)
    };
    M.prototype.get_m_suspensionLength = function() {
        return he(this.a)
    };
    M.prototype.set_m_suspensionLength = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        pe(c, a)
    };
    M.prototype.get_m_hardPointWS = function() {
        return wrapPointer(fe(this.a), n)
    };
    M.prototype.set_m_hardPointWS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ne(c, a)
    };
    M.prototype.get_m_wheelDirectionWS = function() {
        return wrapPointer(je(this.a), n)
    };
    M.prototype.set_m_wheelDirectionWS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        re(c, a)
    };
    M.prototype.get_m_wheelAxleWS = function() {
        return wrapPointer(ie(this.a), n)
    };
    M.prototype.set_m_wheelAxleWS = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        qe(c, a)
    };
    M.prototype.get_m_isInContact = function() {
        return !!ge(this.a)
    };
    M.prototype.set_m_isInContact = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        oe(c, a)
    };
    M.prototype.get_m_groundObject = function() {
        return ee(this.a)
    };
    M.prototype.set_m_groundObject = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        me(c, a)
    };
    M.prototype.__destroy__ = function() {
        be(this.a)
    };

    function Vx() {
        throw "cannot construct a tNodeArray, no constructor in IDL";
    }
    Vx.prototype = Object.create(WrapperObject.prototype);
    Vx.prototype.constructor = Vx;
    Vx.prototype.b = Vx;
    Vx.c = {};
    b.tNodeArray = Vx;
    Vx.prototype.size = Vx.prototype.size = function() {
        return Iw(this.a)
    };
    Vx.prototype.at = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(Hw(c, a), Node)
    };
    Vx.prototype.__destroy__ = function() {
        Gw(this.a)
    };

    function Q(a, c, d, e) {
        ax();
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        "object" == typeof e && (e = ensureFloat32(e));
        this.a = Ir(a, c, d, e);
        getCache(Q)[this.a] = this
    }
    Q.prototype = Object.create(p.prototype);
    Q.prototype.constructor = Q;
    Q.prototype.b = Q;
    Q.c = {};
    b.btSoftBody = Q;
    Q.prototype.checkLink = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return !!Kr(d, a, c)
    };
    Q.prototype.checkFace = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        return !!Jr(e, a, c, d)
    };
    Q.prototype.appendMaterial = function() {
        return wrapPointer(Fr(this.a), A)
    };
    Q.prototype.appendNode = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Gr(d, a, c)
    };
    Q.prototype.appendLink = function(a, c, d, e) {
        var f = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        Er(f, a, c, d, e)
    };
    Q.prototype.appendFace = function(a, c, d, e) {
        var f = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        Dr(f, a, c, d, e)
    };
    Q.prototype.appendTetra = function(a, c, d, e, f) {
        var h = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        Hr(h, a, c, d, e, f)
    };
    Q.prototype.appendAnchor = function(a, c, d, e) {
        var f = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        Cr(f, a, c, d, e)
    };
    Q.prototype.addForce = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        void 0 === c ? Ar(d, a) : Br(d, a, c)
    };
    Q.prototype.addAeroForceToNode = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        zr(d, a, c)
    };
    Q.prototype.getTotalMass = function() {
        return Rr(this.a)
    };
    Q.prototype.setTotalMass = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        rs(d, a, c)
    };
    Q.prototype.setMass = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        ns(d, a, c)
    };
    Q.prototype.transform = Q.prototype.transform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        As(c, a)
    };
    Q.prototype.translate = Q.prototype.translate = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Bs(c, a)
    };
    Q.prototype.rotate = Q.prototype.rotate = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        cs(c, a)
    };
    Q.prototype.scale = Q.prototype.scale = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ds(c, a)
    };
    Q.prototype.generateClusters = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return void 0 === c ? Nr(d, a) : Or(d, a, c)
    };
    Q.prototype.generateBendingConstraints = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return Mr(d, a, c)
    };
    Q.prototype.upcast = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(Cs(c, a), Q)
    };
    Q.prototype.setAnisotropicFriction = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        gs(d, a, c)
    };
    Q.prototype.getCollisionShape = function() {
        return wrapPointer(Qr(this.a), m)
    };
    Q.prototype.setContactProcessingThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ls(c, a)
    };
    Q.prototype.setActivationState = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        es(c, a)
    };
    Q.prototype.forceActivationState = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Lr(c, a)
    };
    Q.prototype.activate = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        void 0 === a ? xr(c) : yr(c, a)
    };
    Q.prototype.isActive = function() {
        return !!Zr(this.a)
    };
    Q.prototype.isKinematicObject = function() {
        return !!$r(this.a)
    };
    Q.prototype.isStaticObject = function() {
        return !!as(this.a)
    };
    Q.prototype.isStaticOrKinematicObject = function() {
        return !!bs(this.a)
    };
    Q.prototype.setRestitution = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ps(c, a)
    };
    Q.prototype.setFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ms(c, a)
    };
    Q.prototype.setRollingFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        qs(c, a)
    };
    Q.prototype.getWorldTransform = function() {
        return wrapPointer(Ur(this.a), q)
    };
    Q.prototype.getCollisionFlags = function() {
        return Pr(this.a)
    };
    Q.prototype.setCollisionFlags = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        js(c, a)
    };
    Q.prototype.setWorldTransform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        us(c, a)
    };
    Q.prototype.setCollisionShape = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ks(c, a)
    };
    Q.prototype.setCcdMotionThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        hs(c, a)
    };
    Q.prototype.setCcdSweptSphereRadius = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        is(c, a)
    };
    Q.prototype.getUserIndex = function() {
        return Sr(this.a)
    };
    Q.prototype.setUserIndex = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ss(c, a)
    };
    Q.prototype.getUserPointer = function() {
        return wrapPointer(Tr(this.a), VoidPtr)
    };
    Q.prototype.setUserPointer = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ts(c, a)
    };
    Q.prototype.get_m_cfg = function() {
        return wrapPointer(Wr(this.a), R)
    };
    Q.prototype.set_m_cfg = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        xs(c, a)
    };
    Q.prototype.get_m_nodes = function() {
        return wrapPointer(Yr(this.a), Vx)
    };
    Q.prototype.set_m_nodes = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        zs(c, a)
    };
    Q.prototype.get_m_materials = function() {
        return wrapPointer(Xr(this.a), Ax)
    };
    Q.prototype.set_m_materials = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ys(c, a)
    };
    Q.prototype.get_m_anchors = function() {
        return wrapPointer(Vr(this.a), Ux)
    };
    Q.prototype.set_m_anchors = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        vs(c, a)
    };
    Q.prototype.__destroy__ = function() {
        wr(this.a)
    };

    function Wx(a, c, d, e, f, h, l, t, E) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        h && "object" === typeof h && (h = h.a);
        l && "object" === typeof l && (l = l.a);
        t && "object" === typeof t && (t = t.a);
        E && "object" === typeof E && (E = E.a);
        this.a = rl(a, c, d, e, f, h, l, t, E);
        getCache(Wx)[this.a] = this
    }
    Wx.prototype = Object.create(hx.prototype);
    Wx.prototype.constructor = Wx;
    Wx.prototype.b = Wx;
    Wx.c = {};
    b.btHeightfieldTerrainShape = Wx;
    Wx.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        wl(c, a)
    };
    Wx.prototype.getMargin = function() {
        return ul(this.a)
    };
    Wx.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        vl(c, a)
    };
    Wx.prototype.getLocalScaling = function() {
        return wrapPointer(tl(this.a), n)
    };
    Wx.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        sl(d, a, c)
    };
    Wx.prototype.__destroy__ = function() {
        ql(this.a)
    };

    function R() {
        throw "cannot construct a Config, no constructor in IDL";
    }
    R.prototype = Object.create(WrapperObject.prototype);
    R.prototype.constructor = R;
    R.prototype.b = R;
    R.c = {};
    b.Config = R;
    R.prototype.get_kVCF = function() {
        return xc(this.a)
    };
    R.prototype.set_kVCF = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Wc(c, a)
    };
    R.prototype.get_kDP = function() {
        return kc(this.a)
    };
    R.prototype.set_kDP = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Kc(c, a)
    };
    R.prototype.get_kDG = function() {
        return jc(this.a)
    };
    R.prototype.set_kDG = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Jc(c, a)
    };
    R.prototype.get_kLF = function() {
        return mc(this.a)
    };
    R.prototype.set_kLF = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Mc(c, a)
    };
    R.prototype.get_kPR = function() {
        return oc(this.a)
    };
    R.prototype.set_kPR = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Oc(c, a)
    };
    R.prototype.get_kVC = function() {
        return yc(this.a)
    };
    R.prototype.set_kVC = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Xc(c, a)
    };
    R.prototype.get_kDF = function() {
        return ic(this.a)
    };
    R.prototype.set_kDF = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ic(c, a)
    };
    R.prototype.get_kMT = function() {
        return nc(this.a)
    };
    R.prototype.set_kMT = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Nc(c, a)
    };
    R.prototype.get_kCHR = function() {
        return hc(this.a)
    };
    R.prototype.set_kCHR = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Hc(c, a)
    };
    R.prototype.get_kKHR = function() {
        return lc(this.a)
    };
    R.prototype.set_kKHR = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Lc(c, a)
    };
    R.prototype.get_kSHR = function() {
        return pc(this.a)
    };
    R.prototype.set_kSHR = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Pc(c, a)
    };
    R.prototype.get_kAHR = function() {
        return fc(this.a)
    };
    R.prototype.set_kAHR = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Gc(c, a)
    };
    R.prototype.get_kSRHR_CL = function() {
        return tc(this.a)
    };
    R.prototype.set_kSRHR_CL = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Sc(c, a)
    };
    R.prototype.get_kSKHR_CL = function() {
        return qc(this.a)
    };
    R.prototype.set_kSKHR_CL = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Qc(c, a)
    };
    R.prototype.get_kSSHR_CL = function() {
        return vc(this.a)
    };
    R.prototype.set_kSSHR_CL = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Uc(c, a)
    };
    R.prototype.get_kSR_SPLT_CL = function() {
        return uc(this.a)
    };
    R.prototype.set_kSR_SPLT_CL = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Tc(c, a)
    };
    R.prototype.get_kSK_SPLT_CL = function() {
        return sc(this.a)
    };
    R.prototype.set_kSK_SPLT_CL = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Rc(c, a)
    };
    R.prototype.get_kSS_SPLT_CL = function() {
        return wc(this.a)
    };
    R.prototype.set_kSS_SPLT_CL = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Vc(c, a)
    };
    R.prototype.get_maxvolume = function() {
        return zc(this.a)
    };
    R.prototype.set_maxvolume = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Yc(c, a)
    };
    R.prototype.get_timescale = function() {
        return Bc(this.a)
    };
    R.prototype.set_timescale = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        $c(c, a)
    };
    R.prototype.get_viterations = function() {
        return Cc(this.a)
    };
    R.prototype.set_viterations = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ad(c, a)
    };
    R.prototype.get_piterations = function() {
        return Ac(this.a)
    };
    R.prototype.set_piterations = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Zc(c, a)
    };
    R.prototype.get_diterations = function() {
        return ec(this.a)
    };
    R.prototype.set_diterations = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Fc(c, a)
    };
    R.prototype.get_citerations = function() {
        return cc(this.a)
    };
    R.prototype.set_citerations = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Dc(c, a)
    };
    R.prototype.get_collisions = function() {
        return dc(this.a)
    };
    R.prototype.set_collisions = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ec(c, a)
    };
    R.prototype.__destroy__ = function() {
        bc(this.a)
    };

    function Node() {
        throw "cannot construct a Node, no constructor in IDL";
    }
    Node.prototype = Object.create(WrapperObject.prototype);
    Node.prototype.constructor = Node;
    Node.prototype.b = Node;
    Node.c = {};
    b.Node = Node;
    Node.prototype.get_m_x = function() {
        return wrapPointer(Pd(this.a), n)
    };
    Node.prototype.set_m_x = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Td(c, a)
    };
    Node.prototype.get_m_n = function() {
        return wrapPointer(Nd(this.a), n)
    };
    Node.prototype.set_m_n = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Rd(c, a)
    };
    Node.prototype.get_m_f = function() {
        return wrapPointer(Md(this.a), n)
    };
    Node.prototype.set_m_f = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Qd(c, a)
    };
    Node.prototype.get_m_v = function() {
        return wrapPointer(Od(this.a), n)
    };
    Node.prototype.set_m_v = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Sd(c, a)
    };
    Node.prototype.__destroy__ = function() {
        Ld(this.a)
    };

    function Xx() {
        this.a = pl();
        getCache(Xx)[this.a] = this
    }
    Xx.prototype = Object.create(WrapperObject.prototype);
    Xx.prototype.constructor = Xx;
    Xx.prototype.b = Xx;
    Xx.c = {};
    b.btGhostPairCallback = Xx;
    Xx.prototype.__destroy__ = function() {
        ol(this.a)
    };

    function Yx() {
        throw "cannot construct a btOverlappingPairCallback, no constructor in IDL";
    }
    Yx.prototype = Object.create(WrapperObject.prototype);
    Yx.prototype.constructor = Yx;
    Yx.prototype.b = Yx;
    Yx.c = {};
    b.btOverlappingPairCallback = Yx;
    Yx.prototype.__destroy__ = function() {
        Lm(this.a)
    };

    function S(a, c, d, e) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        this.a = void 0 === e ? Rl(a, c, d) : Sl(a, c, d, e);
        getCache(S)[this.a] = this
    }
    S.prototype = Object.create(mx.prototype);
    S.prototype.constructor = S;
    S.prototype.b = S;
    S.c = {};
    b.btKinematicCharacterController = S;
    S.prototype.setUpAxis = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        fm(c, a)
    };
    S.prototype.setWalkDirection = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        jm(c, a)
    };
    S.prototype.setVelocityForTimeInterval = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        im(d, a, c)
    };
    S.prototype.warp = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        lm(c, a)
    };
    S.prototype.preStep = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        $l(c, a)
    };
    S.prototype.playerStep = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Zl(d, a, c)
    };
    S.prototype.setFallSpeed = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        am(c, a)
    };
    S.prototype.setJumpSpeed = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        cm(c, a)
    };
    S.prototype.setMaxJumpHeight = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        dm(c, a)
    };
    S.prototype.canJump = function() {
        return !!Tl(this.a)
    };
    S.prototype.jump = function() {
        Xl(this.a)
    };
    S.prototype.setGravity = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        bm(c, a)
    };
    S.prototype.getGravity = function() {
        return Vl(this.a)
    };
    S.prototype.setMaxSlope = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        em(c, a)
    };
    S.prototype.getMaxSlope = function() {
        return Wl(this.a)
    };
    S.prototype.getGhostObject = function() {
        return wrapPointer(Ul(this.a), T)
    };
    S.prototype.setUseGhostSweepTest = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        hm(c, a)
    };
    S.prototype.onGround = function() {
        return !!Yl(this.a)
    };
    S.prototype.setUpInterpolate = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        gm(c, a)
    };
    S.prototype.updateAction = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        km(d, a, c)
    };
    S.prototype.__destroy__ = function() {
        Ql(this.a)
    };

    function Zx() {
        throw "cannot construct a btSoftBodyArray, no constructor in IDL";
    }
    Zx.prototype = Object.create(WrapperObject.prototype);
    Zx.prototype.constructor = Zx;
    Zx.prototype.b = Zx;
    Zx.c = {};
    b.btSoftBodyArray = Zx;
    Zx.prototype.size = Zx.prototype.size = function() {
        return Sq(this.a)
    };
    Zx.prototype.at = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(Rq(c, a), Q)
    };
    Zx.prototype.__destroy__ = function() {
        Qq(this.a)
    };

    function $x(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = rt(a, c);
        getCache($x)[this.a] = this
    }
    $x.prototype = Object.create(hx.prototype);
    $x.prototype.constructor = $x;
    $x.prototype.b = $x;
    $x.c = {};
    b.btStaticPlaneShape = $x;
    $x.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ut(c, a)
    };
    $x.prototype.getLocalScaling = function() {
        return wrapPointer(tt(this.a), n)
    };
    $x.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        st(d, a, c)
    };
    $x.prototype.__destroy__ = function() {
        qt(this.a)
    };

    function ex() {
        throw "cannot construct a btOverlappingPairCache, no constructor in IDL";
    }
    ex.prototype = Object.create(WrapperObject.prototype);
    ex.prototype.constructor = ex;
    ex.prototype.b = ex;
    ex.c = {};
    b.btOverlappingPairCache = ex;
    ex.prototype.setInternalGhostPairCallback = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Km(c, a)
    };
    ex.prototype.__destroy__ = function() {
        Jm(this.a)
    };

    function U(a, c, d, e, f) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        this.a = Ns(a, c, d, e, f);
        getCache(U)[this.a] = this
    }
    U.prototype = Object.create(x.prototype);
    U.prototype.constructor = U;
    U.prototype.b = U;
    U.c = {};
    b.btSoftRigidDynamicsWorld = U;
    U.prototype.addSoftBody = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Ms(e, a, c, d)
    };
    U.prototype.removeSoftBody = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        dt(c, a)
    };
    U.prototype.removeCollisionObject = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        at(c, a)
    };
    U.prototype.getWorldInfo = function() {
        return wrapPointer(Ys(this.a), H)
    };
    U.prototype.getSoftBodyArray = function() {
        return wrapPointer(Ws(this.a), Zx)
    };
    U.prototype.getDispatcher = function() {
        return wrapPointer(Ts(this.a), dx)
    };
    U.prototype.rayTest = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Zs(e, a, c, d)
    };
    U.prototype.getPairCache = function() {
        return wrapPointer(Vs(this.a), ex)
    };
    U.prototype.getDispatchInfo = function() {
        return wrapPointer(Ss(this.a), k)
    };
    U.prototype.addCollisionObject = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        void 0 === c ? Fs(e, a) : void 0 === d ? Gs(e, a, c) : Hs(e, a, c, d)
    };
    U.prototype.getBroadphase = function() {
        return wrapPointer(Rs(this.a), fx)
    };
    U.prototype.convexSweepTest = function(a, c, d, e, f) {
        var h = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        Qs(h, a, c, d, e, f)
    };
    U.prototype.contactPairTest = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Os(e, a, c, d)
    };
    U.prototype.contactTest = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Ps(d, a, c)
    };
    U.prototype.updateSingleAabb = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        it(c, a)
    };
    U.prototype.setGravity = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        et(c, a)
    };
    U.prototype.getGravity = function() {
        return wrapPointer(Us(this.a), n)
    };
    U.prototype.addRigidBody = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        void 0 === c ? Ks(e, a) : void 0 === d ? _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_2(e, a, c) : Ls(e, a, c, d)
    };
    U.prototype.removeRigidBody = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ct(c, a)
    };
    U.prototype.addConstraint = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        void 0 === c ? Is(d, a) : Js(d, a, c)
    };
    U.prototype.removeConstraint = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        bt(c, a)
    };
    U.prototype.stepSimulation = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        return void 0 === c ? ft(e, a) : void 0 === d ? gt(e, a, c) : ht(e, a, c, d)
    };
    U.prototype.addAction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Es(c, a)
    };
    U.prototype.removeAction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        $s(c, a)
    };
    U.prototype.getSolverInfo = function() {
        return wrapPointer(Xs(this.a), gx)
    };
    U.prototype.__destroy__ = function() {
        Ds(this.a)
    };

    function ay(a, c, d, e) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        this.a = fk(a, c, d, e);
        getCache(ay)[this.a] = this
    }
    ay.prototype = Object.create(u.prototype);
    ay.prototype.constructor = ay;
    ay.prototype.b = ay;
    ay.c = {};
    b.btFixedConstraint = ay;
    ay.prototype.enableFeedback = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        gk(c, a)
    };
    ay.prototype.getBreakingImpulseThreshold = function() {
        return hk(this.a)
    };
    ay.prototype.setBreakingImpulseThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        jk(c, a)
    };
    ay.prototype.getParam = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return ik(d, a, c)
    };
    ay.prototype.setParam = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        kk(e, a, c, d)
    };
    ay.prototype.__destroy__ = function() {
        ek(this.a)
    };

    function q(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = void 0 === a ? xt() : void 0 === c ? _emscripten_bind_btTransform_btTransform_1(a) : yt(a, c);
        getCache(q)[this.a] = this
    }
    q.prototype = Object.create(WrapperObject.prototype);
    q.prototype.constructor = q;
    q.prototype.b = q;
    q.c = {};
    b.btTransform = q;
    q.prototype.setIdentity = function() {
        Dt(this.a)
    };
    q.prototype.setOrigin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Et(c, a)
    };
    q.prototype.setRotation = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ft(c, a)
    };
    q.prototype.getOrigin = function() {
        return wrapPointer(At(this.a), n)
    };
    q.prototype.getRotation = function() {
        return wrapPointer(Bt(this.a), V)
    };
    q.prototype.getBasis = function() {
        return wrapPointer(zt(this.a), wx)
    };
    q.prototype.setFromOpenGLMatrix = function(a) {
        var c = this.a;
        ax();
        "object" == typeof a && (a = ensureFloat32(a));
        Ct(c, a)
    };
    q.prototype.__destroy__ = function() {
        wt(this.a)
    };

    function W(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = Hb(a, c);
        getCache(W)[this.a] = this
    }
    W.prototype = Object.create(kx.prototype);
    W.prototype.constructor = W;
    W.prototype.b = W;
    W.c = {};
    b.ClosestRayResultCallback = W;
    W.prototype.hasHit = function() {
        return !!Qb(this.a)
    };
    W.prototype.get_m_rayFromWorld = function() {
        return wrapPointer(Ob(this.a), n)
    };
    W.prototype.set_m_rayFromWorld = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Wb(c, a)
    };
    W.prototype.get_m_rayToWorld = function() {
        return wrapPointer(Pb(this.a), n)
    };
    W.prototype.set_m_rayToWorld = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Yb(c, a)
    };
    W.prototype.get_m_hitNormalWorld = function() {
        return wrapPointer(Mb(this.a), n)
    };
    W.prototype.set_m_hitNormalWorld = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ub(c, a)
    };
    W.prototype.get_m_hitPointWorld = function() {
        return wrapPointer(Nb(this.a), n)
    };
    W.prototype.set_m_hitPointWorld = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Vb(c, a)
    };
    W.prototype.get_m_collisionFilterGroup = function() {
        return Jb(this.a)
    };
    W.prototype.set_m_collisionFilterGroup = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Rb(c, a)
    };
    W.prototype.get_m_collisionFilterMask = function() {
        return Kb(this.a)
    };
    W.prototype.set_m_collisionFilterMask = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Sb(c, a)
    };
    W.prototype.get_m_collisionObject = function() {
        return wrapPointer(Lb(this.a), p)
    };
    W.prototype.set_m_collisionObject = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Tb(c, a)
    };
    W.prototype.__destroy__ = function() {
        Ib(this.a)
    };

    function by(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = void 0 === a ? br() : cr(a);
        getCache(by)[this.a] = this
    }
    by.prototype = Object.create(ix.prototype);
    by.prototype.constructor = by;
    by.prototype.b = by;
    by.c = {};
    b.btSoftBodyRigidBodyCollisionConfiguration = by;
    by.prototype.__destroy__ = function() {
        ar(this.a)
    };

    function cy() {
        this.a = Zb();
        getCache(cy)[this.a] = this
    }
    cy.prototype = Object.create(ux.prototype);
    cy.prototype.constructor = cy;
    cy.prototype.b = cy;
    cy.c = {};
    b.ConcreteContactResultCallback = cy;
    cy.prototype.addSingleResult = function(a, c, d, e, f, h, l) {
        var t = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        h && "object" === typeof h && (h = h.a);
        l && "object" === typeof l && (l = l.a);
        return ac(t, a, c, d, e, f, h, l)
    };
    cy.prototype.__destroy__ = function() {
        $b(this.a)
    };

    function dy(a, c, d) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        this.a = void 0 === d ? Je(a, c) : Ke(a, c, d);
        getCache(dy)[this.a] = this
    }
    dy.prototype = Object.create(jx.prototype);
    dy.prototype.constructor = dy;
    dy.prototype.b = dy;
    dy.c = {};
    b.btBvhTriangleMeshShape = dy;
    dy.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ne(c, a)
    };
    dy.prototype.getLocalScaling = function() {
        return wrapPointer(Me(this.a), n)
    };
    dy.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Le(d, a, c)
    };
    dy.prototype.__destroy__ = function() {
        Ie(this.a)
    };

    function ey(a, c, d, e, f) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        this.a = void 0 === e ? Fq(a, c, d) : void 0 === f ? _emscripten_bind_btSliderConstraint_btSliderConstraint_4(a, c, d, e) : Gq(a, c, d, e, f);
        getCache(ey)[this.a] = this
    }
    ey.prototype = Object.create(u.prototype);
    ey.prototype.constructor = ey;
    ey.prototype.b = ey;
    ey.c = {};
    b.btSliderConstraint = ey;
    ey.prototype.setLowerLinLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Mq(c, a)
    };
    ey.prototype.setUpperLinLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Pq(c, a)
    };
    ey.prototype.setLowerAngLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Lq(c, a)
    };
    ey.prototype.setUpperAngLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Oq(c, a)
    };
    ey.prototype.enableFeedback = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Hq(c, a)
    };
    ey.prototype.getBreakingImpulseThreshold = function() {
        return Iq(this.a)
    };
    ey.prototype.setBreakingImpulseThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Kq(c, a)
    };
    ey.prototype.getParam = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return Jq(d, a, c)
    };
    ey.prototype.setParam = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Nq(e, a, c, d)
    };
    ey.prototype.__destroy__ = function() {
        Eq(this.a)
    };

    function T() {
        this.a = Pm();
        getCache(T)[this.a] = this
    }
    T.prototype = Object.create(z.prototype);
    T.prototype.constructor = T;
    T.prototype.b = T;
    T.c = {};
    b.btPairCachingGhostObject = T;
    T.prototype.setAnisotropicFriction = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        cn(d, a, c)
    };
    T.prototype.getCollisionShape = function() {
        return wrapPointer(Sm(this.a), m)
    };
    T.prototype.setContactProcessingThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        hn(c, a)
    };
    T.prototype.setActivationState = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        bn(c, a)
    };
    T.prototype.forceActivationState = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Qm(c, a)
    };
    T.prototype.activate = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        void 0 === a ? Nm(c) : Om(c, a)
    };
    T.prototype.isActive = function() {
        return !!Ym(this.a)
    };
    T.prototype.isKinematicObject = function() {
        return !!Zm(this.a)
    };
    T.prototype.isStaticObject = function() {
        return !!$m(this.a)
    };
    T.prototype.isStaticOrKinematicObject = function() {
        return !!an(this.a)
    };
    T.prototype.setRestitution = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        kn(c, a)
    };
    T.prototype.setFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        jn(c, a)
    };
    T.prototype.setRollingFriction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ln(c, a)
    };
    T.prototype.getWorldTransform = function() {
        return wrapPointer(Xm(this.a), q)
    };
    T.prototype.getCollisionFlags = function() {
        return Rm(this.a)
    };
    T.prototype.setCollisionFlags = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        fn(c, a)
    };
    T.prototype.setWorldTransform = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        on(c, a)
    };
    T.prototype.setCollisionShape = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        gn(c, a)
    };
    T.prototype.setCcdMotionThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        dn(c, a)
    };
    T.prototype.setCcdSweptSphereRadius = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        en(c, a)
    };
    T.prototype.getUserIndex = function() {
        return Vm(this.a)
    };
    T.prototype.setUserIndex = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        mn(c, a)
    };
    T.prototype.getUserPointer = function() {
        return wrapPointer(Wm(this.a), VoidPtr)
    };
    T.prototype.setUserPointer = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        nn(c, a)
    };
    T.prototype.getNumOverlappingObjects = function() {
        return Tm(this.a)
    };
    T.prototype.getOverlappingObject = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(Um(c, a), p)
    };
    T.prototype.__destroy__ = function() {
        Mm(this.a)
    };

    function D() {
        throw "cannot construct a btManifoldPoint, no constructor in IDL";
    }
    D.prototype = Object.create(WrapperObject.prototype);
    D.prototype.constructor = D;
    D.prototype.b = D;
    D.c = {};
    b.btManifoldPoint = D;
    D.prototype.getPositionWorldOnA = function() {
        return wrapPointer(pm(this.a), n)
    };
    D.prototype.getPositionWorldOnB = function() {
        return wrapPointer(qm(this.a), n)
    };
    D.prototype.getAppliedImpulse = function() {
        return nm(this.a)
    };
    D.prototype.getDistance = function() {
        return om(this.a)
    };
    D.prototype.get_m_localPointA = function() {
        return wrapPointer(rm(this.a), n)
    };
    D.prototype.set_m_localPointA = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        xm(c, a)
    };
    D.prototype.get_m_localPointB = function() {
        return wrapPointer(sm(this.a), n)
    };
    D.prototype.set_m_localPointB = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ym(c, a)
    };
    D.prototype.get_m_positionWorldOnB = function() {
        return wrapPointer(wm(this.a), n)
    };
    D.prototype.set_m_positionWorldOnB = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Bm(c, a)
    };
    D.prototype.get_m_positionWorldOnA = function() {
        return wrapPointer(um(this.a), n)
    };
    D.prototype.set_m_positionWorldOnA = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Am(c, a)
    };
    D.prototype.get_m_normalWorldOnB = function() {
        return wrapPointer(tm(this.a), n)
    };
    D.prototype.set_m_normalWorldOnB = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        zm(c, a)
    };
    D.prototype.__destroy__ = function() {
        mm(this.a)
    };

    function X(a, c, d, e) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        this.a = void 0 === d ? wn(a, c) : void 0 === e ? _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_3(a, c, d) : xn(a, c, d, e);
        getCache(X)[this.a] = this
    }
    X.prototype = Object.create(u.prototype);
    X.prototype.constructor = X;
    X.prototype.b = X;
    X.c = {};
    b.btPoint2PointConstraint = X;
    X.prototype.setPivotA = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Gn(c, a)
    };
    X.prototype.setPivotB = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Hn(c, a)
    };
    X.prototype.getPivotInA = function() {
        return wrapPointer(Bn(this.a), n)
    };
    X.prototype.getPivotInB = function() {
        return wrapPointer(Cn(this.a), n)
    };
    X.prototype.enableFeedback = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        yn(c, a)
    };
    X.prototype.getBreakingImpulseThreshold = function() {
        return zn(this.a)
    };
    X.prototype.setBreakingImpulseThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        En(c, a)
    };
    X.prototype.getParam = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return An(d, a, c)
    };
    X.prototype.setParam = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Fn(e, a, c, d)
    };
    X.prototype.get_m_setting = function() {
        return wrapPointer(Dn(this.a), Cx)
    };
    X.prototype.set_m_setting = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        In(c, a)
    };
    X.prototype.__destroy__ = function() {
        vn(this.a)
    };

    function fy() {
        this.a = $q();
        getCache(fy)[this.a] = this
    }
    fy.prototype = Object.create(WrapperObject.prototype);
    fy.prototype.constructor = fy;
    fy.prototype.b = fy;
    fy.c = {};
    b.btSoftBodyHelpers = fy;
    fy.prototype.CreateRope = function(a, c, d, e, f) {
        var h = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        return wrapPointer(Yq(h, a, c, d, e, f), Q)
    };
    fy.prototype.CreatePatch = function(a, c, d, e, f, h, l, t, E) {
        var Sa = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        h && "object" === typeof h && (h = h.a);
        l && "object" === typeof l && (l = l.a);
        t && "object" === typeof t && (t = t.a);
        E && "object" === typeof E && (E = E.a);
        return wrapPointer(Xq(Sa, a, c, d, e, f, h, l, t, E), Q)
    };
    fy.prototype.CreatePatchUV = function(a, c, d, e, f, h, l, t, E, Sa) {
        var Xb = this.a;
        ax();
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        h && "object" === typeof h && (h = h.a);
        l && "object" === typeof l && (l = l.a);
        t && "object" === typeof t && (t = t.a);
        E && "object" === typeof E && (E = E.a);
        "object" == typeof Sa && (Sa = ensureFloat32(Sa));
        return wrapPointer(Wq(Xb, a, c, d, e, f, h, l, t, E, Sa), Q)
    };
    fy.prototype.CreateEllipsoid = function(a, c, d, e) {
        var f = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        return wrapPointer(Tq(f, a, c, d, e), Q)
    };
    fy.prototype.CreateFromTriMesh = function(a, c, d, e, f) {
        var h = this.a;
        ax();
        a && "object" === typeof a && (a = a.a);
        "object" == typeof c && (c = ensureFloat32(c));
        if ("object" == typeof d && "object" === typeof d) {
            var l = bx(d, qa);
            cx(d, qa, l);
            d = l
        }
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        return wrapPointer(Vq(h, a, c, d, e, f), Q)
    };
    fy.prototype.CreateFromConvexHull = function(a, c, d, e) {
        var f = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        return wrapPointer(Uq(f, a, c, d, e), Q)
    };
    fy.prototype.__destroy__ = function() {
        Zq(this.a)
    };

    function gy(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = Be(a);
        getCache(gy)[this.a] = this
    }
    gy.prototype = Object.create(m.prototype);
    gy.prototype.constructor = gy;
    gy.prototype.b = gy;
    gy.c = {};
    b.btBoxShape = gy;
    gy.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ge(c, a)
    };
    gy.prototype.getMargin = function() {
        return Ee(this.a)
    };
    gy.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Fe(c, a)
    };
    gy.prototype.getLocalScaling = function() {
        return wrapPointer(De(this.a), n)
    };
    gy.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Ce(d, a, c)
    };
    gy.prototype.__destroy__ = function() {
        Ae(this.a)
    };

    function hy(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = Pe(a, c);
        getCache(hy)[this.a] = this
    }
    hy.prototype = Object.create(v.prototype);
    hy.prototype.constructor = hy;
    hy.prototype.b = hy;
    hy.c = {};
    b.btCapsuleShapeX = hy;
    hy.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Xe(c, a)
    };
    hy.prototype.getMargin = function() {
        return Te(this.a)
    };
    hy.prototype.getUpAxis = function() {
        return Ve(this.a)
    };
    hy.prototype.getRadius = function() {
        return Ue(this.a)
    };
    hy.prototype.getHalfHeight = function() {
        return Re(this.a)
    };
    hy.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        We(c, a)
    };
    hy.prototype.getLocalScaling = function() {
        return wrapPointer(Se(this.a), n)
    };
    hy.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Qe(d, a, c)
    };
    hy.prototype.__destroy__ = function() {
        Oe(this.a)
    };

    function V(a, c, d, e) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        this.a = Vn(a, c, d, e);
        getCache(V)[this.a] = this
    }
    V.prototype = Object.create(w.prototype);
    V.prototype.constructor = V;
    V.prototype.b = V;
    V.c = {};
    b.btQuaternion = V;
    V.prototype.setValue = function(a, c, d, e) {
        var f = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        mo(f, a, c, d, e)
    };
    V.prototype.setEulerZYX = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        ko(e, a, c, d)
    };
    V.prototype.setRotation = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        lo(d, a, c)
    };
    V.prototype.normalize = V.prototype.normalize = function() {
        co(this.a)
    };
    V.prototype.length2 = function() {
        return ao(this.a)
    };
    V.prototype.length = V.prototype.length = function() {
        return bo(this.a)
    };
    V.prototype.dot = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return Wn(c, a)
    };
    V.prototype.normalized = function() {
        return wrapPointer(eo(this.a), V)
    };
    V.prototype.getAxis = function() {
        return wrapPointer(Zn(this.a), n)
    };
    V.prototype.inverse = V.prototype.inverse = function() {
        return wrapPointer($n(this.a), V)
    };
    V.prototype.getAngle = function() {
        return Yn(this.a)
    };
    V.prototype.getAngleShortestPath = function() {
        return Xn(this.a)
    };
    V.prototype.angle = V.prototype.angle = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return Un(c, a)
    };
    V.prototype.angleShortestPath = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return Tn(c, a)
    };
    V.prototype.op_add = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(fo(c, a), V)
    };
    V.prototype.op_sub = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(jo(c, a), V)
    };
    V.prototype.op_mul = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(ho(c, a), V)
    };
    V.prototype.op_mulq = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(io(c, a), V)
    };
    V.prototype.op_div = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        return wrapPointer(go(c, a), V)
    };
    V.prototype.x = V.prototype.x = function() {
        return so(this.a)
    };
    V.prototype.y = V.prototype.y = function() {
        return to(this.a)
    };
    V.prototype.z = V.prototype.z = function() {
        return uo(this.a)
    };
    V.prototype.w = function() {
        return ro(this.a)
    };
    V.prototype.setX = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        oo(c, a)
    };
    V.prototype.setY = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        po(c, a)
    };
    V.prototype.setZ = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        qo(c, a)
    };
    V.prototype.setW = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        no(c, a)
    };
    V.prototype.__destroy__ = function() {
        Sn(this.a)
    };

    function iy(a, c) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        this.a = Ze(a, c);
        getCache(iy)[this.a] = this
    }
    iy.prototype = Object.create(v.prototype);
    iy.prototype.constructor = iy;
    iy.prototype.b = iy;
    iy.c = {};
    b.btCapsuleShapeZ = iy;
    iy.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        gf(c, a)
    };
    iy.prototype.getMargin = function() {
        return cf(this.a)
    };
    iy.prototype.getUpAxis = function() {
        return ef(this.a)
    };
    iy.prototype.getRadius = function() {
        return df(this.a)
    };
    iy.prototype.getHalfHeight = function() {
        return af(this.a)
    };
    iy.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ff(c, a)
    };
    iy.prototype.getLocalScaling = function() {
        return wrapPointer(bf(this.a), n)
    };
    iy.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        $e(d, a, c)
    };
    iy.prototype.__destroy__ = function() {
        Ye(this.a)
    };

    function gx() {
        throw "cannot construct a btContactSolverInfo, no constructor in IDL";
    }
    gx.prototype = Object.create(WrapperObject.prototype);
    gx.prototype.constructor = gx;
    gx.prototype.b = gx;
    gx.c = {};
    b.btContactSolverInfo = gx;
    gx.prototype.get_m_splitImpulse = function() {
        return !!wh(this.a)
    };
    gx.prototype.set_m_splitImpulse = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        zh(c, a)
    };
    gx.prototype.get_m_splitImpulsePenetrationThreshold = function() {
        return vh(this.a)
    };
    gx.prototype.set_m_splitImpulsePenetrationThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        yh(c, a)
    };
    gx.prototype.get_m_numIterations = function() {
        return uh(this.a)
    };
    gx.prototype.set_m_numIterations = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        xh(c, a)
    };
    gx.prototype.__destroy__ = function() {
        th(this.a)
    };

    function Y(a, c, d, e, f) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        this.a = void 0 === e ? yk(a, c, d) : void 0 === f ? _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_4(a, c, d, e) : zk(a, c, d, e, f);
        getCache(Y)[this.a] = this
    }
    Y.prototype = Object.create(y.prototype);
    Y.prototype.constructor = Y;
    Y.prototype.b = Y;
    Y.c = {};
    b.btGeneric6DofSpringConstraint = Y;
    Y.prototype.enableSpring = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Bk(d, a, c)
    };
    Y.prototype.setStiffness = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Lk(d, a, c)
    };
    Y.prototype.setDamping = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        Hk(d, a, c)
    };
    Y.prototype.setLinearLowerLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ik(c, a)
    };
    Y.prototype.setLinearUpperLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Jk(c, a)
    };
    Y.prototype.setAngularLowerLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ek(c, a)
    };
    Y.prototype.setAngularUpperLimit = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Fk(c, a)
    };
    Y.prototype.enableFeedback = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Ak(c, a)
    };
    Y.prototype.getBreakingImpulseThreshold = function() {
        return Ck(this.a)
    };
    Y.prototype.setBreakingImpulseThreshold = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        Gk(c, a)
    };
    Y.prototype.getParam = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        return Dk(d, a, c)
    };
    Y.prototype.setParam = function(a, c, d) {
        var e = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        Kk(e, a, c, d)
    };
    Y.prototype.__destroy__ = function() {
        xk(this.a)
    };

    function jy(a) {
        a && "object" === typeof a && (a = a.a);
        this.a = kt(a);
        getCache(jy)[this.a] = this
    }
    jy.prototype = Object.create(m.prototype);
    jy.prototype.constructor = jy;
    jy.prototype.b = jy;
    jy.c = {};
    b.btSphereShape = jy;
    jy.prototype.setMargin = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        pt(c, a)
    };
    jy.prototype.getMargin = function() {
        return nt(this.a)
    };
    jy.prototype.setLocalScaling = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ot(c, a)
    };
    jy.prototype.getLocalScaling = function() {
        return wrapPointer(mt(this.a), n)
    };
    jy.prototype.calculateLocalInertia = function(a, c) {
        var d = this.a;
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        lt(d, a, c)
    };
    jy.prototype.__destroy__ = function() {
        jt(this.a)
    };

    function Z(a, c, d, e, f) {
        a && "object" === typeof a && (a = a.a);
        c && "object" === typeof c && (c = c.a);
        d && "object" === typeof d && (d = d.a);
        e && "object" === typeof e && (e = e.a);
        f && "object" === typeof f && (f = f.a);
        this.a = ld(a, c, d, e, f);
        getCache(Z)[this.a] = this
    }
    Z.prototype = Object.create(WrapperObject.prototype);
    Z.prototype.constructor = Z;
    Z.prototype.b = Z;
    Z.c = {};
    b.LocalConvexResult = Z;
    Z.prototype.get_m_hitCollisionObject = function() {
        return wrapPointer(nd(this.a), p)
    };
    Z.prototype.set_m_hitCollisionObject = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        sd(c, a)
    };
    Z.prototype.get_m_localShapeInfo = function() {
        return wrapPointer(rd(this.a), Dx)
    };
    Z.prototype.set_m_localShapeInfo = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        wd(c, a)
    };
    Z.prototype.get_m_hitNormalLocal = function() {
        return wrapPointer(pd(this.a), n)
    };
    Z.prototype.set_m_hitNormalLocal = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        ud(c, a)
    };
    Z.prototype.get_m_hitPointLocal = function() {
        return wrapPointer(qd(this.a), n)
    };
    Z.prototype.set_m_hitPointLocal = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        vd(c, a)
    };
    Z.prototype.get_m_hitFraction = function() {
        return od(this.a)
    };
    Z.prototype.set_m_hitFraction = function(a) {
        var c = this.a;
        a && "object" === typeof a && (a = a.a);
        td(c, a)
    };
    Z.prototype.__destroy__ = function() {
        md(this.a)
    };
    (function() {
        function a() {
            b.BT_CONSTRAINT_ERP = Qw();
            b.BT_CONSTRAINT_STOP_ERP = Sw();
            b.BT_CONSTRAINT_CFM = Pw();
            b.BT_CONSTRAINT_STOP_CFM = Rw();
            b.PHY_FLOAT = Lw();
            b.PHY_DOUBLE = Jw();
            b.PHY_INTEGER = Mw();
            b.PHY_SHORT = Nw();
            b.PHY_FIXEDPOINT88 = Kw();
            b.PHY_UCHAR = Ow()
        }
        b.calledRun ? a() : Ha.unshift(a)
    })();
    this.Ammo = b;


    return Ammo;
};
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = Ammo;
else if (typeof define === 'function' && define['amd'])
    define([], function() {
        return Ammo;
    });
else if (typeof exports === 'object')
    exports["Ammo"] = Ammo;