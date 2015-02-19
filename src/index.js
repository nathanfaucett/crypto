var isNumber = require("is_number"),
    isFunction = require("is_function");


var crypto = exports,

    NativeUint8Array = typeof(Uint8Array) !== "undefined" ? Uint8Array : Array,
    globalCrypto = global.crypto || global.msCrypto,
    randomBytes;


crypto.rotl = function(n, b) {
    return (n << b) | (n >>> (32 - b));
};

crypto.rotr = function(n, b) {
    return (n << (32 - b)) | (n >>> b);
};

function endian(n) {
    return crypto.rotl(n, 8) & 0x00FF00FF | crypto.rotl(n, 24) & 0xFF00FF00;
}

function endianArray(array) {
    var i = -1,
        il = array.length - 1;

    while (i++ < il) {
        array[i] = endian(array[i]);
    }

    return array;
}

crypto.endian = function(n) {
    if (isNumber(n)) {
        return endian(n);
    } else {
        return endianArray(n);
    }
};

if (globalCrypto && isFunction(globalCrypto.getRandomValues)) {
    randomBytes = function(size) {
        return crypto.getRandomValues(new NativeUint8Array(size));
    };
} else {
    randomBytes = function(size) {
        var bytes = new NativeUint8Array(size),
            i = size;

        while (i--) {
            bytes[i] = (Math.random() * 256) | 0;
        }

        return bytes;
    };
}

crypto.randomBytes = function(size, callback) {
    if (!isNumber(size)) {
        throw new TypeError("randomBytes(size[, callback]) size must be a number");
    } else {
        if (isFunction(callback)) {
            process.nextTick(function() {
                callback(undefined, randomBytes(size));
            });
            return undefined;
        } else {
            return randomBytes(size);
        }
    }
};
