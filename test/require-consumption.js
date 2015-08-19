var test      = require('tape'),
    eventuate = require('..'),
    errors    = require('../errors')

test('eventuate requiring consumption', function (t) {
    t.plan(3)

    var error = eventuate({ requireConsumption: true })
    t.throws(function () {
        error.produce(new Error('no good'))
    }, 'throws on no consumers')
    t.throws(function () {
        error.produce('no good')
    }, 'does not require an error object')

    error(function (err) {
        t.equal(err.message, 'bad data', 'does not throw with cb consumer')
    })
    error.produce(new Error('bad data'))
})

test('should throw UnconsumedEventError when unconsumed data is produced (with requireConsumption set)', function (t) {
    t.plan(3)

    var error = eventuate({ requireConsumption: true })
    try {
        error.produce('explode')
    }
    catch (err) {
        t.ok(err instanceof errors.UnconsumedEventError, 'err is instanceof UnconsumedEventError')
        t.equal(err.message, 'Unconsumed event', 'message is Unconsumed event')
        t.equal(err.data, 'explode', 'data is produced data')
    }
})
