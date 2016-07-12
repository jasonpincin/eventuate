var copy                 = require('shallow-copy'),
    assign               = require('object-assign'),
    map                  = require('eventuate-map'),
    reduce               = require('eventuate-reduce'),
    filter               = require('eventuate-filter'),
    UnconsumedEventError = require('./errors').UnconsumedEventError

module.exports = function createEventuate (options) {
    options = assign({
        monitorConsumers  : true,
        requireConsumption: false
    }, options)

    var monitored  = options.monitorConsumers,
        consumers  = []

    function eventuate (consumer) {
        if (typeof consumer !== 'function') throw new TypeError('eventuate consumer must be a function')

        consumers.push(consumer)
        if (monitored) eventuate.consumerAdded.produce(consumer)
    }

    eventuate.removeConsumer = function (consumer) {
        consumers.splice(consumers.indexOf(consumer), 1)
        if (monitored) eventuate.consumerRemoved.produce(consumer)
    }

    eventuate.removeAllConsumers = function () {
        for (var i = consumers.length - 1; i >= 0; i--) eventuate.removeConsumer(consumers[i])
    }

    eventuate.produce = function (data) {
        if (options.requireConsumption && !eventuate.hasConsumer)
            throw ((data instanceof Error) ? data : new UnconsumedEventError('Unconsumed event', { data: data }))
        consumers.forEach(function eventuateConsume (consume) {
            consume(data)
        })
    }

    eventuate.map = function (cb) {
        return map(eventuate, cb)
    }

    eventuate.reduce = function (cb, initialValue) {
        return reduce(eventuate, cb, initialValue)
    }

    eventuate.filter = function (cb) {
        return filter(eventuate, cb)
    }

    eventuate.forEach = function (cb) {
        eventuate(cb)
        return eventuate
    }

    eventuate.factory = createEventuate

    if (monitored) {
        eventuate.consumerRemoved = createEventuate({ monitorConsumers: false })
        eventuate.consumerAdded   = createEventuate({ monitorConsumers: false })

        Object.defineProperties(eventuate, {
            hasConsumer: { get: function eventuateHasConsumer () {
                return !!(consumers.length)
            }},
            consumers: { get: function eventuateConsumers () {
                return copy(consumers)
            }}
        })
    }

    return eventuate
}
