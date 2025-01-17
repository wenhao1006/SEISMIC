try {
    window || (self.window = self, self.document = {}, self.fakeWindow = !0, self.console = {
        log: function() {}
    })
} catch (e$$8) {
    self.window = self, self.document = {}, self.fakeWindow = !0, self.console = {
        log: function() {}
    }
}
(function(m, w, t, h, o) {
    function r(a, e) {
        if ("object" !== typeof a) return q("enumerator validation failed, invalid type base object."), o;
        if (e === o) return o;
        if ("number" === typeof e) return e;
        if ("string" === typeof e) {
            var f = parseInt(e, 10);
            if ("" !== e && isFinite(f)) return f;
            f = e.toUpperCase();
            f = a[f];
            if (f !== o) return f;
            q("enumerator validation failed, unknown enum value: " + e);
            var f = "",
                b;
            for (b in a) a.hasOwnProperty(b) && ("" !== f && (f += ", "), f += b.toLowerCase());
            q("possible enum values are: " + f)
        }
        return o
    }
    var d = "";
    try {
        for (var g =
                w.querySelectorAll("script"), c = 0, a = g.length; c < a; c++) {
            var b = g[c].src.lastIndexOf("/CubicVR.js"); - 1 < b && (d = g[c].src.substr(0, b) + "/")
        }
    } catch (f) {}
    var e = m.CubicVR = {};
    e.contexts = {};
    var q;
    try {
        q = void 0 !== console && console.log ? function(a) {
            console.log("CubicVR Log: " + a)
        } : function() {}
    } catch (n) {
        q = h
    }
    var s = {
        quality: {
            LOW: 0,
            MEDIUM: 1,
            HIGH: 2
        }
    };
    m.cubicvr = s;
    var F = {},
        x = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        u = function(a) {
            function f(a, e, b) {
                var n = function() {};
                n.prototype = a.prototype;
                e.prototype = new n;
                for (var q in b) e.prototype[q] =
                    b[q];
                return e
            }

            function b() {}

            function n(a) {
                (w.fullScreenEnabled || !1 === a) && w.cancelFullScreen();
                !1 !== a && (a === o && (a = e.getCanvas()), a.onwebkitfullscreenchange = b, a.onmozfullscreenchange = b, a.onfullscreenchange = b, a.webkitEnterFullScreen ? a.webkitEnterFullScreen() : a.mozRequestFullScreen ? a.mozRequestFullScreen() : a.requestFullscreen())
            }
            var c = this,
                g;
            a && (g = a + "", Object.defineProperty(this, "context", {
                enumerable: !0,
                configurable: !1,
                get: function() {
                    return g
                }
            }));
            c.undef = o;
            c.nop = h;
            c.scriptLocation = d;
            c.GLCore = B;
            c.Textures = [];
            c.Textures_obj = [];
            c.Textures_ref = [];
            c.Images = [];
            c.ShaderPool = [];
            c.log = q;
            c.enums = e.enums;
            c.MAX_LIGHTS = 6;
            c.extendClassGeneral = f;
            c.extendClass = function(a, e, b) {
                return f(a, function() {
                    a.apply(this);
                    e.apply(this, arguments)
                }, b)
            };
            c.features = {};
            c.quality = e.enums.HIGH;
            var u = {
                    antiAlias: !1,
                    lightPerPixel: !1,
                    lightShadows: !1,
                    texturePerPixel: !1,
                    postProcess: !1
                },
                C = {
                    antiAlias: !1,
                    lightPerPixel: !0,
                    lightShadows: !1,
                    texturePerPixel: !1,
                    postProcess: !1
                },
                G = {
                    antiAlias: !0,
                    lightPerPixel: !0,
                    lightShadows: !0,
                    texturePerPixel: !0,
                    postProcess: !0
                };
            c.features = G;
            var B = {
                    CoreShader_vs: null,
                    CoreShader_fs: null,
                    canvas: null,
                    width: null,
                    height: null,
                    fixed_aspect: 0,
                    fixed_size: null,
                    depth_alpha: !1,
                    default_filter: 1,
                    mainloop: null,
                    shadow_near: 0.1,
                    shadow_far: 100,
                    soft_shadow: !1,
                    fogLinear: !1,
                    fogExp: !1,
                    fogNoise: !1,
                    fogColor: [1, 1, 1],
                    fogDensity: 0,
                    fogNear: 0,
                    fogFar: 0,
                    resize_active: !1,
                    emptyLight: null,
                    resizeList: [],
                    canvasSizeFactor: 1,
                    init: function(a, f, b) {
                        var n, q = c.util,
                            s = e.enums;
                        if (f && b) {
                            f = q.getScriptContents(f);
                            b = q.getScriptContents(b)
                        } else if (m.CubicVRShader.CubicVRCoreVS &&
                            m.CubicVRShader.CubicVRCoreFS) {
                            f = m.CubicVRShader.CubicVRCoreVS;
                            b = m.CubicVRShader.CubicVRCoreFS
                        } else {
                            f = q.getScriptContents(d + "CubicVR_Core.vs");
                            b = q.getScriptContents(d + "CubicVR_Core.fs")
                        }
                        if (a === o) {
                            a = w.createElement("canvas");
                            a.style.background = "black";
                            if (!n) try {
                                n = a.getContext("experimental-webgl", {
                                    antialias: c.features.antiAlias
                                })
                            } catch (g) {
                                return null
                            }
                            B.gl = n;
                            if (B.fixed_size !== null) {
                                B.width = B.fixed_size[0];
                                B.height = B.fixed_size[1];
                                B.resizeElement(a, B.width, B.height)
                            } else {
                                B.addResizeable(a);
                                if (B.canvasSizeFactor !==
                                    1 && a.getContext !== o) {
                                    var q = t.round(m.innerWidth * B.canvasSizeFactor),
                                        u = t.round(m.innerHeight * B.canvasSizeFactor);
                                    B.resizeElement(a, q, u);
                                    a.style.top = m.innerHeight / 2 - u / 2 + "px";
                                    a.style.left = m.innerWidth / 2 - q / 2 + "px";
                                    a.style.position = "absolute"
                                } else B.resizeElement(a, m.innerWidth, m.innerHeight)
                            }
                            w.body.appendChild(a)
                        }
                        if (a.getContext !== o && a.width !== o && a.height !== o) {
                            try {
                                n || (n = a.getContext("experimental-webgl", {
                                    antialias: c.features.antiAlias
                                }));
                                n.viewport(0, 0, a.width, a.height);
                                B.canvas = a;
                                B.width = a.width;
                                B.height =
                                    a.height;
                                n.clearColor(0, 0, 0, 1);
                                n.clearDepth(1);
                                n.enable(n.DEPTH_TEST);
                                n.depthFunc(n.LEQUAL)
                            } catch (x) {}
                            if (!n) return null
                        } else n = a;
                        B.gl = n;
                        B.CoreShader_vs = f;
                        B.CoreShader_fs = b;
                        B.viewportWidth = B.width;
                        B.viewportHeight = B.height;
                        B.gl._viewport = B.gl.viewport;
                        n.viewport = function(a) {
                            return function(e, f, n, b) {
                                a.viewportWidth = n;
                                a.viewportHeight = b;
                                a.gl._viewport(e, f, n, b)
                            }
                        }(B);
                        n.enable(n.CULL_FACE);
                        n.cullFace(n.BACK);
                        n.frontFace(n.CCW);
                        for (a = e.enums.light.type.NULL; a < s.light.type.MAX; a++) c.ShaderPool[a] = [];
                        new c.Texture;
                        a = B.emptyLight = new c.Light(s.light.type.POINT);
                        a.diffuse = [0, 0, 0];
                        a.specular = [0, 0, 0];
                        a.distance = 0;
                        a.intensity = 0;
                        a.cutoff = 0;
                        for (a = s.light.type.NULL; a < s.light.type.MAX; a++) c.ShaderPool[a] = [];
                        if (B.resizeList.length) {
                            m.addEventListener("resize", function() {
                                c.GLCore.onResize()
                            }, false);
                            B.resize_active = true
                        }
                        s = w.createElement("menu");
                        s.setAttribute("type", "context");
                        a = w.createElement("menuitem");
                        a.setAttribute("label", "Enter full-screen");
                        a.setAttribute("onclick", "CubicVR.setFullScreen()");
                        s.id = "fullScreenMenu";
                        s.appendChild(a);
                        w.body.appendChild(s);
                        B.canvas.setAttribute("contextmenu", "fullScreenMenu");
                        return n
                    },
                    addResizeable: function(a) {
                        c.GLCore.resizeList.push(a)
                    },
                    onResize: function() {
                        var a = m.innerWidth,
                            e = m.innerHeight;
                        if (B.fixed_size !== null) {
                            a = c.GLCore.fixed_size[0];
                            e = c.GLCore.fixed_size[1]
                        }
                        for (var f = 0, n = c.GLCore.resizeList.length; f < n; f++) B.resizeElement(c.GLCore.resizeList[f], a, e)
                    },
                    setFixedAspect: function(a) {
                        c.GLCore.fixed_aspect = a
                    },
                    setFixedSize: function(a, e) {
                        c.GLCore.fixed_size = [a, e]
                    },
                    getCanvas: function() {
                        return c.GLCore.canvas
                    },
                    resizeElement: function(a, e, f) {
                        var n = B.gl;
                        if (B.fixed_aspect !== 0) {
                            var b = e * (1 / c.GLCore.fixed_aspect);
                            if (b > f) {
                                b = f;
                                e = f * c.GLCore.fixed_aspect
                            }
                            f = b
                        }
                        if (a.getContext !== o) {
                            a.width = e;
                            a.height = f;
                            if (!c.GLCore.fixed_size) {
                                a.style.left = (m.innerWidth / 2 - e / 2 | 0) + "px";
                                a.style.top = (m.innerHeight / 2 - f / 2 | 0) + "px";
                                a.style.position = "absolute"
                            }
                            n.viewport(0, 0, e, f)
                        } else a.resize(e, f)
                    },
                    setDepthAlpha: function(a, e, f) {
                        B.depth_alpha = a;
                        B.depth_alpha_near = e;
                        B.depth_alpha_far = f
                    },
                    setDefaultFilter: function(a) {
                        B.default_filter = r(c.enums.texture.filter,
                            a)
                    },
                    setSoftShadows: function(a) {
                        B.soft_shadow = a
                    },
                    setFog: function(a) {
                        B.fog_enabled = a
                    },
                    setFogExp: function(a, e) {
                        B.fog_enabled = true;
                        B.fogLinear = false;
                        B.fogExp = true;
                        B.fogColor = a;
                        B.fogDensity = e
                    },
                    setNoise: function(a) {
                        B.fogNoise = a
                    },
                    setFogLinear: function(a, e, f) {
                        B.fog_enabled = true;
                        B.fogExp = false;
                        B.fogLinear = true;
                        B.fogColor = a;
                        B.fogNear = e;
                        B.fogFar = f
                    },
                    setCanvasSizeFactor: function(a) {
                        B.canvasSizeFactor = a
                    },
                    setQuality: function(a) {
                        a = r(s.quality, a);
                        if (a === s.quality.HIGH) c.features = G;
                        else if (a === s.quality.MEDIUM) c.features =
                            C;
                        else if (a === s.quality.LOW) c.features = u;
                        c.quality = a;
                        return c.features
                    },
                    getQuality: function() {
                        return c.features
                    }
                },
                I = function(a, e, f) {
                    for (var n, b = w.getElementsByTagName("script"), q = 0; q < b.length; ++q) {
                        var s = b[q];
                        if (s.getAttribute("data-cubicvr")) {
                            var g = s.getAttribute("src");
                            if (g) {
                                var d = new XMLHttpRequest;
                                d.open("GET", g, false);
                                d.send(null);
                                if (d.status === 200 || d.status === 0) s.text = d.responseText
                            }
                        }
                    }
                    if (typeof a === "object") {
                        a.quality && B.setQuality(a.quality);
                        if (a.getContext) n = a;
                        else {
                            n = a.canvas;
                            e = a.vertexShader ||
                                e;
                            f = a.fragmentShader || f
                        }
                    } else if (a) {
                        a[0] == "#" && (a = a.substr(1));
                        n = w.getElementById(a)
                    }
                    for (var u in F) {
                        var a = F[u](c),
                            x;
                        for (x in a) a.hasOwnProperty(x) && (c[x] = a[x])
                    }
                    B.init(n, e, f);
                    return B.gl
                };
            c.GLCore = B;
            c.setFullScreen = n;
            c.init = I;
            c.start = function(a, e, f, n, b) {
                typeof a === "string" && a.toLowerCase() === "auto" && (a = o);
                f = f || "Sorry, your browser does not appear to support WebGL :-(";
                if (a = I(a, n, b)) {
                    e && typeof e === "function" && e(a, c.getCanvas());
                    return a
                }
                if (!a) {
                    f && typeof f === "function" ? f() : alert(f);
                    return false
                }
            };
            c.addResizeable =
                B.addResizeable;
            c.setFixedAspect = B.setFixedAspect;
            c.setFixedSize = B.setFixedSize;
            c.setCanvasSizeFactor = B.setCanvasSizeFactor;
            c.getCanvas = B.getCanvas;
            c.enums = s;
            c.IdentityMatrix = x;
            c.Textures = c.Textures;
            c.Textures_obj = c.Textures_obj;
            c.Images = c.Images;
            c.globalAmbient = [0.1, 0.1, 0.1];
            c.setGlobalAmbient = function(a) {
                c.globalAmbient = a
            };
            c.setGlobalDepthAlpha = B.setDepthAlpha;
            c.setDefaultFilter = B.setDefaultFilter;
            c.setSoftShadows = B.setSoftShadows;
            c.setQuality = B.setQuality;
            c.getQuality = B.getQuality;
            c.RegisterModule =
                e.RegisterModule;
            c.getScriptLocation = e.getScriptLocation;
            c.setFogExp = B.setFogExp;
            c.setFogLinear = B.setFogLinear;
            c.setFogNoise = B.setFogNoise;
            c.parseEnum = r;
            c.setFullScreen = n
        };
    e.init = function(a, f, n) {
        var b;
        a && (a.context && "string" === typeof a.context) && (b = a.context);
        b = new u(b);
        if (b.context) return e.contexts[b.context] = b, b.init(a, f, n), b;
        m.CubicVR = e = b;
        b.init(a, f, n);
        return b.GLCore.gl
    };
    e.start = function(a, f, n, b, q) {
        var c = new u;
        m.CubicVR = e = c;
        c.start(a, f, n, b, q);
        return c
    };
    e.RegisterModule = function(a, e) {
        F[a] = e
    };
    e.getScriptLocation = function() {
        return d
    };
    e.enums = s
})(window, window.document, Math, function() {});
window.CubicVRShader = {};
CubicVR.RegisterModule("Math", function(m) {
    function w(a) {
        return this.clearStack(a)
    }

    function t() {
        1 === arguments.length && (this.x = arguments[0][0], this.y = arguments[0][1], this.z = arguments[0][2], this.w = arguments[0][3]);
        4 === arguments.length && (this.x = arguments[0], this.y = arguments[1], this.z = arguments[2], this.w = arguments[3])
    }
    var h = m.undef,
        o = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        r = Math.PI / 2,
        d = m.enums;
    d.aabb = {
        DISJOINT: 0,
        A_INSIDE_B: 1,
        B_INSIDE_A: 2,
        INTERSECT: 3
    };
    var g = {
            length: function(a, b) {
                var f, e, q;
                b === h ? (f = a[0], e = a[1],
                    q = a[2]) : (f = b[0] - a[0], e = b[1] - a[1], q = b[2] - a[2]);
                return Math.sqrt(f * f + e * e + q * q)
            },
            normalize: function(a) {
                var b = a[0],
                    f = a[1],
                    e = a[2];
                return (b = Math.sqrt(b * b + f * f + e * e)) ? [a[0] / b, a[1] / b, a[2] / b] : [0, 0, 0]
            },
            dot: function(a, b) {
                return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
            },
            angle: function(a, b) {
                return Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) * Math.sqrt(b[0] * b[0] + b[1] * b[1] + b[2] * b[2])))
            },
            cross: function(a, b) {
                return [a[1] * b[2] - b[1] * a[2], a[2] * b[0] - b[2] * a[0], a[0] * b[1] - b[0] * a[1]]
            },
            multiply: function(a,
                b) {
                return [a[0] * b, a[1] * b, a[2] * b]
            },
            add: function(a, b) {
                return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
            },
            subtract: function(a, b) {
                return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
            },
            equal: function(a, b, f) {
                f === h && (f = 1.0E-7);
                return a === h && b === h ? !0 : a === h || b === h ? !1 : Math.abs(a[0] - b[0]) < f && Math.abs(a[1] - b[1]) < f && Math.abs(a[2] - b[2]) < f
            },
            moveViewRelative: function(a, b, f, e, q) {
                var n = Math.atan2(e, f),
                    b = Math.atan2(b[2] - a[2], b[0] - a[0]),
                    f = Math.sqrt(f * f + e * e),
                    n = b + n + r;
                return "object" === typeof q ? [q[0] + f * Math.cos(n), q[1], q[2] + f * Math.sin(n)] : [a[0] + f *
                    Math.cos(n), a[1], a[2] + f * Math.sin(n)
                ]
            },
            trackTarget: function(a, b, f, e) {
                var b = g.subtract(b, a),
                    q = g.length(b),
                    n;
                n = g.normalize(b);
                n = g.multiply(n, f * (1 / (1 / (q - e))));
                q > e ? a = g.add(a, n) : q < e ? (n = g.normalize(b), n = g.multiply(n, f * (1 / (1 / Math.abs(q - e)))), a = g.subtract(a, n)) : a = [a[0], a[1] + n[2], a[2]];
                return a
            },
            getClosestTo: function(a, b, f) {
                b = g.subtract(b, a);
                f = g.subtract(f, a);
                return g.add(g.multiply(b, g.dot(b, f) / g.dot(b, b)), a)
            },
            linePlaneIntersect: function(a, b, f, e) {
                var q = -a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
                    b = a[0] * (e[0] - f[0]) + a[1] *
                    (e[1] - f[1]) + a[2] * (e[2] - f[2]);
                if (0.0010 > Math.abs(b)) return !1;
                a = -(q + a[0] * f[0] + a[1] * f[1] + a[2] * f[2]) / b;
                return [f[0] + a * (e[0] - f[0]), f[1] + a * (e[1] - f[1]), f[2] + a * (e[2] - f[2])]
            }
        },
        c = {
            lookat: function(a, b, f, e, q, n, c, d, x) {
                var u = [],
                    h = [],
                    o = [],
                    h = [];
                u[0] = e - a;
                u[1] = q - b;
                u[2] = n - f;
                o[0] = c;
                o[1] = d;
                o[2] = x;
                u = g.normalize(u);
                h = g.cross(u, o);
                h = g.normalize(h);
                o = g.cross(h, u);
                h = [h[0], o[0], -u[0], 0, h[1], o[1], -u[1], 0, h[2], o[2], -u[2], 0, 0, 0, 0, 1];
                e = new m.Transform(h);
                e.translate([-a, -b, -f]);
                return e.getResult()
            },
            multiply: function(a, b, f) {
                f ===
                    h && (f = []);
                f[0] = a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3];
                f[1] = a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3];
                f[2] = a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3];
                f[3] = a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3];
                f[4] = a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7];
                f[5] = a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7];
                f[6] = a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7];
                f[7] = a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7];
                f[8] = a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11];
                f[9] = a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11];
                f[10] = a[2] * b[8] + a[6] * b[9] +
                    a[10] * b[10] + a[14] * b[11];
                f[11] = a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11];
                f[12] = a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15];
                f[13] = a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15];
                f[14] = a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15];
                f[15] = a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15];
                return f
            },
            vec4_multiply: function(a, b, f) {
                f === h && (f = []);
                f[0] = b[0] * a[0] + b[4] * a[1] + b[8] * a[2] + b[12] * a[3];
                f[1] = b[1] * a[0] + b[5] * a[1] + b[9] * a[2] + b[13] * a[3];
                f[2] = b[2] * a[0] + b[6] * a[1] + b[10] * a[2] + b[14] * a[3];
                f[3] = b[3] * a[0] + b[7] * a[1] + b[11] *
                    a[2] + b[15] * a[3];
                return f
            },
            vec3_multiply: function(a, b, f) {
                f === h && (f = []);
                f[0] = b[0] * a[0] + b[4] * a[1] + b[8] * a[2] + b[12];
                f[1] = b[1] * a[0] + b[5] * a[1] + b[9] * a[2] + b[13];
                f[2] = b[2] * a[0] + b[6] * a[1] + b[10] * a[2] + b[14];
                return f
            },
            perspective: function(a, b, f, e) {
                a = Math.tan(a * Math.PI / 360);
                return [1 / (a * b), 0, 0, 0, 0, 1 / a, 0, 0, 0, 0, -(e + f) / (e - f), -1, 0, 0, -(2 * e * f) / (e - f), 0]
            },
            ortho: function(a, b, f, e, q, n) {
                return [2 / (b - a), 0, 0, 0, 0, 2 / (e - f), 0, 0, 0, 0, -2 / (n - q), 0, -(a + b) / (b - a), -(e + f) / (e - f), -(n + q) / (n - q), 1]
            },
            determinant: function(a) {
                return (a[0] * a[5] - a[1] *
                    a[4]) * (a[10] * a[15] - a[11] * a[14]) - (a[0] * a[6] - a[2] * a[4]) * (a[9] * a[15] - a[11] * a[13]) + (a[0] * a[7] - a[3] * a[4]) * (a[9] * a[14] - a[10] * a[13]) + (a[1] * a[6] - a[2] * a[5]) * (a[8] * a[15] - a[11] * a[12]) - (a[1] * a[7] - a[3] * a[5]) * (a[8] * a[14] - a[10] * a[12]) + (a[2] * a[7] - a[3] * a[6]) * (a[8] * a[13] - a[9] * a[12])
            },
            coFactor: function() {},
            transpose: function(a) {
                return [a[0], a[4], a[8], a[12], a[1], a[5], a[9], a[13], a[2], a[6], a[10], a[14], a[3], a[7], a[11], a[15]]
            },
            inverse_mat3: function(a) {
                var b = [],
                    f = a[0],
                    e = a[1],
                    q = a[2],
                    n = a[4],
                    c = a[5],
                    g = a[6],
                    d = a[8],
                    u = a[9],
                    a = a[10],
                    h = a * c - g * u,
                    o = -a * n + g * d,
                    m = u * n - c * d,
                    r = f * h + e * o + q * m;
                if (!r) return null;
                r = 1 / r;
                b[0] = h * r;
                b[1] = (-a * e + q * u) * r;
                b[2] = (g * e - q * c) * r;
                b[3] = o * r;
                b[4] = (a * f - q * d) * r;
                b[5] = (-g * f + q * n) * r;
                b[6] = m * r;
                b[7] = (-u * f + e * d) * r;
                b[8] = (c * f - e * n) * r;
                return b
            },
            inverse: function(a, b) {
                var f = a[0] * a[5] - a[1] * a[4],
                    e = a[0] * a[6] - a[2] * a[4],
                    q = a[0] * a[7] - a[3] * a[4],
                    n = a[1] * a[6] - a[2] * a[5],
                    c = a[1] * a[7] - a[3] * a[5],
                    g = a[2] * a[7] - a[3] * a[6],
                    d = a[8] * a[13] - a[9] * a[12],
                    u = a[8] * a[14] - a[10] * a[12],
                    o = a[8] * a[15] - a[11] * a[12],
                    m = a[9] * a[14] - a[10] * a[13],
                    r = a[9] * a[15] - a[11] * a[13],
                    t = a[10] *
                    a[15] - a[11] * a[14],
                    v = f * t - e * r + q * m + n * o - c * u + g * d;
                return 0 !== v ? (b === h && (b = []), b[0] = 0 + a[5] * t - a[6] * r + a[7] * m, b[4] = 0 - a[4] * t + a[6] * o - a[7] * u, b[8] = 0 + a[4] * r - a[5] * o + a[7] * d, b[12] = 0 - a[4] * m + a[5] * u - a[6] * d, b[1] = 0 - a[1] * t + a[2] * r - a[3] * m, b[5] = 0 + a[0] * t - a[2] * o + a[3] * u, b[9] = 0 - a[0] * r + a[1] * o - a[3] * d, b[13] = 0 + a[0] * m - a[1] * u + a[2] * d, b[2] = 0 + a[13] * g - a[14] * c + a[15] * n, b[6] = 0 - a[12] * g + a[14] * q - a[15] * e, b[10] = 0 + a[12] * c - a[13] * q + a[15] * f, b[14] = 0 - a[12] * n + a[13] * e - a[14] * f, b[3] = 0 - a[9] * g + a[10] * c - a[11] * n, b[7] = 0 + a[8] * g - a[10] * q + a[11] * e, b[11] = 0 - a[8] * c + a[9] *
                    q - a[11] * f, b[15] = 0 + a[8] * n - a[9] * e + a[10] * f, f = 1 / v, b[0] *= f, b[1] *= f, b[2] *= f, b[3] *= f, b[4] *= f, b[5] *= f, b[6] *= f, b[7] *= f, b[8] *= f, b[9] *= f, b[10] *= f, b[11] *= f, b[12] *= f, b[13] *= f, b[14] *= f, b[15] *= f, b) : null
            },
            identity: function(a) {
                if (a == h) return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                a[0] = 1;
                a[1] = 0;
                a[2] = 0;
                a[3] = 0;
                a[4] = 0;
                a[5] = 1;
                a[6] = 0;
                a[7] = 0;
                a[8] = 0;
                a[9] = 0;
                a[10] = 1;
                a[11] = 0;
                a[12] = 0;
                a[13] = 0;
                a[14] = 0;
                a[15] = 1
            },
            translate: function(a, b, f, e) {
                a = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, a, b, f, 1];
                if (e === h) return a;
                c.multiply(e.slice(0), a, e)
            },
            rotateAxis: function(a,
                b, f, e, q) {
                var n = Math.sin(a * (Math.PI / 180)),
                    a = Math.cos(a * (Math.PI / 180)),
                    b = [a + b * b * (1 - a), b * f * (1 - a) - e * n, b * e * (1 - a) + f * n, 0, f * b * (1 - a) + e * n, a + f * f * (1 - a), f * e * (1 - a) - b * n, 0, e * b * (1 - a) - f * n, e * f * (1 - a) + b * n, a + e * e * (1 - a), 0, 0, 0, 0, 1];
                if (q === h) return b;
                c.multiply(q.slice(0), b, q)
            },
            rotate: function(a, b, f, e) {
                var q;
                e === h && (e = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
                0 !== f && (q = Math.sin(f * (Math.PI / 180)), f = Math.cos(f * (Math.PI / 180)), c.multiply(e.slice(0), [f, q, 0, 0, -q, f, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], e));
                0 !== b && (q = Math.sin(b * (Math.PI / 180)), f = Math.cos(b *
                    (Math.PI / 180)), c.multiply(e.slice(0), [f, 0, -q, 0, 0, 1, 0, 0, q, 0, f, 0, 0, 0, 0, 1], e));
                0 !== a && (q = Math.sin(a * (Math.PI / 180)), f = Math.cos(a * (Math.PI / 180)), c.multiply(e.slice(0), [1, 0, 0, 0, 0, f, q, 0, 0, -q, f, 0, 0, 0, 0, 1], e));
                return e
            },
            scale: function(a, b, f, e) {
                if (e === h) return [a, 0, 0, 0, 0, b, 0, 0, 0, 0, f, 0, 0, 0, 0, 1];
                c.multiply(e.slice(0), [a, 0, 0, 0, 0, b, 0, 0, 0, 0, f, 0, 0, 0, 0, 1], e)
            },
            transform: function(a, b, f) {
                var e = c.identity();
                a && c.translate(a[0], a[1], a[2], e);
                b && (0 === b[0] && 0 === b[1] && 0 === b[2] || c.rotate(b[0], b[1], b[2], e));
                f && (1 === f[0] && 1 ===
                    f[1] && 1 === f[2] || c.scale(f[0], f[1], f[2], e));
                return e
            }
        };
    w.prototype = {
        setIdentity: function() {
            this.m_stack[this.c_stack] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            this.valid === this.c_stack && this.c_stack && this.valid--;
            return this
        },
        getIdentity: function() {
            return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
        },
        invalidate: function() {
            this.valid = 0;
            this.result = null;
            return this
        },
        getResult: function() {
            var a = m.mat4;
            if (!this.c_stack) return this.m_stack[0];
            var b = o;
            this.valid > this.c_stack - 1 && (this.valid = this.c_stack - 1);
            for (var f = this.valid; f <
                this.c_stack + 1; f++) b = a.multiply(b, this.m_stack[f]), this.m_cache[f] = b;
            this.valid = this.c_stack - 1;
            return this.result = this.m_cache[this.c_stack]
        },
        pushMatrix: function(a) {
            this.c_stack++;
            this.m_stack[this.c_stack] = a ? a : o;
            return this
        },
        popMatrix: function() {
            if (0 !== this.c_stack) return this.c_stack--, this
        },
        clearStack: function(a) {
            this.m_stack = [];
            this.m_cache = [];
            this.valid = this.c_stack = 0;
            this.result = null;
            a !== h ? this.m_stack[0] = a : this.setIdentity();
            return this
        },
        translate: function(a, b, f) {
            var e = m.mat4;
            if ("object" ===
                typeof a) return this.translate(a[0], a[1], a[2]);
            var q = this.getIdentity();
            q[12] = a;
            q[13] = b;
            q[14] = f;
            this.m_stack[this.c_stack] = e.multiply(this.m_stack[this.c_stack], q);
            this.valid === this.c_stack && this.c_stack && this.valid--;
            return this
        },
        scale: function(a, b, f) {
            var e = m.mat4;
            if ("object" === typeof a) return this.scale(a[0], a[1], a[2]);
            var q = this.getIdentity();
            q[0] = a;
            q[5] = b;
            q[10] = f;
            this.m_stack[this.c_stack] = e.multiply(this.m_stack[this.c_stack], q);
            this.valid === this.c_stack && this.c_stack && this.valid--;
            return this
        },
        rotate: function(a, b, f, e) {
            var q = m.mat4;
            if ("object" === typeof a) return this.rotate(a[0], 1, 0, 0), this.rotate(a[1], 0, 1, 0), this.rotate(a[2], 0, 0, 1), this;
            var n, c;
            if (b || f || e) n = Math.sin(-a * (Math.PI / 180)), c = Math.cos(-a * (Math.PI / 180));
            b && (a = this.getIdentity(), a[5] = c * b, a[9] = n * b, a[6] = -n * b, a[10] = c * b, this.m_stack[this.c_stack] = q.multiply(a, this.m_stack[this.c_stack]));
            f && (b = this.getIdentity(), b[0] = c * f, b[8] = -n * f, b[2] = n * f, b[10] = c * f, this.m_stack[this.c_stack] = q.multiply(b, this.m_stack[this.c_stack]));
            e && (f = this.getIdentity(),
                f[0] = c * e, f[4] = n * e, f[1] = -n * e, f[5] = c * e, this.m_stack[this.c_stack] = q.multiply(f, this.m_stack[this.c_stack]));
            this.valid === this.c_stack && this.c_stack && this.valid--;
            return this
        }
    };
    t.prototype = {
        length: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
        },
        normalize: function() {
            var a = Math.sqrt(this.length());
            this.x /= a;
            this.y /= a;
            this.z /= a;
            this.w /= a
        },
        fromMatrix: function(a) {
            var b = 1 + a[0] + a[5] + a[10],
                f, e, q;
            1.0E-8 < b ? (f = 2 * Math.sqrt(b), b = (a[9] - a[6]) / f, e = (a[2] - a[8]) / f, q = (a[4] - a[1]) / f,
                a = 0.25 * f) : a[0] > a[5] && a[0] > a[10] ? (f = 2 * Math.sqrt(1 + a[0] - a[5] - a[10]), b = 0.25 * f, e = (a[4] + a[1]) / f, q = (a[2] + a[8]) / f, a = (a[9] - a[6]) / f) : a[5] > a[10] ? (f = 2 * Math.sqrt(1 + a[5] - a[0] - a[10]), b = (a[4] + a[1]) / f, e = 0.25 * f, q = (a[9] + a[6]) / f, a = (a[2] - a[8]) / f) : (f = 2 * Math.sqrt(1 + a[10] - a[0] - a[5]), b = (a[2] + a[8]) / f, e = (a[9] + a[6]) / f, q = 0.25 * f, a = (a[4] - a[1]) / f);
            this.x = b;
            this.y = e;
            this.z = q;
            this.w = a
        },
        fromEuler: function(a, b, f) {
            var e = Math.cos(Math.PI / 180 * b / 2),
                b = Math.sin(Math.PI / 180 * b / 2),
                q = Math.cos(Math.PI / 180 * f / 2),
                f = Math.sin(Math.PI / 180 * f / 2),
                n = Math.cos(Math.PI /
                    180 * a / 2),
                a = Math.sin(Math.PI / 180 * a / 2),
                c = e * q,
                g = b * f;
            this.w = c * n - g * a;
            this.x = c * a + g * n;
            this.y = b * q * n + e * f * a;
            this.z = e * f * n - b * q * a
        },
        toEuler: function() {
            var a = this.w * this.w,
                b = this.x * this.x,
                f = this.y * this.y,
                e = this.z * this.z,
                q = 180 / Math.PI * Math.atan2(2 * (this.y * this.z + this.x * this.w), -b - f + e + a),
                n = 180 / Math.PI * Math.asin(-2 * (this.x * this.z - this.y * this.w)),
                a = 180 / Math.PI * Math.atan2(2 * (this.x * this.y + this.z * this.w), b - f - e + a);
            return [q, n, a]
        },
        multiply: function(a, b) {
            b === h && (b = a, a = this);
            return new t(a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y, a.y *
                b.w + a.w * b.y + a.z * b.x - a.x * b.z, a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x, a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z)
        }
    };
    return {
        vec2: {
            equal: function(a, b, f) {
                f === h && (f = 1.0E-8);
                return a === h && b === h ? !0 : a === h || b === h ? !1 : Math.abs(a[0] - b[0]) < f && Math.abs(a[1] - b[1]) < f
            },
            onLine: function(a, b, f) {
                var e = a[1] < b[1] ? a[1] : b[1],
                    q = a[0] > b[0] ? a[0] : b[0],
                    n = a[1] > b[1] ? a[1] : b[1];
                return (a[0] < b[0] ? a[0] : b[0]) <= f[0] && f[0] <= q && e <= f[1] && f[1] <= n ? !0 : !1
            },
            lineIntersect: function(a, b, f, e) {
                var q = a[0],
                    a = a[1],
                    n = b[0],
                    b = b[1],
                    c = f[0],
                    f = f[1],
                    g = e[0],
                    e = e[1],
                    d = (q - n) * (f - e) - (a -
                        b) * (c - g);
                return 0 === d ? !1 : [((c - g) * (q * b - a * n) - (q - n) * (c * e - f * g)) / d, ((f - e) * (q * b - a * n) - (a - b) * (c * e - f * g)) / d]
            },
            add: function(a, b) {
                return [a[0] + b[0], a[1] + b[1]]
            },
            subtract: function(a, b) {
                return [a[0] - b[0], a[1] - b[1]]
            },
            length: function(a, b) {
                if (b === h) return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
                var f = [a[0] - b[0], a[1] - b[1]];
                return Math.sqrt(f[0] * f[0] + f[1] * f[1])
            }
        },
        vec3: g,
        mat3: {
            transpose_inline: function(a) {
                var b = a[1],
                    f = a[2],
                    e = a[5];
                a[1] = a[3];
                a[2] = a[6];
                a[3] = b;
                a[5] = a[7];
                a[6] = f;
                a[7] = e
            },
            vec3_multiply: function(a, b, f) {
                f === h && (f = []);
                f[0] =
                    b[0] * a[0] + b[3] * a[1] + b[6] * a[2];
                f[1] = b[1] * a[0] + b[4] * a[1] + b[7] * a[2];
                f[2] = b[2] * a[0] + b[5] * a[1] + b[8] * a[2];
                return f
            }
        },
        mat4: c,
        aabb: {
            engulf: function(a, b) {
                a[0][0] > b[0] && (a[0][0] = b[0]);
                a[0][1] > b[1] && (a[0][1] = b[1]);
                a[0][2] > b[2] && (a[0][2] = b[2]);
                a[1][0] < b[0] && (a[1][0] = b[0]);
                a[1][1] < b[1] && (a[1][1] = b[1]);
                a[1][2] < b[2] && (a[1][2] = b[2])
            },
            reset: function(a, b) {
                void 0 === b && (b = [0, 0, 0]);
                a[0][0] = b[0];
                a[0][1] = b[1];
                a[0][2] = b[2];
                a[1][0] = b[0];
                a[1][1] = b[1];
                a[1][2] = b[2]
            },
            size: function(a) {
                return [a[0][0] < a[1][0] ? a[1][0] - a[0][0] : a[0][0] -
                    a[1][0], a[0][1] < a[1][1] ? a[1][1] - a[0][1] : a[0][1] - a[1][1], a[0][2] < a[1][2] ? a[1][2] - a[0][2] : a[0][2] - a[1][2]
                ]
            },
            intersects: function(a, b) {
                return a[0][0] > b[1][0] || a[1][0] < b[0][0] || a[0][1] > b[1][1] || a[1][1] < b[0][1] || a[0][2] > b[1][2] || a[1][2] < b[0][2] ? d.aabb.DISJOINT : a[0][0] >= b[0][0] && a[1][0] <= b[1][0] && a[0][1] >= b[0][1] && a[1][1] <= b[1][1] && a[0][2] >= b[0][2] && a[1][2] <= b[1][2] ? d.aabb.A_INSIDE_B : b[0][0] >= a[0][0] && b[1][0] <= a[1][0] && b[0][1] >= a[0][1] && b[1][1] <= a[1][1] && b[0][2] >= a[0][2] && b[1][2] <= a[1][2] ? d.aabb.B_INSIDE_A :
                    d.aabb.INTERSECT
            }
        },
        plane: {
            classifyPoint: function(a, b) {
                var f = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3];
                return 0 > f ? -1 : 0 < f ? 1 : 0
            },
            normalize: function(a) {
                var b = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
                a[0] /= b;
                a[1] /= b;
                a[2] /= b;
                a[3] /= b
            }
        },
        sphere: {
            intersects: function(a, b) {
                var f = m.vec3.subtract([a[0], a[1], a[2]], [b[0], b[1], b[2]]),
                    f = Math.sqrt(f[0] * f[0] + f[1] * f[1] + f[2] * f[2]),
                    e = a[3] + b[3];
                return f * f < e * e ? !0 : !1
            }
        },
        triangle: {
            normal: function(a, b, f, e) {
                e === h && (e = []);
                var q = a[0] - b[0],
                    n = a[1] - b[1],
                    a = a[2] - b[2],
                    c = b[0] - f[0],
                    g = b[1] - f[1],
                    b = b[2] - f[2];
                e[0] = n * b - a * g;
                e[1] = a * c - q * b;
                e[2] = q * g - n * c;
                return e
            }
        },
        Transform: w,
        Quaternion: t
    }
});
CubicVR.RegisterModule("Utility", function(m) {
    var w = m.undef,
        t = m.log,
        h = {},
        o = {},
        r = {
            multiSplit: function(d, g) {
                for (var c = d.split(g[0]), a = 1, b = g.length; a < b; a++)
                    for (var f = g[a], e = 0, q = c.length; e < q; e++) {
                        var n = c[e].trim().split(f),
                            s = !0;
                        if (1 < n.length)
                            for (var F = 0; F < n.length; F++) "" !== n[F].trim() && (c.splice(e + F, 0 === F ? 1 : 0, n[F]), F && q++, s = !1);
                        else c[e] = c[e].trim().replace(f, ""), "" !== c[e] && (s = !1);
                        s && (c.splice(e, 1), q--, e--)
                    }
                return c
            },
            getJSONScriptObj: function(d, g) {
                if ("string" === typeof d && 0 < d.length && "#" === d.charAt(0)) {
                    var c =
                        document.getElementById(d.substr(1));
                    if (c) return c = JSON.parse(c.innerHTML || c.text), g && g(c), c
                }
                return d
            },
            getScriptContents: function(d) {
                var g = document.getElementById(d),
                    c = "",
                    a = "";
                if (g) {
                    if ("" !== g.src || g.attributes.srcUrl !== w) a = "" !== g.src ? g.src : g.attributes.srcUrl.value
                } else a = d;
                if (0 !== a.length) {
                    if (d = new XMLHttpRequest, d.overrideMimeType && d.overrideMimeType("application/json"), d.open("GET", a, !1), d.send(null), 200 === d.status || 0 === d.status) c = d.responseText
                } else
                    for (a = g.firstChild; a;) 3 === a.nodeType && (c += a.textContent),
                        a = a.nextSibling;
                return c
            },
            xmlNeedsBadgerFish: function(d) {
                for (d = [d]; d.length;) {
                    var g = d.pop();
                    if (g.attributes && g.attributes.length) return !0;
                    for (var c = 0, a = g.childNodes.length; c < a; c++) d.push(g.childNodes[c])
                }
                return !1
            },
            getFirstEntry: function(d) {
                for (var g in d)
                    if (d.hasOwnProperty(g)) return d[g]
            },
            getURIFileType: function(d) {
                function g(a) {
                    for (var e in b)
                        if (b.hasOwnProperty(e) && -1 !== b[e].indexOf(a)) return e;
                    return w
                }
                var c = d.toLowerCase(),
                    a = ["_ext", "ext"],
                    b = {
                        json: ["js", "javascript", "json"],
                        xml: ["xml"]
                    };
                if (-1 !==
                    c.indexOf("?")) {
                    var f = c.split("?"),
                        c = f[0];
                    if (f[1])
                        for (var f = -1 === f[1].indexOf("&") ? [f[1]] : f[1].split("&"), e = 0, q = f.length; e < q; e++) {
                            var n = f[e];
                            if (-1 !== n.indexOf("=") && (n = n.split("="), -1 !== a.indexOf(n[0]))) {
                                var s = g(n[1]);
                                if (s) return s;
                                t("Unable to determine extension type '" + n[1] + "' provided for URI: [" + d + "], falling back to filename part.")
                            }
                        }
                }
                return -1 !== c.indexOf(".") ? (d = c.split("."), g(d[d.length - 1])) : w
            },
            get: function(d, g) {
                var c = null,
                    a = null,
                    b = null,
                    g = g || null;
                if (d === w) return w;
                if (isFinite(d)) return d;
                "function" === typeof d && (d = d(g));
                if ("object" === typeof d) return g && !(d instanceof g) ? new g(d) : d;
                if ("string" == typeof d) {
                    if (-1 !== d.indexOf("\n")) return d;
                    "#" == d[0] && (c = d.substr(1), (b = document.getElementById(c)) && (a = b.src || null));
                    !b && (!c && !a && d) && (a = d)
                }
                if (b && !a) return CubicVR.util.collectTextNode(b);
                if (a) {
                    var c = null,
                        f = o[a] || null;
                    if (!f) {
                        var e = r.getURIFileType(a);
                        if (e === w && !b) return a;
                        "json" === e ? f = CubicVR.util.getJSON(a) : c = "xml" === e ? CubicVR.util.getXML(a) : CubicVR.util.getURL(a);
                        c && c.childNodes ? f = r.getFirstEntry(r.xml2json(c)) :
                            c && (f = c)
                    }
                    f && o[a] === w && (o[a] = f);
                    if (g) {
                        if (h[a] && h[a] instanceof g) return h[a];
                        if (f) return h[a] = new g(f), h[a]
                    } else if (f) return f;
                    return a
                }
                c && !b && console.log("Unable to retrieve requested ID: '" + d + "'");
                return w
            },
            clearCache: function() {
                h = {};
                o = {}
            },
            getURL: function(d) {
                try {
                    var g = new XMLHttpRequest;
                    g.open("GET", d, !1);
                    g.send(null);
                    if (200 === g.status || 0 === g.status) {
                        if (g.responseText.length) return g.responseText;
                        if (g.responseXML) return g.responseXML
                    }
                } catch (c) {
                    alert(d + " failed to load.")
                }
                return null
            },
            getXML: function(d) {
                try {
                    var g =
                        new XMLHttpRequest;
                    g.open("GET", d, !1);
                    g.overrideMimeType("application/xml");
                    g.send(null);
                    if (200 === g.status || 0 === g.status) return g.responseXML
                } catch (c) {
                    try {
                        alert(d + " failed to load.")
                    } catch (a) {
                        throw c;
                    }
                }
                return null
            },
            getJSON: function(d) {
                try {
                    var g = new XMLHttpRequest;
                    g.open("GET", d, !1);
                    g.overrideMimeType("application/json");
                    g.send(null);
                    if (200 === g.status || 0 === g.status) return eval("(" + g.responseText + ")")
                } catch (c) {
                    try {
                        alert(d + " failed to load.")
                    } catch (a) {
                        throw c;
                    }
                }
                return null
            },
            repackArray: function(d, g,
                c) {
                d.length !== parseInt(g, 10) * parseInt(c, 10) && t("array repack error, data size !== stride*count: data.length=" + d.length + " stride=" + g + " count=" + c);
                for (var c = [], a = 0, b = 0, f = d.length; b < f; b++) {
                    var e = b % g;
                    0 === e && (c[a] = []);
                    c[a][e] = d[b];
                    e === g - 1 && a++
                }
                return c
            },
            collectTextNode: function(d) {
                if (!d) return "";
                for (var g = "", d = d.childNodes, c = 0, a = d.length; c < a; c++) g += d[c].nodeValue;
                return g
            },
            floatDelimArray: function(d, g) {
                "\n" != g && (d = d.replace(/\n/g, " ").replace(/^\s+|\s+$/, ""));
                for (var c = d.split(g ? g : ","), a = 0, b = c.length; a <
                    b; a++) c[a] = parseFloat(c[a]);
                c[c.length - 1] !== c[c.length - 1] && c.pop();
                return c
            },
            intDelimArray: function(d, g) {
                "\n" != g && (d = d.replace(/\n/g, " ").replace(/^\s+|\s+$/, ""));
                for (var c = d.split(g ? g : ","), a = 0, b = c.length; a < b; a++) c[a] = parseInt(c[a], 10);
                c[c.length - 1] !== c[c.length - 1] && c.pop();
                return c
            },
            textDelimArray: function(d, g) {
                "\n" != g && (d = d.replace(/\n/g, " ").replace(/^\s+|\s+$/, ""));
                for (var c = d.split(g ? g : ","), a = 0, b = c.length; a < b; a++) c[a] = c[a];
                return c
            },
            xmlstring2json: function(d) {
                for (var d = d.replace(/<\!--.*?--\>/gm,
                        "").replace(/\n/g, " ").split(/(<[^>]*>)([^<]*)/gm), g = /^\s+$/gm, c, a = [], b = [], f = {}, e = f, q = 0, n = d.length; q < n; q++) {
                    var s = d[q];
                    if (!(g.test(s) || "" === s) && !/<\?\s?xml[^>]*>/.test(s))
                        if (/<.*?>/.test(s)) {
                            c = s.split(/<([^>]*?)(.*)?>/g)[2];
                            if ("/" !== c[0] && (s = c.split(" "), c = s[0], s = s.slice(1).join(" "), a.push(c), b.push(f), f[c] && !(f[c] instanceof Array) ? f[c] = [f[c]] : (f[c] || (f[c] = {}), f = f[c]), f instanceof Array && (f.push({}), f = f[f.length - 1]), "/" === c.substr(c.length - 1) || "/" === s.substr(s.length - 1))) c = "/" + c;
                            if ("/" === c[0]) {
                                c =
                                    c.substr(1);
                                if (a.length && a[a.length - 1] !== c) return console.log("Unmatched tag, aborting: " + c), !1;
                                a.pop();
                                f = b.length ? b[b.length - 1] : null;
                                b.pop()
                            }
                        } else {
                            var F = b[b.length - 1][c];
                            F instanceof Array ? (F.pop(), F.push(r.parseNumeric(s))) : b[b.length - 1][c] = r.parseNumeric(s)
                        }
                }
                return e
            },
            xmlstring2badgerfish: function(d) {
                for (var d = d.replace(/<\!--.*?--\>/gm, "").replace(/\n/g, " ").split(/(<[^>]*>)([^<]*)/gm), g = /^\s+$/gm, c, a = [], b = [], f = {}, e = f, q = 0, n = d.length; q < n; q++)
                    if (c = d[q], !(g.test(c) || "" === c) && !/<\?\s?xml[^>]*>/.test(c))
                        if (/<.*?>/.test(c)) {
                            c =
                                c.split(/<([^>]*?)(.*)?>/g)[2];
                            if ("/" !== c[0]) {
                                var s = c.split(" ");
                                c = s[0];
                                s = s.slice(1).join(" ");
                                a.push(c);
                                b.push(f);
                                f[c] && !(f[c] instanceof Array) ? f[c] = [f[c]] : f[c] || (f[c] = {});
                                f = f[c];
                                f instanceof Array && (f.push({}), f = f[f.length - 1]);
                                if ("/" === c.substr(c.length - 1) || "/" === s.substr(s.length - 1)) c = "/" + c;
                                for (var s = r.multiSplit(s, "= "), F = "", x = 0; x < s.length; x++) {
                                    var u = s[x];
                                    "/" === u[u.length - 1] && (u = u.substr(0, u.length - 1));
                                    if (1 === x % 2) {
                                        if ("'" === u[0] || '"' === u[0]) {
                                            for (var h = u[0], u = u.substr(1); u[u.length - 1] !== h && s.length +
                                                1 < x;) u += s.splice(x + 1, 1);
                                            u[u.length - 1] === h && (u = u.substr(0, u.length - 1))
                                        }
                                        f["@" + F] = u
                                    } else F = u
                                }
                            }
                            if ("/" === c[0]) {
                                c = c.substr(1);
                                if (a.length && a[a.length - 1] !== c) return console.log("Unmatched tag, aborting: " + a[a.length - 1]), !1;
                                a.pop();
                                f = b.length ? b[b.length - 1] : null;
                                b.pop()
                            }
                        } else f.$ = c;
                return e
            },
            xml2badgerfish: function(d) {
                var g = {},
                    c = [],
                    a, b, f, e, q, n = /^\s+|\s+$/g;
                d.jsonParent = g;
                for (c.push(d); c.length;) {
                    b = c.pop();
                    var s = null;
                    f = b.jsonParent;
                    d = 0;
                    for (a = b.childNodes.length; d < a; d++) e = b.childNodes[d], q = e.tagName, q !== w &&
                        (s = s || {}, s[q] = s[q] || 0, s[q]++);
                    if (b.attributes && b.attributes.length) {
                        d = 0;
                        for (a = b.attributes.length; d < a; d++) e = b.attributes[d], f["@" + e.name] = e.value
                    }
                    d = 0;
                    for (a = b.childNodes.length; d < a; d++) e = b.childNodes[d], q = e.tagName, 1 === e.nodeType ? (1 < s[q] ? (f[q] = f[q] || [], f[q].push({}), e.jsonParent = f[q][f[q].length - 1]) : (f[q] = f[q] || {}, e.jsonParent = f[q]), c.push(e)) : 3 === e.nodeType && "" !== e.nodeValue.replace(n, "") && (f.$ = f.$ || "", f.$ += e.nodeValue)
                }
                return g
            },
            isTextNode: function(d) {
                for (var d = d.childNodes, g = 0, c = d.length; g < c; g++)
                    if (3 !==
                        d[g].nodeType || d[g].childNodes.length) return !1;
                return !0
            },
            parseNumeric: function(d) {
                var g = null,
                    c, g = d.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\n/g, " ").replace(/ *, */gm, ",").replace(/\s+/g, " ");
                if ("" === g) return g;
                if ((-1 !== g.indexOf(" ") || -1 !== g.indexOf(",")) && /[0-9\.,e\-\+ ]+/g.test(g))
                    if (/[^0-9\-\+]+/g.test(g))
                        if (/[^0-9\- ]+/g.test(g))
                            if (/[^0-9\-,]+/g.test(g))
                                if (/[^0-9\.e\-\+ ]+/g.test(g))
                                    if (/[^0-9\.,e\+\-]+/g.test(g))
                                        if (/[^0-9,\-\+ ]+/g.test(g)) {
                                            if (!/[^0-9\.,e\-\+ ]+/g.test(g)) {
                                                g = g.split(" ");
                                                d = 0;
                                                for (c = g.length; d < c; d++) g[d] = r.floatDelimArray(g[d], ",");
                                                return g
                                            }
                                        } else {
                                            g = g.split(" ");
                                            d = 0;
                                            for (c = g.length; d < c; d++) g[d] = r.intDelimArray(g[d], ",");
                                            return g
                                        }
                else return r.floatDelimArray(g, ",");
                else return r.floatDelimArray(g, " ");
                else return r.intDelimArray(g, ",");
                else return r.intDelimArray(g, " ");
                else return parseInt(g, 10);
                c = parseFloat(g);
                return !isNaN(c) ? /[^0-9\-\+]+/g.test(g) ? c : parseInt(g, 10) : d
            },
            xml2json: function(d) {
                var g = {},
                    c = [],
                    a, b, f, e, q;
                d.jsonParent = g;
                for (c.push(d); c.length;) {
                    b = c.pop();
                    var n =
                        null;
                    f = b.jsonParent;
                    d = 0;
                    for (a = b.childNodes.length; d < a; d++) e = b.childNodes[d], q = e.tagName, q !== w && (n = n || {}, n[q] = n[q] || 0, n[q]++);
                    d = 0;
                    for (a = b.childNodes.length; d < a; d++) {
                        e = b.childNodes[d];
                        q = e.tagName;
                        var s = r.isTextNode(e);
                        1 === e.nodeType && (1 < n[q] ? (f[q] = f[q] || [], s ? f[q].push(r.parseNumeric(r.collectTextNode(e))) : (f[q].push({}), e.jsonParent = f[q][f[q].length - 1])) : s ? f[q] = r.parseNumeric(r.collectTextNode(e)) : (f[q] = f[q] || {}, e.jsonParent = f[q]), s || c.push(e))
                    }
                }
                return g
            }
        };
    return {
        util: r,
        get: r.get,
        clearCache: r.clearCache
    }
});
"undefined" === typeof Iuppiter && (Iuppiter = {
    version: "3026 $".replace(" $", "")
});
Iuppiter.toByteArray = function(m) {
    var w = [],
        t, h;
    for (t = 0; t < m.length; t++) h = m.charCodeAt(t), 127 >= h ? w.push(h) : (2047 >= h ? w.push(h >> 6 | 192) : (65535 >= h ? w.push(h >> 12 | 224) : (w.push(h >> 18 | 240), w.push(h >> 12 & 63 | 128)), w.push(h >> 6 & 63 | 128)), w.push(h & 63 | 128));
    return w
};
Iuppiter.Base64 = {
    CA: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    CAS: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    IA: Array(256),
    IAS: Array(256),
    init: function() {
        var m;
        for (m = 0; 256 > m; m++) Iuppiter.Base64.IA[m] = -1, Iuppiter.Base64.IAS[m] = -1;
        m = 0;
        for (iS = Iuppiter.Base64.CA.length; m < iS; m++) Iuppiter.Base64.IA[Iuppiter.Base64.CA.charCodeAt(m)] = m, Iuppiter.Base64.IAS[Iuppiter.Base64.CAS.charCodeAt(m)] = m;
        Iuppiter.Base64.IA["="] = Iuppiter.Base64.IAS["="] = 0
    },
    encode: function(m,
        w) {
        var t, h, o, r, d, g, c, a, b;
        t = w ? Iuppiter.Base64.CAS : Iuppiter.Base64.CA;
        o = m.constructor == Array ? m : Iuppiter.toByteArray(m);
        r = o.length;
        d = 3 * (r / 3);
        g = (r - 1) / 3 + 1 << 2;
        h = Array(g);
        for (a = c = 0; c < d;) b = (o[c++] & 255) << 16 | (o[c++] & 255) << 8 | o[c++] & 255, h[a++] = t.charAt(b >> 18 & 63), h[a++] = t.charAt(b >> 12 & 63), h[a++] = t.charAt(b >> 6 & 63), h[a++] = t.charAt(b & 63);
        c = r - d;
        0 < c && (b = (o[d] & 255) << 10 | (2 == c ? (o[r - 1] & 255) << 2 : 0), h[g - 4] = t.charAt(b >> 12), h[g - 3] = t.charAt(b >> 6 & 63), h[g - 2] = 2 == c ? t.charAt(b & 63) : "=", h[g - 1] = "=");
        return h.join("")
    },
    decode: function(m,
        w) {
        var t, h, o, r, d, g, c, a, b, f, e, q;
        t = w ? Iuppiter.Base64.IAS : Iuppiter.Base64.IA;
        m.constructor == Array ? (o = m, d = !0) : (o = Iuppiter.toByteArray(m), d = !1);
        r = o.length;
        g = 0;
        for (c = r - 1; g < c && 0 > t[o[g]];) g++;
        for (; 0 < c && 0 > t[o[c]];) c--;
        a = "=" == o[c] ? "=" == o[c - 1] ? 2 : 1 : 0;
        h = c - g + 1;
        b = 76 < r ? ("\r" == o[76] ? h / 78 : 0) << 1 : 0;
        r = (6 * (h - b) >> 3) - a;
        h = Array(r);
        e = f = 0;
        for (eLen = 3 * (r / 3); f < eLen;) q = t[o[g++]] << 18 | t[o[g++]] << 12 | t[o[g++]] << 6 | t[o[g++]], h[f++] = q >> 16 & 255, h[f++] = q >> 8 & 255, h[f++] = q & 255, 0 < b && 19 == ++e && (g += 2, e = 0);
        if (f < r) {
            for (b = q = 0; g <= c - a; b++) q |= t[o[g++]] <<
                18 - 6 * b;
            for (t = 16; f < r; t -= 8) h[f++] = q >> t & 255
        }
        if (d) return h;
        for (q = 0; q < h.length; q++) h[q] = String.fromCharCode(h[q]);
        return h.join("")
    }
};
Iuppiter.Base64.init();
(function() {
    Iuppiter.compress = function(m) {
        var w = [],
            t, h = 0,
            o = 0,
            r, d, g = 128,
            c, a, b = Array(256);
        for (t = 0; 256 > t; t++) b[t] = 3435973836;
        m = m.constructor == Array ? m : Iuppiter.toByteArray(m);
        for (t = m.length; h < t;) {
            if (256 == (g <<= 1)) {
                if (o >= t - 1 - 16) {
                    c = t;
                    for (o = h = 0; c; c--) w[o++] = m[h++];
                    break
                }
                g = 1;
                d = o;
                w[o++] = 0
            }
            if (h > t - 66) w[o++] = m[h++];
            else if (r = (m[h] + 13 ^ m[h + 1] - 13 ^ m[h + 2]) & 255, a = h - b[r] & 1023, b[r] = h, r = h - a, 0 <= r && r != h && m[h] == m[r] && m[h + 1] == m[r + 1] && m[h + 2] == m[r + 2]) {
                w[d] |= g;
                for (c = 3; 66 > c && m[h + c] == m[r + c]; c++);
                w[o++] = c - 3 << 2 | a >> 8;
                w[o++] = a;
                h +=
                    c
            } else w[o++] = m[h++]
        }
        return w
    };
    Iuppiter.decompress = function(m, w) {
        var t, h = [],
            o, r = 0,
            d = 0,
            g, c, a = 128,
            b;
        t = m.constructor == Array ? m : Iuppiter.toByteArray(m);
        for (o = t.length; r < o;) {
            if (256 == (a <<= 1)) a = 1, c = t[r++];
            if (c & a)
                if (b = (t[r] >> 2) + 3, g = (t[r] << 8 | t[r + 1]) & 1023, r += 2, 0 <= (g = d - g))
                    for (; 0 <= --b;) h[d++] = h[g++];
                else break;
            else h[d++] = t[r++]
        }
        if (!("undefined" == typeof w ? 0 : w)) {
            for (t = 0; t < d; t++) h[t] = String.fromCharCode(h[t]);
            h = h.join("")
        }
        return h
    }
})();
CubicVR.RegisterModule("Shader", function(m) {
    function w(f, e) {
        var b = m.util,
            n, s, g, x, u = o.gl;
        this.uniforms = [];
        this.uniform_type = [];
        this.uniform_typelist = [];
        this.success = !0;
        this.fragmentLog = this.vertexLog = ""; - 1 !== f.indexOf("\n") ? (g = f, n = c(o.gl, f, "x-shader/x-vertex")) : (n = a(o.gl, f), null === n && (g = b.getURL(f), n = c(o.gl, g, "x-shader/x-vertex")));
        u.getShaderParameter(n, u.COMPILE_STATUS) || (this.vertexLog = u.getShaderInfoLog(n), this.success = !1); - 1 !== e.indexOf("\n") ? (x = e, s = c(o.gl, e, "x-shader/x-fragment")) : (s = a(o.gl,
            e), null === s && (x = b.getURL(e), s = c(o.gl, x, "x-shader/x-fragment")));
        u.getShaderParameter(s, u.COMPILE_STATUS) || (this.fragmentLog = u.getShaderInfoLog(s), this.success = !1);
        this.success ? (this.shader = u.createProgram(), u.attachShader(this.shader, n), u.attachShader(this.shader, s), u.linkProgram(this.shader), o.gl.getProgramParameter(this.shader, u.LINK_STATUS) || (d("Error linking shader:\n" + u.getProgramInfoLog(this.shader)), this.success = !1)) : (n = b.multiSplit(this.vertexLog, ";\n"), b = b.multiSplit(this.fragmentLog, ";\n"),
            n.length && this.dumpErrors(n, g), b.length && this.dumpErrors(b, x))
    }

    function t(a) {
        this._update = a.update || null;
        this._init = a.init || null;
        this._vertex = m.get(a.vertex) || null;
        this._fragment = m.get(a.fragment) || null;
        this._bindings = [];
        this._shaderVars = this._shaderInfo = this._shader = null;
        this._initialized = !1;
        a = (this._vertex || "") + (this._fragment || "");
        this._hasDepthPack = "" !== a.trim() ? /\s\!?LIGHT_DEPTH_PASS\s/.test(a) : !1
    }
    var h = m.undef,
        o = m.GLCore,
        r = m.enums,
        d = m.log,
        g = m.util;
    r.shader = {
        map: {
            COLOR: 1,
            SPECULAR: 2,
            NORMAL: 4,
            BUMP: 8,
            REFLECT: 16,
            ENVSPHERE: 32,
            AMBIENT: 64,
            ALPHA: 128,
            COLORMAP: 256
        },
        mode: {
            POINT_SPRITE: 512,
            POINT_SIZE: 1024,
            POINT_CIRCLE: 2048
        },
        uniform: {
            MATRIX: 0,
            VECTOR: 1,
            FLOAT: 2,
            ARRAY_VERTEX: 3,
            ARRAY_UV: 4,
            ARRAY_FLOAT: 5,
            INT: 6
        }
    };
    var c = function(a, e, b) {
            if ("x-shader/x-fragment" === b) b = a.createShader(a.FRAGMENT_SHADER);
            else if ("x-shader/x-vertex" === b) b = a.createShader(a.VERTEX_SHADER);
            else return null;
            a.shaderSource(b, e);
            a.compileShader(b);
            return b
        },
        a = function(a, e) {
            var b = document.getElementById(e);
            if (!b) return null;
            for (var n =
                    "", c = b.firstChild; c;) 3 === c.nodeType && (n += c.textContent), c = c.nextSibling;
            if ("x-shader/x-fragment" === b.type) b = a.createShader(a.FRAGMENT_SHADER);
            else if ("x-shader/x-vertex" === b.type) b = a.createShader(a.VERTEX_SHADER);
            else return null;
            a.shaderSource(b, n);
            a.compileShader(b);
            return b
        };
    w.prototype = {
        isCompiled: function() {
            return this.success
        },
        dumpErrors: function(a, e, b) {
            for (var b = (b || "Error on line") + " ", e = e.split("\n"), n = 0, c = a.length; n < c; n++) {
                var g = a[n];
                if (0 === g.indexOf("ERROR: ")) {
                    var g = g.substr(7).trim(),
                        d = g.substr(0, g.indexOf(" ")),
                        g = g.substr(d.length),
                        d = d.split(":"),
                        d = parseInt(d[1], 10);
                    console.log(d + "> " + e[d - 1]);
                    console.log(b + d + ", :" + g)
                }
            }
        },
        bindSelf: function(a) {
            var e, b, n; - 1 !== a.indexOf(".") ? -1 !== a.indexOf("[") ? (e = a.split("["), n = e[0], e = e[1].split("]"), b = e[0], e = e[1].split("."), e = e[1], this[n] === h && (this[n] = []), this[n][b] === h && (this[n][b] = {}), this[n][b][e] = this.uniforms[a]) : (e = a.split("."), n = e[0], e = e[1], this[n] === h && (this[n] = {}), this[n][e] = this.uniforms[a]) : -1 !== a.indexOf("[") ? (e = a.split("["), n = e[0],
                e = e[1].split("]"), b = e[0], this[n] === h && (this[n] = []), this[n][b] = this.uniforms[a]) : this[a] = this.uniforms[a]
        },
        addMatrix: function(a, e) {
            this.use();
            this.uniforms[a] = o.gl.getUniformLocation(this.shader, a);
            this.uniform_type[a] = r.shader.uniform.MATRIX;
            this.uniform_typelist.push([this.uniforms[a], this.uniform_type[a]]);
            e !== h && this.setMatrix(a, e);
            this.bindSelf(a);
            return this.uniforms[a]
        },
        addVector: function(a, e) {
            this.use();
            this.uniforms[a] = o.gl.getUniformLocation(this.shader, a);
            this.uniform_type[a] = r.shader.uniform.VECTOR;
            this.uniform_typelist.push([this.uniforms[a], this.uniform_type[a]]);
            e !== h && this.setVector(a, e);
            this.bindSelf(a);
            return this.uniforms[a]
        },
        addFloat: function(a, e) {
            this.use();
            this.uniforms[a] = o.gl.getUniformLocation(this.shader, a);
            this.uniform_type[a] = r.shader.uniform.FLOAT;
            this.uniform_typelist.push([this.uniforms[a], this.uniform_type[a]]);
            e !== h && this.setFloat(a, e);
            this.bindSelf(a);
            return this.uniforms[a]
        },
        addVertexArray: function(a) {
            this.use();
            this.uniforms[a] = o.gl.getAttribLocation(this.shader, a);
            this.uniform_type[a] =
                r.shader.uniform.ARRAY_VERTEX;
            this.uniform_typelist.push([this.uniforms[a], this.uniform_type[a]]);
            this.bindSelf(a);
            return this.uniforms[a]
        },
        addUVArray: function(a) {
            this.use();
            this.uniforms[a] = o.gl.getAttribLocation(this.shader, a);
            this.uniform_type[a] = r.shader.uniform.ARRAY_UV;
            this.uniform_typelist.push([this.uniforms[a], this.uniform_type[a]]);
            this.bindSelf(a);
            return this.uniforms[a]
        },
        addFloatArray: function(a) {
            this.use();
            this.uniforms[a] = o.gl.getAttribLocation(this.shader, a);
            this.uniform_type[a] = r.shader.uniform.ARRAY_FLOAT;
            this.uniform_typelist.push([this.uniforms[a], this.uniform_type[a]]);
            this.bindSelf(a);
            return this.uniforms[a]
        },
        addInt: function(a, e) {
            this.use();
            this.uniforms[a] = o.gl.getUniformLocation(this.shader, a);
            this.uniform_type[a] = r.shader.uniform.INT;
            this.uniform_typelist.push([this.uniforms[a], this.uniform_type[a]]);
            e !== h && this.setInt(a, e);
            this.bindSelf(a);
            return this.uniforms[a]
        },
        use: function() {
            o.gl.useProgram(this.shader)
        },
        setMatrix: function(a, e) {
            var b = this.uniforms[a];
            if (null !== b) {
                var n = e.length;
                16 === n ?
                    o.gl.uniformMatrix4fv(b, !1, e) : 9 === n ? o.gl.uniformMatrix3fv(b, !1, e) : 4 === n && o.gl.uniformMatrix2fv(b, !1, e)
            }
        },
        setInt: function(a, e) {
            var b = this.uniforms[a];
            null !== b && o.gl.uniform1i(b, e)
        },
        setFloat: function(a, e) {
            var b = this.uniforms[a];
            null !== b && o.gl.uniform1f(b, e)
        },
        setVector: function(a, e) {
            var b = this.uniforms[a];
            if (null !== b) {
                var n = e.length;
                4 == n ? o.gl.uniform4fv(b, e) : 3 == n ? o.gl.uniform3fv(b, e) : 2 == n ? o.gl.uniform2fv(b, e) : o.gl.uniform4fv(b, e)
            }
        },
        clearArray: function(a) {
            var e = o.gl,
                a = this.uniforms[a];
            null !== a && e.disableVertexAttribArray(a)
        },
        bindArray: function(a, e) {
            var b = o.gl,
                n = this.uniforms[a];
            if (null !== n) {
                var c = this.uniform_type[a];
                c === r.shader.uniform.ARRAY_VERTEX ? (b.bindBuffer(b.ARRAY_BUFFER, e), b.vertexAttribPointer(n, 3, b.FLOAT, !1, 0, 0), b.enableVertexAttribArray(n)) : c === r.shader.uniform.ARRAY_UV ? (b.bindBuffer(b.ARRAY_BUFFER, e), b.vertexAttribPointer(n, 2, b.FLOAT, !1, 0, 0)) : c === r.shader.uniform.ARRAY_FLOAT && (b.bindBuffer(b.ARRAY_BUFFER, e), b.vertexAttribPointer(n, 1, b.FLOAT, !1, 0, 0))
            }
        }
    };
    var b = {
        tidyScript: function(a) {
            return a.replace(/\t+/g,
                " ").replace(/\/\/.*$/gm, "").replace(/\/\*(.|\n)*\*\//g, "").replace(/ +/g, " ").replace(/ *\[ */g, "[").replace(/ *\] */g, "]").replace(/ *; */g, ";").replace(/ *$/gm, "").replace(/^ */gm, "")
        },
        getDefines: function(a) {
            var e = {},
                a = g.multiSplit(a, "\n;");
            i = 0;
            for (iMax = a.length; i < iMax; i++) {
                var b = a[i];
                0 === b.indexOf("#define") && (b = b.split(" "), 2 < b.length && (e[b[1]] = b.slice(2).join(" ")))
            }
            return e
        },
        replaceAll: function(a, e, b, n) {
            var b = b || "",
                n = n || "",
                c;
            for (c in e)
                if (e.hasOwnProperty(c))
                    for (var g = b + c + n; - 1 !== a.indexOf(g);) a =
                        a.replace(g, b + e[c] + n);
            return a
        },
        getShaderInfo: function(a, e) {
            var c, n, s, d, x, u, o = ["uniform", "attribute", "varying"],
                m = [],
                r = {};
            u = {};
            var t;
            e === h && (e = "");
            a = b.tidyScript(a);
            e = b.tidyScript(e);
            r.v_define = b.getDefines(a);
            r.f_define = b.getDefines(e);
            a = b.replaceAll(a, r.v_define, "[", "]");
            e = b.replaceAll(e, r.f_define, "[", "]");
            t = g.multiSplit(a + "\n" + e, "\n;");
            var v = [];
            d = s = -1;
            c = 0;
            for (n = t.length; c < n; c++) x = t[c], -1 === s && 0 === x.indexOf("struct") ? s = c : -1 === d && (-1 !== s && -1 !== x.indexOf("}")) && (d = c + 1), -1 !== s && -1 !== d && (x = t.slice(s,
                d).join("\n").replace(/(\{|\})/g, "\n").replace(/ +$/gm, "").replace(/^ +/gm, "").replace(/\n\n/gm, "\n"), v.push({
                start: s,
                end: d,
                struct: x.split("\n")
            }), d = s = -1);
            c = 0;
            for (n = v.length; c < n; c++) {
                var y = v[c].struct,
                    A = null;
                s = 0;
                for (d = y.length; s < d; s++) x = y[s].split(" "), 1 >= x.length || ("struct" == x[0] ? (A = x[1], u[A] = {}) : A && (u[A][x[1]] = x[0]))
            }
            r.struct = u;
            c = 0;
            for (n = o.length; c < n; c++) r[o[c]] = [];
            c = 0;
            for (n = t.length; c < n; c++) {
                x = t[c];
                s = 0;
                for (d = o.length; s < d; s++)
                    if (v = o[s], 0 === x.indexOf(v) && (u = x.split(" "), 3 === u.length && u[0] == v && -1 ===
                            m.indexOf(u[2])))
                        if (m.push(u[2]), -1 !== u[2].indexOf("[")) {
                            var y = u[2].split("["),
                                A = y[1].replace("]", ""),
                                C = parseInt(A, 10);
                            C === C && (A = C);
                            r[v].push({
                                name: y[0],
                                type: u[1],
                                isArray: !0,
                                len: A
                            })
                        } else r[v].push({
                            name: u[2],
                            type: u[1]
                        })
            }
            return r
        },
        genShaderVarList: function(a, e) {
            var b = a[e],
                n = [],
                c, g, d, u, h, o;
            if (!b) return [];
            c = 0;
            for (g = b.length; c < g; c++) {
                var m = b[c];
                if (a.struct[m.type]) {
                    var r = a.struct[m.type];
                    if (r && m.isArray) {
                        d = 0;
                        for (u = m.len; d < u; d++)
                            for (o in h = m.name + "[" + d + "]", r) r.hasOwnProperty(o) && n.push({
                                location: h + "." +
                                    o,
                                type: r[o],
                                basename: m.name
                            })
                    } else
                        for (o in r) n.push({
                            location: m.name + "." + o,
                            type: r[o],
                            basename: m.name
                        })
                } else if (m.isArray) {
                    d = 0;
                    for (u = m.len; d < u; d++) h = m.name + "[" + d + "]", n.push({
                        location: h,
                        type: m.type,
                        basename: m.name
                    })
                } else n.push({
                    location: m.name,
                    type: m.type,
                    basename: m.name
                })
            }
            return n
        },
        getShaderVars: function(a) {
            var e = {};
            e.uniform = b.genShaderVarList(a, "uniform");
            e.attribute = b.genShaderVarList(a, "attribute");
            return e
        }
    };
    t.prototype = {
        use: function() {
            this._initialized && this._shader.use()
        },
        getShader: function() {
            return this._shader
        },
        ready: function() {
            return this._initialized
        },
        isReady: function() {
            return this._initialized
        },
        hasDepthPack: function() {
            return this._hasDepthPack
        },
        _init_shader: function(a, e, c, n, s) {
            c = c || [];
            a = m.util.get(a);
            e = m.util.get(e);
            s = s || "#define customShader_splice";
            if (n = n === h ? this._vertex || this._fragment : n) n = a.indexOf(s), s = e.indexOf(s), -1 !== n && this._vertex && (a = a.substr(0, n) + this._vertex), -1 !== s && this._fragment && (e = e.substr(0, s) + this._fragment);
            this._shader = new m.Shader(a, e);
            this._shaderInfo = b.getShaderInfo(a, e);
            this._shaderVars =
                b.getShaderVars(this._shaderInfo);
            this._appendShaderVars(this._shaderVars, "uniform", c);
            this._appendShaderVars(this._shaderVars, "attribute", c);
            (this._initialized = this._shader.isCompiled()) && this._init && this._init(this)
        },
        _appendShaderVars: function(a, e, b) {
            for (var a = function(a, e) {
                    return function(b, f) {
                        f !== h && (u.activeTexture(u.TEXTURE0 + b), u.bindTexture(o.gl.TEXTURE_2D, m.Textures[f.tex_id]));
                        e.value = b;
                        a.update(e)
                    }
                }, n = 0, c = this._shaderVars[e].length; n < c; n++) {
                var d = this._shaderVars[e][n],
                    g = d.location;
                if (-1 ===
                    b.indexOf(d.basename) && (d = d.type, "vec3" === d ? "attribute" === e ? this._shader.addVertexArray(g) : this._shader.addVector(g) : "vec2" === d ? "attribute" === e ? this._shader.addUVArray(g) : this._shader.addVector(g) : "vec4" === d ? "attribute" !== e && this._shader.addVector(g) : "float" === d ? "attribute" === e ? this._shader.addFloatArray(g) : this._shader.addFloat(g) : "sampler2D" === d || "int" === d ? this._shader.addInt(g) : ("mat4" === d || "mat3" === d || "mat2" === d) && this._shader.addMatrix(g), g = this._bindSelf(g), "sampler2D" == d && g)) {
                    var u = o.gl;
                    g.set =
                        a(this, g)
                }
            }
        },
        _bindSelf: function(a) {
            var e, b, n, c;
            if (null !== this._shader.uniforms[a]) {
                var d = function(a, e) {
                    return function(b) {
                        e.value = b;
                        a.update(e)
                    }
                }; - 1 !== a.indexOf(".") ? -1 !== a.indexOf("[") ? (e = a.split("["), n = e[0], e = e[1].split("]"), b = e[0], e = e[1].split("."), e = e[1], this[n] === h && (this[n] = []), this[n][b] === h && (this[n][b] = {}), c = {
                    location: this._shader.uniforms[a],
                    value: null,
                    type: this._shader.uniform_type[a]
                }, this[n][b][e] = c) : (e = a.split("."), n = e[0], e = e[1], this[n] === h && (this[n] = {}), c = {
                    location: this._shader.uniforms[a],
                    value: null,
                    type: this._shader.uniform_type[a]
                }, this[n][e] = c) : -1 !== a.indexOf("[") ? (e = a.split("["), n = e[0], e = e[1].split("]"), b = e[0], this[n] === h && (this[n] = []), c = {
                    location: this._shader.uniforms[a],
                    value: null,
                    type: this._shader.uniform_type[a]
                }, this[n][b] = c) : (c = {
                    location: this._shader.uniforms[a],
                    value: null,
                    type: this._shader.uniform_type[a]
                }, this[a] = c);
                this._bindings.push(c);
                c && (c.set = d(this, c));
                return c
            }
        },
        _doUpdate: function(a) {
            if (this._initialized)
                if (this._update) this._update(this, a);
                else
                    for (var e = 0, b = this._bindings.length; e <
                        b; e++) this.update(this._bindings[e], a)
        },
        update: function(a) {
            if (this._initialized) {
                var e = o.gl,
                    b = a.value,
                    n = a.location;
                null !== n && (a.type === r.shader.uniform.MATRIX ? (a = b.length, 16 === a ? e.uniformMatrix4fv(n, !1, b) : 9 === a ? e.uniformMatrix3fv(n, !1, b) : 4 === a && e.uniformMatrix2fv(n, !1, b)) : a.type === r.shader.uniform.INT ? e.uniform1i(n, b) : a.type === r.shader.uniform.VECTOR ? (a = b.length, 4 === a && e.uniform4fv(n, b), 3 === a ? e.uniform3fv(n, b) : 2 === a ? e.uniform2fv(n, b) : e.uniform4fv(n, b)) : a.type === r.shader.uniform.FLOAT ? e.uniform1f(n,
                    b) : a.type === r.shader.uniform.ARRAY_VERTEX ? (e.bindBuffer(e.ARRAY_BUFFER, b), e.vertexAttribPointer(n, 3, e.FLOAT, !1, 0, 0), e.enableVertexAttribArray(n)) : a.type === r.shader.uniform.ARRAY_UV ? (e.bindBuffer(e.ARRAY_BUFFER, b), e.vertexAttribPointer(n, 2, e.FLOAT, !1, 0, 0), e.enableVertexAttribArray(n)) : a.type === r.shader.uniform.ARRAY_FLOAT && (e.bindBuffer(e.ARRAY_BUFFER, b), e.vertexAttribPointer(n, 1, e.FLOAT, !1, 0, 0), e.enableVertexAttribArray(n)))
            }
        }
    };
    return {
        Shader: w,
        shader_util: b,
        CustomShader: t
    }
});
CubicVR.RegisterModule("MainLoop", function(m) {
    function w() {
        this.paused_state = this.offset = this.paused_time = this.last_update = this.end_time = this.start_time = this.system_milliseconds = this.time_elapsed = 0
    }

    function t() {
        null !== m.GLCore.mainloop && (window.requestAnimationFrame && window.requestAnimationFrame(t), m.GLCore.mainloop.interval())
    }

    function h(c, a, b) {
        window.requestAnimationFrame === r && (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame || null);
        null !== m.GLCore.mainloop && (!window.requestAnimationFrame && m.GLCore.mainloop && clearInterval(m.GLCore.mainloop.interval), m.GLCore.mainloop = null);
        if (null === c) m.GLCore.mainloop = null;
        else {
            if (!(this instanceof h)) return new h(c, a, b);
            this.renderList = [];
            var f = this.renderStack = [{
                    scenes: [],
                    update: function() {},
                    start: function() {},
                    stop: function() {}
                }],
                e = new w;
            e.start();
            this.timer = e;
            this.func = c;
            this.doclear = a !== r ? a : !0;
            m.GLCore.mainloop = this;
            g.resizeList.length && !m.GLCore.resize_active &&
                (window.addEventListener("resize", function() {
                    m.GLCore.onResize()
                }, !1), m.GLCore.resize_active = !0);
            a = function() {
                return function() {
                    var a = m.GLCore.gl;
                    e.update();
                    m.GLCore.mainloop.doclear && a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT);
                    c(e, m.GLCore.gl);
                    var b = f[f.length - 1],
                        d = b.scenes;
                    b.update && b.update(e, a);
                    if (d) {
                        a = 0;
                        for (b = d.length; a < b; ++a) {
                            var g = d[a];
                            if (!g.paused) {
                                g.update && g.update(e, m.GLCore.gl);
                                g.render()
                            }
                        }
                    }
                }
            }();
            b ? this.loopFunc = a : window.requestAnimationFrame ? (this.interval = a, window.requestAnimationFrame(t)) :
                this.interval = setInterval(a, 20)
        }
    }

    function o(c, a, b) {
        this.canvas = c;
        this.camera = a;
        this.mpos = [0, 0];
        this.mdown = !1;
        var f = this;
        this.mEvents = {};
        this.keyState = [];
        for (var e in d.keyboard) this.keyState[e] = !1;
        this.onMouseDown = function() {
            return function(a) {
                f.mdown = !0;
                f.mpos = [a.pageX - a.target.offsetLeft, a.pageY - a.target.offsetTop];
                f.mEvents.mouseDown && f.mEvents.mouseDown(f, f.mpos, f.keyState)
            }
        }();
        this.onMouseUp = function() {
            return function(a) {
                f.mdown = !1;
                f.mpos = [a.pageX - a.target.offsetLeft, a.pageY - a.target.offsetTop];
                f.mEvents.mouseUp && f.mEvents.mouseUp(f, f.mpos, f.keyState)
            }
        }();
        this.onMouseMove = function() {
            return function(a) {
                var e = [],
                    a = [a.pageX - a.target.offsetLeft, a.pageY - a.target.offsetTop];
                e[0] = a[0] - f.mpos[0];
                e[1] = a[1] - f.mpos[1];
                f.mpos = a;
                f.mEvents.mouseMove && f.mEvents.mouseMove(f, f.mpos, e, f.keyState)
            }
        }();
        this.onMouseWheel = function() {
            return function(a) {
                a = a.wheelDelta ? a.wheelDelta : 100 * -a.detail;
                f.mEvents.mouseWheel && f.mEvents.mouseWheel(f, f.mpos, a, f.keyState)
            }
        }();
        this.onKeyDown = function() {
            return function(a) {
                var a =
                    a.keyCode,
                    e = null;
                f.mEvents.keyPress ? (e = f.mEvents.keyPress(f, f.mpos, a, f.keyState), f.keyState[a] = e !== r ? !!e : !0) : f.keyState[a] = !0;
                f.keyState[a] && f.mEvents.keyDown && (e = f.mEvents.keyDown(f, f.mpos, a, f.keyState), f.keyState[a] = e !== r ? !!e : !0)
            }
        }();
        this.onKeyUp = function() {
            return function(a) {
                a = a.keyCode;
                f.mEvents.keyUp && f.mEvents.keyUp(f, f.mpos, a, f.keyState);
                f.keyState[a] = !1
            }
        }();
        this.eventDefaults = {
            mouseMove: function(a, e, b) {
                a.mdown && a.orbitView(b)
            },
            mouseWheel: function(a, e, b) {
                a.zoomView(b)
            },
            mouseDown: null,
            mouseUp: null,
            keyDown: null,
            keyUp: null,
            keyPress: null
        };
        !1 !== b && this.setEvents(b === r ? this.eventDefaults : b);
        this.bind()
    }
    var r = m.undef,
        d = m.enums,
        g = m.GLCore;
    d.keyboard = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAUSE: 19,
        CAPS_LOCK: 20,
        ESCAPE: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        INSERT: 45,
        DELETE: 46,
        KEY_0: 48,
        KEY_1: 49,
        KEY_2: 50,
        KEY_3: 51,
        KEY_4: 52,
        KEY_5: 53,
        KEY_6: 54,
        KEY_7: 55,
        KEY_8: 56,
        KEY_9: 57,
        KEY_A: 65,
        KEY_B: 66,
        KEY_C: 67,
        KEY_D: 68,
        KEY_E: 69,
        KEY_F: 70,
        KEY_G: 71,
        KEY_H: 72,
        KEY_I: 73,
        KEY_J: 74,
        KEY_K: 75,
        KEY_L: 76,
        KEY_M: 77,
        KEY_N: 78,
        KEY_O: 79,
        KEY_P: 80,
        KEY_Q: 81,
        KEY_R: 82,
        KEY_S: 83,
        KEY_T: 84,
        KEY_U: 85,
        KEY_V: 86,
        KEY_W: 87,
        KEY_X: 88,
        KEY_Y: 89,
        KEY_Z: 90,
        LEFT_META: 91,
        RIGHT_META: 92,
        SELECT: 93,
        NUMPAD_0: 96,
        NUMPAD_1: 97,
        NUMPAD_2: 98,
        NUMPAD_3: 99,
        NUMPAD_4: 100,
        NUMPAD_5: 101,
        NUMPAD_6: 102,
        NUMPAD_7: 103,
        NUMPAD_8: 104,
        NUMPAD_9: 105,
        MULTIPLY: 106,
        ADD: 107,
        SUBTRACT: 109,
        DECIMAL: 110,
        DIVIDE: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NUM_LOCK: 144,
        SCROLL_LOCK: 145,
        SEMICOLON: 186,
        EQUALS: 187,
        COMMA: 188,
        DASH: 189,
        PERIOD: 190,
        FORWARD_SLASH: 191,
        GRAVE_ACCENT: 192,
        OPEN_BRACKET: 219,
        BACK_SLASH: 220,
        CLOSE_BRACKET: 221,
        SINGLE_QUOTE: 222
    };
    w.prototype = {
        start: function() {
            this.update();
            this.num_updates = 0;
            this.last_update = this.start_time = this.system_milliseconds;
            this.lock_state = this.paused_state = !1;
            this.offset = this.paused_time = this.lock_rate = 0
        },
        stop: function() {
            this.end_time = this.system_milliseconds
        },
        reset: function() {
            this.start()
        },
        lockFramerate: function(c) {
            this.lock_rate = 1 / c;
            this.lock_state = !0
        },
        unlock: function() {
            var c = this.system_milliseconds;
            this.lock_state = !1;
            this.update();
            this.last_update = this.system_milliseconds - this.lock_rate;
            this.offset += c - this.system_milliseconds;
            this.lock_rate = 0
        },
        locked: function() {
            return this.lock_state
        },
        update: function() {
            this.num_updates++;
            this.last_update = this.system_milliseconds;
            this.system_milliseconds = this.lock_state ? this.system_milliseconds + (1E3 * this.lock_rate | 0) : Date.now();
            this.paused_state && (this.paused_time += this.system_milliseconds - this.last_update);
            this.time_elapsed = this.system_milliseconds - this.start_time - this.paused_time + this.offset
        },
        getMilliseconds: function() {
            return this.time_elapsed
        },
        getSeconds: function() {
            return this.getMilliseconds() / 1E3
        },
        setMilliseconds: function(c) {
            this.offset -= this.system_milliseconds - this.start_time - this.paused_time + this.offset - c
        },
        setSeconds: function(c) {
            this.setMilliseconds(1E3 * c | 0)
        },
        getLastUpdateSeconds: function() {
            return this.getLastUpdateMilliseconds() / 1E3
        },
        getLastUpdateMilliseconds: function() {
            return this.system_milliseconds -
                this.last_update
        },
        getTotalMilliseconds: function() {
            return this.system_milliseconds - this.start_time
        },
        getTotalSeconds: function() {
            return this.getTotalMilliseconds() / 1E3
        },
        getNumUpdates: function() {
            return this.num_updates
        },
        setPaused: function(c) {
            this.paused_state = c
        },
        getPaused: function() {
            return this.paused_state
        }
    };
    h.prototype = {
        setPaused: function(c) {
            this.timer.setPaused(c)
        },
        getPaused: function() {
            return this.timer.getPaused()
        },
        setTimerSeconds: function(c) {
            this.timer.setSeconds(c)
        },
        getTimerSeconds: function() {
            return this.timer.getSeconds()
        },
        resetTimer: function() {
            this.timer.reset()
        },
        addScene: function(c) {
            this.renderStack[this.renderStack.length - 1].scenes.push(c);
            return c
        },
        pushSceneGroup: function(c) {
            c.scenes = c.scenes || [];
            this.renderStack.push(c);
            for (var a = 0; a < c.scenes.length; ++a) c.scenes[a].enable();
            c.start && c.start()
        },
        popSceneGroup: function() {
            for (var c = this.renderStack[this.renderStack.length - 1], a = 0; a < c.scenes.length; ++a) c.scenes[a].disable();
            1 < this.renderStack.length && this.renderStack.pop();
            c.stop && c.stop()
        },
        getScene: function(c) {
            for (var a =
                    renderStack[renderStack.length - 1], b, f = 0, e = a.scenes.length; f < e; ++f)
                if (a.scenes[f].scene.name === c) {
                    b = a.scenes[f];
                    break
                }
            return b
        },
        resumeScene: function(c) {
            "string" === typeof c && (c = this.getScene(c));
            c.enable();
            c.paused = !1
        },
        pauseScene: function(c) {
            "string" === typeof c && (c = this.getScene(c));
            c.paused = !0;
            c.disable()
        },
        removeScene: function(c) {
            var a = renderStack[renderStack.length - 1];
            "string" === typeof c && (c = this.getScene(c));
            var b = a.scenes.indexOf(c); - 1 < b && a.scenes.splice(b, 1);
            return c
        },
        runOnce: function() {
            this.loopFunc()
        }
    };
    o.prototype = {
        isKeyPressed: function(c) {
            return this.keyState[c]
        },
        getKeyState: function(c) {
            return c !== r ? this.keyState[c] : this.keyState
        },
        setEvents: function(c) {
            this.mEvents = {};
            for (var a in c) this.bindEvent(a, c[a])
        },
        orbitView: function(c) {
            var a = m.vec3,
                b = a.subtract(this.camera.target, this.camera.position),
                b = a.length(b);
            this.camera.position = a.moveViewRelative(this.camera.position, this.camera.target, -b * c[0] / 300, 0);
            this.camera.position[1] += b * c[1] / 300;
            this.camera.position = a.add(this.camera.target, a.multiply(a.normalize(a.subtract(this.camera.position,
                this.camera.target)), b))
        },
        panView: function(c, a) {
            var b = m.vec3;
            a || (a = !1);
            var f = b.subtract(this.camera.target, this.camera.position),
                f = b.length(f),
                e = this.camera.position;
            a ? this.camera.position = b.moveViewRelative(this.camera.position, this.camera.target, -f * c[0] / 300, -f * c[1] / 300) : (this.camera.position = b.moveViewRelative(this.camera.position, this.camera.target, -f * c[0] / 300, 0), this.camera.position[1] += f * c[1] / 300);
            f = b.subtract(this.camera.position, e);
            this.camera.target = b.add(this.camera.target, f)
        },
        zoomView: function(c,
            a, b) {
            var f = m.vec3,
                e = f.subtract(this.camera.target, this.camera.position),
                e = f.length(e),
                e = e - c / 1E3;
            a || (a = 0.1);
            b || (b = 1E3);
            e < a && (e = a);
            e > b && (e = b);
            this.camera.position = f.add(this.camera.target, f.multiply(f.normalize(f.subtract(this.camera.position, this.camera.target)), e))
        },
        bindEvent: function(c, a) {
            this.mEvents[c] = a === r ? this.eventDefaults[c] : a
        },
        unbindEvent: function(c) {
            this.bindEvent(c, null)
        },
        bind: function() {
            this.canvas.addEventListener("mousemove", this.onMouseMove, !1);
            this.canvas.addEventListener("mousedown",
                this.onMouseDown, !1);
            this.canvas.addEventListener("mouseup", this.onMouseUp, !1);
            this.canvas.addEventListener("mousewheel", this.onMouseWheel, !1);
            this.canvas.addEventListener("DOMMouseScroll", this.onMouseWheel, !1);
            window.addEventListener("keydown", this.onKeyDown, !1);
            window.addEventListener("keyup", this.onKeyUp, !1)
        },
        unbind: function() {
            this.canvas.removeEventListener("mousemove", this.onMouseMove, !1);
            this.canvas.removeEventListener("mousedown", this.onMouseDown, !1);
            this.canvas.removeEventListener("mouseup",
                this.onMouseUp, !1);
            this.canvas.removeEventListener("mousewheel", this.onMouseWheel, !1);
            this.canvas.removeEventListener("DOMMouseScroll", this.onMouseWheel, !1);
            window.removeEventListener("keydown", this.onKeyDown, !1);
            window.removeEventListener("keyup", this.onKeyUp, !1)
        },
        setCamera: function(c) {
            this.camera = c
        },
        getMousePosition: function() {
            return this.mpos
        }
    };
    return {
        Timer: w,
        MainLoop: h,
        MouseViewController: o,
        setMainLoop: function(c) {
            m.GLCore.mainloop = c
        },
        keyboard: d.keyboard
    }
});
CubicVR.RegisterModule("Texture", function(m) {
    function w(a, e) {
        if (1 === a || 1 === e) return !1;
        if (1 !== a)
            for (; 0 === a % 2;) a /= 2;
        if (1 !== e)
            for (; 0 === e % 2;) e /= 2;
        return 1 < a || 1 < e ? !1 : !0
    }

    function t(e) {
        var b = m.GLCore.gl;
        if ("CANVAS" === e.nodeName || "IMG" === e.nodeName || "VIDEO" === e.nodeName) this.canvasSource = e;
        else {
            this.canvasSource = document.createElement("CANVAS");
            if (void 0 === e.width || void 0 === e.height) throw Error("Width and height must be specified for generating a new CanvasTexture.");
            this.canvasSource.width = e.width;
            this.canvasSource.height =
                e.height;
            this.canvasContext = this.canvasSource.getContext("2d")
        }
        this.updateFunction = e.update;
        this.texture = new m.Texture;
        this.setFilter = this.texture.setFilter;
        this.clear = this.texture.clear;
        this.use = this.texture.use;
        this.tex_id = this.texture.tex_id;
        this.filterType = this.texture.filterType;
        var c = this.canvasSource;
        (!c.height || !c.width) && f("Warning - CanvasTexture input has no initial width and height, edges clamped.");
        !c.height || !c.width || !w(c.width, c.height) ? (this.setFilter(a.texture.filter.LINEAR), b.texParameteri(b.TEXTURE_2D,
            b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE)) : (this.setFilter(a.texture.filter.LINEAR_MIP), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.REPEAT), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_T, b.REPEAT));
        "IMG" === e.nodeName && this.update()
    }

    function h(e, b) {
        if (!e) throw "PDF Texture Error: page is null.";
        var f = this,
            c = m.GLCore.gl,
            d = this.canvasSource = document.createElement("canvas"),
            g;
        d.mozOpaque = !0;
        d.width = b.width;
        d.height = b.height;
        g = this.canvasContext =
            d.getContext("2d");
        g.save();
        g.fillStyle = "rgb(255, 255, 255)";
        g.fillRect(0, 0, d.width, d.height);
        g.restore();
        var q = b.viewport || e.getViewport(1);
        q.width = d.width;
        q.height = d.height;
        e.render({
            canvasContext: g,
            viewport: q,
            continueCallback: function(a) {
                a()
            }
        }).then(function() {
            f.update()
        });
        this.texture = new m.Texture;
        this.updateFunction = b.update || function() {};
        this.setFilter = this.texture.setFilter;
        this.clear = this.texture.clear;
        this.use = this.texture.use;
        this.tex_id = this.texture.tex_id;
        this.filterType = this.texture.filterType;
        w(d.width, d.height) ? (this.setFilter(a.texture.filter.LINEAR_MIP), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.REPEAT), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.REPEAT)) : (this.setFilter(a.texture.filter.LINEAR), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE))
    }

    function o(e, b, f) {
        var c = m.GLCore.gl;
        this.texture = new m.Texture;
        this.canvas = document.createElement("CANVAS");
        this.canvas.width = b;
        this.canvas.height = f;
        this.pjs =
            new Processing(this.canvas, m.util.getURL(e));
        this.pjs.noLoop();
        this.pjs.redraw();
        this.setFilter = this.texture.setFilter;
        this.clear = this.texture.clear;
        this.use = this.texture.use;
        this.tex_id = this.texture.tex_id;
        this.filterType = this.texture.filterType;
        w(this.canvas.width, this.canvas.height) ? this.setFilter(a.texture.filter.LINEAR_MIP) : (this.setFilter(a.texture.filter.LINEAR), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE))
    }

    function r(e,
        b, f) {
        var d = c.gl;
        this.width = b;
        this.height = f;
        this.srcTex = e;
        this.outTex = new m.RenderBuffer(b, f);
        w(b, f);
        e = [1 / b, 1 / f, 0];
        this.outputBuffer = new m.RenderBuffer(b, f, !1);
        this.fsQuad = m.fsQuad.make(b, f);
        shaderNMap = new m.Shader("attribute vec3 aVertex;\nattribute vec2 aTex;\nvarying vec2 vTex;\nvoid main(void)\n{\n  vTex = aTex;\n  vec4 vPos = vec4(aVertex.xyz,1.0);\n  gl_Position = vPos;\n}", "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D srcTex;\nvarying vec2 vTex;\nuniform vec3 texel;\nvoid main(void)\n{\n vec3 color;\n color.r = (texture2D(srcTex,vTex + vec2(texel.x,0)).r-texture2D(srcTex,vTex + vec2(-texel.x,0)).r)/2.0 + 0.5;\n color.g = (texture2D(srcTex,vTex + vec2(0,-texel.y)).r-texture2D(srcTex,vTex + vec2(0,texel.y)).r)/2.0 + 0.5;\n color.b = 1.0;\n gl_FragColor.rgb = color;\n gl_FragColor.a = 1.0;\n}");
        shaderNMap.use();
        shaderNMap.addUVArray("aTex");
        shaderNMap.addVertexArray("aVertex");
        shaderNMap.addInt("srcTex", 0);
        shaderNMap.addVector("texel");
        shaderNMap.setVector("texel", e);
        this.shaderNorm = shaderNMap;
        this.setFilter = this.outputBuffer.texture.setFilter;
        this.clear = this.outputBuffer.texture.clear;
        this.use = this.outputBuffer.texture.use;
        this.tex_id = this.outputBuffer.texture.tex_id;
        this.filterType = this.outputBuffer.texture.filterType;
        this.outTex.use(d.TEXTURE0);
        this.setFilter(a.texture.filter.LINEAR);
        d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_S, d.REPEAT);
        d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_T, d.REPEAT)
    }

    function d(e, b, f) {
        var d = c.gl;
        this.width = e;
        this.height = b;
        this.outTex = new m.RenderBuffer(e, b, f);
        this.texture = this.outTex.texture;
        var g = w(e, b);
        this.setFilter = this.outTex.texture.setFilter;
        this.clear = this.outTex.texture.clear;
        this.use = this.outTex.texture.use;
        this.tex_id = this.outTex.texture.tex_id;
        this.filterType = this.outTex.texture.filterType;
        this.texture.use(d.TEXTURE0);
        g ? (this.setFilter(a.texture.filter.LINEAR),
            d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_S, d.REPEAT), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_T, d.REPEAT)) : (this.setFilter(a.texture.filter.LINEAR), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_S, d.CLAMP_TO_EDGE), d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_T, d.CLAMP_TO_EDGE));
        this.dims = [e, b];
        this.depth = f ? !0 : !1
    }

    function g(a, e) {
        this.scene = a;
        this.renderTex = new d(e ? e.width : a.camera.width, e ? e.height : a.camera.height, !0);
        this.setFilter = this.renderTex.texture.setFilter;
        this.clear = this.renderTex.texture.clear;
        this.use = this.renderTex.texture.use;
        this.tex_id = this.renderTex.texture.tex_id;
        this.filterType = this.renderTex.texture.filterType
    }
    var c = m.GLCore,
        a = m.enums,
        b = m.undef,
        f = m.log;
    a.texture = {
        map: {
            COLOR: 0,
            ENVSPHERE: 1,
            NORMAL: 2,
            BUMP: 3,
            REFLECT: 4,
            SPECULAR: 5,
            AMBIENT: 6,
            ALPHA: 7,
            MAX: 8
        },
        filter: {
            LINEAR: 0,
            LINEAR_MIP: 1,
            NEAREST: 2,
            NEAREST_MIP: 3
        }
    };
    var e = function(a, e) {
        this.img_path = a;
        this.filter_type = e
    };
    e.prototype = {
        getTexture: function(a, e) {
            return new q(this.img_path, this.filter_type, a, e)
        }
    };
    var q = function(e, f, d, g, q) {
        var h =
            c.gl;
        this.tex_id = m.Textures.length;
        this.filterType = -1;
        this.onready = q;
        this.loaded = !1;
        m.Textures[this.tex_id] = h.createTexture();
        m.Textures_obj[this.tex_id] = this;
        e && ("string" === typeof e ? m.Images[this.tex_id] = new Image : "object" === typeof e && "IMG" === e.nodeName && (m.Images[this.tex_id] = e), m.Textures_ref[e] = this.tex_id);
        h.bindTexture(h.TEXTURE_2D, m.Textures[this.tex_id]);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, h.LINEAR);
        h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, h.LINEAR);
        if (e) {
            var o = this.tex_id,
                r = f !== b ? f : c.default_filter,
                t = this;
            m.Images[this.tex_id].onload = function() {
                h.bindTexture(h.TEXTURE_2D, m.Textures[o]);
                h.pixelStorei(h.UNPACK_FLIP_Y_WEBGL, true);
                h.pixelStorei(h.UNPACK_COLORSPACE_CONVERSION_WEBGL, h.NONE);
                var e = m.Images[o];
                h.texImage2D(h.TEXTURE_2D, 0, h.RGBA, h.RGBA, h.UNSIGNED_BYTE, e);
                if (e = w(e.width, e.height)) {
                    h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, h.REPEAT);
                    h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, h.REPEAT)
                } else {
                    h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, h.CLAMP_TO_EDGE);
                    h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, h.CLAMP_TO_EDGE)
                }
                if (m.Textures_obj[o].filterType === -1) {
                    if (e) r = a.texture.filter.LINEAR_MIP;
                    else if (r === a.texture.filter.LINEAR_MIP) r = a.texture.filter.LINEAR;
                    m.Textures_obj[o].filterType === -1 && m.Textures_obj[o].setFilter(r)
                } else m.Textures_obj[o].setFilter(m.Textures_obj[o].filterType);
                if (t.onready) t.onready();
                h.bindTexture(h.TEXTURE_2D, null);
                t.loaded = true
            };
            d ? (m.Images[this.tex_id].deferredSrc = e, d.addImage(g, e, m.Images[this.tex_id])) : "string" === typeof e &&
                (m.Images[this.tex_id].src = e)
        }
        this.active_unit = -1
    };
    q.prototype = {
        setFilter: function(e) {
            if (-1 < this.tex_id) {
                var b = m.GLCore.gl;
                b.bindTexture(b.TEXTURE_2D, m.Textures[this.tex_id]);
                e === a.texture.filter.LINEAR ? (b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.LINEAR), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR)) : e === a.texture.filter.LINEAR_MIP ? (b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.LINEAR), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR_MIPMAP_NEAREST), b.generateMipmap(b.TEXTURE_2D)) :
                    e === a.texture.filter.NEAREST ? (b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST)) : e === a.texture.filter.NEAREST_MIP && (b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.NEAREST), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.NEAREST_MIPMAP_LINEAR), b.generateMipmap(b.TEXTURE_2D));
                this.filterType = e
            }
        },
        use: function(a) {
            -1 < this.tex_id && (c.gl.activeTexture(a), c.gl.bindTexture(c.gl.TEXTURE_2D, m.Textures[this.tex_id]), this.active_unit =
                a)
        },
        clear: function() {
            -1 < this.tex_id && -1 !== this.active_unit && (c.gl.activeTexture(this.active_unit), c.gl.bindTexture(c.gl.TEXTURE_2D, null), this.active_unit = -1)
        },
        destroy: function() {
            var a = m.GLCore.gl; - 1 < this.tex_id && m.Textures[this.tex_id] && (a.deleteTexture(m.Textures[this.tex_id]), delete m.Textures_obj[this.tex_id], this.tex_id = -1)
        }
    };
    t.prototype = {
        update: function() {
            this.updateFunction && this.updateFunction(this.canvasSource, this.canvasContext);
            var e = m.GLCore.gl;
            e.bindTexture(e.TEXTURE_2D, m.Textures[this.texture.tex_id]);
            e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0);
            e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, this.canvasSource);
            this.filterType === a.texture.filter.LINEAR_MIP && e.generateMipmap(e.TEXTURE_2D);
            e.bindTexture(e.TEXTURE_2D, null)
        }
    };
    h.prototype = {
        update: function() {
            this.updateFunction(this.canvasSource, this.canvasContext);
            var e = m.GLCore.gl;
            e.bindTexture(e.TEXTURE_2D, m.Textures[this.texture.tex_id]);
            e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0);
            e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, this.canvasSource);
            this.filterType === a.texture.filter.LINEAR_MIP && e.generateMipmap(e.TEXTURE_2D);
            e.bindTexture(e.TEXTURE_2D, null)
        }
    };
    o.prototype = {
        update: function() {
            var e = m.GLCore.gl;
            this.pjs.redraw();
            e.bindTexture(e.TEXTURE_2D, m.Textures[this.texture.tex_id]);
            e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !0);
            e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, this.canvas);
            this.filterType === a.texture.filter.LINEAR_MIP && e.generateMipmap(e.TEXTURE_2D);
            e.bindTexture(e.TEXTURE_2D, null)
        }
    };
    r.prototype = {
        update: function() {
            var a =
                c.gl,
                e = a.getParameter(a.VIEWPORT);
            this.outputBuffer.use();
            a.viewport(0, 0, this.width, this.height);
            a.clearColor(0, 0, 0, 1);
            a.clear(a.COLOR_BUFFER_BIT);
            this.srcTex.use(a.TEXTURE0);
            m.fsQuad.render(this.shaderNorm, this.fsQuad);
            a.bindFramebuffer(a.FRAMEBUFFER, null);
            a.viewport(e[0], e[1], e[2], e[3])
        }
    };
    d.prototype = {
        begin: function() {
            var a = c.gl;
            this.dims = a.getParameter(a.VIEWPORT);
            this.outTex.use();
            a.viewport(0, 0, this.width, this.height);
            this.depth ? a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT) : a.clear(a.COLOR_BUFFER_BIT)
        },
        end: function() {
            var a = c.gl;
            a.bindFramebuffer(a.FRAMEBUFFER, null);
            a.viewport(this.dims[0], this.dims[1], this.dims[2], this.dims[3])
        }
    };
    g.prototype = {
        update: function() {
            this.renderTex.begin();
            this.scene.updateShadows();
            this.scene.render();
            this.renderTex.end()
        }
    };
    return {
        Texture: q,
        DeferredLoadTexture: e,
        CanvasTexture: t,
        PdfTexture: h,
        TextTexture: function(a, e) {
            var f = e && e.color || "#fff",
                c = e && e.bgcolor,
                d = e && e.font || "18pt Arial",
                g = e && e.align || "start",
                q = e && e.y || 0,
                h = e && e.width || b,
                o = e && e.height || b,
                m, r = document.createElement("CANVAS"),
                A = r.getContext("2d"),
                C = 0,
                C = "string" === typeof a ? 1 : a.length;
            A.font = d;
            var w = e && e.lineHeight || A.measureText("OO").width,
                B;
            if (1 === C) B = A.measureText(a).width;
            else
                for (m = B = 0; m < C; ++m) {
                    var I = A.measureText(a[m]).width;
                    I > B && (B = I)
                }
            r.width = h || B;
            r.height = o || w * C;
            c && (A.fillStyle = c, A.fillRect(0, 0, r.width, r.height));
            A.fillStyle = f;
            A.font = d;
            A.textAlign = g;
            A.textBaseline = "top";
            if (1 === C) f = e && e.x || "center" === g ? r.width / 2 : "right" === g ? r.width : 0, A.fillText(a, f, q);
            else
                for (m = 0; m < C; ++m) f = e && e.x || "center" === g ? r.width / 2 : "right" ===
                    g ? r.width : 0, A.fillText(a[m], f, q + m * w);
            A.fill();
            this.use = t.prototype.use;
            this.clear = t.prototype.clear;
            this.update = t.prototype.update;
            t.apply(this, [r]);
            this.update();
            this.canvasSource = null
        },
        PJSTexture: o,
        NormalMapGen: r,
        RenderTexture: d,
        SceneRenderTexture: g
    }
});
CubicVR.RegisterModule("DrawBufferTexture", function(m) {
    var w = m.GLCore,
        t = m.enums;
    t.draw = {
        brush: {
            SINE: 0,
            SQUARE: 1
        },
        op: {
            ADD: 0,
            REPLACE: 1,
            SUBTRACT: 2,
            MULTIPLY: 3
        }
    };
    var h = function(h) {
        h = h || {};
        this.operation = m.parseEnum(t.draw.op, h.operation || h.op) || t.draw.op.REPLACE;
        this.brushType = m.parseEnum(t.draw.brush, h.brushType) || t.draw.brush.SINE;
        this.brushSize = h.size || 5;
        this.color = h.color || [255, 255, 255, 255]
    };
    h.prototype = {
        setOperation: function(h) {
            this.operation = m.parseEnum(t.draw.op, h)
        },
        getOperation: function() {
            return this.operation
        },
        setBrushType: function(h) {
            this.brushType = m.parseEnum(t.draw.brush, h) || t.draw.brush.SINE
        },
        getBrushType: function() {
            return this.brushType
        },
        setSize: function(h) {
            this.brushSize = h
        },
        getSize: function() {
            return this.brushSize
        },
        setColor: function(h) {
            this.color = h
        },
        getColor: function() {
            return this.color.slice(0)
        }
    };
    return {
        DrawBufferTexture: m.extendClassGeneral(m.Texture, function(o) {
            o = o || {};
            m.Texture.apply(this, [o.image, o.filter, o.deferred_bin, o.binId, o.readyFunc]);
            this.width = o.width || 0;
            this.height = o.height || 0;
            this.imageBufferData =
                this.imageBuffer = null;
            this.brush = o.brush || new h;
            this.drawBuffer = [];
            this.width && this.height && this.setupImageBuffer(this.width, this.height)
        }, {
            getUint8Buffer: function() {
                return this.imageBuffer
            },
            needsFlush: function() {
                return 0 !== this.drawBuffer.length
            },
            getWidth: function() {
                return this.width
            },
            getHeight: function() {
                return this.height
            },
            setupImageBuffer: function() {
                this.imageBufferData = new ArrayBuffer(4 * this.width * this.height);
                this.imageBuffer = new Uint8Array(this.imageBufferData);
                this.update()
            },
            setBrush: function(h) {
                this.brush =
                    h
            },
            getBrush: function() {
                return this.brush
            },
            draw: function(h, m, d) {
                var g = d || this.brush,
                    d = g.getOperation(),
                    c = g.getSize(),
                    a = g.getBrushType(),
                    g = g.getColor();
                this.drawBuffer.push([h, m, d, c, a, g])
            },
            flush: function() {
                if (!this.drawBuffer.length) return !1;
                for (; this.drawBuffer.length;) {
                    var h = this.drawBuffer.pop();
                    this.drawFunc(h[0], h[1], h[2], h[3], h[4], h[5])
                }
                return !0
            },
            drawFunc: function(h, m, d, g, c, a) {
                for (var b = this.imageBuffer, f = this.width, e = this.height, q = parseInt(Math.floor(h), 10) - g; q < parseInt(Math.ceil(h), 10) + g; q++)
                    for (var n =
                            q - h, s, F = parseInt(Math.floor(m), 10) - g; F < parseInt(Math.ceil(m), 10) + g; F++)
                        if (!(0 > q || q >= f || 0 > F || F >= e)) {
                            s = F - m;
                            var x;
                            0 === c && (x = (1 - Math.sqrt(n * n + s * s) / g) / 2);
                            s = 4 * (F * f + q);
                            0 === d ? 0 > x && (x = 0) : 1 === d ? 0 > x && (x = 0) : 2 === d && (x = -x, 0 < x && (x = 0));
                            var u = Math.floor(b[s] * (1 - x) + a[0] * x),
                                H = Math.floor(b[s + 1] * (1 - x) + a[1] * x),
                                z = Math.floor(b[s + 2] * (1 - x) + a[2] * x),
                                t = Math.floor(b[s + 3] * (1 - x) + a[3] * x);
                            255 < u ? u = 255 : 0 > u && (u = 0);
                            255 < H ? H = 255 : 0 > H && (H = 0);
                            255 < z ? z = 255 : 0 > z && (z = 0);
                            255 < t ? t = 255 : 0 > t && (t = 0);
                            b[s] = u;
                            b[s + 1] = H;
                            b[s + 2] = z;
                            b[s + 3] = t
                        }
            },
            update: function() {
                var h =
                    w.gl;
                this.flush();
                h.bindTexture(h.TEXTURE_2D, m.Textures[this.tex_id]);
                h.texImage2D(h.TEXTURE_2D, 0, h.RGBA, this.width, this.height, 0, h.RGBA, h.UNSIGNED_BYTE, this.imageBuffer);
                h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, h.LINEAR);
                h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, h.LINEAR)
            }
        }),
        DrawBufferBrush: h
    }
});
CubicVR.RegisterModule("Material", function(m) {
    function w(a) {
        this.blendEnabled = this.dirtyFlag = this.initialized = !1;
        this.textures = [];
        this.shader = [];
        this.customShader = (a = m.get(a) || {}, a.shader || null);
        null === r && (r = new m.CustomShader({
                vertex: "precision highp float; \nattribute vec3 vertexPosition; uniform mat4 matrixModelView; uniform mat4 matrixProjection; uniform mat4 matrixObject;\nvoid main(void) { gl_Position = matrixProjection * matrixModelView * matrixObject * vec4(vertexPosition,1.0); }",
                fragment: "precision highp float; \nvoid main(void) { gl_FragColor = vec4(1.0,0.0,1.0,1.0); }\n"
            }),
            r._init_shader(r._vertex, r._fragment, !1));
        this.customShader && (!this.customShader._init_shader && "object" === typeof this.customShader) && (this.customShader = new m.CustomShader(this.customShader));
        this.diffuse = a.diffuse || [1, 1, 1];
        this.specular = a.specular || [0.1, 0.1, 0.1];
        this.color = a.color || [1, 1, 1];
        this.ambient = a.ambient || [0, 0, 0];
        this.name = a.name || null;
        this.visible = a.visible !== t ? a.visible : !0;
        this.friction = a.friction !== t ? a.friction : 0.3;
        this.collision = a.visible !== t ? a.collision : !0;
        this.opacity = a.opacity === t ?
            1 : a.opacity;
        this.shininess = a.shininess === t ? 1 : a.shininess;
        this.max_smooth = a.max_smooth === t ? 60 : a.max_smooth;
        this.env_amount = a.env_amount === t ? 0.75 : a.env_amount;
        this.morph = a.morph === t ? !1 : a.morph;
        this.color_map = a.colorMap === t ? !1 : a.colorMap;
        this.uvOffset = a.uvOffset === t ? [0, 0] : a.uvOffset;
        this.noFog = a.noFog === t ? !1 : a.noFog;
        this.pointSprite = a.pointSprite || !1;
        this.pointSize = a.pointSize || 0;
        this.pointCircle = a.pointCircle || 0;
        if (a.textures)
            for (var b in a.textures) this.setTexture(a.textures[b], b)
    }
    var t = m.undef,
        h =
        m.GLCore,
        o = m.enums,
        r = null,
        d = [o.texture.map.REFLECT, o.texture.map.SPECULAR, o.texture.map.NORMAL, o.texture.map.BUMP],
        g = [],
        c = "textureColor textureEnvSphere textureNormal textureBump textureReflect textureSpecular textureAmbient textureAlpha matrixModelView matrixProjection matrixObject matrixNormal vertexPosition vertexNormal vertexColor vertexTexCoord materialTexOffset vertexMorphPosition vertexMorphNormal materialMorphWeight lightDiffuse lightSpecular lightIntensity lightDistance lightPosition lightDirection lightCutOffAngle lightShadowMap lightProjectionMap lightDepthClip lightShadowMatrix lightAmbient materialDiffuse materialColor materialAmbient materialSpecular materialShininess materialEnvironment materialAlpha postDepthInfo".split(" ");
    w.prototype = {
        clone: function() {
            var a = new m.Material({
                    diffuse: this.diffuse,
                    specular: this.specular,
                    color: this.color,
                    ambient: this.ambient,
                    opacity: this.opacity,
                    shininess: this.shininess,
                    max_smooth: this.max_smooth,
                    env_amount: this.env_amount,
                    morph: this.morph,
                    colorMap: this.color_map,
                    visible: this.visible,
                    friction: this.friction,
                    collision: this.collision,
                    pointSprite: this.pointSprite,
                    pointSize: this.pointSize,
                    pointCircle: this.pointCircle,
                    name: this.name
                }),
                b;
            for (b in this.textures) this.textures.hasOwnProperty(b) &&
                a.setTexture(this.textures[b], b);
            return a
        },
        setVisibility: function(a) {
            this.visible = a
        },
        getVisibility: function() {
            return this.visible
        },
        setCollision: function(a) {
            this.collision = a
        },
        getCollision: function() {
            return this.collision
        },
        setFriction: function(a) {
            this.friction = a
        },
        getFriction: function() {
            return this.friction
        },
        setTexture: function(a, b) {
            if (a && (b = m.parseEnum(o.texture.map, b) || 0, m.features.texturePerPixel || -1 === d.indexOf(b))) !a.use && "string" === typeof a && (a = m.Textures_ref[a] !== t ? m.Textures_obj[m.Textures_ref[a]] :
                new m.Texture(a)), this.textures[b] = a
        },
        calcShaderMask: function() {
            var a;
            a = 0 + ("object" === typeof this.textures[o.texture.map.COLOR] ? o.shader.map.COLOR : 0);
            a += "object" === typeof this.textures[o.texture.map.SPECULAR] ? o.shader.map.SPECULAR : 0;
            a += "object" === typeof this.textures[o.texture.map.NORMAL] ? o.shader.map.NORMAL : 0;
            a += "object" === typeof this.textures[o.texture.map.BUMP] ? o.shader.map.BUMP : 0;
            a += "object" === typeof this.textures[o.texture.map.REFLECT] ? o.shader.map.REFLECT : 0;
            a += "object" === typeof this.textures[o.texture.map.ENVSPHERE] ?
                o.shader.map.ENVSPHERE : 0;
            a += "object" === typeof this.textures[o.texture.map.AMBIENT] ? o.shader.map.AMBIENT : 0;
            a += "object" === typeof this.textures[o.texture.map.ALPHA] ? o.shader.map.ALPHA : 0;
            a += this.pointSprite ? o.shader.mode.POINT_SPRITE : 0;
            a += this.pointSize ? o.shader.mode.POINT_SIZE : 0;
            a += this.pointCircle ? o.shader.mode.POINT_CIRCLE : 0;
            a += 1 !== this.opacity ? o.shader.map.ALPHA : 0;
            a += this.color_map ? o.shader.map.COLORMAP : 0;
            1 !== this.opacity && (this.blendEnabled = !0);
            return a
        },
        getShaderHeader: function(a, b) {
            return (b !==
                    t ? "#define LIGHT_COUNT " + b + "\n" : "") + "#define TEXTURE_COLOR " + ("object" === typeof this.textures[o.texture.map.COLOR] ? 1 : 0) + "\n#define TEXTURE_SPECULAR " + ("object" === typeof this.textures[o.texture.map.SPECULAR] ? 1 : 0) + "\n#define TEXTURE_NORMAL " + ("object" === typeof this.textures[o.texture.map.NORMAL] ? 1 : 0) + "\n#define TEXTURE_BUMP " + ("object" === typeof this.textures[o.texture.map.BUMP] ? 1 : 0) + "\n#define TEXTURE_REFLECT " + ("object" === typeof this.textures[o.texture.map.REFLECT] ? 1 : 0) + "\n#define TEXTURE_ENVSPHERE " +
                ("object" === typeof this.textures[o.texture.map.ENVSPHERE] ? 1 : 0) + "\n#define TEXTURE_AMBIENT " + ("object" === typeof this.textures[o.texture.map.AMBIENT] ? 1 : 0) + "\n#define TEXTURE_ALPHA " + ("object" === typeof this.textures[o.texture.map.ALPHA] ? 1 : 0) + "\n#define MATERIAL_ALPHA " + (1 !== this.opacity ? 1 : 0) + "\n#define LIGHT_IS_POINT " + (a === o.light.type.POINT ? 1 : 0) + "\n#define LIGHT_IS_DIRECTIONAL " + (a === o.light.type.DIRECTIONAL ? 1 : 0) + "\n#define LIGHT_IS_SPOT " + (a === o.light.type.SPOT || a === o.light.type.SPOT_SHADOW || a ===
                    o.light.type.SPOT_SHADOW_PROJECTOR ? 1 : 0) + "\n#define LIGHT_SHADOWED " + (a === o.light.type.SPOT_SHADOW || a === o.light.type.SPOT_SHADOW_PROJECTOR || a === o.light.type.AREA ? 1 : 0) + "\n#define LIGHT_IS_PROJECTOR " + (a === o.light.type.SPOT_SHADOW_PROJECTOR ? 1 : 0) + "\n#define LIGHT_SHADOWED_SOFT " + (h.soft_shadow ? 1 : 0) + "\n#define LIGHT_IS_AREA " + (a === o.light.type.AREA ? 1 : 0) + "\n#define LIGHT_DEPTH_PASS " + (a === o.light.type.DEPTH_PACK ? 1 : 0) + "\n#define FX_DEPTH_ALPHA " + (h.depth_alpha ? 1 : 0) + "\n#define VERTEX_MORPH " + (this.morph ?
                    1 : 0) + "\n#define VERTEX_COLOR " + (this.color_map ? 1 : 0) + "\n#define FOG_ENABLED " + (h.fog_enabled && !this.noFog ? 1 : 0) + "\n#define USE_FOG_EXP " + (h.fogExp ? 1 : 0) + "\n#define USE_FOG_LINEAR " + (h.fogLinear ? 1 : 0) + "\n#define LIGHT_PERPIXEL " + (m.features.lightPerPixel ? 1 : 0) + "\n#define POINT_SPRITE " + (this.pointSprite ? 1 : 0) + "\n#define POINT_SIZE " + (this.pointSize ? 1 : 0) + "\n#define POINT_CIRCLE " + (this.pointCircle ? 1 : 0) + "\n\n"
        },
        bindObject: function(a, b) {
            var f = h.gl,
                e = b.vertexPosition,
                c = b.vertexTexCoord,
                n = b.vertexNormal,
                d = b.vertexColor;
            f.bindBuffer(f.ARRAY_BUFFER, a.compiled.gl_points);
            f.vertexAttribPointer(e, 3, f.FLOAT, !1, 0, 0);
            f.enableVertexAttribArray(e);
            c !== t && (null !== a.compiled.gl_uvs && -1 !== c) && (f.bindBuffer(f.ARRAY_BUFFER, a.compiled.gl_uvs), f.vertexAttribPointer(c, 2, f.FLOAT, !1, 0, 0), f.enableVertexAttribArray(c));
            g.uv = c;
            n !== t && (null !== a.compiled.gl_normals && -1 !== n) && (f.bindBuffer(f.ARRAY_BUFFER, a.compiled.gl_normals), f.vertexAttribPointer(n, 3, f.FLOAT, !1, 0, 0), f.enableVertexAttribArray(n));
            g.un = n;
            d !== t && (null !== a.compiled.gl_colors &&
                -1 !== d) && (f.bindBuffer(f.ARRAY_BUFFER, a.compiled.gl_colors), f.vertexAttribPointer(d, 3, f.FLOAT, !1, 0, 0), f.enableVertexAttribArray(d));
            g.uc = d;
            a.morphTarget && (e = b.vertexMorphPosition, n = b.vertexMorphNormal, f.bindBuffer(f.ARRAY_BUFFER, a.morphTarget.gl_points), f.vertexAttribPointer(e, 3, f.FLOAT, !1, 0, 0), f.enableVertexAttribArray(e), n !== t && (null !== a.morphTarget.gl_normals && -1 !== n) && (f.bindBuffer(f.ARRAY_BUFFER, a.morphTarget.gl_normals), f.vertexAttribPointer(n, 3, f.FLOAT, !1, 0, 0), f.enableVertexAttribArray(n)),
                f.uniform1f(b.materialMorphWeight, a.morphWeight));
            a.compiled.unrolled ? f.bindBuffer(f.ELEMENT_ARRAY_BUFFER, null) : f.bindBuffer(f.ELEMENT_ARRAY_BUFFER, a.compiled.gl_elements)
        },
        bindLines: function(a, b) {
            var f = h.gl,
                e = b.vertexPosition,
                c = b.vertexTexCoord,
                n = b.vertexNormal,
                d = b.vertexColor;
            a.compiled.unrolled ? (f.bindBuffer(f.ARRAY_BUFFER, a.compiled.gl_lines), f.vertexAttribPointer(e, 3, f.FLOAT, !1, 0, 0), f.enableVertexAttribArray(e), g.up = e, c !== t && (null !== a.compiled.gl_line_uvs && -1 !== c) && (f.bindBuffer(f.ARRAY_BUFFER,
                a.compiled.gl_line_uvs), f.vertexAttribPointer(c, 2, f.FLOAT, !1, 0, 0), f.enableVertexAttribArray(c)), g.uv = c, n !== t && (null !== a.compiled.gl_line_normals && -1 !== n) && (f.bindBuffer(f.ARRAY_BUFFER, a.compiled.gl_line_normals), f.vertexAttribPointer(n, 3, f.FLOAT, !1, 0, 0), f.enableVertexAttribArray(n)), g.un = n, d !== t && (null !== a.compiled.gl_line_colors && -1 !== d) && (f.bindBuffer(f.ARRAY_BUFFER, a.compiled.gl_line_colors), f.vertexAttribPointer(d, 3, f.FLOAT, !1, 0, 0), f.enableVertexAttribArray(d)), g.uc = d) : f.bindBuffer(f.ELEMENT_ARRAY_BUFFER,
                a.compiled.gl_line_elements);
            a.morphTarget && (e = b.vertexMorphPosition, n = b.vertexMorphNormal, f.bindBuffer(f.ARRAY_BUFFER, a.morphTarget.gl_lines), f.vertexAttribPointer(e, 3, f.FLOAT, !1, 0, 0), f.enableVertexAttribArray(e), n !== t && (null !== a.morphTarget.gl_line_normals && -1 !== n) && (f.bindBuffer(f.ARRAY_BUFFER, a.morphTarget.gl_line_normals), f.vertexAttribPointer(n, 3, f.FLOAT, !1, 0, 0), f.enableVertexAttribArray(n)), f.uniform1f(b.materialMorphWeight, a.morphWeight))
        },
        clearObject: function(a, b) {
            var f = h.gl;
            g.uv !== t && -1 !==
                g.uv && f.disableVertexAttribArray(g.uv);
            g.un !== t && -1 !== g.un && f.disableVertexAttribArray(g.un);
            g.uc !== t && -1 !== g.uc && f.disableVertexAttribArray(g.uc);
            a.morphTarget && b && (up = b.vertexMorphPosition, f.disableVertexAttribArray(up), un = b.vertexMorphNormal, null !== un && (null !== a.compiled.gl_normals && -1 !== un) && f.disableVertexAttribArray(un))
        },
        use: function(a, b) {
            var f, e = h.gl,
                d = this.textures,
                n = !0,
                b = b || 0,
                a = a || 0;
            this.shader[a] || (this.shader[a] = []);
            var g = this.shader[a][b],
                F = this.customShader && a === o.light.type.DEPTH_PACK &&
                !this.customShader.hasDepthPack();
            g && (1 !== this.opacity && !0 !== this.blendEnabled) && (this.dirtyFlag = !0);
            !0 === this.dirtyFlag && (g = null, this.dirtyFlag = !1);
            if (g) n = g !== r, g.use();
            else {
                f = this.calcShaderMask(a);
                if (!this.customShader || F) m.ShaderPool[a][f] || (m.ShaderPool[a][f] = []), g = m.ShaderPool[a][f][b];
                if (!g) {
                    var x = this.getShaderHeader(a, b),
                        u = x + h.CoreShader_vs,
                        x = x + h.CoreShader_fs;
                    this.customShader && !F ? this.customShader._initialized || (this.customShader._init_shader(u, x, c), g = this.customShader.getShader(), g.isCompiled() ||
                        (n = !1, g = r.getShader())) : (g = new m.Shader(u, x), g.isCompiled() || (n = !1, g = r.getShader()), m.ShaderPool[a][f][b] = g);
                    f = 0;
                    if (a !== o.light.type.DEPTH_PACK) {
                        if (a === o.light.type.SPOT_SHADOW || a === o.light.type.SPOT_SHADOW_PROJECTOR || a === o.light.type.AREA) f += b, a === o.light.type.SPOT_SHADOW_PROJECTOR && (f += b);
                        "object" === typeof d[o.texture.map.COLOR] && g.addInt("textureColor", f++);
                        "object" === typeof d[o.texture.map.ENVSPHERE] && g.addInt("textureEnvSphere", f++);
                        "object" === typeof d[o.texture.map.NORMAL] && g.addInt("textureNormal",
                            f++);
                        "object" === typeof d[o.texture.map.BUMP] && g.addInt("textureBump", f++);
                        "object" === typeof d[o.texture.map.REFLECT] && g.addInt("textureReflect", f++);
                        "object" === typeof d[o.texture.map.SPECULAR] && g.addInt("textureSpecular", f++);
                        "object" === typeof d[o.texture.map.AMBIENT] && g.addInt("textureAmbient", f++)
                    }
                    "object" === typeof d[o.texture.map.ALPHA] && g.addInt("textureAlpha", f++);
                    g.addMatrix("matrixModelView");
                    g.addMatrix("matrixProjection");
                    g.addMatrix("matrixObject");
                    g.addMatrix("matrixNormal");
                    g.addVertexArray("vertexPosition",
                        0);
                    g.addVertexArray("vertexNormal");
                    this.color_map && g.addVertexArray("vertexColor");
                    this.morph && (g.addVertexArray("vertexMorphPosition"), g.addVertexArray("vertexMorphNormal"), g.addFloat("materialMorphWeight", 0));
                    for (f = 0; f < b; f++)
                        if (g.addVector("lightDiffuse[" + f + "]"), g.addVector("lightSpecular[" + f + "]"), g.addFloat("lightIntensity[" + f + "]"), g.addFloat("lightDistance[" + f + "]"), g.addVector("lightPosition[" + f + "]"), g.addVector("lightDirection[" + f + "]"), (a === o.light.type.SPOT_SHADOW || a === o.light.type.SPOT_SHADOW_PROJECTOR ||
                                a === o.light.type.SPOT) && g.addFloat("lightCutOffAngle[" + f + "]"), a === o.light.type.SPOT_SHADOW || a === o.light.type.SPOT_SHADOW_PROJECTOR || a === o.light.type.AREA) g.addInt("lightShadowMap[" + f + "]"), a === o.light.type.SPOT_SHADOW_PROJECTOR && g.addInt("lightProjectionMap[" + f + "]"), g.addVector("lightDepthClip[" + f + "]"), g.addMatrix("lightShadowMatrix[" + f + "]");
                    a !== o.light.type.DEPTH_PACK && (g.addVector("lightAmbient"), g.addVector("materialDiffuse"), g.addVector("materialColor"), g.addVector("materialAmbient"), g.addVector("materialSpecular"),
                        g.addFloat("materialShininess"), g.addFloat("materialEnvironment"));
                    g.addFloat("materialAlpha");
                    (h.depth_alpha || a === o.light.type.DEPTH_PACK || a === o.light.type.SPOT_SHADOW || a === o.light.type.SPOT_SHADOW_PROJECTOR || a === o.light.type.AREA) && g.addVector("postDepthInfo");
                    g.addUVArray("vertexTexCoord");
                    g.addVector("materialTexOffset");
                    h.fog_enabled && !this.noFog && (g.addVector("fogColor", h.fogColor), g.addFloat("fogDensity", h.fogDensity), g.addFloat("fogNear", h.fogNear), g.addFloat("fogFar", h.fogFar));
                    if (this.pointSprite ||
                        this.pointSize) g.addFloat("pointSize", 1), this.pointSize && !this.pointSprite && g.addVector("viewPort")
                }
                this.shader[a][b] = g;
                g.use(); - 1 != g.materialTexOffset && e.uniform2fv(g.materialTexOffset, [0, 0])
            }
            f = 0;
            if (a !== o.light.type.DEPTH_PACK) {
                if (a === o.light.type.SPOT_SHADOW || a === o.light.type.SPOT_SHADOW_PROJECTOR || a === o.light.type.AREA) f += b, a === o.light.type.SPOT_SHADOW_PROJECTOR && (f += b);
                if (u = d[o.texture.map.COLOR]) u.use(h.gl.TEXTURE0 + f), f++;
                if (u = d[o.texture.map.ENVSPHERE]) u.use(h.gl.TEXTURE0 + f), f++, e.uniform1f(g.materialEnvironment,
                    this.env_amount);
                if (u = d[o.texture.map.NORMAL]) u.use(h.gl.TEXTURE0 + f), f++;
                if (u = d[o.texture.map.BUMP]) u.use(h.gl.TEXTURE0 + f), f++;
                if (u = d[o.texture.map.REFLECT]) u.use(h.gl.TEXTURE0 + f), f++;
                if (u = d[o.texture.map.SPECULAR]) u.use(h.gl.TEXTURE0 + f), f++;
                if (u = d[o.texture.map.AMBIENT]) u.use(h.gl.TEXTURE0 + f), f++
            }
            if (u = d[o.texture.map.ALPHA]) u.use(h.gl.TEXTURE0 + f), f++;
            h.fog_enabled && !this.noFog && (e.uniform3fv(g.fogColor, h.fogColor), e.uniform1f(g.fogDensity, h.fogDensity), e.uniform1f(g.fogNear, h.fogNear), e.uniform1f(g.fogFar,
                h.fogFar));
            a !== o.light.type.DEPTH_PACK ? (e.uniform3fv(g.materialColor, this.color), e.uniform3fv(g.materialDiffuse, this.diffuse), e.uniform3fv(g.materialAmbient, this.ambient), e.uniform3fv(g.materialSpecular, this.specular), e.uniform1f(g.materialShininess, 128 * this.shininess), e.uniform3fv(g.lightAmbient, m.globalAmbient), 1 > this.opacity && e.uniform1f(g.materialAlpha, this.opacity), (h.depth_alpha || a === o.light.type.SPOT_SHADOW || a === o.light.type.SPOT_SHADOW_PROJECTOR || a === o.light.type.AREA) && e.uniform3fv(g.postDepthInfo, [h.depth_alpha_near, h.depth_alpha_far, 0])) : e.uniform3fv(g.postDepthInfo, [h.shadow_near, h.shadow_far, 0]);
            g.materialTexOffset && e.uniform2fv(g.materialTexOffset, this.uvOffset);
            if (this.pointSprite || this.pointSize) e.uniform1f(g.pointSize, this.pointSize), this.pointSprite || e.uniform3fv(g.viewPort, [h.viewportWidth, h.viewportHeight, 0]);
            this.customShader && (a !== o.light.type.DEPTH_PACK || a === o.light.type.DEPTH_PACK && !F) && this.customShader._doUpdate({
                material: this,
                textureIndex: f
            });
            return n
        }
    };
    return {
        Material: w
    }
});
CubicVR.RegisterModule("Mesh", function(m) {
    function w() {
        this.points = [];
        this.point_normals = [];
        this.point_colors = [];
        this.uvs = [];
        this.normal = [0, 0, 0];
        this.segment = this.material = 0
    }

    function t(d) {
        this.compiled = null;
        this.materials = [];
        this.edges = this.instanceMaterials = this.bb = null;
        this.faces = [];
        this.points = [];
        this.currentFace = -1;
        this.currentSegment = this.currentMaterial = 0;
        this.morphTarget = this.morphTargets = null;
        this.morphWeight = 0;
        this.morphTargetIndex = this.morphSourceIndex = -1;
        this.originBuffer = null;
        this.genNormals = !0;
        d = m.get(d) || {};
        if (d instanceof m.Mesh) this.booleanAdd(d), d._clones = d._clones || 1, d._clones++, this.name = d.name ? d.name + "_copy" + d._clones : null;
        else {
            this.name = d.name || null;
            this.dynamic = d.dynamic || !1;
            if (d.material) {
                var g = d.material;
                g.length ? this.materials = g : "object" === typeof g && (g.use ? this.setFaceMaterial(g) : this.setFaceMaterial(new m.Material(g)))
            }(d.point || d.points) && this.build(d);
            d.part ? this.build(d.part) : d.parts && this.build(d.parts);
            if ((this.primitives = d.primitives || d.primitive || null) && !this.primitives.length ||
                "string" === typeof this.primitives) this.primitives = [this.primitives];
            if (this.primitives && this.primitives.length)
                for (var g = 0, c = this.primitives.length; g < c; g++) {
                    var a = this.primitives[g];
                    "string" === typeof a && (a = m.get(a));
                    var b = m.primitives[a.type];
                    if (a.type && b) this.booleanAdd(b(a));
                    else if (a.type) {
                        r("Mesh error, primitive " + a.type + " is unknown.");
                        var a = "",
                            f;
                        for (f in m.primitives) m.primitives.hasOwnProperty(f) && ("" !== a && (a += ", "), a += f);
                        r("Available primitive types are: " + a)
                    } else r("Mesh error, primitive " +
                        (g + 1) + " lacks type.")
                }
            this.pointMode = d.pointMode;
            this.buildWireframe = d.buildWireframe || d.wireframe || !!d.wireframeMaterial || !!d.pointModeMaterial || d.triangulateWireframe || d.pointMode || !1;
            this.triangulateWireframe = d.triangulateWireframe || null;
            this.wireframeMaterial = m.get(d.wireframeMaterial, m.Material) || null;
            this.pointModeMaterial = m.get(d.pointModeMaterial, m.Material) || null;
            this.wireframe = d.wireframe || !1;
            d.flipFaces && this.faces.length && this.flipFaces();
            (d.prepare || d.compile && this.faces.length) && this.prepare();
            (d.clean || d.compile && this.faces.length && !this.dynamic) && this.clean();
            this.genNormals && (d.calcNormals && !d.compile && !d.prepare) && this.calcNormals()
        }
    }
    var h = m.undef,
        o = m.GLCore,
        r = m.log;
    w.prototype = {
        setUV: function(d, g) {
            g !== h ? this.uvs[g] = d : 2 !== d.length ? this.uvs = d : this.uvs.push(d)
        },
        setPointNormal: function(d, g) {
            g !== h ? this.point_normals[g] = d : "number" === typeof d[0] ? this.point_normals.push(d) : this.point_normals = d
        },
        setNormal: function(d) {
            this.normal = d;
            if (!this.point_normals.length && this.points.length)
                for (var g =
                        0, c = this.points.length; g < c; g++) this.point_normals[g] = d
        },
        setColor: function(d, g) {
            g !== h ? this.point_colors[g] = d : "number" !== typeof d[0] ? this.point_colors = d : this.point_colors.push(d)
        },
        flip: function() {
            for (var d = 0, g = this.point_normals.length; d < g; d++) this.point_normals[d] = [-this.point_normals[d][0], -this.point_normals[d][1], -this.point_normals[d][2]];
            this.points.reverse();
            this.point_normals.reverse();
            this.uvs.reverse();
            this.normal = [-this.normal[0], -this.normal[1], -this.normal[2]]
        }
    };
    t.prototype = {
        setPointMode: function(d) {
            this.pointMode =
                d
        },
        isPointMode: function() {
            return this.pointMode
        },
        setWireframe: function(d) {
            this.wireframe = d
        },
        isWireframe: function() {
            return this.wireframe
        },
        setWireframeMaterial: function(d) {
            this.wireframeMaterial = d
        },
        getWireframeMaterial: function() {
            return this.wireframeMaterial
        },
        setPointModeMaterial: function(d) {
            this.pointModeMaterial = d
        },
        getPointModeMaterial: function() {
            return this.pointModeMaterial
        },
        build: function(d, g) {
            var c, a;
            "string" === typeof d && (d = m.get(d));
            d && !d.length && (d = [d]);
            var b = this.faces.length;
            g && g.length &&
                this.points.concat(g);
            for (var f = 0, e = d.length; f < e; f++) {
                var q = d[f];
                c = q.material;
                a = q.points || q.point;
                var n = q.faces || q.face,
                    s = q.uv || q.uvs,
                    h = q.color || q.colors,
                    x = q.normal || q.normals,
                    q = q.segment || null;
                null !== q && this.setSegment(parseInt(q, 10));
                if (a && a.length && (this.points = this.points.concat(a), n && b)) {
                    n = n.slice(0);
                    a = 0;
                    for (q = n.length; a < q; a++)
                        for (var u = n[a], o = 0, z = n.length; o < z; o++) u[o] += b
                }
                c && (c.length ? this.materials = c : "object" === typeof c && (c.use ? this.setFaceMaterial(c) : this.setFaceMaterial(new m.Material(c))));
                n && n.length && this.addFace(n);
                if (n && s && "object" === typeof s) {
                    q = null;
                    if (s.length)
                        if (s.length === n.length) {
                            c = 0;
                            for (a = s.length; c < a; c++) this.faces[c + b].setUV(s[c])
                        } else r("Mesh error in part, face count: " + n.length + ", uv count:" + s.length);
                    else q = s.apply ? s : new m.UVMapper(s);
                    q && q.apply(this, this.currentMaterial, this.currentSegment, b, this.faces.length - b)
                }
                if (n && x)
                    if (x.length && x[0].length)
                        if (x.length === n.length) {
                            this.genNormals = !1;
                            s = "number" === typeof x[0][0];
                            c = 0;
                            for (a = x.length; c < a; c++) s ? this.faces[c + b].setNormal(x[c]) :
                                this.faces[c + b].setPointNormal(x[c])
                        } else r("Mesh error in part, face count: " + n.length + ", normals count:" + s.length);
                else r("Mesh error in part, unknown something where normals should be? [" + typeof x + "]");
                if (n && h && "object" === typeof h)
                    if (h.length && h.length === n.length) {
                        c = 0;
                        for (a = h.length; c < a; c++) this.faces[c + b].setColor(h[c]);
                        this.materials[this.currentMaterial].colorMap = !0
                    } else r("Mesh error in part, face count: " + n.length + ", color count:" + h.length)
            }
            return this
        },
        showAllSegments: function() {
            for (var d in this.segment_state) this.segment_state.hasOwnProperty(d) &&
                (this.segment_state[d] = !0)
        },
        hideAllSegments: function() {
            for (var d in this.segment_state) this.segment_state.hasOwnProperty(d) && (this.segment_state[d] = !1)
        },
        setSegment: function(d, g) {
            g !== h ? this.segment_state[d] = g : this.currentSegment = d
        },
        addPoint: function(d) {
            if (3 !== d.length || "object" === typeof d[0])
                for (var g = 0, c = d.length; g < c; g++) this.points.push(d[g]);
            else this.points.push(d);
            return this.points.length - 1
        },
        getMaterialIndex: function(d) {
            return this.materials.indexOf(d)
        },
        setFaceMaterial: function(d, g) {
            var c;
            "number" ==
            typeof d ? c = d : (c = this.materials.indexOf(d), -1 === c && (this.materials.push(d), c = this.materials.length - 1));
            g !== h ? this.faces[g] !== h && (this.faces[g].material = c) : this.currentMaterial = c;
            return this
        },
        addFace: function(d, g, c, a) {
            if (d === h) return this.currentFace = this.faces.length, this.faces.push(new w), this.currentFace;
            if ("number" !== typeof d[0]) {
                g = 0;
                for (c = d.length; g < c; g++) this.addFace(d[g])
            } else return g === h ? (this.currentFace = this.faces.length, this.faces.push(new w)) : (this.faces[g] === h && (this.faces[g] = new w), this.currentFace =
                g), "object" === typeof d && (this.faces[this.currentFace].points = d), c !== h ? this.setFaceMaterial(c, this.currentFace) : this.faces[this.currentFace].material = this.currentMaterial, this.faces[this.currentFace].segment = a !== h ? a : this.currentSegment, this.currentFace
        },
        flipFaces: function() {
            for (var d = 0, g = this.faces.length; d < g; d++) this.faces[d].flip()
        },
        triangulate: function() {
            for (var d, g, c, a, b, f, e = 0, q = this.faces.length; e < q; e++)
                if (b = this.faces[e], a = b.points, 4 === a.length) {
                    if (f = this.faces[this.addFace([a[2], a.pop(), a[0]],
                            this.faces.length, b.material, b.segment)], f.normal = b.normal.slice(0), d = b.point_colors, 4 === d.length && (f.point_colors = [d[2].slice(0), d.pop(), d[0].slice(0)]), g = b.uvs, 4 === g.length && (f.uvs = [g[2].slice(0), g.pop(), g[0].slice(0)]), c = b.point_normals, 4 === c.length) f.point_normals = [c[2].slice(0), c.pop(), c[0].slice(0)]
                } else if (4 < a.length) {
                d = [];
                f = [];
                var n, s;
                g = [0, 0, 0];
                c = m.vec3;
                var h;
                n = 0;
                for (s = a.length; n < s; n++) g = c.add(g, this.points[a[n]]), f[n] = this.points[a[n]];
                g[0] /= a.length;
                g[1] /= a.length;
                g[2] /= a.length;
                n = 0;
                for (s =
                    a.length; n < s; n++)
                    if (!c.equal(g, this.points[a[n]])) {
                        h = c.normalize(c.subtract(this.points[a[n]], g));
                        break
                    }
                n = b.normal = m.polygon.normal(f);
                f = h;
                var x = c.normalize(c.cross(h, n));
                n = 0;
                for (s = a.length; n < s; n++) {
                    var u = c.subtract(g, this.points[a[n]]);
                    d[n] = [c.dot(f, u), c.dot(x, u)]
                }
                x = m.polygon.triangulate2D(d);
                if (null !== x) {
                    d = b.point_colors;
                    g = b.uvs;
                    c = b.point_normals;
                    n = 0;
                    for (s = x.length; n < s; n += 3)
                        if (0 === n ? (this.faces[e] = new m.Face, f = this.faces[e]) : f = this.faces[this.addFace()], f.material = b.material, f.segment = b.segment,
                            f.points = [a[x[n]], a[x[n + 1]], a[x[n + 2]]], f.normal = b.normal.slice(0), d.length && (f.point_colors = [d[x[n]].slice(0), d[x[n + 1]].slice(0), d[x[n + 2]].slice(0)]), g.length && (f.uvs = [g[x[n]].slice(0), g[x[n + 1]].slice(0), g[x[n + 2]].slice(0)]), c.length) f.point_normals = [c[x[n]].slice(0), c[x[n + 1]].slice(0), c[x[n + 2]].slice(0)]
                } else m.log("Unable to triangulate face " + e + ", possible degenerate poly.")
            }
            return this
        },
        booleanAdd: function(d, g) {
            var c = m.mat4,
                a = this.points.length,
                b, f, e, q;
            b = g;
            g = b === h ? h : "array" === typeof b ? b : "object" ===
                typeof b ? b.getResult ? b.getResult() : b.position || b.rotation || b.scale ? m.mat4.transform(b.position, b.rotation, b.scale) : h : void 0;
            d.wireframeMaterial && (this.wireframeMaterial = d.wireframeMaterial);
            d.pointMaterial && (this.pointMaterial = d.pointMaterial);
            if (g !== h) {
                f = g;
                b = 0;
                for (e = d.points.length; b < e; b++) this.addPoint(c.vec3_multiply(d.points[b], f))
            } else {
                b = 0;
                for (e = d.points.length; b < e; b++) this.addPoint([d.points[b][0], d.points[b][1], d.points[b][2]])
            }
            c = [];
            b = 0;
            for (e = d.materials.length; b < e; b++) f = this.materials.indexOf(d.materials[b]), -1 === f ? (this.materials.push(d.materials[b]), c[b] = this.materials.length - 1) : c[b] = f;
            b = 0;
            for (e = d.faces.length; b < e; b++) {
                var n = [];
                f = 0;
                for (q = d.faces[b].points.length; f < q; f++) n.push(d.faces[b].points[f] + a);
                n = this.faces[this.addFace(n)];
                n.segment = d.faces[b].segment;
                n.material = c[d.faces[b].material];
                n.material === h && (n.material = 0);
                f = 0;
                for (q = d.faces[b].uvs.length; f < q; f++) n.uvs[f] = [d.faces[b].uvs[f][0], d.faces[b].uvs[f][1]];
                f = 0;
                for (q = d.faces[b].point_normals.length; f < q; f++) n.point_normals[f] = [d.faces[b].point_normals[f][0],
                    d.faces[b].point_normals[f][1], d.faces[b].point_normals[f][2]
                ]
            }
            return this
        },
        calcFaceNormals: function(d, g) {
            var c = m.vec3,
                a = m.triangle,
                b = 0,
                f = this.faces.length,
                e, q = this.points,
                n;
            d && (b = d);
            for (g && (f = g + 1); b < f; b++) e = this.faces[b], n = e.points, e.normal = 3 > n.length ? [0, 0, 0] : c.normalize(a.normal(q[n[0]], q[n[1]], q[n[2]]));
            return this
        },
        getMaterial: function(d) {
            if (!isNaN(parseInt(d, 10))) return this.materials[g];
            for (var g = 0, c = this.materials.length; g < c; g++)
                if (this.materials[g].name === d) return this.materials[g];
            return null
        },
        getMaterials: function() {
            return this.materials
        },
        bindInstanceMaterials: function(d) {
            this.instanceMaterials = d
        },
        calcNormals: function(d) {
            var g = m.vec3,
                c = !1,
                a;
            this.genNormals = !0;
            this.dynamic && (a = [], d = d || {});
            d !== h && (a = [], c = !0);
            this.calcFaceNormals();
            var b, f, e, q, n = Array(this.points.length);
            b = 0;
            for (q = n.length; b < q; b++) n[b] = [];
            q = this.faces.length;
            for (b = 0; b < q; b++) {
                e = this.faces[b].points.length;
                for (f = 0; f < e; f++) n[this.faces[b].points[f]].push([b, f])
            }
            b = 0;
            for (q = this.points.length; b < q; b++) {
                var s = n[b].length;
                for (f = 0; f <
                    s; f++) {
                    var o = 1,
                        x = n[b][f][0],
                        u = n[b][f][1],
                        H = this.materials.length ? this.materials[this.faces[x].material].max_smooth : 60,
                        r = this.faces[x];
                    c && (a[x] === h && (a[x] = []), a[x][u] === h && (a[x][u] = []));
                    var t = Array(3);
                    t[0] = r.normal[0];
                    t[1] = r.normal[1];
                    t[2] = r.normal[2];
                    if (0 !== H)
                        for (e = 0; e < s; e++)
                            if (f !== e) {
                                var D = n[b][e][0],
                                    v = this.faces[D],
                                    y = g.angle(v.normal, r.normal);
                                if (y !== y || y * (180 / Math.PI) <= H) c && a[x][u].push(D), t[0] += v.normal[0], t[1] += v.normal[1], t[2] += v.normal[2], o++
                            }
                    t[0] /= o;
                    t[1] /= o;
                    t[2] /= o;
                    this.faces[x].point_normals[u] =
                        g.normalize(t)
                }
            }
            if (c) {
                b = g = 0;
                for (q = a.length; b < q; b++) {
                    f = 0;
                    for (e = a[b].length; f < e; f++) g += a[b][f].length
                }
                d.faceCount || (d.faceCount = new Uint8Array(3 * this.faces.length));
                d.faceNorm || (d.faceNorm = 65535 < this.faces.length ? new Uint32Array(g) : new Uint16Array(g));
                d.faceNormIdx || (d.faceNormIdx = 65535 < this.faces.length ? new Uint32Array(this.faces.length) : new Uint16Array(this.faces.length));
                b = g = 0;
                for (q = this.faces.length; b < q; b++)
                    for (f = 0; 3 > f; f++)
                        if (c = a[b][f], d.faceCount[3 * b + f] = c ? c.length : 0, d.faceNormIdx[b] = g, c) {
                            e = 0;
                            for (c =
                                c.length; e < c; e++) d.faceNorm[g++] = a[b][f][e]
                        } else g++;
                this.normalMapRef = d
            }
            return this
        },
        recalcNormals: function(d, g) {
            if (this.genNormals) {
                var c, a, b, f, e, q, n, s, o, x, g = g || {};
                if (d = d || this.normalMapRef) {
                    c = g.segments !== h ? !0 : !1;
                    a = g.segments;
                    this.calcFaceNormals();
                    var u = 0,
                        m = 0,
                        r = 0,
                        t;
                    if (c)
                        for (var m = this.dynamicData.VBO.dynamicMap, D = d.faceNormIdx, v = 0, y = a.length; v < y; v++)
                            for (var A = m.segmentMap[a[v]], C = 0, w = A.length; C < w; C++) {
                                c = A[C];
                                o = this.faces[c];
                                t = o.normal;
                                u = D[c];
                                for (j = 0; 3 > j; j++) {
                                    s = o.point_normals[j];
                                    e = t[0];
                                    q = t[1];
                                    n = t[2];
                                    x = d.faceCount[3 * c + j];
                                    b = 0;
                                    for (iMax = x; b < iMax; b++) f = d.faceNorm[u + b], f = this.faces[f], f = f.normal, e += f[0], q += f[1], n += f[2];
                                    x ? (b = x + 1, e /= b, q /= b, n /= b, b = Math.sqrt(e * e + q * q + n * n), e /= b, q /= b, n /= b, s[0] = e, s[1] = q, s[2] = n) : r++
                                }
                            } else {
                                c = 0;
                                for (a = this.faces.length; c < a; c++) {
                                    o = this.faces[c];
                                    t = o.normal;
                                    for (j = 0; 3 > j; j++) {
                                        s = o.point_normals[j];
                                        e = t[0];
                                        q = t[1];
                                        n = t[2];
                                        x = d.faceCount[m++];
                                        b = 0;
                                        for (iMax = x; b < iMax; b++) f = d.faceNorm[u++], f = this.faces[f], f = f.normal, e += f[0], q += f[1], n += f[2];
                                        x ? (b = x + 1, e /= b, q /= b, n /= b, b = Math.sqrt(e * e + q * q + n *
                                            n), e /= b, q /= b, n /= b, s[0] = e, s[1] = q, s[2] = n) : r++
                                    }
                                }
                            }
                    return this
                }
            }
        },
        removeDoubles: function(d) {
            var g = [],
                c = [],
                a, b, f, e;
            a = 0;
            for (b = this.points.length; a < b; a++) {
                var q = -1,
                    n = this.points[a];
                f = 0;
                for (e = g.length; f < e; f++)
                    if (m.vec3.equal(n, g[f], d)) {
                        q = f;
                        break
                    } - 1 != q ? c[a] = q : (c[a] = g.length, g.push(this.points[a]))
            }
            this.points = g;
            a = 0;
            for (b = this.faces.length; a < b; a++) {
                d = this.faces[a];
                f = 0;
                for (e = d.points.length; f < e; f++) d.points[f] = c[d.points[f]]
            }
            return this
        },
        buildEdges: function() {
            var d, g, c, a, b = [],
                f = [];
            d = 0;
            for (c = this.faces.length; d <
                c; d++) {
                var e = this.faces[d];
                g = 0;
                for (a = e.points.length; g < a; g++) {
                    var q, n, s;
                    s = e.segment;
                    matId = e.material;
                    g ? (n = e.points[g], q = e.points[g - 1]) : (n = e.points[g], q = e.points[a - 1]);
                    b[q] = b[q] || {};
                    b[q][matId] = b[q][matId] || {};
                    b[q][matId][s] = b[q][matId][s] || {};
                    !b[q][matId][s][n] && (!b[n] || !b[n][matId][s][q]) && f.push([matId, s, q, n])
                }
            }
            this.edges = f;
            return this
        },
        subdivide: function(d, g) {
            var c = m.vec3,
                g = g === h ? !0 : g;
            d === h && (d = 1);
            if (0 !== d) {
                var a, b, f, e, q, n = {},
                    s = [],
                    o = [],
                    x = this.points.length,
                    u = this.faces.length,
                    H = [],
                    z = [],
                    t = [],
                    D = [];
                a = 0;
                for (f = u; a < f; a++)
                    if (q = this.faces[a], q.points && (3 === q.points.length || 4 === q.points.length)) {
                        var v = [0, 0, 0];
                        b = 0;
                        for (e = q.points.length; b < e; b++) {
                            var y = this.points[q.points[b]];
                            v[0] += y[0];
                            v[1] += y[1];
                            v[2] += y[2]
                        }
                        v[0] /= e;
                        v[1] /= e;
                        v[2] /= e;
                        H[a] = this.addPoint(v);
                        if (q.uvs.length === q.points.length) {
                            v = [0, 0];
                            b = 0;
                            for (e = q.uvs.length; b < e; b++) y = q.uvs[b], v[0] += y[0], v[1] += y[1];
                            v[0] /= e;
                            v[1] /= e;
                            z[a] = v
                        }
                        if (q.point_colors.length === q.points.length) {
                            v = [0, 0, 0];
                            b = 0;
                            for (e = q.point_colors.length; b < e; b++) y = q.point_colors[b], v[0] +=
                                y[0], v[1] += y[1], v[2] += y[2];
                            v[0] /= e;
                            v[1] /= e;
                            v[2] /= e;
                            t[a] = v
                        }
                        if (q.point_normals.length === q.points.length) {
                            v = [0, 0, 0];
                            b = 0;
                            for (e = q.point_normals.length; b < e; b++) y = q.point_normals[b], v[0] += y[0], v[1] += y[1], v[2] += y[2];
                            v[0] /= e;
                            v[1] /= e;
                            v[2] /= e;
                            D[a] = v
                        }
                    }
                a = 0;
                for (f = this.faces.length; a < f; a++) {
                    q = this.faces[a];
                    b = 0;
                    for (e = q.points.length; b < e; b++) {
                        var A, C;
                        b ? (A = b, C = b - 1) : (A = b, C = e - 1);
                        y = q.points[A];
                        v = q.points[C];
                        n[v] = n[v] || {};
                        s[v] = s[v] || [];
                        s[v].push(a);
                        n[v][y] = {
                            face: a,
                            a: v,
                            b: y,
                            fpa: A,
                            fpb: C
                        }
                    }
                }
                for (a in n)
                    if (n.hasOwnProperty(a))
                        for (b in n[a])
                            if (n[a].hasOwnProperty(b)) {
                                f =
                                    n[a][b];
                                q = n[b][a];
                                if (q === h) {
                                    r("Mesh.subdivide error. Hole at face #" + f.face + ", Edge:[" + f.fpa + "->" + f.fpb + "], holes not yet supported; perhaps use Mesh.removeDoubles()?");
                                    return
                                }
                                f.edge_point || (e = c.multiply(c.add(this.points[f.a], this.points[f.b]), 0.5), g ? (v = c.multiply(c.add(this.points[H[f.face]], this.points[H[q.face]]), 0.5), f.edge_point = c.multiply(c.add(e, v), 0.5)) : f.edge_point = e, q.edge_point = f.edge_point, f.edge_avg = e, q.edge_avg = e, f.ep_idx = this.addPoint(f.edge_point), q.ep_idx = f.ep_idx);
                                o[f.a] = o[f.a] || [];
                                o[f.a].push(f.edge_avg);
                                e = this.faces[f.face].uvs;
                                e.length && (q = e[f.fpa], e = e[f.fpb], f.uv = [(q[0] + e[0]) / 2, (q[1] + e[1]) / 2]);
                                q = this.faces[f.face].point_colors;
                                q.length && (f.color = c.multiply(c.add(q[f.fpa], q[f.fpb]), 0.5));
                                q = this.faces[f.face].point_normals;
                                q.length && (f.normal = c.normalize(c.multiply(c.add(q[f.fpa], q[f.fpb]), 0.5)))
                            }
                if (g) {
                    q = [];
                    a = 0;
                    for (f = x; a < f; a++)
                        if (v = [0, 0, 0], s[a]) {
                            b = 0;
                            for (e = s[a].length; b < e; b++) y = this.points[H[s[a][b]]], v[0] += y[0], v[1] += y[1], v[2] += y[2];
                            v[0] /= e;
                            v[1] /= e;
                            v[2] /= e;
                            q[a] = v
                        }
                    v = [];
                    a = 0;
                    for (f = x; a < f; a++)
                        if (y = [0, 0, 0], o[a]) {
                            b = 0;
                            for (e = o[a].length; b < e; b++) A = o[a][b], y[0] += A[0], y[1] += A[1], y[2] += A[2];
                            y[0] /= e;
                            y[1] /= e;
                            y[2] /= e;
                            v[a] = y
                        }
                    a = 0;
                    for (f = x; a < f; a++) s[a] && (x = s[a].length, b = 1 / x, o = 2 / x, x = c.multiply(this.points[a], (x - 3) / x), x = c.add(x, c.multiply(q[a], b)), x = c.add(x, c.multiply(v[a], o)), this.points[a] = x)
                }
                for (a = 0; a < u; a++)
                    if (q = this.faces[a], !(3 !== q.points.length && 4 !== q.points.length))
                        if (c = q.points.slice(0), s = q.uvs.slice(0), b = q.point_colors.slice(0), o = q.point_normals.slice(0), x = s.length === c.length,
                            f = b.length === c.length, e = o.length === c.length, q = q.material, 3 === c.length) {
                            if (this.setFaceMaterial(q), v = n[c[0]][c[1]], y = n[c[2]][c[0]], this.addFace([c[0], v.ep_idx, H[a], y.ep_idx], a), x && (this.faces[a].uvs = [s[0], v.uv, z[a], y.uv]), f && (this.faces[a].point_colors = [b[0], v.color, t[a], y.color]), e && (this.faces[a].point_normals = [o[0], v.normal, D[a], y.normal]), v = n[c[1]][c[2]], y = n[c[0]][c[1]], q = this.addFace([c[1], v.ep_idx, H[a], y.ep_idx]), x && (this.faces[q].uvs = [s[1], v.uv, z[a], y.uv]), f && (this.faces[q].point_colors = [b[1],
                                    v.color, t[a], y.color
                                ]), e && (this.faces[q].point_normals = [o[1], v.normal, D[a], y.normal]), v = n[c[2]][c[0]], y = n[c[1]][c[2]], q = this.addFace([c[2], v.ep_idx, H[a], y.ep_idx]), x && (this.faces[q].uvs = [s[2], v.uv, z[a], y.uv]), f && (this.faces[q].point_colors = [b[2], v.color, t[a], y.color]), e) this.faces[q].point_normals = [o[2], v.normal, D[a], y.normal]
                        } else if (this.setFaceMaterial(q), v = n[c[0]][c[1]], y = n[c[3]][c[0]], this.addFace([c[0], v.ep_idx, H[a], y.ep_idx], a), x && (this.faces[a].uvs = [s[0], v.uv, z[a], y.uv]), f && (this.faces[a].point_colors = [b[0], v.color, t[a], y.color]), e && (this.faces[a].point_normals = [o[0], v.normal, D[a], y.normal]), v = n[c[1]][c[2]], y = n[c[0]][c[1]], q = this.addFace([c[1], v.ep_idx, H[a], y.ep_idx]), x && (this.faces[q].uvs = [s[1], v.uv, z[a], y.uv]), f && (this.faces[q].point_colors = [b[1], v.color, t[a], y.color]), e && (this.faces[q].point_normals = [o[1], v.normal, D[a], y.normal]), v = n[c[2]][c[3]], y = n[c[1]][c[2]], q = this.addFace([c[2], v.ep_idx, H[a], y.ep_idx]), x && (this.faces[q].uvs = [s[2], v.uv, z[a], y.uv]), f && (this.faces[q].point_colors = [b[2], v.color,
                        t[a], y.color
                    ]), e && (this.faces[q].point_normals = [o[2], v.normal, D[a], y.normal]), v = n[c[3]][c[0]], y = n[c[2]][c[3]], q = this.addFace([c[3], v.ep_idx, H[a], y.ep_idx]), x && (this.faces[q].uvs = [s[3], v.uv, z[a], y.uv]), f && (this.faces[q].point_colors = [b[3], v.color, t[a], y.color]), e) this.faces[q].point_normals = [o[3], v.normal, D[a], y.normal];
                d--;
                if (0 !== d) this.subdivide(d, g);
                else return this
            }
        },
        removeInternals: function() {
            var d, g, c, a, b, f = {},
                e = this.faces.length,
                q, n, s, o;
            d = 0;
            for (c = this.faces.length; d < c; d++) {
                b = this.faces[d];
                g =
                    0;
                for (a = b.points.length; g < a; g++) g ? (s = g, o = g - 1) : (s = g, o = a - 1), q = b.points[s], n = b.points[o], f[q] = f[q] || {}, f[q][n] === h ? f[q][n] = [d] : f[q][n].push(d)
            }
            c = function(a) {
                return -1 !== f[n][q].indexOf(a)
            };
            for (d = 0; d < e; d++) {
                b = this.faces[d];
                var x = null;
                g = 0;
                for (a = b.points.length; g < a; g++) g ? (s = g, o = g - 1) : (s = g, o = a - 1), q = b.points[s], n = b.points[o], x = x ? x.filter(c) : f[n][q];
                x.length && (this.faces.splice(d, 1), e--, d--)
            }
            return this
        },
        prepare: function(d) {
            d === h && (d = !0);
            this.buildWireframe && !this.triangulateWireframe && this.buildEdges();
            this.triangulateQuads();
            this.genNormals && this.calcNormals();
            this.buildWireframe && this.triangulateWireframe && this.buildEdges();
            this.compile();
            d && !this.dynamic && this.clean();
            return this
        },
        clean: function() {
            var d, g;
            d = 0;
            for (g = this.points.length; d < g; d++) delete this.points[d], this.points[d] = null;
            this.points = [];
            d = 0;
            for (g = this.faces.length; d < g; d++) delete this.faces[d].points, delete this.faces[d].point_normals, delete this.faces[d].uvs, delete this.faces[d].normal, delete this.faces[d], this.faces[d] = null;
            this.faces = [];
            return this
        },
        compileMap: function(d) {
            var g =
                m.vec3,
                c = m.vec2;
            d === h && (d = 1.0E-5);
            var a = {
                    segments: [],
                    bounds: []
                },
                b = [],
                f, e, q, n, s, o, x, u;
            this.materials.length || this.materials.push(new m.Material);
            f = 0;
            for (o = this.materials.length; f < o; f++) b[f] = [];
            f = 0;
            for (o = this.faces.length; f < o; f++) 3 === this.faces[f].points.length && (q = this.faces[f].material, n = this.faces[f].segment, b[q][n] === h && (b[q][n] = [], a.segments.push(n)), b[q][n].push(f));
            var r = [],
                z = 0,
                t = !1,
                D = !1,
                v = !1,
                y;
            f = 0;
            for (o = b.length; f < o; f++)
                for (e in b[f])
                    if (b[f].hasOwnProperty(e))
                        for (q = 0; q < b[f][e].length; q++) y =
                            b[f][e][q], t = t || 0 !== this.faces[y].uvs.length, D = D || 0 !== this.faces[y].point_normals.length, v = v || 0 !== this.faces[y].point_colors.length;
            if (t)
                for (f = 0; f < this.faces.length; f++)
                    if (!this.faces[f].uvs.length)
                        for (e = 0; e < this.faces[f].points.length; e++) this.faces[f].uvs.push([0, 0]);
            if (D)
                for (f = 0; f < this.faces.length; f++)
                    if (!this.faces[f].point_normals.length)
                        for (e = 0; e < this.faces[f].points.length; e++) this.faces[f].point_normals.push([0, 0, 0]);
            if (v)
                for (f = 0; f < this.faces.length; f++)
                    if (!this.faces[f].point_colors.length)
                        for (e =
                            0; e < this.faces[f].points.length; e++) this.faces[f].point_colors.push([0, 0, 0]);
            f = 0;
            for (o = b.length; f < o; f++)
                for (e in b[f])
                    if (b[f].hasOwnProperty(e)) {
                        q = 0;
                        for (x = b[f][e].length; q < x; q++) {
                            y = b[f][e][q];
                            for (n = 0; 3 > n; n++) {
                                var A = this.faces[y].points[n],
                                    C = -1;
                                if (r[A] !== h) {
                                    s = 0;
                                    for (u = r[A].length; s < u; s++) {
                                        var w = r[A][s][0],
                                            B = r[A][s][1],
                                            C = r[A][s][2];
                                        D && (C = g.equal(this.faces[w].point_normals[B], this.faces[y].point_normals[n], d) ? C : -1);
                                        t && (C = c.equal(this.faces[w].uvs[B], this.faces[y].uvs[n], d) ? C : -1);
                                        v && (C = g.equal(this.faces[w].point_colors[B],
                                            this.faces[y].point_colors[n], d) ? C : -1)
                                    }
                                } - 1 !== C ? (a.elements === h && (a.elements = []), a.elements[f] === h && (a.elements[f] = []), a.elements[f][e] === h && (a.elements[f][e] = []), a.elements[f][e].push(C)) : (a.points === h && (a.points = []), a.points.push(A), 0 === a.bounds.length ? (a.bounds[0] = [this.points[A][0], this.points[A][1], this.points[A][2]], a.bounds[1] = [this.points[A][0], this.points[A][1], this.points[A][2]]) : (this.points[A][0] < a.bounds[0][0] && (a.bounds[0][0] = this.points[A][0]), this.points[A][1] < a.bounds[0][1] && (a.bounds[0][1] =
                                        this.points[A][1]), this.points[A][2] < a.bounds[0][2] && (a.bounds[0][2] = this.points[A][2]), this.points[A][0] > a.bounds[1][0] && (a.bounds[1][0] = this.points[A][0]), this.points[A][1] > a.bounds[1][1] && (a.bounds[1][1] = this.points[A][1]), this.points[A][2] > a.bounds[1][2] && (a.bounds[1][2] = this.points[A][2])), D && (a.normals === h && (a.normals = []), a.normals.push([y, n])), v && (a.colors === h && (a.colors = []), a.colors.push([y, n])), t && (a.uvs === h && (a.uvs = []), a.uvs.push([y, n])), a.elements === h && (a.elements = []), a.elements[f] === h &&
                                    (a.elements[f] = []), a.elements[f][e] === h && (a.elements[f][e] = []), a.elements[f][e].push(z), r[A] === h && (r[A] = []), r[A].push([y, n, z]), z++)
                            }
                        }
                    }
            if (this.edges) {
                a.line_elements = [];
                f = 0;
                for (o = this.edges.length; f < o; f++) g = this.edges[f], q = g[0], n = g[1], d = g[2], g = g[3], a.line_elements[q] = a.line_elements[q] || [], a.line_elements[q][n] = a.line_elements[q][n] || [], a.line_elements[q][n].push(r[d][0][2]), a.line_elements[q][n].push(r[g][0][2])
            }
            a.dynamic = this.dynamic;
            return a
        },
        compileVBO: function(d, g, c, a, b, f, e, q) {
            "object" == typeof g ?
                (g = g.element !== h ? g.element : !0, c = g.vertex !== h ? g.vertex : !0, f = g.color !== h ? g.color : !0, a = g.normal !== h ? g.normal : !0, b = g.uv !== h ? g.uv : !0, e = g.lines !== h ? g.lines : !!d.line_elements, q = g.dynamic !== h ? g.dynamic : d.dynamic) : (g === h && (g = !0), c === h && (c = !0), f === h && (f = !0), a === h && (a = !0), b === h && (b = !0), e === h && (e = !!d.line_elements), q === h && (q = d.dynamic));
            var n = {},
                s, o, x, u, m, r, t, D, v;
            s = d.points.length || d.uvs.length || d.normals.length || d.colors.length;
            var y = 65535 < s;
            q && (v = {
                points: y ? new Uint32Array(d.points.length) : new Uint16Array(d.points.length),
                face_points: y ? new Uint32Array(2 * d.points.length) : new Uint16Array(2 * d.points.length),
                segments: null
            }, n.dynamicMap = v, n.dynamic = !0);
            if (c = d.points && c) {
                n.vbo_points = new Float32Array(3 * s);
                u = 0;
                for (r = s; u < r; u++) x = d.points[u], n.vbo_points[3 * u] = this.points[x][0], n.vbo_points[3 * u + 1] = this.points[x][1], n.vbo_points[3 * u + 2] = this.points[x][2], q && (v.points[u] = x)
            }
            if (q) {
                o = d.normals || d.colors || d.uvs;
                u = 0;
                for (r = o.length; u < r; u++) x = o[u], v.face_points[2 * u] = x[0], v.face_points[2 * u + 1] = x[1]
            }
            if (a = d.normals && a) {
                n.vbo_normals = new Float32Array(3 *
                    s);
                u = o = 0;
                for (r = s; u < r; u++) x = d.normals[u], n.vbo_normals[o++] = this.faces[x[0]].point_normals[x[1]][0], n.vbo_normals[o++] = this.faces[x[0]].point_normals[x[1]][1], n.vbo_normals[o++] = this.faces[x[0]].point_normals[x[1]][2]
            }
            if (f = d.colors && f) {
                n.vbo_colors = new Float32Array(3 * s);
                u = o = 0;
                for (r = s; u < r; u++) x = d.colors[u], n.vbo_colors[o++] = this.faces[x[0]].point_colors[x[1]][0], n.vbo_colors[o++] = this.faces[x[0]].point_colors[x[1]][1], n.vbo_colors[o++] = this.faces[x[0]].point_colors[x[1]][2]
            }
            if (b = d.uvs && b) {
                s = d.uvs.length;
                n.vbo_uvs = new Float32Array(2 * s);
                u = o = 0;
                for (r = s; u < r; u++) x = d.uvs[u], n.vbo_uvs[o++] = this.faces[x[0]].uvs[x[1]][0], n.vbo_uvs[o++] = this.faces[x[0]].uvs[x[1]][1]
            }
            s = [];
            x = 0;
            if (g) {
                n.elements_ref = [];
                n.vbo_elements = [];
                u = 0;
                for (r = d.elements.length; u < r; u++)
                    for (m in n.elements_ref[u] = [], g = 0, d.elements[u])
                        if (d.elements[u].hasOwnProperty(m)) {
                            D = d.elements[u][m];
                            o = 0;
                            for (t = D.length; o < t; o++) s.push(D[o]);
                            n.elements_ref[u][g] = [m | 0, D.length | 0];
                            g++
                        }
                x = s.length / 3;
                y || (n.vbo_elements = new Uint16Array(s))
            }
            n.segments = d.segments;
            n.bounds = d.bounds;
            if (e) {
                if (y) {
                    if (n.vbo_lines = [], a && (n.vbo_line_normals = []), b && (n.vbo_line_uvs = []), f) n.vbo_line_colors = []
                } else n.vbo_line_elements = [];
                n.line_elements_ref = [];
                u = 0;
                for (r = d.line_elements.length; u < r; u++)
                    for (m in n.line_elements_ref[u] = [], g = 0, d.line_elements[u])
                        if (d.line_elements[u].hasOwnProperty(m)) {
                            D = d.line_elements[u][m];
                            o = 0;
                            for (t = D.length; o < t; o++)
                                if (y) {
                                    if (e = D[o], n.vbo_lines.push(n.vbo_points[3 * e]), n.vbo_lines.push(n.vbo_points[3 * e + 1]), n.vbo_lines.push(n.vbo_points[3 * e + 2]), a && (n.vbo_line_normals.push(n.vbo_normals[3 *
                                            e]), n.vbo_line_normals.push(n.vbo_normals[3 * e + 1]), n.vbo_line_normals.push(n.vbo_normals[3 * e + 2])), f && (n.vbo_line_colors.push(n.vbo_colors[3 * e]), n.vbo_line_colors.push(n.vbo_colors[3 * e + 1]), n.vbo_line_colors.push(n.vbo_colors[3 * e + 2])), b) n.vbo_line_uvs.push(n.vbo_uvs[2 * e]), n.vbo_line_uvs.push(n.vbo_uvs[2 * e + 1])
                                } else n.vbo_line_elements.push(D[o]);
                            n.line_elements_ref[u][g] = [m | 0, D.length | 0];
                            g++
                        }
                if (y) {
                    if (n.vbo_lines = new Float32Array(n.vbo_lines), a && (n.vbo_line_normals = new Float32Array(n.vbo_line_normals)),
                        b && (n.vbo_line_uvs = new Float32Array(n.vbo_line_uvs)), f) n.vbo_line_colors = new Float32Array(n.vbo_line_colors)
                } else n.vbo_line_elements = new Uint16Array(n.vbo_line_elements)
            }
            if (y) {
                console.log("Mesh " + (this.name ? this.name + " " : "") + "exceeded element index limit -- unrolling " + x + " triangles..");
                var A, C, w, B;
                c && (A = new Float32Array(9 * x));
                a && (C = new Float32Array(9 * x));
                b && (w = new Float32Array(6 * x));
                f && (B = new Float32Array(9 * x));
                var I, J;
                q && (I = new Uint32Array(6 * x), J = new Uint32Array(3 * x));
                u = 0;
                for (r = x; u < r; u++)
                    if (m =
                        9 * u, y = 3 * s[3 * u], e = 3 * s[3 * u + 1], x = 3 * s[3 * u + 2], q && (g = 3 * u, o = 2 * g, I[o] = v.face_points[2 * s[g]], I[o + 1] = v.face_points[2 * s[g] + 1], I[o + 2] = v.face_points[2 * s[g + 1]], I[o + 3] = v.face_points[2 * s[g + 1] + 1], I[o + 4] = v.face_points[2 * s[g + 2]], I[o + 5] = v.face_points[2 * s[g + 2] + 1], J[g] = v.points[s[g]], J[g + 1] = v.points[s[g + 1]], J[g + 2] = v.points[s[g + 2]]), c && (A[m] = n.vbo_points[y], A[m + 1] = n.vbo_points[y + 1], A[m + 2] = n.vbo_points[y + 2], A[m + 3] = n.vbo_points[e], A[m + 4] = n.vbo_points[e + 1], A[m + 5] = n.vbo_points[e + 2], A[m + 6] = n.vbo_points[x], A[m + 7] = n.vbo_points[x +
                            1], A[m + 8] = n.vbo_points[x + 2]), a && (C[m] = n.vbo_normals[y], C[m + 1] = n.vbo_normals[y + 1], C[m + 2] = n.vbo_normals[y + 2], C[m + 3] = n.vbo_normals[e], C[m + 4] = n.vbo_normals[e + 1], C[m + 5] = n.vbo_normals[e + 2], C[m + 6] = n.vbo_normals[x], C[m + 7] = n.vbo_normals[x + 1], C[m + 8] = n.vbo_normals[x + 2]), b && (g = 2 * s[3 * u], o = 2 * s[3 * u + 1], t = 2 * s[3 * u + 2], w[6 * u] = n.vbo_uvs[g], w[6 * u + 1] = n.vbo_uvs[g + 1], w[6 * u + 2] = n.vbo_uvs[o], w[6 * u + 3] = n.vbo_uvs[o + 1], w[6 * u + 4] = n.vbo_uvs[t], w[6 * u + 5] = n.vbo_uvs[t + 1]), f) B[m] = n.vbo_colors[y], B[m + 1] = n.vbo_colors[y + 1], B[m + 2] = n.vbo_colors[y +
                        2], B[m + 3] = n.vbo_colors[e], B[m + 4] = n.vbo_colors[e + 1], B[m + 5] = n.vbo_colors[e + 2], B[m + 6] = n.vbo_colors[x], B[m + 7] = n.vbo_colors[x + 1], B[m + 8] = n.vbo_colors[x + 2];
                c && (n.vbo_points = A);
                a && (n.vbo_normals = C);
                b && (n.vbo_uvs = w);
                f && (n.vbo_colors = B);
                q && (delete v.points, delete v.face_points, v.points = J, v.face_points = I);
                n.unrolled = !0
            } else n.unrolled = !1;
            if (q && 1 < d.segments.length) {
                d = [];
                o = v.points;
                u = 0;
                for (r = o.length; u < r; u++) c = this.faces[v.face_points[2 * u]].segment || 0, d[c] === h && (d[c] = []), d[c].push(u);
                n.dynamicMap.segmentMap = d
            }
            return n
        },
        updateVBO: function(d, g) {
            if (!d.dynamic) return !1;
            var c, a, b = d.dynamicMap,
                f = g.points && !!d.vbo_points,
                e = g.normals && !!d.vbo_normals,
                q = g.uvs && !!d.vbo_uvs,
                n = g.colors && !!d.vbo_colors;
            a = g.segments;
            var s, o, m;
            if (g.segments !== h)
                for (var u = 0, r = a.length; u < r; u++)
                    for (var z = b.segmentMap[a[u]], t = 0, D = z.length; t < D; t++) {
                        if (c = z[t], o = this.faces[b.face_points[2 * c]], m = b.face_points[2 * c + 1], f && (s = this.points[b.points[c]], d.vbo_points[3 * c] = s[0], d.vbo_points[3 * c + 1] = s[1], d.vbo_points[3 * c + 2] = s[2]), e && (s = o.point_normals[m], d.vbo_normals[3 *
                                c] = s[0], d.vbo_normals[3 * c + 1] = s[1], d.vbo_normals[3 * c + 2] = s[2]), n && (s = o.point_colors[m], d.vbo_colors[3 * c] = s[0], d.vbo_colors[3 * c + 1] = s[1], d.vbo_colors[3 * c + 2] = s[2]), q) s = o.uvs[m], d.vbo_uvs[2 * c] = s[0], d.vbo_uvs[2 * c + 1] = s[1]
                    } else {
                        c = 0;
                        for (a = b.points.length; c < a; c++) {
                            o = this.faces[b.face_points[2 * c]];
                            m = b.face_points[2 * c + 1];
                            if (!o) {
                                console.log(b.face_points[2 * c]);
                                return
                            }
                            f && (s = this.points[b.points[c]], d.vbo_points[3 * c] = s[0], d.vbo_points[3 * c + 1] = s[1], d.vbo_points[3 * c + 2] = s[2]);
                            e && (s = o.point_normals[m], d.vbo_normals[3 *
                                c] = s[0], d.vbo_normals[3 * c + 1] = s[1], d.vbo_normals[3 * c + 2] = s[2]);
                            n && (s = o.point_colors[m], d.vbo_colors[3 * c] = s[0], d.vbo_colors[3 * c + 1] = s[1], d.vbo_colors[3 * c + 2] = s[2]);
                            q && (s = o.uvs[m], d.vbo_uvs[2 * c] = s[0], d.vbo_uvs[2 * c + 1] = s[1])
                        }
                    }
            return this
        },
        rebufferVBO: function(d, g, c) {
            var a = o.gl;
            c.points && (a.bindBuffer(a.ARRAY_BUFFER, g.gl_points), a.bufferData(a.ARRAY_BUFFER, d.vbo_points, a.DYNAMIC_DRAW));
            c.normals && d.vbo_normals && (a.bindBuffer(a.ARRAY_BUFFER, g.gl_normals), a.bufferData(a.ARRAY_BUFFER, d.vbo_normals, a.DYNAMIC_DRAW));
            c.uvs && d.vbo_uvs && (a.bindBuffer(a.ARRAY_BUFFER, g.gl_uvs), a.bufferData(a.ARRAY_BUFFER, d.vbo_uvs, a.DYNAMIC_DRAW));
            c.colors && d.vbo_colors && (a.bindBuffer(a.ARRAY_BUFFER, g.gl_colors), a.bufferData(a.ARRAY_BUFFER, d.vbo_colors, a.DYNAMIC_DRAW));
            a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, null);
            return this
        },
        bufferVBO: function(d, g) {
            var c = o.gl,
                a = {};
            g === h && (g = {});
            a.gl_points = c.createBuffer();
            c.bindBuffer(c.ARRAY_BUFFER, a.gl_points);
            c.bufferData(c.ARRAY_BUFFER, d.vbo_points, c.STATIC_DRAW);
            d.vbo_normals ? (a.gl_normals = c.createBuffer(),
                c.bindBuffer(c.ARRAY_BUFFER, a.gl_normals), c.bufferData(c.ARRAY_BUFFER, d.vbo_normals, c.STATIC_DRAW)) : a.gl_normals = g.gl_normals ? g.gl_normals : null;
            d.vbo_uvs ? (a.gl_uvs = c.createBuffer(), c.bindBuffer(c.ARRAY_BUFFER, a.gl_uvs), c.bufferData(c.ARRAY_BUFFER, d.vbo_uvs, c.STATIC_DRAW)) : a.gl_uvs = g.gl_uvs ? g.gl_uvs : null;
            d.vbo_colors ? (a.gl_colors = c.createBuffer(), c.bindBuffer(c.ARRAY_BUFFER, a.gl_colors), c.bufferData(c.ARRAY_BUFFER, d.vbo_colors, c.STATIC_DRAW)) : a.gl_colors = g.gl_colors ? g.gl_colors : null;
            !d.vbo_elements &&
                g.gl_elements ? (a.gl_elements = g.gl_elements, a.elements_ref = g.elements_ref) : (d.vbo_elements.length && (a.gl_elements = c.createBuffer(), c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, a.gl_elements), c.bufferData(c.ELEMENT_ARRAY_BUFFER, d.vbo_elements, c.STATIC_DRAW)), a.elements_ref = d.elements_ref);
            !d.vbo_line_elements && g.gl_line_elements ? (a.gl_line_elements = g.gl_line_elements, a.line_elements_ref = g.line_elements_ref) : d.vbo_line_elements && (a.gl_line_elements = c.createBuffer(), c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, a.gl_line_elements),
                c.bufferData(c.ELEMENT_ARRAY_BUFFER, d.vbo_line_elements, c.STATIC_DRAW), a.line_elements_ref = d.line_elements_ref);
            !d.vbo_lines && g.gl_lines ? a.gl_lines = g.gl_lines : d.vbo_lines ? (a.gl_lines = c.createBuffer(), c.bindBuffer(c.ARRAY_BUFFER, a.gl_lines), c.bufferData(c.ARRAY_BUFFER, d.vbo_lines, c.STATIC_DRAW), a.line_elements_ref = d.line_elements_ref) : a.gl_lines = null;
            !d.vbo_line_colors && g.gl_line_colors ? a.gl_line_colors = g.gl_line_colors : d.vbo_line_colors ? (a.gl_line_colors = c.createBuffer(), c.bindBuffer(c.ARRAY_BUFFER,
                a.gl_line_colors), c.bufferData(c.ARRAY_BUFFER, d.vbo_line_colors, c.STATIC_DRAW)) : a.gl_line_colors = null;
            !d.vbo_line_uvs && g.gl_line_uvs ? a.gl_line_uvs = g.gl_line_uvs : d.vbo_line_uvs ? (a.gl_line_uvs = c.createBuffer(), c.bindBuffer(c.ARRAY_BUFFER, a.gl_line_uvs), c.bufferData(c.ARRAY_BUFFER, d.vbo_line_uvs, c.STATIC_DRAW)) : a.gl_line_uvs = null;
            !d.vbo_line_normals && g.gl_line_normals ? a.gl_line_normals = g.gl_line_normals : d.vbo_line_normals ? (a.gl_line_normals = c.createBuffer(), c.bindBuffer(c.ARRAY_BUFFER, a.gl_line_normals),
                c.bufferData(c.ARRAY_BUFFER, d.vbo_line_normals, c.STATIC_DRAW)) : a.gl_line_normals = null;
            a.segments = d.segments;
            a.bounds = d.bounds;
            a.unrolled = d.unrolled;
            c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, null);
            return a
        },
        update: function(d) {
            var d = d || {},
                g = !0;
            d.points !== h && (g = d.points);
            var c = d.uvs || d.uv || d.texture || d.all || !1,
                a = !0;
            d.normals !== h && (a = d.normals);
            var b = d.colors || d.color || d.all || !1,
                d = d.segments || d.segment;
            d !== h && d.length === h && (d = [d]);
            if (!this.dynamic) return r("Mesh not defined as dynamic, cannot update."), !1;
            a && this.normalMapRef && this.recalcNormals(h, {
                segments: d
            });
            g = {
                points: g,
                uvs: c,
                normals: a,
                colors: b,
                segments: d
            };
            this.updateVBO(this.dynamicData.VBO, g);
            this.rebufferVBO(this.dynamicData.VBO, this.dynamicData.buffer, g)
        },
        bindBuffer: function(d) {
            null === this.originBuffer && (this.originBuffer = d);
            this.compiled = d;
            this.segment_state = [];
            for (var g = 0, c = d.segments.length; g < c; g++) this.segment_state[d.segments[g]] = !0;
            this.bb = d.bounds
        },
        compile: function(d) {
            if (0 < this.faces.length && 0 < this.points.length) {
                var d = this.compileVBO(this.compileMap(d)),
                    g = this.bufferVBO(d);
                this.bindBuffer(g);
                if (this.dynamic) {
                    this.sourcePoints = [];
                    for (var c = 0, a = this.points.length; c < a; c++) this.sourcePoints[c] = this.points[c].slice(0);
                    this.dynamicData = {
                        VBO: d,
                        buffer: g
                    }
                }
            }
            return this
        },
        addMorphTarget: function(d) {
            null === this.morphTargets && (this.morphTargets = []);
            this.morphTargets.push(d)
        },
        setMorphSource: function(d) {
            this.morphSourceIndex !== d && (this.morphSourceIndex = d, this.bindBuffer(this.morphTargets[d]))
        },
        setMorphTarget: function(d) {
            this.morphTargetIndex !== d && (this.morphTargetIndex =
                d, this.morphTarget = this.morphTargets[d])
        },
        setMorphWeight: function(d) {
            this.morphWeight = d
        },
        morphTargetCount: function() {
            return null !== this.morphTargets ? this.morphTargets.length : 0
        }
    };
    t.prototype.triangulateQuads = t.prototype.triangulate;
    return {
        Mesh: t,
        Face: w
    }
});
CubicVR.RegisterModule("UVMapper", function(m) {
    function w(c) {
        c = m.get(c) || {};
        this.rotation = c.rotation === t ? [0, 0, 0] : c.rotation;
        this.scale = c.scale === t ? [1, 1, 1] : c.scale;
        this.center = c.center === t ? [0, 0, 0] : c.center;
        this.projection_mode = c.projectionMode === t ? h.uv.projection.PLANAR : m.parseEnum(h.uv.projection, c.projectionMode);
        this.projection_axis = c.projectionAxis === t ? h.uv.axis.X : m.parseEnum(h.uv.axis, c.projectionAxis);
        this.wrap_w_count = c.wrapW === t ? 1 : c.wrapW;
        this.wrap_h_count = c.wrapH === t ? 1 : c.wrapH
    }
    var t = m.undef,
        h = m.enums,
        o = 2 * Math.PI,
        r = Math.PI / 2;
    h.uv = {
        axis: {
            X: 0,
            Y: 1,
            Z: 2
        },
        projection: {
            UV: 0,
            PLANAR: 1,
            CYLINDRICAL: 2,
            SPHERICAL: 3,
            CUBIC: 4,
            SKY: 5
        }
    };
    var d = function(c, a, b) {
            return 0 === c && 0 === b ? 0 : 0 === b ? 0 > c ? r : -r : 0 > b ? -Math.atan(c / b) + Math.PI : -Math.atan(c / b)
        },
        g = function(c, a, b) {
            var f;
            0 === c && 0 === b ? (f = 0, c = 0 !== a ? 0 > a ? -r : r : 0) : (f = 0 === b ? 0 > c ? r : -r : 0 > b ? -Math.atan(c / b) + Math.PI : -Math.atan(c / b), c = Math.sqrt(c * c + b * b), c = 0 === c ? 0 > a ? -r : r : Math.atan(a / c));
            return [f, c]
        };
    w.prototype = {
        setRotation: function(c) {
            this.rotation = c
        },
        setScale: function(c) {
            this.scale =
                c
        },
        setCenter: function(c) {
            this.center = c
        },
        setProjectionAxis: function(c) {
            this.projection_axis = c
        },
        setProjectionMode: function(c) {
            this.projection_mode = c
        },
        setWrapW: function(c) {
            this.wrap_w_count = c
        },
        setWrapH: function(c) {
            this.wrap_h_count = c
        },
        apply: function(c, a, b, f, e) {
            var q = m.mat4,
                n, s, F, x, u, H = new m.Transform,
                z = !1,
                E = null;
            if (this.center[0] || this.center[1] || this.center[2]) H.translate(-this.center[0], -this.center[1], -this.center[2]), z = !0;
            if (this.rotation[0] || this.rotation[1] || this.rotation[2]) this.rotation[0] &&
                H.rotate(this.rotation[2], 0, 0, 1), this.rotation[1] && H.rotate(this.rotation[1], 0, 1, 0), this.rotation[2] && H.rotate(this.rotation[0], 1, 0, 0), z = !0;
            z && (E = H.getResult());
            "object" === typeof a && (a = c.materials.indexOf(a));
            var H = 0,
                D = c.faces.length;
            f && (H = f);
            for (e && (D = e + 1); H < D; H++)
                if (c.faces[H].material === a && !(b !== t && c.faces[H].segment !== b)) {
                    var v, y, A;
                    if (this.projection_mode === h.uv.projection.CUBIC || this.projection_mode === h.uv.projection.SKY) v = Math.abs(c.faces[H].normal[0]), y = Math.abs(c.faces[H].normal[1]), A = Math.abs(c.faces[H].normal[2]);
                    for (var f = [], e = 0, C = c.faces[H].points.length; e < C; e++) {
                        s = c.faces[H].points[e];
                        var w = c.faces[H].points[(e + 1) % 3],
                            B = c.faces[H].points[(e + 2) % 3];
                        n = c.points[s];
                        var I = c.points[w],
                            J = c.points[B],
                            K;
                        z && (n = q.vec3_multiply(n, E));
                        K = this.projection_mode;
                        if (K === h.uv.projection.SKY) s = c.sky_mapping, v >= y && v >= A && (F = n[2] / this.scale[2] + this.scale[2] / 2, x = -n[1] / this.scale[1] + this.scale[1] / 2, 0 > c.faces[H].normal[0] ? (F = (s[2][2] - s[2][0]) * (1 - F), x = 1 - (s[2][3] - s[2][1]) * x, F += s[2][0], x += s[2][1]) : (F *= s[3][2] - s[3][0], x = 1 - (s[3][3] - s[3][1]) *
                            x, F += s[3][0], x += s[3][1])), y >= v && y >= A && (F = n[0] / this.scale[0] + this.scale[0] / 2, x = -n[2] / this.scale[2] + this.scale[2] / 2, 0 > c.faces[H].normal[1] ? (F *= s[1][2] - s[1][0], x = 1 - (s[1][3] - s[1][1]) * x, F += s[1][0], x -= s[1][1]) : (F *= s[0][2] - s[0][0], x = 1 - (s[0][3] - s[0][1]) * x, F += s[0][0], x -= s[0][1])), A >= v && A >= y && (F = n[0] / this.scale[0] + this.scale[0] / 2, x = n[1] / this.scale[1] + this.scale[1] / 2, 0 > c.faces[H].normal[2] ? (F *= s[4][2] - s[4][0], x = 1 - (s[4][3] - s[4][1]) * (1 - x), F += s[4][0], x -= s[4][1]) : (F = (s[5][2] - s[5][0]) * (1 - F), x = 1 - (s[5][3] - s[5][1]) *
                            (1 - x), F += s[5][0], x += s[5][1])), c.faces[H].setUV([F, x], e);
                        else if (K === h.uv.projection.CUBIC) v >= y && v >= A && (F = n[2] / this.scale[2] + 0.5, x = n[1] / this.scale[1] + 0.5), y >= v && y >= A && (F = -n[0] / this.scale[0] + 0.5, x = n[2] / this.scale[2] + 0.5), A >= v && A >= y && (F = -n[0] / this.scale[0] + 0.5, x = n[1] / this.scale[1] + 0.5), 0 < c.faces[H].normal[0] && (F = -F), 0 > c.faces[H].normal[1] && (F = -F), 0 < c.faces[H].normal[2] && (F = -F), c.faces[H].setUV([F, x], e);
                        else if (K === h.uv.projection.PLANAR) F = this.projection_axis === h.uv.axis.X ? n[2] / this.scale[2] + 0.5 : -n[0] /
                            this.scale[0] + 0.5, x = this.projection_axis === h.uv.axis.Y ? n[2] / this.scale[2] + 0.5 : n[1] / this.scale[1] + 0.5, c.faces[H].setUV([F, x], e);
                        else {
                            if (K === h.uv.projection.CYLINDRICAL) K = this.projection_axis, K === h.uv.axis.X ? (u = d(n[2], n[0], -n[1]), x = -n[0] / this.scale[0] + 0.5) : K === h.uv.axis.Y ? (u = d(-n[0], n[1], n[2]), x = -n[1] / this.scale[1] + 0.5) : K === h.uv.axis.Z && (u = d(-n[0], n[2], -n[1]), x = -n[2] / this.scale[2] + 0.5), u = 1 - u / o, 1 !== this.wrap_w_count && (u *= this.wrap_w_count), n = u, s = x;
                            else if (K === h.uv.projection.SPHERICAL) {
                                var M, L, N;
                                K = this.projection_axis;
                                K === h.uv.axis.X ? (M = f[s] ? f[s] : g(n[2], n[0], -n[1]), f[s] || (f[s] = M), L = f[w] ? f[w] : g(I[2], I[0], -I[1]), f[w] || (f[w] = L), N = f[B] ? f[B] : g(J[2], J[0], -J[1]), f[B] || (f[B] = N)) : K === h.uv.axis.Y ? (M = f[s] ? f[s] : g(n[0], -n[1], n[2]), f[s] || (f[s] = M), L = f[w] ? f[w] : g(I[0], -I[1], I[2]), f[w] || (f[w] = L), N = f[B] ? f[B] : g(J[0], -J[1], J[2]), f[B] || (f[B] = N)) : K === h.uv.axis.Z && (M = f[s] ? f[s] : g(-n[0], n[2], -n[1]), f[s] || (f[s] = M), L = f[w] ? f[w] : g(-I[0], I[2], -I[1]), f[w] || (f[w] = L), N = f[B] ? f[B] : g(-J[0], J[2], -J[1]), f[B] || (f[B] = N));
                                Math.abs(M[0] - L[0]) > r && Math.abs(M[0] -
                                    N[0]) > r && (M[0] = M[0] > L[0] && M[0] > N[0] ? M[0] - o : M[0] + o);
                                Math.abs(M[1] - L[1]) > r && Math.abs(M[1] - N[1]) > r && (M[1] = M[1] > L[1] && M[1] > N[1] ? M[1] - o : M[1] + o);
                                u = 1 - M[0] / o;
                                s = 0.5 - M[1] / Math.PI;
                                1 !== this.wrap_w_count && (u *= this.wrap_w_count);
                                1 !== this.wrap_h_count && (s *= this.wrap_h_count);
                                n = u
                            } else s = n = 0;
                            c.faces[H].setUV([n, s], e)
                        }
                    }
                }
            return this
        }
    };
    return {
        UVMapper: w
    }
});
CubicVR.RegisterModule("Renderer", function(m) {
    var w = m.undef;
    return {
        renderObject: function(t, h, o, r, d, g, c, a) {
            var b = !1,
                d = d || !1,
                g = g || !1;
            if (null !== t.compiled) {
                var f = 0,
                    e = m.GLCore.gl,
                    q, n = r === w ? 0 : r.length,
                    s, F = 0,
                    x, u = null,
                    H = t.instanceMaterials || t.materials,
                    c = (t.wireframe || c) && t.compiled.line_elements_ref,
                    a = (t.pointMode || a) && t.compiled.line_elements_ref,
                    z = e.TRIANGLES;
                c ? z = e.LINES : a && (z = e.POINTS);
                var E = c || a ? t.compiled.line_elements_ref : t.compiled.elements_ref,
                    D = !1,
                    v, y, A;
                e.depthFunc(e.LEQUAL);
                o === w && (o = cubicvr_identity);
                for (var C = 0, G = E.length; C < G; C++) {
                    var u = c && t.wireframeMaterial ? t.wireframeMaterial : a && t.pointModeMaterial ? t.pointModeMaterial : H[C],
                        B = 0,
                        F = !1;
                    if (1 > u.opacity && d) b = !0;
                    else if (!(g && 1 <= u.opacity)) {
                        1 !== u.opacity ? (e.enable(e.BLEND), e.depthMask(0), e.blendFunc(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA)) : (e.depthMask(1), e.disable(e.BLEND), e.blendFunc(e.ONE, e.ONE));
                        for (var I = 0, J = E[C].length; I < J; I++)
                            if (x = E[C][I][0], F = !1, q = E[C][I][1], B += q, u.visible) {
                                if (!t.segment_state[x])
                                    if (B > q) {
                                        f += 2 * q;
                                        B -= q;
                                        if (n) {
                                            y = !1;
                                            for (v = 0; v < n;) {
                                                q = n -
                                                    v;
                                                q > m.MAX_LIGHTS && (q = m.MAX_LIGHTS);
                                                0 < v && !y && (e.enable(e.BLEND), e.blendFunc(e.ONE, e.ONE), e.depthFunc(e.EQUAL), y = !0);
                                                s = r[v];
                                                A = s.light_type;
                                                for (F = 0; F < q; F++)
                                                    if (r[F + v].light_type != A) {
                                                        q = F;
                                                        break
                                                    }
                                                u.use(s.light_type, q);
                                                s = u.shader[s.light_type][q];
                                                e.uniformMatrix4fv(s.matrixModelView, !1, h.mvMatrix);
                                                e.uniformMatrix4fv(s.matrixProjection, !1, h.pMatrix);
                                                e.uniformMatrix4fv(s.matrixObject, !1, o);
                                                e.uniformMatrix3fv(s.matrixNormal, !1, h.nMatrix);
                                                D || (u.bindObject(t, s), D = -1 != s.vertexTexCoord, (c || a) && u.bindLines(t, s));
                                                for (F = 0; F < q; F++) r[F + v].setupShader(s, F);
                                                t.compiled.unrolled ? e.drawArrays(z, f, B) : e.drawElements(z, B, e.UNSIGNED_SHORT, f);
                                                v += q
                                            }
                                            y && (e.disable(e.BLEND), e.depthFunc(e.LEQUAL))
                                        } else u.use(0, 0), e.uniformMatrix4fv(u.shader[0][0].matrixModelView, !1, h.mvMatrix), e.uniformMatrix4fv(u.shader[0][0].matrixProjection, !1, h.pMatrix), e.uniformMatrix4fv(u.shader[0][0].matrixObject, !1, o), e.uniformMatrix3fv(u.shader[0][0].matrixNormal, !1, h.nMatrix), D || (u.bindObject(t, u.shader[0][0]), D = -1 != u.shader[0][0].vertexTexCoord,
                                            (c || a) && u.bindLines(t, u.shader[0][0])), t.compiled.unrolled ? e.drawArrays(z, f, B) : e.drawElements(z, B, e.UNSIGNED_SHORT, f);
                                        f += 2 * B;
                                        B = 0;
                                        F = !0
                                    } else f += 2 * B, B = 0
                            } else f += 2 * q, B -= q;
                        if (!F && t.segment_state[x] && u.visible) {
                            if (n) {
                                y = !1;
                                for (v = 0; v < n;) {
                                    q = n - v;
                                    q > m.MAX_LIGHTS && (q = m.MAX_LIGHTS);
                                    0 < v && !y && (e.enable(e.BLEND), e.blendFunc(e.ONE, e.ONE), e.depthFunc(e.EQUAL), y = !0);
                                    s = r[v];
                                    A = s.light_type;
                                    for (F = 0; F < q; F++)
                                        if (r[F + v].light_type != A) {
                                            q = F;
                                            break
                                        }
                                    u.use(s.light_type, q);
                                    s = u.shader[s.light_type][q];
                                    e.uniformMatrix4fv(s.matrixModelView, !1, h.mvMatrix);
                                    e.uniformMatrix4fv(s.matrixProjection, !1, h.pMatrix);
                                    e.uniformMatrix4fv(s.matrixObject, !1, o);
                                    e.uniformMatrix3fv(s.matrixNormal, !1, h.nMatrix);
                                    D || (u.bindObject(t, s), D = -1 != s.vertexTexCoord, (c || a) && u.bindLines(t, s));
                                    for (F = 0; F < q; F++) r[F + v].setupShader(s, F);
                                    t.compiled.unrolled ? e.drawArrays(z, f, B) : e.drawElements(z, B, e.UNSIGNED_SHORT, f);
                                    v += q
                                }
                                y && (e.disable(e.BLEND), e.depthFunc(e.LEQUAL))
                            } else u.use(0, 0), e.uniformMatrix4fv(u.shader[0][0].matrixModelView, !1, h.mvMatrix), e.uniformMatrix4fv(u.shader[0][0].matrixProjection, !1, h.pMatrix), e.uniformMatrix4fv(u.shader[0][0].matrixObject, !1, o), e.uniformMatrix3fv(u.shader[0][0].matrixNormal, !1, h.nMatrix), D || (u.bindObject(t, u.shader[0][0]), D = -1 != u.shader[0][0].vertexTexCoord, (c || a) && u.bindLines(t, u.shader[0][0])), t.compiled.unrolled ? e.drawArrays(z, f, B) : e.drawElements(z, B, e.UNSIGNED_SHORT, f);
                            f += 2 * B
                        }
                    }
                }
                u && s ? u.clearObject(t, s) : u.clearObject(t, null);
                e.depthMask(1);
                e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null);
                return b
            }
        }
    }
});
CubicVR.RegisterModule("Light", function(m) {
    function w(d, g) {
        var c = m.aabb,
            d = m.get(d) || {};
        d === o && (d = h.light.type.POINT);
        g === o && (g = h.light.method.DYNAMIC);
        "object" == typeof d ? (this.light_type = d.type !== o ? m.parseEnum(h.light.type, d.type) : h.light.type.POINT, this.diffuse = d.diffuse !== o ? d.diffuse : [1, 1, 1], this.specular = d.specular !== o ? d.specular : [1, 1, 1], this.intensity = d.intensity !== o ? d.intensity : 1, this.position = d.position !== o ? d.position : [0, 0, 0], this.direction = d.direction !== o ? d.direction : [0, 0, 0], this.distance =
            d.distance !== o ? d.distance : this.light_type === h.light.type.AREA ? 30 : 10, this.cutoff = d.cutoff !== o ? d.cutoff : 60, this.map_res = d.map_res !== o ? d.map_res : this.light_type === h.light.type.AREA ? 2048 : 512, this.map_res = d.mapRes !== o ? d.mapRes : this.map_res, this.method = d.method !== o ? m.parseEnum(h.light.method, d.method) : g, this.areaCam = d.areaCam !== o ? d.areaCam : null, this.areaCeiling = d.areaCeiling !== o ? d.areaCeiling : 40, this.areaFloor = d.areaFloor !== o ? d.areaFloor : -40, this.areaAxis = d.areaAxis !== o ? d.areaAxis : [1, 1, 0], this.projectorTex =
            d.projector !== o ? d.projector : null) : (this.light_type = m.parseEnum(h.light.type, d), this.diffuse = [1, 1, 1], this.specular = [1, 1, 1], this.intensity = 1, this.position = [0, 0, 0], this.direction = [0, 0, 0], this.distance = this.light_type === h.light.type.AREA ? 30 : 10, this.cutoff = 60, this.map_res = this.light_type === h.light.type.AREA ? 2048 : 512, this.method = m.parseEnum(h.light.method, g), this.areaCam = null, this.areaCeiling = 40, this.areaFloor = -40, this.areaAxis = [1, 1, 0], this.projectorTex = null);
        this.target = d.target || null;
        if (this.projectorTex &&
            "string" === typeof this.projectorTex) {
            var a = this.projectorTex;
            this.projectorTex = m.Textures_ref[a] !== o ? m.Textures_obj[m.Textures_ref[a]] : new m.Texture(a)
        }
        this.setType(this.light_type);
        this.lposition = [0, 0, 0];
        this.dirty = !0;
        this.octree_leaves = [];
        this.octree_common_root = null;
        this.octree_aabb = [
            [0, 0, 0],
            [0, 0, 0]
        ];
        this.ignore_octree = !1;
        this.was_culled = this.culled = this.visible = !0;
        this.aabb = [
            [0, 0, 0],
            [0, 0, 0]
        ];
        c.reset(this.aabb, this.position);
        this.adjust_octree = m.SceneObject.prototype.adjust_octree;
        this.motion =
            null;
        this.rotation = [0, 0, 0];
        (this.light_type === h.light.type.SPOT_SHADOW || this.light_type === h.light.type.SPOT_SHADOW_PROJECTOR || this.light_type === h.light.type.AREA && m.features.lightShadows) && this.setShadow(this.map_res);
        this.lDir = [0, 0, 0];
        this.lPos = [0, 0, 0];
        this.parent = null
    }
    var t = m.GLCore,
        h = m.enums,
        o = m.undef,
        r = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    h.light = {
        type: {
            NULL: 0,
            POINT: 1,
            DIRECTIONAL: 2,
            SPOT: 3,
            AREA: 4,
            DEPTH_PACK: 5,
            SPOT_SHADOW: 6,
            SPOT_SHADOW_PROJECTOR: 7,
            MAX: 8
        },
        method: {
            GLOBAL: 0,
            STATIC: 1,
            DYNAMIC: 2
        }
    };
    w.prototype = {
        get x() {
            return this.position[0]
        },
        set x(d) {
            this.position[0] = d
        },
        get y() {
            return this.position[1]
        },
        set y(d) {
            this.position[1] = d
        },
        get z() {
            return this.position[2]
        },
        set z(d) {
            this.position[2] = d
        },
        get rotX() {
            return this.rotation[0]
        },
        set rotX(d) {
            this.rotation[0] = d
        },
        get rotY() {
            return this.rotation[1]
        },
        set rotY(d) {
            this.rotation[1] = d
        },
        get rotZ() {
            return this.rotation[2]
        },
        set rotZ(d) {
            this.rotation[2] = d
        },
        get dirX() {
            return this.direction[0]
        },
        set dirX(d) {
            this.direction[0] = d
        },
        get dirY() {
            return this.direction[1]
        },
        set dirY(d) {
            this.direction[1] =
                d
        },
        get dirZ() {
            return this.direction[2]
        },
        set dirZ(d) {
            this.direction[2] = d
        },
        get pos() {
            return this.position.slice(0)
        },
        set pos(d) {
            this.position = d.slice(0)
        },
        get rot() {
            return this.rotation.slice(0)
        },
        set rot(d) {
            this.rotation = d.slice(0)
        },
        get dir() {
            return this.direction.slice(0)
        },
        set dir(d) {
            this.direction = vec3.normalize(d.slice(0))
        },
        setType: function(d) {
            if (d === h.light.type.AREA && !m.features.lightShadows) this.dummyCam = new m.Camera, this.areaCam = new m.Camera, this.updateAreaLight(), this.areaCam = this.dummyCam = null,
                d = h.light.type.DIRECTIONAL;
            else if ((d === h.light.type.SPOT_SHADOW || d === h.light.type.SPOT_SHADOW_PROJECTOR) && !m.features.lightShadows) d = h.light.type.SPOT;
            this.light_type = d
        },
        setParent: function(d) {
            this.parent = d
        },
        setMethod: function(d) {
            this.method = d
        },
        setDiffuse: function(d) {
            this.diffuse = d
        },
        setSpecular: function(d) {
            this.specular = d
        },
        setIntensity: function(d) {
            this.intensity = d
        },
        setPosition: function(d) {
            this.position = d
        },
        setDistance: function(d) {
            this.distance = d
        },
        setCutoff: function(d) {
            this.cutoff = d
        },
        setTarget: function(d) {
            this.target =
                d.slice(0)
        },
        prepare: function(d) {
            var g = m.mat4,
                c = m.mat3,
                a = this.light_type;
            this.target && this.lookat(this.target);
            this.parent ? a === h.light.type.SPOT || a === h.light.type.SPOT_SHADOW || a === h.light.type.SPOT_SHADOW_PROJECTOR ? (a = g.inverse_mat3(this.parent.tMatrix), c.transpose_inline(a), this.lDir = c.vec3_multiply(this.direction, a), this.lDir = c.vec3_multiply(this.lDir, d.nMatrix), this.lPos = g.vec3_multiply(this.position, g.multiply(d.mvMatrix, this.parent.tMatrix))) : a === h.light.type.POINT && (this.lPos = g.vec3_multiply(this.position,
                g.multiply(d.mvMatrix, this.parent.tMatrix))) : a === h.light.type.DIRECTIONAL ? this.lDir = c.vec3_multiply(this.direction, d.nMatrix) : a === h.light.type.SPOT || a === h.light.type.SPOT_SHADOW || a === h.light.type.SPOT_SHADOW_PROJECTOR ? (this.lDir = c.vec3_multiply(this.direction, d.nMatrix), this.lPos = g.vec3_multiply(this.position, d.mvMatrix)) : a === h.light.type.POINT ? this.lPos = g.vec3_multiply(this.position, d.mvMatrix) : a === h.light.type.AREA && (this.lDir = c.vec3_multiply(this.direction, d.nMatrix))
        },
        control: function(d, g, c) {
            d ===
                h.motion.POS ? this.position[g] = c : d === h.motion.INTENSITY && (this.intensity = c)
        },
        getAABB: function() {
            var d = m.vec3,
                g = m.aabb,
                c = [
                    [0, 0, 0],
                    [0, 0, 0]
                ];
            g.engulf(c, [this.distance, this.distance, this.distance]);
            g.engulf(c, [-this.distance, -this.distance, -this.distance]);
            c[0] = d.add(c[0], this.position);
            c[1] = d.add(c[1], this.position);
            return this.aabb = c
        },
        setDirection: function(d, g, c) {
            var a = m.vec3;
            if ("object" === typeof d) this.setDirection(d[0], d[1], d[2]);
            else return this.direction = a.normalize([d, g, c]), this.target = null, this
        },
        lookat: function(d, g, c) {
            var a = m.vec3;
            if ("object" === typeof d) this.lookat(d[0], d[1], d[2]);
            else return this.direction = a.normalize(a.subtract([d, g, c], this.position)), this.target = [d, g, c], this
        },
        setRotation: function(d, g, c) {
            var a = m.mat4,
                b = m.vec3;
            if ("object" === typeof d) this.setRotation(d[0], d[1], d[2]);
            else {
                var f = new m.Transform;
                f.rotate([-d, -g, -c]);
                f.pushMatrix();
                this.direction = b.normalize(a.vec3_multiply([1, 0, 0], f.getResult()));
                this.rotation = [d, g, c];
                return this
            }
        },
        setupShader: function(d, g) {
            var c = t.gl;
            c.uniform3fv(d.lightDiffuse[g],
                this.diffuse);
            c.uniform3fv(d.lightSpecular[g], this.specular);
            this.lPos && c.uniform3fv(d.lightPosition[g], this.lPos);
            this.lDir && c.uniform3fv(d.lightDirection[g], this.lDir);
            c.uniform1f(d.lightIntensity[g], this.intensity);
            c.uniform1f(d.lightDistance[g], this.distance);
            (this.light_type === h.light.type.SPOT_SHADOW || this.light_type === h.light.type.SPOT_SHADOW_PROJECTOR || this.light_type === h.light.type.SPOT) && c.uniform1f(d.lightCutOffAngle[g], this.cutoff);
            if (this.light_type === h.light.type.SPOT_SHADOW || this.light_type ===
                h.light.type.SPOT_SHADOW_PROJECTOR || this.light_type === h.light.type.AREA) this.light_type === h.light.type.SPOT_SHADOW_PROJECTOR ? (this.shadowMapTex.texture.use(t.gl.TEXTURE0 + 2 * g), c.uniform1i(d.lightShadowMap[g], 2 * g), this.projectorTex.use(t.gl.TEXTURE0 + 2 * g + 1), c.uniform1i(d.lightProjectionMap[g], 2 * g + 1)) : (this.shadowMapTex.texture.use(t.gl.TEXTURE0 + g), c.uniform1i(d.lightShadowMap[g], g)), c.uniform3fv(d.lightDepthClip[g], [this.dummyCam.nearclip, this.dummyCam.farclip, 1 / this.map_res]), c.uniformMatrix4fv(d.lightShadowMatrix[g], !1, this.spMatrix)
        },
        setShadow: function(d) {
            m.features.lightShadows && (this.map_res = d, this.shadowMapTex = new m.RenderBuffer(this.map_res, this.map_res, !0), this.shadowMapTex.texture.setFilter(h.texture.filter.NEAREST), this.dummyCam = new m.Camera(this.map_res, this.map_res, 80, 0.1, this.distance), this.dummyCam.calc_nmatrix = !1, this.dummyCam.setTargeted(!0), this.has_shadow = !0)
        },
        hasShadow: function() {
            return has_shadow
        },
        setProjector: function(d) {
            this.projectorTex = d
        },
        hasProjector: function() {
            return null !== this.projectorTex ?
                !0 : !1
        },
        shadowBegin: function() {
            var d = t.gl,
                g = m.mat4,
                c = m.mat3;
            this.shadowMapTex.use();
            d.viewport(0, 0, this.map_res, this.map_res);
            d.clear(d.DEPTH_BUFFER_BIT | d.COLOR_BUFFER_BIT);
            this.light_type !== h.light.type.AREA ? (this.dummyCam.setClip(0.1, this.distance), this.dummyCam.setFOV(this.cutoff)) : this.dummyCam.calcProjection();
            if (this.parent) {
                var a = g.inverse_mat3(this.parent.tMatrix);
                c.transpose_inline(a);
                c.vec3_multiply(this.direction, a);
                g.vec3_multiply(this.position, this.parent.tMatrix);
                this.dummyCam.lookat(this.position[0],
                    this.position[1], this.position[2], this.position[0] + 10 * this.direction[0], this.position[1] + 10 * this.direction[1], this.position[2] + 10 * this.direction[2], 0, 1, 0);
                g.multiply(this.dummyCam.mvMatrix.slice(0), g.inverse(this.parent.tMatrix), this.dummyCam.mvMatrix)
            } else this.dummyCam.lookat(this.position[0], this.position[1], this.position[2], this.position[0] + 10 * this.direction[0], this.position[1] + 10 * this.direction[1], this.position[2] + 10 * this.direction[2], 0, 1, 0);
            d.cullFace(d.FRONT)
        },
        shadowEnd: function() {
            var d = t.gl;
            d.bindFramebuffer(d.FRAMEBUFFER, null);
            d.cullFace(d.BACK);
            this.setupTexGen()
        },
        setupTexGen: function() {
            var d = m.mat4;
            this.spMatrix = d.multiply(r, [0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0.5, 1]);
            this.spMatrix = d.multiply(this.spMatrix, this.dummyCam.pMatrix);
            this.spMatrix = d.multiply(this.spMatrix, this.dummyCam.mvMatrix)
        },
        setAreaAxis: function(d) {
            this.areaAxis = d
        },
        updateAreaLight: function() {
            var d = m.vec3,
                g = this.areaCeiling - this.areaFloor;
            this.dummyCam.ortho = !0;
            this.dummyCam.setClip(0.01, 1);
            var c = 0,
                c = Math.tan(this.areaCam.fov /
                    2 * (Math.PI / 180)),
                a = d.subtract(this.areaCam.target, this.areaCam.position);
            a[1] = 0;
            a = d.normalize(a);
            d.normalize(d.cross(a, [0, 1, 0]));
            var b = -Math.atan2(a[2], a[0]),
                c = this.distance / 2 * Math.abs(c) - this.distance / 2;
            c < this.distance / 3 / 2 && (c = this.distance / 3 / 2);
            var a = d.multiply(a, c),
                c = this.areaAxis[1] * (Math.PI / 180),
                f = Math.tan(this.areaAxis[0] * (Math.PI / 180)),
                c = [Math.tan(c), 0, f],
                b = b - Math.atan2(c[0], c[2]);
            this.position = d.add(d.add(this.areaCam.position, a), d.multiply(c, g));
            this.position[1] = this.areaCeiling;
            this.target =
                d.add(d.add(this.areaCam.position, a), d.multiply(c, -g));
            this.target[1] = this.areaFloor;
            this.direction = d.normalize(d.subtract(this.target, this.position));
            this.dummyCam.rotation[2] = b * (180 / Math.PI);
            d = this.dummyCam.farclip * Math.abs(this.direction[1]) * g;
            g = this.orthoBounds(this.position, this.distance, this.distance, this.dummyCam.pMatrix, this.dummyCam.mvMatrix, this.dummyCam.nearclip);
            g[0][1] < this.areaCeiling && Math.abs(this.direction[1]);
            g = this.orthoBounds(this.position, this.distance, this.distance, this.dummyCam.pMatrix,
                this.dummyCam.mvMatrix, this.dummyCam.farclip);
            g[1][1] > this.areaFloor && (g = g[1][1] - this.areaFloor, d += g / Math.abs(this.direction[1]));
            this.dummyCam.nearclip = 0.01;
            this.dummyCam.farclip = d;
            this.dummyCam.setOrtho(-this.distance / 2, this.distance / 2, -this.distance / 2, this.distance / 2)
        },
        orthoBounds: function(d, g, c, a, b, f) {
            var a = m.vec3,
                e = a.normalize([b[0], b[4], b[8]]),
                q = a.normalize([b[1], b[5], b[9]]),
                b = a.normalize(a.cross(q, e)),
                n;
            n = c / 2;
            c = [];
            g = a.multiply(e, g / 2);
            e = a.multiply(q, n);
            f = a.multiply(b, f);
            c[0] = a.add(a.subtract(d,
                g), a.add(e, f));
            c[1] = a.add(a.add(d, g), a.add(e, f));
            c[2] = a.subtract(a.subtract(d, g), a.add(e, f));
            c[3] = a.subtract(a.add(d, g), a.add(e, f));
            aabb1 = c[0];
            aabb2 = c[0];
            for (d = 1; 4 > d; d++) aabb1[0] > c[d][0] && (aabb1[0] = c[d][0]), aabb1[1] > c[d][1] && (aabb1[1] = c[d][1]), aabb1[2] > c[d][2] && (aabb1[2] = c[d][2]), aabb2[0] < c[d][0] && (aabb2[0] = c[d][0]), aabb2[1] < c[d][1] && (aabb2[1] = c[d][1]), aabb2[2] < c[d][2] && (aabb2[2] = c[d][2]);
            return [aabb1, aabb2]
        }
    };
    return {
        Light: w
    }
});
CubicVR.RegisterModule("Camera", function(m) {
    function w(c, a, b, f, e) {
        var d = m.mat4;
        this.frustum = new m.Frustum;
        "object" == typeof c ? (this.position = c.position || [0, 0, -1], this.rotation = c.rotation || [0, 0, 0], this.target = c.target || [0, 0, 0], this.fov = c.fov || 60, this.nearclip = c.nearclip || c.nearClip || c.near || 0.1, this.farclip = c.farclip || c.farClip || c.far || 400, this.targeted = c.targeted !== o ? c.targeted : !0, this.calc_nmatrix = c.calcNormalMatrix !== o ? c.calcNormalMatrix : !0, this.name = c.name || "camera" + g, a = c.height ? c.height : o, c = c.width ?
            c.width : o) : (this.position = [0, 0, 0], this.rotation = [0, 0, 0], this.target = [0, 0, 0], this.fov = b !== o ? b : 60, this.nearclip = f !== o ? f : 0.1, this.farclip = e !== o ? e : 400, this.calc_nmatrix = this.targeted = !0, this.name = "camera" + g);
        this.motion = this.targetSceneObject = null;
        this.transform = new m.Transform;
        this.manual = !1;
        this.setDimensions(c !== o ? c : 512, a !== o ? a : 512);
        this.mvMatrix = d.identity();
        this.pMatrix = null;
        this.calcProjection();
        this.ortho = !1;
        this.ortho_view = {
            left: -1,
            right: 1,
            bottom: -1,
            top: 1
        };
        this.parent = null;
        ++g
    }

    function t(c) {
        this.position =
            c !== o ? c : [0, 0, 0]
    }

    function h(c, a, b) {
        this.camPath = new m.Motion;
        this.targetPath = new m.Motion;
        this.start_position = c !== o ? c : [8, 8, 8];
        this.target = a !== o ? a : [0, 0, 0];
        this.bounds = b !== o ? b : [
            [-15, 3, -15],
            [15, 20, 15]
        ];
        this.safe_bb = [];
        this.avoid_sphere = [];
        this.segment_time = 3;
        this.buffer_time = 20;
        this.path_length = this.path_time = this.current_time = this.start_time = 0;
        this.min_distance = 2;
        this.angle_min = this.max_distance = 40;
        this.angle_max = 180
    }
    var o = m.undef,
        r = m.enums,
        d = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        g = 0;
    w.prototype = {
        get x() {
            return this.position[0]
        },
        set x(c) {
            this.position[0] = c
        },
        get y() {
            return this.position[1]
        },
        set y(c) {
            this.position[1] = c
        },
        get z() {
            return this.position[2]
        },
        set z(c) {
            this.position[2] = c
        },
        get rotX() {
            return this.rotation[0]
        },
        set rotX(c) {
            this.rotation[0] = c
        },
        get rotY() {
            return this.rotation[1]
        },
        set rotY(c) {
            this.rotation[1] = c
        },
        get rotZ() {
            return this.rotation[2]
        },
        set rotZ(c) {
            this.rotation[2] = c
        },
        get targetX() {
            return this.target[0]
        },
        set targetX(c) {
            this.target[0] = c
        },
        get targetY() {
            return this.target[1]
        },
        set targetY(c) {
            this.target[1] = c
        },
        get targetZ() {
            return this.target[2]
        },
        set targetZ(c) {
            this.target[2] = c
        },
        get pos() {
            return this.position.slice(0)
        },
        set pos(c) {
            this.position = c.slice(0)
        },
        get rot() {
            return this.rotation.slice(0)
        },
        set rot(c) {
            this.rotation = c.slice(0)
        },
        trackTarget: function(c, a, b) {
            this.position = m.vec3.trackTarget(this.position, c, a, b)
        },
        setParent: function(c) {
            this.parent = c
        },
        hasParent: function() {
            return !!this.parent
        },
        getParent: function() {
            return this.parent
        },
        getParentedPosition: function() {
            return null !== this.parent && this.mvMatrix && this.parent.tMatrix ? m.mat4.vec3_multiply(this.position,
                this.parent.tMatrix) : this.position
        },
        setOrtho: function(c, a, b, f) {
            this.ortho = !0;
            this.ortho_view.left = c;
            this.ortho_view.right = a;
            this.ortho_view.bottom = b;
            this.ortho_view.top = f
        },
        control: function(c, a, b) {
            c === r.motion.ROT ? this.rotation[a] = b : c === r.motion.POS ? this.position[a] = b : c === r.motion.FOV ? this.setFOV(b) : c === r.motion.LENS ? this.setLENS(b) : c === r.motion.NEARCLIP ? this.setClip(b, this.farclip) : c === r.motion.FARCLIP && this.setClip(this.nearclip, b)
        },
        makeFrustum: function(c, a, b, f, e, g) {
            return [2 * e / (a - c), 0, 0, 0, 0, 2 * e /
                (f - b), 0, 0, (a + c) / (a - c), (f + b) / (f - b), -(g + e) / (g - e), -1, 0, 0, -2 * g * e / (g - e), 0
            ]
        },
        setTargeted: function(c) {
            this.targeted = c
        },
        calcProjection: function() {
            var c = m.mat4,
                a = m.mat3;
            this.pMatrix = this.ortho ? c.ortho(this.ortho_view.left, this.ortho_view.right, this.ortho_view.bottom, this.ortho_view.top, this.nearclip, this.farclip) : c.perspective(this.fov, this.aspect, this.nearclip, this.farclip);
            !this.targeted && this.mvMatrix && (c.identity(this.mvMatrix), c.rotate(-this.rotation[0], -this.rotation[1], -this.rotation[2], this.mvMatrix),
                c.translate(-this.position[0], -this.position[1], -this.position[2], this.mvMatrix), this.parent && c.multiply(this.mvMatrix.slice(0), c.inverse(this.parent.tMatrix), this.mvMatrix), this.calc_nmatrix ? (this.nMatrix = c.inverse_mat3(this.mvMatrix), a.transpose_inline(this.nMatrix)) : c.identity(this.nMatrix));
            this.frustum.extract(this, this.mvMatrix, this.pMatrix)
        },
        setClip: function(c, a) {
            this.nearclip = c;
            this.farclip = a;
            this.calcProjection()
        },
        setDimensions: function(c, a) {
            this.width = c;
            this.height = a;
            this.aspect = c / a;
            this.calcProjection()
        },
        setAspect: function(c) {
            this.aspect = c;
            this.calcProjection()
        },
        resize: function(c, a) {
            this.setDimensions(c, a)
        },
        setFOV: function(c) {
            this.fov = c;
            this.ortho = !1;
            this.calcProjection()
        },
        setLENS: function(c) {
            this.setFOV(2 * Math.atan(16 / c) * (180 / Math.PI))
        },
        lookat: function(c, a, b, f, e, g, n, s, h) {
            var o = m.mat4,
                u = m.mat3;
            "object" == typeof c ? this.lookat(this.position[0], this.position[1], this.position[2], c[0], c[1], c[2], 0, 1, 0) : (this.mvMatrix = o.lookat(c, a, b, f, e, g, n, s, h), this.rotation[2] && (this.transform.clearStack(), this.transform.rotate(-this.rotation[2],
                0, 0, 1), this.transform.pushMatrix(this.mvMatrix), this.mvMatrix = this.transform.getResult()), null !== this.parent && o.multiply(this.mvMatrix.slice(0), o.inverse(this.parent.tMatrix), this.mvMatrix), this.calc_nmatrix ? (this.nMatrix = o.inverse_mat3(this.mvMatrix), u.transpose_inline(this.nMatrix)) : this.nMatrix = d, this.frustum.extract(this, this.mvMatrix, this.pMatrix))
        },
        unProject: function(c, a, b) {
            var f = m.mat4,
                e = m.vec3,
                g = [0, 0, this.width, this.height],
                c = f.vec4_multiply(f.vec4_multiply([2 * ((c - g[0]) / g[2]) - 1, -(2 * ((a - g[1]) /
                    g[3]) - 1), 1, 1], f.inverse(this.pMatrix)), f.inverse(this.mvMatrix)),
                c = [c[0] / c[3], c[1] / c[3], c[2] / c[3]];
            return b !== o ? (a = this.getParentedPosition(), e.add(a, e.multiply(e.normalize(e.subtract(c, a)), b))) : c
        },
        project: function(c, a, b) {
            var f = m.mat4,
                f = f.vec4_multiply(f.vec4_multiply([c, a, b, 1], this.mvMatrix), this.pMatrix);
            f[2] = m.vec3.length(m.vec3.subtract([c, a, b], this.position));
            return [(f[0] / f[3] + 1) / 2 * this.width, (-f[1] / f[3] + 1) / 2 * this.height, f[2]]
        }
    };
    t.prototype = {
        control: function(c, a, b) {
            c === r.motion.POS && (this.position[a] =
                b)
        }
    };
    h.prototype = {
        inBounds: function(c) {
            var a = m.vec3;
            if (!(c[0] > this.bounds[0][0] && c[1] > this.bounds[0][1] && c[2] > this.bounds[0][2] && c[0] < this.bounds[1][0] && c[1] < this.bounds[1][1] && c[2] < this.bounds[1][2])) return !1;
            for (var b = 0, f = this.avoid_sphere.length; b < f; b++)
                if (a.length(c, this.avoid_sphere[b][0]) < this.avoid_sphere[b][1]) return !1;
            return !0
        },
        findNextNode: function(c, a) {
            var b = m.vec3,
                f = [0, 0, 0],
                e = [0, 0, 0],
                g = f = 0,
                n = !1;
            do
                if (e[0] = Math.random() - 0.5, e[1] = Math.random() - 0.5, e[2] = Math.random() - 0.5, e = b.normalize(e),
                    f = Math.random() * (this.max_distance - this.min_distance) + this.min_distance, f = b.add(a.position, b.multiply(e, f)), n = this.inBounds(f), g++, 30 < g) {
                    f = a.position;
                    break
                }
            while (!n);
            return f
        },
        run: function(c) {
            this.current_time = c;
            0 === this.path_time && (this.path_time = this.current_time, this.camPath.setKey(r.motion.POS, r.motion.X, this.path_time, this.start_position[0]), this.camPath.setKey(r.motion.POS, r.motion.Y, this.path_time, this.start_position[1]), this.camPath.setKey(r.motion.POS, r.motion.Z, this.path_time, this.start_position[2]));
            for (; this.path_time < this.current_time + this.buffer_time;) {
                this.path_time += this.segment_time;
                var a = new t,
                    b = new t;
                this.path_length && this.camPath.apply(this.path_time - 2 * this.segment_time, a);
                this.camPath.apply(this.path_time - this.segment_time, b);
                a = this.findNextNode(a, b);
                this.camPath.setKey(r.motion.POS, r.motion.X, this.path_time, a[0]);
                this.camPath.setKey(r.motion.POS, r.motion.Y, this.path_time, a[1]);
                this.camPath.setKey(r.motion.POS, r.motion.Z, this.path_time, a[2]);
                this.path_length++
            }
            a = new t;
            this.camPath.apply(c,
                a);
            return a.position
        },
        addSafeBound: function(c, a) {
            this.safe_bb.push([c, a])
        },
        addAvoidSphere: function(c, a) {
            this.avoid_sphere.push([c, a])
        }
    };
    return {
        Camera: w,
        AutoCamera: h
    }
});
CubicVR.RegisterModule("StereoCameraRig", function(m) {
    var w = m.enums;
    w.stereo = {
        mode: {
            STEREO: 1,
            RIFT: 2,
            TWOCOLOR: 3,
            INTERLACE: 4
        }
    };
    var t = function(h) {
        h = h || {};
        camera = h.camera || null;
        var o = m.getCanvas();
        this.eyeSpacing = h.eyeSpacing || 0.6;
        this.mode = m.parseEnum(w.stereo.mode, h.mode || 1);
        this.doubleBuffer = !1;
        this.leftColor = [0, 0, 1];
        this.rightColor = [1, 0, 0];
        this.eyeWarpEnabled = h.eyeWarp;
        if (!camera || !(camera instanceof m.Camera)) throw "StereoCameraRig Error: camera not provided?";
        this.fov = h.fov || camera.fov;
        this.camLeft =
            new m.Camera({
                fov: this.fov,
                aspect: this.aspect,
                targeted: camera.targeted
            });
        this.camRight = new m.Camera({
            fov: this.fov,
            aspect: this.aspect,
            targeted: camera.targeted
        });
        camera.parent && (this.camLeft.setParent(camera.parent), this.camRight.setParent(camera.parent));
        this.camera = camera;
        this.fxChain = h.fxChain || h.fxChainA || new m.PostProcessChain(o.width, o.height, !1);
        this.fxChainB = h.fxChainB || null;
        m.addResizeable(this.fxChain);
        this.fxChainB && m.addResizeable(this.fxChainB);
        this.shaderEyeWarp = new m.PostProcessShader({
            shader_vertex: "attribute vec3 aVertex;\nattribute vec2 aTex;\nvarying vec2 vTex;\nvoid main(void)\n{\nvTex = aTex;\nvec4 vPos = vec4(aVertex.xyz,1.0);\ngl_Position = vPos;\n}",
            shader_fragment: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D srcTex;\nvarying vec2 vTex;\nvoid main()\n{\nvec2 uv = vTex;\nuv.x *= 2.0;\nif (uv.x>1.0) {\nuv.x -= 1.0;\n}\nvec2 cen = vec2(0.5,0.5) - uv.xy;\nif (length(cen)>0.5) discard;\nvec2 mcen = -0.02*tan(length(cen)*3.14)*(cen);\nuv += mcen;\nif (uv.x>1.0||uv.x<0.0||uv.y>1.0||uv.y<0.0) discard;\nuv.x /= 2.0;\nif (vTex.x > 0.5) {\nuv.x+=0.5;\n}\ngl_FragColor = texture2D(srcTex, uv);\n}",
            outputMode: "replace",
            enabled: !1
        });
        this.shaderTwoColor =
            new m.PostProcessShader({
                shader_vertex: "attribute vec3 aVertex;\nattribute vec2 aTex;\nvarying vec2 vTex;\nvoid main(void)\n{\nvTex = aTex;\nvec4 vPos = vec4(aVertex.xyz,1.0);\ngl_Position = vPos;\n}",
                shader_fragment: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D srcTex;\nuniform sampler2D rightTex;\nvarying vec2 vTex;\nuniform vec3 leftColor;\nuniform vec3 rightColor;\nvoid main()\n{\nvec3 leftSample = texture2D(srcTex, vTex).rgb;\nvec3 rightSample = texture2D(rightTex, vTex).rgb;\nleftSample.rgb = vec3((leftSample.r+leftSample.g+leftSample.b)/3.0);\nrightSample.rgb = vec3((rightSample.r+rightSample.g+rightSample.b)/3.0);\ngl_FragColor = vec4(leftSample.rgb*leftColor+rightSample.rgb*rightColor,1.0);\n}",
                outputMode: "replace",
                enabled: !1,
                init: function(h) {
                    h.addInt("rightTex", 2);
                    h.addVector("leftColor", this.leftColor);
                    h.addVector("rightColor", this.rightColor)
                }
            });
        this.shaderInterlace = new m.PostProcessShader({
            shader_vertex: "attribute vec3 aVertex;\nattribute vec2 aTex;\nvarying vec2 vTex;\nvoid main(void)\n{\nvTex = aTex;\nvec4 vPos = vec4(aVertex.xyz,1.0);\ngl_Position = vPos;\n}",
            shader_fragment: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D srcTex;\nvarying vec2 vTex;\nuniform vec3 texel;\nvoid main()\n{\nvec2 uv = vTex;\nuv.y *= 0.5;\nif (mod(floor(vTex.y/texel.y),2.0)==0.0) {\nuv.y+=0.5;\n}\ngl_FragColor = texture2D(srcTex, uv);\n}",
            outputMode: "replace",
            enabled: !1
        });
        this.fxChain.addShader(this.shaderEyeWarp);
        this.fxChain.addShader(this.shaderTwoColor);
        this.fxChain.addShader(this.shaderInterlace);
        this.aspect = h.aspect;
        this.aspect || (this.aspect = this.mode == w.stereo.mode.STEREO ? o.width / 2 / o.height : o.width / o.height);
        this.setMode({
            mode: this.mode
        })
    };
    t.prototype = {
        setMode: function(h) {
            h = h || {
                mode: 1
            };
            this.mode = m.parseEnum(w.stereo.mode, h.mode);
            fov = h.fov || this.fov;
            aspect = h.aspect || this.aspect;
            this.leftColor = h.leftColor || this.leftColor;
            this.rightColor =
                h.rightColor || this.rightColor;
            switch (this.mode) {
                case w.stereo.mode.STEREO:
                    this.setDoubleBuffer(!1);
                    this.setEyeWarp(!1);
                    this.setInterlace(!1);
                    this.setTwoColor(!1);
                    break;
                case w.stereo.mode.RIFT:
                    aspect = 110 / 90;
                    fov = 110;
                    this.setDoubleBuffer(!1);
                    this.setEyeWarp(!0);
                    this.setInterlace(!1);
                    this.setTwoColor(!1);
                    break;
                case w.stereo.mode.TWOCOLOR:
                    this.setDoubleBuffer(!0);
                    this.setEyeWarp(!1);
                    this.setInterlace(!1);
                    this.setTwoColor(!0);
                    this.shaderTwoColor.shader.use();
                    this.shaderTwoColor.shader.setVector("leftColor",
                        this.leftColor);
                    this.shaderTwoColor.shader.setVector("rightColor", this.rightColor);
                    break;
                case w.stereo.mode.INTERLACE:
                    this.setDoubleBuffer(!1), this.setEyeWarp(!1), this.setInterlace(!0), this.setTwoColor(!1)
            }
            this.camLeft.setAspect(aspect);
            this.camLeft.setFOV(fov);
            this.camLeft.setTargeted(this.camera.targeted);
            this.camRight.setAspect(aspect);
            this.camRight.setFOV(fov);
            this.camRight.setTargeted(this.camera.targeted)
        },
        getMode: function() {
            return this.mode
        },
        setupCameras: function() {
            var h = this.camera;
            this.camLeft.rot =
                h.rot;
            this.camRight.rot = h.rot;
            h.unProject(h.farclip);
            this.camLeft.pos = h.pos;
            this.camRight.pos = h.pos;
            this.camera.targeted ? (this.camLeft.position = m.vec3.moveViewRelative(this.camera.position, this.camera.target, -this.eyeSpacing / 2, 0), this.camRight.position = m.vec3.moveViewRelative(this.camera.position, this.camera.target, this.eyeSpacing / 2, 0), this.camLeft.target = m.vec3.moveViewRelative(this.camera.position, this.camera.target, -this.eyeSpacing / 2, 0, this.camera.target), this.camRight.target = m.vec3.moveViewRelative(this.camera.position,
                this.camera.target, this.eyeSpacing / 2, 0, this.camera.target)) : (this.camLeft.position[0] -= this.eyeSpacing / 2, this.camRight.position[0] += this.eyeSpacing / 2);
            !this.camera.parent && !this.camera.targeted && (h = m.mat4.transform(m.vec3.subtract([0, 0, 0], this.camera.position), this.camera.rotation), this.camLeft.parent = {
                tMatrix: h
            }, this.camRight.parent = {
                tMatrix: h
            })
        },
        renderScene: function(h) {
            this.setupCameras();
            var o = m.getCanvas(),
                r = this.fxChain,
                d = this.fxChainB,
                g = m.GLCore.gl,
                c = o.width / 2,
                a = o.height / 2,
                b = o.height,
                o = o.width;
            this.shaderEyeWarp.enabled = this.eyeWarpEnabled;
            this.shaderTwoColor.enabled = this.twoColorEnabled;
            this.shaderInterlace.enabled = this.interlaceEnabled;
            this.twoColorEnabled && d ? (r.begin(), g.viewport(0, 0, o, b), g.clear(g.DEPTH_BUFFER_BIT | g.COLOR_BUFFER_BIT), h.render({
                    camera: this.swapEyes ? this.camRight : this.camLeft
                }), r.end(), d.begin(), g.viewport(0, 0, o, b), g.clear(g.DEPTH_BUFFER_BIT | g.COLOR_BUFFER_BIT), h.render({
                    camera: this.swapEyes ? this.camLeft : this.camRight
                }), d.end(), g.viewport(0, 0, o, b), d.captureBuffer.texture.use(g.TEXTURE2)) :
                (r.begin(), g.viewport(0, 0, o, b), g.clear(g.DEPTH_BUFFER_BIT | g.COLOR_BUFFER_BIT), this.interlaceEnabled ? g.viewport(0, 0, o, a) : g.viewport(0, 0, c, b), h.render({
                    camera: this.swapEyes ? this.camRight : this.camLeft
                }), this.interlaceEnabled ? g.viewport(0, a, o, a) : g.viewport(c, 0, c, b), h.render({
                    camera: this.swapEyes ? this.camLeft : this.camRight
                }), r.end(), g.viewport(0, 0, o, b));
            r.render()
        },
        setEyeWarp: function(h) {
            this.eyeWarpEnabled = h
        },
        getEyeWarp: function() {
            return this.eyeWarpEnabled
        },
        setSwapEyes: function(h) {
            this.swapEyes = h
        },
        getSwapEyes: function() {
            return this.swapEyes
        },
        setDoubleBuffer: function(h) {
            if (!this.fxChainB) {
                var o = m.getCanvas();
                this.fxChainB = new m.PostProcessChain(o.width, o.height, !1);
                m.addResizeable(this.fxChainB)
            }
            this.doubleBuffer = h
        },
        getDoubleBuffer: function() {
            return this.doubleBuffer
        },
        setTwoColor: function(h) {
            this.twoColorEnabled = h
        },
        getTwoColor: function() {
            return this.twoColorEnabled
        },
        setInterlace: function(h) {
            this.interlaceEnabled = h
        },
        getInterlace: function() {
            return this.interlaceEnabled
        },
        addUI: function() {
            var h = document.createElement("div");
            h.style.position =
                "absolute";
            h.style.top = "10px";
            h.style.left = "10px";
            h.style.color = "white";
            h.style.zIndex = 1E3;
            h.appendChild(document.createTextNode("Mode:"));
            var o = document.createElement("select");
            o.options[0] = new Option("Oculus Rift Untested", "rift");
            o.options[1] = new Option("Split Stereo", "stereo");
            o.options[2] = new Option("Red/Blue Stereo", "redblue");
            o.options[3] = new Option("Red/Green Stereo", "redgreen");
            o.options[4] = new Option("Interlaced", "interlace");
            o.selectedIndex = 0;
            h.appendChild(o);
            h.appendChild(document.createTextNode(" Swap Eyes:"));
            var r = document.createElement("input");
            r.type = "checkbox";
            r.value = "1";
            h.appendChild(r);
            document.body.appendChild(h);
            o.selectedIndex = 0;
            var d = this;
            r.addEventListener("change", function() {
                d.setSwapEyes(this.checked)
            }, !0);
            o.addEventListener("change", function() {
                var g = this.options[this.selectedIndex].value,
                    c = m.getCanvas();
                switch (g) {
                    case "rift":
                        d.setMode({
                            mode: "rift"
                        });
                        break;
                    case "stereo":
                        d.setMode({
                            mode: "stereo",
                            fov: 60,
                            aspect: c.width / 2 / c.height
                        });
                        break;
                    case "redblue":
                        d.setMode({
                            mode: "twocolor",
                            leftColor: [0,
                                0, 1
                            ],
                            rightColor: [1, 0, 0],
                            fov: 60,
                            aspect: c.width / c.height
                        });
                        break;
                    case "redgreen":
                        d.setMode({
                            mode: "twocolor",
                            leftColor: [0, 1, 0],
                            rightColor: [1, 0, 0],
                            fov: 60,
                            aspect: c.width / c.height
                        });
                        break;
                    case "interlace":
                        d.setMode({
                            mode: "interlace",
                            leftColor: [0, 1, 0],
                            rightColor: [1, 0, 0],
                            fov: 60,
                            aspect: c.width / c.height
                        })
                }
            }, !0)
        }
    };
    return {
        StereoCameraRig: t
    }
});
CubicVR.RegisterModule("Motion", function(m) {
    function w() {
        this.time = this.value = 0;
        this.shape = r.envelope.shape.TCB;
        this.bias = this.continuity = this.tension = 0;
        this.next = this.prev = null;
        this.param = [0, 0, 0, 0]
    }

    function t(a) {
        this.nKeys = 0;
        this.lastKey = this.firstKey = this.keys = null;
        a ? (this.in_behavior = CubicVR.parseEnum(r.envelope.behavior, a.in_behavior || a.inBehavior || a.behavior) || r.envelope.behavior.CONSTANT, this.out_behavior = CubicVR.parseEnum(r.envelope.behavior, a.out_behavior || a.outBehavior || a.behavior) || r.envelope.behavior.CONSTANT) :
            this.out_behavior = this.in_behavior = r.envelope.behavior.CONSTANT
    }

    function h(a, e) {
        this.controllers = [];
        this.yzflip = !1;
        if ("object" === typeof a) {
            var b = CubicVR.get(a);
            this.env_init = CubicVR.get(b.envelope);
            this.key_init = CubicVR.get(b.key);
            for (var c in b)
                if (b.hasOwnProperty(c) && !("envelope" === c || "key" === c)) {
                    var g = b[c],
                        d = CubicVR.get(g.envelope),
                        h;
                    for (h in g)
                        if (g.hasOwnProperty(h) && !("envelope" === h || "key" === h)) {
                            var u = g[h];
                            if ("object" === typeof u)
                                for (var o in u) this.setKey(c, o, h, u[o]), d && this.setBehavior(c, o,
                                    d)
                        }
                }
        } else this.env_init = a, this.key_init = e
    }
    var o = m.undef,
        r = CubicVR.enums;
    r.motion = {
        POS: 0,
        ROT: 1,
        SCL: 2,
        POSITION: 0,
        ROTATION: 1,
        SCALE: 2,
        FOV: 3,
        LENS: 4,
        NEARCLIP: 5,
        FARCLIP: 6,
        INTENSITY: 7,
        X: 0,
        Y: 1,
        Z: 2,
        V: 3
    };
    r.envelope = {
        shape: {
            TCB: 0,
            HERM: 1,
            BEZI: 2,
            LINE: 3,
            STEP: 4,
            BEZ2: 5
        },
        behavior: {
            RESET: 0,
            CONSTANT: 1,
            REPEAT: 2,
            OSCILLATE: 3,
            OFFSET: 4,
            LINEAR: 5
        }
    };
    var d = function(a, e, b) {
            var c = 0,
                c = b - e;
            if (0 === c) return [e, 0];
            e = a - c * Math.floor((a - e) / c);
            c = -parseInt((e - a) / c + (e > a ? 0.5 : -0.5), 10);
            return [e, c]
        },
        g = function(a, e, b, c, g) {
            var d, h;
            h = g * g;
            d = 3 * (e -
                a);
            e = 3 * (b - e) - d;
            return (c - a - d - e) * h * g + e * h + d * g + a
        },
        c = function(a, e, b, n, d, h, o) {
            var u, m;
            m = h + 0.5 * (o - h);
            u = g(a, e, b, n, m);
            return 1.0E-4 < Math.abs(d - u) ? (u > d ? o = m : h = m, c(a, e, b, n, d, h, o)) : m
        },
        a = function(a, e) {
            var b, c, g, d;
            a.shape === r.envelope.shape.TCB ? (b = (1 - a.tension) * (1 + a.continuity) * (1 + a.bias), c = (1 - a.tension) * (1 - a.continuity) * (1 - a.bias), g = e.value - a.value, a.prev ? (d = (e.time - a.time) / (e.time - a.prev.time), b = d * (b * (a.value - a.prev.value) + c * g)) : b = c * g) : a.shape === r.envelope.shape.LINE ? (g = e.value - a.value, a.prev ? (d = (e.time - a.time) /
                (e.time - a.prev.time), b = d * (a.value - a.prev.value + g)) : b = g) : a.shape === r.envelope.shape.BEZI || a.shape === r.envelope.shape.HERM ? (b = a.param[1], a.prev && (b *= (e.time - a.time) / (e.time - a.prev.time))) : a.shape === r.envelope.shape.BEZ2 ? (b = a.param[3] * (e.time - a.time), b = 1.0E-5 < Math.abs(a.param[2]) ? b / a.param[2] : 1E5 * b) : b = 0;
            return b
        },
        b = function(a, e) {
            var b, c, g, d;
            e.shape === r.envelope.shape.LINE ? (g = e.value - a.value, e.next ? (d = (e.time - a.time) / (e.next.time - a.time), b = d * (e.next.value - e.value + g)) : b = g) : e.shape === r.envelope.shape.TCB ?
                (b = (1 - e.tension) * (1 - e.continuity) * (1 + e.bias), c = (1 - e.tension) * (1 + e.continuity) * (1 - e.bias), g = e.value - a.value, e.next ? (d = (e.time - a.time) / (e.next.time - a.time), b = d * (c * (e.next.value - e.value) + b * g)) : b *= g) : e.shape === r.envelope.shape.HERM || e.shape === r.envelope.shape.BEZI ? (b = e.param[0], e.next && (b *= (e.time - a.time) / (e.next.time - a.time))) : e.shape === r.envelope.shape.BEZ2 ? (b = e.param[1] * (e.time - a.time), b = 1.0E-5 < Math.abs(e.param[0]) ? b / e.param[0] : 1E5 * b) : b = 0;
            return b
        };
    t.prototype = {
        setBehavior: function(a, e) {
            this.in_behavior =
                CubicVR.parseEnum(r.envelope.behavior, a);
            this.out_behavior = CubicVR.parseEnum(r.envelope.behavior, e)
        },
        empty: function() {
            return 0 === this.nKeys
        },
        addKey: function(a, e, b) {
            var c = "object" == typeof a ? a : b;
            e || (e = 0);
            a || (a = 0);
            c ? (c = a, a = c.time, b = this.insertKey(a), b.value = c.value ? c.value : e, b.time = c.time ? c.time : a, b.shape = CubicVR.parseEnum(r.envelope.shape, c.shape) || r.envelope.shape.TCB, b.tension = c.tension ? c.tension : 0, b.continuity = c.continuity ? c.continuity : 0, b.bias = c.bias ? c.bias : 0, b.param = c.param ? c.param : [0, 0, 0, 0]) :
                (b = this.insertKey(a), b.value = e);
            return b
        },
        insertKey: function(a) {
            var e = new w;
            e.time = a;
            if (!this.nKeys) return this.lastKey = this.firstKey = this.keys = e, this.nKeys++, e;
            for (var b = this.keys; b;) {
                this.firstKey.time > a ? this.firstKey = e : this.lastKey.time < a && (this.lastKey = e);
                if (b.time > e.time) return e.prev = b.prev, e.prev && (e.prev.next = e), e.next = b, e.next.prev = e, this.nKeys++, e;
                if (!b.next) return e.prev = b, b.next = e, this.nKeys++, e;
                b = b.next
            }
            return null
        },
        evaluate: function(f) {
            var e, q, n, s, h, o = 0;
            if (0 === this.nKeys) return 0;
            if (1 ===
                this.nKeys) return this.keys.value;
            q = this.firstKey;
            e = this.lastKey;
            if (f < q.time) {
                s = this.in_behavior;
                if (s === r.envelope.behavior.RESET) return 0;
                if (s === r.envelope.behavior.CONSTANT) return q.value;
                if (s === r.envelope.behavior.REPEAT) s = d(f, q.time, e.time), f = s[0];
                else if (s === r.envelope.behavior.OCILLATE) s = d(f, q.time, e.time), f = s[0], s = s[1], s % 2 && (f = e.time - q.time - f);
                else if (s === r.envelope.behavior.OFFSET) s = d(f, q.time, e.time), f = s[0], s = s[1], o = s * (e.value - q.value);
                else if (s === r.envelope.behavior.LINEAR) return h = a(q,
                    q.next) / (q.next.time - q.time), h * (f - q.time) + q.value
            } else if (f > e.time) {
                s = this.out_behavior;
                if (s === r.envelope.behavior.RESET) return 0;
                if (s === r.envelope.behavior.CONSTANT) return e.value;
                if (s === r.envelope.behavior.REPEAT) s = d(f, q.time, e.time), f = s[0];
                else if (s === r.envelope.behavior.OCILLATE) s = d(f, q.time, e.time), f = s[0], s = s[1], s % 2 && (f = e.time - q.time - f);
                else if (s === r.envelope.behavior.OFFSET) s = d(f, q.time, e.time), f = s[0], s = s[1], o = s * (e.value - q.value);
                else if (s === r.envelope.behavior.LINEAR) return s = b(e.prev, e) / (e.time -
                    e.prev.time), s * (f - e.time) + e.value
            }
            if (this.lastKey0)
                if (f > this.lastKey0.time) e = this.lastKey0;
                else if (f < this.lastKey0.time)
                for (e = this.lastKey; f < e.time && e.prev;) e = e.prev;
            else e = this.keys;
            else e = this.keys;
            for (; f > e.next.time;) e = e.next;
            q = e.next;
            this.lastKey0 = e;
            if (f === e.time) return e.value + o;
            if (f === q.time) return q.value + o;
            n = (f - e.time) / (q.time - e.time);
            s = q.shape;
            if (s === r.envelope.shape.TCB || s === r.envelope.shape.BEZI || s === r.envelope.shape.HERM) {
                h = a(e, q);
                s = b(e, q);
                var u, m;
                m = n * n;
                u = n * m;
                f = 3 * m - u - u;
                u -= m;
                f = [1 - f, f, u -
                    m + n, u
                ];
                return f[0] * e.value + f[1] * q.value + f[2] * h + f[3] * s + o
            }
            return s === r.envelope.shape.BEZ2 ? (f = c(e.time, e.shape === r.envelope.shape.BEZ2 ? e.time + e.param[2] : e.time + (q.time - e.time) / 3, q.time + q.param[0], q.time, f, 0, 1), g(e.value, e.shape === r.envelope.shape.BEZ2 ? e.value + e.param[3] : e.value + e.param[1] / 3, q.param[1] + q.value, q.value, f) + o) : s === r.envelope.shape.LINE ? e.value + n * (q.value - e.value) + o : s === r.envelope.shape.STEP ? e.value + o : o
        }
    };
    h.prototype = {
        clone: function() {
            var a = new m.Motion(this.env_init, this.key_init),
                e;
            for (e in this.controllers)
                if (this.controllers.hasOwnProperty(e)) {
                    a.controllers[e] ===
                        o && (a.controllers[e] = []);
                    for (var b in this.controllers[e])
                        if (this.controllers[e].hasOwnProperty(b)) {
                            var c = this.controllers[e][b],
                                g = a.controllers[e][b] = new t({
                                    in_behavior: c.in_behavior,
                                    out_behavior: c.out_behavior
                                });
                            g.nKeys = c.nKeys;
                            g.keys = c.keys;
                            g.firstKey = c.firstKey;
                            g.lastKey = c.lastKey
                        }
                }
            return a
        },
        envelope: function(a, e) {
            e = CubicVR.parseEnum(r.motion, e) || 0;
            a = CubicVR.parseEnum(r.motion, a) || 0;
            this.controllers[a] === o && (this.controllers[a] = []);
            this.controllers[a][e] === o && (this.controllers[a][e] = new t(this.env_init));
            return this.controllers[a][e]
        },
        evaluate: function(a) {
            var e = [],
                b;
            for (b in this.controllers)
                if (this.controllers.hasOwnProperty(b)) {
                    e[b] = [];
                    for (var c in this.controllers[b]) this.controllers[b].hasOwnProperty(c) && (e[b][c] = this.controllers[b][c].evaluate(a))
                }
            return e
        },
        apply: function(a, e) {
            for (var b in this.controllers)
                if (this.controllers.hasOwnProperty(b)) {
                    var c = parseInt(b, 10);
                    if (this.yzflip && c === r.motion.ROT) {
                        this.q || (this.q = new CubicVR.Quaternion);
                        var g = this.q,
                            d = this.controllers[b][0].evaluate(a),
                            h = this.controllers[b][1].evaluate(a),
                            u = this.controllers[b][2].evaluate(a);
                        g.fromEuler(d, u, -h);
                        g = g.toEuler();
                        e.control(c, 0, g[0]);
                        e.control(c, 1, g[1]);
                        e.control(c, 2, g[2])
                    } else
                        for (var o in this.controllers[b]) this.controllers[b].hasOwnProperty(o) && e.control(c, parseInt(o, 10), this.controllers[b][o].evaluate(a))
                }
        },
        setKey: function(a, e, b, c, g) {
            e = CubicVR.parseEnum(r.motion, e) || 0;
            a = CubicVR.parseEnum(r.motion, a) || 0;
            return this.envelope(a, e).addKey(b, c, g ? g : this.key_init)
        },
        setArray: function(a, e, b, c) {
            var g = [],
                a = CubicVR.parseEnum(r.motion, a) || 0,
                d;
            for (d in b)
                if (b.hasOwnProperty(d)) {
                    var h =
                        this.envelope(a, CubicVR.parseEnum(r.motion, d));
                    g[d] = h.addKey(e, b[d], c ? c : this.key_init)
                }
            return g
        },
        setBehavior: function(a, e, b, c) {
            var g = this.envelope(a, e);
            "object" === typeof b && (c = b, b = c.in_behavior || c.inBehavior || c.behavior, c = c.out_behavior || c.outBehavior || c.behavior);
            CubicVR.parseEnum(r.motion, e);
            CubicVR.parseEnum(r.motion, a);
            g.setBehavior(b, c)
        },
        setBehaviorArray: function(a, e, b) {
            var a = CubicVR.parseEnum(r.motion, a) || 0,
                c = this.controllers[a],
                g;
            for (g in c) c.hasOwnProperty(g) && this.envelope(a, CubicVR.parseEnum(r.motion,
                g) || 0).setBehavior(e, b)
        }
    };
    return {
        Motion: h,
        Envelope: t,
        EnvelopeKey: w
    }
});
CubicVR.RegisterModule("EventHandler", function(m) {
    function w(g) {
        g = CubicVR.parseEnum(r.event, g);
        return g === o ? (d("For custom events use CubicVR.registerEvent('event_name'); and use the resulting CubicVR.enums.event.EVENT_NAME for type checks and 'event_name' for construction."), !1) : !isNaN(parseInt(g, 10)) && (g >= r.event.EVENT_MAX || 0 > g) ? (d("Unknown event ID passed: " + g), !1) : g
    }

    function t(g) {
        g = g || {};
        this.name = g.name;
        g.id = w(g.id) || r.event.TICK;
        this.id = g.id;
        this.interval = g.interval || 0;
        this.enabled = g.enabled ||
            !0;
        this.action = g.action || null;
        this.properties = g.properties || {};
        this.event_properties = g.event_properties || {};
        this.buffered = g.buffered || !1;
        this.weight = g.weight === o ? -1 : g.weight;
        this.subject = null;
        this.n_updates = this.t_resting = this.t_rest = this.t_last = this.t_update = this.t_updatecall = this.t_active = this.t_sleep = 0;
        this.break_chain = !1
    }

    function h() {
        this.events = [];
        this.eventProperties = [];
        this.eventPropertyCount = [];
        this.eventHandled = [];
        this.listeners = [];
        this.listenerNames = [];
        this.eventParameters = []
    }
    var o = m.undef,
        r = CubicVR.enums,
        d = m.log;
    r.event = {
        TICK: 0,
        MOVE: 1,
        MATRIX_UPDATE: 2,
        OCTREE_ADJUST: 3,
        COLLIDE: 4,
        CONTACT: 5,
        CONTACT_ADD: 6,
        CONTACT_REMOVE: 7,
        CONTACT_GHOST: 8,
        RIGID_REST: 9,
        RIGID_AWAKE: 10,
        ENUM_MAX: 11
    };
    t.prototype = {
        getName: function() {
            return this.name
        },
        setName: function(g) {
            this.name = g
        },
        getSubject: function() {
            return this.subject
        },
        setSubject: function(g) {
            this.subject = g
        },
        getId: function() {
            return this.id
        },
        setId: function(g) {
            this.id = g
        },
        isEnabled: function() {
            return this.enabled
        },
        disable: function() {
            this.setEnabled(!1)
        },
        enable: function() {
            this.setEnabled(!0)
        },
        setEnabled: function(g) {
            g && !this.enabled && (this.n_updates = this.t_resting = this.t_rest = this.t_last = this.t_update = this.t_updatecall = this.t_active = this.t_sleep = 0, this.break_chain = !1);
            this.enabled = g
        },
        isBuffered: function() {
            return this.buffered
        },
        setBuffered: function(g) {
            this.buffered = g
        },
        setInterval: function(g) {
            this.interval = g
        },
        getInterval: function() {
            return this.interval
        },
        setAction: function(g) {
            this.action = g
        },
        getAction: function() {
            return this.action
        },
        getProperties: function() {
            return this.properties
        },
        setProperties: function(g) {
            this.properties =
                g
        },
        getProperty: function(g) {
            return this.properties[g]
        },
        setProperty: function(g, c) {
            this.properties[g] = c
        },
        setEventProperties: function(g) {
            this.event_properties = g
        },
        getEventProperties: function() {
            return this.event_properties
        },
        getEventProperty: function(g) {
            return this.event_properties[g]
        },
        setEventProperty: function(g, c) {
            this.properties[g] = c
        },
        getTimeSleeping: function() {
            return this.t_sleep
        },
        getTimeActive: function() {
            return this.t_active
        },
        getTimeUpdated: function() {
            return this.t_update
        },
        getSeconds: function() {
            return this.getTimeUpdated()
        },
        getRestInterval: function() {
            return this.t_rest
        },
        getLastUpdateSeconds: function() {
            return this.t_last
        },
        setRestInterval: function(g) {
            this.t_rest = g
        },
        getUpdateCount: function() {
            return this.n_updates
        },
        breakChain: function() {
            this.break_chain = !0
        },
        isChainBroken: function() {
            return this.break_chain
        },
        rest: function(g) {
            this.setRestInterval(g || 0)
        },
        awake: function() {
            this.t_rest = 0
        },
        update: function(g, c) {
            if (!this.enabled) return !1;
            var a = 0,
                b = !0;
            0 === this.n_updates ? (this.t_updatecall = this.t_update = g, a = 1 / 60) : g !== this.t_update ?
                (this.t_rest || (this.t_last = g - this.t_update, this.t_update = g), a = g - this.t_updatecall, this.t_updatecall = g) : b = !1;
            if (0 < this.t_rest) b && (this.t_resting += a, this.t_rest -= a, 0 > this.t_rest && (this.t_rest = 0));
            else return b && (this.t_active += this.t_last, !this.t_rest && this.interval && (this.t_rest = this.interval), this.n_updates++), this.callEvent(c), !0;
            b && this.n_updates++;
            return !1
        },
        callEvent: function(g) {
            return !this.action ? !1 : this.action(this, g)
        }
    };
    h.prototype = {
        addEvent: function(g) {
            g.callEvent || (g = new t(g));
            var c = g.getId();
            this.eventProperties[c] || (this.eventProperties[c] = {});
            this.listeners[c] = this.listeners[c] || 0;
            this.listeners[c]++;
            this.events.push(g); - 1 === this.listenerNames.indexOf(c) && this.listenerNames.push(c);
            return g
        },
        removeEvent: function(g) {
            if (this.lockState) this.lockRemovals || (this.lockRemovals = []), -1 == this.lockRemovals.indexOf(g) && this.lockRemovals.push(g);
            else {
                var c = this.events.indexOf(g); - 1 !== c && (g = g.getId(), this.events.splice(c, 1), this.listeners[g]--, this.listeners[g] || (this.eventHandled[g] = !0, this.eventParameters[g] = {}, this.eventProperties[g] = [], this.eventPropertyCount[g] = 0, c = this.listenerNames.indexOf(g), 0 <= c && this.listenerNames.splice(c, 1)))
            }
        },
        getProperties: function(g) {
            this.eventParameters[g] = this.eventParameters[g] || {};
            return this.eventParameters[g]
        },
        setProperties: function(g, c) {
            this.eventParameters[g] = c
        },
        getProperty: function(g, c) {
            return this.getProperties(g)[c]
        },
        setProperty: function(g, c, a) {
            this.getProperties(g)[c] = a
        },
        hasEvent: function(g) {
            return !!this.listeners[g]
        },
        triggerEvent: function(g, c) {
            if (!this.listeners[g]) return null;
            this.eventProperties[g] == o && (this.eventProperties[g] = []);
            var a = this.eventProperties[g];
            this.eventPropertyCount[g] === o && (this.eventPropertyCount[g] = 0);
            var b = this.eventPropertyCount[g];
            20 < b && console.log("Warning, event " + g + " count > 20: " + b);
            a[b] = c && a ? c : a[b] || {};
            this.eventPropertyCount[g]++;
            this.eventHandled[g] = !1;
            return a[b]
        },
        update: function(g) {
            var c, a, b, f, e, d;
            if (this.hasEvent(r.event.TICK) && 0 === this.eventPropertyCount[r.event.TICK] && (c = this.triggerEvent(r.event.TICK))) c.time = g, c.handler = this;
            this.lockState = !0;
            c = 0;
            for (a = this.events.length; c < a; c++) {
                e = this.events[c];
                d = e.getId();
                f = this.eventPropertyCount[d];
                var n = !1;
                b = !1;
                if (f) {
                    var s = this.eventProperties[d];
                    if (e.isEnabled()) {
                        if (e.isBuffered()) {
                            if (s.length = f, e.setEventProperties(s), n = n || e.update(g, this), e.isChainBroken()) {
                                e.breakChain(!1);
                                break
                            }
                        } else
                            for (b = 0; b < f; b++)
                                if (e.setEventProperties(s[c]), n = n || e.update(g, this), e.isChainBroken()) {
                                    e.breakChain(!1);
                                    break
                                }
                        b = !0
                    }
                }
                if (n || !b) this.eventHandled[d] = !0
            }
            c = 0;
            for (a = this.listenerNames.length; c < a; c++) d = this.listenerNames[c],
                this.eventHandled[d] && (this.eventPropertyCount[d] = 0);
            this.lockState = !1;
            if (this.lockRemovals && this.lockRemovals.length) {
                c = 0;
                for (a = this.lockRemovals.length; c < a; c++) this.removeEvent(this.lockRemovals[c]);
                this.lockRemovals.length = 0
            }
        }
    };
    return {
        Event: t,
        EventHandler: h,
        registerEvent: function(g) {
            g = g.toUpperCase();
            r.event[g] !== o ? d("Error, event '" + g + "' is already registered.") : (r.event[g] = r.event.ENUM_MAX, r.event.ENUM_MAX++)
        },
        validateEvent: w
    }
});
CubicVR.RegisterModule("Scene", function(m) {
    function w(a, b) {
        return a.light_type - b.light_type
    }

    function t(e, b) {
        var f = null,
            g;
        e !== r && null !== e ? e.compile ? f = {} : (f = m.get(e) || {}, e = null) : f = {};
        this.morphWeight = f.morphWeight || 0;
        this.morphSource = f.morphSource || -1;
        this.morphTarget = f.morphTarget || -1;
        this.position = f.position === r ? [0, 0, 0] : f.position;
        this.rotation = f.rotation === r ? [0, 0, 0] : f.rotation;
        this.scale = f.scale === r ? [1, 1, 1] : f.scale;
        this.shadowCast = f.shadowCast === r ? !0 : f.shadowCast;
        this.wireframe = f.wireframe || !1;
        this.pointMode =
            f.pointMode || !1;
        this.motion = f.motion === r ? null : m.get(f.motion, m.Motion) || null;
        this.obj = !f.mesh ? e ? m.get(e, m.Mesh) : null : m.get(f.mesh, m.Mesh);
        this.name = f.name === r ? b !== r ? b : null : f.name;
        this.properties = m.get(f.properties) || {};
        this.parent = this.children = null;
        var d = f.children || f.child || f.sceneObject || f.sceneObjects;
        if (d) {
            if (d && !d.length || "string" === typeof d) d = [d];
            if (d.length) {
                f = 0;
                for (g = d.length; f < g; f++) this.bindChild(m.get(d[f], m.SceneObject))
            }
        }
        this.drawn_this_frame = !1;
        this.lposition = [0, 0, 0];
        this.lrotation = [0, 0, 0];
        this.lscale = [0, 0, 0];
        this.lMatrix = a.identity();
        this.tMatrix = a.identity();
        this.dirty = !0;
        this.aabb = [];
        this.id = -1;
        this.octree_leaves = [];
        this.octree_common_root = null;
        this.octree_aabb = [
            [0, 0, 0],
            [0, 0, 0]
        ];
        c.reset(this.octree_aabb, [0, 0, 0]);
        this.ignore_octree = !1;
        this.was_culled = this.culled = this.visible = !0;
        this.dynamic_lights = [];
        this.static_lights = [];
        this.matrixLock = !1;
        this.eventHandler = this.instanceMaterials = null;
        this.duplicateCount = 0;
        this.independentMotion = !1
    }

    function h(a, b, c, g, d, h) {
        this.frames = 0;
        this.sceneObjects = [];
        this.sceneObjectsByName = [];
        this.sceneObjectsById = [];
        this.lights = [];
        this.global_lights = [];
        this.dynamic_lights = [];
        this.pickables = [];
        this.stats = [];
        this.cameras = [];
        this.camerasByName = [];
        this.shadows_updated = this.collect_stats = !1;
        if ("object" === typeof a || "string" === typeof a) {
            a = m.get(a);
            this.octree = a.octree;
            this.skybox = a.skybox || null;
            this.name = a.name || "scene" + f;
            this.wireframe = a.wireframe || !1;
            this.pointMode = a.pointMode || !1;
            this.destroy = a.destroy || function() {};
            this.update = a.update || function() {};
            this.enable =
                a.enable || function() {};
            this.disable = a.disable || function() {};
            b = a.setup && a.setup(this) || {};
            this.update = b.update || this.update;
            this.enable = b.enable || this.enable;
            this.disable = b.disable || this.disable;
            this.destroy = b.destroy || this.destroy;
            if ((g = a.sceneObjects || a.sceneObject || a.objects) && !g.length || "string" === typeof g) g = CubicVR.get(g), "object" == typeof g && !g.length && (g = [g]);
            if (g && g.length) {
                b = 0;
                for (c = g.length; b < c; b++) this.bindSceneObject(m.get(g[b], m.SceneObject))
            }
            if ((g = a.lights || a.light) && !g.length || "string" ===
                typeof g) g = CubicVR.get(g), "object" == typeof g && !g.length && (g = [g]);
            if (g && g.length) {
                b = 0;
                for (c = g.length; b < c; b++) this.bindLight(m.get(g[b], m.Light))
            }
            if ((g = a.cameras || a.camera) && !g.length || "string" === typeof g) g = [g], g = CubicVR.get(g), "object" == typeof g && !g.length && (g = [g]);
            if (g && g.length) {
                b = 0;
                for (c = g.length; b < c; b++) this.bindCamera(m.get(g[b], m.Camera));
                this.camera = this.cameras[0]
            }
            g || (this.camera = new m.Camera(a.width, a.height, a.fov, a.nearclip, a.farclip))
        } else this.skybox = null, this.octree = h, this.name = "scene" +
            f, this.camera = new m.Camera(a, b, c, g, d), this.wireframe = !1;
        this.paused = !1;
        ++f
    }

    function o() {
        this.meshBin = {};
        this.imageBin = {};
        this.meshMap = {};
        this.imageMap = {};
        this.imageBinPtr = {};
        this.meshBinPtr = {}
    }
    var r = m.undef,
        d = m.enums,
        g = m.GLCore,
        c = m.aabb,
        a = m.mat4,
        b = 0;
    t.prototype = {
        get x() {
            return this.position[0]
        },
        set x(a) {
            this.position[0] = a
        },
        get y() {
            return this.position[1]
        },
        set y(a) {
            this.position[1] = a
        },
        get z() {
            return this.position[2]
        },
        set z(a) {
            this.position[2] = a
        },
        get rotX() {
            return this.rotation[0]
        },
        set rotX(a) {
            this.rotation[0] =
                a
        },
        get rotY() {
            return this.rotation[1]
        },
        set rotY(a) {
            this.rotation[1] = a
        },
        get rotZ() {
            return this.rotation[2]
        },
        set rotZ(a) {
            this.rotation[2] = a
        },
        get pos() {
            return this.position.slice(0)
        },
        set pos(a) {
            this.position = a.slice(0)
        },
        get rot() {
            return this.rotation.slice(0)
        },
        set rot(a) {
            this.rotation = a.slice(0)
        },
        get sclX() {
            return this.scale[0]
        },
        set sclX(a) {
            this.scale[0] = a
        },
        get sclY() {
            return this.scale[1]
        },
        set sclY(a) {
            this.scale[1] = a
        },
        get sclZ() {
            return this.scale[2]
        },
        set sclZ(a) {
            this.scale[2] = a
        },
        get scl() {
            return this.scale.slice(0)
        },
        set scl(a) {
            this.scale = a.slice(0)
        },
        clone: function() {
            var a, b;
            a = this.name ? this.name + "_" + this.duplicateCount : null;
            this.duplicateCount++;
            var c = new m.SceneObject({
                name: a,
                mesh: this.obj,
                position: this.position.slice(0),
                rotation: this.rotation.slice(0),
                scale: this.scale.slice(0),
                morphWeight: this.morphWeight,
                morphSource: this.morphSource,
                morphTarget: this.morphTarget,
                shadowCast: this.shadowCast,
                wireframe: this.wireframe,
                pointMode: this.pointMode,
                motion: this.motion ? this.motion.clone() : null
            });
            if (null !== this.instanceMaterials) {
                c.instanceMaterials = [];
                a = 0;
                for (b = this.instanceMaterials.length; a < b; a++) c.instanceMaterials[a] = this.instanceMaterials[a].clone()
            }
            if (null !== this.children) {
                a = 0;
                for (b = this.children.length; a < b; a++) c.bindChild(this.children[a].clone())
            }
            return c
        },
        evaluate: function(a) {
            var b, c;
            this.independentMotion = !0;
            this.motion && this.motion.apply(a, this);
            if (null !== this.children) {
                b = 0;
                for (c = this.children.length; b < c; b++) this.children[b].evaluate(a)
            }
        },
        isWireframe: function() {
            return this.wireframe
        },
        setWireframe: function(a) {
            this.wireframe = a
        },
        setPointMode: function(a) {
            this.pointMode =
                a
        },
        isPointMode: function() {
            return this.pointMode
        },
        addEvent: function(a) {
            this.eventHandler || (this.eventHandler = new m.EventHandler);
            a = this.eventHandler.addEvent(a);
            a.setSubject(this);
            return a
        },
        removeEvent: function(a) {
            this.eventHandler && this.eventHandler.removeEvent(a)
        },
        hasEvents: function() {
            return !!this.eventHandler
        },
        getEventHandler: function() {
            return this.eventHandler
        },
        setMesh: function(a) {
            this.obj = a
        },
        getMesh: function() {
            return this.obj
        },
        getProperties: function() {
            return this.properties
        },
        setProperties: function(a) {
            this.properties =
                a
        },
        getProperty: function(a) {
            return this.properties[a]
        },
        setProperty: function(a, b) {
            this.properties[a] = b
        },
        getInstanceMaterials: function() {
            if (!this.obj) return null;
            if (this.instanceMaterials) return this.instanceMaterials;
            this.instanceMaterials = [];
            for (var a = 0, b = this.obj.materials.length; a < b; a++) this.instanceMaterials[a] = this.obj.materials[a].clone();
            return this.instanceMaterials
        },
        getInstanceMaterial: function(a) {
            for (var b = this.getInstanceMaterials(), c = 0, f = b.length; c < f; c++)
                if (b[c].name == a) return b[c];
            return null
        },
        setMorphSource: function(a) {
            this.morphSource = a
        },
        setMorphTarget: function(a) {
            this.morphTarget = a
        },
        getMorphSource: function() {
            return this.morphSource
        },
        getMorphTarget: function() {
            return this.morphTarget
        },
        setMorphWeight: function(a) {
            this.morphWeight = a
        },
        morphTargetCount: function() {
            return null !== this.obj.morphTargets ? this.obj.morphTargets.length : 0
        },
        setMatrixLock: function(a) {
            this.matrixLock = a
        },
        getMatrixLock: function() {
            return this.matrixLock
        },
        setMatrix: function(a) {
            a ? (this.tMatrix = a.slice(0), this.matrixLock = !0,
                this.hasEvents() && (a = this.getEventHandler(), a.hasEvent(d.event.MATRIX_UPDATE) && (a.triggerEvent(d.event.MATRIX_UPDATE).matrix = this.tMatrix))) : this.matrixLock = !1
        },
        doTransform: function(e) {
            var b = m.vec3;
            if (!this.matrixLock && (!b.equal(this.lposition, this.position) || !b.equal(this.lrotation, this.rotation) || !b.equal(this.lscale, this.scale) || e !== r)) e !== r ? this.tMatrix = e.slice(0) : a.identity(this.tMatrix), a.identity(this.lMatrix), a.translate(this.position[0], this.position[1], this.position[2], this.lMatrix), a.rotate(this.rotation[0],
                    this.rotation[1], this.rotation[2], this.lMatrix), 1 === this.scale[0] && 1 === this.scale[1] && 1 === this.scale[2] || a.scale(this.scale[0], this.scale[1], this.scale[2], this.lMatrix), a.multiply(this.tMatrix.slice(0), this.lMatrix, this.tMatrix), this.lposition[0] = this.position[0], this.lposition[1] = this.position[1], this.lposition[2] = this.position[2], this.lrotation[0] = this.rotation[0], this.lrotation[1] = this.rotation[1], this.lrotation[2] = this.rotation[2], this.lscale[0] = this.scale[0], this.lscale[1] = this.scale[1], this.lscale[2] =
                this.scale[2], this.dirty = !0, this.hasEvents() && (e = this.getEventHandler(), e.hasEvent(d.event.MOVE) && (e = e.triggerEvent(d.event.MOVE), e.oldPosition = this.lposition, e.position = this.position, e.oldRotation = this.lrotation, e.rotation = this.rotation, e.oldScale = this.lscale, e.scale = this.scale))
        },
        adjust_octree: function() {
            var a = this.getAABB(),
                b = this.octree_aabb,
                f = a[0][0],
                g = a[0][1],
                d = a[0][2],
                h = a[1][0],
                u = a[1][1],
                o = a[1][2],
                m = b[0][0],
                t = b[0][1],
                D = b[0][2],
                v = b[1][0],
                y = b[1][1],
                b = b[1][2];
            if (0 < this.octree_leaves.length && (f <
                    m || g < t || d < D || h > v || u > y || o > b)) {
                for (f = 0; f < this.octree_leaves.length; ++f) this.octree_leaves[f].remove(this);
                this.octree_leaves = [];
                this.static_lights = [];
                f = this.octree_common_root;
                this.octree_common_root = null;
                if (null !== f) {
                    for (;;)
                        if (!f.contains_point(a[0]) || !f.contains_point(a[1]))
                            if (f._root !== r && null !== f._root) f = f._root;
                            else break;
                    else break;
                    c.reset(this.octree_aabb, this.position);
                    f.insert(this)
                }
            }
        },
        bindChild: function(a) {
            null === this.children && (this.children = []);
            a.parent = this;
            this.children.push(a)
        },
        control: function(a,
            b, c) {
            a === d.motion.POS ? this.position[b] = c : a === d.motion.SCL ? this.scale[b] = c : a === d.motion.ROT && (this.rotation[b] = c)
        },
        getAABB: function() {
            var a = m.mat4,
                b = m.vec3;
            if (this.dirty) {
                var c = Array(8);
                this.doTransform();
                var f, g;
                if (this.obj) {
                    if (!this.obj.bb) return this.aabb = [b.add([-1, -1, -1], this.position), b.add([1, 1, 1], this.position)];
                    f = this.obj.bb[0];
                    g = this.obj.bb[1]
                }
                if (!this.obj || f === r || g === r) return this.aabb = [b.add([-1, -1, -1], this.position), b.add([1, 1, 1], this.position)];
                var d = f;
                f = b.subtract(g, f);
                c[0] = [d[0], d[1],
                    d[2]
                ];
                c[1] = [d[0], d[1], d[2] + f[2]];
                c[2] = [d[0] + f[0], d[1], d[2]];
                c[3] = [d[0] + f[0], d[1], d[2] + f[2]];
                c[4] = [d[0], d[1] + f[1], d[2]];
                c[5] = [d[0], d[1] + f[1], d[2] + f[2]];
                c[6] = [d[0] + f[0], d[1] + f[1], d[2]];
                c[7] = [d[0] + f[0], d[1] + f[1], d[2] + f[2]];
                d = a.vec3_multiply(c[0], this.tMatrix);
                f = [d[0], d[1], d[2]];
                g = [d[0], d[1], d[2]];
                for (b = 1; 8 > b; ++b) d = a.vec3_multiply(c[b], this.tMatrix), f[0] > d[0] && (f[0] = d[0]), f[1] > d[1] && (f[1] = d[1]), f[2] > d[2] && (f[2] = d[2]), g[0] < d[0] && (g[0] = d[0]), g[1] < d[1] && (g[1] = d[1]), g[2] < d[2] && (g[2] = d[2]);
                this.aabb[0] = f;
                this.aabb[1] = g;
                this.dirty = !1
            }
            return this.aabb
        }
    };
    var f = 0;
    h.prototype = {
        isWireframe: function() {
            return this.wireframe
        },
        setWireframe: function(a) {
            this.wireframe = a
        },
        setPointMode: function(a) {
            this.pointMode = a
        },
        isPointMode: function() {
            return this.pointMode
        },
        attachOctree: function(a) {
            this.octree = a;
            a.init && a.init(this);
            a = this.lights;
            this.lights = [];
            for (var f = 0, g = a.length; f < g; f++) this.bindLight(a[f]);
            a = this.sceneObjects;
            if (this.octree !== r) {
                f = 0;
                for (g = a.length; f < g; ++f) {
                    var d = a[f];
                    null !== d.obj && (0 > d.id && (d.id = b, ++b),
                        this.sceneObjectsById[d.id] = d, c.reset(d.octree_aabb, d.position), this.octree.insert(d), (void 0 === d.octree_common_root || null === d.octree_common_root) && log("!!", d.name, "octree_common_root is null"))
                }
            }
        },
        setSkyBox: function(a) {
            this.skybox = a
        },
        getSceneObject: function(a) {
            return this.sceneObjectsByName[a]
        },
        bindSceneObject: function(a, f, g) {
            if (-1 == this.sceneObjects.indexOf(a)) {
                this.sceneObjects.push(a);
                f !== r && f && this.pickables.push(a);
                null !== a.name && (this.sceneObjectsByName[a.name] = a);
                if (this.octree !== r && (g ===
                        r || "true" === g)) 0 > a.id && (a.id = b, ++b), this.sceneObjectsById[a.id] = a, c.reset(a.octree_aabb, a.position), this.octree.insert(a);
                if (a.children)
                    for (var d = 0, h = a.children.length; d < h; d++) this.bindSceneObject(a.children[d], f, g);
                return a
            }
        },
        removeLight: function(a) {
            a = this.lights.indexOf(a);
            0 <= a && this.lights.splice(a, 1)
        },
        removeSceneObject: function(a) {
            var b;
            if (this.lockState) this.lockRemovals || (this.lockRemovals = []), -1 == this.lockRemovals.indexOf(a) && this.lockRemovals.push(a);
            else if (b = this.sceneObjects.indexOf(a),
                0 <= b && this.sceneObjects.splice(b, 1), b = this.pickables.indexOf(a), 0 <= b && this.pickables.splice(b, 1), null !== a.name && this.sceneObjectsByName[a.name] !== r && delete this.sceneObjectsByName[a.name], a.children) {
                b = 0;
                for (var c = a.children.length; b < c; b++) this.removeSceneObject(a.children[b])
            }
        },
        bindLight: function(a, b) {
            this.lights.push(a);
            if (this.octree !== r && (b === r || "true" === b)) a.method === d.light.method.GLOBAL ? this.global_lights.push(a) : (a.method === d.light.method.DYNAMIC && this.dynamic_lights.push(a), this.octree.insert_light(a));
            this.lights = this.lights.sort(w)
        },
        bindCamera: function(a) {
            -1 === this.cameras.indexOf(a) && (this.cameras.push(a), this.camerasByName[a.name] = a);
            this.camera = a
        },
        removeCamera: function(a) {
            "object" !== typeof a && (a = this.getCamera(camName)); - 1 === this.cameras.indexOf(a) && (this.cameras.push(a), this.camerasByName[a.name] = a);
            return a
        },
        bind: function(a, b) {
            a instanceof m.Light ? this.bindLight(a) : a instanceof m.SceneObject ? this.bindSceneObject(a, b) : a instanceof m.Camera ? this.bindCamera(a) : a instanceof m.Vehicle ? a.bindToScene(this) :
                a instanceof m.RigidBody && this.bindSceneObject(a.getSceneObject())
        },
        remove: function(a) {
            a instanceof m.Light ? this.removeLight(a) : a instanceof m.SceneObject ? this.removeSceneObject(a) : a instanceof m.Camera ? this.removeCamera(a) : a instanceof bsae.RigidBody && this.removeSceneObject(a.getSceneObject())
        },
        setCamera: function(a) {
            a && ("object" !== typeof a && (a = this.getCamera(a)), this.camera = a)
        },
        getCamera: function(a) {
            return a === r ? this.camera : this.camerasByName[a]
        },
        evaluate: function(a) {
            var b, c;
            b = 0;
            for (c = this.sceneObjects.length; b <
                c; b++) this.sceneObjects[b].motion && !this.sceneObjects[b].independentMotion && this.sceneObjects[b].motion.apply(a, this.sceneObjects[b]);
            null !== this.camera.motion && (null !== this.camera.targetSceneObject && (this.camera.target = this.camera.targetSceneObject.position), this.camera.motion.apply(a, this.camera));
            b = 0;
            for (c = this.lights.length; b < c; b++) {
                var f = this.lights[b];
                null !== f.motion && f.motion.apply(a, f)
            }
        },
        prepareTransforms: function(a) {
            var b, c;
            if (a) {
                if (a.doTransform(), a.children) {
                    b = 0;
                    for (c = a.children.length; b <
                        c; b++) a.children[b].doTransform(a.tMatrix), this.prepareTransforms(a.children[b])
                }
            } else if (0 !== this.sceneObjects.length) {
                b = 0;
                for (c = this.sceneObjects.length; b < c; ++b) this.prepareTransforms(this.sceneObjects[b])
            }
        },
        updateShadows: function(a, b) {
            var c = g.gl,
                b = b || this.camera;
            if (this.shadows_updated) return !1;
            a || this.doTransform();
            this.shadows_updated = !0;
            if (m.features.lightShadows) {
                for (var f = c.getParameter(c.FRAMEBUFFER_BINDING), h = !1, o = c.getParameter(c.VIEWPORT), u = 0, r = this.lights.length; u < r; u++) {
                    var z = this.lights[u];
                    if (z.light_type == d.light.type.SPOT_SHADOW || z.light_type == d.light.type.SPOT_SHADOW_PROJECTOR || z.light_type == d.light.type.AREA) {
                        var h = !0,
                            t = [new m.Light(d.light.type.DEPTH_PACK)];
                        z.light_type === d.light.type.AREA && (z.areaCam = b, z.updateAreaLight());
                        g.shadow_near = z.dummyCam.nearclip;
                        g.shadow_far = z.dummyCam.farclip;
                        z.shadowBegin();
                        for (var D = 0, v = this.sceneObjects.length; D < v; D++) {
                            var y = this.sceneObjects[D];
                            y.parent || !1 === y.visible || !1 === y.shadowCast || this.renderSceneObject(y, z.dummyCam, t, !1, !0)
                        }
                        z.shadowEnd();
                        f && c.bindFramebuffer(c.FRAMEBUFFER, f)
                    }
                }
                h && c.viewport(o[0], o[1], o[2], o[3])
            }
        },
        updateCamera: function(a) {
            a = a || this.camera;
            !1 === a.manual && (a.targeted ? a.lookat(a.position[0], a.position[1], a.position[2], a.target[0], a.target[1], a.target[2], 0, 1, 0) : a.calcProjection());
            g.depth_alpha_near = a.nearclip;
            g.depth_alpha_far = a.farclip
        },
        resize: function(a, b) {
            this.camera && this.camera.setDimensions(a, b)
        },
        doTransform: function() {
            for (var a = this.octree !== r, b = 0, c = this.sceneObjects.length; b < c; b++) {
                var f = this.sceneObjects[b];
                null ===
                    f.parent && (this.prepareTransforms(f), a && (lights = [], f.dirty && null !== f.obj && f.adjust_octree(), !1 === f.visible || a && (f.ignore_octree || !0 === f.drawn_this_frame || !0 === f.culled) || (lights = f.dynamic_lights, lights = lights.concat(f.static_lights), lights = lights.concat(this.global_lights), this.collect_stats && (this.lights_rendered = Math.max(lights.length, this.lights_rendered), this.lights_rendered === lights.length && (lights_list = lights), ++this.objects_rendered), lights = 0 === lights.length ? [g.emptyLight] : lights.sort(w), f.drawn_this_frame = !0)))
            }
        },
        renderSceneObject: function(a, b, c, f, d, h, u) {
            var o = !1,
                z = g.gl,
                f = f !== r && f,
                d = d || !1,
                h = h || !1;
            if (a.visible && a.obj) {
                0 > a.scale[0] && (o = !o);
                0 > a.scale[1] && (o = !o);
                0 > a.scale[2] && (o = !o);
                o && z.cullFace(z.FRONT);
                var t = a.obj;
                null !== t.morphTargets && (-1 !== a.morphSource && t.setMorphSource(a.morphSource), -1 !== a.morphTarget && t.setMorphTarget(a.morphTarget), null !== a.morphWeight && (t.morphWeight = a.morphWeight));
                a.instanceMaterials && t.bindInstanceMaterials(a.instanceMaterials);
                m.renderObject(t, b, a.tMatrix, c, d, h, this.isWireframe() ||
                    a.isWireframe(), this.isPointMode() || a.isPointMode()) && u && u.push(a);
                a.instanceMaterials && t.bindInstanceMaterials(null);
                o && z.cullFace(z.BACK)
            }
            a = a.children;
            if (f && a) {
                f = 0;
                for (o = a.length; f < o; f++) this.renderSceneObject(a[f], b, c, !0, d, h, u)
            }
        },
        runEvents: function(a) {
            var b, c;
            this.lockState = !0;
            a.getSeconds && (a = a.getSeconds());
            b = 0;
            for (c = this.sceneObjects.length; b < c; b++) {
                var f = this.sceneObjects[b];
                f.hasEvents() && f.getEventHandler().update(a)
            }
            this.lockState = !1;
            if (this.lockRemovals) {
                b = 0;
                for (c = this.lockRemovals.length; b <
                    c; b++) this.removeSceneObject(this.lockRemovals[b])
            }
            this.lockRemovals = null
        },
        render: function(b) {
            ++this.frames;
            b = b || {};
            b.postProcess && b.postProcess.begin(!b.postBuffer);
            var c = b.camera || this.camera,
                f = g.gl,
                d;
            d = this.octree !== r;
            this.lights_rendered = 0;
            d && (this.octree.reset_node_visibility(), this.octree.cleanup(), d = this.octree.get_frustum_hits(c), this.lights_rendered = d.lights.length);
            this.doTransform();
            this.updateCamera(c);
            this.updateShadows(!0);
            this.shadows_updated = !1;
            var h;
            d = 0;
            for (h = this.lights.length; d <
                h; d++) this.lights[d].prepare(c);
            this.objects_rendered = 0;
            var o = [],
                u = [],
                t = this.lights;
            d = 0;
            for (h = this.sceneObjects.length; d < h; d++) {
                var z = this.sceneObjects[d];
                !1 === z.visible || null !== z.parent || this.renderSceneObject(z, c, t, !0, !0, !1, u)
            }
            d = 0;
            for (h = u.length; d < h; d++) this.renderSceneObject(u[d], c, t, !1, !1, !0);
            this.collect_stats && (this.stats["objects.num_rendered"] = this.objects_rendered, this.stats["lights.num_rendered"] = this.lights_rendered, this.stats["lights.rendered"] = o, this.stats["lights.num_global"] = this.global_lights.length,
                this.stats["lights.num_dynamic"] = this.dynamic_lights.length);
            null !== this.skybox && !0 === this.skybox.ready && (f.cullFace(f.FRONT), d = 2 * c.farclip / Math.sqrt(3), this.skybox.scene_object.position = c.parent ? a.vec3_multiply(c.position, c.parent.tMatrix) : [c.position[0], c.position[1], c.position[2]], this.skybox.scene_object.scale = [d, d, d], this.skybox.scene_object.doTransform(), m.renderObject(this.skybox.scene_object.obj, c, this.skybox.scene_object.tMatrix, []), f.cullFace(f.BACK));
            b.postProcess && (b.postProcess.end(),
                b.postBuffer || b.postProcess.render())
        },
        bbRayTest: function(a, b, c, f) {
            var g = m.vec3,
                d = [],
                f = f || this.camera,
                b = 2 === b.length ? f.unProject(b[0], b[1]) : g.add(a, b),
                h;
            for (h in this.pickables)
                if (this.pickables.hasOwnProperty(h) && (f = this.pickables[h], !0 === f.visible)) {
                    var o, r;
                    r = f.getAABB();
                    o = r[0];
                    r = r[1];
                    0.2 > r[0] - o[0] && (o[0] -= 0.1, r[0] += 0.1);
                    0.2 > r[1] - o[1] && (o[1] -= 0.1, r[1] += 0.1);
                    0.2 > r[2] - o[2] && (o[2] -= 0.1, r[2] += 0.1);
                    var t = g.multiply(g.add(o, r), 0.5),
                        D = g.getClosestTo(a, b, t),
                        t = g.length(g.subtract(D, t));
                    (D[0] >= o[0] && D[0] <=
                        r[0] ? 1 : 0) + (D[1] >= o[1] && D[1] <= r[1] ? 1 : 0) + (D[2] >= o[2] && D[2] <= r[2] ? 1 : 0) >= c && d.push({
                        dist: t,
                        obj: f
                    })
                }
            d.length && d.sort(function(a, b) {
                return a.dist == b.dist ? 0 : a.dist < b.dist ? -1 : 1
            });
            return d
        }
    };
    o.prototype = {
        addMesh: function(a, b, c) {
            this.meshBin[a] === r && (this.meshBin[a] = [], this.meshBinPtr[a] === r && (this.meshBinPtr[a] = 0));
            this.meshMap[b] === r && (this.meshMap[b] = c, this.meshBin[a].push(c))
        },
        addImage: function(a, b, c) {
            this.imageBin[a] === r && (this.imageBin[a] = [], this.imageBinPtr[a] === r && (this.imageBinPtr[a] = 0));
            this.imageMap[b] ===
                r && (this.imageMap[b] = c, this.imageBin[a].push(c))
        },
        getMeshes: function(a) {
            return this.meshBin[a]
        },
        getImages: function(a) {
            return this.imageBin[a]
        },
        rewindMeshes: function(a) {
            this.meshBinPtr[a] = 0
        },
        rewindImages: function(a) {
            this.imageBinPtr[a] = 0
        },
        getNextMesh: function(a) {
            var b = this.meshBinPtr[a];
            return b < this.meshBin[a].length ? (this.meshBinPtr[a]++, this.meshBin[a][b]) : null
        },
        loadNextMesh: function(a) {
            a = this.getNextMesh(a);
            return null !== a ? (null === a.compiled && (a.triangulateQuads(), a.compile(), a.clean()), !0) : !1
        },
        isMeshBinEmpty: function(a) {
            return this.meshBinPtr[a] === this.meshBin[a].length
        },
        loadNextImage: function(a) {
            a = this.getNextImage(a);
            null !== a && (a.src = a.deferredSrc)
        },
        getNextImage: function(a) {
            var b = this.imageBinPtr[a];
            return b < this.imageBin[a].length ? (this.imageBinPtr[a]++, this.imageBin[a][b]) : null
        },
        isImageBinEmpty: function(a) {
            return this.imageBinPtr[a] === this.imageBin[a].length
        }
    };
    return {
        Scene: h,
        SceneObject: t,
        SkyBox: function(a) {
            var b = a.texture,
                a = a.mapping,
                c = this;
            this.mapping = null;
            this.ready = !1;
            this.texture =
                null;
            this.onready = function() {
                b.onready = null;
                var a = 1 / m.Images[c.texture.tex_id].width;
                null === c.mapping && (c.mapping = [
                    [1 / 3, 0.5, 2 / 3 - a, 1],
                    [0, 0.5, 1 / 3, 1],
                    [0, 0, 1 / 3 - a, 0.5],
                    [2 / 3, 0, 1, 0.5],
                    [2 / 3 + a, 0.5, 1, 1],
                    [1 / 3, 0, 2 / 3, 0.5]
                ]);
                var a = new m.Material({
                        name: "skybox",
                        textures: {
                            color: b
                        },
                        noFog: !0
                    }),
                    e = new m.Mesh;
                e.sky_mapping = c.mapping;
                m.primitives.box({
                    mesh: e,
                    size: 1,
                    material: a,
                    uvmapper: {
                        projectionMode: m.enums.uv.projection.SKY,
                        scale: [1, 1, 1]
                    }
                });
                e.prepare();
                c.scene_object = new m.SceneObject(e);
                c.ready = !0
            };
            if (b && ("string" ===
                    typeof b ? b = new m.Texture(b, null, null, null, this.onready) : b.loaded || (b.onready = this.onready), this.texture = b, a)) this.mapping = a, this.onready()
        },
        DeferredBin: o
    }
});
CubicVR.RegisterModule("PostProcess", function(m) {
    function w(a) {
        if (a.shader_vertex === o || a.shader_fragment === o) return null;
        this.outputMode = a.outputMode === o ? d.post.output.REPLACE : CubicVR.parseEnum(CubicVR.enums.post.output, a.outputMode);
        this.onresize = a.onresize === o ? null : a.onresize;
        this.onupdate = a.onupdate === o ? null : a.onupdate;
        this.init = a.init === o ? null : a.init;
        this.enabled = a.enabled === o ? !0 : a.enabled;
        this.outputDivisor = a.outputDivisor === o ? 1 : a.outputDivisor;
        this.shader = new CubicVR.Shader(a.shader_vertex,
            a.shader_fragment);
        this.shader.use();
        this.shader.addUVArray("aTex");
        this.shader.addVertexArray("aVertex");
        this.shader.addInt("srcTex", 0);
        this.shader.addInt("captureTex", 1);
        this.shader.addVector("texel");
        null !== this.init && this.init(this.shader)
    }

    function t(a, b, c) {
        var e = r.gl;
        this.width = a;
        this.height = b;
        this.accum = c === o ? !1 : !0;
        this.vTexel = [1 / this.width, 1 / this.height, 0];
        this.captureBuffer = new CubicVR.RenderBuffer(a, b, !0);
        this.bufferA = new CubicVR.RenderBuffer(a, b, !1);
        this.bufferB = new CubicVR.RenderBuffer(a,
            b, !1);
        this.bufferC = new CubicVR.RenderBuffer(a, b, !1);
        this.accumOpacity = 1;
        this.accumIntensity = 0.3;
        this.accum && (this.accumBuffer = new CubicVR.RenderBuffer(a, b, !1), this.accumBuffer.use(), e.clearColor(0, 0, 0, 1), e.clear(e.COLOR_BUFFER_BIT), this.blur_shader = new w({
            shader_vertex: "attribute vec3 aVertex;\nattribute vec2 aTex;\nvarying vec2 vTex;\nvoid main(void)\n{\nvTex = aTex;\nvec4 vPos = vec4(aVertex.xyz,1.0);\ngl_Position = vPos;\n}",
            shader_fragment: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D srcTex;\nvarying vec2 vTex;\nuniform float opacity;\nvoid main(void)\n{ gl_FragColor = vec4(texture2D(srcTex, vTex).rgb, opacity);\n}",
            init: function(a) {
                a.addFloat("opacity");
                a.setFloat("opacity", 1)
            }
        }));
        this.bufferA.use();
        e.clearColor(0, 0, 0, 1);
        e.clear(e.COLOR_BUFFER_BIT);
        this.bufferB.use();
        e.clearColor(0, 0, 0, 1);
        e.clear(e.COLOR_BUFFER_BIT);
        this.end();
        this.fsQuad = this.makeFSQuad(this.width, this.height);
        this.shaders = [];
        this.copy_shader = new w({
            shader_vertex: "attribute vec3 aVertex;\nattribute vec2 aTex;\nvarying vec2 vTex;\nvoid main(void) {\nvTex = aTex;\nvec4 vPos = vec4(aVertex.xyz,1.0);\ngl_Position = vPos;\n}",
            shader_fragment: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D srcTex;\nvarying vec2 vTex;\nvoid main(void) {\ngl_FragColor = texture2D(srcTex, vTex);\n}"
        });
        this.resize(a, b)
    }

    function h(a, b, c) {
        this.createBuffer(a, b, c)
    }
    var o = m.undef,
        r = m.GLCore,
        d = CubicVR.enums;
    d.post = {
        output: {
            REPLACE: 0,
            BLEND: 1,
            ADD: 2,
            ALPHACUT: 3
        }
    };
    var g = [],
        c = [];
    t.prototype = {
        setBlurOpacity: function(a) {
            this.accumOpacity = a
        },
        setBlurIntensity: function(a) {
            this.accumIntensity = a
        },
        makeFSQuad: function(a, b) {
            var c = r.gl,
                e = {},
                g = a / a,
                d = b / b;
            e.vbo_points = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0, -1, -1, 0, 1, 1, 0]);
            e.vbo_uvs = new Float32Array([0, 0, g, 0, g, d, 0, d, 0, 0, g, d]);
            e.gl_points = c.createBuffer();
            c.bindBuffer(c.ARRAY_BUFFER,
                e.gl_points);
            c.bufferData(c.ARRAY_BUFFER, e.vbo_points, c.STATIC_DRAW);
            e.gl_uvs = c.createBuffer();
            c.bindBuffer(c.ARRAY_BUFFER, e.gl_uvs);
            c.bufferData(c.ARRAY_BUFFER, e.vbo_uvs, c.STATIC_DRAW);
            return e
        },
        destroyFSQuad: function(a) {
            var b = r.gl;
            b.deleteBuffer(a.gl_points);
            b.deleteBuffer(a.gl_uvs)
        },
        renderFSQuad: function(a, b) {
            var c = r.gl;
            a.use();
            c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, null);
            c.bindBuffer(c.ARRAY_BUFFER, b.gl_points);
            c.vertexAttribPointer(a.aVertex, 3, c.FLOAT, !1, 0, 0);
            c.enableVertexAttribArray(a.aVertex);
            c.bindBuffer(c.ARRAY_BUFFER, b.gl_uvs);
            c.vertexAttribPointer(a.aTex, 2, c.FLOAT, !1, 0, 0);
            c.enableVertexAttribArray(a.aTex);
            c.bindBuffer(c.ELEMENT_ARRAY_BUFFER, null);
            c.drawArrays(c.TRIANGLES, 0, 6)
        },
        addShader: function(a) {
            this.shaders[this.shaders.length] = a;
            a.shader.use();
            a.shader.setVector("texel", this.vTexel);
            if (a.outputDivisor && 1 != a.outputDivisor && g[a.outputDivisor] === o) {
                var b = this.width / a.outputDivisor | 0,
                    f = this.height / a.outputDivisor | 0;
                g[a.outputDivisor] = new CubicVR.RenderBuffer(b, f, !1);
                c[a.outputDivisor] =
                    this.makeFSQuad(b, f)
            }
        },
        resize: function(a, b) {
            var f = r.gl;
            this.width = a;
            this.height = b;
            this.vTexel = [1 / this.width, 1 / this.height, 0];
            this.captureBuffer.destroyBuffer();
            this.captureBuffer.createBuffer(this.width, this.height, !0);
            this.bufferA.destroyBuffer();
            this.bufferA.createBuffer(this.width, this.height, !1);
            this.bufferB.destroyBuffer();
            this.bufferB.createBuffer(this.width, this.height, !1);
            this.bufferC.destroyBuffer();
            this.bufferC.createBuffer(this.width, this.height, !1);
            this.accum && (this.accumBuffer.destroyBuffer(),
                this.accumBuffer.createBuffer(this.width, this.height, !1), this.accumBuffer.use(), f.clearColor(0, 0, 0, 1), f.clear(f.COLOR_BUFFER_BIT));
            for (var e in g) {
                var f = this.width / e | 0,
                    d = this.height / e | 0;
                g[e].destroyBuffer();
                g[e].createBuffer(f, d, !1);
                this.destroyFSQuad(c[e]);
                c[e] = this.makeFSQuad(f, d)
            }
            this.inputBuffer = this.bufferA;
            this.outputBuffer = this.bufferB;
            e = 0;
            for (f = this.shaders.length; e < f; e++)
                if (this.shaders[e].shader.use(), this.shaders[e].shader.setVector("texel", this.vTexel), null !== this.shaders[e].onresize) this.shaders[e].onresize(this.shaders[e].shader,
                    this.width, this.height);
            this.destroyFSQuad(this.fsQuad);
            this.fsQuad = this.makeFSQuad(this.width, this.height)
        },
        swap: function() {
            var a = this.inputBuffer;
            this.inputBuffer = this.outputBuffer;
            this.outputBuffer = a
        },
        begin: function(a) {
            var b = r.gl;
            this.captureBuffer.use();
            a && (this.captureBuffer.depth ? b.clear(b.DEPTH_BUFFER_BIT | b.COLOR_BUFFER_BIT) : b.clear(b.COLOR_BUFFER_BIT))
        },
        end: function() {
            var a = r.gl;
            a.bindFramebuffer(a.FRAMEBUFFER, null)
        },
        render: function() {
            var a = r.gl;
            this.captureBuffer.texture.use(a.TEXTURE1);
            this.outputBuffer.use();
            this.captureBuffer.texture.use(a.TEXTURE0);
            a.clearColor(0, 0, 0, 1);
            a.clear(a.COLOR_BUFFER_BIT);
            this.renderFSQuad(this.copy_shader.shader, this.fsQuad);
            this.end();
            for (var b = 0, f = 0, e = this.shaders.length; f < e; f++) {
                var q = this.shaders[f];
                if (q.enabled) {
                    this.swap();
                    this.inputBuffer.texture.use(a.TEXTURE0);
                    var n = q.outputMode;
                    if (n === d.post.output.REPLACE) 1 !== q.outputDivisor ? g[q.outputDivisor].use() : this.outputBuffer.use(), a.clearColor(0, 0, 0, 1), a.clear(a.COLOR_BUFFER_BIT);
                    else if (n === d.post.output.ADD ||
                        n === d.post.output.BLEND) 1 !== q.outputDivisor ? g[q.outputDivisor].use() : this.bufferC.use(), a.clearColor(0, 0, 0, 1), a.clear(a.COLOR_BUFFER_BIT);
                    null !== q.onupdate && (q.shader.use(), q.onupdate(q.shader));
                    1 !== q.outputDivisor ? (a.viewport(0, 0, g[q.outputDivisor].width, g[q.outputDivisor].height), this.renderFSQuad(q.shader, c[q.outputDivisor]), q.outputMode === d.post.output.REPLACE ? (this.outputBuffer.use(), g[q.outputDivisor].texture.use(a.TEXTURE0), a.viewport(0, 0, this.width, this.height), this.renderFSQuad(this.copy_shader.shader,
                        this.fsQuad)) : a.viewport(0, 0, this.width, this.height)) : this.renderFSQuad(q.shader, this.fsQuad);
                    n === d.post.output.BLEND ? (this.swap(), this.outputBuffer.use(), a.enable(a.BLEND), a.blendFunc(a.ONE, a.ONE_MINUS_SRC_ALPHA), this.inputBuffer.texture.use(a.TEXTURE0), 1 !== q.outputDivisor ? g[q.outputDivisor].texture.use(a.TEXTURE0) : this.bufferC.texture.use(a.TEXTURE0), this.renderFSQuad(this.copy_shader.shader, this.fsQuad), a.disable(a.BLEND)) : n === d.post.output.ADD && (this.swap(), this.outputBuffer.use(), a.enable(a.BLEND),
                        a.blendFunc(a.ONE, a.ONE), 1 !== q.outputDivisor ? g[q.outputDivisor].texture.use(a.TEXTURE0) : this.bufferC.texture.use(a.TEXTURE0), this.renderFSQuad(this.copy_shader.shader, this.fsQuad), a.disable(a.BLEND));
                    this.end();
                    b++
                }
            }
            0 === b ? this.captureBuffer.texture.use(a.TEXTURE0) : this.outputBuffer.texture.use(a.TEXTURE0);
            this.accum && 1 !== this.accumOpacity ? (this.blur_shader.shader.use(), this.blur_shader.shader.setFloat("opacity", this.accumOpacity), this.accumBuffer.use(), a.enable(a.BLEND), a.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA),
                this.renderFSQuad(this.blur_shader.shader, this.fsQuad), this.end(), a.disable(a.BLEND), this.renderFSQuad(this.copy_shader.shader, this.fsQuad), a.enable(a.BLEND), a.blendFunc(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA), this.blur_shader.shader.use(), this.blur_shader.shader.setFloat("opacity", this.accumIntensity), this.accumBuffer.texture.use(a.TEXTURE0), this.renderFSQuad(this.blur_shader.shader, this.fsQuad), a.disable(a.BLEND)) : this.renderFSQuad(this.copy_shader.shader, this.fsQuad)
        }
    };
    h.prototype = {
        createBuffer: function(a,
            b, c) {
            this.texture = this.depth = this.fbo = null;
            this.width = parseInt(a, 10);
            this.height = parseInt(b, 10);
            var a = this.sizeParam(a),
                b = this.sizeParam(b),
                e = r.gl;
            this.fbo = e.createFramebuffer();
            c && (this.depth = e.createRenderbuffer());
            e.bindFramebuffer(e.FRAMEBUFFER, this.fbo);
            c && (e.bindRenderbuffer(e.RENDERBUFFER, this.depth), -1 !== navigator.appVersion.indexOf("Windows") ? (e.renderbufferStorage(e.RENDERBUFFER, e.DEPTH_COMPONENT16, a, b), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.DEPTH_ATTACHMENT, e.RENDERBUFFER, this.depth)) :
                (e.renderbufferStorage(e.RENDERBUFFER, e.DEPTH_STENCIL, a, b), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.DEPTH_STENCIL_ATTACHMENT, e.RENDERBUFFER, this.depth)));
            this.texture = new CubicVR.Texture;
            e.bindTexture(e.TEXTURE_2D, m.Textures[this.texture.tex_id]);
            e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR);
            e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST);
            e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE);
            e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE);
            e.texImage2D(e.TEXTURE_2D,
                0, e.RGBA, a, b, 0, e.RGBA, e.UNSIGNED_BYTE, null);
            e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, m.Textures[this.texture.tex_id], 0);
            e.bindFramebuffer(e.FRAMEBUFFER, null)
        },
        destroyBuffer: function() {
            var a = r.gl;
            a.bindFramebuffer(a.FRAMEBUFFER, null);
            a.deleteRenderbuffer(this.depth);
            a.deleteFramebuffer(this.fbo);
            a.deleteTexture(m.Textures[this.texture.tex_id]);
            m.Textures[this.texture.tex_id] = null
        },
        sizeParam: function(a) {
            return a
        },
        use: function() {
            var a = r.gl;
            a.bindFramebuffer(a.FRAMEBUFFER,
                this.fbo)
        }
    };
    return {
        RenderBuffer: h,
        PostProcessShader: w,
        PostProcessChain: t,
        fsQuad: {
            make: t.prototype.makeFSQuad,
            destroy: t.prototype.destroyFSQuad,
            render: t.prototype.renderFSQuad
        }
    }
});
CubicVR.RegisterModule("Layout", function() {
    function m(m) {
        this.texture = m.texture ? m.texture : null;
        this.width = m.width ? m.width : 128;
        this.height = m.height ? m.height : 128;
        this.x = m.x ? m.x : 0;
        this.y = m.y ? m.y : 0;
        this.blend = m.blend ? m.blend : !1;
        this.opacity = "undefined" !== typeof m.opacity ? m.opacity : 1;
        this.tint = m.tint ? m.tint : [1, 1, 1];
        this.type = "view";
        this.superView = null;
        this.childViews = [];
        this.panel = null
    }

    function w(m) {
        this.texture = m.texture ? m.texture : null;
        this.width = m.width ? m.width : 128;
        this.height = m.height ? m.height : 128;
        this.x = m.x ? m.x : 0;
        this.y = m.y ? m.y : 0;
        this.blend = m.blend ? m.blend : !1;
        this.opacity = "undefined" !== typeof m.opacity ? m.opacity : 1;
        this.tint = m.tint ? m.tint : [1, 1, 1];
        this.type = "root";
        this.superView = null;
        this.childViews = [];
        this.setupShader();
        this.panel = null;
        this.makePanel(this)
    }
    m.prototype = {
        addSubview: function(m) {
            this.childViews.push(m);
            m.superView = this
        },
        makePanel: function(m) {
            return this.superView.makePanel(m)
        }
    };
    w.prototype = {
        resize: function(m, h) {
            this.width = m;
            this.height = h
        },
        setupShader: function() {
            this.shader = new CubicVR.PostProcessShader({
                shader_vertex: "attribute vec3 aVertex;\nattribute vec2 aTex;\nvarying vec2 vTex;\nuniform vec3 screen;\nuniform vec3 position;\nuniform vec3 size;\nvoid main(void) {\nvTex = aTex;\nvec4 vPos = vec4(aVertex.xyz,1.0);\nvPos.x *= size.x/screen.x;\nvPos.y *= size.y/screen.y;\nvPos.x += (size.x/screen.x);\nvPos.y -= (size.y/screen.y);\nvPos.x += (position.x/screen.x)*2.0 - 1.0;\nvPos.y -= (position.y/screen.y)*2.0 - 1.0;\ngl_Position = vPos;\n}",
                shader_fragment: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform sampler2D srcTex;\nuniform vec3 tint;\nvarying vec2 vTex;\nvoid main(void) {\nvec4 color = texture2D(srcTex, vTex)*vec4(tint,1.0);\ngl_FragColor = color;\n}",
                init: function(m) {
                    m.setInt("srcTex", 0);
                    m.addVector("screen");
                    m.addVector("position");
                    m.addVector("tint");
                    m.addVector("size")
                }
            })
        },
        addSubview: function(m) {
            this.childViews.push(m);
            m.superView = this
        },
        removeSubview: function(m) {
            m = this.childViews.indexOf(m); - 1 < m && this.childViews.splice(m,
                1)
        },
        makePanel: function(m) {
            var h = CubicVR.GLCore.gl,
                o = {};
            o.vbo_points = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0, -1, -1, 0, 1, 1, 0]);
            o.vbo_uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1]);
            o.gl_points = h.createBuffer();
            h.bindBuffer(h.ARRAY_BUFFER, o.gl_points);
            h.bufferData(h.ARRAY_BUFFER, o.vbo_points, h.STATIC_DRAW);
            o.gl_uvs = h.createBuffer();
            h.bindBuffer(h.ARRAY_BUFFER, o.gl_uvs);
            h.bufferData(h.ARRAY_BUFFER, o.vbo_uvs, h.STATIC_DRAW);
            m.panel = o
        },
        renderPanel: function(m) {
            if (!m.texture) return !1;
            m.texture.use(CubicVR.GLCore.gl.TEXTURE0)
        },
        renderView: function(m) {
            if (m.texture) {
                var h = CubicVR.GLCore.gl,
                    o = m.offsetLeft,
                    r = m.offsetTop;
                o || (o = 0);
                r || (r = 0);
                var d = this.shader.shader;
                d.use();
                d.setVector("screen", [this.width, this.height, 0]);
                d.setVector("position", [m.x + o, m.y + r, 0]);
                d.setVector("size", [m.width, m.height, 0]);
                d.setVector("tint", m.tint);
                m.blend && (h.enable(h.BLEND), h.blendFunc(h.SRC_ALPHA, h.ONE_MINUS_SRC_ALPHA));
                m.texture.use(h.TEXTURE0);
                h.drawArrays(h.TRIANGLES, 0, 6);
                m.blend && (h.disable(h.BLEND), h.blendFunc(h.ONE, h.ZERO))
            }
        },
        render: function() {
            var m =
                CubicVR.GLCore.gl;
            m.disable(m.DEPTH_TEST);
            this.texture && this.renderView(this);
            var h = [];
            this.offsetTop = this.offsetLeft = 0;
            h.push(this);
            var o = this.shader.shader;
            o.use();
            m.bindBuffer(m.ELEMENT_ARRAY_BUFFER, null);
            m.bindBuffer(m.ARRAY_BUFFER, this.panel.gl_points);
            m.vertexAttribPointer(o.uniforms.aVertex, 3, m.FLOAT, !1, 0, 0);
            m.enableVertexAttribArray(o.uniforms.aVertex);
            m.bindBuffer(m.ARRAY_BUFFER, this.panel.gl_uvs);
            m.vertexAttribPointer(o.uniforms.aTex, 2, m.FLOAT, !1, 0, 0);
            m.enableVertexAttribArray(o.uniforms.aTex);
            for (m.bindBuffer(m.ELEMENT_ARRAY_BUFFER, null); h.length;) {
                var r = h.pop();
                this.renderView(r);
                if (r.childViews.length)
                    for (var d = r.childViews.length - 1; 0 <= d; d--) r.childViews[d].offsetLeft = r.x + r.offsetLeft, r.childViews[d].offsetTop = r.y + r.offsetTop, h.push(r.childViews[d])
            }
            m.disableVertexAttribArray(o.uniforms.aTex);
            m.enable(m.DEPTH_TEST)
        }
    };
    return {
        Layout: w,
        View: m
    }
});
CubicVR.RegisterModule("Primitives", function(m) {
    function w(a, b, c, g, d, q) {
        var h = m.mat4,
            o = m.vec3,
            r = [],
            v, y = [0, 1, 0],
            t = [1, 0, 0],
            w = [0, 0, 0],
            G = a.points.length,
            B, I, J;
        for (B = v = 0; B < e && v !== c; B += e / c) {
            t = [Math.cos(B), 0, Math.sin(B)];
            I = 0;
            for (J = b.length; I < J; I++) w = o.add(o.multiply(t, b[I][0]), o.multiply(y, b[I][1])), r[v] === f && (r[v] = []), r[v].push(w);
            v++
        }
        J = null;
        d !== f && (J = d.getResult !== f ? d.getResult() : d);
        for (I = 0; I < c; I++) {
            d = 0;
            for (v = b.length; d < v; d++) J ? a.addPoint(h.vec3_multiply(r[I][d], J)) : a.addPoint(r[I][d])
        }
        "string" === typeof g &&
            (g = new m.Material(g));
        a.setFaceMaterial(g);
        for (d = 0; d < c; d++) {
            I = 0;
            for (J = b.length - 1; I < J; I++) h = I + b.length * d, r = I + b.length * ((d + 1) % c), o.equal(a.points[G + h], a.points[G + r]) ? a.addFace([G + h + 1, G + r + 1, G + r]) : o.equal(a.points[G + h + 1], a.points[G + r + 1]) ? a.addFace([G + h, G + h + 1, G + r]) : a.addFace([G + h, G + h + 1, G + r + 1, G + r])
        }
        q !== f && (b = null, q.apply !== f ? b = q : q && (b = new m.UVMapper(q)), null !== b && (a.calcFaceNormals(), b.apply(a, g)))
    }

    function t(a, b, c, e, g) {
        var d = m.mat4,
            b = 0.5 * b,
            q = a.points.length;
        "string" === typeof c && (c = new m.Material(c));
        a.setFaceMaterial(c);
        e !== f ? (e = e.getResult !== f ? e.getResult() : e, a.addPoint([d.vec3_multiply([b, -b, 0], e), d.vec3_multiply([b, b, 0], e), d.vec3_multiply([-b, b, 0], e), d.vec3_multiply([-b, -b, 0], e)])) : a.addPoint([
            [b, -b, 0],
            [b, b, 0],
            [-b, b, 0],
            [-b, -b, 0]
        ]);
        a.addFace([
            [q + 0, q + 1, q + 2, q + 3],
            [q + 3, q + 2, q + 1, q + 0]
        ]);
        g !== f && (d = null, g.apply !== f ? d = g : g && (d = new m.UVMapper(g)), null !== d && (a.calcFaceNormals(), d.apply(a, c)))
    }

    function h(a, b, c, e, g) {
        var d = m.mat4,
            q, h;
        "object" === typeof b ? (q = b[0] / 2, h = b[1] / 2, b = b[2] / 2) : q = h = b /= 2;
        var o = a.points.length;
        "string" === typeof c &&
            (c = new m.Material(c));
        a.setFaceMaterial(c);
        e !== f ? (e = e.getResult !== f ? e.getResult() : e, a.addPoint([d.vec3_multiply([q, -h, b], e), d.vec3_multiply([q, h, b], e), d.vec3_multiply([-q, h, b], e), d.vec3_multiply([-q, -h, b], e), d.vec3_multiply([q, -h, -b], e), d.vec3_multiply([q, h, -b], e), d.vec3_multiply([-q, h, -b], e), d.vec3_multiply([-q, -h, -b], e)])) : a.addPoint([
            [q, -h, b],
            [q, h, b],
            [-q, h, b],
            [-q, -h, b],
            [q, -h, -b],
            [q, h, -b],
            [-q, h, -b],
            [-q, -h, -b]
        ]);
        a.addFace([
            [o + 0, o + 1, o + 2, o + 3],
            [o + 7, o + 6, o + 5, o + 4],
            [o + 4, o + 5, o + 1, o + 0],
            [o + 5, o + 6, o + 2, o + 1],
            [o +
                6, o + 7, o + 3, o + 2
            ],
            [o + 7, o + 4, o + 0, o + 3]
        ]);
        g !== f && (d = null, g.apply !== f ? d = g : g && (d = new m.UVMapper(g)), null !== d && (a.calcFaceNormals(), d.apply(a, c)))
    }

    function o(a, b, c, f, d, g, q, h) {
        for (var o = [], c = c - b, b = b + c / 2, r = e / d, y = 0, t = 0; t <= d; t++) o.push([b + Math.cos(y) * c, Math.sin(y) * c, 0]), y += r;
        m.genLatheObject(a, o, f, g, q, h)
    }

    function r(a, b, c, e, f, d, g) {
        m.genLatheObject(a, [
            [0, -c / 2, 0],
            [b / 2, -c / 2, 0],
            [0, c / 2, 0]
        ], e, f, d, g)
    }

    function d(a, b, c, e, f, d, g) {
        m.genLatheObject(a, [
            [0, -c / 2, 0],
            [b, -c / 2, 0],
            [b, c / 2, 0],
            [0, c / 2, 0]
        ], e, f, d, g)
    }

    function g(a, b, c, e, f,
        d, g) {
        for (var h = [], e = (e /= 2) | 0, c = c | 0, o = Math.PI / e, r = -q, y = 0; y <= e; y++) h.push([Math.cos(r) * b, Math.sin(r) * b, 0]), r += o;
        m.genLatheObject(a, h, c, f, d, g)
    }

    function c(a) {
        "string" === typeof a && (a = m.get(a, m.Material));
        return a === f ? new m.Material : a.use ? a : "object" === typeof a ? new m.Material(a) : new m.Material
    }

    function a(a) {
        if (a === f) return f;
        if ("array" === typeof a) return a;
        if ("object" === typeof a) return a.getResult ? a.getResult() : a.position || a.rotation || a.scale ? m.mat4.transform(a.position, a.rotation, a.scale) : f
    }

    function b(a) {
        "string" ===
        typeof a && (a = m.get(a));
        return a === f ? f : a.apply ? a : "object" === typeof a ? new m.UVMapper(a) : f
    }
    var f = m.undef,
        e = 2 * Math.PI,
        q = Math.PI / 2;
    return {
        genPlaneObject: t,
        genBoxObject: h,
        genLatheObject: w,
        genTorusObject: o,
        genConeObject: r,
        genCylinderObject: d,
        genSphereObject: g,
        primitives: {
            lathe: function(e) {
                var d, g, q, h;
                if (e.points == f) return null;
                d = e.mesh !== f ? e.mesh : new m.Mesh(e.name !== f ? e.name : f);
                g = c(e.material);
                q = a(e.transform);
                h = b(e.uvmapper || e.uv);
                w(d, e.points, e.divisions !== f ? e.divisions : 24, g, q, h);
                return d
            },
            box: function(e) {
                var d,
                    g, q, o;
                d = e.mesh !== f ? e.mesh : new m.Mesh(e.name !== f ? e.name : f);
                g = c(e.material);
                q = a(e.transform);
                o = b(e.uvmapper || e.uv);
                h(d, e.size !== f ? e.size : 1, g, q, o);
                return d
            },
            plane: function(e) {
                var d, g, q, h;
                d = e.mesh !== f ? e.mesh : new m.Mesh(e.name !== f ? e.name : f);
                g = c(e.material);
                q = a(e.transform);
                h = b(e.uvmapper || e.uv);
                t(d, e.size !== f ? e.size : 1, g, q, h);
                return d
            },
            sphere: function(e) {
                var d, q, h, o;
                d = e.mesh !== f ? e.mesh : new m.Mesh(e.name !== f ? e.name : f);
                q = c(e.material);
                h = a(e.transform);
                o = b(e.uvmapper || e.uv);
                g(d, e.radius !== f ? e.radius : 1, e.lon !==
                    f ? e.lon : 24, e.lat !== f ? e.lat : 24, q, h, o);
                return d
            },
            torus: function(e) {
                var d, g, q, h;
                d = e.mesh !== f ? e.mesh : new m.Mesh(e.name !== f ? e.name : f);
                g = c(e.material);
                q = a(e.transform);
                h = b(e.uvmapper || e.uv);
                o(d, e.innerRadius !== f ? e.innerRadius : 0.75, e.outerRadius !== f ? e.outerRadius : 1, e.lon !== f ? e.lon : 24, e.lat !== f ? e.lat : 24, g, q, h);
                return d
            },
            cone: function(e) {
                var d, g, q, h;
                d = e.mesh !== f ? e.mesh : new m.Mesh(e.name !== f ? e.name : f);
                g = c(e.material);
                q = a(e.transform);
                h = b(e.uvmapper || e.uv);
                r(d, e.base !== f ? e.base : 1, e.height !== f ? e.height : 1, e.lon !==
                    f ? e.lon : 24, g, q, h);
                return d
            },
            cylinder: function(e) {
                var g, q, h, o;
                g = e.mesh !== f ? e.mesh : new m.Mesh(e.name !== f ? e.name : f);
                q = c(e.material);
                h = a(e.transform);
                o = b(e.uvmapper || e.uv);
                d(g, e.radius !== f ? e.radius : 1, e.height !== f ? e.height : 1, e.lon !== f ? e.lon : 24, q, h, o);
                return g
            }
        }
    }
});
CubicVR.RegisterModule("COLLADA", function(m) {
    function w(g, c) {
        function a(a) {
            return !a.color ? !1 : (a = a.color) ? f.floatDelimArray(a.$.replace(/ {2}/g, " ").replace(/^\s+|\s+$/, ""), " ") : !1
        }

        function b(a) {
            return !a["float"] ? !1 : a = (a = a["float"]) ? parseFloat(a.$.replace(/ {2}/g, " ").replace(/^\s+|\s+$/, "")) : 0
        }
        var f = m.util,
            e, q, n, o, F, x;
        x = "object" == typeof g ? g : -1 != g.indexOf(".js") ? f.getJSON(g) : m.util.xml2badgerfish(f.getXML(g));
        var u, H, z, E, w, v, y, A, C, G, B, I, J, K, M, L, N, Y, ca, U, na, Q = x;
        x = null;
        if (!Q.COLLADA) throw Error(g + " does not appear to be a valid COLLADA file.");
        var Q = Q.COLLADA,
            O = {
                up_axis: 1,
                images: [],
                effects: [],
                materials: [],
                meshes: [],
                scenes: [],
                lights: [],
                cameras: [],
                animations: []
            };
        if (Q.asset) {
            var Ma = Q.asset.up_axis.$;
            "X_UP" === Ma ? O.up_axis = 0 : "Y_UP" === Ma ? O.up_axis = 1 : "Z_UP" === Ma && (O.up_axis = 2)
        }
        var gb = O.up_axis;
        if (Q.library_images && (Q.library_images.image && !Q.library_images.image.length && (Q.library_images.image = [Q.library_images.image]), Q.library_images.image.length))
            for (var hb = Q.library_images.image, Na = 0, qb = hb.length; Na < qb; Na++) {
                var Oa = hb[Na],
                    ib = Oa["@id"],
                    Ic =
                    Oa["@name"],
                    ac = Oa.init_from;
                if (ac.$) {
                    var ra = ac.$;
                    c !== t && -1 !== ra.lastIndexOf("/") && (ra = ra.substr(ra.lastIndexOf("/") + 1));
                    c !== t && -1 !== ra.lastIndexOf("\\") && (ra = ra.substr(ra.lastIndexOf("\\") + 1));
                    O.images[ib] = {
                        source: ra,
                        id: ib,
                        name: Ic
                    }
                }
            }
        var jb, rb, bc, V, Pa, ka, Qa, da, P, W, S, Da, ha, Ra, Sa, Z, aa;
        if (Q.library_effects) {
            var Ta = Q.library_effects.effect;
            Ta && !Ta.length && (Ta = [Ta]);
            rb = 0;
            for (bc = Ta.length; rb < bc; rb++) {
                var Db = Ta[rb];
                jb = Db["@id"];
                var T = {};
                T.id = jb;
                T.surfaces = [];
                T.samplers = [];
                (da = Db.profile_COMMON.newparam) &&
                !da.length && (da = [da]);
                if (da) {
                    Y = 0;
                    for (ca = da.length; Y < ca; Y++) {
                        var sa = da[Y],
                            Ua = sa["@sid"];
                        if (sa.surface) {
                            T.surfaces[Ua] = {};
                            var cc = sa.surface.init_from.$;
                            "object" === typeof O.images[cc] && (T.surfaces[Ua].source = c + "/" + O.images[cc].source)
                        } else if (sa.sampler2D && (T.samplers[Ua] = {}, T.samplers[Ua].source = sa.sampler2D.source.$, sa.sampler2D.minfilter && (T.samplers[Ua].minfilter = sa.sampler2D.minfilter.$), sa.sampler2D.magfilter)) T.samplers[Ua].magfiter = sa.sampler2D.magfilter.$
                    }
                }
                var va = Db.profile_COMMON.technique;
                va && !va.length && (va = [va]);
                T.material = {
                    textures_ref: []
                };
                V = 0;
                for (Pa = va.length; V < Pa; V++) {
                    e = va[V].blinn;
                    e || (e = va[V].phong);
                    e || (e = va[V].lambert);
                    if (e)
                        for (var ea in e) {
                            var sb = e[ea],
                                ta = a(sb),
                                dc = b(sb),
                                Eb;
                            Eb = sb.texture ? sb.texture["@texture"] : !1;
                            !1 !== ta && 3 < ta.length && ta.pop();
                            "emission" == ea ? !1 !== ta && (T.material.ambient = ta) : "ambient" != ea && ("diffuse" == ea ? !1 !== ta && (T.material.color = ta) : "specular" == ea ? !1 !== ta && (T.material.specular = ta) : "shininess" == ea && !1 !== dc && (T.material.shininess = dc));
                            if (!1 !== Eb) {
                                var Va = T.surfaces[T.samplers[Eb].source].source;
                                "emission" == ea ? T.material.textures_ref.push({
                                    image: Va,
                                    type: h.texture.map.AMBIENT
                                }) : "ambient" == ea ? T.material.textures_ref.push({
                                    image: Va,
                                    type: h.texture.map.AMBIENT
                                }) : "diffuse" == ea ? T.material.textures_ref.push({
                                    image: Va,
                                    type: h.texture.map.COLOR
                                }) : "specular" == ea ? T.material.textures_ref.push({
                                    image: Va,
                                    type: h.texture.map.SPECULAR
                                }) : "shininess" != ea && ("reflective" == ea ? T.material.textures_ref.push({
                                    image: Va,
                                    type: h.texture.map.REFLECT
                                }) : "reflectivity" != ea && "transparent" == ea && T.material.textures_ref.push({
                                    image: Va,
                                    type: h.texture.map.ALPHA
                                }))
                            }
                        }
                    O.effects[jb] = T
                }
            }
        }
        var Fb = d.getAllOf(Q, "instance_geometry"),
            tb = [];
        if (Fb.length) {
            v = 0;
            for (A = Fb.length; v < A; v++) {
                var ec = Fb[v],
                    Gb = d.getAllOf(ec, "instance_material");
                if (Gb.length) {
                    U = 0;
                    for (na = Gb.length; U < na; U++) {
                        var fc = Gb[U],
                            Jc = fc["@symbol"],
                            Kc = fc["@target"].substr(1);
                        tb[ec["@url"].substr(1) + ":" + Jc] = Kc
                    }
                }
            }
        }
        var Hb = Q.library_materials;
        if (Hb && Hb.material) {
            var Wa = Hb.material;
            Wa && !Wa.length && (Wa = [Wa]);
            G = 0;
            for (B = Wa.length; G < B; G++) {
                var Ib = Wa[G],
                    Lc = Ib["@id"],
                    Mc = Ib["@name"],
                    gc = Ib.instance_effect;
                gc && (jb = gc["@url"].substr(1), O.materials.push({
                    id: Lc,
                    name: Mc,
                    mat: O.effects[jb].material
                }))
            }
        }
        var hc = Q.library_geometries,
            Xa;
        if (hc) {
            var ua = hc.geometry;
            ua && !ua.length && (ua = [ua]);
            if (ua.length)
                for (var kb = 0, Nc = ua.length; kb < Nc; kb++) {
                    var ma = {
                            id: t,
                            points: [],
                            parts: []
                        },
                        Ya = ua[kb].mesh;
                    if (Ya) {
                        Xa = ua[kb]["@id"];
                        F = ua[kb]["@name"];
                        var Za = Ya.source;
                        Za && !Za.length && (Za = [Za]);
                        for (var R = [], Jb = 0, Oc = Za.length; Jb < Oc; Jb++) {
                            var ub = Za[Jb];
                            q = ub["@id"];
                            var Pc = ub["@name"],
                                Kb = ub.float_array;
                            Kb && (R[q] = {
                                id: q,
                                name: Pc,
                                data: f.floatDelimArray(Kb.$ ?
                                    Kb.$ : "", " ")
                            });
                            var Lb = ub.technique_common.accessor;
                            Lb && (R[q].count = Lb["@count"] | 0, R[q].stride = Lb["@stride"] | 0, R[q].count && (R[q].data = f.repackArray(R[q].data, R[q].stride, R[q].count)))
                        }
                        var Mb = Ya.vertices,
                            lb = null,
                            Nb = null,
                            Ea = null,
                            Fa = null,
                            Ga = null;
                        if (Mb && (Nb = Mb["@id"], (P = Mb.input) && !P.length && (P = [P]), P)) {
                            ka = 0;
                            for (Qa = P.length; ka < Qa; ka++) W = P[ka], "POSITION" === W["@semantic"] && (lb = W["@source"].substr(1))
                        }
                        var oa = Ya.triangles;
                        oa && !oa.length && (oa = [oa]);
                        if (oa) {
                            V = 0;
                            for (Pa = oa.length; V < Pa; V++) {
                                aa = {
                                    material: 0,
                                    faces: [],
                                    normals: [],
                                    texcoords: [],
                                    colors: []
                                };
                                var Qc = parseInt(oa[V]["@count"], 10);
                                (P = oa[V].input) && !P.length && (P = [P]);
                                S = [];
                                if (P.length) {
                                    ka = 0;
                                    for (Qa = P.length; ka < Qa; ka++) W = P[ka], Z = parseInt(W["@offset"], 10), o = W["@source"].substr(1), "VERTEX" === W["@semantic"] ? (o === Nb && (o = lb), S[Z] = 0) : "NORMAL" === W["@semantic"] ? (Ea = o, R[Ea].count && (S[Z] = 1)) : "TEXCOORD" === W["@semantic"] ? (Ga = o, R[Ga].count && (S[Z] = 2)) : "COLOR" === W["@semantic"] ? (Fa = o, R[Fa].count && (S[Z] = 3)) : S[Z] = 4
                                }
                                E = S.length;
                                n = Xa + ":" + oa[V]["@material"];
                                null === n ? aa.material =
                                    0 : tb[n] === t ? (r("missing material [" + n + "]@" + Xa + "?"), aa.material = 0) : aa.material = tb[n];
                                var ic = oa[V].p,
                                    wa = [];
                                ic && (wa = f.intDelimArray(ic.$, " "));
                                if (wa.length && (w = wa.length / S.length / 3, w === Qc)) {
                                    0 === ma.points.length && (ma.points = R[lb].data);
                                    v = Z = 0;
                                    A = wa.length;
                                    for (C = S.length; v < A; v += 3 * C) {
                                        u = [];
                                        H = [];
                                        z = [];
                                        ia = [];
                                        for (U = 0; U < 3 * C; U++) {
                                            var vb = U % C;
                                            0 === S[vb] ? H.push(wa[v + U]) : 1 === S[vb] ? u.push(wa[v + U]) : 2 === S[vb] ? z.push(wa[v + U]) : 3 === S[vb] && ia.push(wa[v + U])
                                        }
                                        H.length && (aa.faces.push(H), 3 === u.length && aa.normals.push([d.fixuaxis(O.up_axis,
                                            R[Ea].data[u[0]]), d.fixuaxis(O.up_axis, R[Ea].data[u[1]]), d.fixuaxis(O.up_axis, R[Ea].data[u[2]])]), 3 === z.length && aa.texcoords.push([R[Ga].data[z[0]], R[Ga].data[z[1]], R[Ga].data[z[2]]]), 3 === ia.length && aa.colors.push([R[Fa].data[ia[0]], R[Fa].data[ia[1]], R[Fa].data[ia[2]]]))
                                    }
                                }
                                ma.parts.push(aa)
                            }
                        }
                        var ja = Ya.polylist;
                        ja || (ja = Ya.polygons);
                        ja && !ja.length && (ja = [ja]);
                        if (ja) {
                            V = 0;
                            for (Pa = ja.length; V < Pa; V++) {
                                aa = {
                                    material: 0,
                                    faces: [],
                                    normals: [],
                                    texcoords: [],
                                    colors: []
                                };
                                var jc = parseInt(ja[V]["@count"], 10);
                                (P = ja[V].input) &&
                                !P.length && (P = [P]);
                                S = [];
                                if (P.length) {
                                    ka = 0;
                                    for (Qa = P.length; ka < Qa; ka++) {
                                        W = P[ka];
                                        var Ob = W["@offset"];
                                        null === Ob && (Ob = W["@idx"]);
                                        Z = parseInt(Ob, 10);
                                        o = W["@source"].substr(1);
                                        "VERTEX" === W["@semantic"] ? (o === Nb && (o = lb), S[Z] = 0) : "NORMAL" === W["@semantic"] ? (Ea = o, S[Z] = 1) : "TEXCOORD" === W["@semantic"] ? (Ga = o, S[Z] = 2) : "COLOR" === W["@semantic"] ? (Fa = o, S[Z] = 3) : S[Z] = 4
                                    }
                                }
                                var kc = ja[V].vcount,
                                    $a = [];
                                kc && ($a = f.intDelimArray(kc.$, " "));
                                n = Xa + ":" + ja[V]["@material"];
                                aa.material = n === t ? 0 : tb[n];
                                var mb = ja[V].p;
                                E = S.length;
                                var xa = [];
                                if (1 <
                                    mb.length && !$a.length) {
                                    Y = 0;
                                    for (ca = mb.length; Y < ca; Y++) {
                                        var lc = f.intDelimArray(mb[Y].$, " ");
                                        $a[Y] = parseInt(lc.length / E, 10);
                                        xa = xa.concat(lc)
                                    }
                                } else mb && (xa = f.intDelimArray(mb.$, " "));
                                if (xa.length)
                                    if (w = $a.length, w !== jc) r("poly vcount data doesn't add up, skipping object load: " + w + " !== " + jc);
                                    else {
                                        0 === ma.points.length && (ma.points = R[lb].data);
                                        v = Z = 0;
                                        for (A = $a.length; v < A; v++) {
                                            u = [];
                                            H = [];
                                            z = [];
                                            ia = [];
                                            U = 0;
                                            for (na = $a[v] * E; U < na; U++) 0 === S[U % E] ? H.push(xa[Z]) : 1 === S[U % E] ? u.push(xa[Z]) : 2 === S[U % E] ? z.push(xa[Z]) : 3 === S[U %
                                                E] && ia.push(xa[Z]), Z++;
                                            var ab;
                                            if (H.length) {
                                                aa.faces.push(H);
                                                if (u.length) {
                                                    $ = [];
                                                    I = 0;
                                                    for (J = u.length; I < J; I++) $.push(d.fixuaxis(O.up_axis, R[Ea].data[u[I]]));
                                                    aa.normals.push($)
                                                }
                                                if (z.length) {
                                                    ab = [];
                                                    I = 0;
                                                    for (J = z.length; I < J; I++) ab.push(R[Ga].data[z[I]]);
                                                    aa.texcoords.push(ab)
                                                }
                                                if (ia.length) {
                                                    ab = [];
                                                    I = 0;
                                                    for (J = ia.length; I < J; I++) ab.push(R[Fa].data[ia[I]]);
                                                    aa.colors.push(ab)
                                                }
                                            }
                                        }
                                    }
                                ma.parts.push(aa)
                            }
                        }
                        if (1 !== gb) {
                            v = 0;
                            for (A = ma.points.length; v < A; v++) ma.points[v] = d.fixuaxis(O.up_axis, ma.points[v])
                        }
                        ma.id = Xa;
                        O.meshes.push(ma)
                    }
                }
        }
        var mc =
            Q.library_cameras;
        if (mc) {
            (Ra = mc.camera) && !Ra.length && (Ra = [Ra]);
            K = 0;
            for (M = Ra.length; K < M; K++) {
                ha = Ra[K];
                var Rc = ha["@id"],
                    wb = 0,
                    xb = 0,
                    yb = 0;
                ha.optics && (ha.optics.technique_common && ha.optics.technique_common.perspective) && (wb = ha.optics.technique_common.perspective.yfov, xb = ha.optics.technique_common.perspective.znear, yb = ha.optics.technique_common.perspective.zfar);
                var Pb, Qb, Rb;
                if (!wb && !xb && !yb) {
                    (da = ha.param) && !da.length && (da = [da]);
                    v = 0;
                    for (A = da.length; v < A; v++) {
                        var Sb = da[v].$,
                            Tb = da[v]["@name"];
                        "YFOV" == Tb ? Pb =
                            parseFloat(Sb) : "ZNEAR" == Tb ? Qb = parseFloat(Sb) : "ZFAR" == Tb && (Rb = parseFloat(Sb))
                    }
                } else Pb = wb ? parseFloat(wb.$) : 60, Qb = xb ? parseFloat(xb.$) : 0.1, Rb = yb ? parseFloat(yb.$) : 1E3;
                O.cameras.push({
                    id: Rc,
                    targeted: !1,
                    fov: parseFloat(Pb),
                    nearclip: parseFloat(Qb),
                    farclip: parseFloat(Rb)
                })
            }
        }
        var nc = Q.library_lights,
            Ha;
        if (nc) {
            var Ia = nc.light;
            Ia && !Ia.length && (Ia = [Ia]);
            var oc = {
                point: "point",
                directional: "directional",
                spot: "spot"
            };
            if (Ia)
                for (var Ub = 0, Sc = Ia.length; Ub < Sc; Ub++) {
                    Ha = Ia[Ub];
                    var pc, nb, zb;
                    for (zb in oc)
                        if (Ha.technique_common[zb]) {
                            pc =
                                zb;
                            nb = Ha.technique_common[zb];
                            break
                        }
                    if (nb) {
                        var Tc = oc[pc] || "point",
                            qc = Ha["@id"],
                            rc = nb.intensity,
                            Uc = rc ? parseFloat(rc.$) : 1,
                            sc = nb.distance,
                            Vc = sc ? parseFloat(sc.$) : 10,
                            tc = nb.color,
                            ia = [1, 1, 1];
                        tc && (ia = f.floatDelimArray(tc.$, " "));
                        O.lights.push({
                            id: qc,
                            name: qc,
                            type: Tc,
                            method: h.light.method.STATIC,
                            diffuse: ia,
                            specular: [0, 0, 0],
                            distance: Vc,
                            intensity: Uc
                        })
                    }
                }
        }
        var uc = Q.library_visual_scenes;
        if (uc) {
            var bb = null;
            (bb = uc.visual_scene) && !bb.length && (bb = [bb]);
            for (var Vb = 0, Wc = bb.length; Vb < Wc; Vb++) {
                Sa = bb[Vb];
                var ya = {
                        id: Sa["@id"],
                        sceneObjects: [],
                        cameras: [],
                        lights: [],
                        parentMap: []
                    },
                    pa = [],
                    cb = [],
                    za, Wb, la, ba, $, vc = Q.library_nodes;
                if (vc) {
                    var db = vc.node;
                    db && !db.length && (db = [db]);
                    pa = [];
                    v = 0;
                    for (A = db.length; v < A; v++) Wb = db[v], mnodeId = Wb["@id"], pa[la] = Wb;
                    for (za = [Sa]; za.length;) {
                        ba = za.pop();
                        if (ba.node && (($ = ba.node) && !$.length && ($ = [$]), $)) {
                            v = 0;
                            for (A = $.length; v < A; v++) za.push($[v])
                        }
                        if (ba.instance_node) {
                            var eb = ba.instance_node;
                            eb && !eb.length && (eb = [eb]);
                            v = 0;
                            for (A = eb.length; v < A; v++) {
                                var Xb = eb[v]["@url"].substr(1);
                                pa[Xb] && (ba.node && ba.node.length &&
                                    (ba.node = [ba.node]), ba.node ? ba.node.push(pa[Xb]) : ba.node = [pa[Xb]])
                            }
                        }
                    }
                }
                for (za = [Sa]; za.length;)
                    if (ba = za.pop(), ba.node && (($ = ba.node) && !$.length && ($ = [$]), $)) {
                        v = 0;
                        for (A = $.length; v < A; v++) $[v].parentNode = ba, cb.push($[v]), za.push($[v])
                    }
                if (cb.length)
                    for (var ob = 0, Xc = cb.length; ob < Xc; ob++) {
                        var Aa = cb[ob],
                            Ba = Aa.instance_geometry;
                        Ha = cb[ob].instance_light;
                        ha = cb[ob].instance_camera;
                        la = Aa["@id"];
                        var fa = Aa["@name"],
                            ga = d.cl_getInitalTransform(O.up_axis, Aa);
                        2 === gb && (ga.rotation = d.quaternionFilterZYYZ(ga.rotation, ha ? [-90,
                            0, 0
                        ] : t));
                        var pb = null,
                            X = null,
                            fb;
                        if (Ba) {
                            Ba && !Ba.length && (Ba = [Ba]);
                            v = 0;
                            for (A = Ba.length; v < A; v++)
                                if (F = Ba[v]["@url"].substr(1), X = {}, X.name = (fa ? fa : la) + (v ? v : ""), X.id = (la ? la : fa) + (v ? v : ""), X.meshId = Xa, X.meshName = F, pb || (X.position = ga.position, X.rotation = ga.rotation, X.scale = ga.scale, X.matrix = ga.matrix), ya.sceneObjects.push(X), pa[X.id] = !0, Aa.parentNode)(fb = Aa.parentNode["@id"]) && pa[fb] ? ya.parentMap.push({
                                    parent: fb,
                                    child: X.id
                                }) : 1 < Ba.length && (pb ? pa[pb.id] && ya.parentMap.push({
                                    parent: pb.id,
                                    child: X.id
                                }) : (pb = X, X = {}))
                        } else if (ha) {
                            var Yc =
                                ha["@url"].substr(1);
                            ya.cameras.push({
                                name: fa ? fa : la,
                                id: fa ? fa : la,
                                source: Yc,
                                position: ga.position,
                                rotation: ga.rotation
                            })
                        } else if (Ha) {
                            var Zc = Ha["@url"].substr(1);
                            ya.lights.push({
                                name: fa ? fa : la,
                                id: fa ? fa : la,
                                source: Zc,
                                position: ga.position,
                                rotation: ga.rotation || [0, 0, 0]
                            })
                        } else X = {
                            position: ga.position,
                            rotation: ga.rotation,
                            scale: ga.scale,
                            matrix: ga.matrix
                        }, X.name = fa ? fa : la, X.id = la ? la : fa, ya.sceneObjects.push(X), pa[X.id] = !0, Aa.parentNode && (fb = Aa.parentNode["@id"]) && pa[fb] && ya.parentMap.push({
                            parent: fb,
                            child: X.id
                        })
                    }
                O.scenes.push(ya)
            }
        }
        var wc =
            Q.library_animations,
            qa;
        if (wc) {
            var Ja = wc.animation;
            Ja && !Ja.length && (Ja = [Ja]);
            if (Ja)
                for (var Yb = 0, $c = Ja.length; Yb < $c; Yb++) {
                    var Ab = Ja[Yb];
                    qa = Ab["@id"];
                    O.animations[qa] = {};
                    O.animations[qa].sources = [];
                    var Ka = Ab.source;
                    Ka && !Ka.length && (Ka = [Ka]);
                    if (Ka.length) {
                        L = 0;
                        for (N = Ka.length; L < N; L++) {
                            var Ca = Ka[L];
                            q = Ca["@id"];
                            var xc = Ca.technique_common,
                                Bb = null,
                                yc = null;
                            Ca.name_array ? Bb = f.textDelimArray(Ca.name_array.$, " ") : Ca.Name_array ? Bb = f.textDelimArray(Ca.Name_array.$, " ") : Ca.float_array && (yc = f.floatDelimArray(Ca.float_array.$,
                                " "));
                            var Zb = 0,
                                zc = "",
                                Cb = 1;
                            if (xc) {
                                e = xc;
                                var $b = e.accessor,
                                    Zb = parseInt($b["@count"], 10),
                                    zc = $b["@source"].substr(1),
                                    Ac = $b["@stride"];
                                Ac && (Cb = parseInt(Ac, 10))
                            }
                            O.animations[qa].sources[q] = {
                                data: Bb ? Bb : yc,
                                count: Zb,
                                source: zc,
                                stride: Cb
                            };
                            1 !== Cb && (O.animations[qa].sources[q].data = f.repackArray(O.animations[qa].sources[q].data, Cb, Zb))
                        }
                    }(Da = Ab.sampler) && !Da.length && (Da = [Da]);
                    if (Da) {
                        O.animations[qa].samplers = [];
                        L = 0;
                        for (N = Da.length; L < N; L++) {
                            var Bc = Da[L],
                                ad = Bc["@id"];
                            (P = Bc.input) && !P.length && (P = [P]);
                            if (P) {
                                var Cc = [];
                                y = 0;
                                for (A = P.length; y < A; y++) W = P[y], Cc[W["@semantic"]] = W["@source"].substr(1);
                                O.animations[qa].samplers[ad] = Cc
                            }
                        }
                    }
                    var La = Ab.channel;
                    La && !La.length && (La = [La]);
                    if (La) {
                        O.animations[qa].channels = [];
                        K = 0;
                        for (M = La.length; K < M; K++) {
                            var Dc = La[K],
                                bd = Dc["@source"].substr(1),
                                Ec = Dc["@target"],
                                Fc = Ec.split("/"),
                                cd = Fc[0],
                                Gc = Fc[1].split(".");
                            O.animations[qa].channels.push({
                                source: bd,
                                target: Ec,
                                targetName: cd,
                                paramName: Gc[0],
                                typeName: Gc[1]
                            })
                        }
                    }
                }
        }
        var Hc = Q.scene;
        if (Hc && (Sa = Hc.instance_visual_scene)) {
            var dd = Sa["@url"].substr(1);
            O.scene = dd
        }
        return O
    }
    var t = m.undef,
        h = m.enums,
        o = m.GLCore,
        r = m.log,
        d = {
            fixuaxis: function(d, c) {
                if (0 === d) return [c[1], c[0], c[2]];
                if (1 === d) return c;
                if (2 === d) return [c[0], c[2], -c[1]]
            },
            fixscaleaxis: function(d, c) {
                if (0 === d) return [c[1], c[0], c[2]];
                if (1 === d) return c;
                if (2 === d) return [c[0], c[2], c[1]]
            },
            fixukaxis: function(d, c, a, b) {
                return c === h.motion.POS && a === h.motion.Z && d === h.motion.Z ? -b : b
            },
            getAllOf: function(d, c) {
                for (var a = [d], b = [], f, e, q, n; a.length;)
                    for (e in f = a.pop(), f)
                        if (f.hasOwnProperty(e)) {
                            if (e === c)
                                if (f[e].length) {
                                    q =
                                        0;
                                    for (n = f[e].length; q < n; q++) b.push(f[e][q])
                                } else b.push(f[e]);
                            if ("object" == typeof f[e])
                                if (f[e].length) {
                                    q = 0;
                                    for (n = f[e].length; q < n; q++) a.push(f[e][q])
                                } else a.push(f[e])
                        }
                return b
            },
            quaternionFilterZYYZ: function(d, c) {
                var a = m.vec3,
                    b = d,
                    f = new m.Quaternion;
                c !== t && (b = a.add(d, c));
                f.fromEuler(b[0], b[2], -b[1]);
                return f.toEuler()
            },
            cl_getInitalTransform: function(g, c) {
                var a = m.util,
                    b = {
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1]
                    },
                    f = c.translate,
                    e = c.rotate,
                    q = c.scale;
                if (c.matrix && !f && !e && !q) return b;
                f && f.$ && (b.position =
                    d.fixuaxis(g, a.floatDelimArray(f.$, " ")));
                if (e)
                    for (var f = 0, n = e.length; f < n; f++) {
                        var h = e[f],
                            o = h["@sid"],
                            h = a.floatDelimArray(h.$, " ");
                        if ("rotateX" == o || "rotationX" == o) b.rotation[0] = h[3];
                        else if ("rotateY" == o || "rotationY" == o) b.rotation[1] = h[3];
                        else if ("rotateZ" == o || "rotationZ" == o) b.rotation[2] = h[3]
                    }
                q && (b.scale = d.fixscaleaxis(g, a.floatDelimArray(q.$, " ")));
                return b
            }
        };
    return {
        loadCollada: function(g, c, a) {
            var c = w(g, c, a),
                b = c.up_axis,
                f = [],
                e, q, n, s, r, x, u, H;
            q = 0;
            for (n = c.materials.length; q < n; q++) {
                r = c.materials[q];
                u = new m.Material(r.mat);
                u.name = r.name || null;
                x = 0;
                for (s = r.mat.textures_ref.length; x < s; x++) {
                    H = r.mat.textures_ref[x];
                    var z = null,
                        z = void 0 === m.Textures_ref[H.image] ? new m.Texture(H.image, o.default_filter, a, g) : m.Textures_obj[m.Textures_ref[H.image]];
                    u.setTexture(z, H.type)
                }
                f[r.id] = u
            }
            x = [];
            q = 0;
            for (n = c.meshes.length; q < n; q++) {
                var z = c.meshes[q],
                    E = new m.Mesh({
                        name: z.id
                    });
                E.points = z.points;
                var D = !1;
                u = 0;
                for (H = z.parts.length; u < H; u++) {
                    var v = z.parts[u];
                    0 !== v.material && ((s = f[v.material]) || (s = new m.Material({
                            name: v.material
                        })),
                        E.setFaceMaterial(s));
                    var y = v.normals.length ? !0 : !1,
                        A = v.texcoords.length ? !0 : !1,
                        C = v.colors.length ? !0 : !1;
                    C && (f[v.material].color_map = !0);
                    s = 0;
                    for (r = v.faces.length; s < r; s++) {
                        var G = E.addFace(v.faces[s]);
                        y && (E.faces[G].point_normals = v.normals[s]);
                        A && (E.faces[G].uvs = v.texcoords[s]);
                        C && (E.faces[G].point_colors = v.colors[s])
                    }
                    D |= y
                }
                E.faces.length && (a ? a.addMesh(g, g + ":" + meshId, E) : (D || E.calcNormals(), E.triangulateQuads(), E.compile()), x[z.id] = E)
            }
            n = [];
            g = 0;
            for (s = c.cameras.length; g < s; g++) n[c.cameras[g].id] = c.cameras[g];
            z = [];
            s = 0;
            for (r = c.lights.length; s < r; s++) z[c.lights[s].id] = c.lights[s];
            a = {};
            f = {};
            q = {};
            g = {};
            u = 0;
            for (H = c.scenes.length; u < H; u++) {
                E = c.scenes[u];
                D = new m.Scene;
                s = 0;
                for (r = E.sceneObjects.length; s < r; s++) v = E.sceneObjects[s], y = new m.SceneObject(v), y.obj = (x[v.meshName] ? x[v.meshName] : x[v.meshId]) || null, v.matrix && y.setMatrix(v.matrix), a[v.id] = y, D.bindSceneObject(y);
                s = 0;
                for (r = E.lights.length; s < r; s++) v = E.lights[s], y = new m.Light(z[v.source]), y.position = v.position, y.rotation = v.rotation, f[v.id] = y, D.bindLight(y);
                E.cameras.length &&
                    (s = E.cameras[0], r = new m.Camera(n[s.source]), r.position = s.position, r.rotation = s.rotation, q[s.id] = r, D.camera = r);
                s = 0;
                for (r = E.parentMap.length; s < r; s++) v = E.parentMap[s], a[v.parent].bindChild(a[v.child]);
                g[E.id] = D
            }
            for (var B in c.animations)
                if (c.animations.hasOwnProperty(B) && (x = c.animations[B], x.channels.length)) {
                    cCount = 0;
                    for (s = x.channels.length; cCount < s; cCount++) {
                        n = x.channels[cCount];
                        v = x.samplers[n.source];
                        r = x.sources[v.INPUT];
                        u = x.sources[v.OUTPUT];
                        H = x.sources[v.INTERPOLATION];
                        var z = x.sources[v.IN_TANGENT],
                            E = x.sources[v.OUT_TANGENT],
                            D = v.IN_TANGENT !== t,
                            v = v.OUT_TANGENT !== t,
                            y = null,
                            C = a[n.targetName],
                            A = q[n.targetName],
                            I = f[n.targetName];
                        C ? (null === C.motion && (C.motion = new m.Motion), y = C.motion) : A ? (null === A.motion && (A.motion = new m.Motion), y = A.motion) : I && (null === I.motion && (I.motion = new m.Motion), y = I.motion);
                        if (null !== y) {
                            C = h.motion.POS;
                            G = h.motion.X;
                            2 === b && (y.yzflip = !0);
                            e = n.paramName;
                            if ("rotateX" === e || "rotationX" === e) C = h.motion.ROT, G = h.motion.X;
                            else if ("rotateY" === e || "rotationY" === e) C = h.motion.ROT, G = h.motion.Y;
                            else if ("rotateZ" === e || "rotationZ" === e) C = h.motion.ROT, G = h.motion.Z;
                            else if ("location" === e) {
                                if (C = h.motion.POS, "X" === n.typeName && (G = h.motion.X), "Y" === n.typeName && (G = h.motion.Y), "Z" === n.typeName) G = h.motion.Z
                            } else if ("translate" === e) {
                                if (C = h.motion.POS, "X" === n.typeName && (G = h.motion.X), "Y" === n.typeName && (G = h.motion.Y), "Z" === n.typeName) G = h.motion.Z
                            } else if ("LENS" === e) continue;
                            else "FOV" === e ? (C = h.motion.FOV, G = 3) : "ZNEAR" === e ? (C = h.motion.NEARCLIP, G = 3) : "ZFAR" === e ? (C = h.motion.FARCLIP, G = 3) : "intensity" === e && (C =
                                h.motion.INTENSITY, G = 3);
                            I && 3 > C && (I.method = h.light.method.DYNAMIC);
                            mCount = 0;
                            for (n = r.data.length; mCount < n; mCount++)
                                if (k = null, "object" === typeof u.data[mCount]) {
                                    i = 0;
                                    for (iMax = u.data[mCount].length; i < iMax; i++) I = i, 2 === b && 2 === i ? I = 1 : 2 === b && 1 === i && (I = 2), k = y.setKey(C, I, r.data[mCount], d.fixukaxis(c.up_axis, C, I, u.data[mCount][i])), H && (e = H.data[mCount][i], "LINEAR" === e ? k.shape = h.envelope.shape.LINE : "BEZIER" === e && (k.shape = !D && !v ? h.envelope.shape.LINEAR : h.envelope.shape.BEZI))
                                } else if (I = G, ofs = 0, A && C === h.motion.ROT &&
                                2 === b && 0 === I && (ofs = -90), C === h.motion.ROT ? k = y.setKey(C, I, r.data[mCount], u.data[mCount] + ofs) : (2 === b && 2 === G ? I = 1 : 2 === b && 1 === G && (I = 2), k = y.setKey(C, I, r.data[mCount], d.fixukaxis(c.up_axis, C, I, u.data[mCount]))), H)
                                if (e = H.data[mCount], "LINEAR" === e) k.shape = h.envelope.shape.LINE;
                                else if ("BEZIER" === e)
                                if (!D && !v) k.shape = h.envelope.shape.LINEAR, k.continutity = 1;
                                else {
                                    k.shape = h.envelope.shape.BEZ2;
                                    e = z.data[mCount][0];
                                    var J, K = E.data[mCount][0];
                                    C === h.motion.ROT ? (J = z.data[mCount][1], I = E.data[mCount][1], k.param[0] = e - k.time,
                                        k.param[1] = J - k.value + ofs, k.param[2] = K - k.time, k.param[3] = I - k.value + ofs) : (J = d.fixukaxis(c.up_axis, C, I, z.data[mCount][1]), I = d.fixukaxis(c.up_axis, C, I, E.data[mCount][1]), k.param[0] = e - k.time, k.param[1] = J - k.value, k.param[2] = K - k.time, k.param[3] = I - k.value)
                                }
                        }
                    }
                }
            B = null;
            return B = c.scene ? g[c.scene] : g.pop()
        },
        parseCollada: w
    }
});
CubicVR.RegisterModule("GML", function(m) {
    function w(h) {
        var o = CubicVR.util;
        this.strokes = [];
        this.bounds = [1, 1, 1];
        this.origin = [0, 0, 0];
        this.upvector = [0, 1, 0];
        this.viewvector = [0, 0, 1];
        this.manual_pos = 0;
        if (h !== t) {
            var h = o.getXML(h),
                m = h.getElementsByTagName("header");
            if (!m.length) return null;
            var d = m[0],
                m = h.getElementsByTagName("environment");
            if (!m.length) return null;
            this.name = null;
            d = d.getElementsByTagName("name");
            d.length && (this.name = o.collectTextNode(d[0]));
            d = m[0].getElementsByTagName("screenBounds");
            d.length &&
                (this.bounds = [parseFloat(o.collectTextNode(d[0].getElementsByTagName("x")[0])), parseFloat(o.collectTextNode(d[0].getElementsByTagName("y")[0])), parseFloat(o.collectTextNode(d[0].getElementsByTagName("z")[0]))]);
            d = m[0].getElementsByTagName("origin");
            d.length && (this.origin = [parseFloat(o.collectTextNode(d[0].getElementsByTagName("x")[0])), parseFloat(o.collectTextNode(d[0].getElementsByTagName("y")[0])), parseFloat(o.collectTextNode(d[0].getElementsByTagName("z")[0]))]);
            m = m[0].getElementsByTagName("up");
            m.length && (this.upvector = [parseFloat(o.collectTextNode(m[0].getElementsByTagName("x")[0])), parseFloat(o.collectTextNode(m[0].getElementsByTagName("y")[0])), parseFloat(o.collectTextNode(m[0].getElementsByTagName("z")[0]))]);
            h = h.getElementsByTagName("drawing");
            m = 0;
            for (d = h.length; m < d; m++)
                for (var g = h[m].getElementsByTagName("stroke"), c = 0, a = 0, b = 0, f = 0, e = 0, q = g.length; e < q; e++) {
                    for (var n = g[e].getElementsByTagName("pt"), s = n.length, F = Array(s), x, u, H, z = 0, E = s; z < E; z++) H = n[z], s = parseFloat(o.collectTextNode(H.getElementsByTagName("x")[0])),
                        x = parseFloat(o.collectTextNode(H.getElementsByTagName("y")[0])), u = parseFloat(o.collectTextNode(H.getElementsByTagName("z")[0])), H = parseFloat(o.collectTextNode(H.getElementsByTagName("time")[0])), 1 === this.upvector[0] ? F[z] = [x !== x ? 0 : x, s !== s ? 0 : -s, u !== u ? 0 : u, H] : 1 === this.upvector[1] ? F[z] = [s !== s ? 0 : s, x !== x ? 0 : x, u !== u ? 0 : u, H] : 1 === this.upvector[2] && (F[z] = [s !== s ? 0 : s, u !== u ? 0 : -u, x !== x ? 0 : x, H]), c < s && (c = s), a < x && (a = x), b < u && (b = u), f < H && (f = H);
                    if (b > f) {
                        n = 0;
                        for (z = F.length; n < z; n++) s = F[n][3], F[n][3] = F[n][2], F[n][2] = s / this.bounds[2]
                    }
                    this.strokes[e] =
                        F
                }
        }
    }
    var t = m.undef;
    w.prototype = {
        addStroke: function(h, o) {
            var m = [];
            o === t && (o = 0.1);
            for (var d = 0, g = h.length; d < g; d++) {
                var c = [h[d][0], h[d][1], h[d][2]];
                this.manual_pos += o;
                c.push(this.manual_pos);
                m.push(c)
            }
            this.strokes.push(m)
        },
        recenter: function() {
            var h = CubicVR.vec3,
                o = [0, 0, 0],
                m = [this.strokes[0][0][0], this.strokes[0][0][1], this.strokes[0][0][2]],
                d, g, c, a;
            c = 0;
            for (a = this.strokes.length; c < a; c++) {
                d = 0;
                for (g = this.strokes[c].length; d < g; d++) o[0] > this.strokes[c][d][0] && (o[0] = this.strokes[c][d][0]), o[1] > this.strokes[c][d][1] &&
                    (o[1] = this.strokes[c][d][1]), o[2] > this.strokes[c][d][2] && (o[2] = this.strokes[c][d][2]), m[0] < this.strokes[c][d][0] && (m[0] = this.strokes[c][d][0]), m[1] < this.strokes[c][d][1] && (m[1] = this.strokes[c][d][1]), m[2] < this.strokes[c][d][2] && (m[2] = this.strokes[c][d][2])
            }
            h = h.multiply(h.subtract(m, o), 0.5);
            c = 0;
            for (a = this.strokes.length; c < a; c++) {
                d = 0;
                for (g = this.strokes[c].length; d < g; d++) this.strokes[c][d][0] -= h[0], this.strokes[c][d][1] -= this.upvector[1] ? h[1] : -h[1], this.strokes[c][d][2] -= h[2]
            }
        },
        generateObject: function(h,
            o, m, d, g) {
            var c = CubicVR.vec3;
            h === t && (h = 0);
            o === t && (o = 0);
            g === t && (g = !1);
            d === t && (d = 0.02);
            m === t && (m = 0.015);
            for (var a = 0 !== o, b = 0, f = 0, e = new CubicVR.Mesh(this.name), q, n, s, F, x, u, H = 0, z = this.strokes.length; H < z; H++) {
                u = new CubicVR.Envelope;
                var E = new CubicVR.Envelope,
                    w = new CubicVR.Envelope,
                    v = this.strokes[H].length,
                    y = [],
                    A = [],
                    C = 0,
                    G = this.strokes[H];
                for (x = 0; x < v; x++) {
                    var B = G[x],
                        I = u.addKey(B[3], B[0]),
                        J = E.addKey(B[3], B[1]),
                        K;
                    K = g ? w.addKey(B[3], B[2]) : w.addKey(B[3], 0);
                    I.tension = 0.5;
                    J.tension = 0.5;
                    K.tension = 0.5;
                    0 !== x ? (q = B[0] -
                        q, n = B[1] - n, s = B[2] - s, F = B[3] - F, s = Math.sqrt(q * q + n * n + s * s), y[x - 1] = s, A[x - 1] = F) : C = B[3];
                    q = B[0];
                    n = B[1];
                    s = B[2];
                    F = B[3]
                }
                v = e.points.length;
                for (x = 0; x < y.length; x++) {
                    G = A[x];
                    J = Math.ceil(3 * (y[x] / d));
                    B = C;
                    I = C + G;
                    for (J = G / J; B < I - J; B += J) {
                        B === C && (q = u.evaluate(B), n = E.evaluate(B), s = w.evaluate(B));
                        var M, L;
                        K = u.evaluate(B + J);
                        M = E.evaluate(B + J);
                        L = w.evaluate(B + J);
                        var N = K - q,
                            Y = M - n,
                            ca = L - s;
                        Math.sqrt(N * N + Y * Y + ca * ca);
                        N = c.multiply(c.normalize(c.cross(this.viewvector, c.normalize([N, Y, ca]))), m / 2);
                        e.addPoint([q - N[0], -(n - N[1]), s - N[2] + (a ? o / 2 :
                            0)]);
                        e.addPoint([q + N[0], -(n + N[1]), s + N[2] + (a ? o / 2 : 0)]);
                        q = K;
                        n = M;
                        s = L
                    }
                    C += G
                }
                E = e.points.length;
                if (a) {
                    x = v;
                    for (u = E; x < u; x++) e.addPoint([e.points[x][0], e.points[x][1], e.points[x][2] - (a ? o / 2 : 0)])
                }
                x = 0;
                for (u = E - v; x <= u - 4; x += 2) {
                    0 === b % h && f++;
                    e.setSegment(f);
                    w = [v + x, v + x + 1, v + x + 3, v + x + 2];
                    e.addFace(w);
                    if (a && (w = [w[3] + E - v, w[2] + E - v, w[1] + E - v, w[0] + E - v], e.addFace(w), w = [v + x, v + x + 2, v + x + 2 + E - v, v + x + E - v], e.addFace(w), w = [v + x + 1 + E - v, v + x + 3 + E - v, v + x + 3, v + x + 1], e.addFace(w), 0 === x && (w = [v + x + E - v, v + x + 1 + E - v, v + x + 1, v + x], e.addFace(w)), x === u - 4)) w = [v + x +
                        2, v + x + 3, v + x + 3 + E - v, v + x + 2 + E - v
                    ], e.addFace(w);
                    b++
                }
            }
            e.calcFaceNormals();
            e.triangulateQuads();
            e.calcNormals();
            e.compile();
            return e
        }
    };
    return {
        GML: w
    }
});
CubicVR.RegisterModule("PDF", function() {
    function m(m, t) {
        var h = m;
        "string" === typeof m && (h = {
            url: m
        });
        var o = new XMLHttpRequest;
        o.open("GET", h.url);
        var r = h.headers;
        if (r)
            for (var d in r) "undefined" !== typeof r[d] && o.setRequestHeader(d, h.headers[d]);
        o.mozResponseType = o.responseType = "arraybuffer";
        r = h.url.substring(0, h.url.indexOf(":") + 1);
        o.expected = -1 < ["http:", "https:", ""].indexOf(r) ? 200 : 0;
        "progress" in h && (o.onprogress = h.progress || void 0);
        var g = !1;
        "error" in h && (o.onerror = function() {
            if (!g) {
                g = true;
                h.error()
            }
        });
        o.onreadystatechange = function(c) {
            if (o.readyState === 4)
                if (o.status === o.expected) t(o.mozResponseArrayBuffer || o.mozResponse || o.responseArrayBuffer || o.response);
                else if (h.error && !g) {
                g = true;
                h.error(c)
            }
        };
        o.send(null)
    }
    return {
        PDF: function(w) {
            if (!w.src) throw "PDF Error: you must specify a src url for a PDF.";
            var t = w.src,
                h = w.callback || function() {},
                o, r = [],
                d = [];
            this.__defineGetter__("pages", function() {
                return o ? o.numPages : 0
            });
            this.getPage = function(d) {
                var c = o.numPages,
                    d = 1 > d ? 1 : d;
                return r[(d > c ? c : d) - 1]
            };
            this.getPageTexture =
                function(d, c, a) {
                    var d = this.getPage(d),
                        b = d.getViewport(1),
                        c = c || b.width,
                        a = a || b.height;
                    return new CubicVR.PdfTexture(d, {
                        width: c,
                        height: a,
                        viewport: b
                    })
                };
            m({
                url: t,
                progress: function() {},
                error: function() {
                    console.log("PDF Error: error loading pdf `" + t + "`")
                }
            }, function(g) {
                PDFJS.getDocument({
                    data: g
                }).then(function(c) {
                    function a() {
                        b++ >= c.numPages ? h() : c.getPage(b).then(function(b) {
                            r.push(b);
                            d.push(b);
                            a()
                        })
                    }
                    o = c;
                    var b = 0;
                    a()
                }, function(c, a) {
                    console.warn(c, a);
                    h()
                })
            })
        }
    }
});
CubicVR.RegisterModule("Particles", function(m) {
    function w(h, m, d, g, c, a, b) {
        h && (this.last_particle = this.particles = null, this.pTex = d !== t ? d : null, this.vWidth = g, this.vHeight = c, this.alpha = a !== t ? a : !1, this.alphaCut = b !== t ? b : 0, this.pfunc = function(a, b) {
            var c = b - a.start_time;
            if (0 > c) return 0;
            if (c > a.life_time && a.life_time) return -1;
            a.pos[0] = a.startpos[0] + c * a.velocity[0] + c * c * a.accel[0];
            a.pos[1] = a.startpos[1] + c * a.velocity[1] + c * c * a.accel[1];
            a.pos[2] = a.startpos[2] + c * a.velocity[2] + c * c * a.accel[2];
            null !== this.pgov && this.pgov(a,
                b);
            return 1
        }, this.pgov = null, this.hasColor = m === t ? !1 : m, d = null !== this.pTex, this.vs = ["#ifdef GL_ES\nprecision highp float;\n#endif\nattribute vec3 aVertexPosition;", this.hasColor ? "attribute vec3 aColor;" : "", "uniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nvarying vec4 color;\nvarying vec2 screenPos;", d ? "varying float pSize;" : "", "void main(void) {\nvec4 position = uPMatrix * uMVMatrix * vec4(aVertexPosition,1.0);", d ? "screenPos=vec2(position.x/position.w,position.y/position.w);" : "", "gl_Position = position;",
            this.hasColor ? "color = vec4(aColor.r,aColor.g,aColor.b,1.0);" : "color = vec4(1.0,1.0,1.0,1.0);", d ? "pSize=200.0/position.z;" : "float pSize=200.0/position.z;", "gl_PointSize = pSize;\n}"
        ].join("\n"), this.fs = ["#ifdef GL_ES\nprecision highp float;\n#endif", d ? "uniform sampler2D pMap;" : "", "varying vec4 color;", d ? "varying vec2 screenPos;" : "", d ? "uniform vec3 screenDim;" : "", d ? "varying float pSize;" : "", "void main(void) {\nvec4 c = color;", d ? "vec2 screen=vec2((gl_FragCoord.x/screenDim.x-0.5)*2.0,(gl_FragCoord.y/screenDim.y-0.5)*2.0);" :
            "", d ? "vec2 pointCoord=vec2( ((screen.x-screenPos.x)/(pSize/screenDim.x))/2.0+0.5,((screen.y-screenPos.y)/(pSize/screenDim.y))/2.0+0.5);" : "", d ? "vec4 tc = texture2D(pMap,pointCoord); gl_FragColor = vec4(c.rgb*tc.rgb,1.0);" : "gl_FragColor = c;", "}"
        ].join("\n"), this.maxPoints = h, this.numParticles = 0, this.arPoints = new Float32Array(3 * h), this.glPoints = null, m && (this.arColor = new Float32Array(3 * h), this.glColor = null), this.shader_particle = new CubicVR.Shader(this.vs, this.fs), this.shader_particle.use(), this.shader_particle.addVertexArray("aVertexPosition",
            0), this.hasColor && this.shader_particle.addVertexArray("aColor"), this.shader_particle.addMatrix("uMVMatrix"), this.shader_particle.addMatrix("uPMatrix"), null !== this.pTex && (this.shader_particle.addInt("pMap", 0), this.shader_particle.addVector("screenDim"), this.shader_particle.setVector("screenDim", [g, c, 0])), this.genBuffer())
    }
    var t = m.undef,
        h = m.GLCore;
    w.prototype = {
        resizeView: function(h, m) {
            this.vWidth = h;
            this.vHeight = m;
            null !== this.pTex && (this.shader_particle.addVector("screenDim"), this.shader_particle.setVector("screenDim", [h, m, 0]))
        },
        addParticle: function(h) {
            null === this.last_particle ? this.particles = h : this.last_particle.nextParticle = h;
            this.last_particle = h
        },
        genBuffer: function() {
            var o = h.gl;
            this.glPoints = o.createBuffer();
            o.bindBuffer(o.ARRAY_BUFFER, this.glPoints);
            o.bufferData(o.ARRAY_BUFFER, this.arPoints, o.DYNAMIC_DRAW);
            this.hasColor && (this.glColor = o.createBuffer(), o.bindBuffer(o.ARRAY_BUFFER, this.glColor), o.bufferData(o.ARRAY_BUFFER, this.arColor, o.DYNAMIC_DRAW))
        },
        updatePoints: function() {
            var o = h.gl;
            o.bindBuffer(o.ARRAY_BUFFER,
                this.glPoints);
            o.bufferData(o.ARRAY_BUFFER, this.arPoints, o.DYNAMIC_DRAW)
        },
        updateColors: function() {
            var o = h.gl;
            this.hasColor && (o.bindBuffer(o.ARRAY_BUFFER, this.glColor), o.bufferData(o.ARRAY_BUFFER, this.arColor, o.DYNAMIC_DRAW))
        },
        draw: function(o, m, d) {
            var g = h.gl;
            this.shader_particle.use();
            null !== this.pTex && this.pTex.use(g.TEXTURE0);
            this.shader_particle.setMatrix("uMVMatrix", o);
            this.shader_particle.setMatrix("uPMatrix", m);
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, null);
            g.bindBuffer(g.ARRAY_BUFFER, this.glPoints);
            g.vertexAttribPointer(this.shader_particle.uniforms.aVertexPosition, 3, g.FLOAT, !1, 0, 0);
            g.enableVertexAttribArray(this.shader_particle.uniforms.aVertexPosition);
            this.hasColor && (g.bindBuffer(g.ARRAY_BUFFER, this.glColor), g.vertexAttribPointer(this.shader_particle.uniforms.aColor, 3, g.FLOAT, !1, 0, 0), g.enableVertexAttribArray(this.shader_particle.uniforms.aColor));
            if (d !== t) {
                this.numParticles = 0;
                if (null === this.particles) {
                    g.disable(g.BLEND);
                    return
                }
                for (var o = this.particles, m = null, c = 0; null !== o;) {
                    var a = 3 * this.numParticles,
                        b = this.pfunc(o, d);
                    if (1 === b) {
                        if (this.arPoints[a] = o.pos[0], this.arPoints[a + 1] = o.pos[1], this.arPoints[a + 2] = o.pos[2], null !== o.color && this.arColor !== t && (this.arColor[a] = o.color[0], this.arColor[a + 1] = o.color[1], this.arColor[a + 2] = o.color[2]), this.numParticles++, c++, this.numParticles === this.maxPoints) break
                    } else -1 === b ? null !== m && (m.nextParticle = o.nextParticle) : 0 === b && c++;
                    m = o;
                    o = o.nextParticle
                }
                c || (this.last_particle = this.particles = null);
                this.updatePoints();
                this.hasColor && this.updateColors()
            }
            this.alpha && (g.enable(g.BLEND),
                g.enable(g.DEPTH_TEST), g.depthMask(0), g.blendFunc(g.ONE, g.ONE_MINUS_SRC_COLOR));
            g.drawArrays(g.POINTS, 0, this.numParticles);
            this.alpha && (g.disable(g.BLEND), g.depthMask(1), g.blendFunc(g.ONE, g.ONE));
            this.hasColor && g.disableVertexAttribArray(this.shader_particle.uniforms.aColor)
        }
    };
    return {
        ParticleSystem: w,
        Particle: function(h, m, d, g, c) {
            this.startpos = new Float32Array(h);
            this.pos = new Float32Array(h);
            this.velocity = new Float32Array(g !== t ? g : [0, 0, 0]);
            this.accel = new Float32Array(c !== t ? c : [0, 0, 0]);
            this.start_time =
                m !== t ? m : 0;
            this.life_time = d !== t ? d : 0;
            this.nextParticle = this.color = null
        }
    }
});
CubicVR.RegisterModule("Lines", function(m) {
    function w(h) {
        h = h || {};
        this.color = h.color || [1, 1, 1];
        this.maxPoints = h.maxPoints || 1024;
        this.vs = "#ifdef GL_ES\nprecision highp float;\n#endif\nattribute vec3 aVertexPosition;\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nvoid main(void) {\nvec4 position = uPMatrix * uMVMatrix * vec4(aVertexPosition,1.0);\ngl_Position = position;\n}";
        this.fs = "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform vec3 color;\nvoid main(void) {\nvec4 c = vec4(color,1.0);\ngl_FragColor = c;\n}";
        this.arLines =
            new Float32Array(6 * this.maxPoints);
        this.glLines = null;
        this.lineLength = 0;
        this.shader_line = new CubicVR.Shader(this.vs, this.fs);
        this.shader_line.use();
        this.shader_line.addVertexArray("aVertexPosition", 0);
        this.shader_line.addVector("color", this.color);
        this.shader_line.addMatrix("uMVMatrix");
        this.shader_line.addMatrix("uPMatrix");
        this.genBuffer();
        this.newSegment = !1
    }
    var t = m.GLCore;
    w.prototype = {
        genBuffer: function() {
            var h = t.gl;
            this.glLines = h.createBuffer();
            h.bindBuffer(h.ARRAY_BUFFER, this.glLines);
            h.bufferData(h.ARRAY_BUFFER,
                this.arLines, h.DYNAMIC_DRAW)
        },
        update: function() {
            var h = t.gl;
            h.bindBuffer(h.ARRAY_BUFFER, this.glLines);
            h.bufferData(h.ARRAY_BUFFER, this.arLines, h.DYNAMIC_DRAW)
        },
        addPoint: function(h) {
            var m = this.lineLength;
            1 < m && (this.arLines[3 * m] = this.arLines[3 * (m - 1)], this.arLines[3 * m + 1] = this.arLines[3 * (m - 1) + 1], this.arLines[3 * m + 2] = this.arLines[3 * (m - 1) + 2], this.lineLength++, m++);
            this.arLines[3 * m] = h[0];
            this.arLines[3 * m + 1] = h[1];
            this.arLines[3 * m + 2] = h[2];
            this.lineLength++
        },
        addSegment: function(h) {
            var m = this.lineLength;
            this.arLines[3 *
                m] = h[0];
            this.arLines[3 * m + 1] = h[1];
            this.arLines[3 * m + 2] = h[2];
            this.lineLength++
        },
        clear: function() {
            this.lineLength = 0
        },
        render: function(h) {
            var m = t.gl,
                r = h.mvMatrix,
                h = h.pMatrix;
            this.shader_line.use();
            this.shader_line.setMatrix("uMVMatrix", r);
            this.shader_line.setMatrix("uPMatrix", h);
            this.shader_line.setVector("color", this.color);
            m.bindBuffer(m.ELEMENT_ARRAY_BUFFER, null);
            m.bindBuffer(m.ARRAY_BUFFER, this.glLines);
            m.vertexAttribPointer(this.shader_line.uniforms.aVertexPosition, 3, m.FLOAT, !1, 0, 0);
            m.enableVertexAttribArray(this.shader_line.uniforms.aVertexPosition);
            m.drawArrays(m.LINES, 0, this.lineLength)
        }
    };
    return {
        Lines: w
    }
});
CubicVR.RegisterModule("HeightField", function(m) {
    var w = m.undef,
        t = m.enums;
    t.heightfield = {
        brush: {
            SINE: 0,
            SQUARE: 1
        },
        op: {
            ADD: 0,
            REPLACE: 1,
            SUBTRACT: 2
        }
    };
    var h = function(d) {
        d = d || {};
        this.operation = m.parseEnum(t.draw.op, d.operation || d.op) || t.draw.op.REPLACE;
        this.brushType = m.parseEnum(t.draw.brush, d.brushType) || t.draw.brush.SINE;
        this.brushSize = d.size || 5;
        this.strength = d.strength || 1
    };
    h.prototype = {
        setOperation: function(d) {
            this.operation = m.parseEnum(t.draw.op, d)
        },
        getOperation: function() {
            return this.operation
        },
        setBrushType: function(d) {
            this.brushType =
                m.parseEnum(t.draw.brush, d) || t.draw.brush.SINE
        },
        getBrushType: function() {
            return this.brushType
        },
        setSize: function(d) {
            this.brushSize = d
        },
        getSize: function() {
            return this.brushSize
        },
        setStrength: function(d) {
            this.strength = d
        },
        getStrength: function() {
            return this.strength
        }
    };
    var o = function(d) {
        d = d || {};
        this.divX = d.divX || null;
        this.divZ = d.divZ || null;
        this.size = d.size || null;
        this.cellSize = this.sizeZ = this.sizeX = this.cellSize = this.hfFloatBuffer = this.hfUInt8Buffer = this.hfBuffer = null;
        this.ofsX = d.ofsX || -this.cellSize / 2;
        this.ofsZ =
            d.ofsZ || -this.cellSize / 2;
        this.divX && (this.divZ && this.size) && this.initBuffer(this.divX, this.divZ, this.size);
        this.areaBuffered = !1;
        this.drawArea = {
            startX: 0,
            startZ: 0,
            endX: 0,
            endZ: 0
        }
    };
    o.prototype = {
        initBuffer: function(d, g, c) {
            this.hfBuffer = new ArrayBuffer(4 * d * g);
            this.hfUInt8Buffer = new Uint8Array(this.hfBuffer);
            this.hfFloatBuffer = new Float32Array(this.hfBuffer);
            this.divX = d || null;
            this.divZ = g || null;
            this.size = c || null;
            this.divX > this.divZ ? (this.sizeX = c, this.sizeZ = c / this.divX * this.divZ) : (this.sizeX = this.divZ > this.divX ?
                c / this.divZ * this.divX : c, this.sizeZ = c);
            this.drawBuffer = [];
            this.cellSize = this.sizeX / this.divX;
            this.startX = -(this.sizeX / 2) + this.ofsX;
            this.startZ = -(this.sizeZ / 2) + this.ofsZ
        },
        setBrush: function(d) {
            this.brush = d
        },
        getBrush: function() {
            return this.brush
        },
        draw: function(d, g, c) {
            var a = this.brush || c,
                c = a.getOperation(),
                b = a.getSize(),
                f = a.getBrushType(),
                a = a.getStrength();
            if (this.areaBuffered) {
                var e = d - b,
                    q = g - b,
                    n = d + b,
                    h = g + b;
                e < this.drawArea.startX && (this.drawArea.startX = e);
                q < this.drawArea.startZ && (this.drawArea.startZ = q);
                n > this.drawArea.endX && (this.drawArea.endX = n);
                n > this.drawArea.endX && (this.drawArea.endZ = h)
            } else this.drawArea = {
                startX: d - b,
                startZ: g - b,
                endX: d + b,
                endZ: g + b
            }, this.areaBuffered = !0;
            this.drawBuffer.push([d, g, c, b, f, a])
        },
        getDrawArea: function() {
            return !this.areaBuffered ? !1 : this.drawArea
        },
        clearDrawArea: function() {
            this.areaBuffered = !1
        },
        flush: function() {
            if (!this.drawBuffer.length) return !1;
            for (; this.drawBuffer.length;) {
                var d = this.drawBuffer.pop();
                this.drawFunc(d[0], d[1], d[2], d[3], d[4], d[5])
            }
            return !0
        },
        needsFlush: function() {
            return 0 !==
                this.drawBuffer.length
        },
        drawFunc: function(d, g, c, a, b, f) {
            for (var c = this.hfFloatBuffer, b = this.divX, e = this.divZ, a = a / this.cellSize, d = (d - this.startX) / this.cellSize, g = (g - this.startZ) / this.cellSize, q = parseInt(Math.floor(d - a), 10), n = parseInt(Math.ceil(d + a), 10); q < n; q++)
                for (var h = q - d, m = parseInt(Math.floor(g - a), 10), o = parseInt(Math.ceil(g + a), 10); m < o; m++)
                    if (!(0 > q || q >= b || 0 > m || m >= e)) {
                        var u = m - g,
                            u = f * ((1 - Math.sqrt(h * h + u * u) / a) / 2);
                        0 > u && 0 <= f && (u = 0);
                        0 < u && 0 >= f && (u = 0);
                        c[m * b + q] += u
                    }
        },
        getUint8Buffer: function() {
            return this.hfUInt8Buffer
        },
        getFloat32Buffer: function() {
            return this.hfFloatBuffer
        },
        getDivX: function() {
            return this.divX
        },
        getDivZ: function() {
            return this.divZ
        },
        getSizeX: function() {
            return this.sizeX
        },
        getSizeZ: function() {
            return this.sizeZ
        },
        getStartX: function() {
            return this.startX
        },
        getStartZ: function() {
            return this.startZ
        },
        getCellSize: function() {
            return this.cellSize
        },
        getSize: function() {
            return this.size
        },
        setRect: function(d) {
            var d = d || {},
                g = d.value || 0,
                c = d.src || d.func || null,
                a = d.startX || 0,
                b = d.startZ || 0,
                f = d.walkX,
                e = d.walkZ,
                d = this.hfFloatBuffer,
                q, n = this.startX,
                h = this.startZ;
            if (a !== w && b !== w && f !== w && e !== w) {
                if (!(a >= this.divX) && !(b >= this.divZ) && (a + f >= this.divX && (f = this.divX - 1 - a), b + e >= this.divZ && (e = this.divZ - 1 - b), !(0 >= f || 0 >= e))) {
                    q = a;
                    for (a += f; q < a; q++)
                        for (var f = b, m = b + e; f < m; f++) {
                            var o = q + f * this.divX;
                            d[o] = null === c ? g : c(this.cellSize * q + n, this.cellSize * f + h, o)
                        }
                }
            } else {
                q = 0;
                for (a = this.hfFloatBuffer.length; q < a; q++) null === c ? d[q] = g : (b = c(q % this.divX * this.cellSize + n, Math.floor(q / this.divX) * this.cellSize + h, q), d[q] = b)
            }
        },
        getIndicesAt: function(d, g) {
            if ("object" ===
                typeof d) return this.getIndicesAt(d[0], d[2]);
            var c = this.startX,
                a = this.startZ,
                b = Math.floor((d - c) / this.cellSize),
                f = Math.floor((g - a) / this.cellSize);
            if (0 > b || b >= this.divX - 1 || 0 > f || f >= this.divZ - 1) return -1;
            if (1 <= Math.abs(g - ((f + 1) * this.cellSize + a)) / Math.abs(d - (b * this.cellSize + c))) return c = [b + (f + 1) * this.divX, b + 1 + f * this.divX, b + f * this.divX], [b, f, c, 0];
            c = [b + (f + 1) * this.divX, b + 1 + (f + 1) * this.divX, b + 1 + f * this.divX];
            return [b, f, c, 1]
        },
        getHeightValue: function(d, g) {
            var c = m.triangle;
            if ("object" === typeof d) return this.getHeightValue(d[0],
                d[2]);
            var a = this.getIndicesAt(d, g);
            if (-1 === a) return 0;
            var b = a[2],
                f = a[0] * this.cellSize + this.startX,
                e = a[1] * this.cellSize + this.startZ,
                q;
            q = 0 === a[3] ? c.normal([f, this.hfFloatBuffer[b[0]], e + this.cellSize], [f + this.cellSize, this.hfFloatBuffer[b[1]], e], [f, this.hfFloatBuffer[b[2]], e]) : c.normal([f, this.hfFloatBuffer[b[0]], e + this.cellSize], [f + this.cellSize, this.hfFloatBuffer[b[1]], e + this.cellSize], [f + this.cellSize, this.hfFloatBuffer[b[2]], e]);
            c = q[0];
            a = q[1];
            q = q[2];
            b = [f, this.hfFloatBuffer[b[0]], e + this.cellSize];
            return (c * d + q * g + (-(c * b[0]) - a * b[1] - q * b[2])) / -a
        },
        rayIntersect: function(d, g) {
            var c = d.slice(0),
                a = this.startX,
                b = this.startZ,
                f = this.startX + this.sizeX,
                e = this.startZ + this.sizeZ,
                q = this.cellSize,
                n = m.vec2,
                h = m.vec3,
                o = h.normalize(g),
                r = [o[0], o[2]],
                u = [c[0], c[2]];
            if (c[0] < a || c[0] > f || c[2] < b || c[2] > e) {
                var t = [
                        [a, b],
                        [f, b],
                        [a, e],
                        [f, e]
                    ],
                    z = [];
                c[0] >= f && z.push([t[1], t[3]]);
                c[0] <= a && z.push([t[0], t[2]]);
                c[2] >= e && z.push([t[2], t[3]]);
                c[2] <= b && z.push([t[0], t[1]]);
                if (0 !== z.length) {
                    c = [];
                    f = 0;
                    for (e = z.length; f < e; f++) t = n.lineIntersect(u,
                        n.add(u, r), z[f][0], z[f][1]), !1 !== t && n.onLine(z[f][0], z[f][1], t) && c.push(t);
                    t = 0;
                    z = -1;
                    f = 0;
                    for (e = c.length; f < e; f++) {
                        var w = n.length(c[f], u);
                        0 === f ? (t = w, z = 0) : w < t && (z = f, t = w)
                    }
                    if (-1 != z) {
                        if (v = t / n.length(r), c = [c[z][0], 0, c[z][1]], c[1] = d[1] + o[1] * v, c[1] <= this.getHeightValue(c[0], c[2])) return !1
                    } else return !1
                }
                u = [c[0], c[2]]
            }
            t = Math.floor((u[0] - a) / q);
            e = Math.floor((u[1] - b) / q);
            z = u[0] - (a + t * q);
            f = u[1] - (b + e * q);
            f = z < f ? z / Math.abs(r[0]) : f / Math.abs(r[1]);
            0 === f ? (z = u[0], f = u[1]) : (z = u[0] + f * r[0], f = u[1] + f * r[1]);
            for (var t = z - (a + t * q), w =
                    f - (b + e * q), e = 0 <= r[0] ? t : q - t, t = 0 <= r[1] ? w : q - w, w = this.getFloat32Buffer(), D, v;;) {
                var y = (q - e) / Math.abs(r[0]),
                    A = (q - t) / Math.abs(r[1]),
                    y = y < A ? y : A;
                D = r[0] * y;
                var C = r[1] * y,
                    e = e + Math.abs(D),
                    t = t + Math.abs(C),
                    y = (z + (z + D)) / 2,
                    A = (f + (f + C)) / 2,
                    z = z + D,
                    f = f + C,
                    y = Math.floor((y - a) / q),
                    A = Math.floor((A - b) / q);
                if (e >= q)
                    for (; e >= q;) e -= q;
                if (t >= q)
                    for (; t >= q;) t -= q;
                v = n.length(u, [z, f]) / n.length(r);
                D = n.length(u, [z - D, f - C]) / n.length(r);
                v = c[1] + o[1] * v;
                D = c[1] + o[1] * D;
                if (y > this.divX || 0 > y || A > this.divZ || 0 > A) return !1;
                var C = w[A * this.divX + y],
                    G = w[A * this.divX +
                        y + 1],
                    B = w[(A + 1) * this.divX + y],
                    I = w[(A + 1) * this.divX + y + 1];
                if (0 >= v - C || 0 >= v - G || 0 >= v - B || 0 >= v - I || 0 >= D - C || 0 >= D - G || 0 >= D - B || 0 >= D - I) {
                    G = [y + (A + 1) * this.divX, y + 1 + A * this.divX, y + A * this.divX];
                    C = [y + (A + 1) * this.divX, y + 1 + (A + 1) * this.divX, y + 1 + A * this.divX];
                    v = a + q * y;
                    D = b + q * A;
                    tmpNormA = m.triangle.normal([v, w[G[0]], D + q], [v + q, w[G[1]], D], [v, w[G[2]], D]);
                    tmpNormB = m.triangle.normal([v, w[C[0]], D + q], [v + q, w[C[1]], D + q], [v + q, w[C[2]], D]);
                    G = h.linePlaneIntersect(tmpNormA, [v, w[G[0]], D + q], c, h.add(c, o));
                    y = Math.abs(b + (A + 1) * q - G[0]) / Math.abs(a + y * q -
                        G[2]);
                    if (1 <= y && G[0] >= v - 1.0E-8 && G[0] <= v + q + 1.0E-8 && G[2] >= D - 1.0E-8 && G[2] <= D + 1.0E-8 + q) return G;
                    A = h.linePlaneIntersect(tmpNormB, [v, w[C[0]], D + q], c, h.add(c, o));
                    if (1 > y && A[0] >= v - 1.0E-8 && A[0] <= v + q + 1.0E-8 && A[2] >= D - 1.0E-8 && A[2] <= D + q + 1.0E-8) return A
                }
            }
        }
    };
    var r = m.extendClassGeneral(m.Mesh, function(d) {
        d = d || {};
        d.dynamic = !0;
        d.buildWireframe = !0;
        this.material = d.material;
        this._update = m.Mesh.prototype.update;
        m.Mesh.apply(this, [d]);
        this.hField = d.hField || null;
        this.divX = d.divX || null;
        this.divZ = d.divZ || null;
        this.viewX = d.viewX ||
            0;
        this.viewZ = d.viewZ || 0;
        this.ofsX = d.ofsX || 0;
        this.ofsZ = d.ofsZ || 0;
        this.edgeX = d.edgeX || 0;
        this.edgeZ = d.edgeZ || 0;
        this.normalBuffer = [];
        this.genHeightfieldMesh()
    }, {
        setIndexedHeight: function(d, g, c) {
            this.points[d + g * this.divX][1] = c
        },
        genHeightfieldMesh: function() {
            var d, g, c = this.divX + this.edgeX,
                a = this.divZ + this.edgeZ,
                b = this.hField.getCellSize(),
                f = b * this.divX;
            d = b * this.divZ;
            0 !== this.points.length && this.clean();
            var e = -(d / 2);
            for (g = 0; g < a; g++) {
                var q = -(f / 2);
                for (d = 0; d < c; d++) this.addPoint([q + this.ofsX, 0, e + this.ofsZ]),
                    q += b;
                e += b
            }
            this.setFaceMaterial(this.material);
            d = -1 / (c - 1);
            g = 1 / (a - 1);
            for (f = e = 0; f < a - 1; f++) {
                q = 1;
                for (b = 0; b < c - 1; b++) f1 = this.addFace([b + (f + 1) * c, b + 1 + f * c, b + f * c]), f2 = this.addFace([b + (f + 1) * c, b + 1 + (f + 1) * c, b + 1 + f * c]), this.faces[f1].uvs = [
                    [q, e + g],
                    [q + d, e],
                    [q, e]
                ], this.faces[f2].uvs = [
                    [q, e + g],
                    [q + d, e + g],
                    [q + d, e]
                ], q += d;
                e += g
            }
        },
        recalcNormals: function(d) {
            var g;
            if (d = d || this.normalMapRef) {
                var d = this.divX + this.edgeX,
                    c = this.divZ + this.edgeZ;
                if (!this.normalBuffer.length) {
                    for (g = 0; g < this.points.length; g++) this.normalBuffer.push([0,
                        1, 0
                    ]);
                    var a = 0;
                    for (g = 0; g < c - 1; g++)
                        for (k = 0; k < d - 1; k++) this.faces[a++].point_normals = [this.normalBuffer[k + (g + 1) * d], this.normalBuffer[k + 1 + g * d], this.normalBuffer[k + g * d]], this.faces[a++].point_normals = [this.normalBuffer[k + (g + 1) * d], this.normalBuffer[k + 1 + (g + 1) * d], this.normalBuffer[k + 1 + g * d]]
                }
                c = this.hField;
                a = c.getFloat32Buffer();
                g = this.viewX || 0;
                var b = (this.viewZ || 0) * c.getDivX() + g;
                for (g = 0; g < this.points.length; g++) {
                    var f = g % d,
                        e = Math.floor(g / d),
                        q = b + f + (e - 1) * c.getDivX(),
                        n = b + f + (e + 1) * c.getDivX(),
                        h = b + (f + 1) + e * c.getDivX(),
                        o = b + (f - 1) + e * c.getDivX(),
                        f = b + f + e * c.getDivX(),
                        q = a[q],
                        n = a[n],
                        h = a[h],
                        o = a[o],
                        f = a[f];
                    q === w && (q = f);
                    n === w && (n = f);
                    h === w && (h = f);
                    o === w && (o = f);
                    o = m.vec3.normalize([(h - f + (f - o)) / 2, 2, (q - f + (f - n)) / 2]);
                    this.normalBuffer[g][0] = o[0];
                    this.normalBuffer[g][1] = o[1];
                    this.normalBuffer[g][2] = o[2]
                }
                return this
            }
        },
        update: function() {
            var d = this.viewX || 0,
                g = this.viewZ || 0,
                c = this.divX + this.edgeX,
                a = this.divZ + this.edgeZ,
                b = this.hField.getDivX();
            this.hField.getDivZ();
            for (var f = this.hField.getFloat32Buffer(), e = g, a = g + a; e < a; e++)
                for (var q = d,
                        n = d + c; q < n; q++) this.points[(e - g) * c + (q - d)][1] = f[e * b + q];
            this._update()
        }
    });
    return {
        HeightField: o,
        HeightFieldBrush: h,
        HeightFieldMesh: r
    }
});
CubicVR.RegisterModule("Landscape", function(m) {
    var w = m.undef,
        t = Math.PI / 2;
    return {
        Landscape: m.extendClassGeneral(m.SceneObject, function() {
            if (1 < arguments.length) this.hField = new m.HeightField({
                size: arguments[0],
                divX: arguments[1],
                divZ: arguments[2]
            }), this.hfMesh = new m.HeightFieldMesh({
                hField: this.hField,
                size: arguments[0],
                divX: arguments[1],
                divZ: arguments[2],
                material: arguments[3],
                ofsX: this.hField.getCellSize() / 2,
                ofsZ: this.hField.getCellSize() / 2
            }), this.hfMesh.prepare(), m.SceneObject.apply(this, [{
                mesh: this.hfMesh,
                shadowCast: !1
            }]);
            else {
                var h = arguments[0] || {};
                this.size = h.size || 128;
                this.divX = h.divX || 128;
                this.divZ = h.divZ || 128;
                this.tiles = [];
                this.tileMeshes = [];
                this.tileMaterials = [];
                this.tileSpats = [];
                this.tileX = h.tileX || this.divX;
                this.tileZ = h.tileZ || this.divZ;
                this.tileChanged = [];
                this.tileSpatChanged = [];
                this.hField = new m.HeightField({
                    size: this.size,
                    divX: this.divX,
                    divZ: this.divZ
                });
                this.divX > this.divZ ? (this.sizeX = this.size, this.sizeZ = this.size / this.divX * this.divZ) : (this.sizeX = this.divZ > this.divX ? this.size / this.divZ *
                    this.divX : this.size, this.sizeZ = this.size);
                this.cellSize = this.sizeX / this.divX;
                this.tileSize = this.cellSize * this.tileX;
                this.spatResolution = h.spatResolution || 256;
                this.spats = h.spats || [];
                this.sourceSpats = h.spats.slice(0);
                m.SceneObject.apply(this, [{
                    mesh: null,
                    shadowCast: !1
                }]);
                for (var o = 0, r = 0, d = 0; d < this.divZ; d += this.tileZ) {
                    for (var g = o = 0; g < this.divX; g += this.tileX) {
                        var c = new m.DrawBufferTexture({
                                width: this.spatResolution,
                                height: this.spatResolution
                            }),
                            a = g + 1 != this.tileX ? 1 : 0,
                            b = d + 1 != this.tileZ ? 1 : 0,
                            f = new m.SpatMaterial({
                                color: [1,
                                    1, 1
                                ],
                                specular: [0.05, 0.05, 0.05],
                                spats: this.sourceSpats,
                                sourceTexture: c,
                                spatResolution: this.spatResolution,
                                spatOffset: [this.divX / (this.divX + a), this.divZ / (this.divZ + b), 1]
                            }),
                            a = new m.HeightFieldMesh({
                                hField: this.hField,
                                size: this.tileSize,
                                divX: this.tileX,
                                divZ: this.tileZ,
                                viewX: g,
                                viewZ: d,
                                edgeX: a,
                                edgeZ: b,
                                material: f
                            });
                        a.prepare();
                        var b = new m.SceneObject({
                                mesh: a
                            }),
                            e = this.hField.getStartX(),
                            q = this.hField.getStartZ();
                        b.position[0] = e + this.tileSize * o + this.tileSize / 2;
                        b.position[2] = q + this.tileSize * r + this.tileSize /
                            2;
                        this.bindChild(b);
                        this.tiles.push(b);
                        this.tileMeshes.push(a);
                        this.tileMaterials.push(f);
                        this.tileSpats.push(c);
                        this.tileChanged.push(!1);
                        this.tileSpatChanged.push(!1);
                        o++
                    }
                    r++
                }
                h.jsonData && this.loadFromJSON(h, h.compress || !1)
            }
        }, {
            loadFile: function(h) {
                var m = new FileReader;
                m.onload = function(h) {
                    return function(d) {
                        d = JSON.parse(d.target.result);
                        h.loadFromJSON(d, d.compress)
                    }
                }(this);
                m.readAsText(h)
            },
            loadFromJSON: function(h, m) {
                var m = m || h.compress,
                    r = this.tileSpats,
                    d = h.jsonData.tiles;
                if (m) {
                    h.jsonData.heightfield =
                        Iuppiter.decompress(Iuppiter.Base64.decode(Iuppiter.toByteArray(h.jsonData.heightfield), !0)).split(",");
                    i = 0;
                    for (iMax = d.length; i < iMax; i++) d[i] = Iuppiter.decompress(Iuppiter.Base64.decode(Iuppiter.toByteArray(d[i]), !0)).split(",")
                }
                var g = this.hField.getUint8Buffer(),
                    c = h.jsonData.heightfield;
                i = 0;
                for (iMax = g.length; i < iMax; i++) g[i] = parseInt(c[i], 10);
                i = 0;
                for (iMax = d.length; i < iMax; i++) {
                    for (var g = d[i], c = r[i].getUint8Buffer(), a = 0, b = g.length; a < b; a++) c[a] = parseInt(g[a], 10);
                    console.log(g);
                    this.tileChanged[i] = !0;
                    this.tileSpatChanged[i] = !0
                }
                this.update()
            },
            saveToJSON: function(h, m) {
                var h = h !== w ? h : !0,
                    m = m !== w ? m : !1,
                    r, d, g = {
                        divX: this.divX,
                        divZ: this.divZ,
                        tileX: this.tileX,
                        tileZ: this.tileZ,
                        spats: this.spats,
                        spatResolution: this.spatResolution,
                        compress: h,
                        size: this.size,
                        jsonData: {
                            heightfield: [],
                            tiles: []
                        }
                    },
                    c = this.hField.getUint8Buffer(),
                    a = g.jsonData.heightfield;
                r = 0;
                for (d = c.length; r < d; r++) a[r] = c[r];
                c = this.tileSpats;
                a = g.jsonData.tiles;
                r = 0;
                for (d = c.length; r < d; r++) {
                    a[r] = [];
                    for (var b = a[r], f = c[r].getUint8Buffer(), e = 0, q = f.length; e <
                        q; e++) b[e] = f[e]
                }
                if (h) {
                    g.jsonData.heightfield = Iuppiter.Base64.encode(Iuppiter.compress(g.jsonData.heightfield.join(",")), !0);
                    r = 0;
                    for (d = a.length; r < d; r++) g.jsonData.tiles[r] = Iuppiter.Base64.encode(Iuppiter.compress(a[r].join(",")), !0)
                }
                r = JSON.stringify(g);
                if (m) uriContent = "data:text/x-download;charset=utf-8," + encodeURIComponent(r), window.location.href = uriContent;
                else return r
            },
            update: function() {
                var h, m;
                this.hField.needsFlush() && this.hField.flush();
                h = this.hField.getDrawArea();
                if (!1 !== h) {
                    var r = this.getTileAt(h.startX -
                        this.cellSize, h.startZ - this.cellSize, h.endX - h.startX + this.cellSize, h.endZ - h.startZ, this.cellSize);
                    !1 !== r && r.length === w && (r = [r]);
                    h = 0;
                    for (m = r.length; h < m; h++) this.tileChanged[r[h]] = !0;
                    this.hField.clearDrawArea()
                }
                h = 0;
                for (m = this.tiles.length; h < m; h++)
                    if (this.tileChanged[h] && (this.tileMeshes[h].update(), this.tileChanged[h] = !1), this.tileSpatChanged[h]) this.tileSpats[h].update(), this.tileSpatChanged[h] = !1
            },
            getHeightField: function() {
                return this.hField
            },
            mapGen: function(h, m, r, d, g) {
                this.hField.setRect({
                    src: h,
                    startX: m,
                    startZ: r,
                    walkX: d,
                    walkZ: g
                });
                this.hfMesh.update()
            },
            getFaceAt: function(h, m) {
                return this.hField.getFaceAt([h, 0, m])
            },
            getHeightValue: function(h, m) {
                return this.hField.getHeightValue([h, 0, m])
            },
            orient: function(h, m, r, d, g, c) {
                c === w && (c = 0);
                var a, b, f = [];
                a = r / 2;
                var e = d / 2;
                b = Math.sqrt(e * e + a * a);
                e = Math.atan2(e, a);
                g *= Math.PI / 180;
                a = h + Math.sin(g) * c;
                c = m + Math.cos(g) * c;
                f[0] = this.getHeightValue([a + b * Math.cos(-e - t + g), 0, c + b * -Math.sin(-e - t + g)]);
                f[1] = this.getHeightValue([a + b * Math.cos(e - t + g), 0, c + b * -Math.sin(e - t + g)]);
                f[2] =
                    this.getHeightValue([a + b * Math.cos(-e + t + g), 0, c + b * -Math.sin(-e + t + g)]);
                f[3] = this.getHeightValue([a + b * Math.cos(e + t + g), 0, c + b * -Math.sin(e + t + g)]);
                b = -Math.atan2(f[1] - f[2], r);
                c = -Math.atan2(f[0] - f[1], d);
                b += -Math.atan2(f[0] - f[3], r);
                c += -Math.atan2(f[3] - f[2], d);
                return [
                    [h, (f[2] + f[3] + f[1] + f[0]) / 4, m],
                    [b / 2 * (180 / Math.PI), g, c / 2 * (180 / Math.PI)]
                ]
            },
            getTileAt: function(h, m, r, d) {
                var r = r || 0,
                    d = d || 0,
                    g = this.hField.getStartX(),
                    c = this.hField.getStartZ(),
                    a = Math.floor(this.divX / this.tileX),
                    b = Math.floor((h - g) / (this.tileX * this.tileSize) *
                        this.tileX),
                    f = Math.floor((m - c) / (this.tileZ * this.tileSize) * this.tileZ),
                    e = 0;
                if (0 === r && 0 === d) return e = parseInt(b + f * a, 10);
                h = Math.floor((h + r - g) / (this.tileX * this.tileSize) * this.tileX);
                m = Math.floor((m + d - c) / (this.tileZ * this.tileSize) * this.tileZ);
                for (d = []; f <= m; f++)
                    for (c = b; c <= h; c++) e = f * (this.divX / this.tileX) + c, 0 <= e && e < this.tiles.length && d.push(e);
                return d
            },
            getSpatLocation: function(h, m, r) {
                if (r === w) h = (1 - (h / this.getHeightField().getSize() + 0.5)) * this.spatResolution * (this.divX / this.tileX) % this.spatResolution, m =
                    (1 - (m / this.getHeightField().getSize() + 0.5)) * this.spatResolution * (this.divZ / this.tileZ) % this.spatResolution;
                else var d = this.divX / this.tileX,
                    g = r % d,
                    d = Math.floor(r / d),
                    r = this.hField.getStartX(),
                    d = this.hField.getStartZ() + d * this.tileSize,
                    h = (1 - (h - (r + g * this.tileSize)) / this.tileSize) * this.spatResolution,
                    m = (1 - (m - d) / this.tileSize) * this.spatResolution;
                return {
                    x: h,
                    z: m
                }
            },
            drawSpat: function(h, m, r) {
                var d = r.getSize() * (this.size / this.spatResolution),
                    g = h - d / 2,
                    c = m - d / 2,
                    d = this.getTileAt(g, c, h + d / 2 - g, m + d / 2 - c);
                !1 !== d && d.length ===
                    w && (d = [d]);
                if (!1 !== d) {
                    g = 0;
                    for (c = d.length; g < c; g++) {
                        var a = d[g],
                            b = this.getSpatLocation(h, m, a);
                        0 <= a && a < this.tileSpats.length && (this.tileSpats[a].draw(b.x, b.z, r), this.tileSpatChanged[a] = !0)
                    }
                }
            }
        })
    }
});
CubicVR.RegisterModule("SpatMaterial", function(m) {
    var w = m.undef,
        t;
    return {
        SpatMaterial: m.extendClassGeneral(m.Material, function(h) {
            h = h || {};
            t || (t = new m.Texture);
            this.spats = h.spats || [t, t, t, t, t];
            this.sourceTex = h.sourceTexture || t;
            this.spatResolution = h.spatResolution || 256;
            this.spatTexel = 1 / this.spatResolution;
            var o = this.spats,
                r;
            for (r in o) {
                var d = o[r];
                "string" === typeof d && (o[r] = m.Textures_ref[d] !== w ? m.Textures_obj[m.Textures_ref[d]] : new m.Texture(d))
            }
            this.spatOffset = h.spatOffset || [1, 1, 1];
            this.spatShader =
                new m.CustomShader({
                    vertex: "void main(void) {\n  vertexTexCoordOut = cubicvr_texCoord();\n  gl_Position =  matrixProjection * matrixModelView * cubicvr_transform();\n  #if !LIGHT_DEPTH_PASS  // not needed if shadowing \n    vertexNormalOut = matrixNormal * cubicvr_normal();\n    cubicvr_lighting();\n  #endif // !LIGHT_DEPTH_PASS \n}",
                    fragment: "uniform sampler2D spatImage;\nuniform sampler2D spat0;\nuniform sampler2D spat1;\nuniform sampler2D spat2;\nuniform sampler2D spat3;\nuniform sampler2D spat4;\nuniform vec3 spatOffset;\nuniform float spatTexel;\nvoid main(void) \n{  \nvec2 texCoord = cubicvr_texCoord();\nvec2 spatTexCoord = texCoord*30.0;\nvec4 color = texture2D(spat0,spatTexCoord);\nvec2 spatSourceCoord = vec2(texCoord.x*spatOffset.x,texCoord.y*spatOffset.y);\nif (spatSourceCoord.s<=spatTexel/2.0) {\n   spatSourceCoord.s=spatTexel/2.0;\n}\nif (spatSourceCoord.s>=1.0-spatTexel/2.0) {\n   spatSourceCoord.s=1.0-spatTexel/2.0;\n}\nif (spatSourceCoord.t<=spatTexel/2.0) {\n   spatSourceCoord.t=spatTexel/2.0;\n}\nif (spatSourceCoord.t>=1.0-spatTexel/2.0) {\n   spatSourceCoord.t=1.0-spatTexel/2.0;\n}\nvec4 spatSource = texture2D(spatImage,spatSourceCoord);\ncolor = mix(color,texture2D(spat1,spatTexCoord),spatSource.r);\ncolor = mix(color,texture2D(spat2,spatTexCoord),spatSource.g);\ncolor = mix(color,texture2D(spat3,spatTexCoord),spatSource.b);\ncolor = mix(color,texture2D(spat4,spatTexCoord),spatSource.a);\nvec3 normal = cubicvr_normal(texCoord);\ncolor = cubicvr_environment(color,normal,texCoord);\ncolor = cubicvr_lighting(color,normal,texCoord);\ngl_FragColor = clamp(color,0.0,1.0);\n}",
                    init: function() {},
                    update: function(d) {
                        return function(c, a) {
                            var b = a.textureIndex;
                            c.spatImage.set(b++, d.sourceTex);
                            c.spatOffset.set(d.spatOffset);
                            c.spatTexel.set(d.spatTexel);
                            o[0] && c.spat0.set(b++, o[0]);
                            o[1] && c.spat1.set(b++, o[1]);
                            o[2] && c.spat2.set(b++, o[2]);
                            o[3] && c.spat3.set(b++, o[3]);
                            o[4] && c.spat4.set(b++, o[4])
                        }
                    }(this)
                });
            h.shader = this.spatShader;
            m.Material.apply(this, [h])
        }, {
            setSpats: function(h) {
                this.spats = h
            },
            getSpats: function() {
                return this.spats
            },
            setSource: function(h) {
                this.sourceTexture = h
            }
        })
    }
});
CubicVR.RegisterModule("Octree", function(m) {
    function w(a, b, c, e, d) {
        var g = this._children = [];
        this._dirty = !1;
        g[0] = null;
        g[1] = null;
        g[2] = null;
        g[3] = null;
        g[4] = null;
        g[5] = null;
        g[6] = null;
        g[7] = null;
        this._child_index = d || -1;
        this._root = c || null;
        this._max_depth = b || 0;
        a = this._size = a || 0;
        e = this._position = e || [0, 0, 0];
        this._nodes = [];
        this._lights = [];
        this._static_lights = [];
        this._sphere = [e[0], e[1], e[2], Math.sqrt(3 * (this._size / 2 * this._size / 2))];
        b = this._bbox = [
            [0, 0, 0],
            [0, 0, 0]
        ];
        c = m.aabb;
        c.reset(b, e);
        a /= 2;
        c.engulf(b, [e[0] + a, e[1] +
            a, e[2] + a
        ]);
        c.engulf(b, [e[0] - a, e[1] - a, e[2] - a]);
        this._debug_visible = !1
    }

    function t() {
        this.position = [0, 0, 0];
        this.visible = !1;
        this._object = null
    }

    function h() {
        this.last_in = [];
        this._planes = [];
        this.sphere = null;
        for (var a = 0; 6 > a; ++a) this._planes[a] = [0, 0, 0, 0]
    }
    var o = m.undef,
        r = m.plane,
        d = m.sphere,
        g = m.enums;
    g.frustum = {
        plane: {
            LEFT: 0,
            RIGHT: 1,
            TOP: 2,
            BOTTOM: 3,
            NEAR: 4,
            FAR: 5
        }
    };
    g.octree = {
        TOP_NW: 0,
        TOP_NE: 1,
        TOP_SE: 2,
        TOP_SW: 3,
        BOTTOM_NW: 4,
        BOTTOM_NE: 5,
        BOTTOM_SE: 6,
        BOTTOM_SW: 7
    };
    var c = function(a, b, c) {
        c = a.slice((c || b) + 1 || a.length);
        a.length = 0 > b ? a.length + b : b;
        return a.push.apply(a, c)
    };
    w.prototype.destroy = function() {
        var a, b, c;
        a = 0;
        for (b = this._static_lights.length; a < b; ++a) c = this._static_lights[a], c.octree_leaves = null, c.octree_common_root = null, c.octree_aabb = null;
        a = 0;
        for (b = this._lights.length; a < b; ++a) c = this._lights[a], c.octree_leaves = null, c.octree_common_root = null, c.octree_aabb = null;
        this._lights = this._static_lights = null;
        a = 0;
        for (b = this._children.length; a < b; ++a) null !== this._children[a] && this._children[a].destroy();
        a = 0;
        for (b = this._nodes.length; a <
            b; ++a) c = this._nodes[a], c.octree_leaves = null, c.octree_common_root = null, c.octree_aabb = null, c.dynamic_lights = [], c.static_lights = [];
        this._children[0] = null;
        this._children[1] = null;
        this._children[2] = null;
        this._children[3] = null;
        this._children[4] = null;
        this._children[5] = null;
        this._children[6] = null;
        this._bbox = this._sphere = this._static_lights = this._lights = this._nodes = this._position = this._root = this._children = this._children[7] = null
    };
    w.prototype.toString = function() {
        return "[Octree: @" + this._position + ", depth: " +
            this._max_depth + ", size: " + this._size + ", nodes: " + this._nodes.length + ", measured size:" + [this._bbox[1][0] - this._bbox[0][0], this._bbox[1][2] - this._bbox[0][2]] + "]"
    };
    w.prototype.remove = function(a) {
        var b = !1,
            d = this._nodes.length,
            e;
        e = d - 1;
        for (d = this._nodes.length; 0 <= e; --e)
            if (a === this._nodes[e]) {
                c(this._nodes, e);
                this.dirty_lineage();
                b = !0;
                break
            }
        if (!b)
            for (e = d - 1; 0 <= e; --e)
                if (a === this._lights[e]) {
                    c(this._lights, e);
                    this.dirty_lineage();
                    break
                }
    };
    w.prototype.dirty_lineage = function() {
        this._dirty = !0;
        null !== this._root &&
            this._root.dirty_lineage()
    };
    w.prototype.cleanup = function() {
        for (var a = this._children.length, b = 0, c = 0; c < a; ++c) {
            var e = this._children[c];
            if (null !== e) {
                var d = !0;
                !0 === e._dirty && (d = e.cleanup());
                d ? ++b : this._children[c] = null
            }
        }
        return 0 === this._nodes.length && (0 === this._static_lights.length && 0 === this._lights.length) && (0 === b || 0 === a) ? !1 : !0
    };
    w.prototype.insert_light = function(a) {
        this.insert(a, !0)
    };
    w.prototype.propagate_static_light = function(a) {
        var b, c;
        b = 0;
        for (c = this._nodes.length; b < c; ++b) - 1 === this._nodes[b].static_lights.indexOf(a) &&
            this._nodes[b].static_lights.push(a);
        for (b = 0; 8 > b; ++b) null !== this._children[b] && this._children[b].propagate_static_light(a)
    };
    w.prototype.collect_static_lights = function(a) {
        var b, c;
        b = 0;
        for (c = this._static_lights.length; b < c; ++b) - 1 === a.static_lights.indexOf(this._static_lights[b]) && a.static_lights.push(this._static_lights[b]);
        for (b = 0; 8 > b; ++b) null !== this._children[b] && this._children[b].collect_static_lights(a)
    };
    w.prototype.insert = function(a, b) {
        function c(a, b, e, d) {
            var f, n;
            if (e)
                if (b.method === g.light.method.STATIC) {
                    -1 ===
                        a._static_lights.indexOf(b) && a._static_lights.push(b);
                    e = 0;
                    for (f = a._nodes.length; e < f; ++e) - 1 === a._nodes[e].static_lights.indexOf(b) && a._nodes[e].static_lights.push(b);
                    for (n = a._root; null !== n;) {
                        e = 0;
                        for (l = n._nodes.length; e < l; ++e) f = n._nodes[e], -1 === f.static_lights.indexOf(b) && f.static_lights.push(b);
                        n = n._root
                    }
                } else -1 === a._lights.indexOf(b) && a._lights.push(b);
            else {
                a._nodes.push(b);
                e = 0;
                for (f = a._static_lights.length; e < f; ++e) - 1 === b.static_lights.indexOf(a._static_lights[e]) && b.static_lights.push(a._static_lights[e]);
                for (n = a._root; null !== n;) {
                    e = 0;
                    for (f = n._static_lights.length; e < f; ++e) {
                        var h = n._static_lights[e]; - 1 === b.static_lights.indexOf(h) && b.static_lights.push(h)
                    }
                    n = n._root
                }
            }
            b.octree_leaves.push(a);
            b.octree_common_root = d;
            d = m.aabb;
            d.engulf(b.octree_aabb, a._bbox[0]);
            d.engulf(b.octree_aabb, a._bbox[1])
        }
        b === o && (b = !1);
        null === this._root && (a.octree_leaves = [], a.octree_common_root = null);
        if (0 === this._max_depth) c(this, a, b, this._root);
        else {
            var e = this._position,
                d, n, h, r, x, u, t;
            n = a.getAABB();
            t = [n[0][0], n[0][1], n[0][2]];
            var z = [n[1][0], n[1][1], n[1][2]];
            d = t[0] < e[0] && t[1] < e[1] && t[2] < e[2];
            n = z[0] > e[0] && t[1] < e[1] && t[2] < e[2];
            x = t[0] < e[0] && z[1] > e[1] && t[2] < e[2];
            u = z[0] > e[0] && z[1] > e[1] && t[2] < e[2];
            h = t[0] < e[0] && t[1] < e[1] && z[2] > e[2];
            r = z[0] > e[0] && t[1] < e[1] && z[2] > e[2];
            t = t[0] < e[0] && z[1] > e[1] && z[2] > e[2];
            e = z[0] > e[0] && z[1] > e[1] && z[2] > e[2];
            if (d && n && x && u && h && r && t && e) c(this, a, b, this), b ? a.method == g.light.method.STATIC && this.propagate_static_light(a) : this.collect_static_lights(a);
            else {
                for (var z = 0, E = this._static_lights.length; z < E; ++z) a.static_lights ===
                    o && (a.static_lights = []), -1 === a.static_lights.indexOf(this._static_lights[z]) && a.static_lights.push(this._static_lights[z]);
                var z = this._size / 2,
                    E = this._size / 4,
                    D = 0,
                    v = this._position[0],
                    y = this._position[1],
                    A = this._position[2];
                d && (d = [v - E, y - E, A - E], null === this._children[g.octree.TOP_NW] && (this._children[g.octree.TOP_NW] = new w(z, this._max_depth - 1, this, d, g.octree.TOP_NW)), this._children[g.octree.TOP_NW].insert(a, b), ++D);
                n && (d = [v + E, y - E, A - E], null === this._children[g.octree.TOP_NE] && (this._children[g.octree.TOP_NE] =
                    new w(z, this._max_depth - 1, this, d, g.octree.TOP_NE)), this._children[g.octree.TOP_NE].insert(a, b), ++D);
                x && (d = [v - E, y + E, A - E], null === this._children[g.octree.BOTTOM_NW] && (this._children[g.octree.BOTTOM_NW] = new w(z, this._max_depth - 1, this, d, g.octree.BOTTOM_NW)), this._children[g.octree.BOTTOM_NW].insert(a, b), ++D);
                u && (d = [v + E, y + E, A - E], null === this._children[g.octree.BOTTOM_NE] && (this._children[g.octree.BOTTOM_NE] = new w(z, this._max_depth - 1, this, d, g.octree.BOTTOM_NE)), this._children[g.octree.BOTTOM_NE].insert(a,
                    b), ++D);
                h && (d = [v - E, y - E, A + E], null === this._children[g.octree.TOP_SW] && (this._children[g.octree.TOP_SW] = new w(z, this._max_depth - 1, this, d, g.octree.TOP_SW)), this._children[g.octree.TOP_SW].insert(a, b), ++D);
                r && (d = [v + E, y - E, A + E], null === this._children[g.octree.TOP_SE] && (this._children[g.octree.TOP_SE] = new w(z, this._max_depth - 1, this, d, g.octree.TOP_SE)), this._children[g.octree.TOP_SE].insert(a, b), ++D);
                t && (d = [v - E, y + E, A + E], null === this._children[g.octree.BOTTOM_SW] && (this._children[g.octree.BOTTOM_SW] = new w(z,
                    this._max_depth - 1, this, d, g.octree.BOTTOM_SW)), this._children[g.octree.BOTTOM_SW].insert(a, b), ++D);
                e && (d = [v + E, y + E, A + E], null === this._children[g.octree.BOTTOM_SE] && (this._children[g.octree.BOTTOM_SE] = new w(z, this._max_depth - 1, this, d, g.octree.BOTTOM_SE)), this._children[g.octree.BOTTOM_SE].insert(a, b), ++D);
                if (1 < D || null === a.octree_common_root) a.octree_common_root = this
            }
        }
    };
    w.prototype.draw_on_map = function(a, b, c) {
        function e(a, e, c, f, h) {
            var m = a < c ? a : c,
                o = e < f ? e : f,
                a = a < c ? c - a : a - c,
                e = e < f ? f - e : e - f;
            b.save();
            void 0 !== h &&
                (b.fillStyle = h, b.fillRect(d + m, g + o, a, e));
            b.strokeRect(d + m, g + o, a, e);
            b.restore()
        }
        var d = a.width / 2,
            g = a.height / 2,
            h, m, r, u, t, z, w;
        if (c === o || "map" === c) b.save(), !1 !== this._debug_visible ? (b.fillStyle = "rgba(0,0,0,0)", b.strokeStyle = "#FF0000") : (b.fillStyle = "rgba(0,0,0,0)", b.strokeStyle = "rgba(0,0,0,0)"), b.beginPath(), t = this._size / 2, h = this._position[0], m = this._position[2], b.moveTo(d + h - t, d + m - t), b.lineTo(d + h - t, d + m + t), b.lineTo(d + h + t, d + m + t), b.lineTo(d + h + t, d + m - t), b.stroke(), b.fill(), b.restore();
        if (c === o || "objects" === c) {
            b.save();
            t = 0;
            for (w = this._nodes.length; t < w; ++t) z = this._nodes[t], b.fillStyle = "#5500FF", b.strokeStyle = !0 === z.visible && !1 === z.culled ? "#FFFFFF" : "#000000", b.beginPath(), h = z.aabb[0][0], m = z.aabb[0][2], r = z.aabb[1][0] - h, u = z.aabb[1][2] - m, b.rect(d + h, g + m, r, u), b.stroke();
            b.restore()
        }
        if (c === o || "lights" === c) {
            t = 0;
            for (w = this._lights.length; t < w; ++t) u = this._lights[t], b.fillStyle = !1 === u.culled && !0 === u.visible ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.0)", b.strokeStyle = "#FFFF00", b.beginPath(), z = u.distance, h = u.position[0],
                m = u.position[2], b.arc(d + h, g + m, z, 0, 2 * Math.PI, !0), b.closePath(), b.stroke(), b.fill(), b.beginPath(), h = u.aabb[0][0], m = u.aabb[0][2], r = u.aabb[1][0] - h, u = u.aabb[1][2] - m, b.rect(d + h, g + m, r, u), b.closePath(), b.stroke();
            t = 0;
            for (w = this._static_lights.length; t < w; ++t) u = this._static_lights[t], b.fillStyle = !1 === u.culled && !0 === u.visible ? "rgba(255, 255, 255, 0.01)" : "rgba(255, 255, 255, 0.0)", b.strokeStyle = "#FF66BB", b.beginPath(), z = u.distance, h = u.position[0], m = u.position[2], b.arc(d + h, g + m, z, 0, 2 * Math.PI, !0), b.closePath(),
                b.stroke(), b.fill(), b.beginPath(), h = u.aabb[0][0], m = u.aabb[0][2], r = u.aabb[1][0] - h, u = u.aabb[1][2] - m, b.rect(d + h, g + m, r, u), b.closePath(), b.stroke()
        }
        if ("lights" != c && "objects" != c && "map" != c) {
            b.save();
            h = this._nodes;
            t = 0;
            for (u = h.length; t < u; ++t)
                if (z = h[t], z.name == c) {
                    b.strokeStyle = "#FFFF00";
                    b.lineWidth = 3;
                    b.beginPath();
                    h = z.aabb[0][0];
                    m = z.aabb[0][2];
                    r = z.aabb[1][0] - h;
                    u = z.aabb[1][2] - m;
                    b.rect(d + h, g + m, r, u);
                    b.closePath();
                    b.stroke();
                    h = z.octree_aabb;
                    b.strokeStyle = "#0000FF";
                    e(h[0][0], h[0][2], h[1][0], h[1][2]);
                    b.lineWidth =
                        1;
                    null !== z.common_root && (b.strokeStyle = "#00FF00");
                    break
                }
            b.lineWidth = 1;
            b.strokeStyle = "#FFFF00";
            e(this._bbox[0][0], this._bbox[0][2], this._bbox[1][0], this._bbox[1][2], "#444444");
            b.fill();
            b.restore()
        }
        t = 0;
        for (w = this._children.length; t < w; ++t) null !== this._children[t] && this._children[t].draw_on_map(a, b, c)
    };
    w.prototype.contains_point = function(a) {
        return a[0] <= this._position[0] + this._size / 2 && a[1] <= this._position[1] + this._size / 2 && a[2] <= this._position[2] + this._size / 2 && a[0] >= this._position[0] - this._size / 2 && a[1] >=
            this._position[1] - this._size / 2 && a[2] >= this._position[2] - this._size / 2
    };
    w.prototype.get_frustum_hits = function(a, b) {
        var c = {
            objects: [],
            lights: []
        };
        if ((b === o || !0 === b) && !this.contains_point(a.position)) {
            if (!1 === d.intersects(a.frustum.sphere, this._sphere)) return c;
            var e = a.frustum.contains_sphere(this._sphere);
            if (-1 === e) return this._debug_visible = !1, c;
            if (1 === e) this._debug_visible = 2, b = !1;
            else if (0 === e) {
                this._debug_visible = !0;
                e = a.frustum.contains_box(this._bbox);
                if (-1 === e) return this._debug_visible = !1, c;
                1 ===
                    e && (this._debug_visible = 3, b = !1)
            }
        }
        var g, n, e = 0;
        for (g = this._nodes.length; e < g; ++e) n = this._nodes[e], c.objects.push(n), n.dynamic_lights = [].concat(this._lights), n.was_culled = n.culled, n.culled = !1, n.drawn_this_frame = !1;
        this._debug_visible = 0 < this._lights.length ? 4 : this._debug_visible;
        e = 0;
        for (g = this._lights.length; e < g; ++e) n = this._lights[e], !0 === n.visible && (c.lights.push(n), n.was_culled = n.culled, n.culled = !1);
        e = 0;
        for (g = this._static_lights.length; e < g; ++e) n = this._static_lights[e], !0 === n.visible && (n.culled = !1);
        for (e =
            0; 8 > e; ++e)
            if (null !== this._children[e]) {
                g = this._children[e].get_frustum_hits(a, b);
                var h;
                n = 0;
                for (h = g.objects.length; n < h; ++n) {
                    c.objects.push(g.objects[n]);
                    for (var m = g.objects[n].dynamic_lights, r = 0, u = this._lights.length; r < u; ++r) 0 > m.indexOf(this._lights[r]) && m.push(this._lights[r])
                }
                n = 0;
                for (h = g.lights.length; n < h; ++n) 0 > c.lights.indexOf(g.lights[n]) && c.lights.push(g.lights[n])
            }
        return c
    };
    w.prototype.reset_node_visibility = function() {
        this._debug_visible = !1;
        var a, b;
        a = 0;
        for (b = this._nodes.length; a < b; ++a) this._nodes[a].culled = !0;
        a = 0;
        for (b = this._lights.length; a < b; ++a) this._lights[a].culled = !0;
        a = 0;
        for (b = this._static_lights.length; a < b; ++a) this._static_lights[a].culled = !0;
        a = 0;
        for (b = this._children.length; a < b; ++a) null !== this._children[a] && this._children[a].reset_node_visibility()
    };
    t.prototype.toString = function() {
        return "[OctreeNode " + this.position + "]"
    };
    t.prototype.attach = function(a) {
        this._object = a
    };
    h.prototype.extract = function(a, b, c) {
        var e = m.mat4,
            d = m.vec3;
        if (!(b === o || c === o)) {
            e = e.multiply(c, b);
            b = this._planes;
            b[g.frustum.plane.LEFT][0] =
                e[3] + e[0];
            b[g.frustum.plane.LEFT][1] = e[7] + e[4];
            b[g.frustum.plane.LEFT][2] = e[11] + e[8];
            b[g.frustum.plane.LEFT][3] = e[15] + e[12];
            b[g.frustum.plane.RIGHT][0] = e[3] - e[0];
            b[g.frustum.plane.RIGHT][1] = e[7] - e[4];
            b[g.frustum.plane.RIGHT][2] = e[11] - e[8];
            b[g.frustum.plane.RIGHT][3] = e[15] - e[12];
            b[g.frustum.plane.TOP][0] = e[3] - e[1];
            b[g.frustum.plane.TOP][1] = e[7] - e[5];
            b[g.frustum.plane.TOP][2] = e[11] - e[9];
            b[g.frustum.plane.TOP][3] = e[15] - e[13];
            b[g.frustum.plane.BOTTOM][0] = e[3] + e[1];
            b[g.frustum.plane.BOTTOM][1] = e[7] + e[5];
            b[g.frustum.plane.BOTTOM][2] = e[11] + e[9];
            b[g.frustum.plane.BOTTOM][3] = e[15] + e[13];
            b[g.frustum.plane.NEAR][0] = e[3] + e[2];
            b[g.frustum.plane.NEAR][1] = e[7] + e[6];
            b[g.frustum.plane.NEAR][2] = e[11] + e[10];
            b[g.frustum.plane.NEAR][3] = e[15] + e[14];
            b[g.frustum.plane.FAR][0] = e[3] - e[2];
            b[g.frustum.plane.FAR][1] = e[7] - e[6];
            b[g.frustum.plane.FAR][2] = e[11] - e[10];
            b[g.frustum.plane.FAR][3] = e[15] - e[14];
            for (var n = 0; 6 > n; ++n) r.normalize(b[n]);
            n = -b[g.frustum.plane.NEAR][3];
            b = b[g.frustum.plane.FAR][3] - n;
            c = b * (1 / c[5]);
            c = d.subtract([0,
                0, n + 0.5 * b
            ], [c, c, n + b]);
            c = d.length(c);
            e = [e[3], e[9], e[10]];
            n = d.length(e);
            e = d.multiply(e, 1 / n);
            a = [a.position[0], a.position[1], a.position[2]];
            a = d.add(a, d.multiply(e, 0.5 * b));
            a = d.add(a, d.multiply(e, 1));
            this.sphere = [a[0], a[1], a[2], c]
        }
    };
    h.prototype.contains_sphere = function(a) {
        for (var b = m.vec3, c = this._planes, e = 0; 6 > e; ++e) {
            var d = c[e],
                d = b.dot([d[0], d[1], d[2]], [a[0], a[1], a[2]]) + d.d;
            this.last_in[e] = 1;
            if (d < -a[3]) return -1;
            if (Math.abs(d) < a[3]) return 0
        }
        return 1
    };
    h.prototype.draw_on_map = function(a, b) {
        var c = a.width / 2,
            e = a.height / 2;
        b.save();
        for (var d = this._planes, g = [0, 1, 4, 5], h = 0, m = g.length; h < m; ++h) {
            var o = d[g[h]];
            b.strokeStyle = "#FF00FF";
            h < this.last_in.length && this.last_in[h] && (b.strokeStyle = "#FFFF00");
            var u = -c,
                r = c,
                t = (-o[3] - o[0] * r) / o[2];
            b.moveTo(c + u, e + (-o[3] - o[0] * u) / o[2]);
            b.lineTo(c + r, e + t);
            b.stroke()
        }
        b.strokeStyle = "#0000FF";
        b.beginPath();
        b.arc(c + this.sphere[0], e + this.sphere[2], this.sphere[3], 0, 2 * Math.PI, !1);
        b.closePath();
        b.stroke();
        b.restore()
    };
    h.prototype.contains_box = function(a) {
        var b = 0,
            c = [];
        c[0] = a[0];
        c[1] = [a[0][0],
            a[0][1], a[1][2]
        ];
        c[2] = [a[0][0], a[1][1], a[0][2]];
        c[3] = [a[0][0], a[1][1], a[1][2]];
        c[4] = [a[1][0], a[0][1], a[0][2]];
        c[5] = [a[1][0], a[0][1], a[1][2]];
        c[6] = [a[1][0], a[1][1], a[0][2]];
        c[7] = a[1];
        for (var a = this._planes, e = 0; 6 > e; ++e) {
            for (var d = 8, g = 1, h = 0; 8 > h; ++h) - 1 === r.classifyPoint(a[e], c[h]) && (g = 0, --d);
            this.last_in[e] = g;
            if (0 === d) return -1;
            b += g
        }
        return 6 === b ? 1 : 0
    };
    return {
        Frustum: h,
        Octree: w
    }
});
CubicVR.RegisterModule("CVRXML", function(m) {
    function w(b, c, e, d) {
        var g = CubicVR.util,
            h = null,
            m = null;
        d.triangles && (m = g.intDelimArray(a.getTextNode(d, "triangles"), " "));
        if (m && (d.segments && (h = g.intDelimArray(a.getTextNode(d, "segments"), " ")), null === h && (h = [0, parseInt(m.length / 3, 10)]), d = 0, b.setFaceMaterial(c), m.length)) {
            p = 0;
            for (pMax = h.length; p < pMax; p += 2) {
                c = 3 * h[p + 1];
                b.setSegment(h[p]);
                j = d;
                for (jMax = d + c; j < jMax; j += 3) g = b.addFace([m[j], m[j + 1], m[j + 2]]), e && b.faces[g].setUV([e[j], e[j + 1], e[j + 2]]);
                d += c
            }
        }
    }

    function t(b) {
        var c =
            CubicVR.util,
            e = new CubicVR.UVMapper,
            d = null,
            n = null;
        if (b.type) switch (d = a.getTextNode(b, "type"), d) {
            case "planar":
                e.projection_mode = g.uv.projection.PLANAR;
                break;
            case "cylindrical":
                e.projection_mode = g.uv.projection.CYLINDRICAL;
                break;
            case "spherical":
                e.projection_mode = g.uv.projection.SPHERICAL;
                break;
            case "cubic":
                e.projection_mode = g.uv.projection.CUBIC
        }
        if (!d) return null;
        "uv" === d && b.uv && (n = a.getPoints(b, "uv"));
        if (b.axis) switch (a.getTextNode(b, "axis")) {
            case "x":
                e.projection_axis = g.uv.axis.X;
                break;
            case "y":
                e.projection_axis =
                    g.uv.axis.Y;
                break;
            case "z":
                e.projection_axis = g.uv.axis.Z
        }
        b.center && (e.center = c.floatDelimArray(a.getTextNode(b, "center")));
        b.rotation && (e.rotation = c.floatDelimArray(a.getTextNode(b, "rotation")));
        b.scale && (e.scale = c.floatDelimArray(a.getTextNode(b, "scale")));
        b.wrap_w && (e.wrap_w_count = parseFloat(a.getTextNode(b, "wrap_w")));
        b.wrap_h && (e.wrap_h_count = parseFloat(a.getTextNode(b, "wrap_h")));
        return "" !== d && "uv" !== d ? e : n
    }

    function h(b, f) {
        if (c[b] !== d) return c[b];
        var e = CubicVR.util,
            h, n, o, r;
        h = null;
        h = "object" ==
            typeof b ? b : -1 != b.indexOf(".js") ? e.getJSON(b) : CubicVR.util.xml2badgerfish(e.getXML(b));
        h.root && (h = h.root);
        h.properties && (h = h.properties);
        e = new CubicVR.Mesh;
        h.points && (o = a.getPoints(h, "points")) && e.addPoint(o);
        var x = h.material;
        x && !x.length && (x = [x]);
        var u = [];
        if (x) {
            h = 0;
            for (o = x.length; h < o; h++) {
                var H = x[h],
                    z;
                z = H;
                var E = f,
                    D = new CubicVR.Material({
                        name: z.name ? z.name.$ : null
                    });
                z.shininess && (D.shininess = a.getFloatNode(z, "shininess", D.shininess) / 100);
                D.opacity = a.getFloatNode(z, "alpha", D.opacity);
                D.max_smooth = a.getFloatNode(z,
                    "max_smooth", D.max_smooth);
                D.color = a.getFloatDelimNode(z, "color", D.color);
                D.ambient = a.getFloatDelimNode(z, "ambient", D.ambient);
                D.diffuse = a.getFloatDelimNode(z, "diffuse", D.diffuse);
                D.specular = a.getFloatDelimNode(z, "specular", D.specular);
                n = void 0;
                if (n = a.getTextNode(z, "texture")) n = (E ? E : "") + n, tex = m.Textures_ref[n] !== d ? m.Textures_obj[m.Textures_ref[n]] : new CubicVR.Texture(n), D.setTexture(tex, g.texture.map.COLOR);
                if (n = a.getTextNode(z, "texture_luminosity")) n = (E ? E : "") + n, tex = m.Textures_ref[n] !== d ? m.Textures_obj[m.Textures_ref[n]] :
                    new CubicVR.Texture(n), D.setTexture(tex, g.texture.map.AMBIENT);
                if (n = a.getTextNode(z, "texture_normal")) n = (E ? E : "") + n, tex = m.Textures_ref[n] !== d ? m.Textures_obj[m.Textures_ref[n]] : new CubicVR.Texture(n), D.setTexture(tex, g.texture.map.NORMAL);
                if (n = a.getTextNode(z, "texture_specular")) n = (E ? E : "") + n, tex = m.Textures_ref[n] !== d ? m.Textures_obj[m.Textures_ref[n]] : new CubicVR.Texture(n), D.setTexture(tex, g.texture.map.SPECULAR);
                if (n = a.getTextNode(z, "texture_bump")) n = (E ? E : "") + n, tex = m.Textures_ref[n] !== d ? m.Textures_obj[m.Textures_ref[n]] :
                    new CubicVR.Texture(n), D.setTexture(tex, g.texture.map.BUMP);
                if (n = a.getTextNode(z, "texture_envsphere")) n = (E ? E : "") + n, tex = m.Textures_ref[n] !== d ? m.Textures_obj[m.Textures_ref[n]] : new CubicVR.Texture(n), D.setTexture(tex, g.texture.map.ENVSPHERE);
                if (n = a.getTextNode(z, "texture_alpha")) n = (E ? E : "") + n, tex = m.Textures_ref[n] !== d ? m.Textures_obj[m.Textures_ref[n]] : new CubicVR.Texture(n), D.setTexture(tex, g.texture.map.ALPHA);
                z = D;
                var v = null;
                n = E = null;
                H.uvmapper && ((E = t(H.uvmapper)) && !E.length ? u.push([E, z]) : n = E);
                (D = H.part) &&
                !D.length && (D = [D]);
                if (D && D.length) {
                    var y = null,
                        A = null;
                    n = 0;
                    for (r = D.length; n < r; n++) {
                        var C = D[n],
                            y = null;
                        if (v = C.uvmapper) y = t(v), H.triangles && (A = v = e.faces.length, y && !y.length ? (w(e, z, null, C), A = e.faces.length - 1, e.calcFaceNormals(v, A), y.apply(e, z, d, v, A)) : y && y.length ? w(e, z, y, C) : E && !E.length && (w(e, z, null, C), A = e.faces.length - 1, e.calcFaceNormals(v, A), E.apply(e, z, d, v, A)));
                        if (C.procedural) {
                            (v = C.uvmapper) && (y = t(v));
                            var A = C.transform ? a.getTransform(C.transform) : d,
                                v = d,
                                C = C.procedural,
                                G = a.getTextNode(C, "type");
                            A && (v =
                                new CubicVR.Transform, v.translate(A.position), v.pushMatrix(), v.rotate(A.rotation), v.pushMatrix(), v.scale(A.scale));
                            E || (E = d);
                            y = {
                                material: z,
                                uvmapper: E || y
                            };
                            if ("box" === G || "cube" === G) y.size = a.getFloatNode(C, "size"), e.booleanAdd(CubicVR.primitives.box(y), v);
                            else if ("sphere" === G) y.radius = a.getFloatNode(C, "radius"), y.lat = a.getIntNode(C, "lat"), y.lon = a.getIntNode(C, "lon"), e.booleanAdd(CubicVR.primitives.sphere(y), v);
                            else if ("cone" === G) y.base = a.getFloatNode(C, "base"), y.height = a.getFloatNode(C, "height"), y.lon =
                                a.getIntNode(C, "lon"), e.booleanAdd(CubicVR.primitives.cone(y), v);
                            else if ("plane" === G) y.size = a.getFloatNode(C, "size"), e.booleanAdd(CubicVR.primitives.plane(y), v);
                            else if ("cylinder" === G) y.radius = a.getFloatNode(C, "radius"), y.height = a.getFloatNode(C, "height"), y.lon = a.getIntNode(C, "lon"), e.booleanAdd(CubicVR.primitives.cylinder(y), v);
                            else if ("torus" === G) y.innerRadius = a.getFloatNode(C, "innerRadius"), y.outerRadius = a.getFloatNode(C, "outerRadius"), y.lat = a.getIntNode(C, "lat"), y.lon = a.getIntNode(C, "lon"), e.booleanAdd(CubicVR.primitives.torus(y),
                                v);
                            else if ("lathe" === G) y.points = a.getPoints(C, "p"), y.lon = a.getIntNode(C, "lon"), e.booleanAdd(CubicVR.primitives.lathe(y), v);
                            else if ("polygon" === G) {
                                A = a.getPoints(C, "p");
                                A = new CubicVR.Polygon(A);
                                (G = C.cut) && !G.length && (G = [G]);
                                if (G.length) {
                                    n = 0;
                                    for (o = G.length; n < r; n++) A.cut(new CubicVR.Polygon(a.getPoints(G[n])))
                                }
                                y.front = 0;
                                y.back = 0;
                                y.frontShift = 0;
                                y.backShift = 0;
                                y.frontDepth = 0;
                                y.backDepth = 0;
                                if (C.extrude && (C = C.extrude, y.front = a.getFloatNode(C, "front", 0), y.back = a.getFloatNode(C, "back", 0), y.frontShift = a.getFloatNode(C,
                                        "frontBevelShift", 0), y.backShift = a.getFloatNode(C, "backBevelShift", 0), y.frontDepth = a.getFloatNode(C, "frontBevelDepth", 0), y.backDepth = a.getFloatNode(C, "backBevelDepth", 0), y.depth = a.getFloatNode(C, "depth", 0), y.shift = a.getFloatNode(C, "shift", 0), y.bevel = a.getFloatNode(C, "bevel", 0), y.depth && (!y.backDepth && !y.frontDepth) && (y.front = -y.depth / 2, y.back = y.depth / 2), y.shift && (!y.backShift && !y.frontShift) && (y.frontShift = y.shift, y.backShift = y.shift), y.bevel && !y.backDepth && !y.frontDepth)) y.frontDepth = y.bevel, y.backDepth =
                                    y.bevel;
                                C = A.toExtrudedBeveledMesh(new CubicVR.Mesh, y);
                                C.setFaceMaterial(y.material);
                                e.booleanAdd(C, v)
                            }
                        }
                    }
                } else w(e, z, n, H)
            }
        }
        e.triangulateQuads();
        e.calcNormals();
        h = 0;
        for (o = u.length; h < o; h++) u[h][0].apply(e, u[h][1]);
        e.compile();
        return c[b] = e
    }

    function o(a) {
        return null === a ? !1 : a.getElementsByTagName("x").length || a.getElementsByTagName("y").length || a.getElementsByTagName("z").length || a.getElementsByTagName("fov").length
    }

    function r(a, c, e) {
        var h = CubicVR.util,
            n = [];
        n[0] = a.getElementsByTagName("x");
        n[1] = a.getElementsByTagName("y");
        n[2] = a.getElementsByTagName("z");
        n[3] = a.getElementsByTagName("fov");
        var m, o, r, u, t, z;
        for (z in n)
            if (n.hasOwnProperty(z) && n[z] !== d && n[z].length) {
                m = n[z][0].getElementsByTagName("time");
                o = n[z][0].getElementsByTagName("value");
                r = n[z][0].getElementsByTagName("in");
                u = n[z][0].getElementsByTagName("out");
                t = n[z][0].getElementsByTagName("tcb");
                var w = null,
                    D = null,
                    v = null,
                    y = a = null;
                r.length && (a = h.collectTextNode(r[0]));
                u.length && (y = h.collectTextNode(u[0]));
                m.length && (w = h.floatDelimArray(h.collectTextNode(m[0]), " "));
                o.length && (D = h.floatDelimArray(h.collectTextNode(o[0]), " "));
                t.length && (v = h.floatDelimArray(h.collectTextNode(t[0]), " "));
                if (null !== w && null !== D) {
                    m = 0;
                    for (o = w.length; m < o; m++) r = e.setKey(c, z, w[m], D[m]), v && (r.tension = v[3 * m], r.continuity = v[3 * m + 1], r.bias = v[3 * m + 2])
                }
                D = w = g.envelope.behavior.CONSTANT;
                if (a) switch (a) {
                    case "reset":
                        w = g.envelope.behavior.RESET;
                        break;
                    case "constant":
                        w = g.envelope.behavior.CONSTANT;
                        break;
                    case "repeat":
                        w = g.envelope.behavior.REPEAT;
                        break;
                    case "oscillate":
                        w = g.envelope.behavior.OSCILLATE;
                        break;
                    case "offset":
                        w = g.envelope.behavior.OFFSET;
                        break;
                    case "linear":
                        w = g.envelope.behavior.LINEAR
                }
                if (y) switch (y) {
                    case "reset":
                        D = g.envelope.behavior.RESET;
                        break;
                    case "constant":
                        D = g.envelope.behavior.CONSTANT;
                        break;
                    case "repeat":
                        D = g.envelope.behavior.REPEAT;
                        break;
                    case "oscillate":
                        D = g.envelope.behavior.OSCILLATE;
                        break;
                    case "offset":
                        D = g.envelope.behavior.OFFSET;
                        break;
                    case "linear":
                        D = g.envelope.behavior.LINEAR
                }
                e.setBehavior(c, z, w, D)
            }
    }
    var d = m.undef,
        g = CubicVR.enums,
        c = [],
        a = {
            getPoints: function(b, c, e) {
                b = c ?
                    a.getTextNode(b, c) : b.$;
                if (!b) return d;
                b = b.split(" ");
                i = 0;
                for (iMax = b.length; i < iMax; i++) {
                    b[i] = b[i].split(",");
                    j = 0;
                    for (jMax = b[i].length; j < jMax; j++) b[i][j] = parseFloat(b[i][j]);
                    e && (b[i][2] = 0)
                }
                return b
            },
            getTransform: function(a) {
                var c = CubicVR.util;
                if (!a) return null;
                var e = {
                        position: [0, 0, 0],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1]
                    },
                    d;
                postition = a.position;
                d = a.rotation;
                a = a.scale;
                d && (e.rotation = c.floatDelimArray(d.$));
                a && (e.scale = c.floatDelimArray(a.$));
                return d || a ? e : null
            },
            getTextNode: function(a, c, e) {
                a = a[c];
                if (!a) return e;
                a.length && (a = a[0]);
                return a.$ ? a.$ : e
            },
            getFloatNode: function(b, c, e) {
                return (b = a.getTextNode(b, c)) ? (b = parseFloat(b), b != b ? e : b) : e
            },
            getIntNode: function(b, c, e) {
                return (b = a.getTextNode(b, c)) ? (b = parseInt(b, 10), b != b ? e : b) : e
            },
            getFloatDelimNode: function(b, c, e, d) {
                var g = CubicVR.util;
                return (b = a.getTextNode(b, c)) ? g.floatDelimArray(b, d) : e
            },
            getIntDelimNode: function(b, c, e, d) {
                var g = CubicVR.util;
                return (b = a.getTextNode(b, c)) ? g.intDelimArray(b, d) : e
            }
        };
    return {
        loadMesh: h,
        loadScene: function(a, c, e) {
            var m = CubicVR.util;
            c === d && (c =
                "");
            e === d && (e = "");
            for (var n = new CubicVR.Mesh, s = m.getXML(a), a = new CubicVR.Scene, t = [], x = s.getElementsByTagName("sceneobjects"), u, w, z, E = 0, D = x[0].childNodes.length; E < D; E++) {
                var v = x[0].childNodes[E];
                if ("sceneobject" === v.tagName) {
                    var y = "unnamed",
                        A = "",
                        C = "",
                        n = v.getElementsByTagName("name");
                    n.length && (y = m.collectTextNode(n[0]));
                    n = v.getElementsByTagName("parent");
                    n.length && (A = m.collectTextNode(n[0]));
                    n = v.getElementsByTagName("model");
                    n.length && (C = m.collectTextNode(n[0]));
                    z = w = u = null;
                    n = v.getElementsByTagName("position");
                    n.length && (u = n[0]);
                    n = v.getElementsByTagName("rotation");
                    n.length && (w = n[0]);
                    n = v.getElementsByTagName("scale");
                    n.length && (z = n[0]);
                    n = null;
                    "" !== C && (n = h(c + C, e));
                    n = new CubicVR.SceneObject(n, y);
                    o(u) ? (n.motion || (n.motion = new CubicVR.Motion), r(u, g.motion.POS, n.motion)) : u && (n.position = m.floatDelimArray(m.collectTextNode(u)));
                    o(w) ? (n.motion || (n.motion = new CubicVR.Motion), r(w, g.motion.ROT, n.motion)) : n.rotation = m.floatDelimArray(m.collectTextNode(w));
                    o(z) ? (n.motion || (n.motion = new CubicVR.Motion), r(z, g.motion.SCL,
                        n.motion)) : n.scale = m.floatDelimArray(m.collectTextNode(z));
                    a.bindSceneObject(n);
                    "" !== A && t.push([n, A])
                }
            }
            for (var G in t) t.hasOwnProperty(G) && a.getSceneObject(t[G][1]).bindChild(t[G][0]);
            c = s.getElementsByTagName("camera");
            c.length && ((w = u = null, e = "", n = c[0].getElementsByTagName("name"), G = a.camera, s = null, n.length && (e = n[0].firstChild.nodeValue), n = c[0].getElementsByTagName("target"), n.length && (e = n[0].firstChild.nodeValue), "" !== e && (G.targetSceneObject = a.getSceneObject(e)), n = c[0].getElementsByTagName("position"),
                n.length && (u = n[0]), n = c[0].getElementsByTagName("rotation"), n.length && (w = n[0]), n = c[0].getElementsByTagName("fov"), n.length && (s = n[0]), o(u) ? (G.motion || (G.motion = new CubicVR.Motion), r(u, g.motion.POS, G.motion)) : u && (G.position = m.floatDelimArray(u.firstChild.nodeValue)), o(w) ? (G.motion || (G.motion = new CubicVR.Motion), r(w, g.motion.ROT, G.motion)) : w && (G.rotation = m.floatDelimArray(w.firstChild.nodeValue)), o(s)) ? (G.motion || (G.motion = new CubicVR.Motion), r(s, g.motion.FOV, G.motion)) : s && (G.fov = parseFloat(s.firstChild.nodeValue)));
            return a
        }
    }
});
CubicVR.RegisterModule("Worker", function(m) {
    function w(a) {
        var b = this;
        this.message = a.message || function() {};
        this.send = function(a, b) {
            postMessage({
                message: a,
                data: b
            })
        };
        self.addEventListener("message", function(a) {
            "init" !== a.data.message && b.message(a.data)
        }, !1)
    }

    function t(a) {
        function b(a) {
            setTimeout(function() {
                c.send("test", a)
            }, 1E3)
        }
        a && b(a);
        var c = new w({
            message: b
        })
    }

    function h(a) {
        function b(a) {
            a = s.getURL(a);
            c.send("done", a.length)
        }
        var c;
        c = new w({
            message: function(a) {
                b(a)
            }
        });
        a && b(a)
    }

    function o(a) {
        function b(a) {
            a = s.getURL(a);
            c.send("loaded", a)
        }
        var c, e;
        c = new w({
            message: function(a) {
                if ("parse" === a.message) e = new n, CubicVR.loadCollada("", "", e, a.data), c.send("parsed");
                else if ("getMesh" === a.message) {
                    if (a = e.meshMap[":" + a.data]) {
                        var b = a.triangulateQuads().compileVBO(a.compileMap());
                        c.send("getMesh", {
                            mesh: a,
                            vbo: b
                        })
                    }
                } else throw Error("Not a SceneFileWorker command: " + a.message);
            }
        });
        a && b(a)
    }

    function r(a) {
        function b(a) {
            var d = new c,
                g;
            for (g in a) a.hasOwnProperty(g) && (d[g] = a[g]);
            a = d.triangulateQuads().compileVBO(d.compileMap());
            e.send("done",
                a)
        }
        var e;
        e = new w({
            message: function(a) {
                b(a)
            }
        });
        a && b(a)
    }
    try {
        window || (self.window = self, self.document = {}, self.fakeWindow = !0, self.console = {
            log: function() {}
        })
    } catch (d) {
        self.window = self, self.document = {}, self.fakeWindow = !0, self.console = {
            log: function() {}
        }
    }
    var g = m.undef,
        c = CubicVR.Mesh,
        a = CubicVR.Texture,
        b = CubicVR.Material,
        f = CubicVR.SceneObject,
        e = CubicVR.Motion,
        q = CubicVR.Envelope,
        n = CubicVR.DeferredBin,
        s = CubicVR.util;
    return {
        Worker: function(a) {
            this.worker = new Worker(CubicVR.getScriptLocation() + "CubicVR.js");
            this.message =
                a.message || function() {};
            this.error = a.error || function(a) {
                console.log("Error: " + a.message + ": " + a.lineno)
            };
            this.type = a.type;
            var b = this;
            this.worker.onmessage = function(a) {
                b.message(a.data)
            };
            this.worker.onerror = function(a) {
                b.error(a)
            };
            this.init = function(a) {
                b.send("init", {
                    type: b.type,
                    data: a
                })
            };
            this.send = function(a, c) {
                b.worker.postMessage({
                    message: a,
                    data: c
                })
            };
            this.send("CubicVR_InitWorker", CubicVR.getScriptLocation());
            (a.data || a.autoStart) && b.init(a.data)
        },
        ResourcePool: function() {
            function e(a) {
                var b = a.parsed ||
                    function() {},
                    d = {},
                    g;
                a.url.match(/\.dae/) && (g = new CubicVR.Worker({
                    type: "sceneFile",
                    data: a.url,
                    message: function(a) {
                        if ("loaded" === a.message) {
                            var a = (new DOMParser).parseFromString(a.data, "text/xml"),
                                e = s.xml2badgerfish(a);
                            console.log(a);
                            g.send("parse", e)
                        } else if ("getMesh" === a.message) {
                            var e = new c,
                                f;
                            for (f in a.data.mesh) a.data.mesh.hasOwnProperty(f) && (e[f] = a.data.mesh[f]);
                            e.bindBuffer(e.bufferVBO(a.data.vbo));
                            d.getMesh && d.getMesh(e)
                        } else "parsed" === a.message && b()
                    }
                }));
                this.getSceneObject = function(a, b) {
                    g.send("getMesh",
                        a);
                    d.getMesh = b
                }
            }

            function d(a, b) {
                for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
                return b
            }
            var g = this,
                h = {};
            this.createSceneFileManager = function(a) {
                var b = new e({
                    url: a.url,
                    parsed: a.parsed
                });
                return h[a.url] = b
            };
            this.removeSceneFileManager = function(a) {
                if ("string" === typeof settings) delete h[settings];
                else
                    for (var b in h) h[b] === a && delete h[b]
            };
            this.createSceneObjectFromMesh = function(e) {
                var h = e.scene,
                    n = e.object,
                    m = e.assetBase || "",
                    o = g.createSceneFileManager({
                        url: e.mesh,
                        parsed: function() {
                            n && o.getSceneObject(n,
                                function(e) {
                                    for (var e = d(e, new c), g = 0, n = e.materials.length; g < n; ++g) {
                                        for (var o = d(e.materials[g], new b), q = 0, u = o.textures.length; q < u; ++q) {
                                            var r = o.textures[g];
                                            o.textures[g] = new a(m + r.img_path, r.filter_type)
                                        }
                                        e.materials[g] = o
                                    }
                                    e = new f(e);
                                    h.bindSceneObject(e)
                                })
                        }
                    })
            };
            this.loadFile = function(a, b) {
                b = b || function() {};
                new CubicVR.Worker({
                    type: "file",
                    data: mesh,
                    message: function(a) {
                        b(a.data)
                    }
                })
            }
        },
        loadColladaWorker: function(d, h, n, m) {
            var o;
            try {
                o = new Worker(CubicVR.getScriptLocation() + "collada.js")
            } catch (r) {
                throw Error("Can't find collada.js");
            }
            var s = [],
                t = [];
            o.onmessage = function(h) {
                function o(a, b) {
                    for (var c in a) b[c] = a[c]
                }

                function r(a) {
                    if (a.motion) {
                        for (var b = a.motion.controllers, c = [], d = 0, g = b.length; d < g; ++d) {
                            var f = b[d];
                            if (f) {
                                for (var h = [], n = 0, m = f.length; n < m; ++n) {
                                    var u = f[n];
                                    if (u) {
                                        var s = u.keys[0];
                                        1 < u.keys.length && (s.prev = null, s.next = u.keys[1], s = u.keys[1]);
                                        for (var t = 1, v = u.keys.length - 1; t < v; ++t) s.prev = u.keys[t - 1], s.next = u.keys[t + 1], s = u.keys[t + 1];
                                        1 < u.keys.length && (s = u.keys[u.keys.length - 1], s.prev = u.keys[u.keys.length - 2], s.next = null);
                                        u.firstKey =
                                            u.keys[0];
                                        u.lastKey = u.keys[u.keys.length - 1];
                                        u.keys = u.firstKey;
                                        s = new q;
                                        o(u, s);
                                        h[n] = s
                                    } else f[n] = null
                                }
                                c[d] = h
                            } else b[d] = null
                        }
                        a.motion.controllers = c;
                        b = new e;
                        o(a.motion, b);
                        a.motion = b
                    }
                }

                function x(a) {
                    var b = new f;
                    o(a, b);
                    if (null !== a.obj) {
                        var e = t[a.obj.id];
                        if (e === g)
                            if (e = new c, o(a.obj, e), b.obj = e, t[a.obj.id] = e, m) {
                                if (0 < e.points.length) {
                                    m.addMesh(d, d + ":" + e.id, e);
                                    for (var h = 0, n = e.faces.length; h < n; ++h) {
                                        var q = e.faces[h],
                                            u = q.material;
                                        q.material = s[u] !== g ? s[u] : 0
                                    }
                                }
                            } else b.obj.triangulateQuads(), b.obj.calcNormals(), b.obj.compile(),
                                b.obj.clean();
                        else b.obj = e
                    }
                    b.trans = new Transform;
                    if (a.children && 0 < a.children.length && (b.children = [], a.children)) {
                        e = 0;
                        for (h = a.children.length; e < h; ++e) n = x(a.children[e]), b.bindChild(n)
                    }
                    return b
                }
                var z;
                z = h.data.message;
                if ("materials" == z) {
                    var w = JSON.parse(h.data.data),
                        h = 0;
                    for (z = w.length; h < z; ++h) {
                        var E = new b(w[h].name),
                            K = E.material_id;
                        o(w[h], E);
                        E.material_id = K;
                        s[w[h].material_id] = K;
                        for (var K = 0, M = w[h].textures.length; K < M; ++K) {
                            var L = w[h].textures[K];
                            if (L) {
                                var N = Texture_ref[L.img_path];
                                N === g ? (L = new a(L.img_path,
                                    L.filter_type, m, d), E.textures[K] = L) : E.textures[K] = Textures_obj[N]
                            } else E.textures[K] = 0
                        }
                    }
                } else if ("scene" == z) {
                    w = JSON.parse(h.data.data);
                    h = 0;
                    for (z = w.sceneObjects.length; h < z; ++h) E = w.sceneObjects[h], null !== E.obj && nop(), E.reassembled === g && (r(E), E.reassembled = !0), w.sceneObjects[h] = x(E);
                    E = new Scene;
                    h = E.camera;
                    z = h.transform;
                    o(w.camera, h);
                    o(w.camera.transform, z);
                    r(h);
                    E.camera = h;
                    E.camera.transform = z;
                    E.camera.frustum = new Frustum;
                    h = 0;
                    for (z = w.sceneObjects.length; h < z; ++h) {
                        K = w.sceneObjects[h];
                        E.bindSceneObject(K);
                        try {
                            K.getAABB()
                        } catch (Y) {}
                    }
                    h = 0;
                    for (z = w.lights.length; h < z; ++h) K = new Light, o(w.lights[h], K), K.trans = new Transform, r(K), E.bindLight(K);
                    n(E)
                } else console.log("message from collada worker:", h.data.message)
            };
            o.onerror = function(a) {
                console.log("error from collada worker:", a.message)
            };
            o.postMessage({
                message: "start",
                params: {
                    meshUrl: d,
                    prefix: h,
                    rootDir: CubicVR.getScriptLocation()
                }
            })
        },
        InitWorker: function() {
            var a = {
                test: t,
                prepareMesh: r,
                file: h,
                sceneFile: o
            };
            self.addEventListener("message", function(b) {
                if ("init" ===
                    b.data.message) {
                    var c = b.data.data.type;
                    if (c in a) new a[c](b.data.data.data);
                    else throw Error("Invalid worker type.");
                }
            }, !1)
        }
    }
});
CubicVR.RegisterModule("Polygon", function(m) {
    function w(a) {
        var b = [],
            c = a.length;
        if (3 > c) return null;
        var d = [],
            g;
        g = a.length;
        for (var h = 0, m = g - 1, o = 0; o < g; m = o++) h += a[m][0] * a[o][1] - a[o][0] * a[m][1];
        if (0 < 0.5 * h)
            for (g = 0; g < c; g++) d[g] = g;
        else
            for (g = 0; g < c; g++) d[g] = c - 1 - g;
        o = 2 * c;
        h = 0;
        for (g = c - 1; 2 < c;) {
            if (0 >= o--) return null;
            var r = g;
            c <= r && (r = 0);
            g = r + 1;
            c <= g && (g = 0);
            m = g + 1;
            c <= m && (m = 0);
            var t;
            a: {
                t = a;
                var w = r,
                    v = g,
                    y = m,
                    A = c,
                    C = d,
                    G = void 0,
                    B = void 0,
                    I = void 0,
                    J = void 0,
                    K = void 0,
                    M = void 0,
                    L = void 0,
                    N = void 0,
                    Y = void 0,
                    B = t[C[w]][0],
                    I = t[C[w]][1],
                    J = t[C[v]][0],
                    K = t[C[v]][1],
                    M = t[C[y]][0],
                    L = t[C[y]][1];
                if (f > (J - B) * (L - I) - (K - I) * (M - B)) t = !1;
                else {
                    for (G = 0; G < A; G++)
                        if (!(G == w || G == v || G == y)) {
                            var N = t[C[G]][0],
                                Y = t[C[G]][1],
                                ca = void 0,
                                U = void 0,
                                na = void 0,
                                Q = void 0,
                                O = void 0,
                                Ma = void 0,
                                gb = void 0,
                                hb = void 0,
                                Na = void 0,
                                qb = void 0,
                                Oa = void 0,
                                ib = void 0,
                                ca = na = O = void 0,
                                ca = M - J,
                                U = L - K,
                                na = B - M,
                                Q = I - L,
                                O = J - B,
                                Ma = K - I,
                                gb = N - B,
                                hb = Y - I,
                                Na = N - J,
                                qb = Y - K,
                                Oa = N - M,
                                ib = Y - L,
                                ca = ca * qb - U * Na,
                                O = O * hb - Ma * gb,
                                na = na * ib - Q * Oa;
                            if (0 <= ca && 0 <= na && 0 <= O) {
                                t = !1;
                                break a
                            }
                        }
                    t = !0
                }
            }
            if (t) {
                o = d[r];
                r = d[g];
                m = d[m];
                b.push(o);
                b.push(r);
                b.push(m);
                h++;
                m = g;
                for (o = g + 1; o < c; m++, o++) d[m] = d[o];
                c--;
                o = 2 * c
            }
        }
        return b
    }

    function t(a, c, d) {
        d === b && (d = 0);
        var g;
        g = w(c);
        var f = CubicVR.util.repackArray(g, 3, g.length / 3),
            h = [],
            m = a.points.length;
        g = 0;
        for (iMax = c.length; g < iMax; g++) h.push([c[g][0], c[g][1], d]);
        a.addPoint(h);
        g = 0;
        for (iMax = f.length; g < iMax; g++) a.addFace([f[g][0] + m, f[g][1] + m, f[g][2] + m])
    }

    function h(a, b) {
        var c = b[0] - a[0],
            d = b[1] - a[1];
        return Math.sqrt(c * c + d * d)
    }

    function o(a, b) {
        var c, d, g = [],
            f = a.length,
            m = b.length,
            o = [];
        for (c = 0; c < f; c++)
            for (d = 0; d < m; d++) {
                var r = h(a[c],
                    b[d]);
                g.push([r, c, d])
            }
        g.sort(function(a, b) {
            return a[0] > b[0]
        });
        for (c = 0; 5 > c; c++)
            for (d = 0; d < g.length; d++) c != d && g[c][1] != g[d][1] && g[c][2] != g[d][2] && g[c][1] < g[d][1] && g[c][2] < g[d][2] && 4 > Math.abs(g[c][1] - g[d][1]) && 4 > Math.abs(g[c][2] - g[d][2]) && o.push([c, d]);
        o.sort(function(a, b) {
            return g[a[0]][0] + g[a[1]][0] > g[b[0]][0] + g[b[1]][0]
        });
        10 < o.length && (o.length = 10);
        d = [];
        for (c = 0; c < o.length; c++) d.push([g[o[c][0]], g[o[c][1]]]);
        return d
    }

    function r(a, b) {
        var c = o(a, b),
            d;
        if (!c.length) return null;
        d = c[0][0];
        var g = c[0][1],
            c =
            g[1] - d[1],
            g = g[2] - d[2],
            f = a.slice(d[1]),
            f = f.concat(a.slice(0, d[1])),
            h = b.slice(d[2]),
            h = h.concat(b.slice(0, d[2])),
            m = [];
        for (d = c; d < f.length; d++) m.push(f[d]);
        m.push(f[0]);
        for (d = g; d < h.length; d++) m.push(h[d]);
        m.push(h[0]);
        var r = [];
        for (d = 0; d <= c; d++) r.push(f[d]);
        for (d = 0; d <= g; d++) r.push(h[d]);
        return [m, r]
    }

    function d(a) {
        for (var b = [0, 0], c = 0; c < a.length; c++) b[0] += a[c][0], b[1] += a[c][1];
        b[0] /= a.length;
        b[1] /= a.length;
        return b
    }

    function g(a, b, c) {
        for (var d = [], g = 0; g < a.length; g++) {
            var f = [a[g][0] - b[0], a[g][1] - b[1]],
                h = Math.sqrt(f[0] *
                    f[0] + f[1] * f[1]) + c,
                f = Math.atan2(f[1], f[0]);
            d[g] = [b[0] + Math.cos(f) * h, b[1] + Math.sin(f) * h]
        }
        return d
    }

    function c(a, b, c, d, g) {
        var f, h = a.points.length;
        if (b.length != c.length) return null;
        var m = b.length;
        for (f = 0; f < m; f++) a.addPoint([b[f][0], b[f][1], d]);
        for (f = 0; f < m; f++) a.addPoint([c[f][0], c[f][1], g]);
        for (f = 0; f < m - 1; f++) a.addFace([h + f, h + f + 1, h + (f + m + 1), h + (f + m)]);
        f = m - 1;
        a.addFace([h + f, h, h + m, h + (f + m)])
    }

    function a(a) {
        this.points = a;
        this.cuts = [];
        this.result = []
    }
    var b = m.undef,
        f = 1.0E-10;
    a.prototype = {
        cut: function(a) {
            this.cuts.push(a)
        },
        toMesh: function(a) {
            if (0 !== this.points.length) {
                var b;
                a || (a = new CubicVR.Mesh);
                this.result = [this.points];
                for (b = 0; b < this.cuts.length; b++) {
                    var c = this.cuts[b].points.slice(0),
                        c = c.reverse(),
                        c = r(this.result[0], c);
                    this.result[0] = c[0];
                    this.result.push(c[1])
                }
                for (b = 0; b < this.result.length; b++) t(a, this.result[b]);
                a.removeDoubles();
                return a
            }
        },
        toExtrudedMesh: function(a, d, g) {
            if (0 !== this.points.length) {
                var f, h;
                d === b && (d = 0);
                g === b && (g = 0);
                var m = d != g;
                a || (a = new CubicVR.Mesh);
                this.result = [this.points];
                for (h = 0; h < this.cuts.length; h++) f =
                    this.cuts[h].points.slice(0), f = f.reverse(), f = r(this.result[0], f), this.result[0] = f[0], this.result.push(f[1]);
                f = new CubicVR.Mesh;
                for (h = 0; h < this.result.length; h++) t(f, this.result[h], g);
                a.booleanAdd(f);
                f.flipFaces();
                if (m)
                    for (h = 0; h < f.points.length; h++) f.points[h][2] = d;
                a.booleanAdd(f);
                if (m) {
                    c(a, this.points, this.points, d, g);
                    for (h = 0; h < this.cuts.length; h++) f = this.cuts[h].points.slice(0), f = f.reverse(), c(a, f, f, d, g)
                }
                a.removeDoubles();
                return a
            }
        },
        toExtrudedBeveledMesh: function(a, b, f, h, m, o, u) {
            var w = [],
                z = [],
                E, D,
                v, y;
            if (0 !== this.points.length) {
                "object" === typeof b && (u = b, b = u.front || 0, f = u.back || 0, h = u.frontDepth || 0, m = u.frontShift || 0, o = u.backDepth || 0, u = u.backShift || 0);
                var A = b !== f,
                    C = 0 !== o,
                    G = 0 !== h;
                a || (a = new CubicVR.Mesh);
                G ? (D = d(this.points), D = g(this.points, D, -m), this.result = [D.slice(0)]) : this.result = [this.points.slice(0)];
                for (y = 0; y < this.cuts.length; y++) v = d(this.cuts[y].points), v = g(this.cuts[y].points, v, m), v = v.reverse(), w.push(v), v = r(this.result[0], v), this.result[0] = v[0], this.result.push(v[1]);
                m = new CubicVR.Mesh;
                for (y = 0; y < this.result.length; y++) t(m, this.result[y], b - h);
                m.flipFaces();
                a.booleanAdd(m);
                if (C || G) {
                    E = d(this.points);
                    E = g(this.points, E, -u);
                    this.result = [E.slice(0)];
                    for (y = 0; y < this.cuts.length; y++) v = d(this.cuts[y].points), v = g(this.cuts[y].points, v, u), v = v.reverse(), z.push(v), v = r(this.result[0], v), this.result[0] = v[0], this.result.push(v[1]);
                    m = new CubicVR.Mesh;
                    for (y = 0; y < this.result.length; y++) t(m, this.result[y], f + o)
                } else {
                    for (y = 0; y < m.points.length; y++) m.points[y][2] = f;
                    m.flipFaces()
                }
                a.booleanAdd(m);
                G && c(a, D,
                    this.points, b - h, b);
                A && c(a, this.points, this.points, b, f);
                C && c(a, this.points, E, f, f + o);
                for (y = 0; y < w.length; y++) v = this.cuts[y].points.slice(0).reverse(), G && c(a, w[y], v, b - h, b), A && c(a, v, v, b, f), C && c(a, v, z[y], f, f + o);
                a.removeDoubles();
                return a
            }
        }
    };
    return {
        polygon: {
            triangulate2D: w,
            toMesh: t,
            findNearPair: function(a, b) {
                for (var c = [0, 0], d = h(a[0], b[0]), g = a.length, f = b.length, m = 0; m < g; m++)
                    for (var o = 0; o < f; o++) {
                        var r = h(a[m], b[o]);
                        r < d && (c[0] = m, c[1] = o, d = r)
                    }
                return c
            },
            subtract: r,
            addOffset: function(a, b) {
                for (var c = [], d = 0, g = a.length; d <
                    g; d++) {
                    var f = a[d];
                    c.push([f[0] + b[0], f[1] + b[1]])
                }
                return c
            },
            normal: function(a) {
                for (var b = [0, 0, 0], c = 0, d = a.length; c < d; c++) {
                    var g = a[c],
                        f = a[(c + 1) % d];
                    b[0] += (g[1] - f[1]) * (g[2] + f[2]);
                    b[1] += (g[2] - f[2]) * (g[0] + f[0]);
                    b[2] += (g[0] - f[0]) * (g[1] + f[1])
                }
                return m.vec3.normalize(b)
            }
        },
        Polygon: a
    }
});
CubicVR.RegisterModule("ScenePhysics", function(m) {
    function w(a, b) {
        b.setX(a[0]);
        b.setY(a[1]);
        b.setZ(a[2])
    }

    function t(a, b) {
        b.setX(a.x);
        b.setY(a.y);
        b.setZ(a.z);
        b.setW(a.w)
    }

    function h(a, b) {
        b.x = a.x();
        b.y = a.y();
        b.z = a.z();
        b.w = a.w()
    }

    function o(a) {
        return new Ammo.btVector3(a[0], a[1], a[2])
    }

    function r(a) {
        var b = new Ammo.btQuaternion;
        b.setEulerZYX(a[2] * (Math.PI / 180), a[1] * (Math.PI / 180), a[0] * (Math.PI / 180));
        return b
    }

    function d(a) {
        return [a.x(), a.y(), a.z()]
    }

    function g(a) {
        this.setManifold(a)
    }
    var c = m.undef,
        a = m.enums;
    a.physics = {
        body: {
            STATIC: 0,
            DYNAMIC: 1,
            GHOST: 2,
            SOFT: 3
        },
        constraint: {
            P2P: 0
        },
        collision_flags: {
            STATIC_OBJECT: 1,
            KINEMATIC_OBJECT: 2,
            NO_CONTACT_RESPONSE: 4,
            CUSTOM_MATERIAL_CALLBACK: 8,
            CHARACTER_OBJECT: 16,
            DISABLE_VISUALIZE_OBJECT: 32
        },
        rigid_flags: {
            DISABLE_WORLD_GRAVITY: 1
        },
        collision_types: {
            COLLISION_OBJECT: 1,
            RIGID_BODY: 2,
            GHOST_OBJECT: 3,
            SOFT_BODY: 4,
            HF_FLUID: 5
        },
        collision_states: {
            ACTIVE_TAG: 1,
            ISLAND_SLEEPING: 2,
            WANTS_DEACTIVATION: 3,
            DISABLE_DEACTIVATION: 4,
            DISABLE_SIMULATION: 5
        }
    };
    var b, f, e, q, n, s = function(a, b, c) {
        var e;
        !a.position && a.sceneObject && (e = a, a = a.sceneObject, b = e.properties, c = e.collision);
        e = m.get(e) || {};
        this.properties = new m.RigidProperties(b ? m.get(b) : {
            collision: c
        });
        this.collisionEvents = [];
        this.parent = null;
        this.init_position = a.position.slice(0);
        this.init_rotation = a.rotation.slice(0);
        this.init_linearVelocity = this.linearVelocity = e.linearVelocity || [0, 0, 0];
        this.init_angularVelocity = this.angularVelocity = e.angularVelocity || [0, 0, 0];
        this.init_impulse = this.impulse = e.impulse || [0, 0, 0];
        this.init_impulsePosition = this.impulsePosition =
            e.impulsePosition || [0, 0, 0];
        this.collision_flags = this.rigid_flags = null;
        this.sceneObject = a;
        this.transform = new Ammo.btTransform;
        this.transform.setIdentity();
        this.transform.setOrigin(o(this.init_position));
        this.transform.setRotation(r(this.init_rotation));
        this.shape = null;
        this.motionState = new Ammo.btDefaultMotionState(this.transform);
        this.localInertia = new Ammo.btVector3(0, 0, 0);
        this.ghost = this.body = this.bodyInit = null;
        this.noDeactivate = !1
    };
    s.prototype = {
        getProperties: function() {
            return this.properties
        },
        getSceneObject: function() {
            return this.sceneObject
        },
        getInitialPosition: function() {
            return this.init_position
        },
        getInitialRotation: function() {
            return this.init_rotation
        },
        setInitialPosition: function() {
            this.init_position = init_position_in
        },
        setInitialRotation: function() {
            this.init_rotation = init_rotation_in
        },
        getType: function() {
            return this.properties.type
        },
        getMass: function() {
            return this.properties.mass
        },
        getRestitution: function() {
            return this.properties.restitution
        },
        getCollisionMap: function() {
            return this.properties.collision
        },
        setMass: function(a) {
            this.properties.mass =
                a;
            this.body && this.body.setMassProps(a, this.localInertia)
        },
        setRestitution: function(a) {
            this.restitution = a
        },
        getBody: function() {
            if (!this.body && !this.ghost) {
                var b = this.getCollisionShape();
                this.getType() === a.physics.body.GHOST ? (this.body = null, this.ghost = new Ammo.btGhostObject, this.ghost.setCollisionShape(b), this.ghost.setWorldTransform(this.transform), this.ghost._cvr_rigidbody = this) : (this.getMass() && b.calculateLocalInertia(this.getMass(), this.localInertia), this.bodyInit = new Ammo.btRigidBodyConstructionInfo(this.getMass(),
                        this.motionState, b, this.localInertia), this.friction && this.bodyInit.set_m_friction(this.friction), this.body = new Ammo.btRigidBody(this.bodyInit), this.getRestitution() && this.body.setRestitution(this.getRestitution()), w(this.linearVelocity, q), this.body.setLinearVelocity(q), w(this.angularVelocity, q), this.body.setAngularVelocity(q), m.vec3.equal([0, 0, 0], this.impulse) || (w(this.impulse, q), w(this.impulsePosition, n), this.body.applyImpulse(q, n)), this.rigid_flags && this.body.setFlags(this.rigid_flags), this.collision_flags &&
                    this.body.setFlags(this.collision_flags), this.body._cvr_rigidbody = this)
            }
            return this.body || this.ghost
        },
        updateSceneObject: function(a) {
            if (this.body && (this.body.isActive() || a)) return this.body.getMotionState().getWorldTransform(b), a = b.getOrigin(), a.x != a.x ? console.log("origin is NaN") : (this.sceneObject.position[0] = a.x(), this.sceneObject.position[1] = a.y(), this.sceneObject.position[2] = a.z()), a = b.getRotation(), f.x = a.x(), f.y = a.y(), f.z = a.z(), f.w = a.w(), f.x != f.x ? console.log("rotation is NaN") : (a = f.toEuler(),
                this.sceneObject.rotation[0] = a[0], this.sceneObject.rotation[1] = a[1], this.sceneObject.rotation[2] = a[2]), !0
        },
        reset: function() {
            if (this.body) {
                var a = this.body.getWorldTransform().getOrigin();
                w(this.init_position, a);
                this.body.getWorldTransform().getRotation();
                this.resetMotion();
                a = this.init_rotation;
                f.fromEuler(a[0], a[1], a[2]);
                a = [f.x, f.y, f.z, f.w];
                e.setX(a[0]);
                e.setY(a[1]);
                e.setZ(a[2]);
                e.setW(a[3]);
                this.body.getWorldTransform().setRotation(e);
                this.activate()
            }
        },
        resetMotion: function() {
            w(this.init_linearVelocity,
                q);
            this.body.setLinearVelocity(q);
            w(this.init_angularVelocity, q);
            this.body.setAngularVelocity(q);
            m.vec3.equal([0, 0, 0], this.init_impulse) || (w(this.init_impulse, q), w(this.init_impulsePosition, n), this.body.applyImpulse(q, n))
        },
        getCollisionShape: function() {
            if (!this.shape) {
                var c;
                c = this.getCollisionMap();
                if (c.getResult()) c = c.getResult();
                else {
                    var e = c.getShapes(),
                        d, g, f, h, n, q, s, t = [],
                        x = null;
                    g = 0;
                    for (f = e.length; g < f; g++) {
                        d = e[g];
                        x = null;
                        if (d.type === a.collision.shape.BOX) x = new Ammo.btBoxShape(new Ammo.btVector3(d.size[0] /
                            2, d.size[1] / 2, d.size[2] / 2));
                        else if (d.type === a.collision.shape.SPHERE) x = new Ammo.btSphereShape(d.radius);
                        else if (d.type === a.collision.shape.CAPSULE) x = new Ammo.btCapsuleShape(d.radius, d.height);
                        else if (d.type === a.collision.shape.CYLINDER) x = new Ammo.btCylinderShape(new Ammo.btVector3(d.size[0] / 2, d.size[1] / 2, d.size[2] / 2));
                        else if (d.type === a.collision.shape.CONE) x = new Ammo.btConeShape(d.radius, d.height);
                        else if (d.type === a.collision.shape.MESH) {
                            s = d.mesh;
                            x = new Ammo.btTriangleMesh;
                            q = d.size;
                            var F = new Ammo.btVector3(0,
                                    0, 0),
                                J = new Ammo.btVector3(0, 0, 0),
                                K = new Ammo.btVector3(0, 0, 0),
                                M = s.getMaterials();
                            h = 0;
                            for (n = s.faces.length; h < n; h++) {
                                var L = s.faces[h];
                                M[L.material].collision && 3 === L.points.length && (F.setValue(s.points[L.points[0]][0] * q[0], s.points[L.points[0]][1] * q[1], s.points[L.points[0]][2] * q[2]), J.setValue(s.points[L.points[1]][0] * q[0], s.points[L.points[1]][1] * q[1], s.points[L.points[1]][2] * q[2]), K.setValue(s.points[L.points[2]][0] * q[0], s.points[L.points[2]][1] * q[1], s.points[L.points[2]][2] * q[2]), x.addTriangle(F, J,
                                    K))
                            }
                            0 === this.getMass() || this.getType() == a.physics.body.STATIC || this.getType() == a.physics.body.GHOST ? (this.setMass(0), x = new Ammo.btBvhTriangleMeshShape(x, !0)) : x = new Ammo.btConvexTriangleMeshShape(x, !0)
                        } else if (d.type === a.collision.shape.CONVEX_HULL) {
                            s = d.mesh;
                            q = d.size;
                            F = new Ammo.btVector3(0, 0, 0);
                            x = new Ammo.btConvexHullShape;
                            h = 0;
                            for (n = s.points.length; h < n; h++) w([s.points[h][0] * q[0], s.points[h][1] * q[1], s.points[h][2] * q[2]], F), x.addPoint(F)
                        } else if (d.type === a.collision.shape.HEIGHTFIELD) {
                            var J = F = s = q = 0,
                                N;
                            d.landscape && !d.getHeightField && d.landscape instanceof m.HeightField ? d.heightfield = d.landscape : d.landscape && d.landscape instanceof m.Landscape && (q = d.landscape.getHeightField().getDivX(), F = d.landscape.getHeightField().getDivZ(), s = d.landscape.getHeightField().getSizeX(), J = d.landscape.getHeightField().getSizeZ(), N = d.landscape.getMesh().points, d.landscape.getHeightField());
                            d.heightfield && d.heightfield instanceof m.HeightField && (q = d.heightfield.getDivX(), F = d.heightfield.getDivZ(), s = d.heightfield.getSizeX(),
                                J = d.heightfield.getSizeZ(), N = d.getMesh().points);
                            x = Ammo.allocate(4 * N.length, "float", Ammo.ALLOC_NORMAL);
                            h = 0;
                            for (n = q * F; h < n; h++) Ammo.setValue(x + (h << 2), N[h][1], "float");
                            x = new Ammo.btHeightfieldTerrainShape(q, F, x, 1, -100, 100, 1, 0, !1);
                            x.setUseDiamondSubdivision(!0);
                            h = new Ammo.btVector3(s / q, 1, J / F);
                            x.setLocalScaling(h)
                        }
                        x && (0 !== d.margin && x.setMargin(d.margin), t.push({
                            cShape: d,
                            btShape: x
                        }))
                    }
                    e = null;
                    if (1 === t.length) e = t[0].btShape;
                    else if (1 < t.length) {
                        b = new Ammo.btTransform;
                        e = new Ammo.btCompoundShape(!1);
                        g = 0;
                        for (f =
                            t.length; g < f; g++) b.setIdentity(), b.setOrigin(o(t[g].cShape.position)), b.setRotation(r(t[g].cShape.rotation)), e.addChildShape(b, t[g].btShape)
                    }
                    c.setResult(e);
                    c = e
                }
                this.shape = c
            }
            return this.shape
        },
        setAngularVelocity: function(a) {
            this.angularVelocity = a;
            this.body && (w(a, q), this.body.setAngularVelocity(q))
        },
        setGravity: function(a) {
            this.gravity = a;
            this.body && (w(a, q), this.body.setGravity(q))
        },
        getGravity: function() {
            return this.gravity && !this.body ? this.gravity : d(this.body.getGravity())
        },
        setLinearVelocity: function(a) {
            this.linearVelocity =
                a;
            this.body && (w(a, q), this.body.setLinearVelocity(q))
        },
        applyImpulse: function(a, b) {
            this.impulse = a || [0, 0, 0];
            this.impulsePosition = b || [0, 0, 0];
            this.body && !m.vec3.equal([0, 0, 0], a) && (w(this.impulse, q), w(this.impulsePosition, n), this.body.applyImpulse(q, n))
        },
        applyForce: function(a, b) {
            this.body && !m.vec3.equal([0, 0, 0], a) && (w(a, q), w(b, n), this.body.applyImpulse(q, n))
        },
        getAngularVelocity: function() {
            return d(this.body.getAngularVelocity())
        },
        getLinearVelocity: function() {
            return d(this.body.getLinearVelocity())
        },
        activate: function(b) {
            this.noDeactivate =
                b || !1;
            this.body && (this.noDeactivate && this.body.setActivationState(a.physics.collision_states.DISABLE_DEACTIVATION), this.body.activate())
        },
        setAngularFactor: function(a) {
            this.body && a !== c && (a.length || (a = [a, a, a]), w(a, q), this.body.setAngularFactor(q))
        },
        isActive: function() {
            return this.body ? this.body.isActive() : !1
        },
        isStatic: function() {
            return this.properties.type == a.physics.body.STATIC
        },
        setRigidFlags: function(a) {
            this.rigid_flags = a;
            this.body && this.body.setFlags(a)
        },
        setCollisionFlags: function(b) {
            this.collision_flags =
                b = m.parseEnum(a.physics.collision_flags, b);
            this.body && this.body.setCollisionFlags(b)
        },
        setPosition: function(a) {
            this.position = a;
            if (this.body || this.ghost) w(a, q), this.body && this.body.getCenterOfMassTransform().setOrigin(q), this.ghost && this.ghost.getWorldTransform().setOrigin(q)
        },
        getRotation: function() {
            if (!this.body && !this.ghost) return this.init_rotation;
            this.body && this.body.getCenterOfMassTransform().getRotation(e);
            this.ghost && this.ghost.getWorldTransform().getRotation(e);
            var a = new m.Quaternion;
            h(e, a);
            return a
        },
        setRotation: function(a) {
            this.rotation = a.toEuler();
            if (this.body || this.ghost) t(a, e), this.body && this.body.getCenterOfMassTransform().setRotation(e), this.ghost && this.ghost.getWorldTransform().setRotation(e)
        },
        getRotationEuler: function() {
            if (!this.body && !this.ghost) return this.init_rotation;
            var a = new m.Quaternion;
            this.body && this.body.getCenterOfMassTransform().getRotation(e);
            this.ghost && this.ghost.getWorldTransform().getRotation(e);
            h(e, a);
            return a.toEuler()
        },
        setRotationEuler: function(a) {
            this.rotation =
                a;
            e.setEuler(this.rotation[2] * (Math.PI / 180), this.rotation[1] * (Math.PI / 180), this.rotation[0] * (Math.PI / 180));
            this.body && this.body.getCenterOfMassTransform().setRotation(e);
            this.ghost && this.body.getWorldTransform().setRotation(e)
        }
    };
    var F = function(b) {
        b = b || {};
        this.ctype = m.parseEnum(a.physics.constraint, b.ctype) || a.physics.constraint.P2P;
        this.strength = b.strength || 0.1;
        this.maxImpulse = b.maxImpulse || 0;
        this.rigidBodyA = b.rigidBodyA || b.rigidBody || null;
        this.rigidBodyB = b.rigidBodyB || null;
        this.positionA = b.positionA || [0, 0, 0];
        this.positionB = b.positionB || b.position || [0, 0, 0];
        this.damping = b.damping != c ? b.damping : 1;
        this.btConstraint = null;
        this.localPivotA = o(this.positionA);
        this.localPivotB = o(this.positionB)
    };
    F.prototype = {
        getConstraint: function() {
            if (!this.btConstraint) {
                if (!this.rigidBodyA) return !1;
                this.ctype === a.physics.constraint.P2P && (this.btConstraint = this.rigidBodyA && this.rigidBodyB ? new Ammo.btPoint2PointConstraint(this.rigidBodyA.getBody(), this.rigidBodyB.getBody(), this.localPivotA, this.localPivotB) : new Ammo.btPoint2PointConstraint(this.rigidBodyA.getBody(),
                    this.localPivotA), this.btConstraint.get_m_setting().set_m_tau(this.strength), this.btConstraint.get_m_setting().set_m_damping(this.damping), this.maxImpulse && this.btConstraint.get_m_setting().set_m_impulseClamp(this.maxImpulse), this.btConstraint === Ammo.NULL && (this.btConstraint = null))
            }
            return this.btConstraint
        },
        setStrength: function(a) {
            this.strength = a;
            this.btConstraint && this.btConstraint.get_m_setting().set_m_tau(this.strength)
        },
        setDamping: function(a) {
            this.damping = a;
            this.btConstraint && this.btConstraint.get_m_setting().set_damping(this.damping)
        },
        setMaxImpulse: function(a) {
            this.maxImpulse = a;
            this.btConstraint && this.btConstraint.get_m_setting().set_impulseClamp(this.maxImpulse)
        },
        getStrength: function() {
            return this.strength
        },
        setPosition: function(a) {
            this.positionB = a;
            this.btConstraint && (w(this.positionB, this.localPivotB), this.btConstraint.setPivotB(this.localPivotB))
        },
        getPosition: function() {
            return this.positionB
        }
    };
    g.prototype = {
        getContact: function() {
            var a = this.manifold.getContactPoint(j);
            return a === Ammo.NULL ? null : {
                impulse: a.getAppliedImpulse(),
                lifetime: a.getLifeTime(),
                friction: a.get_m_combinedFriction(),
                positionA: d(a.getPositionWorldOnA()),
                positionB: d(a.getPositionWorldOnB())
            }
        },
        setManifold: function(a) {
            this.numContacts = a.getNumContacts();
            this.manifold = a
        }
    };
    var x = function() {
        this.rigidObjects = [];
        this.ghostObjects = [];
        this.contactObjects = [];
        this.collisionObjects = [];
        this.active_count = 0;
        this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration;
        this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
        this.overlappingPairCache = new Ammo.btDbvtBroadphase;
        this.solver = new Ammo.btSequentialImpulseConstraintSolver;
        this.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.overlappingPairCache, this.solver, this.collisionConfiguration);
        this.dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
        this.overlappingPairCache.getOverlappingPairCache().setInternalGhostPairCallback(new Ammo.btGhostPairCallback);
        if (!b || !f) q = new Ammo.btVector3, n = new Ammo.btVector3, b = new Ammo.btTransform, f = new m.Quaternion, e = new Ammo.btQuaternion
    };
    x.prototype = {
        addConstraint: function(a) {
            var b =
                a.getConstraint();
            return b ? (this.dynamicsWorld.addConstraint(b), a.rigidBodyA.activate(!0), !0) : !1
        },
        removeConstraint: function(a) {
            return (a = a.getConstraint()) ? (this.dynamicsWorld.removeConstraint(a), !0) : !1
        },
        setGravity: function(a) {
            w(a, q);
            this.dynamicsWorld.setGravity(q)
        },
        bindSceneObject: function(a, b) {
            var c = new m.RigidBody(a, b);
            this.rigidObjects.push(c);
            c.getBody();
            c.activate();
            this.dynamicsWorld.addRigidBody(c.getBody());
            c.updateSceneObject(!0);
            return c
        },
        bind: function(a) {
            a instanceof m.Vehicle ? a.initBody(this) :
                a instanceof m.RigidBody && this.bindRigidBody(a)
        },
        remove: function(a) {
            a instanceof m.RigidBody && this.removeRigidBody(a)
        },
        bindRigidBody: function(b) {
            if (b.getType() === a.physics.body.GHOST) {
                if (-1 !== this.ghostObjects.indexOf(b)) return;
                this.ghostObjects.push(b);
                var c = b.getBody();
                b.properties.blocker || c.setCollisionFlags(c.getCollisionFlags() + a.physics.collision_flags.NO_CONTACT_RESPONSE);
                this.dynamicsWorld.addCollisionObject(c)
            } else {
                if (-1 !== this.rigidObjects.indexOf(b)) return;
                this.rigidObjects.push(b);
                c =
                    b.getBody();
                b.activate();
                this.dynamicsWorld.addRigidBody(c);
                b.updateSceneObject(!0)
            }
            var e, d;
            if ((e = b.getSceneObject()) && (d = e.getEventHandler())) d.hasEvent(a.event.CONTACT) && this.contactObjects.push(b), d.hasEvent(a.event.COLLIDE) && this.collisionObjects.push(b)
        },
        removeRigidBody: function(b) {
            if (b.getType() === a.physics.body.GHOST) {
                if (-1 === this.ghostObjects.indexOf(b)) return;
                this.ghostObjects.splice(this.ghostObjects.indexOf(b), 1);
                this.dynamicsWorld.removeCollisionObject(b.getBody())
            } else {
                if (-1 === this.rigidObjects.indexOf(b)) return;
                this.rigidObjects.splice(this.rigidObjects.indexOf(b), 1);
                this.dynamicsWorld.removeRigidBody(b.getBody())
            }
            var c, e;
            if ((c = b.getSceneObject()) && (e = c.getEventHandler())) e.hasEvent(a.event.CONTACT) && -1 !== this.contactObjects.indexOf(b) && this.contactObjects.splice(this.contactObjects.indexOf(b), 1), e.hasEvent(a.event.COLLIDE) && -1 !== this.collisionObjects.indexOf(b) && this.collisionObjects.splice(this.collisionObjects.indexOf(b), 1)
        },
        getActiveCount: function() {
            return this.active_count
        },
        stepSimulation: function(a,
            b) {
            this.dynamicsWorld.stepSimulation(a, b || 2);
            for (var c = 0, e = 0, d = this.rigidObjects.length; e < d; e++) this.rigidObjects[e].updateSceneObject() && c++;
            this.active_count = c
        },
        triggerEvents: function() {
            var b, c, e, d, f = this.dynamicsWorld;
            if (this.contactObjects.length) {
                var h = f.getDispatcher().getNumManifolds();
                for (b = 0; b < h; b++) {
                    var m = f.getDispatcher().getManifoldByIndexInternal(b),
                        n = Ammo.wrapPointer(m.getBody0(), Ammo.btRigidBody)._cvr_rigidbody || null,
                        o = Ammo.wrapPointer(m.getBody1(), Ammo.btRigidBody)._cvr_rigidbody ||
                        null;
                    if (n && (d = n.getSceneObject()) && (c = d.getEventHandler()) && c.hasEvent(a.event.CONTACT)) e = c.triggerEvent(a.event.CONTACT), e.self = n, e.other = o, e.contacts ? e.contacts.setManifold(m) : e.contacts = new g(m);
                    else if (o && o.isStatic() && (d = o.getSceneObject()) && (c = d.getEventHandler()) && c.hasEvent(a.event.CONTACT)) e = c.triggerEvent(a.event.CONTACT), e.other = n, e.self = o, e.contacts ? e.contacts.setManifold(m) : e.contacts = new g(m)
                }
            }
            f = this.collisionObjects.length;
            for (b = 0; b < f; b++)
                if (n = this.collisionObjects[b], (d = n.getSceneObject()) &&
                    (c = d.getEventHandler()) && c.hasEvent(a.event.COLLIDE))
                    if (e = c.getProperties(a.event.COLLIDE), m = e.collidesWith, e.mf = e.mf || [], e.alg = e.alg || [], m && m.length) {
                        h = [];
                        n = n.getBody();
                        b = 0;
                        for (iMax = m.length; b < iMax; b++) {
                            var o = m[b],
                                q = o.getBody();
                            e.mf[b] || (e.mf[b] = new Ammo.btManifoldResult(n, q));
                            e.alg[b] || (e.alg[b] = this.dynamicsWorld.getDispatcher().findAlgorithm(n, q));
                            e.alg[b].processCollision(n, q, this.dynamicsWorld.getDispatchInfo(), e.mf[b]);
                            0 < e.mf[b].getPersistentManifold().getNumContacts() && (h.push(o), this.dynamicsWorld.getDispatcher().clearManifold(e.mf[b].getPersistentManifold()))
                        }
                        if (h.length &&
                            (e = c.triggerEvent(a.event.COLLIDE))) e.collisions = h
                    }
            f = this.ghostObjects.length;
            for (b = 0; b < f; b++)
                if (e = this.ghostObjects[b], d = e.getSceneObject())
                    if ((c = d.getEventHandler()) && c.hasEvent(a.event.CONTACT_GHOST))
                        if (d = e.getBody(), h = d.getNumOverlappingObjects()) {
                            e = c.triggerEvent(a.event.CONTACT_GHOST);
                            e.contacts = e.contacts || [];
                            e.contacts.length > h && (e.contacts.length = h);
                            for (c = 0; c < h; c++) m = Ammo.btRigidBody.prototype.upcast(d.getOverlappingObject(c)), e.contacts[c] = m._cvr_rigidbody || null
                        }
        },
        reset: function() {
            for (var a =
                    0, b = this.rigidObjects.length; a < b; a++) this.rigidObjects[a].reset()
        },
        getRayHit: function(a, b, c, e) {
            var g, a = o(a);
            g = o(b);
            c = c || !1;
            e = e || !1;
            b = new Ammo.ClosestRayResultCallback(a, g);
            this.dynamicsWorld.rayTest(a, g, b);
            if (b.hasHit() && (body = Ammo.btRigidBody.prototype.upcast(b.get_m_collisionObject()), body !== Ammo.NULL && !(body.isStaticObject() && !c || body.isKinematicObject() && !e))) {
                c = body;
                e = b.get_m_hitPointWorld();
                a = c.getCenterOfMassTransform().inverse().op_mul(e);
                if (g = c._cvr_rigidbody) return Ammo.destroy(b), {
                    position: d(e),
                    localPosition: d(a),
                    rigidBody: g,
                    ammoBody: c
                };
                Ammo.destroy(b);
                return {
                    position: d(e),
                    localPosition: d(a),
                    rigidBody: null,
                    ammoBody: c
                }
            }
            Ammo.destroy(b)
        }
    };
    return {
        ScenePhysics: x,
        Constraint: F,
        RigidProperties: function(b) {
            this.type = m.parseEnum(a.physics.body, b.type);
            this.mass = b.mass !== c ? b.mass : this.type ? 1 : 0;
            this.size = b.size || [1, 1, 1];
            this.restitution = b.restitution || (this.type ? 0 : 1);
            this.friction = b.friction || 1;
            if ((this.collision = b.collision) && !this.collision.getShapes) this.collision = new m.CollisionMap(this.collision);
            this.blocker = b.blocker || !1
        },
        RigidBody: s,
        vec3bt_copy: w,
        btvec3_copy: function(a, b) {
            b[0] = a.x();
            b[1] = a.y();
            b[2] = a.z()
        },
        quatbt_copy: t,
        btquat_copy: h
    }
});
CubicVR.RegisterModule("CollisionMap", function(m) {
    var w = m.enums;
    w.collision = {
        shape: {
            BOX: 0,
            SPHERE: 1,
            CYLINDER: 2,
            CONE: 3,
            CAPSULE: 4,
            MESH: 5,
            HEIGHTFIELD: 6,
            CONVEX_HULL: 7
        }
    };
    var t = function(h) {
        this.shapes = [];
        this.result = null;
        if (h) {
            h && !h.length && (h = [h]);
            for (var m = 0, r = h.length; m < r; m++) this.addShape(h[m])
        }
    };
    t.prototype = {
        addShape: function(h) {
            h.type = m.parseEnum(w.collision.shape, h.type);
            h.position = h.position || [0, 0, 0];
            h.rotation = h.rotation || [0, 0, 0];
            h.size = h.size || [1, 1, 1];
            h.radius = h.radius || 1;
            h.height = h.height || 1;
            h.margin = h.margin || 0;
            h.mesh = h.mesh || null;
            this.shapes.push(h)
        },
        getShapes: function() {
            return this.shapes
        },
        setResult: function(h) {
            this.result = h
        },
        getResult: function() {
            return this.result
        }
    };
    return {
        CollisionMap: t
    }
});
CubicVR.RegisterModule("RigidVehicle", function(m) {
    var w = m.undef,
        t = m.enums,
        h, o, r = function(d) {
            var d = m.get(d) || {},
                c = d.mesh,
                a = d.collision;
            this.maxEngineForce = d.maxEngineForce || 2E3;
            this.maxBreakingForce = d.maxBreakingForce || 125;
            this.steeringClamp = d.steeringClamp || 0.51;
            this.mass = d.mass || 400;
            this.rightIndex = this.gVehicleSteering = this.gBreakingForce = this.gEngineForce = 0;
            this.upIndex = 1;
            this.forwardIndex = 2;
            this.m_tuning = this.m_vehicle = this.m_vehicleRayCaster = null;
            this.wheelDirectionCS0 = new Ammo.btVector3;
            this.wheelAxleCS =
                new Ammo.btVector3;
            this.wheels = [];
            this.bodyMesh = c;
            this.bodyCollision = new m.CollisionMap(a);
            this.sceneObject = new m.SceneObject(this.bodyMesh);
            if (!h || !o) new Ammo.btVector3, new Ammo.btVector3, h = new Ammo.btTransform, o = new m.Quaternion, new Ammo.btQuaternion;
            if (d.wheels != w) {
                c = 0;
                for (a = d.wheels.length; c < a; c++) {
                    var b = d.wheels[c];
                    b instanceof m.VehicleWheel ? this.addWheel(b) : this.addWheel(new m.VehicleWheel(b))
                }
            }
        };
    r.prototype = {
        getSceneObject: function() {
            return this.sceneObject
        },
        initBody: function(d) {
            this.body =
                new m.RigidBody(this.sceneObject, {
                    collision: this.bodyCollision,
                    mass: this.mass,
                    restitution: 0.1
                });
            m.vec3bt_copy([0, -1, 0], this.wheelDirectionCS0);
            m.vec3bt_copy([-1, 0, 0], this.wheelAxleCS);
            this.gVehicleSteering = 0;
            this.body.setLinearVelocity([0, 0, 0]);
            this.body.setAngularVelocity([0, 0, 0]);
            this.m_vehicleRayCaster = new Ammo.btDefaultVehicleRaycaster(d.dynamicsWorld);
            this.m_tuning = new Ammo.btVehicleTuning;
            this.m_vehicle = new Ammo.btRaycastVehicle(this.m_tuning, this.body.getBody(), this.m_vehicleRayCaster);
            this.body.getBody().setActivationState(t.physics.collision_states.DISABLE_DEACTIVATION);
            this.m_vehicle.setCoordinateSystem(this.rightIndex, this.upIndex, this.forwardIndex);
            for (var c = new Ammo.btVector3, a = 0; a < this.wheels.length; a++) m.vec3bt_copy(this.wheels[a].getWheelPosition(), c), this.m_vehicle.addWheel(c, this.wheelDirectionCS0, this.wheelAxleCS, this.wheels[a].getSuspensionRest(), this.wheels[a].getWheelRadius(), this.m_tuning, this.wheels[a].getSteering());
            d.dynamicsWorld.addVehicle(this.m_vehicle);
            d.bind(this.body);
            this.updateSuspension()
        },
        evaluate: function() {
            for (var d = this.m_vehicle.getNumWheels(),
                    c = 0; c < d; c++) {
                this.wheels[c].isSteering() && this.m_vehicle.setSteeringValue(this.gVehicleSteering, c);
                this.wheels[c].isBraking() && this.m_vehicle.setBrake(this.gBrakingForce, c);
                this.wheels[c].isDriving() && this.m_vehicle.applyEngineForce(this.gEngineForce, c);
                this.m_vehicle.updateWheelTransform(c, !0);
                var a = this.m_vehicle.getWheelTransformWS(c),
                    b = a.getOrigin();
                this.wheels[c].wheelObj.position[0] = b.x();
                this.wheels[c].wheelObj.position[1] = b.y();
                this.wheels[c].wheelObj.position[2] = b.z();
                a = a.getRotation();
                o.x =
                    a.x();
                o.y = a.y();
                o.z = a.z();
                o.w = a.w();
                a = o.toEuler();
                this.wheels[c].wheelObj.rotation[0] = a[0];
                this.wheels[c].wheelObj.rotation[1] = a[1];
                this.wheels[c].wheelObj.rotation[2] = a[2]
            }
            this.body.isActive() || this.body.activate();
            this.updateSceneObject(!0)
        },
        getRigidBody: function() {
            return this.body
        },
        updateSceneObject: function(d) {
            if (this.body && (this.body.isActive() || d)) return this.body.getBody().getMotionState().getWorldTransform(h), d = h.getOrigin(), d.x != d.x ? console.log("origin is NaN") : (this.sceneObject.position[0] =
                d.x(), this.sceneObject.position[1] = d.y(), this.sceneObject.position[2] = d.z()), d = h.getRotation(), o.x = d.x(), o.y = d.y(), o.z = d.z(), o.w = d.w(), o.x != o.x ? console.log("rotation is NaN") : (d = o.toEuler(), this.sceneObject.rotation[0] = d[0], this.sceneObject.rotation[1] = d[1], this.sceneObject.rotation[2] = d[2]), !0
        },
        setEngineForce: function(d) {
            this.gEngineForce = d;
            this.gEngineForce > this.maxEngineForce && (this.gEngineForce = this.maxEngineForce);
            this.gEngineForce < -this.maxEngineForce && (this.gEngineForce = -this.maxEngineForce)
        },
        getEngineForce: function() {
            return this.gEngineForce
        },
        incEngine: function(d) {
            this.setEngineForce(this.getEngineForce() + d)
        },
        decEngine: function(d) {
            this.setEngineForce(this.getEngineForce() - d)
        },
        setSteering: function(d) {
            this.gVehicleSteering = d
        },
        getSteering: function() {
            return this.gVehicleSteering
        },
        incSteering: function(d) {
            this.gVehicleSteering += d;
            this.gVehicleSteering > this.steeringClamp && (this.gVehicleSteering = this.steeringClamp);
            this.gVehicleSteering < -this.steeringClamp && (this.gVehicleSteering = -this.steeringClamp)
        },
        setBrake: function(d) {
            this.gBreakingForce = d
        },
        getWheelGroundPosition: function(d) {
            return this.wheels[d].wheelObj.getWorldPosition() - [0, wheels[d].getWheelRadius(), 0]
        },
        getWheelSkid: function(d) {
            return this.m_vehicle.getWheelInfo(d).get_m_skidInfo()
        },
        getRigidGround: function(d) {
            this.m_vehicle.getWheelInfo(d)
        },
        addWheel: function(d, c) {
            c === w && (c = this.wheels.length);
            this.wheels[c] = d
        },
        getWheel: function(d) {
            return this.wheels[d]
        },
        bindToScene: function(d) {
            for (var c = this.wheels.length, a = 0; a < c; a++) d.bind(this.getWheelObj(a));
            d.bind(this.getSceneObject())
        },
        getWheelObj: function(d) {
            return this.getWheel(d).wheelObj
        },
        updateSuspension: function() {
            var d, c = this.m_vehicle.getNumWheels();
            for (d = 0; d < c; d++) {
                var a = this.m_vehicle.getWheelInfo(d);
                a.set_m_suspensionStiffness(this.wheels[d].getSuspensionStiffness());
                a.set_m_suspensionRestLength1(this.wheels[d].getSuspensionRest());
                a.set_m_wheelsDampingRelaxation(this.wheels[d].getDampingRelaxation());
                a.set_m_wheelsDampingCompression(this.wheels[d].getDampingCompression());
                a.set_m_frictionSlip(this.wheels[d].getFrictionSlip());
                a.set_m_rollInfluence(this.wheels[d].getRollInfluence())
            }
            if (this.m_vehicle) {
                this.m_vehicle.resetSuspension();
                for (d = 0; d < c; d++) this.m_vehicle.updateWheelTransform(d, !0)
            }
        },
        getMass: function() {
            return this.mass
        },
        setMass: function(d) {
            this.mass = d;
            this.body && this.body.setMass(this.mass)
        }
    };
    var d = function(d) {
        d = m.get(d) || {};
        this.wheelRef = new m.SceneObject;
        this.wheelObj = new m.SceneObject;
        this.wheelRef.scale = d.scale || [1, 1, 1];
        this.wheelRadius = d.radius || 0;
        this.wheelWidth = d.width || 0;
        d.mesh != w && this.setModel(d.mesh);
        this.suspensionStiffness = d.suspensionStiffness || 40;
        this.suspensionRest = d.suspensionRest || 0.05;
        this.dampingRelaxation = d.dampingRelaxation || 2.3;
        this.dampingCompression = d.dampingCompression || 2.4;
        this.frictionSlip = d.frictionSlip || 0.94;
        this.rollInfluence = d.rollInfluence || 0.5;
        this.wheelPosition = d.position || [0, 0, 0];
        this.wheelRotation = [0, 0, 0];
        this.steering = d.steering || !1;
        this.braking = d.braking || !1;
        this.driving = d.driving || !1
    };
    d.prototype = {
        setModel: function(d, c, a) {
            this.wheelModel = d;
            this.wheelRadius = c || 0;
            this.wheelWidth =
                a || 0;
            0 === this.wheelRadius && (this.wheelRadius = (this.wheelModel.bb[1][1] - this.wheelModel.bb[0][1]) / 2, this.wheelRadius += (this.wheelModel.bb[1][2] - this.wheelModel.bb[0][2]) / 2, this.wheelRadius /= 2);
            0 === this.wheelWidth && (this.wheelWidth = this.wheelModel.bb[1][0] - this.wheelModel.bb[0][0]);
            this.wheelRef.obj = this.wheelModel;
            this.wheelObj.bindChild(this.wheelRef)
        },
        setSuspensionStiffness: function(d) {
            this.suspensionStiffness = d
        },
        getSuspensionStiffness: function() {
            return this.suspensionStiffness
        },
        setSuspensionRest: function(d) {
            this.suspensionRest =
                d
        },
        getSuspensionRest: function() {
            return this.suspensionRest
        },
        setDampingRelaxation: function(d) {
            this.dampingRelaxation = d
        },
        getDampingRelaxation: function() {
            return this.dampingRelaxation
        },
        setDampingCompression: function(d) {
            this.dampingCompression = d
        },
        getDampingCompression: function() {
            return this.dampingCompression
        },
        setFrictionSlip: function(d) {
            this.frictionSlip = d
        },
        getFrictionSlip: function() {
            return this.frictionSlip
        },
        setRollInfluence: function(d) {
            this.rollInfluence = d
        },
        getRollInfluence: function() {
            return this.rollInfluence
        },
        setWheelRadius: function(d) {
            this.wheelRadius = d
        },
        getWheelRadius: function() {
            return this.wheelRadius
        },
        setWheelWidth: function(d) {
            this.wheelWidth = d
        },
        getWheelWidth: function() {
            return this.wheelWidth
        },
        setWheelRotation: function(d) {
            this.wheelRotation = d;
            this.wheelRef.setRotation(wheelRotation)
        },
        getWheelRotation: function() {
            return this.wheelRotation
        },
        setWheelPosition: function(d) {
            this.wheelPosition = d;
            this.wheelObj.position = wheelPosition
        },
        getWheelPosition: function() {
            return this.wheelPosition
        },
        setSteering: function(d) {
            this.steering =
                d
        },
        getSteering: function() {
            return this.steering
        },
        isSteering: function() {
            return this.steering
        },
        setBraking: function() {
            this.braking = this.braking_in
        },
        isBraking: function() {
            return this.braking
        },
        setDriving: function(d) {
            this.driving = d
        },
        isDriving: function() {
            return this.driving
        }
    };
    return {
        Vehicle: r,
        VehicleWheel: d
    }
});
window.CubicVRShader.CubicVRCoreVS = "attribute vec3 vertexPosition;\nattribute vec3 vertexNormal;\nattribute vec2 vertexTexCoord;\n#if VERTEX_COLOR\nattribute vec3 vertexColor;\nvarying vec3 vertexColorOut;\n#endif\n#if VERTEX_MORPH\nattribute vec3 vertexMorphPosition;\nattribute vec3 vertexMorphNormal;\nuniform float materialMorphWeight;\n#endif\n#if POINT_SIZE||POINT_SPRITE\nuniform float pointSize;\n#endif\n#if POINT_SIZE && !POINT_SPRITE && POINT_CIRCLE\nvarying float ptSize;\n#if POINT_CIRCLE\nvarying vec2 sPos;\nuniform vec3 viewPort;\n#endif\n#endif\nvarying vec2 vertexTexCoordOut;\nuniform vec2 materialTexOffset;\n#if !LIGHT_PERPIXEL\n#if LIGHT_IS_POINT||LIGHT_IS_DIRECTIONAL||LIGHT_IS_SPOT||LIGHT_IS_AREA\nuniform vec3 lightDirection[LIGHT_COUNT];\nuniform vec3 lightPosition[LIGHT_COUNT];\nuniform vec3 lightSpecular[LIGHT_COUNT];\nuniform vec3 lightDiffuse[LIGHT_COUNT];\nuniform float lightIntensity[LIGHT_COUNT];\nuniform float lightDistance[LIGHT_COUNT];\n#if LIGHT_IS_SPOT\nuniform float lightCutOffAngle[LIGHT_COUNT];\n#endif\nvarying vec3 lightColorOut;\nvarying vec3 lightSpecularOut;\n#endif\nuniform vec3 materialDiffuse;\nuniform vec3 materialSpecular;\nuniform float materialShininess;\n#endif\nuniform mat4 matrixModelView;\nuniform mat4 matrixProjection;\nuniform mat4 matrixObject;\nuniform mat3 matrixNormal;\nvarying vec3 vertexNormalOut;\nvarying vec4 vertexPositionOut;\n#if !LIGHT_DEPTH_PASS\n#if LIGHT_SHADOWED\nvarying vec4 lightProjectionOut[LIGHT_COUNT];\nuniform mat4 lightShadowMatrix[LIGHT_COUNT];\n#endif\n#if TEXTURE_ENVSPHERE\n#if TEXTURE_NORMAL\nvarying vec3 envTexCoordOut;\n#else\nvarying vec2 envTexCoordOut;\n#endif\n#endif\n#if TEXTURE_BUMP||TEXTURE_NORMAL\nvarying vec3 envEyeVectorOut;\n#endif\n#endif \nvoid cubicvr_normalMap() {\n#if !LIGHT_DEPTH_PASS\n#if TEXTURE_BUMP||TEXTURE_NORMAL\nvec3 tangent;\nvec3 binormal;\nvec3 c1 = cross( vertexNormal, vec3(0.0, 0.0, 1.0) );\nvec3 c2 = cross( vertexNormal, vec3(0.0, 1.0, 0.0) );\nif ( length(c1) > length(c2) )  {\ntangent = c1;\n}  else {\ntangent = c2;\n}\ntangent = normalize(tangent);\nbinormal = cross(vertexNormal, tangent);\nbinormal = normalize(binormal);\nmat4 uMVOMatrix = matrixModelView * matrixObject;\nmat3 TBNMatrix = mat3( (vec3 (uMVOMatrix * vec4 (tangent, 0.0))),\n(vec3 (uMVOMatrix * vec4 (binormal, 0.0))),\n(vec3 (uMVOMatrix * vec4 (vertexNormal, 0.0)))\n);\nenvEyeVectorOut = vec3(uMVOMatrix * vec4(vertexPosition,1.0)) * TBNMatrix;\n#endif\n#endif\n}\nvoid cubicvr_environmentMap() {\n#if !LIGHT_DEPTH_PASS\n#if TEXTURE_ENVSPHERE\n#if TEXTURE_NORMAL\nenvTexCoordOut = normalize( vertexPositionOut.xyz );\n#else\nvec3 ws = (matrixModelView * vec4(vertexPosition,1.0)).xyz;\nvec3 r = reflect(ws, vertexNormalOut );\nfloat m = 2.0 * sqrt( r.x*r.x + r.y*r.y + (r.z+1.0)*(r.z+1.0) );\nenvTexCoordOut.s = r.x/m + 0.5;\nenvTexCoordOut.t = r.y/m + 0.5;\n#endif\n#endif\n#if VERTEX_COLOR\nvertexColorOut = vertexColor;\n#endif\n#endif\n}\nvoid cubicvr_shadowMap() {\n#if (LIGHT_IS_SPOT||LIGHT_IS_AREA) && LIGHT_SHADOWED\nfor (int i = 0; i < LIGHT_COUNT; i++)\n{\n#if LIGHT_SHADOWED\n#if VERTEX_MORPH\nlightProjectionOut[i] = lightShadowMatrix[i] * (matrixObject * vec4(vertexPosition+(vertexMorphPosition-vertexPosition)*materialMorphWeight, 1.0));\n#else\nlightProjectionOut[i] = lightShadowMatrix[i] * (matrixObject * vec4(vertexPosition, 1.0));\n#endif\n#endif\n}\n#endif\n}\nvoid cubicvr_lighting() {\n#if !LIGHT_PERPIXEL\n#if LIGHT_IS_POINT\nvec3 specTotal = vec3(0.0,0.0,0.0);\nvec3 accum = vec3(0.0,0.0,0.0);\nfor (int i = 0; i < LIGHT_COUNT; i++) {\nvec3 lightDirection = lightPosition[i]-vertexPositionOut.xyz;\nfloat dist = length(lightDirection);\nvec3 halfVector = normalize(vec3(0.0,0.0,1.0)+lightDirection);\nfloat NdotL = max(dot(normalize(lightDirection),vertexNormalOut),0.0);\nif (NdotL > 0.0) {\nfloat att = clamp(((lightDistance[i]-dist)/lightDistance[i]), 0.0, 1.0)*lightIntensity[i];\naccum += att * NdotL * lightDiffuse[i] * materialDiffuse;\nfloat NdotHV = max(dot(vertexNormalOut, halfVector),0.0);\nvec3 spec2 = lightSpecular[i] * materialSpecular * pow(NdotHV,materialShininess);\nspecTotal += spec2;\n}\n}\nlightColorOut = accum;\nlightSpecularOut = specTotal;\n#endif\n#if LIGHT_IS_DIRECTIONAL\nfloat NdotL;\nfloat NdotHV = 0.0;\nvec3 specTotal = vec3(0.0,0.0,0.0);\nvec3 spec2 = vec3(0.0,0.0,0.0);\nvec3 accum = vec3(0.0,0.0,0.0);\nvec3 halfVector;\nfor (int i = 0; i < LIGHT_COUNT; i++) {\nhalfVector = normalize(vec3(0.0,0.0,1.0)-lightDirection[i]);\nNdotL = max(dot(normalize(-lightDirection[i]),vertexNormalOut),0.0);\nif (NdotL > 0.0)   {\naccum += lightIntensity[i] * materialDiffuse * lightDiffuse[i] * NdotL;\nNdotHV = max(dot(vertexNormalOut, halfVector),0.0);\nspec2 = lightSpecular[i] * materialSpecular * pow(NdotHV,materialShininess);\nspecTotal += spec2;\n}\n}\nlightColorOut = accum;\nlightSpecularOut = specTotal;\n#endif\n#if LIGHT_IS_SPOT\nvec3 specTotal = vec3(0.0,0.0,0.0);\nvec3 spec2 = vec3(0.0,0.0,0.0);\nvec3 accum = vec3(0.0,0.0,0.0);\nvec3 halfVector;\nfloat spotEffect;\nfloat spotDot;\nfloat power;\nfor (int i = 0; i < LIGHT_COUNT; i++) {\nvec3 l = lightPosition[i]-vertexPositionOut.xyz;\nfloat dist = length(l);\nfloat att = clamp(((lightDistance[i]-dist)/lightDistance[i]), 0.0, 1.0)*lightIntensity[i];\natt = clamp(att,0.0,1.0);\nspotDot = dot(normalize(-l), normalize(lightDirection[i]));\nif ( spotDot < cos((lightCutOffAngle[i]/2.0)*(3.14159/180.0)) ) {\nspotEffect = 0.0;\n}\nelse {\nspotEffect = pow(spotDot, 1.0);\n}\natt *= spotEffect;\nvec3 v = normalize(-vertexPositionOut.xyz);\nvec3 h = normalize(l + v);\nfloat NdotL = max(0.0, dot(vertexNormalOut, normalize(l)));\nfloat NdotH = max(0.0, dot(vertexNormalOut, h));\nif (NdotL > 0.0) {\npower = pow(NdotH, materialShininess);\n}\nelse {\npower = 0.0;\n}\naccum += att * lightDiffuse[i] * materialDiffuse * NdotL;\nspec2 = lightSpecular[i] * materialSpecular * power;\nspecTotal += spec2*spotEffect;\n}\nlightColorOut = accum;\nlightSpecularOut = specTotal;\n#endif\n#endif \ncubicvr_normalMap();\ncubicvr_shadowMap();\ncubicvr_environmentMap();\n}\nvec2 cubicvr_texCoord() {\nreturn vertexTexCoord + materialTexOffset;\n}\nvec4 cubicvr_transform() {\n#if LIGHT_DEPTH_PASS\nvertexNormalOut = vec3(0.0,0.0,0.0);\n#endif\n#if VERTEX_MORPH\nvec4 vPos = matrixObject * vec4(vertexPosition+(vertexMorphPosition-vertexPosition)*materialMorphWeight, 1.0);\n#else\nvec4 vPos = matrixObject * vec4(vertexPosition, 1.0);\n#endif\nvertexPositionOut = matrixModelView * vPos;\n#if POINT_SIZE||POINT_SPRITE\nfloat d = length(vertexPositionOut);\ngl_PointSize = pointSize * sqrt( 1.0/(1.0 + d*d) );\n#if !POINT_SPRITE && POINT_CIRCLE\nptSize = gl_PointSize;\nvec4 screenPos = vec4(matrixProjection * vertexPositionOut);\nsPos = (screenPos.xy/screenPos.w)*vec2(viewPort.x/2.0,viewPort.y/2.0)+vec2(viewPort.x/2.0+0.5,viewPort.y/2.0+0.5);\n#endif\n#endif\nreturn vPos;\n}\nvec3 cubicvr_normal() {\n#if VERTEX_MORPH\nreturn normalize(matrixObject*vec4(vertexNormal+(vertexMorphNormal-vertexNormal)*materialMorphWeight,0.0)).xyz;\n#else\nreturn normalize(matrixObject*vec4(vertexNormal,0.0)).xyz;\n#endif\n}\n#define customShader_splice 1\nvoid main(void)\n{\nvertexTexCoordOut = cubicvr_texCoord();\ngl_Position =  matrixProjection * matrixModelView * cubicvr_transform();\n#if !LIGHT_DEPTH_PASS  \nvertexNormalOut = matrixNormal * cubicvr_normal();\ncubicvr_lighting();\n#endif \n}\n";
window.CubicVRShader.CubicVRCoreFS = "#ifdef GL_ES\n#if LIGHT_PERPIXEL\nprecision highp float;\n#else\nprecision highp float;\n#endif\n#endif\n#if FOG_ENABLED\nuniform vec3 fogColor;\nuniform float fogDensity;\nuniform float fogNear;\nuniform float fogFar;\n#endif\nuniform vec3 materialAmbient;\nuniform vec3 lightAmbient;\nuniform vec3 materialColor;\n#if POINT_SIZE && !POINT_SPRITE && POINT_CIRCLE\nvarying float ptSize;\nvarying vec2 sPos;\n#endif\n#if LIGHT_PERPIXEL\nuniform vec3 materialDiffuse;\nuniform vec3 materialSpecular;\nuniform float materialShininess;\n#if LIGHT_IS_POINT||LIGHT_IS_DIRECTIONAL||LIGHT_IS_SPOT||LIGHT_IS_AREA\nuniform vec3 lightDirection[LIGHT_COUNT];\nuniform vec3 lightPosition[LIGHT_COUNT];\nuniform vec3 lightSpecular[LIGHT_COUNT];\nuniform vec3 lightDiffuse[LIGHT_COUNT];\nuniform float lightIntensity[LIGHT_COUNT];\nuniform float lightDistance[LIGHT_COUNT];\n#if LIGHT_IS_SPOT\nuniform float lightCutOffAngle[LIGHT_COUNT];\n#endif\n#endif\n#if LIGHT_IS_PROJECTOR\nuniform sampler2D lightProjectionMap[LIGHT_COUNT];\n#endif\n#if LIGHT_SHADOWED\nvarying vec4 lightProjectionOut[LIGHT_COUNT];\nuniform sampler2D lightShadowMap[LIGHT_COUNT];\nuniform vec3 lightDepthClip[LIGHT_COUNT];\n#endif\n#else \nvarying vec3 lightColorOut;\nvarying vec3 lightSpecularOut;\n#endif  \nvarying vec3 vertexNormalOut;\nvarying vec2 vertexTexCoordOut;\n#if VERTEX_COLOR\nvarying vec3 vertexColorOut;\n#endif\n#if FX_DEPTH_ALPHA||LIGHT_DEPTH_PASS||LIGHT_SHADOWED\nuniform vec3 postDepthInfo;\nfloat ConvertDepth3(float d) { return (postDepthInfo.x*postDepthInfo.y)/(postDepthInfo.y-d*(postDepthInfo.y-postDepthInfo.x));  }\nfloat DepthRange( float d ) { return ( d - postDepthInfo.x ) / ( postDepthInfo.y - postDepthInfo.x ); }\nfloat ConvertDepth3A(float d, float near, float far) { return (near*far)/(far-d*(far-near));  }\nfloat DepthRangeA( float d, float near, float far ) { return ( d - near ) / ( far - near ); }\n#endif\n#if LIGHT_DEPTH_PASS\nvec4 packFloatToVec4i(const float value)\n{\nconst vec4 bitSh = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);\nconst vec4 bitMsk = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);\nvec4 res = fract(value * bitSh);\nres -= res.xxyz * bitMsk;\nreturn res;\n}\n#endif\n#if LIGHT_SHADOWED\nfloat unpackFloatFromVec4i(const vec4 value)\n{\nconst vec4 bitSh = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);\nreturn(dot(value, bitSh));\n}\n#if LIGHT_SHADOWED_SOFT\nfloat getShadowVal(sampler2D shadowTex,vec4 shadowCoord, float proj, float texel_size) {\nvec2 filterTaps[6];\nfilterTaps[0] = vec2(-0.326212,-0.40581);\nfilterTaps[1] = vec2(-0.840144,-0.07358);\nfilterTaps[2] = vec2(-0.695914,0.457137);\nfilterTaps[3] = vec2(-0.203345,0.620716);\nfilterTaps[4] = vec2(0.96234,-0.194983);\nfilterTaps[5] = vec2(0.473434,-0.480026);\n/*  filterTaps[6] = vec2(0.519456,0.767022);\nfilterTaps[7] = vec2(0.185461,-0.893124);\nfilterTaps[8] = vec2(0.507431,0.064425);\nfilterTaps[9] = vec2(0.89642,0.412458) ;\nfilterTaps[10] =vec2(-0.32194,-0.932615);\nfilterTaps[11] =vec2(-0.791559,-0.59771); */\nfloat shadow = 0.0;\nvec4  shadowSample;\nfloat distanceFromLight;\nfor (int i = 0; i < 6; i++) {\nshadowSample = texture2D(shadowTex,shadowCoord.st+filterTaps[i]*(2.0*texel_size));\ndistanceFromLight = unpackFloatFromVec4i(shadowSample);\nshadow += distanceFromLight <= shadowCoord.z ? 0.0 : 1.0 ;\n}\nshadow /= 6.0;\nreturn shadow;\n}\n#else\nfloat getShadowVal(sampler2D shadowTex,vec4 shadowCoord, float proj, float texel_size) {\nvec4 shadowSample = texture2D(shadowTex,shadowCoord.st);\nfloat distanceFromLight = unpackFloatFromVec4i(shadowSample);\nfloat shadow = 1.0;\nshadow = distanceFromLight <= (shadowCoord.z) ? 0.0 : 1.0 ;\nreturn shadow;\n}\n#endif\n#endif\n#if !LIGHT_DEPTH_PASS\n#if TEXTURE_COLOR\nuniform sampler2D textureColor;\n#endif\n#if TEXTURE_BUMP||TEXTURE_NORMAL\nvarying vec3 envEyeVectorOut;\n#endif\n#if TEXTURE_BUMP\nuniform sampler2D textureBump;\n#endif\n#if TEXTURE_ENVSPHERE\nuniform sampler2D textureEnvSphere;\nuniform float materialEnvironment;\n#if TEXTURE_NORMAL\nvarying vec3 envTexCoordOut;\n#else\nvarying vec2 envTexCoordOut;\n#endif\n#endif\n#if TEXTURE_REFLECT\nuniform sampler2D textureReflect;\n#endif\n#if TEXTURE_NORMAL\nuniform sampler2D textureNormal;\n#endif\nuniform float materialAlpha;\n#if TEXTURE_AMBIENT\nuniform sampler2D textureAmbient;\n#endif\n#if TEXTURE_SPECULAR\nuniform sampler2D textureSpecular;\n#endif\n#endif \n#if TEXTURE_ALPHA\nuniform sampler2D textureAlpha;\n#endif\nvarying vec4 vertexPositionOut;\nvec2 cubicvr_texCoord() {\n#if LIGHT_DEPTH_PASS\nreturn vertexTexCoordOut;\n#else\n#if POINT_SPRITE\nreturn gl_PointCoord;\n#else\n#if TEXTURE_BUMP\nfloat height = texture2D(textureBump, vertexTexCoordOut.xy).r;\nfloat v = (height) * 0.05 - 0.04; \nvec3 eye = normalize(envEyeVectorOut);\nreturn vertexTexCoordOut.xy + (eye.xy * v);\n#else\nreturn vertexTexCoordOut;\n#endif\n#endif\n#endif\n}\nvec3 cubicvr_normal(vec2 texCoord) {\n#if TEXTURE_NORMAL && !LIGHT_DEPTH_PASS\nvec3 bumpNorm = vec3(texture2D(textureNormal, texCoord));\nvec3 n = (vec4(normalize(vertexNormalOut),1.0)).xyz;\nbumpNorm = (bumpNorm-0.5)*2.0;\nbumpNorm.y = -bumpNorm.y;\nreturn normalize((n+bumpNorm)/2.0);\n#else\nreturn normalize(vertexNormalOut);\n#endif\n}\n#if FOG_ENABLED\nvec4 apply_fog(vec4 color) {\nvec4 outColor = color;\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#if USE_FOG_EXP\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\noutColor = mix( color, vec4( fogColor, color.w ), fogFactor );\n#endif\n#if USE_FOG_LINEAR\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\noutColor = mix( color, vec4( fogColor, color.w ), fogFactor );\n#endif\nreturn outColor;\n}\n#endif\nvec4 cubicvr_color(vec2 texCoord) {\nvec4 color = vec4(0.0,0.0,0.0,0.0);\n#if POINT_SIZE && !POINT_SPRITE && POINT_CIRCLE\nif (length(sPos-(gl_FragCoord.xy)) > ptSize/2.0) {\ndiscard;\n}\n#endif\n#if !LIGHT_DEPTH_PASS\n#if TEXTURE_COLOR\n#if !(LIGHT_IS_POINT||LIGHT_IS_DIRECTIONAL||LIGHT_IS_SPOT||LIGHT_IS_AREA)\ncolor = texture2D(textureColor, texCoord).rgba;\ncolor.rgb *= materialColor;\n#else\ncolor = texture2D(textureColor, texCoord).rgba;\n#if !TEXTURE_ALPHA\nif (color.a<=0.9) {\ndiscard;\n}\n#endif\ncolor.rgb *= materialColor;\n#endif\n#if VERTEX_COLOR\ncolor *= vec4(vertexColorOut,1.0);\n#endif\n#else\n#if VERTEX_COLOR\ncolor = vec4(vertexColorOut,1.0);\n#else\ncolor = vec4(materialColor,1.0);\n#endif\n#endif\n#if TEXTURE_ALPHA\ncolor.a = texture2D(textureAlpha, texCoord).r;\n#if FX_DEPTH_ALPHA\nif (color.a < 0.9) discard;\n#else\n#if MATERIAL_ALPHA\ncolor.a *= materialAlpha;\n#else\nif (color.a < 0.9) discard;\n#endif\n#endif\n#else\n#if MATERIAL_ALPHA\ncolor.a = materialAlpha;\n#endif\n#endif\n#endif\nreturn color;\n}\nvec4 cubicvr_lighting(vec4 color_in, vec3 n, vec2 texCoord) {\nvec4 color = color_in;\n#if !LIGHT_DEPTH_PASS\nvec3 accum = lightAmbient;\n#if LIGHT_PERPIXEL\n#if LIGHT_IS_POINT\nvec3 specTotal = vec3(0.0,0.0,0.0);\nfor (int i = 0; i < LIGHT_COUNT; i++) {\nvec3 lightDirection = lightPosition[i]-vertexPositionOut.xyz;\nfloat dist = length(lightDirection);\nvec3 halfVector = normalize(vec3(0.0,0.0,1.0)+lightDirection);\nfloat NdotL = max(dot(normalize(lightDirection),n),0.0);\nif (NdotL > 0.0) {\nfloat att = clamp(((lightDistance[i]-dist)/lightDistance[i]), 0.0, 1.0)*lightIntensity[i];\naccum += att * NdotL * lightDiffuse[i] * materialDiffuse;\nfloat NdotHV = max(dot(n, halfVector),0.0);\n#if TEXTURE_SPECULAR\nvec3 spec2 = lightSpecular[i] * texture2D(textureSpecular, vec2(texCoord.s, texCoord.t)).rgb * pow(NdotHV,materialShininess);\n#else\nvec3 spec2 = lightSpecular[i] * materialSpecular * pow(NdotHV,materialShininess);\n#endif\nspecTotal += spec2;\n}\n}\ncolor.rgb *= accum;\ncolor.rgb += specTotal;\n#endif\n#if LIGHT_IS_DIRECTIONAL\nfloat NdotL;\nfloat NdotHV = 0.0;\nvec3 specTotal = vec3(0.0,0.0,0.0);\nvec3 spec2 = vec3(0.0,0.0,0.0);\nvec3 halfVector;\nfor (int i = 0; i < LIGHT_COUNT; i++) {\nhalfVector = normalize(vec3(0.0,0.0,1.0)-lightDirection[i]);\nNdotL = max(dot(normalize(-lightDirection[i]),n),0.0);\nif (NdotL > 0.0)   {\naccum += lightIntensity[i] * materialDiffuse * lightDiffuse[i] * NdotL;\nNdotHV = max(dot(n, halfVector),0.0);\n#if TEXTURE_SPECULAR\nspec2 = lightSpecular[i] * texture2D(textureSpecular, vec2(texCoord.s, texCoord.t)).rgb * pow(NdotHV,materialShininess);\n#else\nspec2 = lightSpecular[i] * materialSpecular * pow(NdotHV,materialShininess);\n#endif\nspecTotal += spec2;\n}\n}\ncolor.rgb *= accum;\ncolor.rgb += specTotal;\n#endif\n#if LIGHT_IS_AREA\nvec3 specTotal = vec3(0.0,0.0,0.0);\nvec3 spec2 = vec3(0.0,0.0,0.0);\nfloat NdotL;\nfloat NdotHV = 0.0;\nvec3 halfVector;\nfor (int i = 0; i < LIGHT_COUNT; i++) {\nhalfVector = normalize(vec3(0.0,0.0,1.0)-lightDirection[i]);\nNdotL = max(dot(normalize(-lightDirection[i]),n),0.0);\nif (NdotL > 0.0)   {\nNdotHV = max(dot(n, halfVector),0.0);\n#if LIGHT_SHADOWED\nvec4 shadowCoord = lightProjectionOut[i] / lightProjectionOut[i].w;\nshadowCoord.z = DepthRangeA(ConvertDepth3A(shadowCoord.z,lightDepthClip[i].x,lightDepthClip[i].y),lightDepthClip[i].x,lightDepthClip[i].y);\nvec4 shadowSample;\nfloat shadow = 1.0;\nif (shadowCoord.s > 0.000&&shadowCoord.s < 1.000 && shadowCoord.t > 0.000 && shadowCoord.t < 1.000) if (i == 0) { shadow = getShadowVal(lightShadowMap[0],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z);}\n#if LIGHT_COUNT>1\nif (i == 1) { shadow = getShadowVal(lightShadowMap[1],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z); }\n#endif\n#if LIGHT_COUNT>2\nif (i == 2) { shadow = getShadowVal(lightShadowMap[2],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z); }\n#endif\n#if LIGHT_COUNT>3\nif (i == 3) { shadow = getShadowVal(lightShadowMap[3],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z);  }\n#endif\n#if LIGHT_COUNT>4\nif (i == 4) { shadow = getShadowVal(lightShadowMap[4],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z);  }\n#endif\n#if LIGHT_COUNT>5\nif (i == 5) { shadow = getShadowVal(lightShadowMap[5],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z);  }\n#endif\n#if LIGHT_COUNT>6\nif (i == 6) { shadow = getShadowVal(lightShadowMap[6],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z);  }\n#endif\n#if LIGHT_COUNT>7\nif (i == 7) { shadow = getShadowVal(lightShadowMap[7],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z); }\n#endif\naccum += shadow * lightIntensity[i] * materialDiffuse * lightDiffuse[i] * NdotL;\n#else\naccum += lightIntensity[i] * materialDiffuse * lightDiffuse[i] * NdotL;\n#endif\n#if TEXTURE_SPECULAR\nspec2 = lightSpecular[i] * texture2D(textureSpecular, vec2(texCoord.s, texCoord.t)).rgb * pow(NdotHV,materialShininess);\n#else\nspec2 = lightSpecular[i] * materialSpecular * pow(NdotHV,materialShininess);\n#endif\n#if LIGHT_SHADOWED\nspec2 *= shadow;\n#endif\nspecTotal += spec2;\n#if LIGHT_SHADOWED\n#endif\n}\n}\ncolor.rgb *= accum;\ncolor.rgb += specTotal;\n#endif\n#if LIGHT_IS_SPOT\nvec3 specTotal = vec3(0.0,0.0,0.0);\nvec3 spec2 = vec3(0.0,0.0,0.0);\nvec3 halfVector;\nfloat spotEffect;\nfloat spotDot;\nfloat power;\nfor (int i = 0; i < LIGHT_COUNT; i++) {\nvec3 l = lightPosition[i]-vertexPositionOut.xyz;\nfloat dist = length(l);\nfloat att = clamp(((lightDistance[i]-dist)/lightDistance[i]), 0.0, 1.0)*lightIntensity[i];\natt = clamp(att,0.0,1.0);\nspotDot = dot(normalize(-l), normalize(lightDirection[i]));\nif ( spotDot < cos((lightCutOffAngle[i]/2.0)*(3.14159/180.0)) ) {\nspotEffect = 0.0;\n}\nelse {\nspotEffect = pow(spotDot, 1.0);\n}\n#if !LIGHT_IS_PROJECTOR\natt *= spotEffect;\n#endif\nvec3 v = normalize(-vertexPositionOut.xyz);\nvec3 h = normalize(l + v);\nfloat NdotL = max(0.0, dot(n, normalize(l)));\nfloat NdotH = max(0.0, dot(n, h));\nif (NdotL > 0.0) {\npower = pow(NdotH, materialShininess);\n}\nelse {\npower = 0.0;\n}\n#if LIGHT_SHADOWED\nvec4 shadowCoord = lightProjectionOut[i] / lightProjectionOut[i].w;\nshadowCoord.z = DepthRangeA(ConvertDepth3A(shadowCoord.z,lightDepthClip[i].x,lightDepthClip[i].y),lightDepthClip[i].x,lightDepthClip[i].y);\nvec4 shadowSample;\nfloat shadow = 1.0;\nif (shadowCoord.s >= 0.000&&shadowCoord.s <= 1.000 && shadowCoord.t >= 0.000 && shadowCoord.t <= 1.000) if (i == 0) { shadow = getShadowVal(lightShadowMap[0],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z);}\n#if LIGHT_COUNT>1\nif (i == 1) { shadow = getShadowVal(lightShadowMap[1],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z); }\n#endif\n#if LIGHT_COUNT>2\nif (i == 2) { shadow = getShadowVal(lightShadowMap[2],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z); }\n#endif\n#if LIGHT_COUNT>3\nif (i == 3) { shadow = getShadowVal(lightShadowMap[3],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z);  }\n#endif\n#if LIGHT_COUNT>4\nif (i == 4) { shadow = getShadowVal(lightShadowMap[4],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z);  }\n#endif\n#if LIGHT_COUNT>5\nif (i == 5) { shadow = getShadowVal(lightShadowMap[5],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z);  }\n#endif\n#if LIGHT_COUNT>6\nif (i == 6) { shadow = getShadowVal(lightShadowMap[6],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z);  }\n#endif\n#if LIGHT_COUNT>7\nif (i == 7) { shadow = getShadowVal(lightShadowMap[7],shadowCoord,lightProjectionOut[i].w,lightDepthClip[i].z); }\n#endif\natt = att * shadow;\n#endif\n#if LIGHT_IS_PROJECTOR && LIGHT_SHADOWED\nif (shadowCoord.s >= 0.0&&shadowCoord.s <= 1.0 && shadowCoord.t >= 0.0 && shadowCoord.t <= 1.0 && spotDot > cos((90.0)*(3.14159/180.0))) {\nvec3 projTex = texture2D(lightProjectionMap[i],shadowCoord.st).rgb;\naccum += att * projTex * lightIntensity[i] * materialDiffuse * lightDiffuse[i] * NdotL;\n}\n#else\naccum += att * lightDiffuse[i] * materialDiffuse * NdotL;\n#endif\n#if TEXTURE_SPECULAR\nspec2 = lightSpecular[i] * texture2D(textureSpecular, vec2(texCoord.s, texCoord.t)).rgb * power;\n#else\nspec2 = lightSpecular[i] * materialSpecular * power;\n#endif\n#if LIGHT_SHADOWED\nspec2 *= shadow;\n#endif\nspecTotal += spec2*spotEffect;\n}\ncolor.rgb *= accum;\ncolor.rgb += specTotal;\n#if LIGHT_SHADOWED\n#endif\n#endif\n#else\n#if LIGHT_IS_POINT||LIGHT_IS_DIRECTIONAL||LIGHT_IS_SPOT||LIGHT_IS_AREA\ncolor.rgb *= lightColorOut;\ncolor.rgb += lightSpecularOut;\n#endif\n#endif \n#if TEXTURE_AMBIENT\n#if LIGHT_IS_POINT||LIGHT_IS_DIRECTIONAL||LIGHT_IS_SPOT||LIGHT_IS_AREA\ncolor.rgb += texture2D(textureAmbient, texCoord).rgb*(vec3(1.0,1.0,1.0)+materialColor*materialAmbient);\n#else\ncolor.rgb = color.rgb*texture2D(textureAmbient, texCoord).rgb;\n#endif\n#else\n#if TEXTURE_COLOR\ncolor.rgb += materialAmbient*texture2D(textureColor, texCoord).rgb;\n#else\ncolor.rgb += materialColor*materialAmbient;\n#endif\n#endif\n#endif\n#if FOG_ENABLED\nreturn apply_fog(color);\n#else\nreturn color;\n#endif\n}\nvec4 cubicvr_environment(vec4 color_in, vec3 n, vec2 texCoord) {\nvec4 color = color_in;\n#if !LIGHT_DEPTH_PASS\n#if TEXTURE_REFLECT\nfloat environmentAmount = texture2D( textureReflect, texCoord).r;\n#endif\n#if TEXTURE_ENVSPHERE\n#if TEXTURE_NORMAL\nvec3 r = reflect( envTexCoordOut, n );\nfloat m = 2.0 * sqrt( r.x*r.x + r.y*r.y + (r.z+1.0)*(r.z+1.0) );\nvec3 coord;\ncoord.s = r.x/m + 0.5;\ncoord.t = r.y/m + 0.5;\n#if TEXTURE_REFLECT\ncolor.rgb += materialColor*texture2D( textureEnvSphere, coord.st).rgb * environmentAmount;\n#else\ncolor.rgb += materialColor*texture2D( textureEnvSphere, coord.st).rgb * materialEnvironment;\n#endif\n#else\n#if TEXTURE_REFLECT\ncolor.rgb += materialColor*texture2D( textureEnvSphere, envTexCoordOut).rgb * environmentAmount;\n#else\ncolor.rgb += materialColor*texture2D( textureEnvSphere, envTexCoordOut).rgb * materialEnvironment;\n#endif\n#endif\n#endif \n#endif \n#if FX_DEPTH_ALPHA\n#if !MATERIAL_ALPHA\nfloat linear_depth = DepthRange( ConvertDepth3(gl_FragCoord.z) );\ncolor.a = linear_depth;\n#endif\n#endif\nreturn color;\n}\n#if LIGHT_DEPTH_PASS\nvec4 cubicvr_depthPack(vec2 texCoord) {\n#if TEXTURE_ALPHA\nfloat alphaVal = texture2D(textureAlpha, texCoord).r;\nif (alphaVal < 0.9) discard;\n#endif\nreturn packFloatToVec4i(DepthRange( ConvertDepth3(gl_FragCoord.z)));\n}\n#endif\n#define customShader_splice 1\nvoid main(void)\n{\nvec2 texCoord = cubicvr_texCoord();\n#if !LIGHT_DEPTH_PASS\nvec4 color = cubicvr_color(texCoord);\nvec3 normal = cubicvr_normal(texCoord);\ncolor = cubicvr_environment(color,normal,texCoord);\ncolor = cubicvr_lighting(color,normal,texCoord);\ngl_FragColor = clamp(color,0.0,1.0);\n#else \ngl_FragColor = cubicvr_depthPack(texCoord);\n#endif\n}\n";