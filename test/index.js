var tape = require("tape"),
    crypto = require("..");


tape("crypto#randomBytes(size[, callback])", function(assert) {
    assert.equal(crypto.randomBytes(32).length, 32, "should return a array of random bytes");
    crypto.randomBytes(32, function(error, array) {
        assert.equal(array.length, 32, "should return a array of random bytes asynchronously");
        assert.end(error);
    });
});
