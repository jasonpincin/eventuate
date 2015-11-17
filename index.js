var eventuateCore = require('eventuate-core'),
    pre           = require('call-hook/pre'),
    evFilter      = require('eventuate-filter'),
    evNext        = require('eventuate-next')
    // evMap      = require('eventuate-map'),
    // evReduce   = require('eventuate-reduce'),

module.exports = createEventuate

function createEventuate (options) {
    var eventuate             = decorate(eventuateCore(options))
    eventuate.errors          = decorate(eventuateCore())
    eventuate.consumerAdded   = decorate(eventuateCore())
    eventuate.consumerRemoved = decorate(eventuateCore())
    eventuate.done            = oneTime(eventuateCore())
    eventuate.factory         = createEventuate

    return eventuate
}

function decorate (eventuate) {
    eventuate.filter  = filter
    // eventuate.map     = map
    // eventuate.reduce  = reduce
    eventuate.next    = next
    eventuate.once    = next
    eventuate.forEach = forEach

    return eventuate

    function filter (options, filterFunc) {
        return evFilter(eventuate, options, filterFunc)
    }

    // function map (options, mapFunc) {
    //     return evMap(eventuate, options, mapFunc)
    // }
    //
    // function reduce (options, reduceFunc) {
    //     return evReduce(eventuate, options, reduceFunc)
    // }
    //
    function next (cb) {
        return evNext(eventuate, cb)
    }

    function forEach (consumer) {
        return eventuate.consume(consumer)
    }
}

function oneTime (eventuate) {
    eventuate.consume = pre(eventuate.consume, function (consumer) {
        if (!consumer)
            this.abort(evNext(eventuate))
    })
}
