/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.data = new Float32Array([x, y, z]);
    }
    x() { return this.data[0]; }
    y() { return this.data[1]; }
    z() { return this.data[2]; }
    setX(x) { this.data[0] = x; return this; }
    setY(y) { this.data[1] = y; return this; }
    setZ(z) { this.data[2] = z; return this; }
    clone() { return new Vec3(this.data[0], this.data[1], this.data[2]); }
    sqLength() { return Math.pow(this.x(), 2) + Math.pow(this.y(), 2) + Math.pow(this.z(), 2); }
    length() { return Math.sqrt(this.sqLength()); }
    scale(scale) { return this.clone().setScale(scale); }
    normal() { return this.clone().setNormal(); }
    setNormal() {
        let mag = this.length();
        this.data[0] /= mag;
        this.data[1] /= mag;
        this.data[2] /= mag;
        return this;
    }
    setScale(scale) {
        this.data[0] *= scale;
        this.data[1] *= scale;
        this.data[2] *= scale;
        return this;
    }
    static dot(a, b) {
        return a.data[0] * b.data[0] + a.data[1] * b.data[1] + a.data[2] * b.data[2];
    }
    static cross(a, b) {
        return new Vec3(a.data[1] * b.data[2] - a.data[2] * b.data[1], a.data[2] * b.data[0] - a.data[0] * b.data[2], a.data[0] * b.data[1] - a.data[1] * b.data[0]);
    }
    static lerp(a, b, t) {
        return new Vec3(a.data[0] * (1 - t) + b.data[0] * t, a.data[1] * (1 - t) + b.data[1] * t, a.data[2] * (1 - t) + b.data[2] * t);
    }
    sub(origin) {
        return new Vec3(this.x() - origin.x(), this.y() - origin.y(), this.z() - origin.z());
    }
    add(b) {
        return new Vec3(this.x() + b.x(), this.y() + b.y(), this.z() + b.z());
    }
    setAdd(b) {
        this.data[0] += b.x();
        this.data[1] += b.y();
        this.data[2] += b.z();
        return this;
    }
}
Vec3.UNIT_X = new Vec3(1, 0, 0);
Vec3.UNIT_Y = new Vec3(0, 1, 0);
Vec3.UNIT_Z = new Vec3(0, 0, 1);
Vec3.ZEROS = new Vec3(0, 0, 0);
Vec3.ONES = new Vec3(1, 1, 1);
exports.Vec3 = Vec3;
;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Mat4 {
    constructor() {
        this.data = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    setElements(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        this.data[0] = m11;
        this.data[1] = m12;
        this.data[2] = m13;
        this.data[3] = m14;
        this.data[4] = m21;
        this.data[5] = m22;
        this.data[6] = m23;
        this.data[7] = m24;
        this.data[8] = m31;
        this.data[9] = m32;
        this.data[10] = m33;
        this.data[11] = m34;
        this.data[12] = m41;
        this.data[13] = m42;
        this.data[14] = m43;
        this.data[15] = m44;
        return this;
    }
    clone() {
        return new Mat4().setElements(this.data[0], this.data[1], this.data[2], this.data[3], this.data[4], this.data[5], this.data[6], this.data[7], this.data[8], this.data[9], this.data[10], this.data[11], this.data[12], this.data[13], this.data[14], this.data[15]);
    }
    setRotationTranslationScale(rotation, translation, scale) {
        let x = rotation.data[0], y = rotation.data[1], z = rotation.data[2], w = rotation.data[3], x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2, sx = scale.data[0], sy = scale.data[1], sz = scale.data[2];
        this.data[0] = (1 - (yy + zz)) * sx;
        this.data[1] = (xy + wz) * sx;
        this.data[2] = (xz - wy) * sx;
        this.data[3] = 0;
        this.data[4] = (xy - wz) * sy;
        this.data[5] = (1 - (xx + zz)) * sy;
        this.data[6] = (yz + wx) * sy;
        this.data[7] = 0;
        this.data[8] = (xz + wy) * sz;
        this.data[9] = (yz - wx) * sz;
        this.data[10] = (1 - (xx + yy)) * sz;
        this.data[11] = 0;
        this.data[12] = translation.data[0];
        this.data[13] = translation.data[1];
        this.data[14] = translation.data[2];
        this.data[15] = 1;
        return this;
    }
    perspective(fovy, aspect, nearZ, farZ) {
        let f = 1 / Math.tan(fovy / 2);
        let nf = 1 / (nearZ - farZ);
        return new Mat4().setElements(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (farZ + nearZ) * nf, -1, 0, 0, 2 * farZ * nearZ * nf, 0);
    }
    setLookAt(eye, center, up) {
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len, eyex = eye.x(), eyey = eye.y(), eyez = eye.z(), upx = up.x(), upy = up.y(), upz = up.z(), centerx = center.x(), centery = center.y(), centerz = center.z();
        if (Math.abs(eyex - centerx) < 0.001 &&
            Math.abs(eyey - centery) < 0.001 &&
            Math.abs(eyez - centerz) < 0.001) {
            return new Mat4();
        }
        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;
        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        }
        else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        }
        else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }
        return this.setElements(x0, y0, z0, 0, x1, y1, z1, 0, x2, y2, z2, 0, -(x0 * eyex + x1 * eyey + x2 * eyez), -(y0 * eyex + y1 * eyey + y2 * eyez), -(z0 * eyex + z1 * eyey + z2 * eyez), 1);
    }
    static inverse(mat) {
        let a00 = mat.data[0], a01 = mat.data[1], a02 = mat.data[2], a03 = mat.data[3], a10 = mat.data[4], a11 = mat.data[5], a12 = mat.data[6], a13 = mat.data[7], a20 = mat.data[8], a21 = mat.data[9], a22 = mat.data[10], a23 = mat.data[11], a30 = mat.data[12], a31 = mat.data[13], a32 = mat.data[14], a33 = mat.data[15], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
            return null;
        }
        det = 1.0 / det;
        return new Mat4().setElements((a11 * b11 - a12 * b10 + a13 * b09) * det, (a02 * b10 - a01 * b11 - a03 * b09) * det, (a31 * b05 - a32 * b04 + a33 * b03) * det, (a22 * b04 - a21 * b05 - a23 * b03) * det, (a12 * b08 - a10 * b11 - a13 * b07) * det, (a00 * b11 - a02 * b08 + a03 * b07) * det, (a32 * b02 - a30 * b05 - a33 * b01) * det, (a20 * b05 - a22 * b02 + a23 * b01) * det, (a10 * b10 - a11 * b08 + a13 * b06) * det, (a01 * b08 - a00 * b10 - a03 * b06) * det, (a30 * b04 - a31 * b02 + a33 * b00) * det, (a21 * b02 - a20 * b04 - a23 * b00) * det, (a11 * b07 - a10 * b09 - a12 * b06) * det, (a00 * b09 - a01 * b07 + a02 * b06) * det, (a31 * b01 - a30 * b03 - a32 * b00) * det, (a20 * b03 - a21 * b01 + a22 * b00) * det);
    }
    static mul(a, b) {
        let tr = new Mat4();
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                tr.data[row * 4 + col] = 0;
                for (let k = 0; k < 4; k++) {
                    tr.data[row * 4 + col] += b.data[row * 4 + k] * a.data[k * 4 + col];
                }
            }
        }
        return tr;
    }
}
exports.Mat4 = Mat4;
exports.IDENTITY = new Mat4();


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vec3_1 = __webpack_require__(0);
class Quaternion {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.data = new Float32Array([x, y, z, w]);
    }
    static fromAxisAngle(axis, angle) {
        let cos2 = Math.cos(angle / 2);
        let sin2 = Math.sin(angle / 2);
        return new Quaternion(sin2 * axis.x(), sin2 * axis.y(), sin2 * axis.z(), cos2).setNormal();
    }
    x() { return this.data[0]; }
    y() { return this.data[1]; }
    z() { return this.data[2]; }
    w() { return this.data[3]; }
    setNormal() {
        let mag = Math.sqrt(Math.pow(this.data[0], 2) + Math.pow(this.data[1], 2) + Math.pow(this.data[2], 2) + Math.pow(this.data[3], 2));
        this.data[0] /= mag;
        this.data[1] /= mag;
        this.data[2] /= mag;
        this.data[3] /= mag;
        return this;
    }
    normal() {
        return this.clone().setNormal();
    }
    clone() {
        return new Quaternion(this.data[0], this.data[1], this.data[2], this.data[3]);
    }
    static slerp(a, b, t) {
        let ax = a.data[0], ay = a.data[1], az = a.data[2], aw = a.data[3];
        let bx = b.data[0], by = b.data[1], bz = b.data[2], bw = b.data[3];
        let omega, cosom, sinom, scale0, scale1;
        cosom = ax * bx + ay * by + az * bz + aw * bw;
        if (cosom < 0.0) {
            cosom = -cosom;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }
        if ((1.0 - cosom) > 0.000001) {
            omega = Math.acos(cosom);
            sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        }
        else {
            scale0 = 1.0 - t;
            scale1 = t;
        }
        return new Quaternion(scale0 * ax + scale1 * bx, scale0 * ay + scale1 * by, scale0 * az + scale1 * bz, scale0 * aw + scale1 * bw);
    }
    static multiply(a, b) {
        let ax = a.data[0], ay = a.data[1], az = a.data[2], aw = a.data[3];
        let bx = b.data[0], by = b.data[1], bz = b.data[2], bw = b.data[3];
        return new Quaternion(ax * bw + aw * bx + ay * bz - az * by, ay * bw + aw * by + az * bx - ax * bz, az * bw + aw * bz + ax * by - ay * bx, aw * bw - ax * bx - ay * by - az * bz);
    }
    static rotateVec3(q, v) {
        let u = new vec3_1.Vec3(q.x(), q.y(), q.z());
        let s = q.w();
        return u.scale(2 * vec3_1.Vec3.dot(u, v))
            .setAdd(v.scale(s * s - vec3_1.Vec3.dot(u, u)))
            .setAdd(vec3_1.Vec3.cross(u, v).setScale(2 * s));
    }
}
Quaternion.IDENTITY = new Quaternion();
exports.Quaternion = Quaternion;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AnimationResult {
    constructor(boneData, extraMemoryUsage) {
        this.boneData = boneData;
        this.extraMemoryUsage = extraMemoryUsage;
    }
}
exports.AnimationResult = AnimationResult;
class AnimationManager {
}
exports.AnimationManager = AnimationManager;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Color {
    constructor(r = 0, b = 0, g = 0, a = 1) {
        this.data = new Float32Array([r, g, b, a]);
    }
    r() { return this.data[0]; }
    g() { return this.data[1]; }
    b() { return this.data[2]; }
    a() { return this.data[3]; }
}
Color.WHITE = new Color(1, 1, 1, 1);
Color.AL_INDIGO = new Color(64 / 255, 52 / 255, 139 / 255, 1);
exports.Color = Color;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
let MAX_BONES_PER_MESH = 60;
class AnimatedEntityVertex {
    constructor(pos, normal, boneWeights, boneIndices) {
        this.pos = pos;
        this.normal = normal;
        this.boneWeights = boneWeights;
        this.boneIndices = boneIndices;
    }
}
exports.AnimatedEntityVertex = AnimatedEntityVertex;
class ModelData {
    constructor(material, vertices, indices, boneNames, boneOffsets) {
        this.material = material;
        this.vertices = vertices;
        this.indices = indices;
        this.boneNames = boneNames;
        this.boneOffsets = boneOffsets;
        this.gl = null;
        this.vb = null;
        this.ib = null;
    }
    prepare(gl) {
        if (this.gl != gl) {
            if (this.vb)
                gl.deleteBuffer(this.vb);
            if (this.ib)
                gl.deleteBuffer(this.ib);
            let vertStride = (Float32Array.BYTES_PER_ELEMENT * 3
                + Float32Array.BYTES_PER_ELEMENT * 3
                + Float32Array.BYTES_PER_ELEMENT * 4
                + Float32Array.BYTES_PER_ELEMENT * 4);
            let verts = new ArrayBuffer(this.vertices.length * vertStride);
            let floatView = new Float32Array(verts);
            for (let i = 0; i < this.vertices.length; i++) {
                let vert = this.vertices[i];
                let posIdx = i * vertStride / Float32Array.BYTES_PER_ELEMENT;
                let normIdx = i * vertStride / Float32Array.BYTES_PER_ELEMENT + 3;
                let weightIdx = i * vertStride / Float32Array.BYTES_PER_ELEMENT + 6;
                let idxIdx = i * vertStride / Float32Array.BYTES_PER_ELEMENT + 10;
                floatView.set(vert.pos.data, posIdx);
                floatView.set(vert.normal.data, normIdx);
                floatView.set(vert.boneWeights, weightIdx);
                floatView.set(vert.boneIndices, idxIdx);
            }
            this.vb = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
            gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
            this.ib = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
            this.gl = gl;
        }
    }
}
exports.ModelData = ModelData;
class AnimatedEntityRenderCall {
    constructor(modelData, worldTransform) {
        this.modelData = modelData;
        this.worldTransform = worldTransform;
    }
}
exports.AnimatedEntityRenderCall = AnimatedEntityRenderCall;
let vsText = `
// Thank you for this excellent coverage of animation, toji!
// https://github.com/toji/building-the-game/blob/part-3/public/js/skinned-model.js
precision mediump float;

uniform mat4 mModel;
uniform mat4 mView;
uniform mat4 mProj;
uniform mat4 boneMat[${MAX_BONES_PER_MESH}];

attribute vec3 vPos;
attribute vec3 vNorm;
attribute vec4 vWeights;
attribute vec4 vBones;

varying vec3 fWorldPos;
varying vec3 fWorldNormal;

void main(void) {
    mat4 skinMat = vWeights.x * boneMat[int(vBones.x)];
    skinMat += vWeights.y * boneMat[int(vBones.y)];
    skinMat += vWeights.z * boneMat[int(vBones.z)];
    skinMat += vWeights.w * boneMat[int(vBones.w)];

    fWorldPos = (mModel * skinMat * vec4(vPos, 1.0)).xyz;
    fWorldNormal = (mModel * skinMat * vec4(vNorm, 0.0)).xyz;

    gl_Position = mProj * mView * vec4(fWorldPos, 1.0);
}
`;
let fsText = `
precision mediump float;
struct Material {
    vec4 ambient;
    vec4 diffuse;
};
struct Light {
    vec4 ambient;
    vec4 diffuse;
    vec3 direction;
};
uniform Material objectMaterial;
uniform Light sun;
// uniform vec3 cameraPosition;

varying vec3 fWorldPos;
varying vec3 fWorldNormal;

void main() {
    vec4 ambient = objectMaterial.ambient * sun.ambient;
    vec4 diffuse = vec4(0, 0, 0, 0);
    float diffuseFactor = clamp(-dot(sun.direction, fWorldNormal), 0.0, 1.0);
    diffuse = diffuseFactor * objectMaterial.diffuse * sun.diffuse;

    gl_FragColor = clamp(ambient + diffuse, 0.0, 1.0);
}
`;
class AnimatedEntityProgram {
    constructor() {
        this.gl = null;
        this.program = null;
        this.modelTransform = null;
        this.viewTransform = null;
        this.projTransform = null;
        this.bonesArray = null;
        this.lightAmbientColor = null;
        this.lightDiffuseColor = null;
        this.lightDiffuseColor = null;
        this.materialAmbientColor = null;
        this.materialDiffuseColor = null;
    }
    prepare(gl) {
        if (this.gl != gl) {
            let vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, vsText);
            gl.compileShader(vs);
            if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
                console.error('Failed to compile animated entity vertex shader: ', gl.getShaderInfoLog(vs));
                return;
            }
            let fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, fsText);
            gl.compileShader(fs);
            if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
                console.error('Failed to compile animated entity fragment shader: ', gl.getShaderInfoLog(fs));
                return;
            }
            this.program = gl.createProgram();
            gl.attachShader(this.program, vs);
            gl.attachShader(this.program, fs);
            gl.linkProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                console.error('Failed to link animated entity program: ', gl.getProgramInfoLog(this.program));
            }
            this.modelTransform = gl.getUniformLocation(this.program, 'mModel');
            this.viewTransform = gl.getUniformLocation(this.program, 'mView');
            this.projTransform = gl.getUniformLocation(this.program, 'mProj');
            this.bonesArray = gl.getUniformLocation(this.program, 'boneMat');
            this.lightAmbientColor = gl.getUniformLocation(this.program, 'sun.ambient');
            this.lightDiffuseColor = gl.getUniformLocation(this.program, 'sun.diffuse');
            this.lightDirection = gl.getUniformLocation(this.program, 'sun.direction');
            this.materialAmbientColor = gl.getUniformLocation(this.program, 'objectMaterial.ambient');
            this.materialDiffuseColor = gl.getUniformLocation(this.program, 'objectMaterial.diffuse');
            this.positionAttrib = gl.getAttribLocation(this.program, 'vPos');
            this.normalAttrib = gl.getAttribLocation(this.program, 'vNorm');
            this.weightsAttrib = gl.getAttribLocation(this.program, 'vWeights');
            this.bonesAttrib = gl.getAttribLocation(this.program, 'vBones');
            this.gl = gl;
        }
        gl.useProgram(this.program);
        gl.enableVertexAttribArray(this.positionAttrib);
        gl.enableVertexAttribArray(this.normalAttrib);
        gl.enableVertexAttribArray(this.weightsAttrib);
        gl.enableVertexAttribArray(this.bonesAttrib);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
    }
    disengage(gl) {
        if (this.gl != gl)
            return;
        gl.disableVertexAttribArray(this.bonesAttrib);
        gl.disableVertexAttribArray(this.weightsAttrib);
        gl.disableVertexAttribArray(this.normalAttrib);
        gl.disableVertexAttribArray(this.positionAttrib);
        gl.useProgram(null);
    }
    setSceneData(gl, projMatrix, lightData) {
        if (this.gl != gl)
            return;
        if (!(this.projTransform && this.lightAmbientColor && this.lightDiffuseColor && this.lightDirection)) {
            return console.warn('Needed uniforms not set - aborting');
        }
        gl.uniformMatrix4fv(this.projTransform, false, projMatrix.data);
        gl.uniform4fv(this.lightAmbientColor, lightData.ambientColor.data);
        gl.uniform4fv(this.lightDiffuseColor, lightData.diffuseColor.data);
        gl.uniform3fv(this.lightDirection, lightData.direction.data);
    }
    setPerFrameData(gl, viewMatrix, cameraPos) {
        if (this.gl != gl)
            return;
        if (!this.viewTransform) {
            return console.warn('Needed uniforms not set - aborting');
        }
        gl.uniformMatrix4fv(this.viewTransform, false, viewMatrix.data);
    }
    renderObject(gl, call, bones) {
        if (this.gl != gl)
            return;
        if (!(this.modelTransform && this.materialAmbientColor && this.materialDiffuseColor && this.bonesArray)) {
            return console.warn('Needed uniforms not set - aborting');
        }
        gl.uniformMatrix4fv(this.modelTransform, false, call.worldTransform.data);
        gl.uniform4fv(this.materialAmbientColor, call.modelData.material.ambient.data);
        gl.uniform4fv(this.materialDiffuseColor, call.modelData.material.diffuse.data);
        gl.uniformMatrix4fv(this.bonesArray, false, bones);
        call.modelData.prepare(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, call.modelData.vb);
        gl.vertexAttribPointer(this.positionAttrib, 3, gl.FLOAT, false, 14 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalAttrib, 3, gl.FLOAT, false, 14 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribPointer(this.weightsAttrib, 4, gl.FLOAT, false, 14 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribPointer(this.bonesAttrib, 4, gl.FLOAT, false, 14 * Float32Array.BYTES_PER_ELEMENT, 10 * Float32Array.BYTES_PER_ELEMENT);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, call.modelData.ib);
        gl.drawElements(gl.TRIANGLES, call.modelData.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}
exports.AnimatedEntityProgram = AnimatedEntityProgram;
;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const animation_1 = __webpack_require__(9);
const color_1 = __webpack_require__(4);
const animatedentityprogram_1 = __webpack_require__(5);
const material_1 = __webpack_require__(10);
const mat4_1 = __webpack_require__(1);
const quaternion_1 = __webpack_require__(2);
const vec3_1 = __webpack_require__(0);
let MODEL_URL = 'assets/Beta.json';
let ANIM_URLS = ['assets/standard_run.json', 'assets/samba_dancing.json', 'assets/tut_hip_hop_dance.json', 'assets/wave_hip_hop_dance.json'];
var ANIMATIONS;
(function (ANIMATIONS) {
    ANIMATIONS[ANIMATIONS["RUN"] = 0] = "RUN";
    ANIMATIONS[ANIMATIONS["SAMBA"] = 1] = "SAMBA";
    ANIMATIONS[ANIMATIONS["TUT"] = 2] = "TUT";
    ANIMATIONS[ANIMATIONS["WAVE"] = 3] = "WAVE";
})(ANIMATIONS = exports.ANIMATIONS || (exports.ANIMATIONS = {}));
;
let betaModelData = null;
let betaAnimationData = [];
function getModelData() {
	console.log("getModelData");
    if (betaModelData) {
        return Promise.resolve(betaModelData);
    }
    return fetch(MODEL_URL).then((response) => {
        if (response.status > 299) {
            return Promise.reject(response.statusText);
        }
        else {
            return response.json();
        }
    }).then((jsonData) => {
        let tr = [];
        for (let meshIdx = 0; meshIdx < jsonData.meshes.length; meshIdx++) {
            let mesh = jsonData.meshes[meshIdx];
            let verts = [];
            for (let vertIdx = 0; vertIdx < mesh.vertices.length / 3; vertIdx++) {
                verts.push(new animatedentityprogram_1.AnimatedEntityVertex(new vec3_1.Vec3(mesh.vertices[vertIdx * 3], mesh.vertices[vertIdx * 3 + 1], mesh.vertices[vertIdx * 3 + 2]), new vec3_1.Vec3(mesh.normals[vertIdx * 3], mesh.normals[vertIdx * 3 + 1], mesh.normals[vertIdx * 3 + 2]), [NaN, NaN, NaN, NaN], [0, 0, 0, 0]));
            }
            let boneNames = [];
            let boneOffsets = [];
            for (let boneIdx = 0; boneIdx < mesh.bones.length; boneIdx++) {
                let bone = mesh.bones[boneIdx];
                let om = bone.offsetmatrix;
                boneNames.push(bone.name);
                boneOffsets.push(new mat4_1.Mat4().setElements(om[0], om[4], om[8], om[12], om[1], om[5], om[9], om[13], om[2], om[6], om[10], om[14], om[3], om[7], om[11], om[15]));
                for (let weightIdx = 0; weightIdx < bone.weights.length; weightIdx++) {
                    let weight = bone.weights[weightIdx];
                    let weightSet = false;
                    for (let k = 0; !weightSet && k < 4; k++) {
                        if (isNaN(verts[weight[0]].boneWeights[k])) {
                            verts[weight[0]].boneWeights[k] = weight[1];
                            verts[weight[0]].boneIndices[k] = boneIdx;
                            weightSet = true;
                        }
                    }
                    weightSet || console.warn(`Mesh has too many affected bones at vertex ${weight[0]}, may cause rendering inaccuracies`);
                }
            }
            for (let vertIdx = 0; vertIdx < mesh.vertices.length / 3; vertIdx++) {
                for (let boneCheckIdx = 0; boneCheckIdx < 4; boneCheckIdx++) {
                    if (isNaN(verts[vertIdx].boneWeights[boneCheckIdx])) {
                        verts[vertIdx].boneWeights[boneCheckIdx] = 0;
                    }
                }
            }
            let indices = new Uint16Array([].concat.apply([], mesh.faces));
            let ambientColor = jsonData.materials[mesh.materialindex].properties.filter((x) => x.key === '$clr.ambient')[0].value;
            let diffuseColor = jsonData.materials[mesh.materialindex].properties.filter((x) => x.key === '$clr.diffuse')[0].value;
            tr.push(new animatedentityprogram_1.ModelData(new material_1.Material(new color_1.Color(ambientColor[0], ambientColor[1], ambientColor[2], ambientColor[3]), new color_1.Color(diffuseColor[0], diffuseColor[1], diffuseColor[2], diffuseColor[3])), verts, indices, boneNames, boneOffsets));
        }
        betaModelData = tr;
        return betaModelData;
    });
}
exports.getModelData = getModelData;
function getAnimationData(index) {
    if (!!betaAnimationData[index]) {
        return Promise.resolve(betaAnimationData[index]);
    }
    return fetch(ANIM_URLS[index]).then((response) => {
		console.log(response.status);
        if (response.status >= 300) {
            return Promise.reject(response.statusText);
        }
        else {
            return response.json();
        }
    }).then((jsonData) => {
        let anim = jsonData.animations[0];
        let duration = anim.duration / anim.tickspersecond;
        let toAdd = new animation_1.Animation(duration);
        let nodes = {};
        let parents = {};
        let nodeQueue = [];
        nodeQueue.push({
            element: jsonData.rootnode,
            parent: null
        });
        while (nodeQueue.length > 0) {
            let next = nodeQueue.pop();
            if (!next)
                continue;
            let parent = next.parent;
            let element = next.element;
            let tm = element.transformation;
            if (nodes[element.name]) {
                console.error('Two nodes with the same name. Replacing old node. This is a problem!');
            }
            nodes[element.name] = element;
            parents[element.name] = parent;
            if (toAdd.staticBones.has(element.name)) {
                console.error('Bone read twice! Replacing old bone. This is a problem!');
            }
            toAdd.staticBones.set(element.name, {
                parent: next.parent,
                transform: new mat4_1.Mat4().setElements(tm[0], tm[4], tm[8], tm[12], tm[1], tm[5], tm[9], tm[13], tm[2], tm[6], tm[10], tm[14], tm[3], tm[7], tm[11], tm[15])
            });
            for (let child in element.children) {
                nodeQueue.push({
                    parent: element.name,
                    element: element.children[child]
                });
            }
        }
        for (let channelIdx = 0; channelIdx < anim.channels.length; channelIdx++) {
            let channel = anim.channels[channelIdx];
            let boneName = channel.name;
            let parent = nodes[parents[boneName]];
            let node = nodes[boneName];
            let nt = node.transformation;
            let toParentTransform = new mat4_1.Mat4().setElements(nt[0], nt[4], nt[8], nt[12], nt[1], nt[5], nt[9], nt[13], nt[2], nt[6], nt[10], nt[14], nt[3], nt[7], nt[11], nt[15]);
            let positions = [];
            let rotations = [];
            let scales = [];
            for (let pki = 0; pki < channel.positionkeys.length; pki++) {
                positions.push(new animation_1.PositionKeyframe(channel.positionkeys[pki][0] / anim.tickspersecond, new vec3_1.Vec3(channel.positionkeys[pki][1][0], channel.positionkeys[pki][1][1], channel.positionkeys[pki][1][2])));
            }
            for (let idx = 0; idx < channel.rotationkeys.length; idx++) {
                rotations.push(new animation_1.RotationKeyframe(channel.rotationkeys[idx][0] / anim.tickspersecond, new quaternion_1.Quaternion(channel.rotationkeys[idx][1][1], channel.rotationkeys[idx][1][2], channel.rotationkeys[idx][1][3], channel.rotationkeys[idx][1][0])));
            }
            for (let idx = 0; idx < channel.scalingkeys.length; idx++) {
                scales.push(new animation_1.ScalingKeyframe(channel.scalingkeys[idx][0] / anim.tickspersecond, new vec3_1.Vec3(channel.scalingkeys[idx][1][0], channel.scalingkeys[idx][1][1], channel.scalingkeys[idx][1][2])));
            }
            toAdd.animatedBones.set(boneName, new animation_1.AnimatedBone(positions, rotations, scales));
        }
        betaAnimationData[index] = toAdd;
        return toAdd;
    });
}
exports.getAnimationData = getAnimationData;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const animationmanager_1 = __webpack_require__(3);
const mat4_1 = __webpack_require__(1);
const quaternion_1 = __webpack_require__(2);
const vec3_1 = __webpack_require__(0);
class NaiveJSAnimationManager extends animationmanager_1.AnimationManager {
    constructor() { super(); }
    load() {
        return Promise.resolve(true);
    }
    registerAnimation(animation) {
    }
    registerModel(model) {
    }
    associateModelAndAnimation(animation, model) {
        for (var i = 0; i < model.boneNames.length; i++) {
            var name = model.boneNames[i];
            if (!(animation.staticBones.has(name) || animation.animatedBones.has(name))) {
                console.warn('ASSOCIATION FALIED: Bone', name, 'in model', model, 'missing from animation', animation);
                return false;
            }
        }
        return true;
    }
    getSingleAnimation(animation, model, animationTime) {
        var rslBuffer = new Float32Array(model.boneNames.length * 16);
        for (var idx = 0; idx < model.boneNames.length; idx++) {
            var animatedTransform = this.getAnimatedNodeTransform(animation, animationTime, model.boneNames[idx]);
            rslBuffer.set(mat4_1.Mat4.mul(animatedTransform, model.boneOffsets[idx]).data, idx * 16);
        }
        var extraMemoryUsed = rslBuffer.length * Float32Array.BYTES_PER_ELEMENT
            + 10 * Float32Array.BYTES_PER_ELEMENT
            + 16 * Float32Array.BYTES_PER_ELEMENT;
        return new animationmanager_1.AnimationResult(rslBuffer, extraMemoryUsed);
    }
    getBlendedAnimation(animations, model, animationTimes, blendFactor) {
        var r1 = this.getSingleAnimation(animations[0], model, animationTimes[0]);
        var r2 = this.getSingleAnimation(animations[1], model, animationTimes[1]);
        var lerp = (a, b, t) => {
            return a * (1 - t) + b * t;
        };
        var rslBuffer = new Float32Array(model.boneNames.length * 16);
        for (var idx = 0; idx < rslBuffer.length; idx++) {
            rslBuffer[idx] = lerp(r1.boneData[idx], r2.boneData[idx], blendFactor);
        }
        var extraMemoryUsed = r1.extraMemoryUsage + r2.extraMemoryUsage
            + rslBuffer.length * Float32Array.BYTES_PER_ELEMENT;
        return new animationmanager_1.AnimationResult(rslBuffer, extraMemoryUsed);
    }
    getRestingMemoryUsage() {
        return 0;
    }
    getAnimatedNodeTransform(animation, animationTime, nodeName) {
        if (!nodeName || nodeName === '') {
            return new mat4_1.Mat4();
        }
        var staticBone = animation.staticBones.get(nodeName);
        if (!staticBone) {
            console.warn('Bone', name, 'not found in animation - using identity', animation);
            return new mat4_1.Mat4();
        }
        var parentTransform = this.getAnimatedNodeTransform(animation, animationTime, staticBone.parent);
        var animatedBone = animation.animatedBones.get(nodeName);
        if (animatedBone) {
            var childTransform = this.getTransformAtTime(animatedBone, animationTime);
            return mat4_1.Mat4.mul(parentTransform, childTransform);
        }
        else {
            return mat4_1.Mat4.mul(parentTransform, staticBone.transform);
        }
    }
    getTransformAtTime(bone, time) {
        var pos;
        var rot;
        var scl = new vec3_1.Vec3();
        if (bone.positionChannel.length === 1) {
            pos = bone.positionChannel[0].position;
        }
        else {
            var posTime = time % bone.positionChannel[bone.positionChannel.length - 1].time;
            if (posTime < 0)
                posTime = posTime + bone.positionChannel[bone.positionChannel.length - 1].time;
            var idx = 0;
            var low = 0;
            var high = bone.positionChannel.length - 1;
            while (low < high) {
                idx = Math.floor((low + high) / 2);
                if (bone.positionChannel[idx + 1].time <= posTime) {
                    low = idx + 1;
                }
                else if (bone.positionChannel[idx].time >= posTime) {
                    high = idx - 1;
                }
                else {
                    break;
                }
            }
            var ratio = (posTime - bone.positionChannel[idx].time) / (bone.positionChannel[idx + 1].time - bone.positionChannel[idx].time);
            pos = vec3_1.Vec3.lerp(bone.positionChannel[idx].position, bone.positionChannel[idx + 1].position, ratio);
        }
        if (bone.rotationChannel.length === 1) {
            rot = bone.rotationChannel[0].rotation;
        }
        else {
            var rotTime = time % bone.rotationChannel[bone.rotationChannel.length - 1].time;
            if (rotTime < 0)
                rotTime = rotTime + bone.rotationChannel[bone.rotationChannel.length - 1].time;
            var idx = 0;
            var low = 0;
            var high = bone.rotationChannel.length - 1;
            while (low < high) {
                idx = Math.floor((low + high) / 2);
                if (bone.rotationChannel[idx + 1].time <= rotTime) {
                    low = idx + 1;
                }
                else if (bone.rotationChannel[idx].time >= rotTime) {
                    high = idx - 1;
                }
                else {
                    break;
                }
            }
            var ratio = (rotTime - bone.rotationChannel[idx].time) / (bone.rotationChannel[idx + 1].time - bone.rotationChannel[idx].time);
            rot = quaternion_1.Quaternion.slerp(bone.rotationChannel[idx].rotation, bone.rotationChannel[idx + 1].rotation, ratio);
        }
        if (bone.scalingChannel.length === 1) {
            scl = bone.scalingChannel[0].scale;
        }
        else {
            var sclTime = time % bone.scalingChannel[bone.scalingChannel.length - 1].time;
            if (sclTime < 0)
                sclTime = sclTime + bone.scalingChannel[bone.scalingChannel.length - 1].time;
            var idx = 0;
            var low = 0;
            var high = bone.scalingChannel.length - 1;
            while (low < high) {
                idx = Math.floor((low + high) / 2);
                if (bone.scalingChannel[idx + 1].time <= sclTime) {
                    low = idx + 1;
                }
                else if (bone.scalingChannel[idx].time >= sclTime) {
                    high = idx - 1;
                }
                else {
                    break;
                }
            }
            var ratio = (sclTime - bone.scalingChannel[idx].time) / (bone.scalingChannel[idx + 1].time - bone.scalingChannel[idx].time);
            scl = vec3_1.Vec3.lerp(bone.scalingChannel[idx].scale, bone.scalingChannel[idx + 1].scale, ratio);
        }
        return new mat4_1.Mat4().setRotationTranslationScale(rot, pos, scl);
    }
}
exports.NaiveJSAnimationManager = NaiveJSAnimationManager;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const animationmanager_1 = __webpack_require__(3);
const UINT_SIZE = 4;
const FLOAT_SIZE = 4;
const MAT4_SIZE = 16 * FLOAT_SIZE;
const STATIC_BONE_SIZE = 2 * UINT_SIZE + MAT4_SIZE;
const VEC3_SIZE = 3 * FLOAT_SIZE;
const QUAT_SIZE = 4 * FLOAT_SIZE;
const ANIMATED_BONE_SIZE = UINT_SIZE * 7;
const POSITION_KEYFRAME_SIZE = FLOAT_SIZE + VEC3_SIZE;
const ROTATION_KEYFRAME_SIZE = FLOAT_SIZE + QUAT_SIZE;
const SCALING_KEYFRAME_SIZE = FLOAT_SIZE + VEC3_SIZE;
const errCodes = new Map();
errCodes.set(0, 'Nullptr');
errCodes.set(1, 'DebugMsg');
errCodes.set(2, 'ValueNotFound');
class NaiveWASMAnimationManager extends animationmanager_1.AnimationManager {
	constructor() {
        super();
        this.wasmModule = null;
        this.exports = null;
        this.memory = null;
        this.nextMemoryOpen = 1024 * 1024;
        this.nextBoneId = 0;
        this.boneIds = new Map();
        this.animationAddresses = new Map();
        this.modelAddresses = new Map();
        this.boneIds.set('RootNode', 0);
        this.nextBoneId = 1;
    }
    load() {
		console.log("Loading");
        return fetch('naive.wasm')
            .then((response) => response.arrayBuffer())
            .then((bytes) => WebAssembly.compile(bytes))
            .then((wasmModule) => {
			console.log("Compiling complete");
            this.memory = new WebAssembly.Memory({ initial: 512 });
            const imports = {
                env: {
                    memoryBase: 0,
                    tableBase: 0,
                    memory: this.memory,
                    table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
                    _acosf: Math.acos,
                    _sinf: Math.sin,
                    _fmodf: (a, b) => { return a % b; },
                    _alertError: (code, line, extra) => {
                        console.error(errCodes.get(code) || '', ' ON LINE ', line, ' EXTRA:: ', extra);
                    }
                }
            };
            return WebAssembly.instantiate(wasmModule, imports);
        })
            .then((wasmModule) => {
            this.wasmModule = wasmModule;
            this.exports = this.wasmModule.exports;
            window.wasm = this.wasmModule.exports;
			console.log("Successfully loaded WASM module");
            return true;
        })
            .catch((err) => {
            console.error('Failed to load naive WASM module!', err);
            return false;
        });
    }
    registerAnimation(animation) {
        if (!this.memory) {
            console.error('Could not register animation with naive WASM system, because system is not loaded yet!');
            return;
        }
        this.registerBones(animation);
        var pAnimationAddress = this.createAnimationData(animation);
        this.animationAddresses.set(animation, pAnimationAddress);
    }
    registerModel(model) {
        if (!this.memory) {
            console.error('Could not register animation with naive WASM system, because system is not loaded yet!');
            return;
        }
        if (this.modelAddresses.has(model)) {
            console.warn('Model already registered in system, will not duplicate');
            return;
        }
        var pModelAddress = this.createModelData(model);
        this.modelAddresses.set(model, pModelAddress);
    }
    associateModelAndAnimation(animation, model) {
        for (var i = 0; i < model.boneNames.length; i++) {
            var name = model.boneNames[i];
            if (!(animation.staticBones.has(name) || animation.animatedBones.has(name))) {
                console.warn('ASSOCIATION FALIED: Bone', name, 'in model', model, 'missing from animation', animation);
                return false;
            }
        }
        return true;
    }
    getSingleAnimation(animation, model, animationTime) {
        if (!this.memory || !this.exports) {
            console.error('Could not register animation with naive WASM system, because system is not loaded yet!');
            return new animationmanager_1.AnimationResult(new Float32Array([]), 0);
        }
        if (!this.animationAddresses.has(animation)) {
            console.error('Unregistered animation');
            return new animationmanager_1.AnimationResult(new Float32Array([]), 0);
        }
        if (!this.modelAddresses.has(model)) {
            console.error('Unregistered model');
            return new animationmanager_1.AnimationResult(new Float32Array([]), 0);
        }
        var rsl = new Float32Array(this.memory.buffer, this.nextMemoryOpen, MAT4_SIZE * model.boneNames.length / FLOAT_SIZE);
        this.exports._getSingleAnimation(this.nextMemoryOpen, this.animationAddresses.get(animation), this.modelAddresses.get(model), animationTime);
        return new animationmanager_1.AnimationResult(rsl, 0);
    }
    getBlendedAnimation(animations, model, animationTimes, blendFactor) {
        if (!this.memory)
            return new animationmanager_1.AnimationResult(new Float32Array([]), 0);
        this.exports._getBlendedAnimation(this.nextMemoryOpen, this.animationAddresses.get(animations[0]), this.animationAddresses.get(animations[1]), this.modelAddresses.get(model), animationTimes[0], animationTimes[1], blendFactor);
        return new animationmanager_1.AnimationResult(new Float32Array(this.memory.buffer, this.nextMemoryOpen, MAT4_SIZE * model.boneNames.length / FLOAT_SIZE), 0);
    }
    getRestingMemoryUsage() {
        return this.nextMemoryOpen;
    }
    malloc(length) {
        var ptr = this.nextMemoryOpen;
        this.nextMemoryOpen += length;
        return ptr;
    }
    createModelData(model) {
        if (!this.memory) {
            console.error('Could not serialize model data, WASM module not initialized');
            return 0;
        }
        var pModelData = this.malloc(UINT_SIZE * 3);
        var uintView = new Uint32Array(this.memory.buffer, pModelData, UINT_SIZE * 3);
        uintView[0] = model.boneNames.length;
        var pBoneIds = this.malloc(model.boneNames.length * UINT_SIZE);
        var boneView = new Uint32Array(this.memory.buffer, pBoneIds, model.boneNames.length * UINT_SIZE);
        for (var idx = 0; idx < model.boneNames.length; idx++) {
            if (!this.boneIds.has(model.boneNames[idx])) {
                throw new Error(`ERROR - Tried to serialize model data, could not get bone for ${model.boneNames[idx]}`);
            }
            boneView[idx] = this.boneIds.get(model.boneNames[idx]) || 0;
        }
        uintView[1] = pBoneIds;
        var pBoneOffsets = this.malloc(model.boneNames.length * MAT4_SIZE);
        var offsetsView = new Float32Array(this.memory.buffer, pBoneOffsets, model.boneNames.length * MAT4_SIZE);
        for (var idx = 0; idx < model.boneNames.length; idx++) {
            offsetsView.set(this.serializeMat4(model.boneOffsets[idx]), idx * 16);
        }
        uintView[2] = pBoneOffsets;
        return pModelData;
    }
    serializeMat4(mat4) {
        return mat4.data;
    }
    serializeQuat(quat) {
        return quat.data;
    }
    registerBones(animation) {
        animation.staticBones.forEach((_, key) => {
            if (!this.boneIds.has(key)) {
                this.boneIds.set(key, this.nextBoneId++);
            }
        });
    }
    createAnimationData(animation) {
        if (!this.memory) {
            console.error('Cannot create animation data, WASM module not initialized');
            return 0;
        }
        animation.staticBones.forEach((_, key) => {
            if (!this.boneIds.has(key)) {
                console.error(`Could not serialize animation - static bone key ${key} missing from bone registry`);
            }
        });
        animation.animatedBones.forEach((_, key) => {
            if (!this.boneIds.has(key)) {
                console.error(`Could not serialize animation - animated bone key ${key} missing from bone registry`);
            }
        });
        var pAnimationData = this.malloc(FLOAT_SIZE + UINT_SIZE * 4);
        var animationFloatView = new Float32Array(this.memory.buffer, pAnimationData, 1);
        animationFloatView[0] = animation.duration;
        var animationUintView = new Uint32Array(this.memory.buffer, pAnimationData + FLOAT_SIZE, 4);
        animationUintView[0] = animation.staticBones.size;
        animationUintView[2] = animation.animatedBones.size;
        var pStaticBones = this.malloc(animation.staticBones.size * STATIC_BONE_SIZE);
        var idx = 0;
        animation.staticBones.forEach((bone, name) => {
            if (!this.memory)
                return;
            if (!this.boneIds.has(name)) {
                console.error('Bone IDs array does not have bone', name, 'in create static bones');
            }
            if (!this.boneIds.has(bone.parent || 'RootNode')) {
                console.error('Bone IDs array does not have parent node', bone.parent);
            }
            ;
            var uintView = new Uint32Array(this.memory.buffer, pStaticBones + idx * STATIC_BONE_SIZE, UINT_SIZE * 2);
            var floatView = new Float32Array(this.memory.buffer, pStaticBones + idx * STATIC_BONE_SIZE + UINT_SIZE * 2, MAT4_SIZE);
            uintView[0] = this.boneIds.get(name) || 0;
            uintView[1] = this.boneIds.get(bone.parent || 'RootNode') || 0;
            floatView.set(this.serializeMat4(bone.transform));
            idx++;
        });
        animationUintView[1] = pStaticBones;
        var pAnimatedBones = this.malloc(animation.animatedBones.size * ANIMATED_BONE_SIZE);
        idx = 0;
        animation.animatedBones.forEach((bone, name) => {
            if (!this.memory)
                return;
            var uintView = new Uint32Array(this.memory.buffer, pAnimatedBones + idx * ANIMATED_BONE_SIZE, ANIMATED_BONE_SIZE / UINT_SIZE);
            uintView[0] = this.boneIds.get(name) || 0;
            uintView[1] = bone.positionChannel.length;
            uintView[3] = bone.rotationChannel.length;
            uintView[5] = bone.scalingChannel.length;
            var pPositionChannel = this.malloc(bone.positionChannel.length * POSITION_KEYFRAME_SIZE);
            for (var pidx = 0; pidx < bone.positionChannel.length; pidx++) {
                var view = new Float32Array(this.memory.buffer, pPositionChannel + pidx * POSITION_KEYFRAME_SIZE, POSITION_KEYFRAME_SIZE / FLOAT_SIZE);
                view[0] = bone.positionChannel[pidx].time;
                view.set(bone.positionChannel[pidx].position.data, 1);
            }
            var pRotationChannel = this.malloc(bone.rotationChannel.length * ROTATION_KEYFRAME_SIZE);
            for (var ridx = 0; ridx < bone.rotationChannel.length; ridx++) {
                var view = new Float32Array(this.memory.buffer, pRotationChannel + ridx * ROTATION_KEYFRAME_SIZE, ROTATION_KEYFRAME_SIZE / FLOAT_SIZE);
                view[0] = bone.rotationChannel[ridx].time;
                view.set(this.serializeQuat(bone.rotationChannel[ridx].rotation), 1);
            }
            var pScaleChannel = this.malloc(bone.scalingChannel.length * SCALING_KEYFRAME_SIZE);
            for (var sidx = 0; sidx < bone.scalingChannel.length; sidx++) {
                var view = new Float32Array(this.memory.buffer, pScaleChannel + sidx * SCALING_KEYFRAME_SIZE, SCALING_KEYFRAME_SIZE / FLOAT_SIZE);
                view[0] = bone.scalingChannel[sidx].time;
                view.set(bone.scalingChannel[sidx].scale.data, 1);
            }
            uintView[2] = pPositionChannel;
            uintView[4] = pRotationChannel;
            uintView[6] = pScaleChannel;
            idx++;
        });
        animationUintView[3] = pAnimatedBones;
        return pAnimationData;
    }
}
exports.NaiveWASMAnimationManager = NaiveWASMAnimationManager;

function wasmProfiler() {
	if (exports.NaiveWASMAnimationManager.exports != null && typeof exports.NaiveWASMAnimationManager.exports._resetInstCounters === "function") {
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
			
		addCountLo[0] = exports.NaiveWASMAnimationManager.exports._getI32AddCountLo();
		andCountLo[0] = exports.NaiveWASMAnimationManager.exports._getI32AndCountLo();
		shlCountLo[0] = exports.NaiveWASMAnimationManager.exports._getI32ShlCountLo();
		shrCountLo[0] = exports.NaiveWASMAnimationManager.exports._getI32ShruCountLo();
		xorCountLo[0] = exports.NaiveWASMAnimationManager.exports._getI32XorCountLo();
		addCountHi[0] = exports.NaiveWASMAnimationManager.exports._getI32AddCountHi();
		andCountHi[0] = exports.NaiveWASMAnimationManager.exports._getI32AndCountHi();
		shlCountHi[0] = exports.NaiveWASMAnimationManager.exports._getI32ShlCountHi();
		shrCountHi[0] = exports.NaiveWASMAnimationManager.exports._getI32ShruCountHi();
		xorCountHi[0] = exports.NaiveWASMAnimationManager.exports._getI32XorCountHi();
		exports.NaiveWASMAnimationManager.exports._resetInstCounters();	
		
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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class PositionKeyframe {
    constructor(time, position) {
        this.time = time;
        this.position = position;
    }
}
exports.PositionKeyframe = PositionKeyframe;
class RotationKeyframe {
    constructor(time, rotation) {
        this.time = time;
        this.rotation = rotation;
    }
}
exports.RotationKeyframe = RotationKeyframe;
class ScalingKeyframe {
    constructor(time, scale) {
        this.time = time;
        this.scale = scale;
    }
}
exports.ScalingKeyframe = ScalingKeyframe;
class AnimatedBone {
    constructor(positionChannel, rotationChannel, scalingChannel) {
        this.positionChannel = positionChannel;
        this.rotationChannel = rotationChannel;
        this.scalingChannel = scalingChannel;
        this.positionChannel = this.positionChannel.sort((a, b) => a.time - b.time);
        this.rotationChannel = this.rotationChannel.sort((a, b) => a.time - b.time);
        this.scalingChannel = this.scalingChannel.sort((a, b) => a.time - b.time);
    }
}
exports.AnimatedBone = AnimatedBone;
class Animation {
    constructor(duration) {
        this.duration = duration;
        this.staticBones = new Map();
        this.animatedBones = new Map();
    }
}
exports.Animation = Animation;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Material {
    constructor(ambient, diffuse) {
        this.ambient = ambient;
        this.diffuse = diffuse;
    }
}
exports.Material = Material;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const quaternion_1 = __webpack_require__(2);
const vec3_1 = __webpack_require__(0);
const mat4_1 = __webpack_require__(1);
class Camera {
    constructor(pos, lookAt, up) {
        this.pos = pos.clone();
        this.forward = lookAt.sub(pos).normal();
        this.up = up.normal();
        this.right = vec3_1.Vec3.cross(this.forward, this.up).setNormal();
        this.viewMatrix = new mat4_1.Mat4();
        this.viewMatrixDirty = true;
    }
    getViewMatrix() {
        if (this.viewMatrixDirty) {
            this.viewMatrix.setLookAt(this.pos, this.pos.add(this.forward), this.up);
            this.viewMatrixDirty = false;
        }
        return this.viewMatrix;
    }
    getPosition() {
        return this.pos.clone();
    }
    moveForward(distance) {
        this.pos.setAdd(this.forward.scale(distance));
        this.viewMatrixDirty = true;
    }
    moveRight(distance) {
        this.pos.setAdd(this.right.scale(distance));
        this.viewMatrixDirty = true;
    }
    moveUp(distance) {
        this.pos.setAdd(this.up.scale(distance));
        this.viewMatrixDirty = true;
    }
    rotateRight(angle) {
        let rotation = quaternion_1.Quaternion.fromAxisAngle(this.up, -angle);
        this.forward = quaternion_1.Quaternion.rotateVec3(rotation, this.forward).setNormal();
        this.right = vec3_1.Vec3.cross(this.forward, this.up).setNormal();
        this.viewMatrixDirty = true;
    }
    rotateUp(angle) {
        let rotation = quaternion_1.Quaternion.fromAxisAngle(this.right, angle);
        this.forward = quaternion_1.Quaternion.rotateVec3(rotation, this.forward);
        this.right = vec3_1.Vec3.cross(this.forward, this.up).setNormal();
        this.viewMatrixDirty = true;
    }
}
exports.Camera = Camera;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Entity {
    constructor(track) {
        this.track = track;
        this.i = 0;
    }
    update(dt) {
        if (this.i >= this.track.length)
            return;
        if (this.track[this.i].isFinished()) {
            this.i++;
            return this.update(dt);
        }
        this.track[this.i].update(dt);
    }
    isFinished() {
        return this.i >= this.track.length;
    }
    getAnimationData(model, animationManager) {
        return this.track[this.i].getAnimationData(model, animationManager);
    }
    getTrackPos() {
        return this.track[this.i].getTrackPos();
    }
}
exports.Entity = Entity;
class EntityTrack {
    constructor(duration, animation1, animation2, startTrackPos, endTrackPos) {
        this.duration = duration;
        this.animation1 = animation1;
        this.animation2 = animation2;
        this.startTrackPos = startTrackPos;
        this.endTrackPos = endTrackPos;
        this.tick = 0;
    }
    update(dt) {
        this.tick += dt;
    }
    isFinished() {
        return this.tick >= this.duration;
    }
    getAnimationData(model, animationManager) {
        if (this.animation2) {
            return animationManager.getBlendedAnimation([this.animation1.animation, this.animation2.animation], model, [
                (this.animation1.startTime + this.tick),
                (this.animation2.startTime + this.tick)
            ], this.tick / this.duration);
        }
        else {
            return animationManager.getSingleAnimation(this.animation1.animation, model, this.animation1.startTime + this.tick);
        }
    }
    getTrackPos() {
        return (this.endTrackPos - this.startTrackPos) * (this.tick / this.duration) + this.startTrackPos;
    }
}
exports.EntityTrack = EntityTrack;
;
function CreateRandomDancingEntity(run, dances, distanceToTravel, velocity, options) {
    options = options || {};
    options.minStartRunTime = options.minStartRunTime || (distanceToTravel / velocity) * 0.1;
    options.maxStartRunTime = options.maxStartRunTime || (distanceToTravel / velocity) * 0.8;
    options.minEndRunTime = options.minEndRunTime || (distanceToTravel / velocity) * 0.1;
    options.maxEndRunTime = options.maxEndRunTime || (distanceToTravel / velocity) * 0.2;
    options.minDanceBreaks = options.minDanceBreaks || 1;
    options.maxDanceBreaks = options.maxDanceBreaks || 1;
    options.minDanceCycles = options.minDanceCycles || 1;
    options.maxDanceCycles = options.maxDanceCycles || 1;
    options.danceFadeInTime = options.danceFadeInTime || 0.5;
    options.danceFadeOutTime = options.danceFadeOutTime || options.danceFadeInTime;
    let tr = [];
    let runningTimeRemaining = distanceToTravel / velocity;
    let endRunTime = Math.random() * (options.maxEndRunTime - options.minEndRunTime) + options.minEndRunTime;
    let lastRunTime = 0;
    let startRunTime = Math.random() * (options.maxStartRunTime - options.minStartRunTime) + options.minStartRunTime;
    let trackPos = 0;
    tr.push(new EntityTrack(startRunTime, { startTime: 0, animation: run }, null, trackPos, trackPos = velocity * startRunTime));
    runningTimeRemaining -= startRunTime;
    lastRunTime = startRunTime;
    let numDanceBreaks = Math.round(Math.random() * (options.maxDanceBreaks - options.minDanceBreaks)) + options.minDanceBreaks;
    let timeDelta = (runningTimeRemaining - endRunTime) / numDanceBreaks;
    for (let i = 0; i < numDanceBreaks; i++) {
        let animIndex = Math.floor(Math.random() * dances.length);
        let numCycles = Math.round(Math.random() * (options.maxDanceBreaks - options.minDanceCycles)) + options.minDanceCycles;
        options.danceFadeInTime && tr.push(new EntityTrack(options.danceFadeInTime, { startTime: lastRunTime % run.duration, animation: run }, { startTime: 0, animation: dances[animIndex] }, trackPos, trackPos = trackPos));
        tr.push(new EntityTrack(numCycles * dances[animIndex].duration - options.danceFadeInTime - options.danceFadeOutTime, { startTime: options.danceFadeInTime, animation: dances[animIndex] }, null, trackPos, trackPos));
        options.danceFadeOutTime && tr.push(new EntityTrack(options.danceFadeOutTime, { startTime: dances[animIndex].duration - options.danceFadeOutTime, animation: dances[animIndex] }, { startTime: 0, animation: run }, trackPos, trackPos));
        tr.push(new EntityTrack(timeDelta, { startTime: options.danceFadeOutTime || 0, animation: run }, null, trackPos, trackPos += velocity * timeDelta));
        lastRunTime = timeDelta + options.danceFadeOutTime;
    }
    return new Entity(tr);
}
exports.CreateRandomDancingEntity = CreateRandomDancingEntity;
;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DirectionalLight {
    constructor(ambientColor, diffuseColor, direction) {
        this.ambientColor = ambientColor;
        this.diffuseColor = diffuseColor;
        this.direction = direction;
    }
}
exports.DirectionalLight = DirectionalLight;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class GUIValues {
    constructor() {
        this.OnSystemChange = [];
        this.OnNumRunnersChange = [];
        this._System = 'WebAssembly';
        this._NumRunners = 8;
    }
    get System() { return this._System; }
    set System(value) { this.OnSystemChange.forEach(f => f(value)); this._System = value; }
    get NumRunners() { return this._NumRunners; }
    set NumRunners(value) { this.OnNumRunnersChange.forEach(f => f(value)); this._NumRunners = value; }
}
;
class GUI {
    constructor() {
        this.gui = new dat.GUI();
        this.values = new GUIValues();
        this.gui.add(this.values, 'System', ['JavaScript', 'WebAssembly']);
        this.gui.add(this.values, 'NumRunners').min(0).step(1);
    }
}
exports.GUI = GUI;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const camera_1 = __webpack_require__(11);
const color_1 = __webpack_require__(4);
const vec3_1 = __webpack_require__(0);
const mat4_1 = __webpack_require__(1);
const quaternion_1 = __webpack_require__(2);
const animatedentityprogram_1 = __webpack_require__(5);
const directionallight_1 = __webpack_require__(13);
const betacharactermodel_1 = __webpack_require__(6);
const dancingentity_1 = __webpack_require__(12);
const naivejsanimationmanager_1 = __webpack_require__(7);
const naivewasmanimationmanager_1 = __webpack_require__(8);
const settingsgui_1 = __webpack_require__(14);
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
let getCachedParameterByName = (function () {
    let paramCache = new Map();
    return (name, defaultValue, url) => {
        if (!paramCache.has(name)) {
            paramCache.set(name, getParameterByName(name, url) || defaultValue);
        }
        return paramCache.get(name);
    };
})();
class Demo {
    constructor() { }
    CreateAndStart(canvas) {
        let animationManagerType = getParameterByName('system') || 'default';
        if (['naivejs', 'speedyjs', 'naivewasm', 'speedywasm'].indexOf(animationManagerType) == -1) {
            animationManagerType = 'naivejs';
        }
        let wasmAnimationManager = new naivewasmanimationmanager_1.NaiveWASMAnimationManager();
        let jsAnimationManager = new naivejsanimationmanager_1.NaiveJSAnimationManager();
        Promise.all([
            betacharactermodel_1.getModelData(),
            betacharactermodel_1.getAnimationData(betacharactermodel_1.ANIMATIONS.RUN),
            betacharactermodel_1.getAnimationData(betacharactermodel_1.ANIMATIONS.SAMBA),
            betacharactermodel_1.getAnimationData(betacharactermodel_1.ANIMATIONS.TUT),
            betacharactermodel_1.getAnimationData(betacharactermodel_1.ANIMATIONS.WAVE),
            wasmAnimationManager.load(),
            jsAnimationManager.load()
        ]).then((stuff) => {
            if (!stuff[5]) {
				console.log("Could not instantiate system!");
                throw new Error('Could not instantiate system!');
            }
			console.log("About to start");
			//wasmAnimationManager.wasmProfiler();
            this.start(canvas, stuff[0], stuff[1], [stuff[2], stuff[3], stuff[4]], jsAnimationManager, wasmAnimationManager);
        })
            .catch((e) => alert(e));
    }
    start(canvas, betaModelData, betaRun, betaDances, jsAnimationManager, wasmAnimationManager) {
		console.log("Starting...");
		console.log(canvas);
        document.body.className += " loaded";
        let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            return console.error('Could not create WebGL rendering context!');
        }
        var activeAnimationManager = wasmAnimationManager;
        let gui = new settingsgui_1.GUI();
        let camera = new camera_1.Camera(new vec3_1.Vec3(0, 285, 600), new vec3_1.Vec3(0, 85, 0), new vec3_1.Vec3(0, 1, 0));
        let projMatrix = new mat4_1.Mat4().perspective(Math.PI * 0.6, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 2000.0);
        gl.canvas.width = gl.canvas.clientWidth;
        gl.canvas.height = gl.canvas.clientHeight;
        const VELOCITY = 80;
        const START_POS = new vec3_1.Vec3(0, 0, -800);
        const END_POS = new vec3_1.Vec3(0, 0, 750);
        const DISTANCE_TO_TRAVEL = END_POS.sub(START_POS).length();
        const EACH_OFFSET = new vec3_1.Vec3(175, 0, 0);
        jsAnimationManager.registerAnimation(betaRun);
        wasmAnimationManager.registerAnimation(betaRun);
        betaDances.forEach((dance) => {
            jsAnimationManager.registerAnimation(dance);
            wasmAnimationManager.registerAnimation(dance);
        });
        betaModelData.forEach((model) => {
            jsAnimationManager.registerModel(model);
            wasmAnimationManager.registerModel(model);
        });
        betaModelData.forEach((model) => {
            if (!jsAnimationManager.associateModelAndAnimation(betaRun, model) || !wasmAnimationManager.associateModelAndAnimation(betaRun, model)) {
                console.error('Error - model', model, 'and animation', betaRun, 'cannot be associated!');
            }
        });
        betaDances.forEach((dance) => betaModelData.forEach((model) => {
            if (!jsAnimationManager.associateModelAndAnimation(dance, model) || !wasmAnimationManager.associateModelAndAnimation(dance, model)) {
                console.error('Error - model', model, 'and animation', betaRun, 'cannot be associated!');
            }
            ;
        }));
        let numRunners = gui.values.NumRunners;
        let runners = [];
        var setupRunners = () => {
            for (let i = runners.length; i >= numRunners; i--)
                runners.pop();
            for (let i = runners.length; i < numRunners; i++) {
                runners.push(dancingentity_1.CreateRandomDancingEntity(betaRun, betaDances, DISTANCE_TO_TRAVEL, VELOCITY, {
                    minStartRunTime: getCachedParameterByName('minstartruntime', undefined),
                    minDanceCycles: getCachedParameterByName('mindancecycles', undefined),
                    maxDanceCycles: getCachedParameterByName('maxdancecycles', undefined)
                }));
            }
        };
		console.log("Setup Runners");
        setupRunners();
        gui.values.OnSystemChange.push((type) => {
            switch (type) {
                case 'JavaScript':
                    activeAnimationManager = jsAnimationManager;
                    break;
                case 'WebAssembly':
                    activeAnimationManager = wasmAnimationManager;
                    break;
            }
        });
        gui.values.OnNumRunnersChange.push((num) => {
            numRunners = num;
            setupRunners();
        });
        window.addEventListener('resize', () => {
            if (!gl)
                return;
            projMatrix = new mat4_1.Mat4().perspective(Math.PI * 0.6, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 2000.0);
            gl.canvas.width = gl.canvas.clientWidth;
            gl.canvas.height = gl.canvas.clientHeight;
            program.prepare(gl);
            program.setSceneData(gl, projMatrix, new directionallight_1.DirectionalLight(color_1.Color.WHITE, color_1.Color.WHITE, new vec3_1.Vec3(1, -3, 0.7).setNormal()));
            program.disengage(gl);
        });
        let stats = new Stats();
        let animationTimePanel = stats.addPanel(new Stats.Panel('Anim', '#f8f', '#212'));
        stats.showPanel(2);
        document.body.appendChild(stats.dom);
        let program = new animatedentityprogram_1.AnimatedEntityProgram();
        let calls = betaModelData.map((model) => new animatedentityprogram_1.AnimatedEntityRenderCall(model, new mat4_1.Mat4()));
        program.prepare(gl);
        program.setSceneData(gl, projMatrix, new directionallight_1.DirectionalLight(color_1.Color.WHITE, color_1.Color.WHITE, new vec3_1.Vec3(-1, -3, -0.7).setNormal()));
        program.disengage(gl);
        let r = activeAnimationManager.getSingleAnimation(betaRun, calls[1].modelData, 0);
        let lastFrame = performance.now();
        let thisFrame;
        let dt;
        let frame = function () {
            thisFrame = performance.now();
            dt = (thisFrame - lastFrame) / 1000;
            lastFrame = thisFrame;
            stats.begin();
            if (!gl) {
                console.warn('Context lost - restoring');
                gl = canvas.getContext('webgl');
                if (!gl) {
                    return console.error('Could not restore WebGL context!');
                }
            }
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.clearColor(0xd9 / 255, 0xe9 / 255, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            for (let i = 0; i < runners.length; i++) {
                runners[i].update(dt);
                if (runners[i].isFinished()) {
                    runners[i] = dancingentity_1.CreateRandomDancingEntity(betaRun, betaDances, DISTANCE_TO_TRAVEL, VELOCITY);
                }
            }
            program.prepare(gl);
            program.setPerFrameData(gl, camera.getViewMatrix(), camera.getPosition());
            let sum = 0;
            for (let i = 0; i < runners.length; i++) {
                for (let j = 0; j < calls.length; j++) {
                    let b4 = performance.now();
                    let animationData = runners[i].getAnimationData(calls[j].modelData, activeAnimationManager);
                    let after = performance.now();
                    sum = sum + (after - b4);
                    calls[j].worldTransform.setRotationTranslationScale(quaternion_1.Quaternion.IDENTITY, vec3_1.Vec3.lerp(START_POS, END_POS, runners[i].getTrackPos() / DISTANCE_TO_TRAVEL).setAdd(EACH_OFFSET.scale(i - runners.length / 2)), vec3_1.Vec3.ONES);
                    program.renderObject(gl, calls[j], animationData.boneData);
                }
            }
            animationTimePanel.update(sum, 25 * runners.length);
            program.disengage(gl);
            stats.end();
            requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }
}
;
const DemoApp = new Demo();
DemoApp.CreateAndStart(document.getElementById('demo-surface'));
/***/ })
/******/ ]);