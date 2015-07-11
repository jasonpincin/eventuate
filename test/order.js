var test      = require('tape'),
    eventuate = require('..')

test('resolution order', function (t) {
    t.plan(1)

    var event           = eventuate(),
        promiseResolved = false

    event(function () {
        t.false(promiseResolved, 'promise resolves after consumers')
    })
    event().then(function () {
        promiseResolved = true
    })
    event.produce(true)
})
