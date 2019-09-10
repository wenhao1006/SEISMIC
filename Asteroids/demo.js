'use strict';
let Module = {};

// copying strings
let utfDecoder = new TextDecoder('utf-8');
let getStr = function (module, ptr, len) {
    let slice = new Uint8Array(module.memory.buffer, ptr, len);
    return utfDecoder.decode(slice);
};

let utfEncoder = new TextEncoder('utf-8');
let putStr = function (module, str) {
    let buf = utfEncoder.encode(str);
    let ptr = module.alloc(buf.length);
    let slice = new Uint8Array(module.memory.buffer, ptr, buf.length);
    slice.set(buf);
    return {ptr: ptr, len: buf.length};
};
// /copying strings

let io = {
    puts: (ptr, len) => console.log(getStr(Module, ptr, len)),
    alert: (n) => alert(n),
};

let time = {
    performance_time_origin: performance.timeOrigin,
    performance_now: () => performance.now(),
};

let eventLoop = function(Module) {

    const EVENT_DESTROYED = 0;
    const EVENT_ANIMATION_FRAME = 1;
    const EVENT_MOUSE_MOVE = 2;
    const EVENT_KEY_DOWN = 3;
    const EVENT_KEY_UP = 4;
    let eventLoopsDict = new Map();
    eventLoopsDict.counter = 0;

    let keyEventFlags = function(event) {
        return (event.shiftKey ? 1 : 0) | (event.ctrlKey ? 2 : 0) | (event.altKey ? 4 : 0);
    };
    let charKey = function(event) {
        if (event.key.length !== 1) { return 0xffffffff; }
        return event.key.charCodeAt(0);
    };

    let EventLoop = class {
        constructor(callback) {
            let self = this;
            let id = ++eventLoopsDict.counter;
            eventLoopsDict.set(id, self);
            self.id = id;
            self.dead = false;
            self.rafId = null;

            self.rafCb = function() {
                self.rafId = null;
                if (self.dead) { return; }
                callback(id, EVENT_ANIMATION_FRAME, 0, 0, 0);
            };

            self.mouseMoveCb = function(event) {
                if (self.dead) { return; }
                callback(id, EVENT_MOUSE_MOVE, event.pageX, event.pageY, 0)
            };

            self.keyDown = function(event) {
                if (self.dead) { return; }
                callback(id, EVENT_KEY_DOWN, event.which, charKey(event), keyEventFlags(event));
            };

            self.keyUp = function(event) {
                if (self.dead) { return; }
                callback(id, EVENT_KEY_UP, event.which, charKey(event), keyEventFlags(event));
            };

            self.subscribeMouse();
            self.subscribeKeyboard();
        }

        raf() {
            let self = this;
            if (self.dead) { return; }
            self.rafId = requestAnimationFrame(self.rafCb);
        }

        caf() {
            let self = this;
            if (self.rafId) { cancelAnimationFrame(self.rafId); }
        }

        subscribeMouse() {
            let self = this;
            if (self.dead) { return; }
            window.addEventListener('mousemove', self.mouseMoveCb);
        }

        unsubscribeMouse() {
            let self = this;
            window.removeEventListener('mousemove', self.mouseMoveCb);
        }

        subscribeKeyboard() {
            let self = this;
            if (self.dead) { return; }
            window.addEventListener('keydown', self.keyDown);
            window.addEventListener('keyup', self.keyUp);
        }

        unsubscribeKeyboard() {
            let self = this;
            window.removeEventListener('keydown', self.keyDown);
            window.removeEventListener('keyup', self.keyUp);
        }

        shutdown() {
            let self = this;
            if (self.dead) { return; }
            self.dead = true;

            self.caf();
            self.unsubscribeMouse();
            self.unsubscribeKeyboard();

            eventLoopsDict.delete(self.id);
        }
    };

    let raf = function(id) {
        if (!eventLoopsDict.has(id)) { return false; }
        eventLoopsDict.get(id).raf();
        return true;
    };
    let destroy = function(id) {
        if (!eventLoopsDict.has(id)) { return false; }
        eventLoopsDict.get(id).destroy();
        setInterval(() => Module.event_loop_cb(id, EVENT_DESTROYED, 0, 0, 0), 0);
        return true;
    };

    return {
        event_loop_new: () => new EventLoop(Module.event_loop_cb).id,
        event_loop_raf: raf,
        event_loop_shutdown: destroy,
    };
};

let svg = {
    svg_set_path: (ptr, len) => window.path.setAttributeNS(null, 'd', getStr(Module, ptr, len)),
};

let math = {
    sqrt: (x) => Math.sqrt(x),
    sin: (x) => Math.sin(x),
    cos: (x) => Math.cos(x),
};

let randSource = (module) => (ptr, len) => {
    const OK = 0;
    const RANGE_ERROR = 1;
    const QUOTA_ERROR = 2;

    try {
        let slice = new Uint8Array(module.memory.buffer, ptr, len);
        window.crypto.getRandomValues(slice);
    } catch (e) {
        if (e instanceof RangeError) {
            return RANGE_ERROR;
        } else if (e instanceof DOMException && x.code === DOMException.QUOTA_EXCEEDED_ERR) {
            return QUOTA_ERROR;
        } else {
            throw e;
        }
    }

    return OK;
}

let rand = {
    js_fill_rand: randSource(Module),
};

let imports = {
    env: Object.assign({}, time, eventLoop(Module), io, svg, math, rand),
};

let local_exports = null;
function wasmProfiler() {
	if (local_exports != null && typeof local_exports._resetInstCounters === "function") {
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
			
		addCountLo[0] = local_exports._getI32AddCountLo();
		andCountLo[0] = local_exports._getI32AndCountLo();
		shlCountLo[0] = local_exports._getI32ShlCountLo();
		shrCountLo[0] = local_exports._getI32ShruCountLo();
		xorCountLo[0] = local_exports._getI32XorCountLo();
		addCountHi[0] = local_exports._getI32AddCountHi();
		andCountHi[0] = local_exports._getI32AndCountHi();
		shlCountHi[0] = local_exports._getI32ShlCountHi();
		shrCountHi[0] = local_exports._getI32ShruCountHi();
		xorCountHi[0] = local_exports._getI32XorCountHi();
		local_exports._resetInstCounters();	
		
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

fetch('svg_asteroids.base_profiled.wasm')
.then(response => response.arrayBuffer())
.then(bytes => WebAssembly.instantiate(bytes, imports))
.then(results => {
    let instance = results.instance;
    let exports = instance.exports;
	local_exports = exports;
    Object.assign(Module, {
        alloc: exports.alloc,
        dealloc: exports.dealloc,
        memory: exports.memory,
        event_loop_cb: exports.event_loop_cb,
    });
    exports.my_main();
});
