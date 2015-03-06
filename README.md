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
request.remove(onRequest)
```

## api

```javascript
var eventuate = require('eventuate')
```

### var event = eventuate()

Create an object, `event`, that represents a consumable event type.

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

### event.remove(consumer)

Remove the formerly added `consumer`, so that it will not be called with future produced 
events.


## testing

`npm test [--dot | --spec] [--grep=pattern]`

Specifying `--dot` or `--spec` will change the output from the default TAP style. 
Specifying `--grep` will only run the test files that match the given pattern.

## coverage

`npm run coverage [--html]`

This will output a textual coverage report. Including `--html` will also open 
an HTML coverage report in the default browser.
