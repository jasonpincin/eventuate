var test      = require('tape'),
    eventuate = require('..')

test('eventuate', function (t) {
    t.plan(4)

    var event = eventuate()

    t.equal(typeof event.map, 'function', 'map should be a function')
    t.equal(typeof event.reduce, 'function', 'reduce should be a function')
    t.equal(typeof event.filter, 'function', 'filter should be a function')

    var chained = event.filter(function (v) {
        return v === 2 || v === 5
    }).map(function (v) {
        return v + 10
    }).reduce(function (lastValue, v) {
        return lastValue + v
    }, 1000)

    var iterationCount = 0
    var chainedValues = []
    chained(function (v) {
        chainedValues.push(v)
        iterationCount++
        if (iterationCount === 3) {
            t.deepEqual(chainedValues, [1012, 1027, 1039], 'should accept only values 2 & 5, add 10, and summate with init value as 1000')
        }
    })

    event.produce(2)
    event.produce(1)
    event.produce(5)
    event.produce(3)
    event.produce(2)
    event.produce(1)

})
