var test      = require('tape'),
    eventuate = require('..')

test('consumer added', function (t) {
    t.plan(1)

    function consumer1 () {}

    var event1 = eventuate()
    event1.consumerAdded(function (consumer) {
        t.equal(consumer, consumer1, 'should be called with consumer')
    })
    event1(consumer1)
})
