var copy   = require('shallow-copy'),
    assign = require('object-assign')

module.exports = function mkEventuate (options) {
    options = assign({
        monitorConsumers: true,
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
    eventuate.produce = function (data) {
        if (options.requireConsumption && !eventuate.hasConsumer)
            throw ((data instanceof Error) ? data : assign(new Error('Unconsumed eventuate'), { data: data }))
        consumers.forEach(function eventuateConsume (consume) {
            consume(data)
        })
    }

    if (monitored) {
        eventuate.consumerRemoved = mkEventuate({ monitorConsumers: false })
        eventuate.consumerAdded   = mkEventuate({ monitorConsumers: false })

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
