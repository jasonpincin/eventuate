var Promise = require('promise-polyfill')

module.exports = function mkEventuate (options) {
    options = options || {}
    options.monitorConsumers = options.monitorConsumers === undefined ? false : options.monitorConsumers

    var nextEvent  = null,
        _nextEvent = null,
        monitored  = options.monitorConsumers,
        consumers  = []

    function eventuate (consumer) {
        if (!consumer && nextEvent) return nextEvent

        if (consumer)
            consumers.push(consumer)
        else
            nextEvent = nextEvent || (nextEvent = new Promise(function (resolve,reject) {
                _nextEvent = {resolve:resolve, reject:reject}
            }))

        if (monitored)
            eventuate.consumerAdded.produce(consumer)
        if (!consumer)
            return nextEvent
    }
    eventuate.remove = function (consumer) {
        consumers.splice(consumers.indexOf(consumer), 1)
        if (monitored)
            eventuate.consumerRemoved.produce(consumer)
    }
    eventuate.produce = function (data) {
        consumers.forEach(function eventuateConsume(consume) {
            consume(data)
        })
        if (_nextEvent) {
            _nextEvent.resolve(data)
            nextEvent = _nextEvent = null
            if (monitored)
                eventuate.consumerRemoved.produce()
        }
    }

    if (monitored) {
        eventuate.consumerRemoved = mkEventuate({ monitorConsumers: false })
        eventuate.consumerAdded   = mkEventuate({ monitorConsumers: false })

        Object.defineProperty(eventuate, "hasConsumer", {
            get: function eventuateHasConsumer () {
                return !!(nextEvent || consumers.length)
            }
        })
    }

    return eventuate
}
