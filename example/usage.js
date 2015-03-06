var eventuate = require('..'),
    assert    = require('assert')

// create an event type, let us call it request
// kind of like an EventEmitter for a single event type
var request = eventuate()

// consume all requests (think .on)
function onRequest (req) {
    // do something
}
request(onRequest)

// handle next event with a promise (think .once)
request().then(function nextRequest (req) {
    // do something
})

// make sure someone is listening
assert(request.hasConsumer)

// produce an event
request.produce({ url: '/test' })

// remove our consumer
request.remove(onRequest)
