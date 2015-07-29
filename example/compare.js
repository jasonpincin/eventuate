var EventEmitter = require('events').EventEmitter,
    inherits     = require('util').inherits,
    eventuate    = require('..'),
    once         = require('eventuate-once')

var server

// Create a server constructor using EventEmitter
function EmitterServer () {
    EventEmitter.call(this)
}
inherits(EmitterServer, EventEmitter)

server = new EmitterServer()
server.once('ready', function () {
    console.log('EmitterServer: ready')
})
server.on('connection', function (socket) {
    console.log('EmitterServer: got connection')
})
server.on('request', function (request, response) {
    console.log('EmitterServer: got request')
})
// produce the events
server.emit('ready')
server.emit('connection', {})
// You may emit multiple values via emit
server.emit('request', {}, {})

// Create a server constructor using eventuate
// (no inheriting, and we define what type of events we produce up-front)
function EventuateServer () {
    this.ready = eventuate()
    this.connection = eventuate()
    this.request = eventuate()
}

server = new EventuateServer()
// eventuate-once accomplishes same thing as .once on an EventEmitter
// (eventuate-once also returns a Promise)
once(server.ready, function () {
    console.log('EventuateServer: ready')
})
server.connection(function (socket) {
    console.log('EventuateServer: got connection')
})
server.request(function (exchange) {
    console.log('EventuateServer: got request')
})
// produce the events
server.ready.produce()
server.connection.produce({})
// unlike request event above, eventuates only ever produce a single value
server.request.produce({ request: {}, response: {} })

// Or... no constructors required!
// It's more natural to create object literals with eventuates:
server = {
    ready: eventuate(),
    connection: eventuate(),
    request: eventuate()
}
