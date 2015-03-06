var test      = require('tape'),
    eventuate = require('..')

test('eventuate', function (t) {
    t.plan(11)

    var event = eventuate()
    t.false(event.hasConsumer, 'has no consumers initially')

    var consumerCallCount = 0
    function consumer1 (value) {
        consumerCallCount++
        t.equal(value, 'test1', 'consumer1 should be passed value')
        t.equal(consumerCallCount, 1, 'consumer1 should be called once')
        event.remove(consumer1)
    }
    function consumer2 (value) {
        t.equal(value, 'test1', 'consumer2 should be passed value')
        event.remove(consumer2)
    }

    t.equal(typeof event(consumer1), 'undefined', '(consumer) should return undefined')
    t.true(event.hasConsumer, 'has consumers after consumer added')
    event.produce('test1')
    t.false(event.hasConsumer, 'has no consumers after consumer removed')

    // promise
    t.equal(typeof event().then, 'function', '() should return promise')
    t.true(event.hasConsumer, 'has consumers with outstanding promise')
    t.equal(event(), event(), '() should return same promise')

    event().then(function (value) {
        t.equal(value, 'test2', 'promise should resolve')
    })
    event.produce('test2')
    t.false(event.hasConsumer, 'has no consumers after promise is resolved')
})
