var isNumber = require("@nathanfaucett/is_number"),
    isFunction = require("@nathanfaucett/is_function");


var crypto = exports,

    NativeUint8Array = typeof(Uint8Array) !== "undefined" ? Uint8Array : Array,
    globalCrypto = global.crypto || global.msCrypto,
    baseRandomBytes;


function rotl(n, b) {
    return (n << b) | (n >>> (32 - b));
}

function rotr(n, b) {
    return (n << (32 - b)) | (n >>> b);
}

function endianNumber(number) {
    return rotl(number, 8) & 0x00FF00FF | rotl(number, 24) & 0xFF00FF00;
}

function endianArray(array) {
    var i = -1,
        il = array.length - 1;

    while (i++ < il) {
        array[i] = endianNumber(array[i]);
    }

    return array;
}

function endian(value) {
    if (isNumber(value)) {
        return endianNumber(value);
    } else {
        return endianArray(value);
    }
}

if (globalCrypto && isFunction(globalCrypto.getRandomValues)) {
    baseRandomBytes = function(size) {
        return globalCrypto.getRandomValues(new NativeUint8Array(size));
    };
} else {
    baseRandomBytes = function(size) {
        var bytes = new NativeUint8Array(size),
            i = size;

        while (i--) {
            bytes[i] = (Math.random() * 256) | 0;
        }

        return bytes;
    };
}

function randomBytes(size, callback) {
    if (!isNumber(size)) {
        throw new TypeError("randomBytes(size[, callback]) size must be a number");
    } else {
        if (isFunction(callback)) {
            process.nextTick(function onNextTick() {
                callback(undefined, baseRandomBytes(size));
            });
            return undefined;
        } else {
            return baseRandomBytes(size);
        }
    }
}

crypto.rotr = rotr;
crypto.rotl = rotl;
crypto.endian = endian;
crypto.randomBytes = randomBytes;
