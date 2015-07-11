var test      = require('tape'),
    eventuate = require('..')

test('consumer removed', function (t) {
    t.plan(4)

    function consumer1 () {}

    var event1 = eventuate()
    event1(consumer1)
    event1.consumerRemoved(function (consumer) {
        t.equal(consumer, consumer1, 'should be called with consumer')
    })
    event1.consumerRemoved().then(function (consumer) {
        t.equal(consumer, consumer1, 'should resolve as consumer')
    })
    event1.removeConsumer(consumer1)

    var event2 = eventuate()
    event2.consumerRemoved(function (consumer) {
        t.equal(consumer, undefined, 'should be called with undefined consumer when consumer is a promise')
    })
    event2.consumerRemoved().then(function (consumer) {
        t.equal(consumer, undefined, 'should resolve as undefined when consumer is a promise')
    })
    event2()
    event2.produce()
})
