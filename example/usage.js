var eventuate = require('..'),
    assert    = require('assert')

// create an event type, let us call it request
// kind of like an EventEmitter for a single event type
var request = eventuate()

// consume all requests (think .on)
function onRequest (req) {
    console.log(req)
}
request(onRequest)

// handle next event with a promise (think .once)
// request().then(function nextRequest (req) {
//     console.log(req)
// })

// make sure someone is listening
assert(request.hasConsumer)

// produce an event
request.produce({ url: '/test' })

// remove our consumer
request.removeConsumer(onRequest)

var pie = eventuate()
pie(function (p) {
    console.log('%s served...', p.type)
})

var everythingElse = pie.filter(function (pie) {
    return pie.type !== 'shoofly'
}).map(function (pie) {
    switch (pie.type) {
        case 'shoofly':
            pie.topping = 'vanilla ice cream'
            break
        case 'pumpkin':
            pie.topping = 'whipped cream'
            break
        case 'apple':
            pie.topping = 'maple walnut syrup'
            break
        default:
            pie.topping = 'a cherry'
    }
    return pie
}).reduce(function (lastValue, pie) {
    return lastValue + ' ' + pie.type + ' with ' + pie.topping
}, 'Pies eaten so far in pie eating contest: ')

everythingElse(function (p) {
    console.log(p)
})

pie.produce({type: 'apple' })
pie.produce({type: 'cherry' })
pie.produce({type: 'shoofly' })
pie.produce({type: 'peach' })
