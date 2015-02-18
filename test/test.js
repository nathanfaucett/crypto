var assert = require("assert"),
    crypto = require("../src/index");


describe("crypto", function() {
    describe("#randomBytes(size[, callback])", function() {
        it("should return a array of random bytes", function(done) {
            assert.equal(crypto.randomBytes(32).length, 32);
            crypto.randomBytes(32, function(err, array) {
                assert.equal(array.length, 32);
                done(err);
            });
        });
    });
});
