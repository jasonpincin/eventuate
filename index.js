var Promise = require('promise-polyfill')

module.exports = function mkEventuate () {

    var nextEvent  = null,
        _nextEvent = null,
        consumers  = []

    function eventuate (consumer) {
        if (consumer)
            consumers.push(consumer)
        else
            return nextEvent || (nextEvent = new Promise(function (resolve,reject) {
                _nextEvent = {resolve:resolve, reject:reject}
            }))
    }
    eventuate.remove = function (consumer) {
        consumers.splice(consumers.indexOf(consumer), 1)
    }
    eventuate.produce = function (data) {
        consumers.forEach(function (consume) {
            consume(data)
        })
        if (_nextEvent) {
            _nextEvent.resolve(data)
            nextEvent = _nextEvent = null
        }
    }

    Object.defineProperty(eventuate, "hasConsumer", {
        get: function eventuateHasConsumer () {
            return !!(nextEvent || consumers.length)
        }
    })

    return eventuate
}
