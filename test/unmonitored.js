var test      = require('tape'),
    eventuate = require('..')

test('unmonitored eventuate', function (t) {
    t.plan(4)

    var event = eventuate({ monitorConsumers: false })
    t.equal(event.hasConsumer, undefined, 'hasConsumer should be undefined')

    var consumerCallCount = 0
    function consumer1 (value) {
        consumerCallCount++
        t.equal(value, 'test1', 'consumer1 should be passed value')
        t.equal(consumerCallCount, 1, 'consumer1 should be called once')
        event.removeConsumer(consumer1)
    }

    t.equal(typeof event(consumer1), 'undefined', '(consumer) should return undefined')
    event.produce('test1')
})
