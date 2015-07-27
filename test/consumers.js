var test      = require('tape'),
    eventuate = require('..')

test('consumers', function (t) {
    t.plan(3)

    function consumer1 () {}
    function consumer2 () {}

    var event = eventuate()
    event(consumer1)
    event(consumer2)

    t.equals(event.consumers[0], consumer1, 'should return a shallow copy')
    t.equals(event.consumers.length, 2, 'should contain 2 functions')
    event.consumers.splice(0, 1)
    t.equals(event.consumers.length, 2, 'should be unalterable')
})
