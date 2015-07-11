# eventuate

[![NPM version](https://badge.fury.io/js/eventuate.png)](http://badge.fury.io/js/eventuate)
[![Build Status](https://travis-ci.org/jasonpincin/eventuate.svg?branch=master)](https://travis-ci.org/jasonpincin/eventuate)
[![Coverage Status](https://coveralls.io/repos/jasonpincin/eventuate/badge.png?branch=master)](https://coveralls.io/r/jasonpincin/eventuate?branch=master)
[![Davis Dependency Status](https://david-dm.org/jasonpincin/eventuate.png)](https://david-dm.org/jasonpincin/eventuate)

Handle events without emitters. If we had to do it all over again, we might do it this way...


## example

```javascript
var eventuate = require('eventuate'),
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
request.removeConsumer(onRequest)
```


## api

```javascript
var eventuate = require('eventuate')
```

### var event = eventuate(options)

Create an object, `event`, that represents a consumable event type.

Valid options are:

* monitorConsumers - [default: `true`] `true` or `false`, see "unmonitored eventuate" below

### event(consumer)

Consume events with the `consumer` function, which should have the signature 
`function (data) {}`. When an event is produced, it will be passed to the consumer 
function as the first and only argument. 

When invoked this way, the return value of `event()` is undefined.

### var promise = event()

When `event()` is invoked without a consumer, it returns a `Promise` object 
representing the next produced event.

### event.produce(data)

Produce an event. All `event` consumer functions will be called with `data`, and 
the `Promise` representing the next event will be resolved with `data`.

### event.removeConsumer(consumer)

Remove the formerly added `consumer`, so that it will not be called with future produced 
events.

### event.hasConsumer

Property containing value `true` or `false`, indicating whether or not the event has a 
consumer. This will also return true if there is an outstanding promise.

### event.consumerAdded([consumer])

Unmonitored eventuate representing additions of consumers. Any consumers of `consumerAdded` will be 
invoked with the consumer added to the `eventuate`. As this is an eventuate itself, it will return a 
promise that will resolve to the next consumer added if no `consumerAdded` consumer is provided.

If the consumer added to the `eventuate` was a promise, the consumer passed to the `consumerAdded` 
consumer will be undefined.

Example:

```javascript
var event = eventuate()
event.consumerAdded(function (eventConsumer) {
    // eventConsumer will be a reference to consumer function, or 
    // undefined if consumer is a promise
    console.log('a consumer was added to event')
})
event.consumerAdded().then(function (eventConsumer) {
    console.log('first consumer added to event')
})
```

### event.consumerRemoved([consumer])

Unmonitored eventuate representing removal of consumers. Any consumers of `consumerRemoved` will be 
invoked with the consumer removed from the `eventuate`. As this is an eventuate itself, it will return a 
promise that will resolve to the next consumer removed if no `consumerRemoved` consumer is provided.

If the consumer removed from the `eventuate` was a promise, the consumer passed to the `consumerRemoved` 
consumer will be undefined.

Example:

```javascript
var event = eventuate()
event.consumerRemoved(function (eventConsumer) {
    // eventConsumer will be a reference to consumer function, or 
    // undefined if consumer is a promise
    console.log('a consumer was removed from event')
})
event.consumerRemoved().then(function (eventConsumer) {
    console.log('first time a consumer was removed from event')
})
```


## unmonitored eventuate

If the eventuate is created with the option `monitorConsumers` set to false, the eventuate 
will not have the following properties: `hasConsumer`, `consumerRemoved`, `consumerAdded`. 
No events will be triggered when consumers are manipulated.  This is used internally within 
eventuate for sub-events such as `consumerRemoved` and `consumerAdded`.


## install

```sh
npm install eventuate
```


## testing

`npm test [--dot | --spec] [--grep=pattern]`

Specifying `--dot` or `--spec` will change the output from the default TAP style. 
Specifying `--grep` will only run the test files that match the given pattern.


## coverage

`npm run coverage [--html]`

This will output a textual coverage report. Including `--html` will also open 
an HTML coverage report in the default browser.
