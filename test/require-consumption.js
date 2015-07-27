var test      = require('tape'),
    eventuate = require('..')

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
