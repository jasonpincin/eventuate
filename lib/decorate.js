var evFilter = require('eventuate-filter')
    // evMap    = require('eventuate-map'),
    // evReduce = require('eventuate-reduce'),
    // evNext   = require('eventuate-next')

module.exports = decorate

function decorate (eventuate) {
    eventuate.filter  = filter
    // eventuate.map     = map
    // eventuate.reduce  = reduce
    // eventuate.next    = next
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
    // function next (cb) {
    //     return evNext(eventuate, cb)
    // }

    function forEach (consumer) {
        return eventuate.consume(consumer)
    }
}
